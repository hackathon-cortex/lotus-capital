# Lotus Capital — Frontend Integration Contract

**Backend Version:** 1.0.0  
**Base URL:** `http://localhost:8000`  
**API Prefix:** `/api/v1` (e.g. `http://localhost:8000/api/v1`)  
**Frontend Origin:** `http://localhost:5173` (with CORS credentials enabled)  

---

## 1. Quick Start & Server Execution

```bash
# In the backend workspace root:
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- **Interactive API Docs:** `http://localhost:8000/docs`
- **ReDoc Documentation:** `http://localhost:8000/redoc`
- **Health Check:** `http://localhost:8000/api/v1/health`

### CORS Configuration
CORS is pre-configured with `allow_credentials=True` for:
- `http://localhost:5173` (Vite dev server)
- `http://127.0.0.1:5173`
- `http://localhost:3000`
- `http://127.0.0.1:3000`

Override in `.env` with `FRONTEND_ORIGINS=http://localhost:5173,https://yourdomain.com`.

---

## 2. Default Seeded Admin Credentials

Initialized automatically on first boot into `lotus_capital.db`:
- **Email:** `admin@lotuscapital.in`
- **Password:** `LotusAdmin@2026`
- **Role:** `super_admin`
- **Full Name:** `Lotus Super Admin`

---

## 3. Authentication & Session Flow

The backend implements JWT token-based authentication with optional secure HttpOnly refresh cookie rotation:

1. **Login (`POST /api/v1/auth/login`)**:
   - Send `{ "email": "...", "password": "..." }`.
   - Returns access token (expires in 30 mins) and refresh token (expires in 7 days).
   - Also sets `lotus_refresh_token` as an HttpOnly cookie.
2. **Attaching Authorization Header**:
   - For all protected routes (`/admin/*`, `/auth/me`, `/auth/change-password`), pass:
     ```http
     Authorization: Bearer <access_token>
     ```
3. **Token Refresh (`POST /api/v1/auth/refresh`)**:
   - Call with `{ "refresh_token": "..." }` or with `credentials: "include"` to use the cookie.
   - Issues a new pair of access and refresh tokens.
4. **Logout (`POST /api/v1/auth/logout`)**:
   - Invalidate the active access token and clear the refresh cookie.

---

## 4. Standard Response & Error Format

### Standard Success Wrapper
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Paginated Success Wrapper
```json
{
  "items": [ ... ],
  "total": 42,
  "page": 1,
  "page_size": 20,
  "total_pages": 3
}
```

### Error Responses
All errors include a traceable `request_id`:
```json
{
  "success": false,
  "error_code": "NOT_FOUND",
  "message": "Requested entity not found.",
  "request_id": "7542eb633dba4fc79d442d431c3fd7fa"
}
```

- **401 Unauthorized (`UNAUTHORIZED`)**: Missing, invalid, or expired Bearer token.
- **403 Forbidden (`FORBIDDEN`)**: Insufficient user permissions for role (e.g. editor accessing super_admin endpoint).
- **422 Validation Error (`VALIDATION_ERROR`)**:
  ```json
  {
    "success": false,
    "error_code": "VALIDATION_ERROR",
    "message": "Input validation failed.",
    "details": ["body -> mobile: 10-digit Indian Mobile Number required"],
    "request_id": "..."
  }
  ```
- **429 Rate Limit Exceeded (`RATE_LIMIT_EXCEEDED`)**: Maximum 5 enquiry submissions per 10 minutes per IP.

---

## 5. Enquiry Submission Specification (`POST /api/v1/enquiries`)

### Validation Rules
- `name` / `full_name`: String, 2–100 characters (both accepted, mapped automatically).
- `mobile`: 10-digit Indian mobile number matching `^[6-9]\d{9}$`.
- `email`: Optional valid email format.
- `service`: One of `general-insurance`, `life-insurance`, `health-insurance`, `mutual-funds`, `equity`, `other-solutions`.
- `service_detail`: Array of service slugs (e.g. `["mutual-funds"]`, `["vehicle-insurance"]`, `["property-insurance"]`).
- `contact_method`: `"phone"` | `"email"` | `"whatsapp"` (defaults to `"phone"`).
- `message`: Optional string, max 1000 characters. Forbidden terms: `pan`, `aadhaar`, `otp`, `password`, `netbanking`, `cvv`.
- `consent`: Boolean, must be `true`.
- `source_path`: Public route where enquiry originated (e.g. `"/investments/mutual-funds"`).
- `utm_source`, `utm_medium`, `utm_campaign`: Optional attribution strings.

### Sample Request
```json
{
  "name": "Pooja Patel",
  "mobile": "9825012345",
  "email": "pooja@example.com",
  "service": "mutual-funds",
  "service_detail": ["mutual-funds"],
  "contact_method": "phone",
  "message": "Interested in long term compounding plan.",
  "source_path": "/investments/mutual-funds",
  "consent": true
}
```

### Sample Response (`201 Created`)
```json
{
  "success": true,
  "enquiry_id": "LC-XYMXY8R9",
  "reference_id": "LC-XYMXY8R9",
  "message": "Enquiry submitted successfully.",
  "status": "received",
  "data": {
    "enquiry_id": "LC-XYMXY8R9",
    "reference_id": "LC-XYMXY8R9",
    "status": "new"
  }
}
```

---

## 6. Complete Endpoint Directory & Real Response Samples

| Method | Endpoint | Auth | Purpose | Real Response Shape |
|---|---|---|---|---|
| `GET` | `/api/v1/health` | Public | System status | `{"status": "healthy", "environment": "development", "database": "connected", "version": "1.0.0"}` |
| `POST` | `/api/v1/enquiries` | Public | Submit customer enquiry | `{"success": true, "enquiry_id": "LC-...", "data": {"reference_id": "...", "status": "new"}}` |
| `GET` | `/api/v1/enquiries/verify-ref/{ref}` | Public | Thank-you page validation | `{"success": true, "valid": true, "enquiry_id": "LC-...", "status": "new"}` |
| `GET` | `/api/v1/statistics` | Public | Approved Tier A metrics | `{"success": true, "data": [{"statistic_key": "active_client_families", "label": "Families Served", "value": "1,500+", "as_of_date": "2026-10-01"}, {"statistic_key": "years_of_experience", "label": "Years in Financial Guidance", "value": "15+", "as_of_date": "2026-10-01"}]}` |
| `GET` | `/api/v1/services` | Public | Offered services | `{"success": true, "data": [...]}` (returns `[]` if content JSON absent) |
| `GET` | `/api/v1/faqs` | Public | Frequently asked questions | `{"success": true, "data": [...]}` (returns `[]` if content JSON absent) |
| `GET` | `/api/v1/contact` | Public | Firm contact info | `{"success": true, "data": {"name": "Lotus Capital", "city": "Godhra, Gujarat, India", "disclaimer": "..."}}` |
| `GET` | `/api/v1/content/pages/{slug}` | Public | Page CMS payload | `{"success": true, "data": {"slug": "home", "title": "...", "content_json": {...}}}` |
| `GET` | `/api/v1/content/insights` | Public | Published insight articles | `{"success": true, "data": [{"slug": "understanding-power-of-compounding-sip", ...}]}` |
| `GET` | `/api/v1/content/insights/{slug}`| Public | Single insight article | `{"success": true, "data": {"slug": "...", "title": "...", ...}}` |
| `GET` | `/api/v1/seo/{slug}` | Public | SEO meta tags | `{"success": true, "data": {"title": "...", "description": "...", "canonical_url": "..."}}` |
| `POST` | `/api/v1/auth/login` | Public | Staff/Admin login | `{"access_token": "...", "refresh_token": "...", "token_type": "bearer", "user": {"id": 1, "email": "...", "role": "super_admin"}}` |
| `POST` | `/api/v1/auth/refresh` | Public | Refresh access token | `{"access_token": "...", "refresh_token": "...", "user": {...}}` |
| `GET` | `/api/v1/auth/me` | Bearer | Current user session | `{"id": 1, "full_name": "Lotus Super Admin", "email": "admin@lotuscapital.in", "role": "super_admin"}` |
| `POST` | `/api/v1/auth/logout` | Bearer | End session | `{"success": true, "message": "Logged out successfully."}` |
| `GET` | `/api/v1/admin/dashboard` | Editor+ | Metrics for Bento widgets | `{"success": true, "data": {"total_enquiries": 1, "new_enquiries": 1, "service_breakdown": [{"service_slug": "mutual-funds", "count": 1}], "monthly_trends": [...], "recent_enquiries": [...]}}` |
| `GET` | `/api/v1/admin/enquiries` | Editor+ | Paginated enquiry table | `{"items": [{"id": 1, "reference_id": "LC-...", "name": "...", "mobile": "...", "status": "new", ...}], "total": 1, "page": 1, "page_size": 20, "total_pages": 1}` |
| `PATCH`| `/api/v1/admin/enquiries/{id}` | Admin+ | Update lead status/notes | `{"success": true, "message": "Enquiry updated.", "data": {...}}` |
| `GET` | `/api/v1/admin/statistics` | Editor+ | Manage stat approvals | `{"success": true, "data": [{"id": 1, "statistic_key": "active_client_families", "tier": "Tier A", "approval_status": "approved", ...}]}` |
| `PATCH`| `/api/v1/admin/statistics/{id}` | Editor+ | Approve or update stat | `{"success": true, "message": "Statistic updated.", "data": {...}}` |
| `GET` | `/api/v1/admin/content` | Editor+ | List CMS drafts & published | `{"items": [...], "total": 9, "page": 1, "page_size": 50, "total_pages": 1}` |
| `POST` | `/api/v1/admin/content` | Editor+ | Create new page/article | `{"success": true, "message": "Content created.", "data": {...}}` |
| `PATCH`| `/api/v1/admin/content/{id}` | Editor+ | Update content body | `{"success": true, "message": "Content updated.", "data": {...}}` |
| `DELETE`|`/api/v1/admin/content/{id}` | Admin+ | Archive content | `{"success": true, "message": "Content archived successfully."}` |
| `POST` | `/api/v1/admin/media/upload` | Editor+ | Upload image/pdf asset | `{"success": true, "message": "Media uploaded successfully.", "data": {"id": 1, "url": "/api/v1/media/..."}}` |
| `GET` | `/api/v1/media/{filename}` | Public | Serve uploaded asset | Binary file stream with cache headers |
| `GET` | `/api/v1/admin/media` | Editor+ | Media asset library | `{"items": [...], "total": 0, "page": 1, "page_size": 20, "total_pages": 1}` |
| `DELETE`|`/api/v1/admin/media/{id}` | Admin+ | Delete asset | `{"success": true, "message": "Media deleted successfully."}` |
| `GET` | `/api/v1/admin/users` | SuperAdmin | Manage staff/admins | `{"success": true, "data": [{"id": 1, "email": "admin@lotuscapital.in", "role": "super_admin", ...}]}` |
| `POST` | `/api/v1/admin/users` | SuperAdmin | Create new staff user | `{"success": true, "message": "User created successfully.", "data": {...}}` |
| `PATCH`| `/api/v1/admin/users/{id}` | SuperAdmin | Update role or active state | `{"success": true, "message": "User updated successfully.", "data": {...}}` |
| `GET` | `/api/v1/admin/audit-logs` | Admin+ | Security audit trail | `{"items": [...], "total": 2, "page": 1, "page_size": 50, "total_pages": 1}` |

---

## 7. Content Directory Dependencies

The following endpoints fall back gracefully when the optional content JSON directory is not present in the workspace:
- `/api/v1/statistics`: Queries database `statistics` table. Returns Tier A approved stats directly from SQLite.
- `/api/v1/content/pages/{slug}`: Queries database `contents` table. (3 pages `home`, `about-us`, `services` are pre-seeded in SQLite).
- `/api/v1/content/insights`: Queries database `contents` table. (2 articles are pre-seeded in SQLite).
- `/api/v1/contact`: Returns hardcoded Lotus Capital address and disclaimer fallback object.
- `/api/v1/seo/{slug}`: Returns dynamic fallback SEO title and meta description.
- `/api/v1/services` and `/api/v1/faqs`: Return `{"success": true, "data": []}` (empty list, not 500) if `services.json` and `faqs.json` are absent.

