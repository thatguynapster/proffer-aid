import crypto from 'crypto'

/**
 * Paystack integration.
 *
 * Everything account-specific comes from env vars so cutting over from the
 * build-time test account to PAIF's live account is a swap of values plus
 * registering the production webhook URL — no code change (PRD §8).
 */

export const PAYSTACK_BASE = 'https://api.paystack.co'

/** Suggested amounts in pesewas (GHS × 100). Paystack works in the smallest
 *  unit, so amounts are held that way end to end and converted only for
 *  display — no float arithmetic on money. */
export const AMOUNT_TIERS_PESEWAS = [2000, 5000, 10000, 20000, 50000, 100000]

export const MIN_AMOUNT_PESEWAS = 100 // GHS 1
export const MAX_AMOUNT_PESEWAS = 5_000_000 // GHS 50,000

export function paystackMode(): 'live' | 'test' {
  return process.env.PAYSTACK_MODE === 'live' ? 'live' : 'test'
}

export function isPaystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY && process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY)
}

/**
 * Verify a webhook signature.
 *
 * Paystack signs the payload with HMAC-SHA512 using the SECRET key and sends it
 * as `x-paystack-signature`. This MUST run against the raw request body: a
 * route handler that parses JSON first and re-stringifies will produce
 * different bytes and never match.
 *
 * An unverified webhook endpoint is a public "mark this donation paid" button,
 * so this is the security boundary for the whole donation flow.
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret || !signature) return false

  const expected = crypto.createHmac('sha512', secret).update(rawBody, 'utf8').digest('hex')

  // Constant-time comparison; lengths must match or timingSafeEqual throws.
  const a = Buffer.from(expected, 'utf8')
  const b = Buffer.from(signature, 'utf8')
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

/** Processing fee for the optional "cover the fee" checkbox. Rounded up so the
 *  charity is never left marginally short. */
export function calculateFeePesewas(
  amountPesewas: number,
  feePercent: number,
  feeCapPesewas: number,
): number {
  const fee = Math.ceil((amountPesewas * feePercent) / 100)
  return feeCapPesewas > 0 ? Math.min(fee, feeCapPesewas) : fee
}

export const pesewasToCedis = (pesewas: number): number => pesewas / 100

export function formatGhs(pesewas: number, opts: { decimals?: boolean } = {}): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: opts.decimals ? 2 : 0,
    maximumFractionDigits: opts.decimals ? 2 : 0,
  }).format(pesewasToCedis(pesewas))
}

export type InitializeArgs = {
  email: string
  amountPesewas: number
  callbackUrl: string
  campaignId?: string
  donorName?: string
  coveredFee?: boolean
}

export type InitializeResult =
  | { ok: true; authorizationUrl: string; reference: string }
  | { ok: false; error: string }

/** Create a transaction and get the hosted checkout URL. */
export async function initializeTransaction(args: InitializeArgs): Promise<InitializeResult> {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) return { ok: false, error: 'Payments are not configured.' }

  try {
    const response = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: args.email,
        amount: args.amountPesewas,
        currency: 'GHS',
        callback_url: args.callbackUrl,
        // Campaign attribution travels as metadata so the webhook can credit
        // the right progress bar without trusting anything from the browser.
        metadata: {
          campaignId: args.campaignId ?? null,
          donorName: args.donorName ?? null,
          coveredFee: Boolean(args.coveredFee),
        },
      }),
      cache: 'no-store',
    })

    const body = (await response.json()) as {
      status?: boolean
      message?: string
      data?: { authorization_url?: string; reference?: string }
    }

    if (!response.ok || !body.status || !body.data?.authorization_url || !body.data?.reference) {
      return { ok: false, error: body.message || 'Could not start the payment.' }
    }

    return {
      ok: true,
      authorizationUrl: body.data.authorization_url,
      reference: body.data.reference,
    }
  } catch {
    return { ok: false, error: 'Could not reach the payment provider. Please try again.' }
  }
}

export type VerifiedTransaction = {
  reference: string
  amountPesewas: number
  currency: string
  status: 'success' | 'failed' | 'pending'
  paidAt: string | null
  campaignId: string | null
  donorName: string | null
  donorEmail: string | null
}

/**
 * Server-side verification against Paystack's API.
 *
 * Used on the callback return, because the browser redirect proves nothing —
 * anyone can navigate to the success URL. Payment state only ever comes from
 * here or from a verified webhook.
 */
export async function verifyTransaction(reference: string): Promise<VerifiedTransaction | null> {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) return null

  try {
    const response = await fetch(
      `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secret}` }, cache: 'no-store' },
    )
    const body = (await response.json()) as { status?: boolean; data?: Record<string, unknown> }
    if (!response.ok || !body.status || !body.data) return null

    return normalizeTransaction(body.data)
  } catch {
    return null
  }
}

/** Shape a Paystack transaction object — from either verify or a webhook — into
 *  the fields the Donations collection stores. */
export function normalizeTransaction(data: Record<string, unknown>): VerifiedTransaction {
  const metadata = (data.metadata ?? {}) as Record<string, unknown>
  const customer = (data.customer ?? {}) as Record<string, unknown>
  const rawStatus = String(data.status ?? '')

  return {
    reference: String(data.reference ?? ''),
    amountPesewas: typeof data.amount === 'number' ? data.amount : 0,
    currency: String(data.currency ?? 'GHS'),
    status: rawStatus === 'success' ? 'success' : rawStatus === 'failed' ? 'failed' : 'pending',
    paidAt:
      typeof data.paid_at === 'string'
        ? data.paid_at
        : typeof data.paidAt === 'string'
          ? data.paidAt
          : null,
    campaignId: typeof metadata.campaignId === 'string' ? metadata.campaignId : null,
    donorName:
      typeof metadata.donorName === 'string'
        ? metadata.donorName
        : typeof customer.first_name === 'string'
          ? customer.first_name
          : null,
    donorEmail: typeof customer.email === 'string' ? customer.email : null,
  }
}
