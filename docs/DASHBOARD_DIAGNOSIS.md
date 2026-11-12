# Admin Dashboard Diagnosis & Root Cause Analysis

**Date:** 2026-11-10  
**Phase:** 0 - Diagnosis  
**Target:** Make every number, chart, and list on the Admin Dashboard live from the database, correct at zero, and verified with reactive tests.

---

## 1. Executive Summary & Root Causes

The Admin Dashboard displays static and synthetic data due to four distinct root causes spanning backend handlers, missing schema contracts, and frontend component composition:

1. **Frontend Hard-Coded Initial States & Missing Props**:
   - `AdminDashboard.tsx` initializes `headlineCount` to `42`, `followupsCount` to `6`, `convertedCount` to `18`, and `enquiries` to an array of 6 hard-coded demo leads.
   - `HeadlineTile` is passed hard-coded props: `monthLabel="Oct 2026"`, `pctChange="+18.5% vs previous month"`, and a hard-coded sparkline array `[18, 24, 28, 31, 36, headlineCount]`.
   - `ServiceConversionTile` (Tile F) and `TodayFollowupsTile` (Tile H) take **no props**; both render static arrays hard-coded inside `BentoDataWidgets.tsx` (e.g., 48.2% Health Insurance, 54.0% Mutual Funds, "Rajeshbhai Patel", and "All follow-ups (6)").
   - `AdminLayout.tsx` hard-codes `<AdminShell dueFollowupsCount={6}>`, locking the sidebar badge to "6" regardless of real database records.

2. **Backend Dashboard Handler Contract Limitations (`/api/v1/admin/dashboard`)**:
   - `GET /api/v1/admin/dashboard` only returns a minimal `DashboardMetrics` shape (`total_enquiries`, `new_enquiries`, `in_progress_enquiries`, `resolved_enquiries`, `service_breakdown`, `monthly_trends`, `recent_enquiries`).
   - It **lacks** the comprehensive `summary` payload requested in Phase 1 (`new_enquiries_this_month`, `new_enquiries_today`, `follow_ups_due_today`, `follow_ups_overdue`, `converted_this_month`, `awaiting_review`, `total_leads`, `change_pct`).
   - It **lacks** `by_status`, `by_source`, `by_month` (with both enquiries and conversions), `follow_ups_due`, and `generated_at`.
   - It ignores query parameters: `range` (`30d`, `90d`, `12m`, `custom`), `from`, `to`, `service`, `assignee`, and `include_demo`.
   - Date bucketing uses UTC rather than Indian Standard Time (`Asia/Kolkata`, UTC+05:30), creating date boundary skew for Indian operational hours.

3. **Legacy Handlers with Hard-Coded Literals**:
   - `backend/app/routers/admin.py` lines 132-157: `get_service_reports` and `get_conversion_reports` return hardcoded literal numbers (`mutual-funds: 42`, `health-insurance: 28`, `conversion_rate: 22.4`, stages `new: 100`, etc.).
   - Legacy `get_followups` returns hard-coded dummy `"fol_001"` ("Kishore Shah").

4. **Absence of Server-Side & Client-Side Reactive Integration**:
   - No `GET /api/v1/admin/followups/count` endpoint exists; sidebar relies on layout defaults.
   - `AdminDashboard.tsx` does not use TanStack Query with range/filter keys; it uses ad-hoc `useEffect` and does not provide loading skeletons, error retry banners, or controls for date range / service / assignee.
   - No `Cache-Control: no-store` header is emitted on dashboard responses.

---

## 2. Comprehensive Inventory of Static Sources

| # | File | Line(s) | Static Source Description | Impact |
|---|---|---|---|---|
| **1** | `frontend/src/pages/admin/AdminDashboard.tsx` | 26-28 | `useState(42)`, `useState(6)`, `useState(18)` | Fallback KPI numbers 42, 6, 18 shown on load |
| **2** | `frontend/src/pages/admin/AdminDashboard.tsx` | 31-38 | Initial `enquiries` state with 6 hardcoded demo leads | Shows demo client names on initial render |
| **3** | `frontend/src/pages/admin/AdminDashboard.tsx` | 151-184 | Synthetic `monthlyData` multipliers (`headlineCount * 0.45`, etc.) | Line chart displays fabricated historical trends |
| **4** | `frontend/src/pages/admin/AdminDashboard.tsx` | 256-258 | `monthLabel="Oct 2026"`, `pctChange="+18.5%..."`, `monthlyTrend={[18,24,28,31,36,headlineCount]}` | Hard-coded sparkline and percentage change |
| **5** | `frontend/src/pages/admin/AdminDashboard.tsx` | 267 | `'3 scheduled morning • 3 afternoon'` | Hardcoded split text when count is 6 |
| **6** | `frontend/src/pages/admin/AdminDashboard.tsx` | 276 | `headlineCount === 42 && convertedCount === 18 ? 42.8 : ...` | Hardcoded 42.8% conversion rate fallback |
| **7** | `frontend/src/components/admin/BentoDataWidgets.tsx` | 182-187 | `serviceStats = [{ name: 'Health Insurance', rate: '48.2%'... }]` | Tile F displays static conversion rates |
| **8** | `frontend/src/components/admin/BentoDataWidgets.tsx` | 440-445 | `followups = [{ id: 'F1', name: 'Rajeshbhai Patel'... }]` | Tile H displays static mock follow-ups |
| **9** | `frontend/src/components/admin/BentoDataWidgets.tsx` | 480 | `All follow-ups (6)` | Static link text with hard-coded count 6 |
| **10** | `frontend/src/layouts/AdminLayout.tsx` | 15 | `<AdminShell dueFollowupsCount={6}>` | Sidebar follow-up badge permanently frozen at 6 |
| **11** | `backend/app/routers/admin.py` | 132-143 | `get_service_reports` returns `{ "services": [{"count": 42}, ...] }` | Reports endpoint returns fixed literals |
| **12** | `backend/app/routers/admin.py` | 145-157 | `get_conversion_reports` returns `{ "conversion_rate": 22.4, "stages": {...} }` | Conversion reports returns fixed literals |
| **13** | `backend/app/routers/admin.py` | 116-130 | `get_followups` returns static `"Kishore Shah"` lead | Legacy followups endpoint returns static fixture |
| **14** | `backend/app/api/v1/endpoints/admin.py` | 51-70 | `get_dashboard` monthly trends uses UTC `now` and naive SQLite `strftime` | Skews date buckets across midnight IST |
| **15** | `frontend/src/pages/admin/AdminFollowups.tsx` | 49-57 | `activeList.forEach((item, index) => { if (index % 3 === 0)... })` | Follow-ups bucketed by index modulo rather than real dates |

---

## 3. Empty DB vs Populated DB Verification

Testing against `http://127.0.0.1:8000/api/v1/admin/dashboard`:
- **With Empty Database (0 records)**:
  - `total_enquiries`: 0
  - `new_enquiries`: 0
  - `in_progress_enquiries`: 0
  - `resolved_enquiries`: 0
  - `service_breakdown`: `[]`
  - `monthly_trends`: 6 months with count 0
  - `recent_enquiries`: `[]`
- **Frontend Behavior**:
  - The frontend received `total_enquiries = 0`, but because `HeadlineTile`, `ServiceConversionTile`, and `TodayFollowupsTile` contained hard-coded props and internal fixtures, tiles F and H continued rendering 48.2%, 54.0%, and fake follow-ups.
  - The sidebar badge continued displaying `6` because `AdminLayout.tsx` passed `dueFollowupsCount={6}`.

---

## 4. Remediation Architecture

### Backend:
1. Implement a unified `DashboardAnalyticsService` computing true SQLAlchemy aggregates from the database.
2. Support timezone-aware date parsing using `zoneinfo.ZoneInfo("Asia/Kolkata")` for:
   - "today": `00:00:00` to `23:59:59` IST
   - "this month": 1st of month `00:00:00` IST to end of month IST
   - Previous period comparison: identical duration immediately preceding the selected range.
3. Compute `change_pct` accurately: `((current - previous) / previous) * 100` if `previous > 0`, else `None` (never fabricate).
4. Return zero-filled structures for:
   - `by_status`: all 6 statuses (`new`, `contacted`, `qualified`, `in_progress`, `resolved`, `closed`).
   - `by_service`: all 6 canonical services (`mutual-funds`, `general-insurance`, `life-insurance`, `health-insurance`, `equity`, `other-solutions`).
   - `by_source`: `Website`, `Phone call`, `Walk-in`, `WhatsApp`, `Referral`, `Other`.
   - `by_month`: zero-filled array of ISO month buckets (`YYYY-MM`) with both `enquiries` and `conversions`.
5. Implement `GET /api/v1/admin/followups/count` returning `{ due_today, overdue, total_active }`.
6. Add indexes on `enquiries` table: `(created_at, status, deleted_at, is_demo, assigned_to)`.
7. Enforce role scoping: Staff/Editor users only see leads assigned to them or unassigned; Super Admin and Admin see all leads.
8. Add response header `Cache-Control: no-store`.

### Frontend:
1. Replace manual state and hard-coded defaults in `AdminDashboard.tsx` with dynamic query layer.
2. Add dashboard header controls: Date Range dropdown (`30d`, `90d`, `12m`, `custom`), Service filter, Assignee filter, and "Last updated" with manual Refresh button.
3. Update `BentoWidgets.tsx` and `BentoDataWidgets.tsx`:
   - Pass real `monthlyTrend` and `changePct` to `HeadlineTile`.
   - Pass dynamic `serviceStats` to `ServiceConversionTile` with clean empty state when 0.
   - Pass dynamic `followups` to `TodayFollowupsTile` with clean empty state when 0.
4. Wire `AdminShell` and `AdminSidebar` to `GET /api/v1/admin/followups/count` so the badge accurately reflects live database records and disappears at 0.

