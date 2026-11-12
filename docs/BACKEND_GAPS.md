# Lotus Capital — Backend Gaps, Inconsistencies & Resolution Plan

**Document Version:** 1.0.0  
**Status:** Approved for Implementation  
**Guiding Principle:** Adapt the frontend data layer wherever possible. Minimize backend changes to protect validated compliance, validation, auth, and rate limiting logic.

---

## 1. Summary of Gaps & Inconsistencies

| # | Topic / Area | `Api_end_points.md` Spec | FastAPI Backend Implementation | Frontend Need | Resolution Strategy |
|---|---|---|---|---|---|
| **1** | **Lead List Endpoint Naming** | `/api/v1/admin/leads` | `/api/v1/admin/enquiries` | Display leads in Admin Dashboard and Leads management screen | **Adapt Frontend:** Use the actual backend route `/api/v1/admin/enquiries`. Keep code as source of truth. |
| **2** | **Follow-ups Scheduling & Queue** | Dedicated `GET /api/v1/admin/followups` & `PATCH /followups/{id}` | Follow-ups are tracked directly via `Enquiry` records with `status='in_progress'` and `admin_notes` | Display due follow-ups in Bento Grid Tile B and Follow-ups screen | **Adapt Frontend:** Query `GET /api/v1/admin/enquiries?status=in_progress`. Updating status or follow-up note patches the enquiry. |
| **3** | **Service & Conversion Reports** | Proposes separate `/reports/services` and `/reports/conversion` | Pre-aggregated inside `GET /api/v1/admin/dashboard` as `service_breakdown` and `monthly_trends` | Bento Grid Chart Tile E & Tile F | **Adapt Frontend:** Use the aggregated dashboard response directly. Eliminates extra HTTP requests and reduces database overhead. |
| **4** | **Enquiry Field Names** | `full_name`, `service`, `source_path` | Pydantic schema `EnquiryCreate` accepts either `full_name` or `name`, requires 10-digit Indian mobile, and validates `service` against `VALID_SERVICES` set | `EnquiryPanel.tsx` & `ContactDrawer.tsx` | **Adapt Frontend:** Frontend API client passes both `full_name` and `name`, sanitizes Indian phone numbers (stripping leading +91/spaces), and validates service slug. |
| **5** | **Lead Status Enum Values** | Hyphenated (`in-progress`) | Underscored (`in_progress`, `new`, `contacted`, `resolved`, `closed`) | UI dropdown displays capitalized labels (`New`, `Contacted`, `Qualified`, `In Progress`, `Converted`, `Closed`) | **Adapt Frontend:** Provide bidirectional status adapter in `src/api/adapters.ts` that maps seamlessly between UI labels and backend enum values. |
| **6** | **HTTP Method for Resource Updates** | Various REST proposals | Backend explicitly implements `PATCH /api/v1/admin/enquiries/{id}`, `PATCH /api/v1/admin/statistics/{id}`, and `PATCH /api/v1/admin/content/{id}` | Status changes and editing | **Adapt Frontend:** Centralized API client uses `PATCH` for all partial updates. |
| **7** | **Static Data Path Resolution (Standalone vs Monorepo)** | Four parents up from backend | `config.py` default points to `./content/data` | Serving verified statistics and partners | **Backend Hardening (Done):** Config validator checks local and workspace root paths dynamically, ensuring tests and uvicorn succeed from any directory without error. |
| **8** | **CORS Configuration for Cookie Authentication** | Localhost origins | Pre-configured `allow_credentials=True` for `localhost:5173`, `127.0.0.1:5173`, `localhost:3000` | Support HttpOnly refresh cookie rotation in browser dev and staging | **Maintained:** Explicit origin allowlist maintained in `backend/app/core/config.py`, overrideable via `FRONTEND_ORIGINS`. |
| **9** | **Manual Lead Creation by Staff** | Previously lacked admin staff intake endpoint | Added `POST /api/v1/admin/enquiries` (alias `/api/v1/admin/leads`) | Staff intake via slide-over drawer on `/admin/leads` and `/admin/dashboard` | **Backend & Frontend:** Implemented `AdminEnquiryCreate` with intake channel, assignee, scheduled follow-up, staff consent disclaimer, and duplicate mobile check. |
| **10** | **Duplicate Mobile Detection** | No dedicated duplicate check endpoint | Added `GET /api/v1/admin/enquiries/check-mobile?mobile=...` | Live warning in Add Enquiry drawer when staff types existing client phone | **Backend & Frontend:** Endpoint queries active leads by 10-digit mobile, returning matched record without exposing unnecessary PII. |
| **11** | **Enquiry Deletion & Trash Architecture** | Previously lacked soft delete and trash query | Added `deleted_at`, `deleted_by`, `delete_reason` columns to `enquiries` table, `DELETE /admin/enquiries/{id}`, `POST /admin/enquiries/{id}/restore`, `DELETE /admin/enquiries/{id}/permanent`, and `is_deleted` filter to `GET /admin/enquiries` | Staff soft-delete with 8s undo toast, Trash tab, restore, and permanent purge requiring typed "DELETE" | **Backend & Frontend:** Active queries filter `deleted_at.is_(None)` by default. Trash queries `is_deleted=True`. Permanent delete cascades service relations and writes anonymized audit log. |
| **12** | **Demo Data Separation & Zero-Record DB** | Auto-seeding mock leads on startup | Database starts 100% EMPTY on fresh install (0 enquiries, 0 demo logs). Created standalone `app.scripts.seed_demo` and `app.scripts.purge_demo_data` | Production and clean development start with zero records | **Backend & Frontend:** Startup seeds only the idempotent bootstrap super-admin. Dev seed marks rows with `is_demo=True` and refuses in production. Purge script safely removes demo rows. |
| **13** | **Live Aggregates & IST Timezone Alignment** | Static stub in dashboard endpoints | Implemented `DashboardAnalyticsService` computing real SQLAlchemy counts, zero-filled series, IST (UTC+05:30) calendar month and day bounds, 15s cache, and follow-up scheduling table | Dynamic dashboard reflecting live database changes instantly | **Backend & Frontend:** Full real-time integration. Dashboard numbers, charts, and lists update dynamically when records change, correctly displaying zero when the database is empty. |

---

## 2. Compliance & Safety Gating Rules

1. **Tier C Withholding**:
   - `00-client-data-register.md` explicitly forbids public display of `equity_cagr` (approx 23% CAGR) until full SEBI compliance approval.
   - The backend `StatisticsService` never returns Tier C stats on `/api/v1/statistics`.
   - **Frontend Defense-in-Depth:** The frontend statistics layer (`src/data/statistics.ts`) explicitly filters out `equity_cagr` even if the backend returns it.

2. **Draft & Preview Gating**:
   - CMS content in draft state is never served on `/api/v1/content/pages/{slug}`.
   - Authorized preview requires `GET /api/v1/content/preview/{token}`, displaying a prominent "[PREVIEW] Not Published" banner and enforcing `meta name="robots" content="noindex"`.

3. **Data Protection in Forms**:
   - Client submission must never collect or transmit PAN, Aadhaar, bank passwords, OTPs, or CVVs.
   - Backend `EnquiryCreate` validator automatically rejects messages containing forbidden financial keywords.

