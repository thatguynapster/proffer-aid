import type { Payload } from 'payload'

export const FORM_TYPES = ['volunteer', 'membership', 'partnership'] as const
export type FormType = (typeof FORM_TYPES)[number]

export type FieldDef = {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea'
  required?: boolean
  autoComplete?: string
  help?: string
  maxLength: number
}

const NAME: FieldDef = {
  name: 'name',
  label: 'Full name',
  type: 'text',
  required: true,
  autoComplete: 'name',
  maxLength: 120,
}
const EMAIL: FieldDef = {
  name: 'email',
  label: 'Email address',
  type: 'email',
  required: true,
  autoComplete: 'email',
  maxLength: 200,
}
const PHONE: FieldDef = {
  name: 'phone',
  label: 'Phone number',
  type: 'tel',
  autoComplete: 'tel',
  help: 'Optional. Include the country code.',
  maxLength: 40,
}

/** Field definitions drive both the rendered form and server-side validation,
 *  so the two cannot drift apart. */
export const FORM_FIELDS: Record<FormType, FieldDef[]> = {
  volunteer: [
    NAME,
    EMAIL,
    PHONE,
    {
      name: 'availability',
      label: 'Availability',
      type: 'text',
      required: true,
      help: 'When are you free, and for how long?',
      maxLength: 200,
    },
    {
      name: 'areaOfInterest',
      label: 'Area of interest',
      type: 'text',
      required: true,
      help: 'e.g. medical outreach, health education, logistics',
      maxLength: 200,
    },
    {
      name: 'message',
      label: 'Why would you like to volunteer?',
      type: 'textarea',
      required: true,
      maxLength: 2000,
    },
  ],
  membership: [
    NAME,
    EMAIL,
    PHONE,
    {
      name: 'occupation',
      label: 'Occupation or profession',
      type: 'text',
      required: true,
      help: 'A medical background is welcome but not required.',
      maxLength: 200,
    },
    {
      name: 'message',
      label: 'Why would you like to join?',
      type: 'textarea',
      required: true,
      maxLength: 2000,
    },
  ],
  partnership: [
    { ...NAME, label: 'Your name' },
    {
      name: 'organization',
      label: 'Organisation',
      type: 'text',
      required: true,
      autoComplete: 'organization',
      maxLength: 200,
    },
    EMAIL,
    PHONE,
    {
      name: 'partnershipType',
      label: 'Type of partnership',
      type: 'text',
      required: true,
      help: 'e.g. medical supplies, funding, joint outreach',
      maxLength: 200,
    },
    {
      name: 'message',
      label: 'Tell us about the collaboration',
      type: 'textarea',
      required: true,
      maxLength: 2000,
    },
  ],
}

export const FORM_LABELS: Record<FormType, { title: string; blurb: string }> = {
  volunteer: {
    title: 'Volunteer',
    blurb:
      'Join a project as a resource person — doctor, nurse, pharmacist, driver, technician or manager. Volunteers give their expertise free of charge.',
  },
  membership: {
    title: 'Become a member',
    blurb:
      'Open to anyone with a genuine interest in community health, with or without a medical background. Minors from 14 may join with guardian consent.',
  },
  partnership: {
    title: 'Partner with us',
    blurb:
      'We work with pharmaceutical companies, medical institutions, regulatory bodies, government and NGOs.',
  },
}

export function isFormType(value: unknown): value is FormType {
  return typeof value === 'string' && (FORM_TYPES as readonly string[]).includes(value)
}

/** Deliberately permissive — the goal is catching typos, not enforcing RFC 5322.
 *  Over-strict email regexes reject valid addresses and lose real enquiries. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export type ValidationResult =
  | { ok: true; data: Record<string, string> }
  | { ok: false; errors: Record<string, string> }

export function validateSubmission(formType: FormType, raw: FormData): ValidationResult {
  const errors: Record<string, string> = {}
  const data: Record<string, string> = {}

  for (const field of FORM_FIELDS[formType]) {
    const value = String(raw.get(field.name) ?? '').trim()

    if (!value) {
      if (field.required) errors[field.name] = `${field.label} is required.`
      continue
    }

    if (value.length > field.maxLength) {
      errors[field.name] = `${field.label} must be ${field.maxLength} characters or fewer.`
      continue
    }

    if (field.type === 'email' && !EMAIL_PATTERN.test(value)) {
      errors[field.name] = 'Enter a valid email address.'
      continue
    }

    // Only fields declared for this form type are carried through, so nothing
    // extra can be smuggled into the document by posting unexpected keys.
    data[field.name] = value
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, data }
}

// --- Rate limiting ---------------------------------------------------------

/**
 * In-memory sliding window, keyed by client IP.
 *
 * LIMITATION, deliberately accepted for v1: on Vercel each serverless instance
 * has its own memory, so this is per-instance rather than global. It stops
 * naive floods from a single client but is not a real distributed rate limit —
 * that needs Redis or Upstash. PRD §11 asks for "basic rate limiting"; if
 * abuse becomes real, this is the thing to replace.
 */
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

export function rateLimit(key: string): { allowed: boolean; retryAfterMinutes: number } {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)

  if (recent.length >= MAX_PER_WINDOW) {
    const oldest = Math.min(...recent)
    return {
      allowed: false,
      retryAfterMinutes: Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 60000)),
    }
  }

  recent.push(now)
  hits.set(key, recent)

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k)
    }
  }

  return { allowed: true, retryAfterMinutes: 0 }
}

/** Writes the submission. Collection `create` access is `isNobody`, so this is
 *  the only path in — after validation, honeypot and rate limiting. */
export async function createSubmission(
  payload: Payload,
  formType: FormType,
  data: Record<string, string>,
): Promise<void> {
  await payload.create({
    collection: 'form-submissions',
    data: { formType, ...data } as never,
    overrideAccess: true,
  })
}
