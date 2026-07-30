'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { initialFormState, type FormState } from '../../lib/form-state'
import { FORM_FIELDS, FORM_LABELS, type FieldDef, type FormType } from '../../lib/forms'
import { submitEnquiry } from '../../app/(frontend)/get-involved/actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-pill bg-gold-500 px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-navy-600 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Sending…' : 'Send enquiry'}
    </button>
  )
}

function Field({ field, state }: { field: FieldDef; state: FormState }) {
  const error = state.errors?.[field.name]
  const defaultValue = state.values?.[field.name] ?? ''
  const describedBy = [error ? `${field.name}-error` : null, field.help ? `${field.name}-help` : null]
    .filter(Boolean)
    .join(' ')

  const base = `w-full rounded-2xl border bg-paper px-4 py-3 text-sm text-navy-600 placeholder:text-navy-600/35 focus:outline-none focus:ring-2 focus:ring-navy-600/30 ${
    error ? 'border-red-600' : 'border-navy-600/20'
  }`

  return (
    <div>
      <label htmlFor={field.name} className="block text-sm font-semibold text-navy-600">
        {field.label}
        {field.required ? (
          <span className="text-ochre" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="ml-1.5 text-xs font-normal text-navy-600/50">(optional)</span>
        )}
      </label>

      {field.help ? (
        <p id={`${field.name}-help`} className="mt-1 text-xs text-navy-600/55">
          {field.help}
        </p>
      ) : null}

      {field.type === 'textarea' ? (
        <textarea
          id={field.name}
          name={field.name}
          rows={5}
          required={field.required}
          maxLength={field.maxLength}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={`mt-2 ${base}`}
        />
      ) : (
        <input
          id={field.name}
          name={field.name}
          type={field.type}
          required={field.required}
          maxLength={field.maxLength}
          autoComplete={field.autoComplete}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={`mt-2 ${base}`}
        />
      )}

      {error ? (
        <p id={`${field.name}-error`} className="mt-1.5 text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/**
 * Uses a server action rather than a fetch handler, so the form submits
 * natively when JavaScript is unavailable or still loading — which matters for
 * the bandwidth-constrained mobile traffic this site is built for. With JS the
 * same action gives inline errors and a pending state.
 */
export function EnquiryForm({ formType }: { formType: FormType }) {
  const [state, formAction] = useActionState(submitEnquiry, initialFormState)
  const meta = FORM_LABELS[formType]

  if (state.status === 'success') {
    return (
      <div
        role="status"
        className="rounded-card border border-gold-500 bg-gold-500/10 p-8 text-center"
      >
        <p className="font-display text-2xl text-navy-600">Enquiry received</p>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-navy-600/75">
          {state.message}
        </p>
      </div>
    )
  }

  // Native validation is deliberately left ON (no `noValidate`). The browser
  // blocks an empty or malformed submit instantly and for free, which avoids a
  // pointless round-trip and is the behaviour people expect. Server-side
  // validation in the action remains the actual security boundary — client
  // checks are a convenience and are trivially bypassed.
  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="formType" value={formType} />

      {/* Honeypot. Hidden from people, tempting to naive bots. Not display:none
          — some bots skip those; this is off-screen but still fillable. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <p className="text-sm leading-relaxed text-navy-600/70">{meta.blurb}</p>

      {state.status === 'error' && state.message ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.message}
        </div>
      ) : null}

      {FORM_FIELDS[formType].map((field) => (
        <Field key={field.name} field={field} state={state} />
      ))}

      <p className="text-xs leading-relaxed text-navy-600/55">
        We use your details only to respond to this enquiry. See our{' '}
        <a href="/privacy" className="text-ochre underline underline-offset-2">
          privacy policy
        </a>
        .
      </p>

      <SubmitButton />
    </form>
  )
}
