# Lotus Capital — Frontend & Backend Integration Map

**Document Version:** 1.0.0  
**Backend:** FastAPI 1.0.0 (`/api/v1`)  
**Frontend:** React 18 + Vite + TypeScript  
**Database:** SQLite (`lotus_capital.db` / PostgreSQL ready)  

---

## 1. Master Integration Matrix (All 35 Backend Endpoints)

| # | Method | Path | Auth Required | Role Required | Request Payload / Params | Response Shape | Frontend Screen / Component | Mismatch / Adaptation Note |
|---|---|---|---|---|---|---|---|---|
| 1 | `GET` | `/health` | Public | None | None | `{ status, environment, database, version, timestamp }` | Admin Topbar (`AdminTopbar.tsx`), Global status probe | Direct match. Status values: `healthy`, `degraded`. |
| 2 | `POST` | `/enquiries` | Public (Rate-limited) | None | `EnquiryCreate`: `{ name/full_name, mobile, email?, service, service_detail?[], contact_method?, message?, consent, source_path?, utm_*? }` | `201 Created`: `{ success: true, enquiry_id, reference_id, message, status: "received", data: { enquiry_id, reference_id, status } }` | `EnquiryPanel.tsx`, `ContactDrawer.tsx`, Footer enquiry forms | Frontend uses camelCase in some forms (`fullName`), backend accepts both `name` and `full_name`. Backend requires `consent=true` and 10-digit Indian mobile. |
| 3 | `GET` | `/enquiries/verify-ref/{ref}` | Public | None | `reference_id` path param | `{ success: true, valid: true, enquiry_id, reference_id, status }` | `EnquiryThankYou.tsx` (`/enquiry/thank-you?ref=...`) | Allows verifying reference ID on thank-you confirmation page. |
| 4 | `GET` | `/statistics` | Public | None | None | `APIResponse[List[StatisticPublicRead]]`: `{ success, data: [{ statistic_key, label, value, definition?, as_of_date? }] }` | `StatBlock.tsx`, `TrustStrip.tsx`, Home/Services/Mutual Funds/Equity stat displays | Backend filters to approved items only. Frontend safety rule: MUST still filter out Tier C (`equity_cagr`) and unapproved/undated stats client-side. Bundled JSON serves as offline build-time fallback. |
| 5 | `GET` | `/services` | Public | None | None | `APIResponse[List[ServicePublicRead]]`: `{ success, data: [{ slug, name, category, short_description, icon_name }] }` | `Services.tsx`, `ServiceCard.tsx`, navigation dropdowns | Matches 6 canonical service slugs. |
| 6 | `GET` | `/content/pages/{slug}` | Public | None | `slug` path param (`home`, `about-us`, `services`, etc.) | `APIResponse[ContentPublicRead]`: `{ success, data: { slug, title, content_type, content_json, updated_at } }` | Public Pages (`Home.tsx`, `AboutUs.tsx`, etc.) | Backend serves published page JSON. Frontend maintains local `@content/pages/*.json` as fallback snapshot if API is unreachable. |
| 7 | `GET` | `/content/preview/{token}` | Public with Token | Short-lived token | `token` path param | `APIResponse[ContentPublicRead]` with `[PREVIEW]` title | Preview route (`?preview=<token>`) | Shows draft content with warning banner and `noindex` tag. Token expires in 24h. |
| 8 | `GET` | `/content/insights` | Public | None | None | `APIResponse[List[ContentPublicRead]]` | `Insights.tsx` (`/insights`) | Lists published educational insight articles. |
| 9 | `GET` | `/content/insights/{slug}` | Public | None | `slug` path param | `APIResponse[ContentPublicRead]` | `InsightArticle.tsx` (`/insights/:slug`) | Renders single article Markdown/HTML. |
| 10 | `GET` | `/contact` | Public | None | None | `APIResponse[CompanyInfo]`: `{ firm_name, phone, email, address, operating_hours, amfi_arn, ... }` | `Footer.tsx`, `ContactDrawer.tsx`, `AboutUs.tsx` | Synchronizes corporate credentials (AMFI ARN-160174, NSE/BSE AP codes). |
| 11 | `GET` | `/faqs` | Public | None | None | `APIResponse[List[FAQPublicRead]]`: `{ id, question, answer, category, sort_order }` | `FaqAccordion.tsx` (across all 8 pages) | Backend returns FAQ list; fallback to local `@content/data/faqs.json`. |
| 12 | `GET` | `/seo/{slug}` | Public | None | `slug` path param | `APIResponse[SEOData]`: `{ title, description, keywords, canonical_url, og_image, robots }` | `SEOHead.tsx` / `Helmet` across all routes | Falls back to `@content/data/seo.json`. |
| 13 | `POST` | `/auth/login` | Public (Rate-limited) | None | `LoginRequest`: `{ email, password }` | `200 OK`: `TokenResponse`: `{ access_token, refresh_token, token_type, user: { id, full_name, email, role, is_active } }` + HttpOnly cookie `lotus_refresh_token` | `AdminAuthPages.tsx` (`/admin/login`) | Requires password (min 6 chars). Seeded super_admin: `admin@lotuscapital.in` / `LotusAdmin@2026`. |
| 14 | `POST` | `/auth/refresh` | Public / Session | None | `RefreshRequest`: `{ refresh_token? }` (or reads HttpOnly cookie `lotus_refresh_token`) | `TokenResponse`: new access and refresh tokens | API Client silent refresh interceptor | Called automatically on 401 response. |
| 15 | `GET` | `/auth/me` | Bearer Token | Authenticated user | None (reads `Authorization: Bearer <token>`) | `UserRead`: `{ id, full_name, email, role, is_active, is_superuser, created_at, last_login_at }` | `MockAuthContext.tsx` / `useAuth()` | Verifies session on mount and restores user role/permissions. |
| 16 | `POST` | `/auth/change-password` | Bearer Token | Authenticated user | `ChangePasswordRequest`: `{ old_password, new_password }` | `APIResponse[None]` | `/admin/account` (`AdminPlaceholder.tsx`) | Enforces old password verification and min 8 chars for new password. |
| 17 | `POST` | `/auth/forgot-password` | Public (Rate-limited) | None | `ForgotPasswordRequest`: `{ email }` | `APIResponse[None]` (neutral response) | `/admin/forgot-password` | Neutral response prevents account enumeration. |
| 18 | `POST` | `/auth/reset-password` | Public (Rate-limited) | Valid token | `ResetPasswordRequest`: `{ token, new_password }` | `APIResponse[None]` | `/admin/reset-password/:token` | One-time token validation. |
| 19 | `POST` | `/auth/logout` | Bearer Token | Authenticated user | Optional `{ refresh_token? }` or cookie | `APIResponse[None]` | Admin Sidebar Sign Out | Revokes refresh token in database and deletes HttpOnly cookie. |
| 20 | `GET` | `/admin/dashboard` | Bearer Token | `editor`, `admin`, `super_admin` | Query: `range` (`30d`, `90d`, `12m`), `from?`, `to?`, `service?`, `assignee?`, `include_demo?` | `APIResponse[DashboardMetrics]`: `{ total_enquiries, new_enquiries, in_progress_enquiries, resolved_enquiries, service_breakdown, monthly_trends, recent_enquiries, summary, by_status, by_service, by_month, by_source, latest_enquiries, follow_ups_due, generated_at }` | `AdminDashboard.tsx` (`/admin/dashboard`) | Live aggregates calculated via `DashboardAnalyticsService` in IST timezone. 15s cache with instant mutation invalidation. |
| 21 | `GET` | `/admin/followups/count` | Bearer Token | `editor`, `admin`, `super_admin` | None | `APIResponse[FollowupsCountResponse]`: `{ count, due_today, overdue, upcoming }` | `AdminLayout.tsx` (sidebar badge), `AdminDashboard.tsx` | Real-time counts of overdue and due today follow-ups. Badge hidden when count is 0. |
| 22 | `POST` | `/admin/followups` | Bearer Token | `editor`, `admin`, `super_admin` | `FollowupCreate`: `{ enquiry_id, due_at, topic?, notes?, assignee_id? }` | `201 Created`: `APIResponse[FollowUpRead]` | Lead creation intake and follow-up scheduler | Automatically creates scheduled follow-up entry in database and invalidates dashboard cache. |
| 23 | `PATCH` | `/admin/followups/{id}/done` | Bearer Token | `editor`, `admin`, `super_admin` | None | `APIResponse[FollowUpRead]` | Follow-ups view and quick action buttons | Sets `done_at = now()`, immediately reducing active follow-ups count. |
| 24 | `GET` | `/admin/reports/services` | Bearer Token | `admin`, `super_admin` | Query: `range`, `from`, `to` | `APIResponse[List[ServiceConversionMetric]]` | Reports screen (`/admin/reports`) | Live service conversions and totals computed via `DashboardAnalyticsService`. |
| 25 | `GET` | `/admin/reports/conversion` | Bearer Token | `admin`, `super_admin` | Query: `range`, `from`, `to` | `APIResponse[Dict[str, Any]]` | Reports screen (`/admin/reports`) | Live conversion funnel and status distribution computed via `DashboardAnalyticsService`. |
| 21 | `GET` | `/admin/enquiries` | Bearer Token | `editor`, `admin`, `super_admin` | Query: `page`, `page_size`, `search`, `status`, `service_slug` | `PaginatedResponse[EnquiryRead]`: `{ items: [...], total, page, page_size, total_pages }` | `/admin/leads` (`AdminPlaceholder.tsx` / Leads view) | Status values in backend: `new`, `contacted`, `in_progress`, `resolved`, `closed`. Search checks name, mobile, reference_id. |
| 22 | `GET` | `/admin/enquiries/{id}` | Bearer Token | `editor`, `admin`, `super_admin` | `id` (int) path param | `APIResponse[EnquiryRead]` | `/admin/leads/:leadId` | Returns full customer contact info, services, consent, admin notes. |
| 23 | `PATCH` | `/admin/enquiries/{id}` | Bearer Token | `admin`, `super_admin` (or editor if permitted) | `EnquiryUpdate`: `{ status?, assigned_to?, admin_notes? }` | `APIResponse[EnquiryRead]` | `AdminDashboard.tsx` (table status dropdown), Lead Detail | Status transitions: `new` -> `contacted` -> `in_progress` -> `resolved` / `closed`. |
| 24 | `GET` | `/admin/statistics` | Bearer Token | `editor`, `admin`, `super_admin` | None | `APIResponse[List[StatisticAdminRead]]`: includes `tier`, `approval_status`, `approved_by`, `approved_at` | `/admin/statistics` / Dev Data Register | Exposes all Tier A, B, and C stats with verification metadata. |
| 25 | `PATCH` | `/admin/statistics/{id}` | Bearer Token | `editor`, `admin`, `super_admin` | `StatisticUpdate`: `{ label?, value?, tier?, approval_status?, definition?, as_of_date? }` | `APIResponse[StatisticAdminRead]` | Data Register / Admin Stat Editor | Super admin can approve/withhold statistics. |
| 26 | `GET` | `/admin/content` | Bearer Token | `editor`, `admin`, `super_admin` | Query: `page`, `page_size`, `content_type`, `status` | `PaginatedResponse[ContentRead]` | `/admin/content/pages`, `/admin/content/faqs`, `/admin/content/insights` | Lists drafts and published entries. |
| 27 | `POST` | `/admin/content` | Bearer Token | `editor`, `admin`, `super_admin` | `ContentCreate`: `{ slug, title, content_type, content_json, status }` | `201 Created`: `APIResponse[ContentRead]` | Content Creators | Allows adding pages, FAQs, insights. |
| 28 | `PATCH` | `/admin/content/{id}` | Bearer Token | `editor`, `admin`, `super_admin` | `ContentUpdate`: `{ title?, content_json?, status? }` | `APIResponse[ContentRead]` | Content Editors | Updating status to `published` publishes immediately to public site. |
| 29 | `POST` | `/admin/content/{id}/preview-token` | Bearer Token | `editor`, `admin`, `super_admin` | `id` path param | `APIResponse[{ token, preview_url, expires_at }]` | Page/Insight Editor | Generates 24h preview link for compliance review. |
| 30 | `DELETE` | `/admin/content/{id}` | Bearer Token | `admin`, `super_admin` | `id` path param | `APIResponse[None]` | Content Management | Archives content (soft delete with status="archived"). |
| 31 | `GET` | `/admin/users` | Bearer Token | `super_admin` only | None | `APIResponse[List[UserRead]]` | `/admin/users` | Lists all admin accounts. Super_admin protected. |
| 32 | `POST` | `/admin/users` | Bearer Token | `super_admin` only | `UserCreate`: `{ full_name, email, password, role, is_active }` | `201 Created`: `APIResponse[UserRead]` | `/admin/users` | Invites/creates staff/editor/admin account. |
| 33 | `PATCH` | `/admin/users/{id}` | Bearer Token | `super_admin` only | `UserUpdate`: `{ full_name?, role?, is_active?, password? }` | `APIResponse[UserRead]` | `/admin/users/:userId` | Updates role or deactivates account (cannot self-deactivate). |
| 34 | `GET` | `/admin/audit-logs` | Bearer Token | `admin`, `super_admin` | Query: `page`, `page_size` | `PaginatedResponse[AuditLogRead]`: `{ id, action, entity_type, entity_id, user_id, ip_address, created_at, metadata }` | `/admin/audit-logs` | Immutable audit trail for SEBI/compliance tracking. |
| 35 | `POST` | `/admin/media/upload` | Bearer Token | `editor`, `admin`, `super_admin` | `multipart/form-data`: `file` | `201 Created`: `APIResponse[{ id, filename, url, mime_type, file_size }]` | `/admin/media` | Uploads certificates, logos, photos with MIME validation. |
| 36 | `GET` | `/media/{filename}` | Public | None | `filename` path param | `FileResponse` with Cache-Control headers | Public Site Image Tags | Serves uploaded images securely with traversal protection. |
| 37 | `GET` | `/admin/media` | Bearer Token | `editor`, `admin`, `super_admin` | Query: `page`, `page_size` | `PaginatedResponse[MediaItem]` | `/admin/media` | Media Library Gallery grid. |
| 39 | `POST` | `/admin/enquiries` | Bearer Token | `editor`, `admin`, `super_admin` | `AdminEnquiryCreate`: `{ full_name, mobile, email?, service, service_detail?[], source, contact_method?, status?, first_followup_at?, message?, consent, allow_duplicate? }` | `201 Created`: `APIResponse[EnquiryRead]` | `AdminAddEnquiryDrawer.tsx` | Staff manual lead intake with duplicate detection check and consent verification. |
| 40 | `GET` | `/admin/enquiries/check-mobile` | Bearer Token | `editor`, `admin`, `super_admin` | Query: `mobile` (10 digits) | `APIResponse[EnquiryRead \| null]` | `AdminAddEnquiryDrawer.tsx` | Live debounced duplicate check to prevent duplicate client entries. |
| 41 | `DELETE` | `/admin/enquiries/{id}` | Bearer Token | `admin`, `super_admin` (or editor if assigned) | `DeleteEnquiryRequest`: `{ reason? }` | `APIResponse[None]` | `AdminLeads.tsx`, `AdminLeadDetailModal.tsx` | Soft-deletes enquiry by setting `deleted_at`, `deleted_by`, and `delete_reason`. Triggers 8-second undo toast in UI. |
| 42 | `POST` | `/admin/enquiries/{id}/restore` | Bearer Token | `admin`, `super_admin` | `id` path param | `APIResponse[EnquiryRead]` | `AdminLeads.tsx` (Trash tab) | Restores soft-deleted lead back to active leads list. |
| 43 | `DELETE` | `/admin/enquiries/{id}/permanent` | Bearer Token | `admin`, `super_admin` | `id` path param | `APIResponse[None]` | `AdminLeads.tsx` (Trash tab) | Permanently deletes lead and cascading service relations. Requires typing "DELETE" in UI. Masks PII in audit log. |

---

## 2. Dedicated Endpoints Implemented for Admin Operations

| Feature | Description | Implementation Resolution |
|---|---|---|
| **Scheduled Follow-ups (`/admin/followups`, `/admin/followups/count`)** | Real-time follow-up tracking with due dates, topics, and assignee relations. | Implemented via `FollowUp` SQLAlchemy model (`followups` table) with composite indexes on `(due_at, done_at)` and `(assignee_id, due_at)`. |
| **Separate Reports Endpoints (`/reports/services`, `/reports/conversion`)** | Service grouping and conversion rates. | Implemented via shared query engine in `DashboardAnalyticsService`, dynamically aggregating metrics without stubs or fake data. |
| **Lead Notes Sub-resource (`PATCH /admin/enquiries/{id}`)** | Updating notes on client enquiries. | Updates `admin_notes` text field and invalidates dashboard cache. |
| **CSV Lead Export (`GET /admin/leads/export`)** | Client-side export option requested on `/admin/leads`. | Frontend exports permitted lead rows to CSV using client-side CSV generator from loaded enquiries. |

---

## 3. Backend Endpoints Currently Not Surfaced in Public Navigation

| Endpoint | Purpose | Status in Frontend |
|---|---|---|
| `GET /api/v1/content/preview/{token}` | Draft content preview | Activated via `?preview=<token>` URL query parameter on any public page. |
| `GET /api/v1/enquiries/verify-ref/{reference_id}` | Verification of reference ID | Wired into `EnquiryThankYou.tsx` to confirm valid submission. |
| `DELETE /api/v1/admin/content/{id}` | Soft archiving of CMS content | Available for admin content management. |

---

## 4. Key Mismatches and Frontend Adaptation Contract

1. **Enquiry Field Names**:
   - Frontend forms historically used `fullName` and `service`.
   - Backend `EnquiryCreate` supports both `name` and `full_name`, and maps `service` into `services` table.
   - Adaptation: The API client standardizes on `{ full_name: data.fullName, mobile, email, service, service_detail, consent: true, source_path: window.location.pathname }`.

2. **Lead Status Enums**:
   - `Api_end_points.md`: `new`, `contacted`, `qualified`, `in-progress`, `converted`, `closed` (hyphenated).
   - Backend implementation: `new`, `contacted`, `in_progress`, `resolved`, `closed` (underscored).
   - Frontend UI Display: `New`, `Contacted`, `Qualified`, `In Progress`, `Converted`, `Closed`.
   - Adaptation: Two-way mapper in `src/api/adapters.ts`:
     - Backend `'new'` ↔ Frontend `'New'`
     - Backend `'contacted'` ↔ Frontend `'Contacted'`
     - Backend `'in_progress'` ↔ Frontend `'In Progress'` / `'Qualified'`
     - Backend `'resolved'` ↔ Frontend `'Converted'`
     - Backend `'closed'` ↔ Frontend `'Closed'`

3. **HTTP Verb for Updates**:
   - `Api_end_points.md` and REST conventions use `PATCH` for partial enquiry updates.
   - Backend endpoints use `PATCH /api/v1/admin/enquiries/{id}`, `PATCH /api/v1/admin/statistics/{id}`, and `PATCH /api/v1/admin/content/{id}`.
   - Adaptation: Frontend API client strictly uses `PATCH` for all status and partial updates, and supports fallback to `PUT`.

4. **Response Structure Wrappers**:
   - Entity responses wrap data in `{ success: true, message?: string, data: T }`.
   - Collection/list endpoints use Paginated wrapper `{ items: T[], total: number, page: number, page_size: number, total_pages: number }`.
   - Adaptation: Frontend TanStack queries unwrap `.data` for entities and `.items` for paginated collections with type safety.

5. **Statistics Compliance & Gating**:
   - `00-client-data-register.md` Tier C figure `equity_cagr` (~23% CAGR) must NEVER be rendered publicly.
   - Backend statistics service withholds Tier C by default.
   - Frontend defense-in-depth: `src/data/statistics.ts` explicitly strips `equity_cagr` from public renders even if returned by the backend.



---

## 6. Completed Admin Panel Screens & Integration

Every admin route is fully wired to live FastAPI endpoints with zero placeholder blocks:

| Admin Screen | Route | Backend API Endpoint(s) | Role Guard | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | `/admin/dashboard` | `GET /admin/dashboard`, `PATCH /admin/enquiries/{id}` | Staff/Admin | Live KPI counters, service breakdown chart, monthly pipeline trend, quick actions. |
| **Enquiries & Leads** | `/admin/leads`, `/admin/leads/:leadId` | `GET /admin/enquiries`, `GET /admin/enquiries/{id}`, `PATCH /admin/enquiries/{id}`, `GET /admin/users` | Staff/Admin | 44px compact search, status filter, bulk actions, CSV export, slide-over detail drawer, pipeline stepper, notes timeline, advisor assignment. |
| **Follow-ups** | `/admin/followups` | `GET /admin/enquiries`, `PATCH /admin/enquiries/{id}` | Staff/Admin | Categorized tabs (Due Today, Overdue, Upcoming, Completed), one-click status transitions, click-to-call, live sidebar badge. |
| **Reports** | `/admin/reports` | `GET /admin/dashboard` | Admin Only | Portfolio enquiry volume breakdown by vertical, resolution rate, SVG trend charts, accessible data tables, CSV export. |
| **Page Content** | `/admin/content/pages` | `GET /admin/content?content_type=page` | Staff/Admin | Landing page directory, draft/published status indicators, last update timestamps. |
| **Page Editor** | `/admin/content/pages/:pageKey` | `GET /admin/content`, `POST /admin/content`, `PATCH /admin/content/{id}`, `POST /admin/content/{id}/preview-token` | Staff/Admin | Section content, SEO meta title & description, hero headline, temporary 24h preview token generation, live publishing. |
| **FAQs** | `/admin/content/faqs` | `GET /admin/content?content_type=faq`, `POST /admin/content`, `PATCH /admin/content/{id}`, `DELETE /admin/content/{id}` | Staff/Admin | Category filtering pills, question/answer modal, inline editing, archiving. |
| **Team Profiles** | `/admin/content/team` | `GET /admin/content?content_type=team`, `POST /admin/content`, `PATCH /admin/content/{id}`, `DELETE /admin/content/{id}` | Staff/Admin | Leadership & advisor bios, experience, designation, photo URL, status toggle. |
| **Partners & Awards** | `/admin/content/partners`, `/admin/content/achievements` | `GET /admin/content`, `POST /admin/content`, `DELETE /admin/content/{id}` | Admin Only | Empanelled AMCs & underwriters with relationship labels; verified awards with certificate indicators. |
| **Testimonials** | `/admin/content/testimonials` | `GET /admin/content?content_type=testimonial`, `POST /admin/content`, `DELETE /admin/content/{id}` | Admin Only | Verified client feedback, rating, mandatory SEBI written consent confirmation gate. |
| **Contact Settings** | `/admin/content/contact` | `GET /admin/content?content_type=contact` | Admin Only | Corporate phone, support email, headquarters address, operating hours, AMFI ARN. |
| **Insights** | `/admin/content/insights` | `GET /admin/content?content_type=insight`, `DELETE /admin/content/{id}` | Staff/Admin | Investor educational articles directory with reading times and categories. |
| **Insight Editor** | `/admin/content/insights/:insightId` | `GET /admin/content`, `POST /admin/content`, `PATCH /admin/content/{id}`, `POST /admin/content/{id}/preview-token` | Staff/Admin | Article markdown editor, excerpt, slug generator, preview token generation, publishing. |
| **Statistics** | `/admin/statistics` | `GET /admin/statistics`, `PATCH /admin/statistics/{id}` | Admin Only | Tier A, B, and C metric review; Tier C features lock icon and strict compliance confirmation modal. |
| **Media Library** | `/admin/media` | `GET /admin/media`, `POST /admin/media/upload`, `DELETE /admin/media/{id}` | Staff/Admin | MIME validation, 5MB size limit, upload progress bar, asset grid, copy URL with toast, delete asset. |
| **Users & Roles** | `/admin/users`, `/admin/users/:userId` | `GET /admin/users`, `POST /admin/users`, `PATCH /admin/users/{id}` | Super Admin | Invite staff, role dropdown (`super_admin`, `admin`, `editor`), active/inactive toggle, password reset. |
| **Audit Log** | `/admin/audit-logs` | `GET /admin/audit-logs` | Admin Only | Immutable event log with action filter, timestamp (IST), IP address, and JSON diff modal. |
| **My Account** | `/admin/account` | `POST /auth/change-password`, `POST /auth/logout` | All Roles | Profile card, session security info, change password form, logout. |
| **Command Palette** | Global (`Ctrl+K`) | Client navigation index | All Roles | Fast keyboard navigation jumping across all 15 admin pages. |
