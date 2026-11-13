# Lotus Capital: Web Platform and Admin Console

Full-stack web portal, enquiry management engine, and admin console for **Lotus Capital**, a financial services and wealth advisory firm based in Godhra, Gujarat.

The public site presents advisory journeys for Mutual Funds, Equity & Derivatives, General & Health Insurance, Life Insurance, Fixed Income, NPS, and Retirement Planning. The admin console lets staff manage enquiries, follow-ups, reports, and site content.

---

## Contents

1. [Tech Stack](#1-tech-stack)
2. [Architecture](#2-architecture)
3. [Quick Start](#3-quick-start)
4. [Scripts and Commands](#4-scripts-and-commands)
5. [Zero-Record Architecture and Demo Data](#5-zero-record-architecture-and-demo-data)
6. [Admin Console Modules](#6-admin-console-modules)
7. [API Reference](#7-api-reference)
8. [Compliance and Data Protection](#8-compliance-and-data-protection)
9. [Testing](#9-testing)
10. [Project Structure](#10-project-structure)
11. [Design System](#11-design-system)

---

## 1. Tech Stack

| Layer    | Technology                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------- |
| Frontend | React 18, Vite, TypeScript, React Router 6, Lucide icons, custom glassmorphism and Bento-grid design system |
| Backend  | FastAPI, Python 3.13, Pydantic v2, SQLAlchemy 2.0                                                       |
| Auth     | JWT access tokens, HttpOnly refresh cookie, single-flight silent refresh, Argon2 / Bcrypt hashing       |
| Database | SQLite in development (`backend/lotus_capital.db`); PostgreSQL-ready for production                     |
| Content  | Verified fact registry in `content/data/*.json` with strict regulatory gating                           |

## 2. Architecture

```
            ┌──────────────────────────────────────────────┐
            │            React 18 + TypeScript             │
            │   Public Portal  •  Glassmorphic Admin UI    │
            └───────────────────────┬──────────────────────┘
                                    │  REST /api/v1 (JSON)
                                    │  HttpOnly cookie + Bearer JWT
                                    ▼
            ┌──────────────────────────────────────────────┐
            │           FastAPI Backend (Python 3.13)      │
            │  Pydantic v2 • SQLAlchemy 2.0 • CORS • Auth  │
            └───────────────────────┬──────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
        ┌───────────────────┐             ┌────────────────────────┐
        │ SQLite (dev)      │             │ Media and static       │
        │ PostgreSQL (prod) │             │ fact registry          │
        │                   │             │ (content/data/*.json)  │
        └───────────────────┘             └────────────────────────┘
```

---

## 3. Quick Start

### Prerequisites

- **Node.js** 18+ (npm 9+)
- **Python** 3.11, 3.12, or 3.13 (3.13 recommended)

### Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
# Windows (PowerShell): .\.venv\Scripts\Activate.ps1
# Linux / macOS:        source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

| Resource       | URL                                                            |
| -------------- | -------------------------------------------------------------- |
| OpenAPI (Swagger) | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)    |
| ReDoc          | [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)     |
| Health probe   | [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)   |

### Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app is served at [http://localhost:5173](http://localhost:5173).

### Development Admin Account

On first start, the database bootstraps a single super administrator (idempotent).

| Field     | Value                                                                  |
| --------- | ---------------------------------------------------------------------- |
| Login URL | [http://localhost:5173/admin/login](http://localhost:5173/admin/login) |
| Email     | `admin@lotuscapital.in`                                                |
| Password  | `LotusAdmin@2026`                                                      |
| Role      | `super_admin`                                                          |

> **Warning:** These credentials are for local development only. Change the password immediately after first login on any shared or deployed environment, and never reuse it in production.

---

## 4. Scripts and Commands

### Frontend (`frontend/`)

| Command              | Action                                                           |
| -------------------- | ---------------------------------------------------------------- |
| `npm run dev`        | Start the Vite dev server on `localhost:5173`                    |
| `npm run build`      | Type-check (`tsc`) and create the production bundle              |
| `npm test`           | Run the full Vitest suite                                        |
| `npm run test:watch` | Run Vitest in watch mode                                         |
| `npm run lint`       | Run ESLint, Prettier, and stylelint                              |
| `npm run e2e`        | Run Playwright end-to-end tests (routes, responsive, layout)     |
| `npm run seed:demo`  | Seed development-only Gujarat demo leads (`is_demo = True`)      |
| `npm run purge:demo` | Purge all demo records back to a zero-record state               |

### Backend (`backend/`, inside the virtual environment)

| Command                                           | Action                                           |
| ------------------------------------------------- | ------------------------------------------------ |
| `pytest`                                          | Run backend tests (auth, leads CRUD, stats gating) |
| `python -m app.scripts.seed_demo`                 | Seed realistic demo leads (dev only)             |
| `python -m app.scripts.purge_demo_data`           | Dry run: summarise demo records                  |
| `python -m app.scripts.purge_demo_data --confirm` | Purge demo records and write an audit log entry  |

---

## 5. Zero-Record Architecture and Demo Data

The platform starts clean in every environment.

1. **Clean initial database:** a fresh install has 0 enquiries, 0 follow-ups, and 0 demo audit logs. Only the bootstrap super administrator exists.
2. **Every admin screen handles zero records:**
   - **Dashboard:** KPI tiles show real counts (`0`), charts show informative empty states, and the recent-activity table offers an "Add enquiry" action.
   - **Sidebar badge:** the due follow-ups counter hides at `0`.
   - **Health indicator:** polls `/health` every 30 seconds (Connected / Slow / Offline).
3. **Production gating for demo data:**
   - The seed script refuses to run when `APP_ENV=production` or `ENVIRONMENT=production`.
   - Seeded records carry `is_demo = True` and `created_via = 'demo_seed'`.
   - Purging removes only demo records; real client submissions and admin accounts are preserved.

---

## 6. Admin Console Modules

The console (`/admin/*`) uses a dark-navy glassmorphism theme (`admin.css`) with strict brand tokens and no emoji.

**Role access:** `E` = editor, `A` = admin, `S` = super_admin.

| Module                    | Route                         | Key capabilities                                                                                                                                                                 | Roles |
| ------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| Executive Dashboard       | `/admin/dashboard`            | 12-column Bento grid, live KPIs from `DashboardAnalyticsService`, IST (UTC+05:30) alignment, zero-filled series, conversion rates, range controls (`30d`, `90d`, `12m`), service and assignee filters, 60s polling | E A S |
| Enquiries and Leads       | `/admin/leads`                | 44px search, service/status filters, bulk actions, CSV export, detail drawer                                                                                                     | E A S |
| Manual Intake Drawer      | Slide-over                    | Name, 10-digit mobile, email, service chips, source channel, contact method, follow-up date, notes, consent                                                                      | E A S |
| Duplicate Phone Detection | In drawer                     | 400ms debounced check via `/admin/enquiries/check-mobile`; shows the existing lead and an override toggle                                                                         | E A S |
| Trash and Restore         | `/admin/leads?tab=trash`      | Soft delete with reason, 8s undo toast, restore, permanent purge requiring typed `DELETE`                                                                                        | A S   |
| Follow-ups Queue          | `/admin/followups`            | `followups` table indexed on `(due_at, done_at)` and `(assignee_id, due_at)`; live badge; Due Today / Overdue / Upcoming / Completed tabs; `tel:` click-to-call                  | E A S |
| Performance Reports       | `/admin/reports`              | Shared analytics layer, volume by service, lead-to-client conversion, accessible data tables, CSV export                                                                         | A S   |
| Page CMS and Editor       | `/admin/content/pages`        | Section editor, SEO meta editor, 24h preview links                                                                                                                               | E A S |
| FAQs Manager              | `/admin/content/faqs`         | Category pills (Mutual Funds, Insurance, Equity, General), inline editing                                                                                                        | E A S |
| Team Profiles             | `/admin/content/team`         | Biographies, designations, AMFI EUIN, experience, photos                                                                                                                         | E A S |
| Partners and Awards       | `/admin/content/partners`     | Empanelled AMCs, general insurance underwriters, achievements                                                                                                                    | A S   |
| Testimonials              | `/admin/content/testimonials` | Client reviews behind a mandatory written-consent confirmation gate                                                                                                              | A S   |
| Media Library             | `/admin/media`                | Multipart upload with MIME validation (JPEG, PNG, WebP, SVG, PDF), 5 MB limit, copy URL                                                                                          | E A S |
| Users and Roles           | `/admin/users`                | Account provisioning, role assignment, password resets                                                                                                                           | S     |
| Audit Log                 | `/admin/audit-logs`           | Immutable trail of user actions, IP addresses, IST timestamps, JSON diffs                                                                                                        | A S   |
| Command Palette           | `Ctrl + K`                    | Keyboard navigation to any admin page or the manual intake drawer                                                                                                                | All   |

---

## 7. API Reference

All endpoints are prefixed with `/api/v1`, except the health probe, which is also exposed at `/health` for uptime monitoring.

### 7.1 Public

| Method | Endpoint                      | Description                                                              |
| ------ | ----------------------------- | ------------------------------------------------------------------------ |
| `GET`  | `/health`                     | System health, environment, database status, uptime                      |
| `POST` | `/enquiries`                  | Submit a client enquiry (rate-limited, spam and keyword filtered)        |
| `GET`  | `/enquiries/verify-ref/{ref}` | Verify an enquiry reference on the confirmation screen                   |
| `GET`  | `/statistics`                 | Approved Tier A and Tier B metrics only (Tier C is never returned)       |
| `GET`  | `/services`                   | Service offerings, descriptions, and icon mappings                       |
| `GET`  | `/content/pages/{slug}`       | Published page copy and structure                                        |
| `GET`  | `/content/preview/{token}`    | 24h preview of draft content (served with `noindex`)                     |
| `GET`  | `/content/insights`           | Investor education article directory                                     |
| `GET`  | `/content/insights/{slug}`    | Full article body                                                        |
| `GET`  | `/contact`                    | Address, AMFI ARN, phone, operating hours                                |
| `GET`  | `/faqs`                       | Approved FAQs                                                            |
| `GET`  | `/seo/{slug}`                 | Meta title, description, Open Graph image, canonical URL                 |
| `GET`  | `/media/{filename}`           | Media streaming with directory-traversal protection                      |

### 7.2 Authentication

| Method | Endpoint                | Description                                                      |
| ------ | ----------------------- | ---------------------------------------------------------------- |
| `POST` | `/auth/login`           | Authenticate; returns JWT and sets the HttpOnly refresh cookie   |
| `POST` | `/auth/refresh`         | Single-flight silent token refresh                               |
| `GET`  | `/auth/me`              | Current profile and effective permissions                        |
| `POST` | `/auth/change-password` | Change own password (minimum 8 characters)                       |
| `POST` | `/auth/forgot-password` | Request a reset token (neutral response prevents enumeration)    |
| `POST` | `/auth/reset-password`  | Set a new password with a one-time token                         |
| `POST` | `/auth/logout`          | Revoke the refresh token and clear the cookie                    |

### 7.3 Administrative (Bearer token required)

| Method   | Endpoint                            | Roles   | Description                                                                |
| -------- | ----------------------------------- | ------- | -------------------------------------------------------------------------- |
| `GET`    | `/admin/dashboard`                  | E A S   | KPIs, monthly trends, service breakdown, recent enquiries                  |
| `GET`    | `/admin/enquiries`                  | E A S   | Paginated leads with search, status, and `is_deleted` filters              |
| `POST`   | `/admin/enquiries`                  | E A S   | Manual lead intake                                                         |
| `GET`    | `/admin/enquiries/check-mobile`     | E A S   | Duplicate 10-digit mobile detection                                        |
| `GET`    | `/admin/enquiries/{id}`             | E A S   | Full lead details, services, notes, provenance                             |
| `PATCH`  | `/admin/enquiries/{id}`             | E A S   | Update status (`new`, `contacted`, `in_progress`, `resolved`), notes, assignee |
| `DELETE` | `/admin/enquiries/{id}`             | A S     | Soft delete with reason (`duplicate`, `spam`, `other`)                     |
| `POST`   | `/admin/enquiries/{id}/restore`     | A S     | Restore from Trash                                                         |
| `DELETE` | `/admin/enquiries/{id}/permanent`   | A S     | Permanently purge a lead and its related records                           |
| `GET`    | `/admin/statistics`                 | E A S   | All statistics, including Tier C and verification metadata                 |
| `PATCH`  | `/admin/statistics/{id}`            | S       | Approve or withhold a metric                                               |
| `GET`    | `/admin/content`                    | E A S   | CMS content by type (`page`, `faq`, `insight`, `team`)                     |
| `POST`   | `/admin/content`                    | E A S   | Create a content draft                                                     |
| `PATCH`  | `/admin/content/{id}`               | E A S   | Update a draft or publish                                                  |
| `POST`   | `/admin/content/{id}/preview-token` | E A S   | Generate a 24h preview token                                               |
| `DELETE` | `/admin/content/{id}`               | A S     | Soft-archive a content record                                              |
| `GET`    | `/admin/media`                      | E A S   | Paginated media list                                                       |
| `POST`   | `/admin/media/upload`               | E A S   | Upload media (JPEG, PNG, WebP, SVG, PDF)                                   |
| `DELETE` | `/admin/media/{id}`                 | A S     | Delete a media asset and its file                                          |
| `GET`    | `/admin/users`                      | S       | List administrative accounts                                               |
| `POST`   | `/admin/users`                      | S       | Create a staff or admin user                                               |
| `PATCH`  | `/admin/users/{id}`                 | S       | Change role or toggle active status                                        |
| `GET`    | `/admin/audit-logs`                 | A S     | Immutable compliance audit trail                                           |

See `Api_end_points.md` for the full request and response contracts.

---

## 8. Compliance and Data Protection

Lotus Capital operates under Indian financial regulation (SEBI, AMFI, IRDAI). The codebase enforces the following.

### 8.1 Regulatory identity and disclosures

- **Equity and Derivatives:** Lotus Capital is an **Authorised Person of Religare Broking Limited** (NSE AP Code `AP007909931`, BSE AP Code `AP0130040172963`). It must **never** be described as a "SEBI-registered broker".
- **Mutual Funds:** AMFI ARN-160174, registered under **Abhilash Chudasama** (individual distributor).
- **Real estate:** hidden behind `SHOW_REAL_ESTATE=false` until RERA Gujarat registration is complete.
- **Mandatory disclaimers:** every public page carries the AMFI mutual fund risk disclaimer in the global footer; insurance sections carry "Insurance is the subject matter of solicitation".

### 8.2 Statistics gating

Rules are defined in `00-client-data-register.md`.

| Tier | Status                | Handling                                                                                                           |
| ---- | --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| A    | Approved              | Shown publicly (2,500+ clients, 1,200+ MF folios, 800+ Demat accounts, 570+ insurance policies) with the label "Figures as of October 2026" |
| B    | Qualifying            | Shown only after written client confirmation                                                                       |
| C    | Permanently withheld  | Excluded by backend queries and stripped again client-side in `src/data/statistics.ts` (defence in depth). Never document or hard-code Tier C values in public-facing files. |

### 8.3 Data protection

- Forms **never** collect PAN, Aadhaar, bank account details, net banking credentials, OTPs, or card details.
- Form inputs validate against and reject forbidden sensitive-financial keywords.
- Permanent-deletion audit entries mask customer names and phone numbers.

---

## 9. Testing

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test -- --run

# Production build (type-check + bundle)
npm run build
```

### Key test suites

| Suite                                                                                      | Covers                                                                                           |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| [`adminZeroRecordAndLeadsCrud.test.tsx`](frontend/tests/adminZeroRecordAndLeadsCrud.test.tsx) | Zero-record dashboard, drawer validation, duplicate phone check, soft delete, undo, typed-`DELETE` purge |
| [`adminBrandAndShell.test.tsx`](frontend/tests/adminBrandAndShell.test.tsx)                | Brand colour whitelist, zero emoji, responsive sidebar, Bento tiles                              |
| [`adminNoPlaceholders.test.tsx`](frontend/tests/adminNoPlaceholders.test.tsx)              | No placeholder, roadmap, or mock text on any admin route                                         |
| [`adminSecurityIncident.test.tsx`](frontend/tests/adminSecurityIncident.test.tsx)          | Fail-closed zero-trust authentication; redirect to `/admin/login` on unauthenticated access      |
| [`iosSafariAndCrossDevice.test.tsx`](frontend/tests/iosSafariAndCrossDevice.test.tsx)      | Dedicated BrandLogo vector assets, hero artwork layout isolation, mobile input zoom prevention    |
| [`test_admin_leads_crud.py`](backend/tests/test_admin_leads_crud.py)                       | Empty-DB startup, manual create, duplicate check, delete/restore/purge, role enforcement, seed/purge scripts |
| [`mutualFundsCompliance.test.ts`](frontend/tests/mutualFundsCompliance.test.ts), [`equityCompliance.test.ts`](frontend/tests/equityCompliance.test.ts) | Statutory disclaimers present; Tier C statistics withheld |

---

## 10. Browser Support & Device Hardening

Lotus Capital is tested and verified across modern mobile and desktop browsers:
- **iOS Safari**: iOS 14.0+ (iPhone 13, 14, 15 viewports, WebKit layout containment)
- **Desktop Safari**: Safari 14.0+
- **Google Chrome & Edge**: Versions 90+
- **Mozilla Firefox**: Versions 100+

Full details are documented in [`docs/BROWSER_SUPPORT.md`](docs/BROWSER_SUPPORT.md) and [`docs/SECURITY_REVIEW.md`](docs/SECURITY_REVIEW.md).


---

## 10. Project Structure

```
.
├── Api_end_points.md            API contract specification
├── CODEBASE_GUIDE.md            Developer architecture guide
├── Design.md                    Design tokens, colour ramps, typography
├── Structure.md                 Site map, routing tables, redirects
├── 00-client-data-register.md   Compliance registry of credentials and metrics
├── package.json                 Root development shortcuts
├── content/                     Static fact store (single source of truth)
│   ├── data/                    Verified JSON (stats, team, FAQs, partners)
│   └── pages/                   Structured page content
├── frontend/                    React 18 + Vite + TypeScript
│   ├── src/
│   │   ├── api/                 API client, schemas, types
│   │   ├── components/          Shared UI, navigation, enquiry, Bento widgets
│   │   ├── context/             Auth context, session persistence, role guards
│   │   ├── data/                Static fallback data and statistics filters
│   │   ├── layouts/             PublicLayout, AdminLayout, LegalLayout
│   │   ├── motion/              PinnedStage, scroll animations, reveal hooks
│   │   ├── pages/               Public pages and admin screens
│   │   ├── routes/              Route trees and role guards
│   │   └── styles/              Design tokens, admin.css, responsive styles
│   └── tests/                   Vitest suites
└── backend/                     FastAPI application
    ├── alembic/                 Database migrations
    ├── app/
    │   ├── api/v1/              Routers (public, auth, admin)
    │   ├── core/                Settings, JWT security, CORS, rate limiting
    │   ├── db/                  Engine, session factory, init_db
    │   ├── models/              ORM entities
    │   ├── repositories/        Data access with soft-delete filters
    │   ├── schemas/             Pydantic v2 models
    │   ├── scripts/             seed_demo.py, purge_demo_data.py
    │   └── services/            Business logic, auth, media, audit logging
    ├── tests/                   Pytest suite
    ├── lotus_capital.db         Local SQLite database (dev)
    └── requirements.txt         Python dependencies
```

---

## 11. Design System

An editorial financial aesthetic: deep midnight navy, crisp silver borders, and restrained lotus-red accents. Full details are in `Design.md`.

| Group   | Tokens                                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------------------------ |
| Navy    | `#051329` midnight, `#071B30` navy-950, `#0A2540` rich navy, `#123D67` primary brand navy, `#1B4F82` light navy    |
| Red     | `#E92332` brand red, `#C81B29` button fill / active                                                                |
| Neutral | `#D7D9DC` border silver, `#CBD5E1` slate border, `#8A949D` muted slate, `#FFFFFF` white                            |

**Typography:**
- **Brand Wordmark:** Felix Titling style (`letter-spacing: 0.12em`, classical thin serif). Token `--font-brand: "Felix Titling", "Cinzel", "Trajan Pro", serif;` with utility `.brand-name`. In production, self-hosted **Cinzel** (weights 400, 500, 600, SIL Open Font License v1.1) in `/fonts/cinzel/` serves as the royalty-free licensed web font fallback.
- **Headings & Editorial:** Playfair Display.
- **Navigation, Labels & Cards:** Poppins.
- **Body & Forms:** Inter.

**Tone rhythm:** public pages alternate `data-tone="dark"` and `data-tone="light"` sections, with at most two consecutive dark sections and dark sections under 45% of the page.

---

## 12. License

Copyright &copy; 2026 **Lotus Capital**. All rights reserved.
Internal proprietary software for Lotus Capital, Godhra, Gujarat, India.
