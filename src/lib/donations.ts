import { revalidatePath } from 'next/cache'
import type { Payload } from 'payload'

import { paystackMode, type VerifiedTransaction } from './paystack'

/**
 * Campaign progress is DERIVED, never stored (PRD §6, §8).
 *
 * Nobody types a running total into a field anywhere in this system. A
 * hand-maintained total drifts silently — a missed update, a transposed digit,
 * a double-counted transfer — and a public fundraising figure is the wrong
 * place for that class of error. Summing the records means the number is
 * either right or obviously broken, never quietly wrong.
 *
 * Only `success` + `live` donations count. Pending, failed, and test-mode
 * transactions are excluded unconditionally: during the soft-launch window
 * production may still be running test Paystack keys (PRD §10), and test
 * traffic must never inflate a public total.
 */
export async function sumRaisedForCampaign(
  payload: Payload,
  campaignId: string,
): Promise<number> {
  const { docs } = await payload.find({
    collection: 'donations',
    where: {
      and: [
        { campaign: { equals: campaignId } },
        { status: { equals: 'success' } },
        { mode: { equals: 'live' } },
      ],
    },
    pagination: false,
    depth: 0,
    select: { amount: true },
    overrideAccess: true,
  })

  return docs.reduce((total, doc) => total + (typeof doc.amount === 'number' ? doc.amount : 0), 0)
}

/**
 * Record a Paystack transaction, idempotently.
 *
 * Paystack retries webhooks and the callback can also land, so the same
 * reference will arrive more than once. `reference` is unique on the
 * collection, but relying on the unique index to throw would make normal
 * duplicate delivery look like an error — so an existing record is updated in
 * place instead, and only when its status has actually changed.
 *
 * Returns the action taken, which the webhook logs and the tests assert on.
 */
export async function recordTransaction(
  payload: Payload,
  tx: VerifiedTransaction,
): Promise<'created' | 'updated' | 'unchanged'> {
  if (!tx.reference) return 'unchanged'

  const existing = await payload.find({
    collection: 'donations',
    where: { reference: { equals: tx.reference } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const data = {
    reference: tx.reference,
    amount: tx.amountPesewas,
    currency: tx.currency,
    status: tx.status,
    // Mode comes from our own configuration, never from the payload — a
    // forged event must not be able to declare itself live and inflate a
    // public total.
    mode: paystackMode(),
    source: 'paystack' as const,
    ...(tx.campaignId ? { campaign: tx.campaignId } : {}),
    ...(tx.paidAt ? { paidAt: tx.paidAt } : {}),
    ...(tx.donorName ? { donorName: tx.donorName } : {}),
    ...(tx.donorEmail ? { donorEmail: tx.donorEmail } : {}),
  }

  let action: 'created' | 'updated' | 'unchanged'

  if (existing.totalDocs > 0) {
    const doc = existing.docs[0]
    if (doc.status === tx.status) {
      action = 'unchanged'
    } else {
      await payload.update({
        collection: 'donations',
        id: doc.id,
        data: data as never,
        overrideAccess: true,
      })
      action = 'updated'
    }
  } else {
    await payload.create({ collection: 'donations', data: data as never, overrideAccess: true })
    action = 'created'
  }

  // Campaign pages are statically generated, so without this a new donation
  // would not move the progress bar until the next revalidation window.
  if (action !== 'unchanged' && tx.campaignId) {
    try {
      const campaign = await payload.findByID({
        collection: 'campaigns',
        id: tx.campaignId,
        depth: 0,
        overrideAccess: true,
      })
      if (campaign?.slug) revalidatePath(`/campaigns/${campaign.slug}`)
      revalidatePath('/')
    } catch {
      // A donation attributed to a deleted campaign should still be recorded.
    }
  }

  return action
}

/** Amounts are stored in the smallest currency unit (pesewas), matching what
 *  Paystack sends. Convert only at the display boundary. */
export const pesewasToCedis = (pesewas: number): number => pesewas / 100

export const formatGhs = (pesewas: number): string =>
  new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 0,
  }).format(pesewasToCedis(pesewas))
