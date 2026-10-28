# Lotus Capital — Site Structure & Routing Specification

**Project:** Lotus Capital website, CMS and admin panel
**Version:** 1.0 (October 2026)
**Stack:** React + Vite (frontend), FastAPI (backend), PostgreSQL (database)

This document defines every page, navigation element and route (public, admin and API). Items marked **(Proposed)** are additions to the earlier blueprint and need client confirmation.

---

## 1. Conventions

| Rule              | Definition                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| URL style         | lowercase, hyphen-separated, no trailing slash                                                                |
| Trailing slash    | `/about-us/` redirects (301) to `/about-us`                                                                   |
| Service slug      | one of `general-insurance`, `life-insurance`, `health-insurance`, `mutual-funds`, `equity`, `other-solutions` |
| Public API prefix | `/api/v1`                                                                                                     |
| Admin UI prefix   | `/admin`                                                                                                      |
| Auth              | public routes need no login; `/admin/*` and `/api/v1/admin/*` need an authenticated session                   |
| Roles             | `admin` (full access), `staff` (limited, see section 6)                                                       |
| Page state        | CMS content is `draft` or `published`; the public site only shows `published`                                 |
| Unknown path      | renders the 404 page with HTTP status 404                                                                     |

---

## 2. Public site map

```
/                                   Home
├── /about-us                       About Us
├── /services                       Services overview (Proposed)
│   ├── /services/general-insurance General Insurance
│   ├── /services/life-insurance    Life Insurance
│   └── /services/health-insurance  Health Insurance
├── /investments
│   ├── /investments/mutual-funds   Mutual Funds
│   ├── /investments/equity         Equity & Investments
│   └── /investments/other-solutions  More Solutions (FDs, bonds, NPS, real estate, loans)
├── /insights                       Insights listing (Proposed)
│   └── /insights/:slug             Insight article (Proposed)
├── /contact-us                     Contact and enquiry
├── /enquiry/thank-you              Enquiry confirmation (Proposed)
├── /privacy-policy                 Privacy policy (Proposed)
├── /terms-and-conditions           Terms and conditions (Proposed)
├── /disclosures                    Regulatory and risk disclosures (Proposed)
├── /complaints                     Complaints and grievance information (Proposed)
├── /sitemap.xml                    XML sitemap
├── /robots.txt                     Robots rules
└── *                               404 Not Found
```

`/investments` and any bare parent path that has no page of its own (for example `/investments`) redirects to the closest overview: `/investments` → `/services`.

---

## 3. Public route definitions

### 3.1 Route table

| #   | Path                           | Page                 | Purpose                                                  | Enquiry form default service |
| --- | ------------------------------ | -------------------- | -------------------------------------------------------- | ---------------------------- |
| 1   | `/`                            | Home                 | Introduce firm, build trust, route visitors to a service | none (visitor chooses)       |
| 2   | `/about-us`                    | About Us             | Firm story, owners, credentials, awards                  | none                         |
| 3   | `/services`                    | Services overview    | Cards for all services (Proposed)                        | none                         |
| 4   | `/services/general-insurance`  | General Insurance    | Non-life insurance information and enquiry               | `general-insurance`          |
| 5   | `/services/life-insurance`     | Life Insurance       | Life cover information and enquiry                       | `life-insurance`             |
| 6   | `/services/health-insurance`   | Health Insurance     | Health cover information and enquiry                     | `health-insurance`           |
| 7   | `/investments/mutual-funds`    | Mutual Funds         | Education, SIP calculator, enquiry                       | `mutual-funds`               |
| 8   | `/investments/equity`          | Equity & Investments | Equity services, providers, enquiry                      | `equity`                     |
| 9   | `/investments/other-solutions` | More Solutions       | FDs, bonds, NPS, MLDs, real estate, loans                | `other-solutions`            |
| 10  | `/insights`                    | Insights             | Article listing (Proposed)                               | none                         |
| 11  | `/insights/:slug`              | Insight article      | Single article (Proposed)                                | none                         |
| 12  | `/contact-us`                  | Contact Us           | Contact details, map, general enquiry                    | from `?service=` or none     |
| 13  | `/enquiry/thank-you`           | Thank you            | Confirmation after submission (Proposed)                 | not applicable               |
| 14  | `/privacy-policy`              | Privacy Policy       | Legal (Proposed)                                         | not applicable               |
| 15  | `/terms-and-conditions`        | Terms & Conditions   | Legal (Proposed)                                         | not applicable               |
| 16  | `/disclosures`                 | Disclosures          | Regulatory and risk disclosures (Proposed)               | not applicable               |
| 17  | `/complaints`                  | Complaints           | Grievance information (Proposed)                         | not applicable               |
| 18  | `*`                            | Not Found            | 404 page                                                 | not applicable               |

### 3.2 Page sections per route

**`/` Home**

1. Hero (headline, two buttons: Explore Our Services → `/services`, Talk to an Advisor → `/contact-us`)
2. Trust strip (verified years, customer count, credentials)
3. About preview (links to `/about-us`)
4. Service cards (six cards, each links to its service route)
5. Insurance partners (logo gallery)
6. Investment solutions summary
7. Why choose us
8. Testimonials
9. Enquiry call to action (form with service selector)
10. Footer

**`/about-us`**
Firm introduction · Leadership (Abhilash Dineshchandra Chudasama, Kajal Abhilash Chudasama) · Achievements and awards · Mission and values · Products and services · Client service process · Affiliations and registrations · Office location and directions · Call to action "Discuss Your Financial Goals" → `/contact-us`

**`/services`** (Proposed)
Heading · six service cards · enquiry call to action

**`/services/general-insurance`**
Hero · overview · categories · insurer partners · key features · how to request a quote · FAQs · enquiry form (`service=general-insurance`)

**`/services/life-insurance`**
Hero · overview · product categories · partner insurers · key considerations · purchase and servicing guide · FAQs · enquiry form (`service=life-insurance`)

**`/services/health-insurance`**
Hero · overview · policy categories · insurer logos · what to compare · how to request a quotation · FAQs and claim support · enquiry form (`service=health-insurance`)

**`/investments/mutual-funds`**
Hero · basics · fund categories · how investing works · SIP vs lump sum · distribution details · SIP calculator (`#sip-calculator`) · FAQs · enquiry form (`service=mutual-funds`)

**`/investments/equity`**
Hero · services overview · broker and provider relationships · available services · how research and risk are communicated · FAQs · enquiry form (`service=equity`)

**`/investments/other-solutions`**
Hero · fixed deposits · bonds and NPS · market-linked debentures (with risk disclosure) · real estate advisory · loan assistance · enquiry form (`service=other-solutions`)

**`/insights`** (Proposed) — article cards with pagination (`?page=2`)
**`/insights/:slug`** (Proposed) — article body, published date, related articles, enquiry call to action

**`/contact-us`**
Contact details (phone, WhatsApp, email, address) · map · enquiry form

**`/enquiry/thank-you`** (Proposed)
Confirmation message · enquiry reference ID (from `?ref=`) · links back to `/` and `/services`

**Legal pages** — CMS-managed text, last-updated date.

### 3.3 Anchors (in-page links)

| Route                              | Anchor            | Target               |
| ---------------------------------- | ----------------- | -------------------- |
| `/`                                | `#services`       | Service cards        |
| `/`                                | `#enquiry`        | Enquiry form         |
| `/about-us`                        | `#leadership`     | Leadership section   |
| `/about-us`                        | `#achievements`   | Achievements section |
| `/about-us`                        | `#location`       | Office location      |
| `/services/health-insurance`       | `#compare`        | What to compare      |
| `/services/*` and `/investments/*` | `#faqs`           | FAQ section          |
| `/services/*` and `/investments/*` | `#enquiry`        | Enquiry form         |
| `/investments/mutual-funds`        | `#sip-calculator` | Calculator           |

### 3.4 Query parameters

| Route                | Parameter                                  | Values               | Effect                                               |
| -------------------- | ------------------------------------------ | -------------------- | ---------------------------------------------------- |
| `/contact-us`        | `service`                                  | any service slug     | Pre-selects the service in the enquiry form          |
| `/contact-us`        | `utm_source`, `utm_medium`, `utm_campaign` | text                 | Stored with the enquiry as the lead source           |
| `/insights`          | `page`                                     | integer ≥ 1          | Pagination                                           |
| `/enquiry/thank-you` | `ref`                                      | enquiry reference ID | Shows the reference on screen                        |
| any public route     | `preview`                                  | preview token        | Shows draft content to an authorised admin (see 3.6) |

### 3.5 Redirects

| From                           | To                            | Status                          |
| ------------------------------ | ----------------------------- | ------------------------------- |
| `/about`                       | `/about-us`                   | 301                             |
| `/contact`                     | `/contact-us`                 | 301                             |
| `/mutual-funds`                | `/investments/mutual-funds`   | 301                             |
| `/equity`                      | `/investments/equity`         | 301                             |
| `/general-insurance`           | `/services/general-insurance` | 301                             |
| `/life-insurance`              | `/services/life-insurance`    | 301                             |
| `/health-insurance`            | `/services/health-insurance`  | 301                             |
| `/investments`                 | `/services`                   | 301                             |
| `/privacy`                     | `/privacy-policy`             | 301                             |
| `/terms`                       | `/terms-and-conditions`       | 301                             |
| any path with a trailing slash | same path without it          | 301                             |
| `/admin`                       | `/admin/dashboard`            | 302 (login first if signed out) |

### 3.6 Draft preview

Admins and staff preview unpublished changes at the real page URL with a signed token: `/<public-path>?preview=<token>`. The token is short-lived, tied to one page and one user, and the page shows a "Preview, not published" banner. Search engines never index preview URLs (`noindex`).

---

## 4. Navigation

### 4.1 Header (desktop)

| Order | Label                | Target                                       | Type               |
| ----- | -------------------- | -------------------------------------------- | ------------------ |
| 0     | Logo (Lotus Capital) | `/`                                          | link               |
| 1     | Home                 | `/`                                          | link               |
| 2     | About Us             | `/about-us`                                  | link               |
| 3     | Services ▾           | opens dropdown                               | dropdown           |
| 3a    | General Insurance    | `/services/general-insurance`                | link               |
| 3b    | Life Insurance       | `/services/life-insurance`                   | link               |
| 3c    | Health Insurance     | `/services/health-insurance`                 | link               |
| 3d    | More Solutions       | `/investments/other-solutions`               | link               |
| 3e    | All Services         | `/services`                                  | link (Proposed)    |
| 4     | Mutual Funds         | `/investments/mutual-funds`                  | link               |
| 5     | Equity               | `/investments/equity`                        | link               |
| 6     | Insights             | `/insights`                                  | link (Proposed)    |
| 7     | Contact Us           | `/contact-us`                                | link               |
| CTA   | Talk to an Advisor   | `/contact-us?service=<current page service>` | button (Lotus red) |

Active state: the link matching the current path is highlighted; "Services ▾" is highlighted on any `/services/*` page and on `/investments/other-solutions`.

### 4.2 Header (mobile)

- Logo on the left, menu button on the right.
- Menu opens a full-height panel with the same items in the same order; "Services" expands in place.
- "Talk to an Advisor" is pinned at the bottom of the panel.
- The panel closes on route change and on the Escape key.

### 4.3 Footer

| Column        | Items                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| Lotus Capital | Short description, "Partnering Wealth Creation"                                                         |
| Services      | General Insurance, Life Insurance, Health Insurance, Mutual Funds, Equity & Investments, More Solutions |
| Company       | About Us, Insights, Contact Us                                                                          |
| Legal         | Privacy Policy, Terms & Conditions, Disclosures, Complaints                                             |
| Contact       | Phone, WhatsApp link, email, office address                                                             |

Bottom bar: copyright, registration and disclosure text (from CMS).

### 4.4 Breadcrumbs

| Route                          | Breadcrumb                          |
| ------------------------------ | ----------------------------------- |
| `/about-us`                    | Home › About Us                     |
| `/services`                    | Home › Services                     |
| `/services/general-insurance`  | Home › Services › General Insurance |
| `/services/life-insurance`     | Home › Services › Life Insurance    |
| `/services/health-insurance`   | Home › Services › Health Insurance  |
| `/investments/mutual-funds`    | Home › Mutual Funds                 |
| `/investments/equity`          | Home › Equity & Investments         |
| `/investments/other-solutions` | Home › Services › More Solutions    |
| `/insights/:slug`              | Home › Insights › Article title     |
| `/contact-us`                  | Home › Contact Us                   |
| legal pages                    | Home › Page name                    |

### 4.5 Persistent elements

- **Floating WhatsApp button** (optional): bottom-right on all public routes, opens the firm's verified WhatsApp number.
- **Sticky header** on scroll; enquiry button always visible.

---

## 5. SEO and metadata per route

Title pattern: `<Page title> | Lotus Capital, Godhra`. Meta descriptions, Open Graph title, description and image are edited in the admin panel under each page.

| Route                          | Default title                                      | Indexed        | Sitemap priority |
| ------------------------------ | -------------------------------------------------- | -------------- | ---------------- |
| `/`                            | Lotus Capital — Partnering Wealth Creation, Godhra | yes            | 1.0              |
| `/about-us`                    | About Us \| Lotus Capital, Godhra                  | yes            | 0.8              |
| `/services`                    | Services \| Lotus Capital, Godhra                  | yes            | 0.8              |
| `/services/general-insurance`  | General Insurance \| Lotus Capital, Godhra         | yes            | 0.9              |
| `/services/life-insurance`     | Life Insurance \| Lotus Capital, Godhra            | yes            | 0.9              |
| `/services/health-insurance`   | Health Insurance \| Lotus Capital, Godhra          | yes            | 0.9              |
| `/investments/mutual-funds`    | Mutual Funds \| Lotus Capital, Godhra              | yes            | 0.9              |
| `/investments/equity`          | Equity & Investments \| Lotus Capital, Godhra      | yes            | 0.9              |
| `/investments/other-solutions` | More Solutions \| Lotus Capital, Godhra            | yes            | 0.7              |
| `/insights`, `/insights/:slug` | Insights \| Lotus Capital, Godhra                  | yes            | 0.6              |
| `/contact-us`                  | Contact Us \| Lotus Capital, Godhra                | yes            | 0.8              |
| `/enquiry/thank-you`           | Thank You \| Lotus Capital                         | no (`noindex`) | excluded         |
| legal pages                    | Page name \| Lotus Capital                         | yes            | 0.3              |
| `/admin/*`                     | Admin \| Lotus Capital                             | no (`noindex`) | excluded         |

---

## 6. Admin panel routes (`/admin`)

### 6.1 Route table

| Path                                 | Screen              | Access                      | Notes                                       |
| ------------------------------------ | ------------------- | --------------------------- | ------------------------------------------- |
| `/admin`                             | redirect            | any                         | → `/admin/dashboard`                        |
| `/admin/login`                       | Login               | public                      | redirects to dashboard if already signed in |
| `/admin/forgot-password`             | Request reset email | public                      | always shows a neutral confirmation         |
| `/admin/reset-password/:token`       | Set new password    | public (valid token)        | token expires and is single-use             |
| `/admin/dashboard`                   | Dashboard           | admin, staff                | summary cards, charts, follow-ups due       |
| `/admin/leads`                       | Leads list          | admin, staff                | search, filter, sort, export                |
| `/admin/leads/:leadId`               | Lead detail         | admin, staff                | status, assignment, notes, follow-ups       |
| `/admin/followups`                   | Follow-ups          | admin, staff                | staff see their own; admin sees all         |
| `/admin/reports`                     | Statistics          | admin                       | service-wise enquiries, conversion metrics  |
| `/admin/content/pages`               | Pages list          | admin, staff (if permitted) | all CMS-managed pages                       |
| `/admin/content/pages/:pageKey`      | Edit page           | admin, staff (if permitted) | sections, banners, SEO, draft/published     |
| `/admin/content/faqs`                | FAQs                | admin, staff (if permitted) | grouped by page                             |
| `/admin/content/team`                | Team profiles       | admin, staff (if permitted) | owners and advisors                         |
| `/admin/content/partners`            | Partners            | admin                       | insurer, fund and broker logos and labels   |
| `/admin/content/achievements`        | Achievements        | admin                       | awards with issuer and year                 |
| `/admin/content/testimonials`        | Testimonials        | admin                       | approval flag required                      |
| `/admin/content/contact`             | Contact details     | admin                       | phone, email, address, WhatsApp, hours      |
| `/admin/content/insights`            | Insights list       | admin, staff (if permitted) | (Proposed)                                  |
| `/admin/content/insights/:insightId` | Edit insight        | admin, staff (if permitted) | (Proposed)                                  |
| `/admin/media`                       | Media library       | admin, staff                | upload, rename, delete, alt text            |
| `/admin/users`                       | Users               | admin                       | list and invite                             |
| `/admin/users/:userId`               | User detail         | admin                       | role, active status, reset password         |
| `/admin/audit-logs`                  | Audit logs          | admin                       | filter by user, action, date                |
| `/admin/account`                     | My account          | admin, staff                | change password, sessions                   |
| `/admin/*`                           | Admin 404           | signed in                   |                                             |

`:pageKey` values: `home`, `about-us`, `services`, `general-insurance`, `life-insurance`, `health-insurance`, `mutual-funds`, `equity`, `other-solutions`, `contact-us`, `privacy-policy`, `terms-and-conditions`, `disclosures`, `complaints`.

### 6.2 Admin sidebar

| Order | Label             | Route                                                                 |
| ----- | ----------------- | --------------------------------------------------------------------- |
| 1     | Dashboard         | `/admin/dashboard`                                                    |
| 2     | Enquiries & Leads | `/admin/leads`                                                        |
| 3     | Follow-ups        | `/admin/followups`                                                    |
| 4     | Reports           | `/admin/reports` (admin only)                                         |
| 5     | Page Content      | `/admin/content/pages`                                                |
| 6     | FAQs              | `/admin/content/faqs`                                                 |
| 7     | Team & Contacts   | `/admin/content/team` and `/admin/content/contact`                    |
| 8     | Partners & Awards | `/admin/content/partners`, `/admin/content/achievements` (admin only) |
| 9     | Testimonials      | `/admin/content/testimonials` (admin only)                            |
| 10    | Insights          | `/admin/content/insights` (Proposed)                                  |
| 11    | Media Library     | `/admin/media`                                                        |
| 12    | Users & Roles     | `/admin/users` (admin only)                                           |
| 13    | Audit Log         | `/admin/audit-logs` (admin only)                                      |

Top bar: search leads, notifications (follow-ups due), profile menu (My account, Sign out).

### 6.3 Leads list: filters and parameters

URL: `/admin/leads?service=&status=&assigned=&from=&to=&q=&page=&sort=`

| Parameter    | Values                                                                |
| ------------ | --------------------------------------------------------------------- |
| `service`    | any service slug                                                      |
| `status`     | `new`, `contacted`, `qualified`, `in-progress`, `converted`, `closed` |
| `assigned`   | user ID, `me`, or `unassigned`                                        |
| `from`, `to` | dates (`YYYY-MM-DD`)                                                  |
| `q`          | name, mobile or enquiry ID                                            |
| `sort`       | `created_desc` (default), `created_asc`, `followup_asc`               |
| `page`       | integer ≥ 1                                                           |

Lead statuses move in this order: `new` → `contacted` → `qualified` → `in-progress` → `converted` or `closed`.

### 6.4 Permission matrix

| Capability                                                 | admin | staff                                      |
| ---------------------------------------------------------- | ----- | ------------------------------------------ |
| View dashboard                                             | yes   | yes                                        |
| View all leads                                             | yes   | assigned and unassigned only, if permitted |
| Update lead status, add notes, schedule follow-ups         | yes   | on leads they can view                     |
| Assign or reassign leads                                   | yes   | no (or self-assign, if enabled)            |
| Export leads                                               | yes   | only if the export permission is granted   |
| View statistics and reports                                | yes   | no                                         |
| Edit page content, FAQs, team, insights                    | yes   | only if the content permission is granted  |
| Publish content                                            | yes   | no (staff submit as draft)                 |
| Edit partners, achievements, testimonials, contact details | yes   | no                                         |
| Upload and manage media                                    | yes   | upload only                                |
| Manage users and roles                                     | yes   | no                                         |
| View audit logs                                            | yes   | no                                         |
| Change own password                                        | yes   | yes                                        |

### 6.5 Session rules

- Unauthenticated access to any admin route redirects to `/admin/login?next=<original path>`.
- After login, the user returns to `next` if it is a valid admin path; otherwise to `/admin/dashboard`.
- A signed-in user without permission for a route sees a "You do not have access" screen (HTTP 403 for the matching API call).
- Sessions expire after inactivity; the user is sent to login with their work preserved where possible.
- Failed logins are rate limited.

---

## 7. API routes (`/api/v1`)

### 7.1 Public API

| Method | Path                                      | Purpose                           | Auth                                |
| ------ | ----------------------------------------- | --------------------------------- | ----------------------------------- |
| GET    | `/api/v1/health`                          | Service health check              | none                                |
| POST   | `/api/v1/enquiries`                       | Submit an enquiry                 | none (rate limited, spam protected) |
| GET    | `/api/v1/content/pages/:pageKey`          | Published content for a page      | none                                |
| GET    | `/api/v1/content/faqs?page=:pageKey`      | Published FAQs                    | none                                |
| GET    | `/api/v1/content/partners`                | Approved partner logos and labels | none                                |
| GET    | `/api/v1/content/team`                    | Published team profiles           | none                                |
| GET    | `/api/v1/content/achievements`            | Verified awards                   | none                                |
| GET    | `/api/v1/content/testimonials`            | Approved testimonials             | none                                |
| GET    | `/api/v1/content/contact`                 | Contact details                   | none                                |
| GET    | `/api/v1/content/insights?page=`          | Published insights list           | none                                |
| GET    | `/api/v1/content/insights/:slug`          | One published insight             | none                                |
| GET    | `/api/v1/content/preview/:pageKey?token=` | Draft content for preview         | preview token                       |

**`POST /api/v1/enquiries` body**

| Field            | Required | Rule                                             |
| ---------------- | -------- | ------------------------------------------------ |
| `full_name`      | yes      | text, 2–100 characters                           |
| `mobile`         | yes      | valid 10-digit Indian mobile number              |
| `email`          | no       | valid email if provided                          |
| `service`        | yes      | one of the service slugs                         |
| `message`        | no       | up to 1,000 characters                           |
| `contact_method` | no       | `phone`, `whatsapp` or `email` (default `phone`) |
| `source_path`    | yes      | the page the form was submitted from             |
| `consent`        | yes      | `true` (privacy notice accepted)                 |
| `utm_*`          | no       | stored as lead source                            |

Response: `201` with `{ "enquiry_id": "...", "message": "..." }`. Errors: `422` validation, `429` rate limit. The form then navigates to `/enquiry/thank-you?ref=<enquiry_id>`.

### 7.2 Authentication API

| Method | Path                           | Purpose                             |
| ------ | ------------------------------ | ----------------------------------- |
| POST   | `/api/v1/auth/login`           | Sign in                             |
| POST   | `/api/v1/auth/logout`          | Sign out                            |
| GET    | `/api/v1/auth/me`              | Current user and role               |
| POST   | `/api/v1/auth/forgot-password` | Send reset email (neutral response) |
| POST   | `/api/v1/auth/reset-password`  | Set new password with token         |
| POST   | `/api/v1/auth/change-password` | Change own password                 |

### 7.3 Admin API (`/api/v1/admin`, authenticated)

| Method              | Path                                                  | Purpose                        | Roles                       |
| ------------------- | ----------------------------------------------------- | ------------------------------ | --------------------------- |
| GET                 | `/api/v1/admin/dashboard`                             | Summary cards and chart data   | admin, staff                |
| GET                 | `/api/v1/admin/leads`                                 | List leads (filters as in 6.3) | admin, staff                |
| GET                 | `/api/v1/admin/leads/:leadId`                         | Lead detail                    | admin, staff                |
| PATCH               | `/api/v1/admin/leads/:leadId`                         | Update status or assignment    | admin, staff                |
| POST                | `/api/v1/admin/leads/:leadId/notes`                   | Add internal note              | admin, staff                |
| POST                | `/api/v1/admin/leads/:leadId/followups`               | Schedule follow-up             | admin, staff                |
| PATCH               | `/api/v1/admin/followups/:followupId`                 | Complete or reschedule         | admin, staff                |
| GET                 | `/api/v1/admin/followups`                             | List follow-ups                | admin, staff                |
| GET                 | `/api/v1/admin/leads/export?format=csv`               | Export authorised leads        | admin, staff (if permitted) |
| GET                 | `/api/v1/admin/reports/services`                      | Service-wise enquiry counts    | admin                       |
| GET                 | `/api/v1/admin/reports/conversion`                    | Conversion metrics             | admin                       |
| GET                 | `/api/v1/admin/content/pages`                         | List pages with state          | admin, staff (if permitted) |
| GET                 | `/api/v1/admin/content/pages/:pageKey`                | Page content and SEO fields    | admin, staff (if permitted) |
| PUT                 | `/api/v1/admin/content/pages/:pageKey`                | Save draft                     | admin, staff (if permitted) |
| POST                | `/api/v1/admin/content/pages/:pageKey/publish`        | Publish draft                  | admin                       |
| POST                | `/api/v1/admin/content/pages/:pageKey/preview-token`  | Create preview token           | admin, staff (if permitted) |
| GET/POST/PUT/DELETE | `/api/v1/admin/content/faqs[/:faqId]`                 | Manage FAQs                    | admin, staff (if permitted) |
| GET/POST/PUT/DELETE | `/api/v1/admin/content/team[/:memberId]`              | Manage team profiles           | admin, staff (if permitted) |
| GET/POST/PUT/DELETE | `/api/v1/admin/content/partners[/:partnerId]`         | Manage partners                | admin                       |
| GET/POST/PUT/DELETE | `/api/v1/admin/content/achievements[/:achievementId]` | Manage awards                  | admin                       |
| GET/POST/PUT/DELETE | `/api/v1/admin/content/testimonials[/:testimonialId]` | Manage testimonials            | admin                       |
| GET/PUT             | `/api/v1/admin/content/contact`                       | Manage contact details         | admin                       |
| GET/POST/PUT/DELETE | `/api/v1/admin/content/insights[/:insightId]`         | Manage insights                | admin, staff (if permitted) |
| GET                 | `/api/v1/admin/media`                                 | List media                     | admin, staff                |
| POST                | `/api/v1/admin/media`                                 | Upload media                   | admin, staff                |
| PATCH               | `/api/v1/admin/media/:mediaId`                        | Rename or edit alt text        | admin                       |
| DELETE              | `/api/v1/admin/media/:mediaId`                        | Delete media                   | admin                       |
| GET                 | `/api/v1/admin/users`                                 | List users                     | admin                       |
| POST                | `/api/v1/admin/users`                                 | Invite user                    | admin                       |
| PATCH               | `/api/v1/admin/users/:userId`                         | Change role or active status   | admin                       |
| POST                | `/api/v1/admin/users/:userId/reset-password`          | Trigger password reset         | admin                       |
| GET                 | `/api/v1/admin/audit-logs`                            | List audit logs                | admin                       |

### 7.4 Standard API responses

| Status          | Meaning                                   |
| --------------- | ----------------------------------------- |
| 200 / 201 / 204 | success, created, no content              |
| 400 / 422       | invalid request or validation error       |
| 401             | not signed in or session expired          |
| 403             | signed in without permission              |
| 404             | not found                                 |
| 429             | rate limit exceeded                       |
| 500             | server error (logged to error monitoring) |

---

## 8. Suggested project structure

### 8.1 Frontend (`frontend/`, React + Vite)

```
frontend/
├── index.html
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/
│   │   ├── publicRoutes.tsx        # all section 3 routes
│   │   ├── adminRoutes.tsx         # all section 6 routes
│   │   └── redirects.ts            # section 3.5
│   ├── layouts/
│   │   ├── PublicLayout.tsx        # header, footer, WhatsApp button
│   │   └── AdminLayout.tsx         # sidebar, top bar
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Home.tsx
│   │   │   ├── AboutUs.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── GeneralInsurance.tsx
│   │   │   ├── LifeInsurance.tsx
│   │   │   ├── HealthInsurance.tsx
│   │   │   ├── MutualFunds.tsx
│   │   │   ├── Equity.tsx
│   │   │   ├── OtherSolutions.tsx
│   │   │   ├── Insights.tsx
│   │   │   ├── InsightArticle.tsx
│   │   │   ├── ContactUs.tsx
│   │   │   ├── EnquiryThankYou.tsx
│   │   │   ├── LegalPage.tsx       # privacy, terms, disclosures, complaints
│   │   │   └── NotFound.tsx
│   │   └── admin/
│   │       ├── Login.tsx
│   │       ├── ForgotPassword.tsx
│   │       ├── ResetPassword.tsx
│   │       ├── Dashboard.tsx
│   │       ├── Leads.tsx
│   │       ├── LeadDetail.tsx
│   │       ├── Followups.tsx
│   │       ├── Reports.tsx
│   │       ├── content/            # Pages, PageEditor, Faqs, Team, Partners,
│   │       │                       # Achievements, Testimonials, Contact, Insights
│   │       ├── Media.tsx
│   │       ├── Users.tsx
│   │       ├── UserDetail.tsx
│   │       ├── AuditLogs.tsx
│   │       └── Account.tsx
│   ├── components/
│   │   ├── nav/                    # Header, MobileMenu, ServicesDropdown, Footer, Breadcrumbs
│   │   ├── sections/               # Hero, TrustStrip, ServiceCards, PartnerLogos, Testimonials, Faqs
│   │   ├── enquiry/                # EnquiryForm (service pre-selected)
│   │   ├── calculators/            # SipCalculator
│   │   └── admin/                  # DataTable, StatusBadge, RichTextEditor, MediaPicker
│   ├── guards/
│   │   ├── RequireAuth.tsx
│   │   └── RequireRole.tsx
│   ├── api/                        # typed API client for section 7
│   ├── hooks/
│   └── styles/                     # brand tokens: navy #123D67, red #E92332, silver #D7D9DC, white
```

### 8.2 Backend (`backend/`, FastAPI)

```
backend/
├── app/
│   ├── main.py
│   ├── core/            # config, security, rate limiting, logging
│   ├── db/              # session, migrations
│   ├── models/          # leads, services, lead_interests, followups, notes, pages,
│   │                    # faqs, team_members, partners, achievements, testimonials,
│   │                    # media, users, audit_logs
│   ├── schemas/
│   ├── routers/
│   │   ├── public.py    # section 7.1
│   │   ├── auth.py      # section 7.2
│   │   └── admin/       # leads.py, followups.py, reports.py, content.py,
│   │                    # media.py, users.py, audit.py
│   ├── services/        # email notifications, media storage, export
│   └── tests/
├── alembic/
└── requirements.txt
```

### 8.3 Environments

| Environment | Frontend                        | API            | Database                        |
| ----------- | ------------------------------- | -------------- | ------------------------------- |
| Staging     | staging domain (Vercel preview) | staging API    | separate staging database       |
| Production  | client domain with HTTPS        | production API | managed PostgreSQL with backups |

Secrets are stored as environment variables, never committed to the repository.

---

## 9. Route checklist for sign-off

- [ ] All public routes in section 3.1 confirmed (including those marked Proposed)
- [ ] Navigation order and labels in section 4 approved
- [ ] Redirects in section 3.5 approved
- [ ] Admin screens and permission matrix in section 6 approved
- [ ] Legal page names and URLs approved
- [ ] Final domain name confirmed for canonical URLs and sitemap
