/**
 * Shared between the donate server action and the client form.
 *
 * Not in actions.ts: a `'use server'` module may only export async functions.
 * Same constraint as lib/form-state.ts.
 */
export type DonateState = {
  status: 'idle' | 'error'
  message?: string
}

export const initialDonateState: DonateState = { status: 'idle' }
