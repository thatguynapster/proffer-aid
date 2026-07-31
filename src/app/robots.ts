import type { MetadataRoute } from 'next'

import { SITE_URL as BASE } from '../lib/site-url'

export default function robots(): MetadataRoute.Robots {
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
