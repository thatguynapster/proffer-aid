# Build plan

Working checklist for the ProfferAid.com rebuild. Scope and rationale live in
[`profferaid-website-rebuild-prd.md`](profferaid-website-rebuild-prd.md);
recovered content is documented in [`salvaged-content.md`](salvaged-content.md).

**Last updated:** 2026-07-30

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

## 5. Donate + Paystack  ← next

- [ ] `/donate` page, 404 when `donationsEnabled` is false
- [ ] Amount tiers in GHS (not the reference's USD)
- [ ] Transaction-fee opt-in checkbox
- [ ] Checkout init passing campaign reference as transaction metadata
- [ ] `POST /api/paystack/webhook` — **verify HMAC-SHA512 against the raw body** before parsing
- [ ] Idempotency on transaction `reference`
- [ ] Write Donation with `mode` from `PAYSTACK_MODE`
- [ ] `revalidatePath` for the affected campaign so progress bars aren't stale

**Notes:** no monthly/recurring toggle — deferred to v2. Never trust the browser
success callback; payment state comes from the webhook or a server-side verify.
Local dev cannot receive webhooks — use a tunnel or server-side verification.

---

## 6. Campaigns

- [ ] `/campaigns/[slug]` — story, budget breakdown table, gallery
- [ ] Progress bar from the **derived** total (`sumRaisedForCampaign`)
- [ ] Progress bar hidden when `donationsEnabled` is false
- [ ] Empty state — no campaigns exist yet

**Notes:** there is no `raisedAmount` field and there must never be one. The
total is `status: success` **and** `mode: live` only.

---

## 7. SEO plumbing

- [ ] `sitemap.xml` — exclude `/donate` while `donationsEnabled` is false
- [ ] `robots.txt`
- [ ] NGO JSON-LD structured data (correct registered entity — see PRD §2.2)
- [ ] Designed 404 page
- [ ] Default OG image

**Notes:** the `.org` domain is gone, so there is no legacy authority to inherit
and no redirects to preserve it. The `.com` starts from zero, which makes this
work carry more weight than usual.

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
