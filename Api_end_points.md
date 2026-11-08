# Lotus Capital — API Endpoints Specification

This document defines the RESTful API endpoints for the Lotus Capital official website and enquiry management system.

Base URL: `/api/v1`

---

## 1. System Health
### `GET /api/v1/health`
Checks backend and database operational status.
- **Access**: Public
- **Response**:
```json
{
  "status": "healthy",
  "environment": "development",
  "database": "connected",
  "timestamp": "2026-11-07T14:30:00Z"
}
```

---

## 2. Public Enquiries
### `POST /api/v1/enquiries`
Customer enquiry submission.
- **Access**: Public (Rate limited)
- **Request Body**:
```json
{
  "name": "Rajesh Patel",
  "mobile": "9876543210",
  "email": "rajesh@example.com",
  "contact_method": "phone",
  "service_detail": [
    "mutual-funds",
    "health-insurance"
  ],
  "message": "Interested in SIP planning for child education.",
  "consent": true
}
```
- **Validation**:
  - `name`: 2-100 characters.
  - `mobile`: 10-digit valid Indian mobile number (starts with 6, 7, 8, or 9).
  - `email`: Optional, RFC-compliant format.
  - `contact_method`: `"phone"` | `"email"` | `"whatsapp"`.
  - `service_detail`: List of valid service slugs defined in `services.json`.
  - `consent`: Must be `true`.
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Enquiry submitted successfully.",
  "data": {
    "reference_id": "LC-A1B2C3D4",
    "status": "new"
  }
}
```

---

## 3. Public Services & Content
### `GET /api/v1/services`
List of offered financial services.
- **Access**: Public
- **Response**: List of active services with slugs, titles, descriptions, and icon identifiers.

### `GET /api/v1/statistics`
Public verified metrics.
- **Access**: Public
- **Rule**: Returns **ONLY** Tier A statistics where `approval_status == 'approved'` and `as_of_date` is non-null. Tier B and Tier C are strictly filtered out.

### `GET /api/v1/content/pages/{slug}`
Fetch published page content.
- **Access**: Public
- **Response**: Page title, content JSON, and metadata. Drafts return 404.

### `GET /api/v1/content/insights`
List published insights and market articles.
- **Access**: Public

### `GET /api/v1/content/insights/{slug}`
Fetch single published insight article.
- **Access**: Public

### `GET /api/v1/seo/{slug}`
Fetch SEO metadata for a route/page.
- **Access**: Public

### `GET /api/v1/contact`
Official Lotus Capital contact information and disclaimers for Godhra, Gujarat.
- **Access**: Public

### `GET /api/v1/faqs`
List of published Frequently Asked Questions.
- **Access**: Public

---

## 4. Admin Authentication
### `POST /api/v1/auth/login`
Admin user login with Argon2 verification and brute-force protection.
- **Access**: Public (Strict Rate Limited — 5 attempts / 15 minutes)
- **Request Body**:
```json
{
  "email": "admin@lotuscapital.in",
  "password": "SecurePassword123"
}
```
- **Response (200 OK)**:
```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "full_name": "Lotus Super Admin",
    "email": "admin@lotuscapital.in",
    "role": "super_admin"
  }
}
```
- **Cookies**: Sets `lotus_refresh_token` as HttpOnly, SameSite=Lax cookie.

### `POST /api/v1/auth/refresh`
Refresh expired access token using token string or HttpOnly cookie.
- **Request Body (Optional if cookie set)**:
```json
{
  "refresh_token": "eyJhbGciOi..."
}
```

### `GET /api/v1/auth/me`
Retrieve profile of currently authenticated admin user.
- **Headers**: `Authorization: Bearer <access_token>`

### `POST /api/v1/auth/change-password`
Authenticated password update verifying old password against new password.
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
```json
{
  "old_password": "CurrentPassword123",
  "new_password": "NewSecurePassword2026!"
}
```

### `POST /api/v1/auth/forgot-password`
Request password reset link for forgotten credentials.
- **Request Body**:
```json
{
  "email": "admin@lotuscapital.in"
}
```

### `POST /api/v1/auth/reset-password`
Complete password reset using cryptographic 1-hour reset token.
- **Request Body**:
```json
{
  "token": "reset_jwt_token_here",
  "new_password": "NewSecurePassword2026!"
}
```

### `POST /api/v1/auth/logout`
Revoke session token, blacklist refresh token, and clear auth cookie.

---

## 5. Admin Panel APIs
*All admin endpoints require `Authorization: Bearer <token>` and appropriate role permissions (`super_admin`, `admin`, `editor`).*

### `GET /api/v1/admin/dashboard`
High-level administrative metrics: total enquiries, counts by status, service breakdown, and monthly trends.

### `GET /api/v1/admin/enquiries`
Searchable, filterable, and paginated enquiries list.
- **Query Params**: `page`, `page_size`, `search`, `status`, `service_slug`, `date_from`, `date_to`.

### `GET /api/v1/admin/enquiries/{id}`
Full enquiry details including assigned user and service breakdown.

### `PATCH /api/v1/admin/enquiries/{id}`
Update enquiry status (`new`, `contacted`, `in_progress`, `resolved`, `closed`), assignment (`assigned_to`), and admin notes.

### `GET /api/v1/admin/statistics`
Manage statistics across all tiers.
- **Role Requirement**: `editor` can view; `admin` / `super_admin` required for approval. Tier C requires super_admin view and is NEVER publishable.

### `PATCH /api/v1/admin/statistics/{id}`
Update statistic value, tier, approval status, definition, and as_of_date.

### `GET /api/v1/admin/content`
List all content items including drafts, published, and archived versions.

### `POST /api/v1/admin/content`
Create new content entry (page, insight, faq, disclaimer).

### `PATCH /api/v1/admin/content/{id}`
Update existing content entry or publish/archive state.

### `GET /api/v1/admin/users`
List admin users (requires `super_admin`).

### `POST /api/v1/admin/users`
Create an admin user (requires `super_admin`).

### `PATCH /api/v1/admin/users/{id}`
Update role or activate/deactivate user (requires `super_admin`).

### `GET /api/v1/admin/audit-logs`
Audit log of admin actions (requires `admin` or `super_admin`).

