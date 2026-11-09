# Lotus Capital Website

Website, enquiry system and admin panel for **Lotus Capital**, a financial services business in Godhra, Gujarat (insurance, mutual funds, equity broking as an Authorised Person, fixed deposits, bonds, NPS and related services).

**Last updated:** November 2026
**Stack:** React + Vite + TypeScript (frontend), FastAPI (backend), PostgreSQL later (SQLite or in-memory today)

> Paths below follow the project plan. If a folder in your checkout is named differently, update this file and `docs/REFINEMENT_NOTES.md` together.

---

## 1. Quick start

```bash
# Frontend
cd frontend
npm install
npm run dev            # http://localhost:5173

# Backend (new terminal)
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000           # http://localhost:8000/docs
```

| Command (frontend) | What it does |
|---|---|
| `npm run dev` | Dev server with the dev-only tools enabled |
| `npm run build` | Production build (dev-only code is removed) |
| `npm run lint` | ESLint, Prettier, stylelint (no raw colours) and the content spell check |
| `npm test` | Unit tests (Vitest) |
| `npm run e2e` | Playwright tests (routes, responsive, pinned sections, tone rules) |

| Command (backend) | What it does |
|---|---|
| `pytest` | Enquiry validation and statistics filtering tests |

Environment flags (`frontend/.env.development`):

| Flag | Default | Meaning |
|---|---|---|
| `VITE_SHOW_PENDING_STATS` | `true` (dev only) | Shows unapproved statistics with a small "pending" marker. Never affects production. |
| `VITE_API_URL` | `http://localhost:8000` | Backend base URL |

---

## 2. Repository map

```
.
├── README.md                    This file
├── CODEBASE_GUIDE.md            Walkthrough for new developers
├── Structure.md                 Routes, navigation, redirects (source of truth)
├── Api_end_points.md            API routes and payloads
├── Design.md                    Design system, tokens, animations
├── 00-client-data-register.md   Statistics, registrations, footer disclaimer
├── 01-home.md ... 19-*.md       Page content briefs and approval checklist
├── lotus_capital_logo_traced.svg, Owner.png
├── content/
│   ├── data/                    JSON facts (single source of truth)
│   └── pages/                   Per-page copy and section order
├── frontend/
│   ├── src/routes/              publicRoutes, adminRoutes, redirects
│   ├── src/layouts/             PublicLayout, AdminLayout
│   ├── src/pages/               public/ and admin/
│   ├── src/components/          nav, sections, enquiry, calculators, admin
│   ├── src/motion/              useReveal, useScrollProgress, useCountUp, PinnedStage ...
│   ├── src/config/              pinned.ts, responsive.ts, layout settings
│   └── src/styles/              design tokens (colour, type, spacing)
├── backend/app/                 routers, models, schemas, services, tests
└── docs/                        REFINEMENT_NOTES.md, RESPONSIVE_GUIDE.md, TONE_MAP.md, screenshots/
```

---

## 3. Content and data rules (read this first)

**No fact is typed into a component.** Every number, name, registration and claim lives in `content/data/*.json` or the page content files and is read by the frontend (alias `@content`) and the backend.

### Data files

| File | Holds |
|---|---|
| `statistics.json` | Every figure, with tier, approval status and as-of date |
| `registrations.json` | AMFI, NSE and BSE authorised person codes, insurance codes, NPS, RERA, with holder and wording |
| `services.json` | The six services, flags (`offered`) and per-service theme |
| `partners.json`, `awards.json`, `milestones.json`, `team.json` | Partners (confirmed only), awards, milestones, people |
| `faqs.json`, `insights.json` | FAQs per service and the six full articles |
| `contact.json` | Phone, email, address, map links, `whatsappConfirmed`, hours (null until supplied) |
| `disclaimers.json` | Footer mutual fund disclaimer and other disclosure texts |
| `seo.json`, `site.json` | Titles and descriptions, global settings such as `statsAsOf` |

### Statistics

| Tier | Figures | Rule |
|---|---|---|
| A | 2,500+ clients, 1,200+ mutual fund folios, 800+ demat accounts, 250+ health, 180+ life, 140+ motor policies, 570+ insurance policies (derived) | Shown with "Figures as of October 2026" |
| B | ₹50 crore+ assets, ₹50 lakh+ fixed deposits, 30+ properties, ₹15 lakh+ monthly rent | Shown only after the client confirms the definition |
| C | Approx. 23% equity CAGR | **Withheld. Never rendered on any page** (including hero and chips) until compliance approves it in writing |

How it works: a statistic renders on the public site only if `approvalStatus` is `approved` and an as-of date exists (`site.json` → `statsAsOf`). Pending items appear only in dev mode with a small marker. The dev-only route `/dev/data-register` lists every statistic, registration and document discrepancy.

To approve a statistic: set `approvalStatus: "approved"` in `statistics.json`, record the definition, and confirm `statsAsOf`.

### Compliance wording (must not change without client or compliance sign-off)
- Lotus Capital is an **Authorised Person of Religare Broking Limited** (NSE `AP007909931`, BSE `AP0130040172963`). Never write "SEBI-registered" for Lotus Capital.
- AMFI ARN-160174 belongs to **Abhilash Chudasama** (individual).
- **RERA Gujarat: registration under process.** Never write "RERA registered". The real estate block stays hidden behind `SHOW_REAL_ESTATE=false`.
- EUIN and validity date are shown only if marked `verified: true` in `registrations.json`.
- Religare Broking's own SEBI registration number is shown only when supplied and verified.
- The mutual fund disclaimer from `disclaimers.json` appears in the footer of every public page.
- No invented testimonials, partner logos, insurer relationships, ratings, returns, dates, hours or biography claims. Insurance pages carry "Insurance is the subject matter of solicitation".
- Illustrations (SIP board, charts, mockups) are labelled "Illustration only. Not a forecast or guarantee" or "Sample layout".

---

## 4. Routes

Source of truth: `Structure.md`.

| Route | Page |
|---|---|
| `/` | Home |
| `/about-us` | About |
| `/services` | Services overview |
| `/services/general-insurance`, `/services/life-insurance`, `/services/health-insurance` | Insurance pages |
| `/investments/mutual-funds`, `/investments/equity`, `/investments/other-solutions` | Investment pages |
| `/insights`, `/insights/:slug` | Learning hub and articles |
| `/enquiry/thank-you` | Confirmation (`noindex`) |
| `/privacy-policy`, `/terms-and-conditions`, `/disclosures`, `/complaints` | Legal pages (shared LegalLayout) |
| `/admin/*` | Admin panel (mock authentication for now) |
| `/dev/data-register` | Dev only |

**Contact is a drawer, not a page.** The standalone `/contact-us` page was removed. The header "Contact Us" link, every "Talk to an Advisor" button and the footer link open the `ContactDrawer`. `/contact-us` redirects to `/?contact=open` (and `?contact=open&service=<slug>` preselects a service). Redirects are listed in `Structure.md` section 3.5.

---

## 5. Key UI systems

### Design tokens
All colours, radii, shadows and spacing come from tokens (`src/styles`). Raw hex values in components are blocked by lint.

- **Navy ramp:** `navy-950 #071B30`, `navy-900 #0A2540`, `navy-850 #0C2D4D`, `navy-800 #0E3154`, `navy-700 #123D67`, `navy-600 #1B4F82`, `navy-100 #E6EDF5`
- **Neutrals:** silver `#D7D9DC`, `silver-100 #F3F5F7`, grey canvas `#EEF1F4`
- **Accents:** steel `#5B8DB8`, royal `#2F6FB0` (Mutual Funds), teal `#1F6F8B` (Life), indigo `#4F5FB0` (Equity, accents only), lotus red `#E92332` (accents) and `#C81B29` (button fill, for contrast)
- **Fonts:** Playfair Display (display headlines), Poppins (headings and buttons), Inter (body)
- **Radii:** 24 to 32px; soft layered shadows; no shadows on resting dark cards

### Tone rhythm
Sections declare `data-tone="dark|light"`. Rules: never more than two dark sections in a row, dark share under 45% of a page, dark-to-dark pairs never overlap or stack, and light-to-light pairs never stack. Per-page maps are in `docs/TONE_MAP.md`.

### Header and navigation
One bar (no nested pills). Transparent over a hero at the top, then solid navy at 96% opacity with blur and a backdrop strip. Active page = white text with a 24px red underline. Hover = soft background only (no underline). The footer and header "Contact Us" are buttons that look identical to links (`NavLinkButton`).

### Shared page components
`ServiceHero`, `PinnedStage` / Timeline, `FaqAccordion` (filters, accent bars), `EnquiryPanel`, `PartnerMarquee` (trimmed logos, two rows), `StatBlock`, `RiskNote`, `ContactDrawer`, `LegalLayout`.

### Pinned scroll sections
Home "How we work", About "Our journey", General Insurance steps, Life and Health timelines and the Equity journey graph all use one `PinnedStage` primitive. Tunables are in `src/config/pinned.ts` (stage height, scroll per step, step thresholds). Below `lg` and with reduced motion these become vertical timelines with no pinning.

### Enquiry
One shared single-viewport `EnquiryPanel` (also inside the drawer). Fields: name, 10-digit mobile, optional email, contact method, service chips (`service_detail[]`), optional message, consent. No PAN, Aadhaar, passwords or OTPs. Success leads to `/enquiry/thank-you?ref=<id>`.

### Removed on purpose
- Right-side dot navigator (site-wide)
- Standalone `/contact-us` page (replaced by the drawer)
- The second SIP calculator on Mutual Funds (one board at `#sip-calculator`)
- "Data Register" link in the public footer (a dev-only pill remains in development builds)
- The tilting 3D cards on Home
- Invented dates on the Insights articles (shown only when `lastUpdated` is set)

---

## 6. Responsive behaviour

Mobile-first with tokens `xs 0, sm 480, md 768, lg 1024, xl 1280, 2xl 1536`. No horizontal scroll from 320px, touch targets of 44px minimum, scroll-linked effects only at `lg` and above, hover effects only on hover-capable devices. Details in `docs/RESPONSIVE_GUIDE.md`.

---

## 7. Testing

- **Vitest:** stat visibility, Tier C never renders, footer disclaimer on every route, route table and redirects, form validation, `service_detail`, content helpers.
- **Playwright:** route coverage; screenshots at phone, tablet and desktop sizes; no horizontal overflow; tap target sizes; header never wraps; pinned sections reach every step; numerals never wrap; tone rhythm; header backdrop covers text; no dot-navigator elements; no "Data Register" text in the production build; ContactDrawer behaviour.
- **pytest:** enquiry validation and statistics filtering.
- Lint includes a **spell check** for content files with a Lotus Capital dictionary.

---

## 8. Open items before launch

Client inputs:
- [ ] Confirm the as-of date (currently "October 2026") and the definition of "AUM" and the Tier B figures
- [ ] Verify EUIN and validity date for the ARN, and supply Religare Broking's SEBI registration number
- [ ] Map the insurance codes (`RLH20126535`, `HDF01032560`, `LIC03693848`, `3248307`) to insurers and holders
- [ ] Confirm NPS wording (4199), real estate promotion and RERA status
- [ ] Hero photographs, Kajal Abhilash Chudasama's portrait, team photos
- [ ] Final partner logos (correctly mapped files in `public/images/partners/`)
- [ ] Real publication dates for the Insights articles and review of article text
- [ ] Confirmed WhatsApp number (`whatsappConfirmed`) and business hours, if any
- [ ] Testimonials with written consent (none are shown until supplied)
- [ ] Legal and compliance review of Privacy, Terms, Disclosures and Complaints; privacy officer and retention schedule
- [ ] Compliance decision on whether the 23% equity CAGR may ever be published

Engineering:
- [ ] Real authentication and role-based access (admin uses a mock today)
- [ ] PostgreSQL, migrations and email notifications
- [ ] Admin CMS screens (content editing, media, SEO, audit log) beyond placeholders
- [ ] Preview tokens for draft content
- [ ] Hosting, domain, staging and production environments, backups and monitoring

---

## 9. Contributing

1. Read `Structure.md`, `Design.md`, `00-client-data-register.md` and this file.
2. Put facts in `content/data`, never in components. Use tokens, not raw colours.
3. One fix at the root cause: shared components first, pages second.
4. Run `npm run lint && npm test && npm run e2e` and `pytest` before pushing.
5. Add a short entry to `docs/REFINEMENT_NOTES.md` for every visual or behavioural change.

---

## 10. Troubleshooting

| Symptom | Likely cause |
|---|---|
| A pinned section does not stick or shows only the first step | An ancestor has `overflow: hidden/auto` (use `overflow: clip`), or progress is read from the inner element instead of the outer container |
| A pinned section covers the header | Stage z-index must stay below the header (50) and its sticky `top` must include the header height |
| Numbers wrap letter by letter ("2 / 0 / 0 / 8") | Numeral element is missing `white-space: nowrap` and a min-width |
| A statistic is missing on the site | It is not `approved`, has no as-of date, or is Tier C (withheld) |
| Footer collapses into one column | The footer grid wrapper lost `display: grid`, or a link component set `display: block; width: 100%` |
| A page looks heavy and all navy | Tone rhythm rule broken; check `docs/TONE_MAP.md` |

---

## 11. Documents

| File | Purpose |
|---|---|
| `Structure.md` | Routes, navigation, redirects, SEO |
| `Api_end_points.md` | API contract |
| `Design.md` | Design system and animation catalogue |
| `00-client-data-register.md` | Statistics, registrations, disclaimer |
| `19-content-approval-checklist.md` | Pre-launch checks |
| `docs/REFINEMENT_NOTES.md` | Round-by-round change log and root causes |
| `docs/RESPONSIVE_GUIDE.md` | Responsive rules and tokens |
| `docs/TONE_MAP.md` | Dark and light section map per page |
| `CODEBASE_GUIDE.md` | Developer walkthrough |

---

Questions about content or compliance go to the client before any change. When in doubt, leave the claim out.
