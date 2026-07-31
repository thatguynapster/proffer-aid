import type { MetadataRoute } from 'next'

import { getCms, donationsEnabled } from '../lib/cms'
import { SITE_URL as BASE } from '../lib/site-url'

export const revalidate = 3600

/**
 * Sitemap.
 *
 * Built from the CMS rather than a hardcoded list, so publishing an update or a
 * campaign puts it in the sitemap without a deploy.
 *
 * `/donate` is included ONLY while donations are switched on. It 404s
 * otherwise, and submitting a URL that 404s is how you teach a crawler to
 * distrust the sitemap. `/privacy` is included only once the draft is
 * published, for the same reason.
 *
 * This matters more than usual here: the old `.org` domain is gone, so there is
 * no legacy authority to inherit and no redirects to preserve it — the `.com`
 * is starting from zero.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const entries: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/what-we-do`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/updates`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/campaigns`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/get-involved`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
  ]

  if (await donationsEnabled()) {
    entries.push({
      url: `${BASE}/donate`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    })
  }

  try {
    const payload = await getCms()

    const [updates, campaigns, pages] = await Promise.all([
      payload.find({
        collection: 'updates',
        where: { _status: { equals: 'published' } },
        limit: 500,
        depth: 0,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: 'campaigns',
        where: { _status: { equals: 'published' } },
        limit: 200,
        depth: 0,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: 'pages',
        where: {
          and: [{ _status: { equals: 'published' } }, { slug: { equals: 'privacy' } }],
        },
        limit: 1,
        depth: 0,
        select: { slug: true, updatedAt: true },
      }),
    ])

    for (const doc of updates.docs) {
      if (!doc.slug) continue
      entries.push({
        url: `${BASE}/updates/${doc.slug}`,
        lastModified: doc.updatedAt ? new Date(doc.updatedAt) : now,
        changeFrequency: 'yearly',
        priority: 0.6,
      })
    }

    for (const doc of campaigns.docs) {
      if (!doc.slug) continue
      entries.push({
        url: `${BASE}/campaigns/${doc.slug}`,
        lastModified: doc.updatedAt ? new Date(doc.updatedAt) : now,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }

    // Only once someone has actually written and published it.
    for (const doc of pages.docs) {
      entries.push({
        url: `${BASE}/privacy`,
        lastModified: doc.updatedAt ? new Date(doc.updatedAt) : now,
        changeFrequency: 'yearly',
        priority: 0.3,
      })
    }
  } catch {
    // A CMS blip should still yield a valid sitemap of the static routes rather
    // than a 500.
  }

  return entries
}
