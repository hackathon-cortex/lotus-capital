# Lotus Capital — Backend Implementation Plan

## 1. Executive Summary & Existing Architecture
Lotus Capital requires a production-grade FastAPI and PostgreSQL backend service designed to serve the public website and administrative enquiry management portal for financial services operating out of Godhra, Gujarat, India.

### Architecture Topology
- **Layer 1: Gateway & Middleware**: CORS policy, request-ID logging, exception handlers, rate limiters.
- **Layer 2: API Endpoints (`api/v1/endpoints/`)**: REST controllers for Health, Enquiries, Statistics, Content, Authentication, Admin workflows, Media, SEO, and Audit.
- **Layer 3: Core Domain Services (`services/`)**: Business orchestration, enquiry processing, compliance filters (Tier A/B/C statistical security), Argon2 JWT authorization, email notifications.
- **Layer 4: Data Repositories (`repositories/`)**: Encapsulated query logic.
- **Layer 5: Database ORM (`models/` & `db/`)**: SQLAlchemy 2.0 with connection pooling, Alembic migrations, supporting PostgreSQL for production and SQLite for local development and pytest tests.

---

## 2. Identified Functional Modules & Gaps
1. **Public Enquiry Handling**:
   - Capture customer interest without violating privacy.
   - Strictly prohibit collection of sensitive financial credentials (PAN, Aadhaar, netbanking passwords, OTPs).
   - Generate unique public tracking codes (`LC-XXXXXXXX`).
   - Validate 10-digit Indian mobile numbers (`^[6-9]\d{9}$`).
   - Support multiple service associations (`service_detail[]`).
2. **Compliance & Tiered Statistics**:
   - **Tier A**: Publicly verified and approved metrics. Expose ONLY when `approval_status == 'approved'` AND `as_of_date is not null`.
   - **Tier B**: Pending confirmation metrics; strictly withheld from public output.
   - **Tier C**: Highly restricted performance metrics (e.g., Equity CAGR). Forbidden from public display under AMFI/SEBI regulations prohibiting guaranteed return representations.
3. **Admin Authentication & RBAC**:
   - Replace any frontend mock login with real Argon2 password hashing and JWT access/refresh token pairs.
   - Roles: `super_admin` (full permissions, user management, audit logs), `admin` (enquiry workflows, approvals), `editor` (draft creation and edits).
   - Account active status checks and login rate limiting.
4. **Admin Dashboard & Management**:
   - Aggregate enquiry metrics, status counts, monthly trends.
   - Enquiry status transitions: `new` -> `contacted` -> `in_progress` -> `resolved` -> `closed`.
   - Content management with draft, published, and archived states.
5. **Notification & Media Services**:
   - SMTP notification dispatch for new incoming enquiries with mock fallback for local environments.
   - Media upload validation (safe filenames, MIME types, size thresholds).

---

## 3. Database Schema Specification

### A. `admin_users`
- `id`: Integer Primary Key, Auto-increment.
- `full_name`: String(100), Not Null.
- `email`: String(255), Unique, Indexed, Not Null.
- `password_hash`: String(255), Not Null (Argon2).
- `role`: Enum (`super_admin`, `admin`, `editor`), Default `editor`, Not Null.
- `is_active`: Boolean, Default True, Not Null.
- `is_superuser`: Boolean, Default False, Not Null.
- `created_at`: DateTime(timezone=True), Server Default UTC now.
- `updated_at`: DateTime(timezone=True), OnUpdate UTC now.
- `last_login_at`: DateTime(timezone=True), Nullable.

### B. `enquiries`
- `id`: Integer Primary Key, Auto-increment.
- `reference_id`: String(32), Unique, Indexed, Not Null (`LC-XXXXXXXX`).
- `name`: String(100), Not Null.
- `mobile`: String(15), Indexed, Not Null.
- `email`: String(255), Nullable.
- `contact_method`: Enum (`phone`, `email`, `whatsapp`), Default `phone`, Not Null.
- `message`: Text, Nullable.
- `consent`: Boolean, Not Null (must be True).
- `status`: Enum (`new`, `contacted`, `in_progress`, `resolved`, `closed`), Default `new`, Indexed, Not Null.
- `assigned_to`: Integer ForeignKey (`admin_users.id`), Nullable.
- `created_at`: DateTime(timezone=True), Server Default UTC now, Indexed.
- `updated_at`: DateTime(timezone=True), OnUpdate UTC now.

### C. `enquiry_services`
- `id`: Integer Primary Key, Auto-increment.
- `enquiry_id`: Integer ForeignKey (`enquiries.id`, ondelete="CASCADE"), Not Null.
- `service_slug`: String(64), Indexed, Not Null.
- `service_detail`: String(128), Nullable.

### D. `statistics`
- `id`: Integer Primary Key, Auto-increment.
- `statistic_key`: String(64), Unique, Indexed, Not Null.
- `label`: String(128), Not Null.
- `value`: String(64), Not Null.
- `tier`: Enum (`Tier A`, `Tier B`, `Tier C`), Not Null.
- `approval_status`: Enum (`draft`, `pending`, `approved`, `withheld`), Default `pending`, Not Null.
- `definition`: Text, Nullable.
- `as_of_date`: Date, Nullable.
- `approved_by`: Integer ForeignKey (`admin_users.id`), Nullable.
- `approved_at`: DateTime(timezone=True), Nullable.
- `updated_at`: DateTime(timezone=True), OnUpdate UTC now.

### E. `contents`
- `id`: Integer Primary Key, Auto-increment.
- `content_type`: Enum (`page`, `service`, `faq`, `insight`, `seo`, `disclaimer`), Not Null.
- `slug`: String(128), Indexed, Not Null.
- `title`: String(255), Not Null.
- `content_json`: JSON / Text, Not Null.
- `status`: Enum (`draft`, `published`, `archived`), Default `draft`, Indexed, Not Null.
- `created_by`: Integer ForeignKey (`admin_users.id`), Nullable.
- `updated_by`: Integer ForeignKey (`admin_users.id`), Nullable.
- `created_at`: DateTime(timezone=True), Server Default UTC now.
- `updated_at`: DateTime(timezone=True), OnUpdate UTC now.

### F. `media`
- `id`: Integer Primary Key, Auto-increment.
- `filename`: String(255), Not Null.
- `original_name`: String(255), Not Null.
- `file_path`: String(512), Not Null.
- `mime_type`: String(100), Not Null.
- `file_size`: Integer, Not Null.
- `uploaded_by`: Integer ForeignKey (`admin_users.id`), Nullable.
- `created_at`: DateTime(timezone=True), Server Default UTC now.

### G. `audit_logs`
- `id`: Integer Primary Key, Auto-increment.
- `user_id`: Integer ForeignKey (`admin_users.id`), Nullable.
- `action`: String(64), Not Null.
- `entity_type`: String(64), Not Null.
- `entity_id`: String(64), Nullable.
- `metadata_json`: JSON / Text, Nullable.
- `ip_address`: String(64), Nullable.
- `created_at`: DateTime(timezone=True), Server Default UTC now, Indexed.

---

## 4. Authentication & RBAC Design
1. **Passwords**: Argon2id hashing algorithm via `passlib` or `argon2-cffi`. Plaintext passwords are never persisted.
2. **Tokens**:
   - Access Token: RS256 or HS256 JWT, 30 min lifetime.
   - Refresh Token: High-entropy string / token with 7 days validity.
3. **Role Capabilities**:
   - `super_admin`: Full database access, admin user creation/modification, audit inspection, review of restricted Tier C statistics.
   - `admin`: Full enquiry management, status updates, approval of Tier A & Tier B statistics, content publication.
   - `editor`: Viewing enquiries, creating/editing draft content, submitting statistics for approval.

---

## 5. Security & Rate Limiting Requirements
- **CORS**: Explicit whitelist defined in `FRONTEND_ORIGINS`.
- **Enquiry Limiter**: Maximum 5 submissions per IP per 10-minute window.
- **Login Limiter**: Maximum 5 failed attempts per IP / email per 15-minute window.
- **Sanitization**: Escape HTML strings, validate Indian phone regex, reject any submission containing credit card or banking keywords.

---

## 6. Testing Strategy
- Unit and integration tests using `pytest` and `httpx.AsyncClient` / `TestClient`.
- In-memory SQLite session fixtures with automatic rollback.
- Coverage:
  1. Health endpoint.
  2. Enquiry submission validation, phone number validation, consent enforcement, duplicate detection, and reference ID generation.
  3. Statistics filtering: Tier A approved visible, Tier B pending hidden, Tier C strictly withheld.
  4. Authentication: login, Argon2 verification, token expiration, inactive user rejection, RBAC restrictions.
  5. Content lifecycle: Draft vs Published separation.

---

## 7. Implementation Roadmap
- **Phase 1**: Workspace layout and core configuration (`config.py`, `security.py`, `exceptions.py`, `logging.py`).
- **Phase 2**: SQLAlchemy ORM models, session management, database bootstrapping (`init_db.py`).
- **Phase 3**: Repositories and domain services (Enquiries, Statistics, Content, Auth, Email, Audit).
- **Phase 4**: FastAPI routers and endpoints (`api/v1/endpoints/`).
- **Phase 5**: Alembic database migrations.
- **Phase 6**: Comprehensive pytest test suite.
- **Phase 7**: End-to-end verification and documentation (`docs/BACKEND_API_REFERENCE.md`).
