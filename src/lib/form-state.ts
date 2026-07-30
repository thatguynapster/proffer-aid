/**
 * Form state shared between the server action and the client form.
 *
 * Deliberately NOT in actions.ts: a `'use server'` module may only export async
 * functions, so exporting this type and the initial-state object from there
 * fails the build with `A "use server" file can only export async functions,
 * found object.`
 */
export type FormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Record<string, string>
  /** Echoed back so a failed submit doesn't wipe what was typed when JS is off. */
  values?: Record<string, string>
}

export const initialFormState: FormState = { status: 'idle' }
