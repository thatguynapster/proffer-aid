# Build plan

Working checklist for the ProfferAid.com rebuild. Scope and rationale live in
[`profferaid-website-rebuild-prd.md`](profferaid-website-rebuild-prd.md);
recovered content is documented in [`salvaged-content.md`](salvaged-content.md).

**Last updated:** 2026-07-31

---

## Done

- [x] **Scaffold** — Payload 3.86, Next 16, React 19, Tailwind 4, MongoDB Atlas (`proffer-aid-dev`), S3 media, Resend wiring
- [x] **Collections** — Pages, Updates, Campaigns, TeamMembers, Testimonials, Media, FormSubmissions, Donations, Users, + SiteSettings global
- [x] **Access control** — five roles in `src/access/`, escalation guard and `active` check in `Users.ts`
- [x] **Seed** — `npm run seed` (salvaged content), `npm run seed:media` (re-upload to current storage adapter)
- [x] **Design system** — navy/gold/cream tokens, Anton + Inter self-hosted, Button, Container, SectionHeading, Eyebrow, PhotoSlot, WordmarkFill
- [x] **Layout** — Navbar (sticky, mobile panel), Footer (two offices), PageHero
- [x] **Homepage** — Hero (image-in-text wordmark), UpdateStrip, ImpactStats, PillarBand, StoriesRail (expanding), SupportBand
- [x] **RichText renderer** — Payload's Lexical converters, styled via `.richtext`
- [x] **Pages** — About (+ TeamGrid), What we do, Contact
- [x] **Updates** — listing with category filter, detail pages, related updates (see §1)
- [x] **Get involved** — FAQ accordion, three forms, server action with validation, honeypot and rate limiting (see §2)
- [x] **Privacy route + branded 404s** (see §3)
- [x] **Access-control tests** — 21 assertions, found and fixed a publish vulnerability (see §4)
- [x] **Donate + Paystack** — checkout, webhook, callback, 11 more tests (see §5)
- [x] **Campaigns** — listing, detail, derived progress bar, homepage highlight (see §6)
- [x] **SEO plumbing** — CMS-driven sitemap, robots, NGO JSON-LD, default OG image (see §7)

---

## 1. Updates listing + detail — ✅ done

- [x] `/updates` — listing, newest first, category filter
- [x] `/updates/[slug]` — detail page, `generateStaticParams`
- [x] External-source updates link out instead of to a detail page (`externalSource.url`)
- [x] `notFound()` for unpublished/missing slugs
- [x] Per-page metadata + OpenGraph from cover image
- [x] Related updates — same category first, then anything else

**Outcome:** all four detail pages prerender. Every previously dead link now
resolves — nav, homepage UpdateStrip, StoriesRail cards.

**Decisions made:**

- The category filter is plain links (`/updates?category=…`) rather than client
  state, so it works without JavaScript and each view is a shareable URL. This
  makes the listing dynamic rather than prerendered — an acceptable trade at
  this content volume.
- An unrecognised category falls back to the full list rather than rendering an
  empty state, so a typo'd query string doesn't look like missing content.
- No accordion on detail pages — declined, and the recovered updates are plain
  articles that would leave it empty.
- Cover images are all missing, so PhotoSlot placeholders show throughout.

---

## 2. Get involved + forms — ✅ done

- [x] `/get-involved` page rendering the seeded FAQ
- [x] FAQ accordion (driven off `h3` headings in the page body — no schema change)
- [x] Volunteer form — name, contact, availability, area of interest, motivation
- [x] Membership form — name, contact, occupation, reason for joining
- [x] Partnership form — organisation, contact, type, message
- [x] Server-side validation, honeypot, rate limiting, `overrideAccess` write
- [x] Resend notification via the existing `afterChange` hook
- [x] Success/error states, and a no-JS fallback path

**Verified** (9/9 assertions): valid payload accepted; missing and malformed
fields rejected; over-length rejected; undeclared fields stripped; rate limit
blocks after 5; write succeeds; **direct create without `overrideAccess`
rejected**; **unauthenticated read rejected**; record retrievable by admin.

**Decisions made:**

- **Server action, not a fetch API route** (a deviation from PRD §7's wording).
  React 19 form actions post natively when JavaScript is unavailable or still
  loading, which matters for the bandwidth-constrained traffic this site
  targets. With JS the same action gives inline errors and a pending state.
- **`FORM_FIELDS` drives both rendering and validation**, so the form and its
  server-side checks cannot drift apart. Only fields declared for that form type
  are carried through, so unexpected keys can't be smuggled into the document.
- **Honeypot returns success, not an error.** Telling a bot it was detected
  only invites it to adapt.
- **FAQ uses native `<details>`/`<summary>`** — works without JS, gets keyboard
  and screen-reader semantics from the platform, and find-in-page can open a
  closed section to reveal a match.
- **Form choice is a link** (`?form=membership`), matching the updates filter:
  shareable URLs, works without JS.
- Validation failures echo back submitted values so a long message isn't lost
  when JS is off.

**Known limitation:** rate limiting is an in-memory sliding window, so on
Vercel it is per-instance rather than global. It stops naive floods but is not a
real distributed limit — that needs Redis/Upstash. PRD §11 asks only for "basic
rate limiting"; this is the thing to replace if abuse becomes real.

**Not yet exercised:** the Resend notification path. `RESEND_API_KEY` is unset,
so Payload logs email to console instead of sending. Needs a live check once
the domain is verified.

**Bugs found after the unit checks passed** — both invisible to verification
that exercised the validation functions directly without loading the page:

- A `'use server'` module may only export async functions; `actions.ts` was also
  exporting `initialFormState` and the `FormState` type. Moved to
  `lib/form-state.ts` — they cannot move back.
- `noValidate` on the form had disabled the browser's `required` and
  `type="email"` enforcement, so empty forms submitted. Native validation is now
  on; server-side validation remains the security boundary.

**Lesson for the donation work:** drive the real flow, not just the functions
behind it. Unit-level checks passed while the feature was broken.

---

## 3. Privacy route — ✅ done

- [x] `/privacy` route exists and 404s until the draft is published
- [x] Branded 404 for `notFound()` inside the frontend group
- [x] `global-not-found.tsx` for URLs matching no route at all

**Notes:** the page is seeded as an **unpublished draft** on purpose — it makes
binding legal representations about personal data and must be written, not
generated. Publishing it in the CMS makes it live with no deploy.

**Gotcha found:** `not-found.tsx` inside a route group only covers paths *within*
that group. With `(frontend)` and `(payload)` both being groups there is no root
layout, so a URL matching nothing had no layout and fell back to Next's default
404. Fixed with `src/app/global-not-found.tsx`, which must be fully
self-contained — its own `html`, `body`, fonts and styles.

---

## 4. Access-control tests — ✅ done

`npm test` — 21 assertions, vitest, running against a real Payload instance and
database. Mocking the access layer would only prove the mock behaves.

- [x] Lead Editor cannot assign `admin` or `leadEditor`
- [x] Lead Editor cannot reach an Admin's account
- [x] Lead Editor *can* assign an allowed role (positive control)
- [x] Contributor cannot change their own role
- [x] Contributor cannot publish, cannot create pre-published, cannot edit others' drafts
- [x] Editor and Lead Editor cannot write SiteSettings
- [x] `FormSubmissions` not creatable or readable anonymously, not readable by Editor
- [x] `Donations` unreadable below Lead Editor; readable by Lead Editor; undeletable by anyone
- [x] Deactivated (`active: false`) users cannot authenticate; active ones can

### 🔴 Vulnerability found and fixed

**A Contributor could publish.** Collection access returns a `where` clause,
which constrains *which documents* a user may touch — not *which values* they
may write. A Contributor's own draft satisfies the clause, so setting
`_status: 'published'` went straight through. Field-level access can't cover it
either: `_status` comes from the drafts feature and isn't declared in `fields`.

Fixed with a `beforeChange` guard on Updates that rejects a publish attempt by a
Contributor, on **create as well as update** — creating an already-published
document is the obvious way around a guard that only covers updates.

### Two lessons worth keeping

- **Fixture users must carry the full document, not just an id.** The first run
  had `{id, email}` only, so every access check read `role: undefined` and
  denied everything. Fifteen assertions "passed" — and would have passed with
  access control deleted entirely. The positive controls are what exposed it;
  every rule is now tested from both directions.
- **Payload silently drops a field the user may not write, rather than
  throwing.** Asserting on an exception is therefore meaningless for field-level
  rules. Assert the resulting state instead.

**Deviation from PRD §11d:** the PRD says `FormSubmissions` should be "publicly
creatable". It is not — `create` is `isNobody`, and the server action writes with
`overrideAccess` after validating, honeypotting and rate-limiting. Stricter than
specified, and deliberate.

---

## 5. Donate + Paystack — ✅ done

- [x] `/donate` page, 404 when `donationsEnabled` is false
- [x] Amount tiers in GHS (not the reference's USD)
- [x] Transaction-fee opt-in checkbox
- [x] Checkout init passing campaign reference as transaction metadata
- [x] Webhook verifying HMAC-SHA512 **against the raw body** before parsing
- [x] Idempotency on transaction `reference`
- [x] Donation written with `mode` from `PAYSTACK_MODE`
- [x] `revalidatePath` for the affected campaign
- [x] `/donate/complete` callback with server-side verification
- [x] 11 webhook tests driving the real route handler (32 total, all passing)

**Verified over real HTTP:** with `donationsEnabled` off, `/donate` and
`/donate/complete` both 404 and zero donate links render anywhere. An unsigned
POST to the webhook returns 401 and records nothing.

**Decisions made:**

- **Webhook lives at `/webhooks/paystack`, not under `/api`.** Payload owns
  `/api/*` through a catch-all; a sibling route there invites a conflict.
- **`mode` comes from our own configuration, never from the event payload.** A
  forged event must not be able to declare itself live and inflate a public
  total. There is a test for exactly this.
- **The callback records the donation too**, not just the webhook. Either path
  alone suffices and `recordTransaction` is idempotent, so whichever lands first
  wins — but a webhook that fails to deliver would otherwise silently lose the
  donation.
- **Fee rate is a CMS field, not a constant.** Processor rates change, and
  hard-coding a percentage I cannot verify would quietly overcharge or
  undercharge donors. Defaults to 1.95% with a GHS 100 cap; confirm the real
  Ghana rate in the Paystack dashboard.
- **Money is handled in pesewas end to end**, converted only for display. No
  float arithmetic on currency.
- No monthly/recurring toggle — deferred to v2, and a toggle with one working
  option is worse than none.

**Still needed before this can take a real payment:**

- [ ] `PAYSTACK_SECRET_KEY` and `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` in `.env`
      (test keys are enough for now — the form shows "payments are not
      configured" until they exist)
- [ ] A tunnel (`cloudflared` / `ngrok`) to receive webhooks in local dev
- [ ] One live end-to-end transaction after cutover to PAIF's account

---

## 6. Campaigns — ✅ done

- [x] `/campaigns` listing with empty state
- [x] `/campaigns/[slug]` — story, budget breakdown table, gallery
- [x] Progress bar from the **derived** total (`sumRaisedForCampaign`)
- [x] Progress bar and donate CTA hidden when `donationsEnabled` is false
- [x] Campaign attribution wired through `/donate?campaign=<id>`
- [x] `FeaturedCampaign` on the homepage, driven by `SiteSettings.featuredCampaign`

**Verified with a real campaign and real donation records**, then cleaned up:

| Donation added | Running total |
| --- | --- |
| — | 0 |
| LIVE success GHS 2,500 | 250,000 pesewas |
| TEST success GHS 5,000 | 250,000 — correctly ignored |
| LIVE pending GHS 5,000 | 250,000 — correctly ignored |
| LIVE failed GHS 5,000 | 250,000 — correctly ignored |
| LIVE success GHS 1,500 | 400,000 |

Page rendered `GH₵4,000` of `GH₵10,000` at "40% funded", with budget rows
summing to the stated total. Empty state confirmed after teardown.

**Decisions made:**

- **The budget total is summed from its line items, never authored.** Two
  numbers that must agree is one too many, and a stated total disagreeing with
  its own rows undermines exactly the transparency the table exists for.
- **A `?campaign=` id is treated as a hint, not a fact** — it is resolved
  against the CMS, so an unknown or deleted id degrades to a general donation
  rather than attributing money to something that doesn't exist.
- **Progress is clamped to 100%**, so an over-funded campaign reads as complete
  instead of overflowing its container.
- **With donations off the sidebar pivots** to volunteering, partnership and
  in-kind giving rather than rendering an empty panel.
- `FeaturedCampaign` closes a gap: the field existed in SiteSettings and the
  sitemap promised a "current campaign highlight", but nothing rendered it.

**Note:** currency renders as `GH₵` (the cedi sign) via `en-GH`, not `GHS`.
Correct for a Ghanaian audience — worth knowing if you go looking for it in
markup.

**Still true:** there is no `raisedAmount` field and there must never be one.

---

## 7. SEO plumbing — ✅ done

- [x] `sitemap.xml` — exclude `/donate` while `donationsEnabled` is false
- [x] `robots.txt`
- [x] NGO JSON-LD structured data (correct registered entity — see PRD §2.2)
- [x] Designed 404 page (landed earlier, with §3)
- [x] Default OG image

**Notes:** the `.org` domain is gone, so there is no legacy authority to inherit
and no redirects to preserve it. The `.com` starts from zero, which makes this
work carry more weight than usual.

The sitemap is built from the CMS, not a hardcoded list, so publishing an update
or a campaign lists it without a deploy. `/donate` and `/privacy` are included
only once they resolve — submitting URLs that 404 is how you teach a crawler to
distrust the sitemap. A CMS failure degrades to the static routes rather than a
500.

The JSON-LD deliberately asserts **no** registered legal entity and **no**
founding date. PRD §2.2 records that which entity is the registered donee — the
Italian headquarters or the Ghanaian branch — is still unconfirmed, and the
"established ~2010" figure is unverified. Both offices are published as
`location`, which is factual. Fill these in once PAIF confirm (see *Blocked on
PAIF → Ghanaian entity*).

### Canonical origin

`https://www.profferaid.com` — `www` is canonical, the apex 301s to it.

All five consumers now read one constant, `SITE_URL` in `src/lib/site-url.ts`:
sitemap, robots, JSON-LD, `metadataBase`, and the Paystack callback. They were
previously five inlined copies with two different fallbacks — three defaulting
to production, two to localhost — so a missing variable produced a correct
sitemap alongside wrong OG tags. Each file looked fine on its own.

The fallback is the production origin, not localhost: it only fires on a deploy
that forgot the variable, and a live site advertising `localhost:3000` in its
canonical tags is the worse failure. `.env` sets it explicitly for local dev.

- [ ] Set `NEXT_PUBLIC_SERVER_URL=https://www.profferaid.com` in the production
      environment at deploy time. **Leave `.env` on localhost** — it is the
      origin Paystack redirects back to after a local test payment.
- [ ] Apex → `www` 301 at the DNS/host layer (nothing in the app does this).

---

## 8. Admin panel  ← next

Never tracked in this plan, which is how the bug below survived: the panel was
treated as "Payload provides it" and never actually looked at.

- [x] **Admin CSS was never imported.** `src/app/(payload)/layout.tsx` imported
      `custom.scss` but not `@payloadcms/next/css`. Payload's `RootLayout` ships
      no styles of its own, so `/admin` rendered as unstyled markup. One line.
      Verified by fetching `/admin` and confirming the served bundle now carries
      Payload's admin classes.

- [x] **Brand the panel** — navy/gold theme in `custom.scss`, PAIF logo on the
      login screen, square mark in the sidebar.
- [x] Admin favicon (`admin.meta.icons`)
- [ ] Log in as each of the five roles and confirm the panel *reads* correctly —
      access control is enforced and tested (§4), but nobody has checked what a
      Contributor actually sees.

### How the theme works

Payload derives nearly everything — page background, text, borders, primary
buttons, every `--theme-elevation-*` step — from one greyscale ramp,
`--color-base-0` (white) through `--color-base-1000` (black). Retinting that
single ramp toward navy brands both light and dark mode at once, instead of
chasing hundreds of component selectors. The dark end converges on the real
`#101060`, so body text and primary buttons land on the actual brand token.

Two things worth knowing before editing `custom.scss`:

- **Light-mode overrides must not use bare `:root`.** The file loads after
  Payload's stylesheet, so a plain `:root` rule out-ranks Payload's own
  `[data-theme=dark]` block on source order and breaks dark mode outright. The
  light block is scoped `:root:not([data-theme='dark'])` to raise specificity
  above it. The base ramp *is* set on plain `:root` — deliberately, because it
  is theme-agnostic and both modes should inherit it.
- **The gold contrast rule from the public site applies here too.** Gold on
  cream is ~1.5:1 and fails at every size, so gold is used only as a fill: the
  active-nav indicator bar, and the primary button's hover state (gold ground,
  navy text, ~11:1). The focus outline stays `--theme-text` navy — a gold focus
  ring on a light surface would be nearly invisible, which is worse than
  unbranded.

**Inter, via `htmlProps`.** `RootLayout` renders its own `<html>` and accepts
`htmlProps`, which is the only place a next/font variable can go and still be
visible to `--font-body` at `:root` — a wrapper inside `<body>` is too late.
Anton stays on the public site: it is a condensed all-caps display face and
would be actively hostile in a CMS read for hours.

### Light mode is the site's palette, unchanged

Every step of the light ramp is either a token lifted verbatim from
`globals.css` or a midpoint between two adjacent ones. Payload wants 21
evenly-spaced steps and the site's navy scale has 10, so the gaps are
interpolated rather than invented — the marked steps in `custom.scss` are the
real tokens. Body text lands on `navy-700`, the primary action on `navy-600`,
the canvas on `cream` with white input wells.

### Dark mode is built, not inverted

Payload constructs dark mode by flipping the light ramp end for end, which would
put `navy-800 #09093a` — 73% saturated at 13% lightness — on screen as the page
canvas. Saturated blue that dark is the worst thing to ask someone to stare at,
and it was the main reason the first pass was unusable. So the dark elevations
are overridden outright: same navy hue, chroma pulled back to roughly a third,
canvas at `#14152b`, and text resolving to brand **cream** rather than pure
white. Warm off-white on cool dark navy is easier on the eye than white-on-black
*and* more the site's own than a neutral grey.

Because Payload sets these in a `[data-theme=dark]` block of equal specificity,
the overrides win purely on source order — this file loading last is what makes
them apply. Don't reorder the imports in `(payload)/layout.tsx`.

Measured contrast, both modes:

| Pair | Ratio | |
| --- | --- | --- |
| Light — body text on cream | 15.6 | AAA |
| Light — muted text on cream | 6.5 | AA |
| Light — primary button, cream on navy-600 | 14.6 | AAA |
| Dark — body cream on canvas | 15.7 | AAA |
| Dark — secondary text on canvas | 10.6 | AAA |
| Dark — primary button, cream on navy-400 | 6.5 | AA |
| Both — gold hover, navy on gold | 11.0 | AAA |

Dark borders sit at 1.58:1 against the canvas, just under Payload's stock 1.67.
Below about 1.4 field edges stop being findable, which reads as "where does this
input end" rather than as calm — worth remembering if they get softened again.

**The principle underneath:** this is a tool, not a page. The chrome should be
the quietest thing on screen so photographs and copy are what the eye lands on.
The brand appears in exactly three places — the logo, the primary action, the
active nav marker — and nowhere else.

**`generate:importmap` can report a false negative.** After adding the graphics
components it printed "No new imports found, skipping writing import map" and
wrote nothing. Deleting `src/app/(payload)/admin/importMap.js` and re-running
picked them up. If a custom component silently fails to appear, suspect this
before suspecting the component. Note also that component paths resolve against
`admin.importMap.baseDir` (`src/`) — the tsconfig `@/` alias does not work
there.

**Not a problem:** the information architecture is already sound — collections
are grouped Content/Administration with `useAsTitle`, `defaultColumns`, and
field-level `description`s throughout. The gap is purely visual.

---

## Blocked on PAIF

Not developer work — these need chasing.

- [ ] **Photo library** — 14 placeholder slots on the homepage alone. Each states
      what is needed and at what resolution. Biggest risk to the visual outcome.
- [ ] **Impact counters** — confirm "Members worldwide" (400) and "Active medical
      practitioners" (50); both are point-in-time figures from ~2015 markup.
      "People reached" (1,500) is cumulative and safe as a floor.
- [ ] **Team roster** — confirm all six are current; bios are ~10 years old
- [ ] **Team photos** — none recovered for Kofi Bonsu or Rev. George Kwadwo Asomaning
      (currently rendering initials avatars)
- [ ] **Amasaman campaign** — existence, goal, raised to date, budget breakdown
- [ ] **Ghanaian entity** — gates live donations; target date needed
- [ ] **Social links** — no URLs recoverable from the archive
- [ ] **Impact framing copy** — "GHS X funds a…" for the donate page
- [ ] **Privacy policy** — content, and whether PAIF must register as a data
      controller under Ghana's Data Protection Act 2012
- [ ] **"Our Story" leaflet PDF**

---

## Known issues / decisions to revisit

- **Hero wordmark width** — `VOICES`/`UNITED` in the reference are both six
  characters set to identical widths, which is what makes the block read as a
  solid slab. `PROFFER` (7) and `AID` (3) will not match that at a shared font
  size. Justifying both lines to equal width is a deliberate choice not yet made.
- **Hero fill photograph** — currently a real PAIF photo of a distressed child
  receiving an injection. Authentic and previously published by PAIF, but
  leading with it is a framing decision PAIF should make consciously.
- **Resized image variants** — the four recovered headshots are smaller than the
  `thumbnail`/`card`/`hero` presets, so Payload generates no variants and serves
  the originals. Harmless, but they are low resolution.
- **Vercel Hobby** — 10s function timeout, and its terms exclude commercial use.
  Fine for now; revisit before launch.
- **Preview/production isolation** — previews must never point at the production
  database or bucket. Not yet configured.

---

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run seed` | Seed salvaged content (skips existing, never overwrites) |
| `npm run seed:media` | Re-upload media to the current storage adapter |
| `npm run generate:types` | After any collection change |
| `npm test` | Access-control assertions (needs a live `DATABASE_URI`) |
| `npm run test:watch` | Same, in watch mode |
| `npm run generate:importmap` | After adding admin components |
