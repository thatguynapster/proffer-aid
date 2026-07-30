'use server'

import { headers } from 'next/headers'

import { getCms } from '../../../lib/cms'
import type { FormState } from '../../../lib/form-state'
import { createSubmission, isFormType, rateLimit, validateSubmission } from '../../../lib/forms'

// This module is `'use server'`, so it may export async functions and nothing
// else. FormState and initialFormState live in lib/form-state.ts for that
// reason — moving them back here breaks the build.

async function clientKey(): Promise<string> {
  const h = await headers()
  // Vercel sets x-forwarded-for; the first entry is the client. Falls back to a
  // shared bucket locally, which only makes the limit stricter.
  const forwarded = h.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
}

export async function submitEnquiry(_previous: FormState, formData: FormData): Promise<FormState> {
  const formType = formData.get('formType')

  if (!isFormType(formType)) {
    return { status: 'error', message: 'Unrecognised form. Please reload the page and try again.' }
  }

  // Honeypot: a field hidden from people but filled in by naive bots. Reports
  // success rather than rejecting — telling a bot it was detected only invites
  // it to adapt.
  if (String(formData.get('website') ?? '').length > 0) {
    return { status: 'success', message: 'Thank you — we have received your enquiry.' }
  }

  const limit = rateLimit(await clientKey())
  if (!limit.allowed) {
    return {
      status: 'error',
      message: `Too many submissions. Please try again in about ${limit.retryAfterMinutes} minute${
        limit.retryAfterMinutes === 1 ? '' : 's'
      }.`,
    }
  }

  const result = validateSubmission(formType, formData)

  if (!result.ok) {
    // Preserve what was typed so a validation failure without JS doesn't clear
    // a long message field.
    const values: Record<string, string> = {}
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string' && key !== 'formType') values[key] = value
    }
    return {
      status: 'error',
      message: 'Please check the highlighted fields.',
      errors: result.errors,
      values,
    }
  }

  try {
    const payload = await getCms()
    await createSubmission(payload, formType, result.data)
  } catch (error) {
    console.error('Form submission failed', error)
    return {
      status: 'error',
      message: 'Something went wrong saving your enquiry. Please try again, or email us directly.',
    }
  }

  // The email notification fires from the collection's afterChange hook and is
  // deliberately not awaited — the record is already saved, which is the whole
  // point of storing submissions rather than relying on email alone.
  return {
    status: 'success',
    message: 'Thank you — we have received your enquiry and will be in touch.',
  }
}
