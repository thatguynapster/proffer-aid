import type { Payload } from 'payload'

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

/** Amounts are stored in the smallest currency unit (pesewas), matching what
 *  Paystack sends. Convert only at the display boundary. */
export const pesewasToCedis = (pesewas: number): number => pesewas / 100

export const formatGhs = (pesewas: number): string =>
  new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 0,
  }).format(pesewasToCedis(pesewas))
