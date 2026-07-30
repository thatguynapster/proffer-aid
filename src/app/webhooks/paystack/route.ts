import { NextResponse } from 'next/server'

import { getCms } from '../../../lib/cms'
import { recordTransaction } from '../../../lib/donations'
import { normalizeTransaction, verifyWebhookSignature } from '../../../lib/paystack'

/**
 * Paystack webhook.
 *
 * Deliberately at /webhooks/paystack rather than under /api — Payload owns
 * /api/* via a catch-all route, and adding a sibling there invites a routing
 * conflict.
 *
 * This is the only trustworthy source of payment state. The browser redirect
 * after checkout is a UX signal that anyone can fabricate by visiting the
 * success URL.
 */

// Signature verification needs the exact bytes Paystack signed, so this route
// must never be statically optimised or have its body pre-parsed.
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  // Raw body FIRST. Parsing to JSON and re-stringifying produces different
  // bytes — key order, whitespace, unicode escaping — and the HMAC will never
  // match.
  const rawBody = await request.text()
  const signature = request.headers.get('x-paystack-signature')

  if (!verifyWebhookSignature(rawBody, signature)) {
    // No detail in the response: a probe should learn nothing about why it
    // failed.
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: { event?: string; data?: Record<string, unknown> }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Malformed payload' }, { status: 400 })
  }

  // Acknowledge anything we don't handle with a 200. Returning an error makes
  // Paystack retry an event we are never going to act on.
  if (!event.data || typeof event.event !== 'string') {
    return NextResponse.json({ received: true })
  }

  const handled = ['charge.success', 'charge.failed']
  if (!handled.includes(event.event)) {
    return NextResponse.json({ received: true, ignored: event.event })
  }

  try {
    const payload = await getCms()
    const tx = normalizeTransaction(event.data)

    if (!tx.reference) {
      return NextResponse.json({ received: true, ignored: 'missing reference' })
    }

    const action = await recordTransaction(payload, tx)
    payload.logger.info(`Paystack ${event.event} ${tx.reference}: ${action}`)

    return NextResponse.json({ received: true, action })
  } catch (error) {
    console.error('Paystack webhook failed', error)
    // A 500 tells Paystack to retry, which is what we want if our own storage
    // was briefly unavailable.
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}

/** Paystack only POSTs. A GET is someone poking at the URL. */
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
