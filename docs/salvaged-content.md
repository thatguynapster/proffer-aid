# Salvaged Content — old profferaid.org (WordPress/Divi)

Recovered from the Internet Archive on 2026-07-28. The domain is no longer owned by PAIF, so this is the only remaining copy.

- **Raw page text**: `docs/salvage/pages/*.txt` (14 pages, verbatim)
- **Recovered images**: `docs/salvage/media/` (20 files)
- **Last snapshot**: 2024-02-21. Newest content on the site dates to May 2023 — the site was dormant roughly two years before going offline.

---

## 1. Directly reusable

### Tagline

> Racing to save lives

_(Source reads "Racing to save lifes" — typo in original. Also used as "Race to save lives, contact us!")_

### Vision

> A world in which health care reaches everyone, everywhere.

### Mission

> To make the last mile the most important in health care delivery: creating, showing and sharing the solutions for achieving truly equitable health care.

### Impact counters (`SiteSettings`)

Recovered from the Divi counter markup (`data-number-value`):

| Label                        | Value |
| ---------------------------- | ----- |
| People Reached               | 1,500 |
| Members Worldwide            | 400   |
| Active Medical Practitioners | 50    |

⚠️ These sit in `wp-content/uploads/2015/02/` era markup and were never updated. Treat as **stale — confirm with PAIF before publishing**, don't port as-is.

### "What We Do" statement

> The PAIF is working towards bridging the gap between health care services and the patients. As a known fact in Sub-Saharan Africa, there are many more ill-stricken people who for a number of reasons are unable to access health care. PAIF works hard to reach such persons who appear to be invisible and voiceless. PAIF organizes health events in deep rural areas where governments of such countries seem to have been unable to provide medical care. Our main targets are mainly women, children and aged. However generally our programs are organized on extensive basis to reach all persons needing health care.

### The five pillars ("In Summary")

Good structure for the Programs / What We Do page:

| Pillar           | Description                                                                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Advocating**   | for better health care services in African countries where health services are acutely deficient                                                               |
| **Partnering**   | with professional health bodies, governmental & non-governmental organizations and corporate institutions to upgrade health services in these countries         |
| **Establishing** | affordable and accessible health structures (primary health centers and local hospitals) in regions where these facilities are not present                      |
| **Upgrading**    | facilities that have been badly managed in the respective primary health centers and local hospitals                                                            |
| **Organizing**   | exchange programs for health personnel, where students and professionals have the opportunity to impact the lives of the less-privileged with better healthcare |

### Our Story

> PAIF is an international non-governmental organization. It was established by a group of professionals. The founder, Kofi Bonsu, is a Ghanaian based in Italy, [who] formed the organization with the view of reaching the many people situated in the rural areas of sub-Saharan African countries with the needed health care services. The organization was formed with the support of his other colleague professionals to race in delivering vital health care to remote communities across Africa.

### Team (`TeamMembers`) — 6 members with full bios

Full bios in `docs/salvage/pages/about.txt`. Photos recovered for four of six.

| Name                          | Role                     | Photo                |
| ----------------------------- | ------------------------ | -------------------- |
| Kofi Bonsu                    | Leader (founder)         | ❌ not recovered      |
| Dr. Romano Paduano            | Chief Medical Consultant | ✅ `paduano-foto.jpg` |
| Dr. Peter Bossman             | Medical Consultant       | ✅ `Bossman1.jpg`     |
| Rev. George Kwadwo Asomaning  | Reverend                 | ❌ not recovered      |
| Daniel Forson                 | Secretary                | ✅ `daniel-forson.jpg`|
| Dr. Luca Catarossi            | Immigration Expert       | ✅ `luca-foto.jpg`    |

⚠️ Bios are ~2015-era and contain typos ("examplaring", "whom's heart"). Needs an editing pass, and **confirmation that these people are still with the organisation** — a decade is a long time for a board roster.

### FAQ — 9 Q&As (not in the PRD sitemap at all)

Genuinely useful content covering membership eligibility (incl. minors from 14 with guardian consent), what volunteers do, project timing, in-kind donations (equipment, beds, pharmaceuticals), and self-funded participation. Full text in `docs/salvage/pages/contact.txt`.

**Recommendation**: this answers most of what a prospective volunteer/member would ask. Worth a section on Get Involved rather than discarding.

### Contact details — **two offices**

| | Italian HQ | Ghana Office |
| --- | --- | --- |
| Address | Via Persereano 1/6, loc. Merlana, 33050 Trivignano Udinese (UD), Italy | Legon, Accra, Ghana — PO BOX LG1126 |
| Phone | 0039 347 580 9685 | +233 244 098 345 |
| Hours | 8a–6:30p M–F, 9a–2p S–S | 8a–6:30p M–F, 9a–2p S–S |

Bank transfer donations went to an **Italian IBAN**: `IT40E0572812301701571299693`

### Past programs (seed content for `Updates` / `Campaigns`)

| Program | Date | Notes |
| --- | --- | --- |
| **The Blue Mission** | Oct 2023 – Jan 2024 | International volunteer program. $600 / 3 weeks, ages 17+, includes airport pickup, accommodation, meals. Clinics in Accra + Ashanti/Volta/Eastern/Central regions. Full copy recovered. |
| **Don't Ignore The Red Flags** | Oct 2021 | Breast Cancer Awareness Month series with Evolve Pink, All African Student Union, Ghana University Students Association. Two Zoom sessions: "Cancer Genetics" and "Mastectomy Did Not Define Me". |
| **Walk With Me** | Jul 2020 | Free mentorship platform, mentor/mentee signup. Contact was `wwm@profferaid.org` (**dead — domain lost**). |
| **Project BEWARE** | Jan 2020 | Cervical cancer awareness/screening. Launched 28 Dec 2019 at Accra College of Education Community Library. Goal: screen 2,000 women in 2020 via Marie Stopes Ghana screening coupons. Full press-style article recovered — good `Updates` seed. |

---

## 2. Discrepancies with the PRD — need PAIF confirmation

### 🔴 The organisation is headquartered in Italy, not Ghana

PRD §1 describes "a Ghana-registered health NGO (Adenta/Legon, Accra, est. ~2010)". The archive says: *"the PAIF has its headquarters in Europe and an operational branch in Ghana"* — founder based in Udine, Italy; Italian phone; Italian street address; Italian IBAN for donations.

**Why this matters beyond copy:**

- **It may break the Paystack-primary decision.** Paystack requires a registered business in Ghana/Nigeria/South Africa/Kenya with a local bank account for settlement. If donations settle to the Italian entity, Paystack may not be available at all. Needs confirming before Week 3 — it's now the single biggest open risk on the donation path.
- Contact page needs **two** offices, not the one the PRD assumes.
- NGO structured data (§11) needs the correct registered entity and jurisdiction.
- Which entity is the donee affects any tax-deductibility claims on the Donate page.

### 🔴 None of the PRD's named programs appear anywhere in the archive

PRD §1 cites "Kuku Care" (Eastern Region), market health screenings, and the **Amasaman Centre for Women and Children capital campaign** — the last of which has a whole page in the sitemap (§5) and its own collection (§6).

The archive has none of these. The newest snapshot is Feb 2024, so the Amasaman campaign may simply post-date the site going dormant — but nothing corroborates it here. Since the campaign page is a named success metric (§12), **confirm it's real and current before building it**, and get the goal/raised/budget figures.

### 🟡 Old site had a Shop

`/shop` existed and is not in the PRD scope. Presumably deliberate, but worth a confirm alongside "Advertise with us".

### 🟢 "Advertise with us" — PRD instinct confirmed

Appeared **three times** on the old homepage, all pointing to the same generic CTA. §4's call to drop it is well founded; it reads exactly like the leftover monetization widget the PRD suspected.

---

## 3. Cautions

- **Do not reuse the stock photography.** `shutterstock_151335617_1.jpg`, `shutterstock_155821556_1.jpg`, `shutterstock_242985220_2.jpg` are licensed Shutterstock images. That licence does not transfer with a rebuild. They're in the salvage folder for reference only — **exclude from the new site.**
- **`wwm@profferaid.org` and every other `@profferaid.org` address is dead** — the domain is gone. Any recovered copy referencing them must be updated to `.com`.
- **Old Donate page shipped with Lorem ipsum.** Three body sections were untranslated placeholder text under real headings ("It's secure!", "You can make monthly donations, automatically", "Make thousands of people healthier!"). The headings are reusable; the body needs writing from scratch. A useful reminder for our own placeholder policy.
- **Copy throughout needs an editing pass** — the source has consistent typos ("lifes", "rquired", "geniunely", "emback", "communtiy", "in-efficient", "less-privilege").
- **`logo-1.png` (78 KB) and `LOGO1.png` (9 KB)** are the recovered marks; `favicon.png` also recovered. Compare against the newer `logo-long.png` / `logo-square.png` in git commit `24a50df` and pick the current brand.

---

## 4. Bonus: a fourth form type

The Blue Mission registration form (`docs/salvage/pages/news.txt`) captured far more than the PRD's generic volunteer form: full name, gender, birth date, age, profession, current address incl. resident country, phone, **emergency contact**, email, social handles, solo/group travel, available start date, duration in days, how-did-you-hear-about-us, past volunteer experience, motivation.

If PAIF runs another international volunteer intake, the PRD's §7 volunteer form ("name, contact, availability, area of interest, short motivation") won't be sufficient. Worth asking whether that's a v1 need or a v2 one.
