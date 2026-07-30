import { cache } from 'react'

import type { Campaign } from '../payload-types'
import { getCms } from './cms'

/**
 * `raisedAmount` is a virtual field populated by the Campaigns `afterRead`
 * hook, which sums successful live-mode donations. It is never stored, and
 * nothing may write it — see the note in the collection.
 */
export function raisedPesewas(campaign: Campaign): number {
  const value = (campaign as { raisedAmount?: number | null }).raisedAmount
  return typeof value === 'number' ? value : 0
}

/** Goals are authored in whole cedis; donations are stored in pesewas. */
export function goalPesewas(campaign: Campaign): number {
  return (campaign.goalAmount ?? 0) * 100
}

export function progressPercent(campaign: Campaign): number {
  const goal = goalPesewas(campaign)
  if (goal <= 0) return 0
  // Clamped: a campaign that overshoots should read as complete, not render a
  // bar overflowing its container.
  return Math.min(100, Math.round((raisedPesewas(campaign) / goal) * 100))
}

export const listCampaigns = cache(async (): Promise<Campaign[]> => {
  try {
    const payload = await getCms()
    const result = await payload.find({
      collection: 'campaigns',
      where: { _status: { equals: 'published' } },
      // Active campaigns first, then most recently updated.
      sort: ['status', '-updatedAt'],
      limit: 50,
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
})

export const getCampaign = cache(async (slug: string): Promise<Campaign | null> => {
  try {
    const payload = await getCms()
    const result = await payload.find({
      collection: 'campaigns',
      where: {
        and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
      },
      limit: 1,
      depth: 2,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
})

export const getCampaignById = cache(async (id: string): Promise<Campaign | null> => {
  try {
    const payload = await getCms()
    return (await payload.findByID({ collection: 'campaigns', id, depth: 1 })) as Campaign
  } catch {
    return null
  }
})
