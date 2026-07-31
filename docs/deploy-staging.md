# Staging deploy — Vercel Hobby

A private review URL for PAIF, **not** the public site. Hobby's terms exclude
commercial use; a staging deployment nobody transacts on is fine, a live
fundraising site is not. See *Before this can be the public site* at the bottom.

---

## 1. Database — do this first

`DATABASE_URI` in `.env` points at the development database. Staging must not
share it: PAIF will start typing real content, and `npm run seed` exists to be
re-run.

- [ ] Create a second database in the same Atlas cluster, e.g. `proffer-aid-staging`
- [ ] Atlas → Network Access → allow `0.0.0.0/0`. Vercel's function IPs are not
      static on Hobby, so an allowlist is not an option. The connection string is
      the only credential — treat it accordingly.
- [ ] Note the cluster's **region**. `vercel.json` pins deployments to `fra1`
      (Frankfurt), which is a reasonable midpoint for Ghana and Italy. If the
      Atlas cluster lives in the US, change that value or every query crosses
      the Atlantic twice.

## 2. Environment variables

Set in Vercel → Project → Settings → Environment Variables. Not in the repo:
`.env` is gitignored and stays local.

| Variable | Value for staging |
| --- | --- |
| `PAYLOAD_SECRET` | **Generate a fresh one** — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Never reuse the local secret; it signs admin session cookies. |
| `DATABASE_URI` | The staging database from step 1 |
| `NEXT_PUBLIC_SERVER_URL` | The staging URL, e.g. `https://proffer-aid-staging.vercel.app`, no trailing slash |
| `S3_BUCKET` `S3_REGION` `S3_ACCESS_KEY_ID` `S3_SECRET_ACCESS_KEY` | Same as local, or a separate staging bucket if you'd rather keep uploads apart |
| `PAYSTACK_MODE` | `test` |
| `EMAIL_FALLBACK_RECIPIENT` | Your address, not PAIF's — staging should not mail them |

**`NEXT_PUBLIC_SERVER_URL` must be the staging URL, not the production one.**
It is what keeps this deployment out of Google — see step 4.

> `NEXT_PUBLIC_*` variables are **inlined at build time**, not read at runtime.
> Changing this value in the Vercel dashboard does nothing until you redeploy.
> Same trap when the site eventually goes live: setting it to the production
> origin only makes the site indexable on the *next* build.

Deliberately **not** set:

- `RESEND_API_KEY` — absent means form notifications don't send. Submissions
  still save and are readable in the admin panel. That is the right default for
  staging; a review shouldn't email anyone.
- `PAYSTACK_SECRET_KEY` / `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` — absent means the
  donate form renders "payments are not configured" rather than taking money.

## 3. Deployment protection

- [ ] Vercel → Settings → Deployment Protection → **Vercel Authentication**, or
      a shared password if PAIF don't have Vercel accounts.

Without this the URL is public to anyone who guesses it. The `noindex` in step 4
keeps it out of search results; it does not make it private.

## 4. Confirm it is not indexable

Indexing fails closed: a build is crawlable only when `NEXT_PUBLIC_SERVER_URL`
is set *exactly* to `https://www.profferaid.com`. Staging sets it to the staging
URL, so it is blocked automatically, and a deploy that forgets the variable is
blocked too rather than inheriting the production fallback.

After the first deploy, verify rather than assume:

```bash
curl https://<staging-url>/robots.txt        # expect: User-Agent: *  Disallow: /
curl -s https://<staging-url> | grep noindex # expect: <meta name="robots" content="noindex, nofollow">
```

Both must pass. If either doesn't, `NEXT_PUBLIC_SERVER_URL` is wrong.

## 5. Seed and first admin user

- [ ] Deploy, then visit `/admin` — Payload prompts to create the first user
- [ ] Run `npm run seed` locally **with `DATABASE_URI` pointed at staging** to
      load the salvaged content
- [ ] `npm run seed:media` to push media to the S3 bucket

## 6. Smoke test

- [ ] `/` renders, images load from S3 (not broken)
- [ ] `/updates` and a detail page
- [ ] `/campaigns` — empty state is expected until a campaign is published
- [ ] `/donate` — 404s while `donationsEnabled` is off, which is correct
- [ ] `/get-involved` — submit a form, confirm it appears in the admin panel
- [ ] `/admin` in both light and dark mode, on PAIF's actual hardware
- [ ] A URL that matches nothing, e.g. `/nope` — branded 404

---

## Before this can be the public site

Staging does not clear any of these. In rough order of how hard they are to
unwind:

1. **Privacy policy.** Three forms collect names, emails and phone numbers with
   no policy published, and it is unresolved whether PAIF must register as a
   data controller under Ghana's Data Protection Act 2012. Legal exposure, not
   polish.
2. **Hosting plan.** Vercel Hobby's terms exclude commercial use. A public
   fundraising site needs Pro or another host.
3. **Production database**, separate from both dev and staging.
4. **Unverified content.** Impact counters are point-in-time figures from ~2015
   markup and team bios are a decade old. Publishing unverified impact numbers
   for an organisation soliciting donations is a credibility risk of a different
   kind to a missing photo.
5. **Photo library.** 14 placeholder slots on the homepage alone.
6. **DNS.** `www` canonical, apex 301 → `www`. Nothing in the app does this.
7. **`NEXT_PUBLIC_SERVER_URL=https://www.profferaid.com`** on the production
   deployment — the switch that makes the site indexable at all.
8. **Live payments.** Paystack keys, a real end-to-end transaction, and the
   Ghanaian entity question resolved.
