'use server'

import { redirect } from 'next/navigation'

import { donationsEnabled, getSettings } from '../../../lib/cms'
import type { DonateState } from '../../../lib/donate-state'
import {
  MAX_AMOUNT_PESEWAS,
  MIN_AMOUNT_PESEWAS,
  calculateFeePesewas,
  formatGhs,
  initializeTransaction,
  isPaystackConfigured,
} from '../../../lib/paystack'
import { SITE_URL } from '../../../lib/site-url'

// `'use server'` — async functions only. DonateState lives in
// lib/donate-state.ts for that reason.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function startDonation(
  _previous: DonateState,
  formData: FormData,
): Promise<DonateState> {
  // Re-checked server-side: the page hiding the form is a UI concern, this is
  // the actual gate. Someone could POST to this action directly.
  if (!(await donationsEnabled())) {
    return { status: 'error', message: 'Donations are not currently open.' }
  }

  if (!isPaystackConfigured()) {
    return {
      status: 'error',
      message: 'Payments are not configured yet. Please contact us to donate directly.',
    }
  }

  const email = String(formData.get('email') ?? '').trim()
  const donorName = String(formData.get('donorName') ?? '').trim()
  const campaignId = String(formData.get('campaignId') ?? '').trim()
  const coverFee = String(formData.get('coverFee') ?? '') === 'on'

  if (!EMAIL_PATTERN.test(email)) {
    return { status: 'error', message: 'Enter a valid email address so we can send a receipt.' }
  }

  // The preset tiers post `amount`; the custom field posts cedis, which are
  // converted here. All money is handled in pesewas from this point on — no
  // float arithmetic on currency.
  const preset = Number(formData.get('amount') ?? 0)
  const customCedis = Number(formData.get('customAmount') ?? 0)
  let amountPesewas = Number.isFinite(preset) && preset > 0 ? Math.round(preset) : 0

  if (!amountPesewas && Number.isFinite(customCedis) && customCedis > 0) {
    amountPesewas = Math.round(customCedis * 100)
  }

  if (!amountPesewas || amountPesewas < MIN_AMOUNT_PESEWAS) {
    return { status: 'error', message: `The minimum donation is ${formatGhs(MIN_AMOUNT_PESEWAS)}.` }
  }
  if (amountPesewas > MAX_AMOUNT_PESEWAS) {
    return {
      status: 'error',
      message: `For donations above ${formatGhs(MAX_AMOUNT_PESEWAS)}, please contact us directly.`,
    }
  }

  if (coverFee) {
    const settings = await getSettings()
    amountPesewas += calculateFeePesewas(
      amountPesewas,
      settings?.feePercent ?? 1.95,
      settings?.feeCapPesewas ?? 10000,
    )
  }

  const result = await initializeTransaction({
    email,
    amountPesewas,
    donorName: donorName || undefined,
    campaignId: campaignId || undefined,
    coveredFee: coverFee,
    callbackUrl: `${SITE_URL}/donate/complete`,
  })

  if (!result.ok) {
    return { status: 'error', message: result.error }
  }

  // Outside the try/catch above by design: redirect() throws a control-flow
  // signal that must not be swallowed.
  redirect(result.authorizationUrl)
}
