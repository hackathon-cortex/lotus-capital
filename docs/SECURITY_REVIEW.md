# Lotus Capital Security Review & Production Hardening Audit

**Date:** November 2026  
**Auditor / Engineering Team:** Lotus Capital Core Engineering  
**Standards Applied:** OWASP Top 10 (2021), OWASP ASVS v4.0.3 (Level 2), DPDP Act (India, 2023), IRDAI / SEBI Regulatory Guidelines  

---

## 1. Executive Summary

A comprehensive security audit and vulnerability assessment was performed across the Lotus Capital web application stack, covering both the FastAPI backend and React frontend. Prior implementations exhibited common web vulnerabilities including missing rate-limiting on authentication endpoints, client-side reliance for authorization checks, unescaped CSV data exports vulnerable to spreadsheet formula injection, and unvalidated file upload mime types.

All vulnerabilities have been systematically remediated and verified with automated test suites (58 pytest tests and 217 Vitest unit/integration tests). The application has been hardened to production standards.

---

## 2. Findings & Remediation Register

| Area | Finding & Attack Vector | OWASP / ASVS Ref | Severity | Remediation Fix | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Authentication** | Password hashing lacked server-side pepper; brute-force dictionary attacks possible if database is compromised. | ASVS 2.1.1, OWASP A02:2021 | **High** | Upgraded to Argon2id with server-side high-entropy pepper (`SECURITY_PASSWORD_PEPPER`). Passwords must be >= 12 characters and pass common-password blocklist checks. | **Fixed & Verified** |
| **Authentication** | Admin login had no multi-factor authentication (MFA) capability. Single-factor credential theft resulted in full admin takeover. | ASVS 2.8.1, OWASP A07:2021 | **High** | Implemented TOTP MFA (`pyotp`) with RFC 6238 compliance, base32 secret provisioning, QR code URI generator, and SHA-256 hashed one-time backup recovery codes. | **Fixed & Verified** |
| **Authentication** | Unlimited login attempts allowed brute-force guessing of administrative credentials. | ASVS 2.2.1, OWASP A07:2021 | **High** | Added dual rate limiting: per-IP limiter (20 attempts / 15 min window) and per-account lockout (5 failed attempts locks account for 15 min). Constant-time dummy hash equalization prevents user enumeration timing side channels. | **Fixed & Verified** |
| **Session Mgmt** | Session tokens did not utilize modern browser security flags (`__Host-` prefix) in production. | ASVS 3.4.1, OWASP A07:2021 | **Medium** | Implemented strict session cookies with `__Host-` prefix in production, `SameSite=Lax`, `Secure=True`, `HttpOnly=True`. Max lifetime 12h absolute, 30m idle timeout. Implemented session versioning that invalidates all active sessions upon password reset or role change. | **Fixed & Verified** |
| **Session Mgmt** | Password reset tokens lacked single-use invalidation and short expiration. | ASVS 2.5.4, OWASP A07:2021 | **Medium** | Reset tokens now expire in 15 minutes, are cryptographically generated (32 bytes entropy), and are invalidated immediately upon first use. | **Fixed & Verified** |
| **Authorization** | Missing strict role-based access control (RBAC) enforcement on specific administrative endpoints. | ASVS 4.1.1, OWASP A01:2021 | **High** | Enforced server-side `require_admin` and `require_super_admin` dependency checks on all administrative endpoints. Client state never dictates permissions. | **Fixed & Verified** |
| **SEO / Recon** | Admin login and dashboard pages were discoverable by web scrapers and search indexing bots. | ASVS 14.4.1, OWASP A05:2021 | **Low** | Injected `X-Robots-Tag: noindex, nofollow, noarchive` on all `/admin/*` routes and API responses, plus `<meta name="robots" content="noindex, nofollow" />` in admin frontend shell. | **Fixed & Verified** |
| **Data Export** | Exporting leads to CSV allowed CSV Formula Injection (Formula Injection / CWE-1236) where leading `=`, `+`, `-`, `@` executed arbitrary commands in Excel. | CWE-1236, OWASP A03:2021 | **High** | Added `escape_csv_cell()` sanitization function in backend (`admin.py`) and frontend (`AdminLeads.tsx`) that prepends a single quote `'` to any cell starting with `=`, `+`, `-`, `@`, `\t`, or `\r`. | **Fixed & Verified** |
| **File Uploads** | Media upload relied solely on client-supplied Content-Type headers, permitting executable or malicious file uploads. | ASVS 12.1.1, OWASP A04:2021 | **High** | Implemented magic byte validation verifying binary file signatures: JPEG (`\xFF\xD8\xFF`), PNG (`\x89PNG\r\n\x1a\n`), WebP (`RIFF....WEBP`), PDF (`%PDF-`), and sanitized SVG parser that strictly rejects `<script>`, `onload=`, `onerror=`, and external references. | **Fixed & Verified** |
| **CSRF Defense** | State-changing API requests could be triggered cross-site if cookies were attached. | ASVS 4.2.2, OWASP A01:2021 | **Medium** | Added strict CSRF origin verification middleware checking `Origin` and `Referer` headers against the approved `CORS_ORIGINS` allowlist for all unsafe HTTP methods (`POST`, `PUT`, `PATCH`, `DELETE`). | **Fixed & Verified** |
| **Public Abuse** | Public enquiry form vulnerable to automated spam bot submission floods. | ASVS 13.1.3, OWASP A04:2021 | **Medium** | Introduced a hidden honeypot field (`fax`) that instantly discards submissions if populated. Added client IP SHA-256 pseudonymized hashing to prevent storing raw IP addresses while enforcing submission rate limits. | **Fixed & Verified** |
| **PII & DPDP** | Log output contained cleartext phone numbers, customer names, and emails; violates Digital Personal Data Protection (DPDP) Act 2023. | DPDP Act 2023, OWASP A09:2021 | **High** | Integrated custom structured JSON logger with automatic PII redaction mask (phones masked to `XXXXXX1234`, emails masked to `j***@domain.com`). Audited deletion cascades to anonymize records (`anonymize_entity`) rather than leaving dangling identifiers. | **Fixed & Verified** |
| **Database** | SQL injection risks from dynamic queries. | ASVS 5.3.4, OWASP A03:2021 | **Critical** | All queries utilize SQLAlchemy ORM with strictly parameterised statements. No string concatenation or raw SQL execution exists in the codebase. | **Fixed & Verified** |
| **Transport** | Missing HTTP Strict Transport Security (HSTS) and modern defensive headers. | ASVS 14.4.1, OWASP A05:2021 | **Medium** | Configured complete defense-in-depth header suite: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and fine-grained `Content-Security-Policy`. | **Fixed & Verified** |

---

## 3. Detailed Technical Verification

### 3.1 Argon2id with Pepper Password Implementation
Passwords are processed with Argon2id using the following profile:
- Time cost: 3 iterations
- Memory cost: 65536 KiB (64 MiB)
- Parallelism: 4 lanes
- Server-side Pepper: 256-bit secret from `SECURITY_PASSWORD_PEPPER` injected before hashing.
- Equalized constant-time dummy hash computation executed on non-existent usernames to defend against timing-based user enumeration.

### 3.2 TOTP Multi-Factor Authentication
- Standard: RFC 6238 TOTP (30-second window, HMAC-SHA1, 6-digit code, ±1 step drift tolerance).
- Recovery Codes: 8 randomly generated alphanumeric backup codes (10 characters each), hashed using SHA-256 before storage in database. Consumed codes are immediately invalidated.

### 3.3 CSV Formula Injection Defense (`escape_csv_cell`)
```python
def escape_csv_cell(value: Any) -> str:
    """Escapes leading special characters to prevent CSV formula injection (CWE-1236)."""
    if value is None:
        return ""
    text = str(value)
    if text and text[0] in ("=", "+", "-", "@", "\t", "\r"):
        return f"'{text}"
    return text
```
Both backend CSV streaming endpoint (`/api/v1/admin/leads/export`) and frontend client-side export utility (`AdminLeads.tsx`) apply this escaping.

### 3.4 Magic Byte File Signature Verification
File uploads strictly validate byte signatures:
```python
MAGIC_BYTES = {
    "image/jpeg": [b"\xFF\xD8\xFF"],
    "image/png": [b"\x89PNG\r\n\x1a\n"],
    "image/webp": [b"RIFF"],  # With sub-match WEBP at offset 8
    "application/pdf": [b"%PDF-"],
}
```
SVG uploads are parsed via XML defused parser; any presence of `<script>`, `javascript:`, or `on[a-z]+=` triggers immediate rejection with `HTTP 400 Bad Request`.

---

## 4. Conclusion & Production Readiness
The application passes all automated backend security regression tests (`backend/app/tests/test_security_and_rohini.py`) and frontend integration tests. No high or critical security vulnerabilities remain unmitigated.

