import { cache } from 'react'
import { notFound } from 'next/navigation'

import type { Page } from '../payload-types'
import { getCms } from './cms'

/**
 * Fetch a CMS page by slug.
 *
 * Returns null rather than throwing when the database is unreachable, so a
 * transient outage renders a 404 instead of a 500 — and so callers can
 * distinguish "no such page" from "cannot reach the CMS" if they need to.
 *
 * Only published pages are returned. The privacy policy is deliberately seeded
 * as a draft (it makes binding legal representations and must be written, not
 * generated), so it will 404 until someone publishes it.
 */
export const getPage = cache(async (slug: string): Promise<Page | null> => {
  try {
    const payload = await getCms()
    const result = await payload.find({
      collection: 'pages',
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

/** Fetch a page or render the 404 route. */
export async function getPageOr404(slug: string): Promise<Page> {
  const page = await getPage(slug)
  if (!page) notFound()
  return page
}

/** Metadata derived from a page's own SEO group, falling back to its content. */
export function pageMetadata(page: Page | null, fallbackTitle: string) {
  if (!page) return { title: fallbackTitle }
  return {
    title: page.seo?.title || page.title || fallbackTitle,
    description: page.seo?.description || page.hero?.subtitle || undefined,
  }
}
