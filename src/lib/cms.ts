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
    if (variant && typeof variant.url === 'string') return toSameOriginPath(variant.url)
  }
  return typeof doc.url === 'string' ? toSameOriginPath(doc.url) : null
}

/**
 * Payload returns absolute URLs because `serverURL` is configured, and
 * `next/image` rejects any absolute URL whose hostname is not listed in
 * `images.remotePatterns`. Media served through Payload's own route is
 * same-origin, so it is reduced to a path — which needs no remotePatterns
 * entry and stays correct across local, preview and production without any
 * per-environment configuration.
 *
 * URLs on a different host are left absolute: if the S3 adapter is ever
 * switched to `disablePayloadAccessControl`, media comes straight from the
 * bucket or CDN and must keep its origin (covered by NEXT_PUBLIC_S3_PUBLIC_URL
 * in next.config.mjs).
 */
function toSameOriginPath(url: string): string {
  if (!/^https?:\/\//i.test(url)) return url

  try {
    const parsed = new URL(url)
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
    if (serverUrl && new URL(serverUrl).host !== parsed.host) return url
    return `${parsed.pathname}${parsed.search}`
  } catch {
    return url
  }
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
