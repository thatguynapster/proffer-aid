import type { MetadataRoute } from 'next'

import { IS_INDEXABLE, SITE_URL as BASE } from '../lib/site-url'

export default function robots(): MetadataRoute.Robots {
  // Anything that is not the canonical production origin — preview builds,
  // staging, a deploy that forgot to set NEXT_PUBLIC_SERVER_URL — refuses all
  // crawlers and advertises no sitemap. See IS_INDEXABLE for why this fails
  // closed rather than open.
  if (!IS_INDEXABLE) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin', // Payload admin panel
          '/api/', // Payload REST + GraphQL
          '/webhooks/', // Paystack
          '/donate/complete', // Per-transaction confirmations; nothing to index
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
