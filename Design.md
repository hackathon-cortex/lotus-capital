# Lotus Capital — Technical Design Document

## 1. System Overview
Lotus Capital requires a high-performance, secure backend API to serve the official public website and administrative enquiry dashboard.

## 2. Security Design
- **Password Hashing**: Argon2 (`pwd_context = CryptContext(schemes=["argon2", "bcrypt"], ...)`) to defend against GPU brute-force attacks.
- **Authentication**: JWT Access Token (short-lived, 30 minutes) + Secure Refresh Token (7 days).
- **Role-Based Access Control (RBAC)**:
  - `super_admin`: Full administrative rights, user provisioning, system audits, Tier C review.
  - `admin`: Enquiry assignment, status workflows, Tier A & B statistics approvals, content publishing.
  - `editor`: Draft content creation, viewing enquiries, draft edits.
- **Rate Limiting**: In-memory / middleware-backed sliding window rate limiters for login attempts and public enquiry submissions.
- **Input Sanitization**: Pydantic v2 data cleansing, HTML escaping, and strict mobile regex (`^[6-9]\d{9}$`).

## 3. Data Tiering for Statistics
- **Tier A**: Public statistics. Criteria: `approval_status == 'approved'` AND `as_of_date is not null`.
- **Tier B**: Pending verification. Visible only to authenticated administrators.
- **Tier C**: Confidential/Restricted claims (e.g. Equity CAGR). Strictly withheld from public exposure; requires super_admin role to view and cannot be marked public.

