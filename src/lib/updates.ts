import { cache } from 'react'

import type { Update } from '../payload-types'
import { getCms } from './cms'

export const UPDATE_CATEGORIES = [
  { value: 'outreach', label: 'Outreach' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'campaign', label: 'Campaign' },
] as const

export type UpdateCategory = (typeof UPDATE_CATEGORIES)[number]['value']

export function categoryLabel(value: string): string {
  return UPDATE_CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export function formatUpdateDate(value?: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/**
 * An update that points at coverage hosted elsewhere links straight out to it
 * rather than to a thin local page that just says "read it over there".
 */
export function externalHref(update: Update): string | null {
  const url = update.externalSource?.url
  return typeof url === 'string' && url.length > 0 ? url : null
}

export function updateHref(update: Update): string {
  return externalHref(update) ?? `/updates/${update.slug}`
}

export const listUpdates = cache(
  async (options: { category?: string; limit?: number } = {}): Promise<Update[]> => {
    const { category, limit = 100 } = options

    try {
      const payload = await getCms()
      const result = await payload.find({
        collection: 'updates',
        where: {
          and: [
            { _status: { equals: 'published' } },
            ...(category ? [{ category: { equals: category } }] : []),
          ],
        },
        sort: '-date',
        limit,
        depth: 1,
      })
      return result.docs
    } catch {
      // The page renders its empty state rather than 500ing on a CMS blip.
      return []
    }
  },
)

export const getUpdate = cache(async (slug: string): Promise<Update | null> => {
  try {
    const payload = await getCms()
    const result = await payload.find({
      collection: 'updates',
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

/** Same category first, then anything else, excluding the current update. */
export const getRelatedUpdates = cache(
  async (current: Update, limit = 3): Promise<Update[]> => {
    const all = await listUpdates()
    const others = all.filter((u) => u.id !== current.id)
    const sameCategory = others.filter((u) => u.category === current.category)
    const rest = others.filter((u) => u.category !== current.category)
    return [...sameCategory, ...rest].slice(0, limit)
  },
)
