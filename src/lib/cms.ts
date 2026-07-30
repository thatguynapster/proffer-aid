import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@payload-config'
import type { Media, SiteSetting } from '../payload-types'

/** Deduplicated per request. */
export const getCms = cache(async () => getPayload({ config }))

export const getSettings = cache(async (): Promise<SiteSetting | null> => {
  try {
    const payload = await getCms()
    return (await payload.findGlobal({ slug: 'site-settings', depth: 1 })) as SiteSetting
  } catch {
    // The site must still render if the database is briefly unreachable —
    // callers fall back to sensible defaults rather than 500ing.
    return null
  }
})

/**
 * Resolve an upload field to a URL.
 *
 * With the bucket kept private, Payload serves media through its own route, so
 * this returns a same-origin path rather than an S3 URL. Handles both populated
 * documents and bare ids.
 */
export function mediaUrl(value: unknown, size?: 'thumbnail' | 'card' | 'hero'): string | null {
  if (!value || typeof value !== 'object') return null
  const doc = value as Media
  if (size && doc.sizes) {
    const variant = doc.sizes[size]
    if (variant && typeof variant.url === 'string') return variant.url
  }
  return typeof doc.url === 'string' ? doc.url : null
}

export function mediaAlt(value: unknown): string {
  if (!value || typeof value !== 'object') return ''
  const doc = value as Media
  return typeof doc.alt === 'string' ? doc.alt : ''
}

/** Donations stay entirely hidden unless an Admin has switched them on. */
export async function donationsEnabled(): Promise<boolean> {
  const settings = await getSettings()
  return settings?.donationsEnabled === true
}
