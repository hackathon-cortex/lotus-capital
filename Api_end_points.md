# Lotus Capital — API Contract & Endpoint Specification

**Status:** Initial specification — review against the approved site structure before implementation.  
**API prefix:** `/api/v1`  
**Backend:** FastAPI  
**Database:** PostgreSQL  
**Frontend:** React + Vite + TypeScript

This document defines the proposed HTTP API contract between the public website/admin frontend and the FastAPI backend. The route list is based primarily on `LOTUS_CAPITAL_SITE_STRUCTURE.md`. Any additions or changes must be recorded in the root `CHANGES.md`.

## 1. Contract rules

- Use `/api/v1` as the API prefix.
- Use lowercase, hyphen-separated URL paths.
- Public content endpoints return only published content.
- Admin endpoints require authentication and server-side role checks.
- Use JSON for normal request/response bodies unless an endpoint explicitly handles file upload or CSV export.
- Validate all incoming values with Pydantic schemas and validate permissions in the backend.
- Use UTC timestamps in API responses in ISO 8601 format.
- Use stable IDs; do not expose database internals unnecessarily.
- Never put passwords, reset tokens, session secrets, or sensitive personal/financial information in URL query strings.
- Do not return stack traces or secrets in production error responses.
- Public enquiry creation must include rate limiting and spam protection.
- API responses must not include unpublished content unless the caller is authorised through a short-lived preview token.
- All endpoints and schemas should be covered by tests and OpenAPI documentation.

## 2. Authentication and permission model

### Roles

- `admin`: full administrative access.
- `staff`: limited access based on assigned permissions.

The backend must enforce permissions for every protected endpoint. Hiding frontend controls is not authorization.

### Session behaviour

The exact implementation (secure cookie session or access/refresh tokens) must be selected before auth implementation and documented in `SECURITY_AND_PRIVACY.md`. Prefer secure, HttpOnly cookies for browser sessions where appropriate; configure `Secure`, `SameSite`, CSRF protections where needed, and session expiry.

### Standard authentication errors

- `401 Unauthorized`: no valid authenticated session.
- `403 Forbidden`: authenticated but lacks permission.
- `429 Too Many Requests`: rate limit exceeded.

## 3. Standard response and error shape

### Success

Use endpoint-specific response schemas. A typical create response:

```json
{
  "id": "opaque-id",
  "message": "Created successfully"
}
```

### Error

Use a consistent, non-sensitive error response:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request could not be processed.",
    "details": []
  }
}
```

Do not expose stack traces, SQL errors, secrets, or private records. Validation responses may identify invalid field names without echoing sensitive values.

## 4. Public API endpoints

| Method | Endpoint                                | Auth                                | Purpose                                                      |
| ------ | --------------------------------------- | ----------------------------------- | ------------------------------------------------------------ |
| `GET`  | `/health`                               | Public or infrastructure-restricted | Liveness/health check; avoid exposing infrastructure details |
| `POST` | `/enquiries`                            | Public, rate-limited                | Submit a new enquiry                                         |
| `GET`  | `/content/pages/{page_key}`             | Public                              | Fetch published page content                                 |
| `GET`  | `/content/faqs?page={page_key}`         | Public                              | Fetch published FAQs for a page                              |
| `GET`  | `/content/partners`                     | Public                              | Fetch approved partner names/logos                           |
| `GET`  | `/content/team`                         | Public                              | Fetch published team profiles                                |
| `GET`  | `/content/achievements`                 | Public                              | Fetch verified/published achievements                        |
| `GET`  | `/content/testimonials`                 | Public                              | Fetch approved testimonials only                             |
| `GET`  | `/content/contact`                      | Public                              | Fetch published contact details                              |
| `GET`  | `/content/insights?page={page}`         | Public                              | Fetch published insights with pagination                     |
| `GET`  | `/content/insights/{slug}`              | Public                              | Fetch one published insight                                  |
| `GET`  | `/content/preview/{page_key}?token=...` | Short-lived preview token           | Fetch draft page content for preview                         |

> Paths above are relative to `/api/v1`; e.g. the full enquiry URL is `/api/v1/enquiries`.

### 4.1 `POST /enquiries`

#### Request body

| Field            | Type           | Required | Validation                                                                                                            |
| ---------------- | -------------- | -------: | --------------------------------------------------------------------------------------------------------------------- |
| `full_name`      | string         |      Yes | 2–100 characters; trim whitespace                                                                                     |
| `mobile`         | string         |      Yes | Validate Indian mobile format; do not assume formatting is always 10 digits if country code support is later required |
| `email`          | string or null |       No | Valid email if provided                                                                                               |
| `service`        | enum string    |      Yes | `general-insurance`, `life-insurance`, `health-insurance`, `mutual-funds`, `equity`, `other-solutions`                |
| `message`        | string or null |       No | Maximum 1,000 characters                                                                                              |
| `contact_method` | enum string    |       No | `phone`, `whatsapp`, `email`; default `phone`                                                                         |
| `source_path`    | string         |      Yes | Public path; length limit and sanitisation required                                                                   |
| `consent`        | boolean        |      Yes | Must be `true`                                                                                                        |
| `utm_source`     | string or null |       No | Length limit; treat as untrusted attribution text                                                                     |
| `utm_medium`     | string or null |       No | Length limit                                                                                                          |
| `utm_campaign`   | string or null |       No | Length limit                                                                                                          |

#### Success response — `201 Created`

```json
{
  "enquiry_id": "opaque-reference",
  "message": "Your enquiry has been submitted."
}
```

#### Error responses

- `422`: invalid request.
- `429`: rate limit or spam protection triggered.
- `500`: generic failure message; log details server-side only.

#### Behaviour

1. Validate the request and consent.
2. Apply rate limiting/spam controls.
3. Store the enquiry and source attribution.
4. Create a non-sensitive, opaque enquiry reference.
5. Queue/send configured notifications without blocking the request unnecessarily.
6. Return `201` only after the enquiry is durably stored.
7. The frontend may then navigate to `/enquiry/thank-you?ref={enquiry_id}`.

Do not collect PAN, Aadhaar, demat credentials, passwords, OTPs, or unnecessary financial records in this form.

## 5. Authentication endpoints

| Method | Endpoint                | Auth                 | Purpose                                               |
| ------ | ----------------------- | -------------------- | ----------------------------------------------------- |
| `POST` | `/auth/login`           | Public, rate-limited | Authenticate staff/admin                              |
| `POST` | `/auth/logout`          | Authenticated        | End current session                                   |
| `GET`  | `/auth/me`              | Authenticated        | Return current user profile and effective permissions |
| `POST` | `/auth/forgot-password` | Public, rate-limited | Request reset email; neutral response                 |
| `POST` | `/auth/reset-password`  | Valid one-time token | Set a new password                                    |
| `POST` | `/auth/change-password` | Authenticated        | Change own password                                   |

### Authentication requirements

- Rate-limit login and reset endpoints.
- Use generic forgot-password responses to reduce account enumeration.
- Reset tokens must be random, time-limited, single-use, and stored securely (e.g. hashed).
- Invalidate or rotate relevant sessions after password changes/reset.
- Record security-relevant events without logging passwords or tokens.
- Use CSRF protection if cookie-based authentication is used.
- Return no password hashes or reset tokens from any endpoint.

## 6. Admin API endpoints

All endpoints in this section are relative to `/api/v1/admin` and require authentication plus role/permission checks.

### 6.1 Dashboard, Metrics, and Follow-ups

| Method  | Endpoint              | Roles        | Purpose                                                              |
| ------- | --------------------- | ------------ | -------------------------------------------------------------------- |
| `GET`   | `/dashboard`          | admin, staff | Live aggregates, summary cards, period trends, zero-filled series   |
| `GET`   | `/followups/count`    | admin, staff | Real-time counts of due today, overdue, and upcoming follow-ups      |
| `POST`  | `/followups`          | admin, staff | Schedule a follow-up consultation with topic, due date, and assignee |
| `PATCH` | `/followups/{id}/done`| admin, staff | Mark follow-up completed (`done_at = now()`)                         |
| `GET`   | `/reports/services`   | admin        | Real enquiry counts and conversion breakdown grouped by service     |
| `GET`   | `/reports/conversion` | admin        | Pipeline conversion funnel metrics                                   |

#### `GET /api/v1/admin/dashboard` Query Parameters
- `range`: Preset period (`30d`, `90d`, `12m`, `custom`); default `30d`. All periods aligned to Indian Standard Time (IST, UTC+05:30).
- `from`, `to`: ISO date strings for custom periods.
- `service`: Canonical service slug filter (`health-insurance`, `mutual-funds`, etc.).
- `assignee`: `me`, `unassigned`, or user ID.
- `include_demo`: boolean (default `true` in development, excluded when `false`).

#### `GET /api/v1/admin/dashboard` Response Structure
Returns `APIResponse[DashboardMetrics]` with `Cache-Control: no-store`:
```json
{
  "success": true,
  "data": {
    "total_enquiries": 0,
    "new_enquiries": 0,
    "in_progress_enquiries": 0,
    "resolved_enquiries": 0,
    "service_breakdown": [],
    "monthly_trends": [],
    "recent_enquiries": [],
    "summary": {
      "new_this_month": 0,
      "new_today": 0,
      "converted_this_month": 0,
      "in_progress_total": 0,
      "avg_first_response_hours": null,
      "change_pct": null,
      "previous_period_count": 0,
      "current_period_count": 0,
      "total_leads": 0
    },
    "by_status": {
      "new": 0, "contacted": 0, "qualified": 0, "in_progress": 0, "resolved": 0, "closed": 0
    },
    "by_service": [
      {
        "service_slug": "health-insurance",
        "name": "Health Insurance",
        "count": 0,
        "converted_count": 0,
        "conversion_rate": null
      }
    ],
    "by_month": [
      { "month_key": "2026-10", "month_label": "Oct 2026", "enquiries": 0, "conversions": 0 }
    ],
    "by_source": [
      { "source": "website", "label": "Website Form", "count": 0 }
    ],
    "latest_enquiries": [],
    "follow_ups_due": [],
    "generated_at": "2026-11-10T10:15:00Z"
  }
}
```

Dashboard results are role-scoped: editors/staff only aggregate across their assigned leads and unassigned leads. Single 15-second in-memory query cache with instant invalidation on lead/follow-up mutations.

### 6.2 Leads, Intake, and Lifecycle Management

The backend implements canonical routes under `/api/v1/admin/enquiries` with backwards-compatible aliases for `/api/v1/admin/leads`.

| Method   | Endpoint                              | Roles                  | Purpose                                              |
| -------- | ------------------------------------- | ---------------------- | ---------------------------------------------------- |
| `GET`    | `/enquiries` (or `/leads`)            | admin, staff           | List leads with search, status, service, and `is_deleted` filter |
| `POST`   | `/enquiries` (or `/leads`)            | admin, staff           | Manually create client enquiry via staff intake      |
| `GET`    | `/enquiries/check-mobile`             | admin, staff           | Live duplicate mobile number detection               |
| `GET`    | `/enquiries/{id}`                     | admin, staff           | View full enquiry detail                             |
| `PATCH`  | `/enquiries/{id}`                     | admin, staff           | Update status, assignment, or internal notes         |
| `DELETE` | `/enquiries/{id}`                     | admin (or staff assigned) | Soft-delete enquiry to Trash with reason             |
| `POST`   | `/enquiries/{id}/restore`             | admin, super_admin     | Restore soft-deleted enquiry from Trash              |
| `DELETE` | `/enquiries/{id}/permanent`           | admin, super_admin     | Permanently purge enquiry (requires typing "DELETE") |
| `GET`    | `/leads/export?format=csv`            | Permission required    | Export permitted lead fields                         |

#### Lead list query parameters

- `service`: approved service slug.
- `status`: `new`, `contacted`, `qualified`, `in-progress`, `converted`, `closed`.
- `assigned`: user ID, `me`, or `unassigned`.
- `from`, `to`: dates in `YYYY-MM-DD`.
- `q`: search by name, mobile, or enquiry ID; protect against broad/unbounded queries.
- `sort`: `created_desc` (default), `created_asc`, `followup_asc`.
- `page`: integer, minimum 1.
- `page_size`: bounded integer; set a reasonable maximum.

#### Lead permissions

- Staff can only view and edit leads within their permitted scope.
- Assignment/reassignment is admin-only unless explicit self-assignment is enabled.
- Export permission must be checked separately.
- Internal notes must never be returned by public endpoints.
- Validate every requested status transition and assignment.

### 6.3 CMS content management

| Method                | Endpoint                                   | Roles                  | Purpose                          |
| --------------------- | ------------------------------------------ | ---------------------- | -------------------------------- |
| `GET`                 | `/content/pages`                           | admin, permitted staff | List pages and states            |
| `GET`                 | `/content/pages/{page_key}`                | admin, permitted staff | Fetch page draft/current content |
| `PUT`                 | `/content/pages/{page_key}`                | admin, permitted staff | Save draft                       |
| `POST`                | `/content/pages/{page_key}/publish`        | admin                  | Publish approved draft           |
| `POST`                | `/content/pages/{page_key}/preview-token`  | admin, permitted staff | Issue short-lived preview token  |
| `GET/POST/PUT/DELETE` | `/content/faqs[/{faq_id}]`                 | admin, permitted staff | Manage FAQs                      |
| `GET/POST/PUT/DELETE` | `/content/team[/{member_id}]`              | admin, permitted staff | Manage team profiles             |
| `GET/POST/PUT/DELETE` | `/content/partners[/{partner_id}]`         | admin                  | Manage partner records           |
| `GET/POST/PUT/DELETE` | `/content/achievements[/{achievement_id}]` | admin                  | Manage awards/achievements       |
| `GET/POST/PUT/DELETE` | `/content/testimonials[/{testimonial_id}]` | admin                  | Manage consented testimonials    |
| `GET/PUT`             | `/content/contact`                         | admin                  | Read/update contact information  |
| `GET/POST/PUT/DELETE` | `/content/insights[/{insight_id}]`         | admin, permitted staff | Manage insight articles          |

`GET/POST/PUT/DELETE` is shorthand: implement explicit routes and request/response schemas for collection and item operations. Avoid ambiguous catch-all handlers.

### 6.4 Media

| Method   | Endpoint            | Roles                    | Purpose                                |
| -------- | ------------------- | ------------------------ | -------------------------------------- |
| `GET`    | `/media`            | admin, staff             | List media the user may access         |
| `POST`   | `/media`            | admin, staff             | Upload media with type/size validation |
| `PATCH`  | `/media/{media_id}` | Admin for metadata edits | Rename/edit alt text                   |
| `DELETE` | `/media/{media_id}` | admin                    | Delete media after reference checks    |

Validate MIME type and file size, generate safe storage names, restrict executable formats, and prefer object storage over storing large binary files directly in PostgreSQL.

### 6.5 Users and audit logs

| Method  | Endpoint                          | Roles | Purpose                         |
| ------- | --------------------------------- | ----- | ------------------------------- |
| `GET`   | `/users`                          | admin | List users                      |
| `POST`  | `/users`                          | admin | Invite/create user              |
| `PATCH` | `/users/{user_id}`                | admin | Update role or active status    |
| `POST`  | `/users/{user_id}/reset-password` | admin | Trigger password reset workflow |
| `GET`   | `/audit-logs`                     | admin | Search audit events             |

Audit events should record actor, action, target, timestamp, and relevant non-sensitive metadata. Never log secrets or unnecessary personal data.

## 7. CMS content and preview contract

- Public page endpoint returns only `published` content.
- Draft content is available only to authorised staff through admin endpoints or a short-lived preview token.
- Preview tokens must be random, short-lived, tied to a specific page and user, single-purpose, and revocable where practical.
- Preview responses should use `noindex` and must not be cached publicly.
- Publishing a page must create an audit event and record the publishing user/time.
- Financial performance claims, registration descriptions, partner logos, awards, and testimonials should have explicit verification/approval fields in the content workflow where relevant.

## 8. Pagination and filtering

For collection endpoints, use a consistent format:

```json
{
  "items": [],
  "page": 1,
  "page_size": 20,
  "total": 0
}
```

- Bound `page_size` (for example, maximum 100).
- Use deterministic ordering.
- Validate filters and date ranges.
- Avoid returning all records by default.
- For large datasets, consider cursor pagination after measuring actual needs.

## 9. Audit and observability

Record relevant events:

- Login success/failure and logout (without secrets).
- Password reset requested/completed.
- Lead assignment/status changes and exports.
- Content draft edits and publishing.
- User role/activation changes.
- Media uploads/deletions.
- Changes to contact details, metrics, disclosures, and performance claims.

Use structured server logs, request IDs, and generic client errors. Define retention and access policy for logs.

## 10. OpenAPI and generated clients

- Use FastAPI's OpenAPI output as the canonical machine-readable API schema.
- Add response models and explicit status codes to endpoints.
- Keep the frontend TypeScript client/types aligned with the schema.
- If generating a client, commit the generation procedure and avoid manual edits to generated files.
- Document deprecated or breaking changes before implementation.

## 11. Endpoint implementation checklist

Before marking an endpoint complete:

- [ ] Route/method matches this contract or a documented approved change.
- [ ] Request and response schemas are defined.
- [ ] Authentication and role/record-level permissions are enforced server-side.
- [ ] Input validation and safe error handling are implemented.
- [ ] Rate limiting/spam controls are applied where appropriate.
- [ ] Sensitive data is not logged or exposed.
- [ ] Unit/integration tests cover success, validation, auth, permission, and not-found cases as applicable.
- [ ] OpenAPI documentation is accurate.
- [ ] Frontend integration is tested where relevant.
- [ ] Root `CHANGES.md` is updated in the same work unit.
