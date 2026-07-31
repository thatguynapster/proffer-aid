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
export const CANONICAL_ORIGIN = 'https://www.profferaid.com'

const configured = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '')

export const SITE_URL = configured || CANONICAL_ORIGIN

/**
 * Whether this deployment is allowed to be indexed by search engines.
 *
 * Fails CLOSED, and the asymmetry is the whole point: a staging build that gets
 * indexed puts a duplicate of the site into Google under a URL nobody controls,
 * splits what little authority the new `.com` has, and is slow and awkward to
 * undo once crawled. A production build that is accidentally *not* indexed gets
 * noticed within a day and fixed in a minute. Given the choice, be invisible.
 *
 * So indexing requires `NEXT_PUBLIC_SERVER_URL` to be set, explicitly, to the
 * canonical production origin. Preview and staging deployments set it to their
 * own URL (they have to — it is also the Paystack callback origin) and are
 * therefore blocked automatically, with no extra variable to remember. A deploy
 * that forgets the variable entirely is blocked too, rather than inheriting the
 * production fallback above and looking live to a crawler.
 */
export const IS_INDEXABLE = configured === CANONICAL_ORIGIN
