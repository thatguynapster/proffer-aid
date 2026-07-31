/**
 * The site's own origin, with no trailing slash.
 *
 * Every absolute URL the site emits — sitemap entries, canonical and OG tags,
 * JSON-LD, the Paystack callback — has to agree on this. It was previously
 * inlined in five places with two different fallbacks (some localhost, some
 * production), which meant a missing env var produced a sitemap that was right
 * and OG tags that were wrong. That kind of inconsistency hides itself: each
 * file looks correct on its own.
 *
 * The fallback is the production origin rather than localhost, because the only
 * time it fires is a deploy that forgot to set the variable — and a live site
 * advertising `http://localhost:3000` in its canonical tags is far worse than a
 * local dev server advertising the real domain. Local development sets the
 * variable explicitly in `.env`, so the fallback never applies there.
 *
 * `www` is canonical; the apex redirects to it (see docs/build-plan.md §7).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.profferaid.com'
).replace(/\/$/, '')
