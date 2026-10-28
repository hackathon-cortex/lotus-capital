# Lotus Capital — Developer & Codebase Guide

Welcome to the **Lotus Capital** starter codebase. This guide is written for engineers continuing the build of the Lotus Capital website, CMS, and admin backend.

---

## 1. Architectural Philosophy & Source of Truth

The original client specification files (`00-client-data-register.md` through `19-content-approval-checklist.md`, `Structure.md`, `Api_end_points.md`, `Design.md`) are the immutable source of truth.

- **Zero Hard-coded Facts:** No financial metrics, folio counts, AUM figures, client counts, or regulatory licence numbers are typed into React JSX or Python code.
- **Single Source of Truth (`content/data/`):** All structured data lives in JSON files under `content/data/`, imported into the frontend via the Vite alias `@content/*` and read directly by the FastAPI backend.
- **Page Copy Layer (`content/pages/`):** Every public page's headline, copy, and section order is transcribed into JSON files matching its respective markdown file.
- **Strict Compliance Guardrails:** 
  - Never display "SEBI-registered" or "RERA registered". Lotus Capital acts as an **Authorised Person of Religare Broking Limited** (NSE AP007909931, BSE AP0130040172963) and an **AMFI-registered Mutual Fund Distributor** (ARN-160174, individual holder: Abhilash Chudasama). RERA Gujarat is strictly "under process".
  - Tier C / withheld performance claims (such as the 23% equity advisory return) **NEVER render on any public page**.
  - The mutual fund risk disclaimer is present in the global footer of **every public page**.

---

## 2. Workspace Folder Map

```
├── content/
│   ├── data/                           # Structured Facts & Registrations (Single Source of Truth)
│   │   ├── statistics.json             # All 12 statistics with tiers (A, B, C), approval statuses, and dates
│   │   ├── registrations.json          # AMFI, Religare AP (NSE/BSE), IRDAI, NPS, RERA entries
│   │   ├── awards.json                 # Historical awards (2008–2021) with verification status
│   │   ├── milestones.json             # Key company milestones (2006–2016)
│   │   ├── partners.json               # Confirmed and pending insurance/broking partners
│   │   ├── services.json               # 6 service definitions and stat links
│   │   ├── faqs.json                   # Verified FAQs grouped by page
│   │   ├── team.json                   # Leadership team profiles (Abhilash & Kajal Chudasama)
│   │   ├── contact.json                # Godhra address, phone, email, and social handles
│   │   ├── disclaimers.json            # Global footer disclaimer and regulatory text
│   │   ├── seo.json                    # Meta title and description per route
│   │   └── types.ts                    # Shared TypeScript interfaces for data layer
│   └── pages/                          # Page copy & ordered sections transcribed from md specs
│       ├── home.json                   # 01-home.md
│       ├── about-us.json               # 02-about-us.md
│       ├── services.json               # 03-services.md
│       ├── general-insurance.json      # 04-general-insurance.md
│       ├── life-insurance.json         # 05-life-insurance.md
│       ├── health-insurance.json       # 06-health-insurance.md
│       ├── mutual-funds.json           # 07-mutual-funds.md
│       ├── equity.json                 # 08-equity.md
│       ├── other-solutions.json        # 09-other-solutions.md
│       ├── insights.json               # 10-insights.md
│       ├── contact-us.json             # 12-contact-us.md
│       ├── thank-you.json              # 13-enquiry-thank-you.md
│       ├── privacy-policy.json         # 14-privacy-policy.md
│       ├── terms-and-conditions.json   # 15-terms-and-conditions.md
│       ├── disclosures.json            # 16-disclosures.md
│       ├── complaints.json             # 17-complaints.md
│       └── not-found.json              # 18-404.md
│
├── frontend/                           # React + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── api/                        # API client wrappers
│   │   ├── components/
│   │   │   ├── calculators/            # SipCalculator.tsx (#sip-calculator)
│   │   │   ├── enquiry/                # EnquiryForm.tsx (Zod + React Hook Form)
│   │   │   ├── nav/                    # Header.tsx, Breadcrumbs.tsx, Footer.tsx
│   │   │   └── stats/                  # StatBlock.tsx (<StatBlock />)
│   │   ├── context/                    # MockAuthContext.tsx (mocked authentication state)
│   │   ├── guards/                     # RequireAuth.tsx, RequireRole.tsx
│   │   ├── hooks/                      # useStatistics.ts (data filtering logic)
│   │   ├── layouts/                    # PublicLayout.tsx, AdminLayout.tsx
│   │   ├── pages/
│   │   │   ├── admin/                  # AdminDashboard.tsx, AdminAuthPages.tsx, AdminPlaceholder.tsx
│   │   │   ├── dev/                    # DataRegisterPage.tsx (/dev/data-register)
│   │   │   └── public/                 # Home, AboutUs, Services, GI, LI, HI, MF, Equity, etc.
│   │   ├── routes/                     # AppRoutes.tsx, redirects.tsx
│   │   └── styles/                     # tokens.css (Design.md sec 17 tokens), main.css
│   └── tests/                          # Vitest test suite (routes, redirects, stats, disclaimer)
│
├── backend/                            # FastAPI Backend
│   ├── app/
│   │   ├── core/                       # config.py (CORS, content paths)
│   │   ├── db/                         # session.py (SQLite/in-memory engine), models.py (SQLAlchemy)
│   │   ├── routers/                    # public.py, auth.py, admin.py
│   │   ├── schemas/                    # enquiry.py, content.py, auth.py
│   │   └── main.py                     # FastAPI application setup
│   └── tests/                          # Pytest test suite (enquiry validation, stats filtering)
│
├── package.json                        # Root script orchestrator
├── pytest.ini                          # Pytest configuration
├── lotus_capital_logo_traced.svg       # Brand vector asset
├── Owner.png                           # Photo asset for Abhilash Chudasama
└── CODEBASE_GUIDE.md                   # This handover documentation
```

---

## 3. Route to Markdown Specification Mapping

| Public Route | Component | Source Markdown | Notes |
|---|---|---|---|
| `/` | `Home.tsx` | `01-home.md` | Hero, trust strip, 6 cards, partners, FAQs, enquiry |
| `/about-us` | `AboutUs.tsx` | `02-about-us.md` | Story, leadership, milestones, awards, registrations |
| `/services` | `Services.tsx` | `03-services.md` | Overview grid of all 6 services |
| `/services/general-insurance` | `GeneralInsurance.tsx` | `04-general-insurance.md` | 140+ motor policies stat, checklist, partners |
| `/services/life-insurance` | `LifeInsurance.tsx` | `05-life-insurance.md` | 180+ life policies stat, product types, guide |
| `/services/health-insurance` | `HealthInsurance.tsx` | `06-health-insurance.md` | 250+ health policies stat, #compare, Care Health |
| `/investments/mutual-funds` | `MutualFunds.tsx` | `07-mutual-funds.md` | 1,200+ folios, ARN-160174, #sip-calculator |
| `/investments/equity` | `Equity.tsx` | `08-equity.md` | 800+ demat, Religare AP (NSE/BSE), NO CAGR |
| `/investments/other-solutions` | `OtherSolutions.tsx` | `09-other-solutions.md` | FDs, bonds, NPS; real estate behind flag |
| `/insights` | `Insights.tsx` | `10-insights.md` | 6 educational articles, `?page=` pagination |
| `/insights/:slug` | `InsightArticle.tsx` | `11-insight-article-template.md` | Article body, disclaimer, related enquiry |
| `/contact-us` | `ContactUs.tsx` | `12-contact-us.md` | Godhra office, phone, email, preselected form |
| `/enquiry/thank-you` | `EnquiryThankYou.tsx` | `13-enquiry-thank-you.md` | Reads `?ref=`, `noindex`, navigation links |
| `/privacy-policy` | `LegalPage.tsx` | `14-privacy-policy.md` | Privacy outline, data minimisation notice |
| `/terms-and-conditions` | `LegalPage.tsx` | `15-terms-and-conditions.md` | Website terms, jurisdiction: Godhra |
| `/disclosures` | `LegalPage.tsx` | `16-disclosures.md` | Mutual fund, equity, and insurance disclosures |
| `/complaints` | `LegalPage.tsx` | `17-complaints.md` | Grievance contacts, provider escalation paths |
| `*` | `NotFound.tsx` | `18-404.md` | 404 recovery page |

### Section 3.5 Redirects (301)
- `/about` &rarr; `/about-us`
- `/contact` &rarr; `/contact-us`
- `/mutual-funds` &rarr; `/investments/mutual-funds`
- `/equity` &rarr; `/investments/equity`
- `/general-insurance` &rarr; `/services/general-insurance`
- `/life-insurance` &rarr; `/services/life-insurance`
- `/health-insurance` &rarr; `/services/health-insurance`
- `/investments` &rarr; `/services`
- `/privacy` &rarr; `/privacy-policy`
- `/terms` &rarr; `/terms-and-conditions`
- **Trailing slashes:** Any route ending with `/` (e.g. `/about-us/`) automatically redirects to `/about-us`.
- `/admin` &rarr; `/admin/dashboard` (302)

---

## 4. Statistics Management & Approval Workflow

All numbers reside exclusively in `content/data/statistics.json`.

### Public Site Rendering Rules (Enforced in Code)
1. **Approved + Dated:** A statistic renders publicly **only** if:
   `item.approvalStatus === "approved"` AND `item.asOfDate !== null`.
2. **Empty Grid Collapse:** If no statistics for a section are approved, `<StatBlock />` returns `null` so the section collapses cleanly without empty cards.
3. **Dev Flag (`VITE_SHOW_PENDING_STATS=true`):** In development mode (`.env.development`), unverified pending stats render with a yellow badge:
   `"UNVERIFIED — pending client approval"` and `"As of [date to be confirmed]"`.
4. **Tier C Withholding:** Any statistic with `tier === "C"` or `approvalStatus === "withheld"` (specifically `equity_cagr`) **NEVER renders on any public page**, regardless of dev flags.
5. **Caption/Tooltip:** Rendered stats show their `asOfText` and `definitionNote` where provided.

### How to Approve a Statistic
To promote a statistic to production:
1. Open `content/data/statistics.json`.
2. Locate the statistic object by its `id` (e.g. `clients_serviced`).
3. Set `asOfDate` to the verified date string (e.g. `"31 March 2026"`).
4. Change `approvalStatus` from `"pending"` to `"approved"`.
5. Run tests: `npm test` will confirm it renders cleanly with its as-of date.

### Developer Data Register Route
In development mode (`import.meta.env.DEV`), visit:
**`http://localhost:5173/dev/data-register`**
This displays complete reference tables of all statistics (including tiers and verification notes), regulatory registration details, and documented differences between client source records.

---

## 5. What Is Mocked & Stubbed

1. **Authentication Context (`frontend/src/context/MockAuthContext.tsx`):**
   - Simulated user session with roles (`admin` or `staff`).
   - The login page `/admin/login` switches roles without real passwords.
   - Admin routes are protected by `RequireAuth` and `RequireRole` guards.
2. **Database Storage (`backend/app/db/`):**
   - SQLite in-memory engine with `StaticPool` (`sqlite:///:memory:`) is configured by default for fast local development and testing without OneDrive file locking.
   - SQLAlchemy models are defined in `backend/app/db/models.py` (`Lead`, `Note`, `Followup`, `User`, `AuditLog`) ready to be migrated to PostgreSQL using Alembic.
3. **Draft Preview Stub:**
   - Appending `?preview=<token>` to any public route displays a prominent "Preview Mode Active" banner and injects `<meta name="robots" content="noindex, nofollow" />`.
4. **Feature Flags:**
   - `VITE_SHOW_REAL_ESTATE=false`: Hides the real estate block on `/investments/other-solutions` pending Gujarat RERA registration confirmation.

---

## 6. Open Items from `19-content-approval-checklist.md`

Before moving to production, the client and compliance must sign off on:
- [ ] **As-of Dates:** Confirmation of exact as-of dates for 2,500+ clients, 1,200+ folios, 800+ demat accounts, 250+ health, 180+ life, and 140+ motor policies.
- [ ] **Tier B Definitions:** Clear definition of ₹50 crore+ "AUM" (segments included, market value vs invested amount) and ₹50 lakh+ corporate FDs.
- [ ] **Tier C Performance Claim:** Written calculation methodology, benchmark, and compliance approval for the approx. 23% CAGR advisory equity figure. If missing, keep withheld.
- [ ] **IRDAI Insurer Mapping:** Clarify which partner insurer each agency/POSP code belongs to (`RLH20126535`, `HDF01032560`, `LIC03693848`, `3248307`).
- [ ] **NPS Role Capacity:** Official PFRDA role wording under Religare Broking Limited (registration 4199).
- [ ] **RERA Status:** Compliance review on whether real estate brokerage in Vadodara/Ahmedabad may be advertised before registration completes.
- [ ] **Official WhatsApp:** Confirm verified business WhatsApp number before enabling floating contact widget.

---

## 7. Coworker TODO List

1. **Styling & Visual Polish:**
   - Expand the plain CSS in `frontend/src/styles/` using tokens in `tokens.css` (Design.md section 17).
   - Implement micro-interactions and animations A1–A30 from Design.md section 12 (scroll reveal, card hover lifts, count-ups, and reduced-motion fallbacks).
2. **Production Authentication & Security:**
   - Replace `MockAuthContext` with secure HTTP-only cookies or JWT session tokens.
   - Wire backend `/api/v1/auth/login` to hash-check against the `users` table with bcrypt/argon2.
3. **PostgreSQL Migration:**
   - Configure `DATABASE_URL=postgresql://user:password@host:5432/lotus_capital`.
   - Setup Alembic migrations for the tables defined in `backend/app/db/models.py`.
4. **Interactive Admin Screens:**
   - Implement the lead pipeline table in `/admin/leads` with status updates, notes thread, and CSV export.
   - Implement CMS page editor in `/admin/content/pages/:pageKey` with save draft and short-lived preview token issuance.

---

## 8. How to Run Frontend & Backend

### Prerequisites
- Node.js (v18+ or v24+)
- Python (v3.10+ or v3.13+)

### 1. Run Frontend
```powershell
cd frontend
npm run dev
```
Accessible at: `http://localhost:5173`

### 2. Run Backend
```powershell
# From workspace root
.\backend\.venv\Scripts\uvicorn.exe backend.app.main:app --reload --port 8000
```
Interactive OpenAPI Docs at: `http://127.0.0.1:8000/api/v1/docs`

### 3. Run Automated Tests
```powershell
# Run frontend Vitest tests (43 unit & integration tests)
npm run test --prefix frontend

# Run frontend build check (TypeScript strict check + Vite bundler)
npm run build --prefix frontend

# Run frontend ESLint check
npm run lint --prefix frontend

# Run backend Pytest tests (8 test cases for enquiry & statistics)
.\backend\.venv\Scripts\pytest.exe
```

