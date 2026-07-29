# Product Requirements Document

## ProfferAid.com Rebuild — v1 (MVP)

**Prepared for:** Proffer Aid International Foundation (PAIF)
**Timeline:** 4 weeks
**Stack:** Next.js (App Router) + Payload CMS (self-hosted) + MongoDB Atlas + AWS S3 + Resend + Vercel

> **Amended 2026-07-28.** This revision resolves the stack decisions left open in the original draft, corrects the domain from `.org` to `.com`, and folds in findings from the recovered old site (see `docs/salvaged-content.md`). Changes are marked **[AMENDED]** where they alter earlier direction.

---

## 1. Background

Proffer Aid International Foundation (PAIF) is an international health NGO running mobile medical outreach for underserved communities across sub-Saharan Africa — women, children, and the elderly are the primary focus.

**[AMENDED] Organisational structure.** The recovered site states PAIF is *headquartered in Europe with an operational branch in Ghana*: founder Kofi Bonsu is a Ghanaian based in Udine, Italy; the site listed an Italian street address and phone alongside a Ghana office in Legon, Accra (PO Box LG1126); bank-transfer donations went to an Italian IBAN. The original draft of this PRD described PAIF as a Ghana-registered NGO in Accra. **Both offices are real; which entity is the registered donee is unconfirmed and is now a blocking question — see §2.2.**

The previous site (WordPress/Divi, on **profferaid.org**) is offline, and **PAIF no longer owns the `.org` domain**. The current domain is **profferaid.com**. Because the old domain is gone, no redirects are possible and no legacy link equity carries over — the new site starts fresh on SEO, which raises the weight of the metadata/sitemap/structured-data work in §11.

Content was recovered from the Internet Archive and is documented in `docs/salvaged-content.md`, with raw page text in `docs/salvage/pages/` and 20 images in `docs/salvage/media/`. Recovered and reusable:

- Vision, mission, tagline, and the "What We Do" statement — verbatim
- A five-pillar program framing (Advocating / Partnering / Establishing / Upgrading / Organizing)
- Six team members with full bios; photos for four of them
- Founder's story
- A 9-question FAQ (not previously in scope — see §5)
- Four past programs with full copy: The Blue Mission (2023), Don't Ignore The Red Flags (2021), Walk With Me (2020), Project BEWARE (2020)
- Impact counters: 1,500 people reached / 400 members worldwide / 50 active medical practitioners — **stale, 2015-era markup, confirm before publishing**
- Logo and favicon
- Confirmation that "Advertise with us" was a leftover monetization widget (it appeared three times on one homepage), validating the §4 decision to drop it

**[AMENDED] Not corroborated by the archive**: "Kuku Care", market health screenings, and the **Amasaman Centre for Women and Children capital campaign**. None appear in any snapshot. The site went dormant around mid-2023, so these may simply be newer — but since the Amasaman campaign has a dedicated page (§5), a collection (§6), and a success metric (§12), its existence and figures must be confirmed before that work starts.

**Decision: no WordPress.** Rebuilding on Next.js + a headless CMS to get a faster, more maintainable, lower-hosting-cost site with structured content instead of a plugin-dependent stack.

---

## 2. Open Assumptions

### Resolved

3. **Domain/DNS access** — ✅ **Resolved.** `profferaid.com` is managed by Napster via Vercel. This unblocks Resend DNS verification and makes go-live a same-dashboard operation with automatic SSL. The `.org` domain is gone and is not recoverable. _Runbook must record where the domain is registered — see §13._
4. **Content ownership post-launch** — ✅ Confirmed. A content team of multiple editors will manage content; **Napster has final technical say and is sole developer/maintainer.** Shared credentials are ruled out — no audit trail, defeats the purpose of per-user roles.
    - **Decision**: Payload CMS (self-hosted), custom role-based access control defined in code (per-collection and per-field). Unlike a SaaS CMS, there's no seat limit or role gating.
    - **[AMENDED] Roles finalized**: **Admin** (full access — Napster only; no second full Admin at this time), **Lead Editor** (the named PAIF organiser — everything Editor can do, plus: manage Editor/Contributor/Viewer accounts (invite/deactivate, not promote to Admin), and record **offline** donations; cannot touch SiteSettings, schema, billing/infra, or create/delete Admin accounts), **Editor** (can publish Updates, **create and edit Campaigns**, edit Pages/Team Members; cannot touch SiteSettings or any donation record), **Contributor** (can draft Updates, cannot publish, cannot touch Pages/SiteSettings/Campaigns), **Viewer** (read-only — not assigned at launch, defined for future board/partner visibility needs at no extra cost).
    - **[AMENDED] Two changes from the original role definition**, both consequences of decisions in §6/§8: Editors can now *create* Campaigns (previously they could not touch campaign financial fields at all), because PAIF must be able to publish the Amasaman page themselves whenever its details firm up. And **the Lead Editor's "update the raised-amount field" permission is gone** — raised amounts are derived from donation records, not typed in by anyone. What replaces it is the narrower ability to record an offline donation.
    - **Standing risk to flag, not solve in v1**: Napster is the sole technical maintainer. Self-hosting removes vendor lock-in and seat costs, but there's no fallback support if the server needs attention. Mitigation: a documented runbook is a launch requirement, not a nice-to-have — see §13.
5. **Brand assets** — ✅ **Partially resolved.** Logo and favicon recovered from the archive; a newer `logo-long.png` / `logo-square.png` pair exists in git commit `24a50df`, along with team photos and hero imagery. **Remaining decision**: which mark is current, and whether to refresh the palette.

### Still blocking

1. **Content ownership** — ✅ **[AMENDED] Resolved for build purposes.** Ship with the salvaged content: mission, vision, story, five pillars, FAQ, program copy, **the six recovered team members**, and **the recovered impact counters (1,500 / 400 / 50)**. This is PAIF's own content, not invented filler, so it can go live rather than acting as a placeholder.

    **Two items to put in front of PAIF for confirmation before launch** — neither blocks the build:
    - **Team roster.** The recovered bios date to roughly 2015. Confirm these six are still with the organisation and their roles are current; a decade-old board list is the kind of thing that quietly embarrasses an org. Photos are missing for Kofi Bonsu and Rev. George Kwadwo Asomaning — needs a designed fallback avatar, not the old `person-placeholder1.jpg`. Bios also carry typos throughout and need a copy edit rather than a straight port.
    - **Impact counters.** These vary in risk and should be treated differently: **"People Reached" is cumulative**, so 1,500 is a floor that can only have grown — safe to publish. **"Members Worldwide" and "Active Medical Practitioners" are point-in-time**, and a decade-old figure could be wrong in either direction. Publishing those two as current is the only real exposure here; worth a quick confirmation, or presenting them with an "as of" qualifier.

    Still outstanding but non-blocking: the "Our Story" leaflet PDF and current photography.
2. **Donation processing** — 🟡 **Largely resolved; a launch-timing dependency remains.**
    - ✅ **Settlement entity confirmed: Ghanaian.** A Ghanaian entity will receive payments. This confirms Paystack is the right primary rail and closes the Italy/Ghana risk that previously threatened §8.
    - ✅ **Build is unblocked.** Napster has an existing Paystack account usable in test mode for the duration of the build. Cutting over to PAIF's account is an env-var swap plus registering the production webhook URL — no code change, provided the integration is env-driven from the start (see §8).
    - 🔴 **Remaining**: the Ghanaian entity does not exist yet ("set up in due time"), so PAIF's own Paystack account cannot be created or verified yet. **This gates going live with real donations, not the build.** See §10 for what happens if the entity isn't ready by launch.
    - 🟡 **PayPal** (secondary, international/diaspora): still unconfirmed whether an account exists and can receive. Lower priority now that Paystack carries the primary path — treat as optional for v1.
6. **[AMENDED] Amasaman Centre campaign** — ✅ **No longer blocking; resolved by design.** Assume the details are unavailable for v1. Rather than hand-building a bespoke Amasaman page, Campaigns ship as a **fully self-serve collection**: Lead Editors and Editors create and publish a campaign page from the Payload panel whenever the details firm up, with no developer involvement. Amasaman becomes the first row in that collection rather than a hardcoded route.

    This is a better outcome than the original plan. A one-off page for one campaign would have needed a developer again for the next one; a generic collection means PAIF can run campaigns indefinitely. It also removes a §10 dependency and converts §12's success metric from "we shipped the Amasaman page" into the stronger "PAIF can ship a campaign page themselves."

---

## 3. Goals for v1

- Re-establish a credible, fast, mobile-first web presence (most Ghanaian traffic will be mobile / bandwidth-constrained)
- Make it trivially easy to **donate**, **volunteer**, and **partner**
- Give PAIF a way to publish outreach updates themselves, without a developer, via the CMS
- **[AMENDED]** Give PAIF a self-serve way to run **any** capital campaign with a shareable page and an accurate progress bar — Amasaman first, others after, without a developer
- Ship in 4 weeks without scope creep

## 4. Non-goals for v1 (explicitly deferred)

- Multi-language support (English-only for v1; Twi/Akan translation deferred — note the old site ran a Google Translate plugin, so the need is real but not v1)
- Member portal / login accounts
- Online membership payment processing (form submission only for v1)
- Blog comment system
- Advanced donor CRM integration
- **Shop / e-commerce** — the old site had a `/shop` section. Out of scope unless PAIF says otherwise.
- **"Advertise with us"** — confirmed as a leftover monetization plugin on the old site (appeared 3× on one homepage), not a core function. Dropped.

---

## 5. Site Map (v1)

| Page                     | Purpose                                                                         | CMS-driven?                                 |
| ------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------- |
| Home                     | Mission, impact stats, current campaign highlight, CTA (donate/volunteer)       | Partial (stats + featured content editable) |
| About                    | Org history, mission/vision, team/leadership                                    | Yes                                         |
| Programs / What We Do    | Five pillars, outreach categories, past programs                                | Yes                                         |
| Updates / News           | Feed of outreach events, press coverage, campaign progress                      | Yes (collection)                            |
| **Campaigns** `/campaigns/[slug]` | **[AMENDED]** Fundraising pages — story, budget breakdown, progress bar, donate CTA. Generic route, not a one-off Amasaman page | Yes (collection, self-serve) |
| Get Involved             | Volunteer form, membership form, partnership inquiry form, **FAQ**              | Forms (see §7) + CMS copy                   |
| Donate                   | Payment options, impact-per-donation framing, registered-entity info            | Static + CMS copy                           |
| Contact                  | **Both offices** (Italy HQ + Ghana), phone, email, social links, map            | Static                                      |
| **Privacy Policy**       | **[AMENDED]** Required — the forms collect personal data                        | Static                                      |

**[AMENDED] Additions:**

- **Privacy Policy** is now in scope. The three forms collect names, contact details, and (for membership) occupation — that's personal data, and Ghana's Data Protection Act 2012 imposes real obligations on data controllers. Vercel Analytics is cookieless, so no consent banner is needed.
- **FAQ** — nine well-written Q&As recovered from the old contact page cover membership eligibility, volunteer roles, project scheduling, and in-kind donations. Placing them on Get Involved answers most prospective-volunteer questions for free.
- **Contact must render two offices**, not one.

---

## 6. Content Model (Payload collections outline)

- **SiteSettings** (global): org name, tagline, phone numbers, **both office addresses**, social links, impact counters, **[AMENDED] `notificationEmail`** (form-notification recipient — CMS-editable so it can change without a deploy; defaults to `info@profferaid.com`, env var as fallback), **[AMENDED] `featuredCampaign` and `featuredUpdate`** (relationships driving the Home page's "current campaign highlight" — previously unmodeled), **[AMENDED] `donationsEnabled`** (Admin-only boolean — the master switch described in §10; when false, every donate CTA, the `/donate` route, its sitemap entry, and all campaign progress bars disappear site-wide, with no deploy required to flip it)
- **Pages** (collection: about, programs, donate, contact, privacy): title, slug, rich text (Lexical), hero image
- **Updates** (collection): title, slug, date, cover image, body (Lexical), category (outreach / partnership / campaign), external source link (optional, for press mentions)
- **[AMENDED] Campaigns** (collection): title, slug, goal amount, story (Lexical), hero image, image gallery, status (draft/active/completed), and a **budget breakdown** as a repeatable array of `{ item, amount, note }` rather than free rich text — so the breakdown renders as a consistent table regardless of who authors it.
    - **There is no `raisedAmount` field.** The raised total is **derived** at read time by aggregating `Donations` where `campaign == this` and `status == success`. Nobody types a number in anywhere. See below.
    - Must be **fully self-serve**: an Editor creates a campaign, fills the fields, and publishes a complete page with no developer involvement. Amasaman is simply the first record.
- **[AMENDED] Donations** (collection, restricted): `reference` (unique), `amount`, `currency`, `status` (pending/success/failed), `campaign` (relationship, optional — a donation can be general rather than campaign-specific), `source` (`paystack` | `offline`), `mode` (`test` | `live`), `paidAt`, and optional `donorName` / `donorEmail`.
    - Written by the Paystack webhook (§8), deduplicated on `reference`.
    - **`source: offline` records are created manually** by Lead Editor or Admin, to capture bank transfers, cash, cheque, and in-kind gifts. This is what preserves "no manual raised-amount field" while still letting the progress bar reflect reality — the total stays derived, and offline gifts enter as records rather than as a fudge to a total.
    - **`mode` exists so test-mode transactions never contaminate a public total.** During the soft-launch window described in §10, production may still be running test Paystack keys; the aggregate must filter to `mode: live` unconditionally.
    - Access: `read` restricted to Admin and Lead Editor. Editors cannot see donation records at all. **Never publicly readable** — the public campaign page renders only the aggregate, never an individual record.
- **TeamMembers** (collection): name, role, photo, bio (optional, short)
- **Testimonials** (collection): quote, attribution, photo — **[AMENDED] confirmed in scope for v1**, fully CMS-managed (add/edit from the admin panel)
- **FormSubmissions** (collection, admin-only): stores volunteer/membership/partnership submissions directly in MongoDB. Public `create`, admin-only `read`. Admins can view/export from the Payload admin panel.
- **Users** (built-in): each content team member gets an account with a role field (`admin`, `leadEditor`, `editor`, `contributor`, `viewer`) driving custom access control per collection/field.
    - **[AMENDED] `active` boolean.** Payload has no built-in account-deactivation concept, but the Lead Editor role requires one. Add an explicit `active` field enforced in the auth chain.
    - **[AMENDED] Field-level access on `role`.** A Lead Editor must not be able to set any account's role to `admin` or `leadEditor`. This is field-level access control, not collection-level, and is the most likely place for a privilege-escalation bug — see §11.

**[AMENDED] Currency.** All monetary fields (campaign goal, raised amount, impact framing) are **GHS**. Paystack settles in GHS natively, which removes the currency mismatch the original draft carried between GHS impact copy and USD PayPal checkout.

Keep schemas flat and shallow — this is a content site, not an application. Database: MongoDB via Payload's official `@payloadcms/db-mongodb` adapter (Mongoose-based) — no separate ORM layer.

---

## 7. Forms (replace static PDF downloads)

Three forms, all web-native (not downloadable PDFs like the old site):

1. **Volunteer application** — name, contact, availability, area of interest, short motivation
2. **Membership application** — name, contact, occupation/profession (relevant for medical volunteers), reason for joining
3. **Partnership/collaboration inquiry** — organization name, contact, type of partnership, message

**Implementation**: Next.js API route → writes to the Payload `FormSubmissions` collection (MongoDB) → triggers an email notification via a Payload `afterChange` hook to the `notificationEmail` address in SiteSettings. Submissions land in the database, not just an inbox, giving the content team a real submissions view in the admin panel.

**[AMENDED] A possible fourth form.** The old site's Blue Mission registration captured far more than form #1 above: gender, birth date, age, profession, resident country, **emergency contact**, social handles, solo/group travel, start date, duration, how-heard-about-us, past experience, and motivation. If PAIF runs another international volunteer intake, form #1 will not be sufficient. Confirm whether that's a v1 need or v2 — full field list in `docs/salvaged-content.md` §4.

---

## 8. Donation Flow — **[AMENDED: rewritten]**

The original draft made PayPal primary with Paystack as a week-4 stretch. **That is inverted.** Paystack is now primary and ships in Week 3, not as a stretch.

**Rationale**: Paystack handles Ghanaian cards and mobile money natively and settles in GHS — better conversion for local donors, and it eliminates the GHS/USD mismatch. PayPal's ability to *receive* in Ghana is the exact unknown flagged in §2.2, so building the critical path on it was the riskier choice.

- **Primary: Paystack** — cards + mobile money, GHS, settling to a **Ghanaian entity** (confirmed §2.2).
- **Secondary: PayPal** — optional for v1, for international/diaspora donors. Only if §2.2 confirms an account that can receive.
- **Tertiary: bank transfer** — the old site offered this and it costs nothing to keep. Account details as a CMS field.
- **Impact framing copy** near the donate button (e.g. "GHS X funds a market health screening") — CMS-editable so PAIF can update it without a deploy.

### [AMENDED] Build-now, swap-later approach

PAIF's Ghanaian entity — and therefore its Paystack account — does not exist yet. The build proceeds against **Napster's existing Paystack account in test mode**, and cuts over to PAIF's account with an env-var swap and a webhook registration. No code changes, provided the integration is built correctly from the start:

- **Everything account-specific lives in env vars.** Public key, secret key, and webhook secret. No keys, account references, or callback URLs hardcoded or committed. Test and live keys differ only in value, so the same code path serves both.
- **Webhook signature verification is mandatory, not optional.** Paystack signs webhooks with an HMAC-SHA512 of the raw request body using the secret key, sent as `x-paystack-signature`. Verify against the **raw body** before parsing — Next.js route handlers must not consume the body as JSON first, or the signature won't match. An unverified webhook endpoint is a public "mark this donation paid" button.
- **Never trust the client's success callback.** The browser redirect after checkout is a UX signal only. Payment state comes from the webhook or a server-side verify call against Paystack's API.
- **Webhooks must be idempotent.** Paystack retries, and duplicates happen. Deduplicate on the transaction `reference`.
- **Local development** cannot receive webhooks directly. Use a tunnel (`cloudflared` / `ngrok`) or server-side verification during development. Vercel preview deployments with deployment protection enabled will also reject webhook calls — register the webhook against production only.

**Cutover checklist** (for the runbook, §13): swap the three env vars in Vercel → register the production webhook URL in PAIF's Paystack dashboard → confirm mobile money channels are enabled on the account (they are not on by default in Ghana) → run one live end-to-end transaction of a small amount → confirm settlement lands in the Ghanaian bank account.

### [AMENDED] ✅ Decided: donations are recorded, totals are derived

A `Donations` collection ships in v1 (§6), and **there is no manually-edited raised-amount field anywhere.** Campaign progress is computed by aggregating successful, live-mode donations attributed to that campaign.

**Rationale**: a hand-typed running total is the kind of field that silently drifts — someone forgets an update, fat-fingers a digit, or double-counts a transfer, and a public fundraising figure is exactly the wrong place for that class of error. Deriving it means the number is either right or obviously broken, never quietly wrong.

**What this pulls into v1** (previously deferred in §14):

- The donate flow must pass a **campaign reference** to Paystack as transaction metadata, so the webhook can attribute the donation. The Donate page needs a campaign selector (or campaign pages link to a pre-attributed donate flow); general donations carry no campaign and simply don't count toward any progress bar.
- **Offline donations need a manual entry path.** Bank transfers, cash, cheque, and in-kind gifts never touch the webhook, and PAIF accepts all of them. Without this, the progress bar would systematically understate reality and someone would inevitably ask to "just edit the total". Lead Editor and Admin can create `source: offline` records.
- **Cache invalidation.** Campaign pages are statically generated; a webhook-written donation must trigger `revalidatePath`/`revalidateTag` for the affected campaign, or the progress bar goes stale until the next deploy. Straightforward, but it has to be deliberate.
- **Aggregate correctness.** Filter on `status: success` **and** `mode: live` — never sum pending, failed, or test-mode records.

At this scale an aggregation query per render is entirely fine; no denormalized running total is needed, and avoiding one removes a whole class of drift bug.

---

## 9. Tech Stack

| Layer         | Choice                                                                          | Why                                                                                                                              |
| ------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Frontend      | **Next.js 16** (App Router), React 19, TypeScript 6                             | Fast, SEO-friendly (SSG/ISR for content pages), easy Vercel deploy. Payload 3.86 supports `>=16.2.6 <17`. **TypeScript pinned to 6** — Next 16's build worker rejects the TS 7 compiler API. |
| CMS           | **Payload CMS 3 (self-hosted)**                                                 | MIT-licensed, no per-seat cost, custom code-level RBAC, embeds directly in the Next.js app                                        |
| Database      | **MongoDB Atlas** via `@payloadcms/db-mongodb` (Mongoose)                       | Native support, no separate ORM. Managed (free M0 to start) so Napster's ops burden stays app-level, not database backups/patching |
| **Media**     | **[AMENDED] AWS S3** via `@payloadcms/storage-s3`                               | **Required** — Vercel's filesystem is ephemeral, so uploads cannot go to local disk. Bucket already provisioned.                  |
| **Email**     | **[AMENDED] Resend** via Payload's email adapter                                | Form notifications *and* Payload's password-reset / user-invite flows, which the Lead Editor role depends on. DNS via Vercel.     |
| Styling       | Tailwind CSS                                                                    | Fast to build, easy to hand off                                                                                                  |
| Hosting       | Vercel (Next.js + embedded Payload admin), **Hobby plan for now**               | Zero-config deploys; Payload 3 runs within the Next.js app, so no separate server. See caveats below.                             |
| Forms backend | Next.js API route → Payload `FormSubmissions` + Resend notification             | Submissions land in the database, not just an inbox                                                                              |
| Donations     | **[AMENDED] Paystack primary**, PayPal secondary, bank transfer tertiary         | GHS-native, mobile money support, no currency mismatch. See §8.                                                                  |
| Analytics     | **[AMENDED] Vercel Analytics**                                                  | Decided. Cookieless, so no consent banner required.                                                                              |

**[AMENDED] Vercel Hobby caveats** — accepted for now, flagged for later:

- 10-second function timeout. Payload admin bulk operations and the seed script are where this will first bite.
- Hobby's terms exclude commercial use. A registered NGO taking donations is arguably fine, but it's the kind of ambiguity that surfaces at the worst possible moment. Upgrading to Pro is a one-click change if needed.

**[AMENDED] Media is outside the Atlas backup boundary.** Atlas backs up the database; it does not back up S3. The runbook must cover bucket backup separately — see §13.

**[AMENDED] Preview/production database separation.** Vercel preview deployments must not point at the production Atlas cluster or the production S3 bucket. Separate connection strings and bucket prefixes per environment, configured before the first preview deploy.

---

## 10. Timeline (4 weeks)

**Week 1 — Content, accounts & setup**

- Confirm the remaining blocking assumptions (§2.1, §2.6) with PAIF — **§2.6 first**
- **[AMENDED] Get a target date for the Ghanaian entity's registration** — it gates live donations, not the build (§2.2)
- Wire Paystack against Napster's test-mode account; keep all account config env-driven for a clean cutover
- Set up repo (fresh Payload 3 scaffold), Payload collections/config, MongoDB Atlas cluster, S3 bucket credentials, Resend + DNS verification, Vercel project
- Salvage assets from git commit `24a50df` and `docs/salvage/media/`; decide the current logo
- Finalize sitemap and wireframes (low-fi, not full design comps — no time for a separate design phase)

**Week 2 — Build core pages**

- Home, About, Programs, Contact, Privacy Policy
- Payload collections + custom access control by role + seed script
- Base design system (Tailwind tokens, typography, mobile-first layouts)

**Week 3 — Build dynamic + transactional features**

- Updates/News collection + listing + detail pages
- **[AMENDED] Campaigns collection + `/campaigns/[slug]` route + derived progress bar** — generic and self-serve, no Amasaman-specific work
- **[AMENDED] Donations collection + webhook handler + offline-entry path + cache revalidation**
- Volunteer / membership / partnership forms + email notifications + FAQ section
- **Donate page + Paystack integration** (moved up from week-4 stretch)
- **Access-control test pass** — verify each role against its intended permissions

**Week 4 — QA, content population, launch**

- Full content population by PAIF content team into CMS; **every placeholder replaced** (see below)
- Mobile/performance QA (test on low-bandwidth conditions — key for Ghana-based traffic)
- Accessibility pass (contrast, alt text, form labels)
- DNS cutover, SSL
- **Write the operational runbook** — required before launch, not optional (see §13)
- Launch + post-launch monitoring for 48–72 hours

**[AMENDED] Content policy — revised.** The original plan seeded everything with invented placeholder data. That's now mostly unnecessary: the archive salvage means About, Programs, team, FAQ, past programs, and impact counters all seed with **PAIF's own real content** (§2.1). Two rules remain:

- **Nothing fabricated ships.** Where real content doesn't exist — Testimonials, and Campaigns until Amasaman's figures arrive — seed with obviously synthetic data and leave the collection **empty in production** rather than publishing invented quotes or fundraising figures. An unpublished collection is honest; a plausible fake testimonial is not.
- **Track what needs confirming.** Recovered content is real but dated. The two items in §2.1 — team roster currency and the point-in-time impact counters — go on a Week 4 checklist for PAIF sign-off. Not a launch blocker, but a launch conversation.

**Biggest risks to this timeline**:

1. **[AMENDED] The Ghanaian entity may not exist by launch day. ✅ Fallback decided.** The build is unblocked (test-mode Paystack), but PAIF cannot accept a real cedi until the entity is registered, banked, and Paystack-verified.

    **Decision: launch on time with donations hidden entirely.** Not a disabled button or a "coming soon" notice — every donate CTA, the Donate page, and the donate nav entry are simply absent. The site launches as a credible presence without a payment path, and donations appear later as an additive change.

    **This must be a CMS toggle, not a code change** — see `donationsEnabled` in §6. Requirements when off:
    - All donate CTAs (nav, home, campaign pages, footer) render nothing — not a disabled or dead-linked button
    - `/donate` returns 404 rather than rendering an empty page
    - `/donate` is excluded from `sitemap.xml`, so nothing indexes a route that will 404
    - Campaign progress bars hide too — a fundraising thermometer with no way to give is worse than no thermometer
    - Flipping it on requires no deploy, so it can go live the moment Paystack verification clears

    The alternative — delaying launch until the entity is live — was rejected: nothing else on the site depends on it, and holding a launch hostage to a company registration is the worse trade.
2. **Content recovery.** Much less severe than originally feared — the archive salvage recovered mission, vision, team, story, and program copy. What remains outstanding is current numbers, current team confirmation, and photography.
3. ~~**§2.6 — the Amasaman campaign.**~~ **[AMENDED] No longer a timeline risk.** Building Campaigns as a self-serve collection removed the dependency entirely — the collection ships whether or not anyone knows Amasaman's numbers yet.

---

## 11. Non-Functional Requirements

- **Performance**: target Lighthouse mobile score ≥ 90; matters more than usual given likely mobile/low-bandwidth Ghanaian traffic
- **SEO**: proper metadata, OpenGraph tags per page, sitemap.xml, structured data for org (NGO schema). **[AMENDED]** Weighted more heavily than originally planned — the `.org` domain is gone, so there is no legacy authority to inherit and no redirects to preserve it. The `.com` starts from zero. Structured data must reflect the correct registered entity (§2.2).
- **Accessibility**: WCAG AA baseline — alt text, form labels, sufficient contrast
- **Uptime/reliability**: Vercel handles frontend hosting; Atlas handles database uptime/backups; **S3 handles media, backed up separately**. Add basic uptime monitoring (UptimeRobot free tier or similar).
- **Security**: **[AMENDED]** access control correctness is a launch gate, not a nice-to-have. Specifically test that (a) Lead Editor cannot escalate any account to `admin` or `leadEditor`, (b) Contributor cannot publish, (c) Editor cannot read or write SiteSettings, (d) `FormSubmissions` is publicly creatable but not publicly readable, (e) deactivated (`active: false`) users cannot authenticate, **(f) `Donations` is not readable by Editor, Contributor, Viewer, or the public — only Admin and Lead Editor**, and **(g) the Paystack webhook rejects unsigned or wrongly-signed requests.** Forms need spam protection (honeypot) and basic rate limiting on the API route.
- **[AMENDED] Data protection**: forms collect personal data. Privacy policy required (§5); consider whether PAIF needs to register as a data controller under Ghana's Data Protection Act 2012 — flag to PAIF, not a developer decision.

---

## 12. Success Metrics (post-launch)

- Site is live and stable within 4 weeks
- Volunteer, membership, and partnership forms are functional and tested end-to-end
- **[AMENDED]** The donation path is proven end-to-end **in test mode** by launch, whether or not it is publicly visible — so that enabling it later is a switch, not a project
- PAIF successfully publishes at least one Update post through the CMS without developer help (validates the handoff)
- **[AMENDED]** PAIF creates and publishes a **campaign page themselves** from the Payload panel, without developer help — a stronger handoff test than shipping one hardcoded Amasaman page
- **[AMENDED]** Campaign progress bars reflect real donation records, with no hand-maintained totals anywhere in the system
- **[AMENDED]** No placeholder content remains on any published page

---

## 13. Technical Ownership & Continuity (launch requirement)

Napster is sole developer, has final technical say, and is the de facto infrastructure owner for a self-hosted CMS. That's a deliberate tradeoff — it avoids per-seat SaaS costs and gives the content team unrestricted role flexibility — but it means there's no vendor support line if something breaks.

**[AMENDED] The concentration is now broader than the original draft assumed.** Napster solely controls the code, the Vercel project, the Atlas cluster, the S3 bucket, **the domain and DNS**, and the only Admin account. That is six single points of failure, not one.

**Non-negotiable before launch**: a short runbook covering:

- Where the code lives, how to deploy it (repo + Vercel project access)
- MongoDB Atlas cluster access, backup schedule, and restore procedure
- **[AMENDED] S3 bucket access and a media backup procedure** — Atlas does not cover uploaded media
- **[AMENDED] Domain registrar and DNS** — where `profferaid.com` is registered and how records are managed
- **[AMENDED] Paystack cutover procedure** — the env-var swap, webhook registration, mobile-money channel enablement, and live-transaction verification steps from §8. This is the one operational task guaranteed to be performed *after* launch, so it belongs in writing rather than in memory.
- **[AMENDED] Environment separation** — which env vars point at production vs preview, and the rule that previews never touch the production database or bucket
- Environment variables and where they're stored (not just in Napster's head)
- Who to contact if the site goes down and Napster is unreachable
- **Emergency Admin-access procedure**: Napster is the only full Admin. A sealed-credential fallback involving PAIF was considered and **declined by Napster** — no one on the current team was judged suitable to hold it. This is a **knowingly accepted risk**, not an oversight: if Napster is unreachable for an extended period, PAIF has no path to Admin-level changes until contact is re-established. Napster may still arrange a personal contingency at his discretion; that is outside the scope of the PAIF-facing runbook.

This costs a few hours to write and is the cheapest insurance available against the one real risk self-hosting introduces.

---

## 14. Deferred to v2 (post-launch backlog)

- Twi/Akan translation
- Member accounts / login
- Blog comments / community features
- Donor receipting / thank-you emails, and any donor-facing history
- Recurring / subscription donations
- Extended volunteer-program registration form, if not needed in v1 (§7)
- Shop / e-commerce, if PAIF wants it back

**[AMENDED] Removed from this list as stale:**

- ~~Admin dashboard for form submissions (beyond email)~~ — contradicted §6 and §7. Payload provides the submissions view natively; this ships in v1.
- ~~Paystack or mobile money donation integration~~ — Paystack is now the primary donation rail in v1 (§8).

---

## Appendix — Related documents

- `docs/salvaged-content.md` — recovered content from the old site, with reuse cautions
- `docs/salvage/pages/` — raw page text, 14 pages
- `docs/salvage/media/` — 20 recovered images (⚠️ includes 3 Shutterstock files that **must not** be reused)
