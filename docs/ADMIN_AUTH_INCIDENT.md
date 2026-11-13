# Security Incident Report: Unauthenticated `/admin` Dashboard Access

**Document Status:** Resolved  
**Incident Classification:** Critical (Broken Object Level Authorization / Client-Side State Fail-Open)  
**Date of Incident:** 2026-11-13  
**Authors:** Senior Full-Stack Engineering & AppSec  

---

## 1. Executive Summary

During production deployment verification on Vercel, it was discovered that navigating directly to `/admin` or any sub-route (`/admin/dashboard`, `/admin/leads`, `/admin/followups`) allowed unauthenticated anonymous visitors to view the admin dashboard shell without being prompted for credentials or redirected to `/admin/login`.

While backend API calls to `/api/v1/admin/*` correctly rejected anonymous requests with HTTP 401 Unauthorized (enforced by FastAPI's `get_current_user` and `require_role` dependencies), the client-side React single-page application (SPA) failed open. The administrative shell, sidebar, and layout were rendered with mock admin privileges.

---

## 2. Root Cause Analysis (RCA)

### 2.1 Direct Root Cause: Fail-Open State in `AuthContext.tsx`
Inspection of `frontend/src/context/AuthContext.tsx` identified the following critical vulnerabilities:

1. **Hardcoded Mock Admin State at Initialization:**
   ```typescript
   // frontend/src/context/AuthContext.tsx
   const defaultAdminUser: AuthUser = {
     id: 'usr_mock_001',
     name: 'Abhilash Chudasama',
     email: 'admin@lotuscapital.in',
     role: 'admin',
     permissions: ['all'],
   };

   export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
     // VULNERABILITY: Initialized to defaultAdminUser instead of null!
     const [user, setUser] = useState<AuthUser | null>(defaultAdminUser);
     ...
   ```
   Because `user` was initialized to `defaultAdminUser`, `isAuthenticated` (`!!user`) evaluated to `true` at render time $t=0$, before any network verification had completed.

2. **Error Handlers Resetting to Mock Admin:**
   In `checkAuthSession()`, when network checks failed or token refresh failed, the fallback logic executed:
   ```typescript
   // On network error or failed refresh:
   setUser(defaultAdminUser);
   ```
   This meant any unauthenticated or offline user was automatically assigned full administrative privileges in client state.

3. **`RequireAuth` Guard Lacked Neutral Loading Boundary:**
   `RequireAuth.tsx` checked `if (!isAuthenticated)`, which never triggered because `isAuthenticated` started as `true`. Furthermore, `RequireAuth` did not evaluate `isLoading`, allowing premature rendering before the `/api/v1/auth/me` session check could complete.

4. **Eager Admin Chunk Loading:**
   `AppRoutes.tsx` eagerly imported all admin page components (`AdminDashboard`, `AdminLeads`, `AdminReports`, etc.) into the main vendor bundle, exposing internal admin route source code to anonymous visitors.

5. **Missing Vercel Route Security Headers:**
   `vercel.json` lacked explicit `Cache-Control: no-store` and `X-Robots-Tag: noindex, nofollow` headers for `/admin/*`, risking caching in intermediate CDN layers and crawling by web spiders.

---

## 3. Threat Assessment & Exposure Verification

- **Backend Integrity:** Verified. All endpoints under `backend/app/api/v1/endpoints/admin.py` and `media.py` enforce `current_user: User = Depends(require_role(...))` or `get_current_user`. No confidential database records (enquiries, client PII, audit logs) were served to unauthenticated clients.
- **Client-Side Exposure:** High. Administrative UI views and client-side stubs were visible to any visitor accessing `/admin`.

---

## 4. Remediation Steps

### 4.1 Fail-Closed Authentication (`AuthContext.tsx`)
- Completely remove `defaultAdminUser`.
- Initialize `user` to `null`.
- Initialize `isLoading` to `true`.
- On application mount:
  - If no access token exists in storage, set `user = null` and `isLoading = false` immediately.
  - If a token exists, verify it with `GET /api/v1/auth/me`. If invalid or expired, attempt refresh; if refresh fails, wipe tokens and set `user = null`.
  - On any error, network timeout, or 401 response, set `user = null` and `token = null`. Under no circumstance can a user state be set without a cryptographically valid token verified by the backend.

### 4.2 Hardened Route Guard (`RequireAuth.tsx`)
- Guard evaluates `isLoading` first: displays a branded neutral loading spinner (`bg-[#0B1528]`, gold accent spinner) while session state is in flight.
- If `!isAuthenticated` or `!user`, immediately redirects to `/admin/login?next=${encodeURIComponent(location.pathname + location.search)}`.
- Prevent rendering of any child components until authentication is proven.

### 4.3 Code Splitting & Dynamic Imports
- Wrap all admin page components in `React.lazy()` in `AppRoutes.tsx`.
- Admin chunks are only downloaded over the wire after `RequireAuth` verifies credentials.

### 4.4 Vercel & HTTP Response Headers
- Configure `vercel.json` with route headers for `/admin/(.*)` and `/admin`:
  - `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`
  - `X-Robots-Tag: noindex, nofollow`

---

## 5. Verification & Automated Regression Testing
- **Automated Vitest / Playwright Tests:**
  - `test('unauthenticated visit to /admin redirects to /admin/login?next=...')`
  - `test('unauthenticated visit to /admin/leads redirects to /admin/login?next=%2Fadmin%2Fleads')`
  - `test('authenticated user with valid token loads admin dashboard')`
- **Backend Pytest:**
  - `test_admin_endpoints_require_authentication`: confirms 401 on every `/api/v1/admin/*` route for unauthenticated requests.
