# Lotus Capital — Backend API Reference Documentation

Base URL: `/api/v1`

---

## 1. System Health & Metadata

### `GET /`
- **Description**: Root service descriptor.
- **Access**: Public
- **Response `200 OK`**:
```json
{
  "name": "Lotus Capital API",
  "version": "1.0.0",
  "documentation": "/docs",
  "health": "/api/v1/health"
}
```

### `GET /api/v1/health`
- **Description**: Live system health and database connectivity probe.
- **Access**: Public
- **Response `200 OK`**:
```json
{
  "status": "healthy",
  "environment": "development",
  "database": "connected",
  "app_name": "Lotus Capital API",
  "version": "1.0.0",
  "timestamp": "2026-11-07T14:40:00.000000+00:00"
}
```

---

## 2. Public Client APIs

### `POST /api/v1/enquiries`
- **Description**: Customer submission form.
- **Access**: Public (Subject to rate-limiting and duplicate checks within 3 minutes).
- **Request Body**:
```json
{
  "name": "Suresh Patel",
  "mobile": "9876543210",
  "email": "suresh.patel@example.com",
  "contact_method": "phone",
  "service_detail": [
    "mutual-funds",
    "retirement-planning"
  ],
  "message": "Looking to begin SIP investment for a 15-year horizon.",
  "consent": true
}
```
- **Validation**:
  - `name`: 2 to 100 characters.
  - `mobile`: 10-digit Indian number starting with 6, 7, 8, or 9 (`^[6-9]\d{9}$`).
  - `email`: Optional RFC 5322 compliant address.
  - `contact_method`: `"phone"` | `"email"` | `"whatsapp"`.
  - `service_detail`: Array of valid service slugs (`mutual-funds`, `health-insurance`, `life-insurance`, `retirement-planning`, `tax-planning`, `wealth-management`).
  - `consent`: Must strictly be `true`.
  - Prohibited: Inclusion of PAN, Aadhaar numbers, OTPs, or passwords in message.
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Enquiry submitted successfully.",
  "data": {
    "reference_id": "LC-K8B9Z1A4",
    "status": "new"
  }
}
```

### `GET /api/v1/enquiries/verify-ref/{reference_id}`
- **Description**: Validates that an enquiry reference exists for the frontend thank-you view `/enquiry/thank-you?ref=LC-XXXXXXXX`.
- **Access**: Public
- **Response `200 OK`**:
```json
{
  "success": true,
  "valid": true,
  "reference_id": "LC-K8B9Z1A4",
  "status": "new"
}
```

### `GET /api/v1/services`
- **Description**: Returns all offered financial services.
- **Access**: Public
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Services retrieved successfully.",
  "data": [
    {
      "slug": "mutual-funds",
      "title": "Mutual Funds",
      "short_description": "Systematic Investment Plans (SIP) and lump-sum mutual fund advisory aligned with long-term financial goals.",
      "icon": "TrendingUp",
      "order": 1,
      "active": true
    }
  ]
}
```

### `GET /api/v1/statistics`
- **Description**: Returns publicly compliant financial statistics.
- **Compliance Filter**: Exclusively returns **Tier A** statistics where `approval_status == 'approved'` and `as_of_date` is non-null. Tier B (pending client verification) and Tier C (restricted Equity CAGR) are strictly withheld from public output.
- **Access**: Public
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Public statistics retrieved successfully.",
  "data": [
    {
      "statistic_key": "active_client_families",
      "label": "Families Served",
      "value": "1,500+",
      "definition": "Verified count of active investor accounts and family portfolios guided.",
      "as_of_date": "2026-10-01"
    }
  ]
}
```

### `GET /api/v1/content/pages/{slug}`
- **Description**: Retrieves published page copy (e.g. `home`, `about-us`, `services`).
- **Access**: Public (Draft pages return `404 Not Found`).

### `GET /api/v1/content/insights` & `GET /api/v1/content/insights/{slug}`
- **Description**: Published educational market articles and financial insights.
- **Access**: Public

### `GET /api/v1/seo/{slug}`
- **Description**: Returns title, meta-description, and canonical URLs for search engines and social cards.
- **Access**: Public

### `GET /api/v1/contact`
- **Description**: Official Lotus Capital office address in Godhra, Gujarat, phone, email, and regulatory disclaimers.
- **Access**: Public

### `GET /api/v1/faqs`
- **Description**: Frequently asked questions.
- **Access**: Public

---

## 3. Authentication APIs

### `POST /api/v1/auth/login`
- **Description**: Authenticates administrator credentials using Argon2 verification and returns JWT tokens.
- **Access**: Public (Subject to brute-force rate limits).
- **Request Body**:
```json
{
  "email": "admin@lotuscapital.in",
  "password": "LotusAdmin@2026"
}
```
- **Response `200 OK`**:
```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "full_name": "Lotus Super Admin",
    "email": "admin@lotuscapital.in",
    "role": "super_admin",
    "is_active": true,
    "is_superuser": true,
    "created_at": "2026-11-07T14:40:00+00:00",
    "last_login_at": "2026-11-07T14:45:00+00:00"
  }
}
```

### `POST /api/v1/auth/refresh`
- **Description**: Issues a fresh access token using a valid 7-day refresh token.
- **Request Body**: `{"refresh_token": "..."}`

### `GET /api/v1/auth/me`
- **Description**: Profile of currently authenticated user.
- **Headers**: `Authorization: Bearer <access_token>`

### `POST /api/v1/auth/logout`
- **Description**: Logs audit trail for session termination.
- **Headers**: `Authorization: Bearer <access_token>`

---

## 4. Admin Management APIs

*All administrative endpoints require `Authorization: Bearer <token>`.*

### `GET /api/v1/admin/dashboard`
- **Required Role**: `editor` or higher.
- **Response**: Aggregates `total_enquiries`, `new_enquiries`, `in_progress_enquiries`, `resolved_enquiries`, `service_breakdown`, `monthly_trends`, and recent enquiries.

### `GET /api/v1/admin/enquiries`
- **Required Role**: `editor` or higher.
- **Query Parameters**:
  - `page`: Page number (default: 1).
  - `page_size`: Items per page (default: 20, max: 100).
  - `search`: Substring search against Name, Mobile, Reference ID, or Email.
  - `status`: Filter by `new`, `contacted`, `in_progress`, `resolved`, `closed`.
  - `service_slug`: Filter by associated financial service.

### `GET /api/v1/admin/enquiries/{id}`
- **Required Role**: `editor` or higher.
- **Response**: Full enquiry record including assigned user and service breakdowns.

### `PATCH /api/v1/admin/enquiries/{id}`
- **Required Role**: `admin` or higher.
- **Request Body**:
```json
{
  "status": "in_progress",
  "assigned_to": 1,
  "admin_notes": "Contacted client via WhatsApp. Follow-up meeting scheduled for Saturday."
}
```

### `GET /api/v1/admin/statistics`
- **Required Role**: `editor` or higher.
- **Compliance Rules**:
  - `editor` and `admin` view Tier A and Tier B records.
  - `super_admin` additionally views restricted Tier C records.

### `PATCH /api/v1/admin/statistics/{id}`
- **Required Role**: `editor` for drafting; `admin` / `super_admin` required for status change to `approved`.
- **Compliance Constraint**: Tier C statistics cannot be marked as approved (returns `400 Bad Request`).

### `GET /api/v1/admin/content`
- **Required Role**: `editor` or higher.
- **Query Parameters**: `content_type`, `status`, `page`, `page_size`.

### `POST /api/v1/admin/content`
- **Required Role**: `editor` or higher.
- **Request Body**:
```json
{
  "content_type": "page",
  "slug": "client-stories",
  "title": "Client Journeys & Experiences",
  "content_json": {
    "headline": "Real People, Real Financial Milestones"
  },
  "status": "draft"
}
```

### `PATCH /api/v1/admin/content/{id}`
- **Required Role**: `editor` or higher.
- **Usage**: Update content copy, change status between `draft`, `published`, and `archived`.

### `GET /api/v1/admin/users`
- **Required Role**: `super_admin` only.
- **Response**: List of admin users, roles, and status.

### `POST /api/v1/admin/users`
- **Required Role**: `super_admin` only.
- **Request Body**:
```json
{
  "full_name": "Pooja Shah",
  "email": "pooja.shah@lotuscapital.in",
  "role": "admin",
  "password": "SecurePassword2026!",
  "is_active": true
}
```

### `PATCH /api/v1/admin/users/{id}`
- **Required Role**: `super_admin` only.
- **Usage**: Role modification, activation/deactivation, password reset. Prevents self-deactivation.

### `POST /api/v1/admin/media/upload`
- **Required Role**: `editor` or higher.
- **Enforces**: Maximum 5MB size limit, MIME type whitelist (JPEG, PNG, WEBP, SVG, PDF), path traversal sanitization.

### `GET /api/v1/admin/audit-logs`
- **Required Role**: `admin` or higher.
- **Response**: Paginated audit log of system events (logins, enquiry state changes, content changes, statistics approvals).
