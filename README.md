# ProfferAid.com

Website rebuild for Proffer Aid International Foundation.

**Stack:** Next.js 16 (App Router) · React 19 · Payload CMS 3 · MongoDB Atlas · AWS S3 · Resend · Tailwind CSS 4 · Vercel

Full scope, decisions, and rationale live in [`docs/profferaid-website-rebuild-prd.md`](docs/profferaid-website-rebuild-prd.md). Content recovered from the old WordPress site is in [`docs/salvaged-content.md`](docs/salvaged-content.md).

---

## Getting started

```bash
npm install
cp .env.example .env    # then fill in DATABASE_URI and PAYLOAD_SECRET
npm run dev
```

- Public site — http://localhost:3000
- Admin panel — http://localhost:3000/admin

The first visit to `/admin` prompts you to create the initial user. That account
must be given the `admin` role.

### Minimum env to boot

| Variable                 | Notes                                                              |
| ------------------------ | ------------------------------------------------------------------ |
| `PAYLOAD_SECRET`         | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `DATABASE_URI`           | MongoDB Atlas connection string. Use a database dedicated to this project. |
| `NEXT_PUBLIC_SERVER_URL` | `http://localhost:3000` locally                                    |

S3, Resend, and Paystack are all optional at boot — each integration
self-disables when its variables are absent, so the app runs before those
accounts exist. See `.env.example` for the full list.

## Scripts

| Script                        | Purpose                                                 |
| ----------------------------- | ------------------------------------------------------- |
| `npm run dev`                 | Development server                                      |
| `npm run build`               | Production build                                        |
| `npm run typecheck`           | `tsc --noEmit`                                          |
| `npm run generate:types`      | Regenerate `src/payload-types.ts` after schema changes   |
| `npm run generate:importmap`  | Regenerate the admin import map after adding components  |

Run `generate:types` **and** `generate:importmap` after changing collections —
both outputs are committed and the production build depends on them.

## Structure

```
src/
  access/          Role definitions and access-control helpers
  collections/     Payload collections
  globals/         SiteSettings
  fields/          Reusable field builders (slug)
  lib/             Donation aggregation, email
  app/
    (frontend)/    Public site
    (payload)/     Admin panel + REST/GraphQL API
```

## Two things that are non-obvious

**Campaign totals are derived, never stored.** There is no editable
`raisedAmount` field anywhere. `Campaigns.raisedAmount` is a virtual field
computed in an `afterRead` hook by summing `Donations` where `status: success`
**and** `mode: live`. Offline gifts (bank transfer, cash, cheque, in-kind) are
entered as `source: offline` donation records — not as an adjustment to a
total. If you ever find yourself adding a writable total field, re-read PRD §8
first.

**`donationsEnabled` defaults to `false`.** Donations stay invisible until an
Admin turns the switch on in Site settings, which should only happen once the
live Paystack account is verified. This is deliberate: the site must not be
able to launch soliciting donations it cannot actually receive.

## Roles

| Role          | Can                                                                        |
| ------------- | -------------------------------------------------------------------------- |
| `admin`       | Everything, including SiteSettings, schema, and user deletion               |
| `leadEditor`  | Everything Editor can, plus manage non-admin users and record offline gifts |
| `editor`      | Publish Updates, create/edit Campaigns, Pages, Team members                 |
| `contributor` | Draft Updates only — cannot publish, and only their own drafts              |
| `viewer`      | Read-only. Unassigned at launch                                             |

A Lead Editor cannot assign `admin` or `leadEditor`, cannot reach an Admin's
account, and cannot read `Donations` beyond what their role allows. Deactivated
users (`active: false`) cannot log in. These are enforced in `src/access` and in
`Users.ts`, and PRD §11 makes verifying them a launch gate.
