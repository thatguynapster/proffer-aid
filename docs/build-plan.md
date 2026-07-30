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

## 2. Get involved + forms  ← next

- [ ] `/get-involved` page rendering the seeded FAQ
- [ ] FAQ accordion component (driven off `h3` headings in the page body — no schema change)
- [ ] Volunteer form — name, contact, availability, area of interest, motivation
- [ ] Membership form — name, contact, occupation, reason for joining
- [ ] Partnership form — organisation, contact, type, message
- [ ] `POST /api/forms` — validation, honeypot, rate limiting, `overrideAccess` write to FormSubmissions
- [ ] Resend notification via the existing `afterChange` hook
- [ ] Success/error states, and a no-JS fallback path

**Notes:** `FormSubmissions.create` is `isNobody` by design — only the API route
writes, after validating. The recipient is `SiteSettings.notificationEmail`, not
an env var, so it can change without a deploy.

---

## 3. Privacy route

- [ ] `/privacy` route exists

**Notes:** the footer links to it. The page is seeded as an **unpublished
draft** on purpose — it makes binding legal representations about personal data
and must be written, not generated. It will 404 until someone publishes it; the
route needs to exist so that 404 is deliberate rather than a missing route.

---

## 4. Access-control tests  ← do before the donation work

**Why here:** it is a §11 launch gate, it keeps sliding, and the donation work
is exactly when the security surface grows.

- [ ] Lead Editor cannot assign `admin` or `leadEditor`
- [ ] Lead Editor cannot reach an Admin's account
- [ ] Contributor cannot publish, and can only edit their own drafts
- [ ] Editor cannot read or write SiteSettings
- [ ] `FormSubmissions` publicly creatable, not publicly readable
- [ ] `Donations` unreadable below Lead Editor, never public
- [ ] Deactivated (`active: false`) users cannot authenticate

---

## 5. Donate + Paystack

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
| `npm run generate:importmap` | After adding admin components |
