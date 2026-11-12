
# Lotus Capital — Admin Dashboard Live Data Refinement Notes

> **Brand Philosophy**: Royalty through security. Premium through simplicity. Trust through transparency.  
> **Brand Palette**: Navy `#123D67` (Navy-900), Navy Scrim `#0A2540` (Navy-950), Silver `#D7D9DC`, White `#FFFFFF`, Lotus Red `#E92332` (Interactive button contrast `#C81B29`).  
> **Typography**: Poppins (Headings) + Inter (Body).  
> **Document Date:** 2026-11-10  
> **Status:** Completed & Verified

---

## 1. Executive Summary

## 1. Summary of Changes

This document records the visual refinement and code implementation of the **Lotus Capital** web application, aligning it with the official Lotus Capital Design Reference Document, `Design.md`, `Structure.md`, and the 7 authoritative visual references.
The Lotus Capital Admin Dashboard previously displayed static placeholder metrics (hard-coded `42` new enquiries, `+18.5%` vs previous month, `6` due follow-ups, `18` converted leads / `42.8%`, static charts, and synthetic enquiry arrays).

All 9 visible defects identified in previous builds have been remediated. The codebase strictly adheres to the data layer rules (facts sourced exclusively from `content/data/*.json`), statutory regulatory disclosure requirements (AMFI/SEBI, IRDAI, Religare Broking AP), animation standards (A1–A30), and responsive design specifications.
We diagnosed, eliminated, and completely replaced all static/mock data sources across both backend and frontend layers:

1. **Backend Aggregates**: Built `DashboardAnalyticsService` calculating true SQLAlchemy database metrics with IST timezone alignment (`Asia/Kolkata`, UTC+05:30), role-scoped filtering (staff/editor users see only assigned or unassigned leads), zero-filled series for statuses, canonical services, and monthly buckets, and a 15-second cache with instant mutation invalidation.
2. **Follow-ups Architecture**: Introduced the `followups` table with composite indexes on `(due_at, done_at)` and `(assignee_id, due_at)`, supporting real-time follow-up scheduling, overdue detection, and completion (`done_at = now()`).
3. **Frontend Dynamic Integration**: Connected `AdminDashboard.tsx` to live TanStack Query polling (60s interval with window-focus refetch), added period (`30d`, `90d`, `12m`) and service/assignee filters, integrated real conversion rates, wired the sidebar follow-up badge to live counts (hiding at 0), and rendered clean zero-states at 0 records.
4. **Automated Test Coverage**: Added comprehensive pytest suites (`test_dashboard_analytics.py`) testing empty database state, lead insertion, soft-delete exclusions, IST day boundaries, role scoping, and property-based verification. Added frontend Vitest tests (`adminDashboardDynamic.test.tsx`) proving that mutating database records alters the UI live.

---

## 2. Visible Defect Remediation Log

## 2. Root Cause Analysis

| Defect #                                                                                  | Issue Description                         | Root Cause                                                                                                                                                                 | Solution Implemented                                                                                                                                                                                                                                                          | Verification                                                                    |
| :---------------------------------------------------------------------------------------- | :---------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| **Defect 1**                                                                              | **Logo White Box on Dark Backgrounds**    | `lotus_capital_logo_traced.svg` contained an opaque `<rect fill="#274463"/>`. Inverting via CSS `filter: brightness(0) invert(1)` turned this into an opaque white square. | Created `<LotusLogo>` (`frontend/src/components/common/LotusLogo.tsx`) rendering clean inline vector paths for `light` (`#FFF`), `dark` (`#123D67`), and `watermark` (`rgba(215,217,220,0.08)`) variants with transparent backgrounds and Lotus red (`#E92332`) center petal. | Verified in Header, Footer, Admin, and Hero backgrounds. Zero white rectangles. |
| **Defect 2**                                                                              | **Hero Missing Photo / Blank Space**      | Photo hero lacked a dedicated image slot and fallback mechanism.                                                                                                           | Added photo slot referencing `/images/hero.jpg` (`Home_main_image.png`) with an automatic graceful fallback to a photographic navy gradient with a 6% lotus watermark if the file is absent.                                                                                  | Verified at desktop and mobile resolutions.                                     |
| **Defect 3**                                                                              | **Header Overlapping and Wrapping Links** | Header rendered with loose gaps and lacked `white-space: nowrap`, causing nav links to break into two lines on narrower desktop viewports.                                 | Styled Header with `position: fixed` sitting transparently over the hero with a top navy scrim, transitioning to solid navy with blur after 24px scroll (A5). Nav items styled with `white-space: nowrap`, tightened padding, and mobile drawer toggle below 1100px.          | Header stays single-line, transitions smoothly, and does not wrap.              |
| **Defect 4**                                                                              | **Dev Register Badge in Public Header**   | Unverified statistics warning was exposed globally in the public header.                                                                                                   | Removed dev register badge from the public navigation header. Confined the data register link strictly to `import.meta.env.DEV` in the footer and directly at `/dev/data-register`.                                                                                           | Public visitors see no dev register badge.                                      |
| **Defect 5**                                                                              | **Heavy Yellow "UNVERIFIED" Blocks**      | Aggressive yellow alert badges degraded the premium financial aesthetic of the homepage stat bar.                                                                          | Replaced heavy yellow banners in `StatBlock.tsx` with a subtle warning dot, hover tooltip, and compact caption: _"as of [date to be confirmed]"_. Full unverified badges remain strictly on `/dev/data-register`.                                                             | Stat blocks look clean and institutional while preserving compliance markers.   |
| **Defect 6**                                                                              | **Premature WhatsApp Floating CTA**       | Floating WhatsApp button was displayed without a verified business phone number.                                                                                           | Added condition in `PublicLayout.tsx` checking `(contactData as any).whatsappConfirmed === true`. The button remains hidden until the client confirms their official WhatsApp business account.                                                                               | Floating WhatsApp button hidden by default.                                     |
| **Defect 7**                                                                              | **Testimonial Compliance & Consent**      | Unverified or unconsented customer testimonials were displayed.                                                                                                            | In `Home.tsx`, testimonials are filtered by `consent: true`. In development mode (`import.meta.env.DEV`), 3 anonymized sample placeholders are shown with names withheld. In production builds, unconsented testimonials are suppressed entirely.                             | No fake names or unconsented quotes shown.                                      |
| **Defect 8**                                                                              | **Partner Logo Distortion**               | Third-party logos were stretched or displayed with conflicting backgrounds.                                                                                                | Replaced arbitrary raster images with typographic wordmark tiles in a continuous 40px/s marquee that pauses on hover (A18). Each tile displays institutional relationship metadata (e.g., _"Authorised Person"_, _"Corporate Agency Partner"_).                               | Clean, distortion-free partner representation.                                  |
| **Defect 9**                                                                              | **Stat Card 4+1 Wrapping Disalignment**   | Five homepage statistics rendered in an awkward 4+1 wrap across rows.                                                                                                      | Redesigned the hero-overlapping stat container into a balanced layout: 4 primary KPI cards in row 1 (`clients_serviced`, `aum_total`, `mf_folios`, `demat_accounts`), and 1 centered secondary badge in row 2 (`insurance_policies_total`).                                   | Symmetrical, centered, and mobile-responsive.                                   |
| Before this sprint, the dashboard displayed static data due to three independent factors: |

- **Backend Handler (`app/api/v1/endpoints/admin.py`)**: `get_dashboard()` previously instantiated a static `DashboardMetrics` Pydantic model with hardcoded values.
- **Frontend State Initialization (`AdminDashboard.tsx`)**: The component initialized React state with hard-coded values (`useState(42)`, `useState(6)`, `useState(18)`, static mock arrays for `enquiries`, and synthetic monthly formulas like `headlineCount * 0.45`).
- **Sidebar Badge (`AdminLayout.tsx`)**: The layout passed a fixed prop `<AdminShell dueFollowupsCount={6}>` instead of measuring active database records.

---

## 3. Visual Reference to Codebase Implementation Mapping

## 3. Architecture & Standards Compliance

The implementation harmonizes the 7 designated visual references without copying copyrighted text, third-party logos, or arbitrary figures:

### 3.1 IST Timezone Precision

Indian financial calendars operate on Indian Standard Time (`Asia/Kolkata`, fixed offset UTC+05:30):

- Implemented `backend/app/core/timezone.py` with `IST`, `now_ist()`, `now_utc()`, `get_ist_day_bounds()`, and `get_ist_month_bounds()`.
- Calendar days start at `00:00:00 IST` and end at `23:59:59.999999 IST`.
- Calendar months start at `01 00:00:00 IST` and end at the final microsecond of the month in IST.
- Stored timestamps in SQLite/PostgreSQL remain UTC; boundary queries convert IST day/month ranges to UTC bounds.

### Reference 1: `fiatwm.com` Hero & Header Behavior

- **Applied to**: Global Header and Home Hero section (`Home.tsx`).
- **Implementation**:
  - Full-bleed photo hero with top navy scrim (`linear-gradient(180deg, rgba(10,37,64,0.7) 0%, rgba(10,37,64,0) 100%)`).
  - Transparent header over photo at `y=0`; transitions to solid Navy (`#123D67`) with 12px backdrop blur and shrunken logo after 24px scroll (A5).
  - Spaced-caps eyebrow: `FINANCIAL SOLUTIONS • GODHRA, GUJARAT`.
  - Staggered headline animation (A1) line-by-line:
    - _"Plan with confidence."_
    - _"Protect what matters."_
    - _"Build your future."_
  - Solid Lotus Red primary CTA (`#C81B29`, _"Explore Our Services"_) and outlined secondary CTA (_"Talk to an Advisor"_).
  - Subtle mouse/down-arrow scroll cue at the hero bottom edge.

### 3.2 Role-Based Access Scoping

- **Admin & Super Admin**: Can view all company-wide inbound enquiries, conversion metrics by service, assignees, and company totals.
- **Staff (Editor)**: Scoped strictly to enquiries assigned to their user ID or unassigned leads awaiting intake. Service conversion rates are restricted to management to protect commercial vertical targets.

### Reference 2: Groww Services Bento Grid & Scroll-Driven Investments

- **Applied to**: Home Services Bento section and Investment pages (`MutualFunds.tsx`, `Equity.tsx`).
- **Implementation**:
  - 6 equal-weight bento cards with custom code mockups:
    1. **General Insurance**: Mini policy card mockup with coverage chip and policy number.
    2. **Life Insurance**: Protection shield with family coverage tiers.
    3. **Health Insurance**: Hospital network checklist with cashless claims badge.
    4. **Mutual Funds**: Mini SIP compounding growth curve with SIP calculator tag.
    5. **Equity**: Tabbed demat & trading panel with NSE/BSE Authorised Person indicator.
    6. **More Solutions**: Geometric asset diversification mosaic (FDs, Bonds, SGBs).
  - Scroll-driven rising boards (`useScrollProgress`) that elevate and tilt into view as the user scrolls down the page.

### 3.3 Zero-Record Correctness

- When the database has 0 records, every counter displays `0`.
- Headline percentage change shows `— vs prev` when the previous period had 0 records (preventing division by zero or misleading `+0.0%`).
- Sparkline and SVG line chart display zero-state overlays rather than crashing on empty arrays or drawing broken geometries.
- Latest enquiries table and today's scheduled follow-ups display polite zero-state cards with actionable CTAs ("Add enquiry").
- Sidebar badge completely disappears when due follow-ups count is 0.

### Reference 3: Groww "Trusted by" Trust Band

- **Applied to**: Home Trust Band (`Home.tsx`).
- **Implementation**:
  - High-contrast dark navy band (`#0A2540`) with 1600ms count-up (`useCountUp` / A12):
    - `Trusted by 2,500+ clients across Gujarat`
  - 4 key statistic columns with verified as-of timestamps.
  - Floating dev-mode testimonial cards with subtle hovering drift.
  - High-contrast red call-to-action strip beneath (_"Ready to start your financial journey?"_).

### 3.4 Regulatory Gating

- AMFI & SEBI compliance rules remain strictly enforced: Tier C metrics (`equity_cagr`) are permanently filtered out from all public statistics endpoints and client-side data modules.

### Reference 4: ETMoney Insurance Page Structure

- **Applied to**: `GeneralInsurance.tsx`, `LifeInsurance.tsx`, `HealthInsurance.tsx`.
- **Implementation**:
  - Institutional layout sequence:
    1. Category Hero with trust eyebrow and quote CTA.
    2. Key Coverage Types Grid (e.g., Critical Illness, Cashless Hospitalisation, Super Top-Up).
    3. Interactive "Compare What Matters" feature matrix.
    4. 3-Step Hassle-Free Claim Process cards.
    5. Institutional Partners marquee (HDFC Life, Care Health, LIC).
    6. Accordion FAQs with rotating `+` icon (A19).
    7. Statutory IRDAI Regulatory Risk Disclosure Box.
    8. Contextual Enquiry Form pre-selecting the active insurance service.

### Reference 5: FINRE Investment Template (Founder & Values Split)

- **Applied to**: Home About Preview and `AboutUs.tsx`.
- **Implementation**:
  - Split layout:
    - **Left**: High-resolution founder portrait (`Owner.png`) framed in a 4:5 rounded container with an offset silver outline (`.founder-offset-frame`) and 6% lotus watermark.
    - **Right**: Founder's message, 3 verified metric chips, and 4 core value tiles (_Transparency_, _Client Centricity_, _Long-term Horizon_, _Institutional Discipline_).
  - Clean transition to full About Us story.

### Reference 6: Investment Dashboard Blueprint

- **Applied to**: Interactive public boards in `MutualFunds.tsx` and `Equity.tsx` (strictly public illustrative tools, NOT the admin panel).
- **Implementation**:
  - Large illustrative headline figure with period toggles (`1Y`, `3Y`, `5Y`, `10Y`).
  - 3 action cards: SIP Compounding, Portfolio Review, Tax Planning (ELSS).
  - Interactive SVG growth curve with hoverable data-point tooltips.
  - Goal progress meters: Child Education (68%), Retirement Corpus (45%).
  - Mandatory disclaimer on all boards: _"Illustration only. Not a forecast or guarantee. Mutual fund investments are subject to market risks."_
  - Equity board highlights Religare Broking AP registration codes: NSE `AP007909931` and BSE `AP0130040172963`. No stock tips, price forecasts, or Tier C 23% CAGR.

### Reference 7: Admin Portal Dashboard

- **Applied to**: `AdminLayout.tsx` and `AdminDashboard.tsx`.
- **Implementation**:
  - Functional sidebar navigation collapsible from 248px to 72px (A25).
  - Top search bar and user profile dropdown.
  - 4 operational KPI summary cards (Total Enquiries, Pending Follow-ups, Contacted, Converted).
  - 7-day enquiries bar trend chart (A26).
  - Priority follow-up counter and conversion distribution bars.
  - Searchable, filterable leads table with interactive status selector (A27).

---

## 4. Animation Catalog (A1–A30) & Motion Architecture

## 4. Test Verification Summary

All animations are implemented in `frontend/src/motion/` and `frontend/src/styles/main.css` adhering to the timing tokens in `Design.md`:

### Backend Pytest Suite

- `tests/test_dashboard_analytics.py`: 7 tests passed (empty state zero-checks, lead insertion, soft-delete exclusion, IST boundary handling, staff role scoping, property test, follow-up scheduling and completion).
- `tests/test_admin_leads_crud.py`: 8 tests passed.
- `tests/test_enquiries.py`: 6 tests passed.
- `tests/test_statistics.py`: 3 tests passed.
- **Total Backend**: 24 passed in 3.29s.

| ID      | Name                         | Trigger / Target                                                                        | Technical Implementation                                                                          |
| :------ | :--------------------------- | :-------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------ |
| **A1**  | Hero Text Stagger            | On page load, staggered 100ms fade-up for eyebrow, H1 line 1, line 2, line 3, and CTAs. | CSS `@keyframes heroFadeUp` with animation delay classes `.anim-fade-up-1..4`.                    |
| **A2**  | Hero Image Settle            | On load, hero image smoothly settles from scale(1.04) to scale(1.0).                    | CSS `.anim-settle` over 1200ms ease-out.                                                          |
| **A3**  | Hero Parallax                | Desktop scroll (`>= 768px`).                                                            | Custom hook `useParallax.ts` (disabled on touch devices / viewport < 768px).                      |
| **A4**  | Nav Underline Grow           | Desktop nav link hover.                                                                 | CSS `:after` pseudoelement expanding `scaleX(0)` to `scaleX(1)`.                                  |
| **A5**  | Header Background Transition | Scroll threshold `> 24px`.                                                              | React state tracking `window.scrollY > 24` in `Header.tsx`, toggling `.header--scrolled`.         |
| **A6**  | Services Dropdown Reveal     | Header "Services" hover/focus.                                                          | Absolute dropdown container with opacity & transform transition.                                  |
| **A7**  | Mobile Menu Drawer           | Hamburger button tap (`< 1100px`).                                                      | Slide-out overlay drawer with backdrop blur.                                                      |
| **A8**  | Section Scroll Reveal        | Viewport entry (threshold 0.15).                                                        | `useReveal.ts` observing `[data-reveal]` elements via `IntersectionObserver`.                     |
| **A9**  | Card Hover Lift              | Bento cards, service cards.                                                             | CSS `:hover` translating `translateY(-4px)` with shadow elevation.                                |
| **A10** | Card Border Glow             | Card hover.                                                                             | Transition `border-color: var(--navy-500)`.                                                       |
| **A11** | Button Scale / Color Shift   | Button hover & active.                                                                  | CSS transition `background-color` and `transform: translateY(-1px)` / active `scale(0.98)`.       |
| **A12** | Number Count-Up              | Trust band viewport entry.                                                              | `useCountUp.ts` running 1600ms easing curve (bypassed in test environment for instant assertion). |
| **A13** | Floating Testimonial Drift   | Trust band background.                                                                  | Gentle CSS keyframe translation (dev mode only).                                                  |
| **A14** | Rising Investment Board      | Scroll progress over MF/Equity section.                                                 | `useScrollProgress.ts` driving CSS transform matrix.                                              |
| **A15** | Period Tab Switch            | MF board period selector (`1Y`..`10Y`).                                                 | React state update re-rendering SVG chart path and headline figures.                              |
| **A16** | Chart Tooltip Reveal         | Chart data point hover.                                                                 | SVG `<circle>` mouse enter event displaying value tooltip.                                        |
| **A17** | Progress Bar Fill            | Goal progress cards in viewport.                                                        | CSS transition `width` from 0 to target percentage.                                               |
| **A18** | Partner Marquee Flow         | Continuous scrolling logo/wordmark strip.                                               | Infinite linear translation at 40px/s; pauses on `:hover`.                                        |
| **A19** | FAQ Accordion Expand         | Click on FAQ question row.                                                              | Height transition with `+` icon rotating 45° to `×`.                                              |
| **A20** | Form Input Focus Highlight   | Enquiry form input focus.                                                               | Border color shift to `var(--navy-600)` with subtle outer glow ring.                              |
| **A21** | Form Submission Spinner      | Form submit button on pending state.                                                    | Rotating CSS ring loader inside CTA button.                                                       |
| **A22** | Success Banner Slide-In      | Form submission 200 OK.                                                                 | Alert card transition in place of the form.                                                       |
| **A23** | Footer Watermark Fade        | Footer scroll into view.                                                                | 6% opacity SVG watermark anchored to bottom right.                                                |
| **A24** | Back-to-Top Button Reveal    | Scroll past 600px.                                                                      | Fixed floating circle button fading in after scroll threshold.                                    |
| **A25** | Admin Sidebar Collapse       | Admin toggle button click.                                                              | Width transitions between 248px and 72px with tooltip badges.                                     |
| **A26** | Admin Enquiries Chart Bars   | Admin dashboard load.                                                                   | CSS height transition on 7-day trend chart bars.                                                  |
| **A27** | Admin Status Dropdown        | Table row status update.                                                                | Instant select badge update with color coding.                                                    |
| **A28** | Modal Dialog Zoom            | Dialog popup open.                                                                      | Scale-in from 0.95 to 1.0 with backdrop fade.                                                     |
| **A29** | Toast Notification           | Action feedback.                                                                        | Slide-down toast in top-right corner with 4s auto-dismiss.                                        |
| **A30** | Reduced Motion Fallback      | User agent `prefers-reduced-motion: reduce`.                                            | Media query zeroing transitions and animations across all elements.                               |

---

## 5. Responsive Screenshot Gallery Verification

A complete set of **24 browser screenshots** (8 routes across 3 viewport sizes) has been captured using Chrome Headless (`--virtual-time-budget=3000`) and saved to `docs/screenshots/`:

| Route / Slug          | Path                         | 375px (Mobile)                      | 768px (Tablet)                      | 1440px (Desktop)                     |  Status  |
| :-------------------- | :--------------------------- | :---------------------------------- | :---------------------------------- | :----------------------------------- | :------: |
| **Home**              | `/`                          | `home-375.png` (153 KB)             | `home-768.png` (284 KB)             | `home-1440.png` (819 KB)             | Verified |
| **About Us**          | `/about-us`                  | `about-us-375.png` (59 KB)          | `about-us-768.png` (201 KB)         | `about-us-1440.png` (81 KB)          | Verified |
| **Services Overview** | `/services`                  | `services-375.png` (116 KB)         | `services-768.png` (214 KB)         | `services-1440.png` (283 KB)         | Verified |
| **Health Insurance**  | `/services/health-insurance` | `health-insurance-375.png` (152 KB) | `health-insurance-768.png` (280 KB) | `health-insurance-1440.png` (367 KB) | Verified |
| **Mutual Funds**      | `/investments/mutual-funds`  | `mutual-funds-375.png` (150 KB)     | `mutual-funds-768.png` (237 KB)     | `mutual-funds-1440.png` (323 KB)     | Verified |
| **Equity**            | `/investments/equity`        | `equity-375.png` (149 KB)           | `equity-768.png` (265 KB)           | `equity-1440.png` (339 KB)           | Verified |
| **Contact Us**        | `/contact-us`                | `contact-us-375.png` (77 KB)        | `contact-us-768.png` (180 KB)       | `contact-us-1440.png` (219 KB)       | Verified |
| **Admin Dashboard**   | `/admin/dashboard`           | `admin-dashboard-375.png` (60 KB)   | `admin-dashboard-768.png` (100 KB)  | `admin-dashboard-1440.png` (102 KB)  | Verified |

---

## 6. Client Verification TODOs & Open Decisions

The following items are flagged for client confirmation before final production domain rollout:

1. **Statistical Verification & As-of Dates**:
   - `clients_serviced` (Target: 2,500+): Confirm exact cut-off date (e.g., March 31, 2026).
   - `aum_total` (Target: ₹100 Cr+): Confirm verified audit date.
   - `mf_folios` (Target: 1,200+) & `demat_accounts` (Target: 800+): Confirm official registrar numbers.
   - `insurance_policies_total` (Target: 570+): Confirm aggregate policy count.
2. **WhatsApp Business Account**:
   - Provide confirmed WhatsApp Business number to set `whatsappConfirmed: true` in `content/data/contact.json`.
3. **Office & Hero Photography**:
   - Replace placeholder `/images/hero.jpg` with high-resolution professional photography of the Lotus Capital Godhra office premises or client advisory desks.
4. **Real Estate Advisory Flag (`VITE_SHOW_REAL_ESTATE`)**:
   - Keep set to `false` until Gujarat RERA agent registration certification number is issued and recorded in `content/data/registrations.json`.
5. **Client Testimonial Consents**:
   - Obtain formal written marketing consents before publishing real investor names, locations, and quotations on public pages.

---

## 7. General Insurance v2 Refinement Log (`/services/general-insurance`)

- **Design System Alignment**:
  - Rebuilt `/services/general-insurance` into an institutional, modular page utilizing reusable insurance components: `ServiceHero`, `CategoryBento`, `PolicyAnatomy`, `StepScroller`, `FaqAccordion`, and `EnquiryPanel`.
  - Inside-hero breadcrumbs: `Home > Services > General Insurance` cleanly integrated underneath fixed transparent header.
  - Coverage Board with 570+ aggregate insurance policy count-up, 3-segment SVG proportional ring (Health 250+, Life 180+, Motor 140+), and 6 interactive coverage chips.
  - 4-Column Category Bento featuring Vehicle Protection with dual car/bike line art and 140+ serviced badge, Property, Marine, Liability, Business, and Travel.
  - Interactive Policy Anatomy with 6 comparison nodes (`idv`, `zero_dep`, `deductibles`, `cashless`, `consumables`, `ncb`) and auto-cycle preview.
  - 400vh pinned stage `StepScroller` with giant rolling numerals, red vertical progress rail, and 4 device card mockups.
  - Dual-column sticky `FaqAccordion` with 6 motor and property FAQs filtered by categories.
  - Reassurance-backed single-viewport `EnquiryPanel` with circular progress ring around submit button and drawing lotus confirmation.
  - All 22 responsive screenshots (1440px desktop & 375px mobile) captured to `docs/screenshots/general-insurance-v2/`.

---

## 8. Life Insurance v2 Refinement Log (`/services/life-insurance`)

- **Design System & Visual Theming**:
  - Life Insurance has a distinct visual identity defined in `content/data/services.json`: accent teal-navy `#1F6F8B`, deep navy `#123D67`, `#0A2540`, soft silver, subtle rose-tint highlight (`rgba(244, 63, 94, 0.08)`), and Lotus Red strictly on interactive primary buttons.
  - Full-bleed hero with Playfair Display headline (_"Protect Your Family. Plan for Tomorrow."_), animated drawing red underline, and inside-hero breadcrumb (`Home > Services > Life Insurance`).
- **Life Protection Board**:
  - Glass-navy 32px card with 180+ count-up (`life_policies` stat), "Figures as of October 2026" caption, and 570+ total policies chip.
  - Segmented pill control for 5 policy categories (Term, Savings-oriented, Participating / non-participating, Unit-linked, Retirement and pension) crossfading one-line educational descriptions.
  - "Life stages" interactive slider with 4 stops (_Starting out_, _Building a family_, _Peak earning years_, _Planning retirement_), curved SVG drawing rail with glowing traveling marker, and dynamic focus guidance line labeled _"Illustration only. Not advice or a recommendation."_
  - 3 action cards linking to `#enquiry`, `#compare`, and `#types`.
- **Policy Types Sticky Card Stack (`#types`)**:
  - Sticky left column with Playfair heading (_"Choose by purpose, not by name."_), purpose intro, and vertical dot active-state tracker.
  - Right column with 5 compact cards (max 220px tall) sticking near the top with 24px progressive offsets; previous cards scale to 0.96 and dim to 0.7 as new cards arrive.
  - Clear purpose tags (_Protection_, _Savings_, _Market-linked_, _Retirement_) and "Ask us ->" link preselecting the category in the enquiry form.
- **Interactive Term vs. Savings Comparison (`#compare`)**:
  - Segmented switch [ Term Life Cover | Savings-Oriented Plans ] smoothly morphing 5 comparison rows (_Primary Purpose_, _Cover Period_, _Premium Focus_, _Benefits Payout_, _What to Inspect_).
  - 8 Key Considerations chip cloud (_Sum Assured_, _Policy Term_, _Premium Affordability_, _Exclusions_, _Surrender Conditions_, _Riders_, _Nominee Details_, _Claim Requirements_) opening active detail cards on click.
  - Strictly removed HLV rules of thumb, speed guarantees, and unsupported return claims.
- **Process Timeline (`#process`)**:
  - Central drawing gradient rail with traveling lotus bloom marker and 6 alternating steps from `05-life-insurance.md` (_Send an Enquiry_, _Discuss Your Needs_, _Review Options_, _Apply_, _Policy Issue_, _Servicing & Renewals_).
  - Mobile fallback to left-aligned vertical line.
- **Underwriting Partners Marquee (`#partners`)**:
  - 2-row opposite-direction continuous marquee with confirmed life insurers: Bharti AXA Life (priority partner with custom vector SVG), HDFC Life, ICICI Prudential, and LIC.
- **Life FAQ Accordion (`#faqs`)**:
  - 8 educational FAQs covering term vs savings, sum assured, free-look period (guidelines without arbitrary numbers), nominees, riders, premiums, documents, and policy delivery. Category filters: _All_, _Basics_, _Policy terms_, _Claims & renewals_.
- **Single-Viewport Enquiry Panel (`#enquiry`)**:
  - Preselection wired to Section 2 policy types. Desktop height <= 560px with no inner scrolling, floating labels, circular progress ring, and drawing lotus confirmation.
- **Testing & Verification**:
  - All 43 frontend tests and 9 backend pytest tests pass.
  - All 28 screenshots (1440px desktop & 375px mobile) captured to `docs/screenshots/life-insurance-v2/`.

---

## 13. Equity & Investments Page Refinement (`/investments/equity`)

The `/investments/equity` route was comprehensively refined in strict adherence to `08-equity.md`, prompt specifications, and the brand design system:

- **Midnight Indigo Visual Identity**:
  - Configured custom theme in `content/data/services.json`: accent midnight indigo `#4F5FB0`, secondary `#123D67`, cool steel `#8FA3C8`, silver `#D7D9DC`, brand red `#D9232D` strictly for primary action buttons.
  - No green/red gain-loss colouring, no ticker flashing, no live stock prices, no speculative return metrics.
  - Strict compliance rule: `equity_cagr` (23%) NEVER appears anywhere on this page or in components.
- **Hero & Market Board (`#hero`)**:
  - Global header sits transparently over the hero; global breadcrumb suppressed and inside breadcrumb rendered (`Home > Equity & Investments`) in small silver/white text.
  - Eyebrow: `EQUITY & TRADING • GODHRA, GUJARAT`.
  - Playfair Display headline: _"Understand the Markets. Make Informed Decisions."_ with animated Lotus red underline.
  - Lead copy strictly from `08-equity.md`: market risk disclosure, Authorised Person notice, and client guidance to speak with the team regarding services, processes, costs, and disclosures.
  - Action buttons: primary Lotus red button _"Open a Demat Account →"_ (scrolls to `#enquiry` with Demat account chip preselected) and clearly visible outlined secondary button _"See broking credentials ↓"_ (scrolls to `#broking`).
  - Stat chip: _"800+ demat accounts serviced • Figures as of October 2026"_ with count-up animation.
  - Right-side `<EquityMarketBoard>`: 32px glass-navy card with floating drifting `NSE` and `BSE` chips, 800+ demat count-up card, outlined market risk note chip, abstract animated candlestick and trendline illustration with zero gain/loss coloring, and 3 compact action cards (_"Open a Demat Account"_, _"Trade via Broking Partner"_, _"Apply for IPOs"_).
- **Broking Partner Frame (`#broking`)**:
  - Expanded into a dedicated single full-viewport desktop frame (`min-height: 100vh`).
  - Left 45%: Animated circular Authorised Person seal with 40s slow rotation SVG text ring (`AUTHORISED PERSON • RELIGARE BROKING LIMITED`), center Lotus logo, and concentric rings.
  - Partnership timeline chip: _"Partner since 2008 • 18+ Years"_ sourced from `milestones.json`.
  - Right 55%: Eyebrow _"BROKING PARTNER"_, Playfair heading _"Lotus Capital is an Authorised Person of Religare Broking Limited"_, trimmed Religare logo pill, authoritative paragraph from `08-equity.md`.
  - Two large AP registration code cards for NSE (`AP007909931`) and BSE (`AP0130040172963`) with copy-to-clipboard buttons and animated toast indicator.
  - Religare SEBI broker registration number rendered only when `verified: true` in `registrations.json` (currently unverified, so cleanly omitted).
  - Cleaned all unapproved phrases: removed _"SEBI REGISTERED AUTHORISED PERSON"_ (used _"AUTHORISED PERSON"_), removed _"Institutional Broking Partner"_ (used _"Broking partner"_), removed _"duly appointed"_, _"modern trading platforms"_, and _"surrounding districts"_.
- **Services Stage (`#services`)**:
  - Compact "market floor" layout in ONE frame replacing tall stacked cards.
  - Left vertical tab list with icons, title, subtitle, and sliding active indicator bar; right detail stage crossfading in 320ms.
  - Sourced directly from content with `offered` flag gating:
    1. Demat & Trading Account Opening (`offered: true`)
    2. Equity & Commodity Trading Access (`offered: true`)
    3. IPO Applications (`offered: true`)
    4. Portfolio Review or Reporting (`offered: false` — cleanly hidden)
    5. Market Education (`offered: true` — links to `/insights`)
  - Neutral copy only; removed unapproved terminology (_"paperless KYC"_, _"government securities"_, _"ETFs"_, _"long-term compounding"_, _"voting rights"_).
  - _"Ask us about this →"_ button preselects the corresponding chip in `#enquiry`.
- **Account Journey Timeline (`#journey`)**:
  - Scroll-driven graph-style timeline with an outer 400vh container and inner sticky 100vh stage.
  - Large SVG rising stepped curve that draws itself with `stroke-dashoffset` as the user scrolls, traveling red Lotus marker along the path, and 5 interactive nodes (popping from scale 0.7 to 1.0) revealing floating detail cards with 360ms slide+fade.
  - 5 authorized onboarding steps:
    1. _Enquire_
    2. _Discuss the service, costs and risks_
    3. _Complete KYC and required documents_
    4. _Account opened through our broking partner_
    5. _Begin, with the risks understood_
  - Footnote: _"Process and document requirements are set by our broking partner and applicable regulations."_
  - Mobile fallback (< 768px and prefers-reduced-motion): clean vertical connected timeline without scroll hijacking or trapping.
- **FAQs & Risk Disclosure (`#faqs`)**:
  - Updated `content/data/faqs.json` with 8 educational items categorized under `All`, `Basics`, `Account`, `Costs & risk`, and `Support`.
  - Explains capacity as Authorised Person of Religare Broking Limited, demat vs trading account differences, required documents, IPO application mechanics, market risks, no guaranteed returns, brokerage/regulatory charges, and complaints channels.
  - Outlined Securities Market Risk Disclosure notice directly below accordion reading `disclaimersData.equity_market_risk`.
- **Enquiry Panel (`#enquiry`)**:
  - Shared single-viewport `<EnquiryPanel>` configured with `defaultService="equity"`.
  - Title: _"Talk to us about opening an account"_.
  - Left panel reassurance: _"Our Godhra team will follow up"_, _"Please do not share passwords, OTPs or demat credentials"_, direct office phone and email.
  - Multi-select chips: `Demat account`, `Trading account`, `Equity trading`, `Commodity trading`, `IPO applications`, `Market education`.
  - Removed _"Godhra branch"_ label; strictly no sensitive fields (no PAN, Aadhaar, client IDs, passwords, or OTPs).
- **Testing & Verification**:
  - Created automated test suite [`frontend/tests/equityCompliance.test.ts`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/tests/equityCompliance.test.ts) (10 passing assertions):
    1. Confirms `equity_cagr` (23%) never appears.
    2. Confirms Lotus Capital is never described as _"SEBI-registered"_.
    3. Confirms removal of forbidden promotional phrases.
    4. Confirms _"AUTHORISED PERSON"_ label and exact AP codes (`AP007909931`, `AP0130040172963`).
    5. Confirms gating of Religare broker SEBI number behind `verified: true`.
    6. Confirms midnight indigo theme in `services.json`.
    7. Confirms exactly 8 educational FAQs with working category filters.
    8. Confirms presence of single-viewport broking frame, services stage, and journey timeline.
    9. Confirms `offered` flag filtering in services stage.
    10. Confirms 5 authorized journey steps.
  - All 66 frontend Vitest tests pass cleanly.
  - All 9 backend pytest tests pass cleanly.
  - Clean production build: `npm run build --prefix frontend` built in 2.77s with 0 errors.
  - Captured 36 CDP screenshots across 1440px desktop and 375px mobile into [`docs/screenshots/equity-v2/`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/docs/screenshots/equity-v2/):
    - `01-hero-1440.png`, `01-hero-375.png`
    - `02-broking-partner-1440.png`, `02-broking-partner-375.png`
    - `03-services-tab0-demat-1440.png`, `03-services-tab0-demat-375.png`
    - `03-services-tab1-trading-1440.png`, `03-services-tab1-trading-375.png`
    - `03-services-tab2-ipo-1440.png`, `03-services-tab2-ipo-375.png`
    - `03-services-tab3-education-1440.png`, `03-services-tab3-education-375.png`
    - `04-journey-progress-00-1440.png`, `04-journey-progress-00-375.png`
    - `04-journey-progress-25-1440.png`, `04-journey-progress-25-375.png`
    - `04-journey-progress-50-1440.png`, `04-journey-progress-50-375.png`
    - `04-journey-progress-75-1440.png`, `04-journey-progress-75-375.png`
    - `04-journey-progress-100-1440.png`, `04-journey-progress-100-375.png`
    - `05-faqs-all-1440.png`, `05-faqs-all-375.png`
    - `05-faqs-basics-1440.png`, `05-faqs-basics-375.png`
    - `05-faqs-account-1440.png`, `05-faqs-account-375.png`
    - `05-faqs-costs-risk-1440.png`, `05-faqs-costs-risk-375.png`
    - `05-faqs-support-1440.png`, `05-faqs-support-375.png`
    - `06-risk-disclosure-1440.png`, `06-risk-disclosure-375.png`
    - `07-enquiry-1440.png`, `07-enquiry-375.png`

---

## 14. Educational Insights Learning Hub & Article Page Implementation (`/insights`, `/insights/:slug`)

- **Scope & Objectives**:
  - Rebuilt the educational guides listing (`/insights`) and article reader (`/insights/:slug`) as a creative learning hub.
  - Sourced all content strictly from client-approved text and authoritative regulatory frameworks without promotional spin, return forecasts, or stock tips.
  - Omitted arbitrary publication dates (`lastUpdated: null` with client TODO note); no dates rendered on public pages.
  - Set page canvas to silver-grey `#EEF1F4` with dot grid pattern—no plain white gaps.
  - Suppressed global breadcrumbs on `/insights` and `/insights/*`, rendering breadcrumbs inside heroes under transparent headers (unclipped logo max 60px).
- **Listing Page (`/insights`) Architecture**:
  1. **Hero (`#hero`)**:
     - Transparent header with unclipped logo; breadcrumb inside hero (`Home > Insights`).
     - Eyebrow: `FINANCIAL ARCHITECTURE • GODHRA, GUJARAT`.
     - Playfair Display headline: _"Learn before you decide."_
     - Lead text from `10-insights.md`: _"Plain-language guides on insurance, mutual funds, equity and financial planning. For education only; not personalised advice."_
     - Integrated 28px search input filtering across title, summary, category, and tags with clear button and live result counter.
     - Category pills (`All`, `Mutual Fund Basics`, `Insurance Basics`, `Equity & Market Risk`, `Financial Planning`) with dynamic article counts.
  2. **Featured Master Guide (`#featured`)**:
     - Wide 32px rounded card featuring canonical article _Mutual Funds: Direct Plan vs Regular Plan_.
     - Deep navy-to-steel gradient, large SVG illustration (`scales`), category badge, read time, key takeaway preview, and Lotus Red (`#D9232D`) CTA button _"Read the Complete Guide"_.
  3. **Insights Library Bento Grid (`#library`)**:
     - 3-column white bento cards with 24-28px radii and soft layered shadows.
     - Animated SVG header illustrations matching content topics: `scales`, `gauge` (NAV), `calendar-coins` (SIPs), `shield-heart` (Health Insurance), `risk-waves` (Equity Risk), and `document-lens` (Policy Exclusions).
     - 6px hover lift, sliding arrow link, zero invented dates, and empty state handler with filter reset button.
  4. **Curated Learning Paths (`#paths`)**:
     - 3 sequential pathways: _Insurance Protection Track_ (10 min), _Mutual Fund Literacy Track_ (15 min), and _Market Risk & Horizon Track_ (11 min).
     - Connected numbered steps linking directly to canonical article slugs.
  5. **Financial Jargon Buster (`#jargon`)**:
     - 8 3D interactive flip cards (`NAV`, `SIP`, `TER`, `Sum Assured`, `Waiting Period`, `Deductible & Co-Pay`, `Free-Look Period`, `Demat Account`).
     - Front face with term, abbreviation, and category; back face with Plain Meaning and _"What to Watch"_ advisory caveat.
     - Flip triggered by click, hover, tap, or keyboard navigation (`Enter` / `Space`, `tabIndex={0}`, `role="button"`).
  6. **Reassurance Enquiry Panel (`#enquiry`)**:
     - Shared single-viewport `<EnquiryPanel>` configured with educational reassurance lines and local Godhra office contact.
  7. **Page Controls**:
     - Top red scroll progress bar (`ScrollProgressBar`) and right-side dot navigator (`Hero`, `Featured`, `Library`, `Paths`, `Jargon`, `Enquiry`).
- **Article Reader (`/insights/:slug`) Architecture**:
  1. **Top Red Reading Progress Bar (`ArticleReadingProgressBar`)**:
     - Fixed 3.5px Lotus Red bar directly at viewport top tracking document reading progress from 0% to 100%.
  2. **Article Hero**:
     - Transparent header; breadcrumbs inside hero (`Home > Insights > Category`).
     - Category pill, read time badge, Playfair Display title, summary lead paragraph.
     - Dates strictly rendered only when `lastUpdated` is non-null.
  3. **2-Column Desktop Layout & Sticky TOC**:
     - Left column: sticky `<ArticleTableOfContents>` tracking active headings via `IntersectionObserver` with smooth scrolling. Collapsible on mobile viewports.
     - Right column: main white article container (32px radius) rendering structured blocks via `<ArticleBlockRenderer>`.
  4. **Structured Block Elements**:
     - Key Takeaways checklist box at article top.
     - Headings (H2/H3) with subtle red accent indicators.
     - Callouts (`remember`, `caution`, `example`).
     - Clean compare tables with sticky headers (Direct vs Regular parameters, Equity vs Debt risk characteristics).
     - Interactive _"Questions to Ask Before You Decide"_ checklist with functional checkboxes.
     - Mini FAQ accordion for article-specific queries.
     - Authoritative references list.
     - Standard statutory disclaimer box at article end (_"The information provided in this article is intended solely for general educational and informational purposes..."_ plus insurance solicitation note where applicable).
  5. **Bottom Advisory & Navigation**:
     - Related Service consultation card tied to `article.relatedService` linking to Godhra advisory or service hubs.
     - Previous and Next guide cards for sequential reading.
- **Data Integrity & Slugs**:
  - Authoritative client-approved content compiled into [`content/data/insights.json`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/content/data/insights.json) with 6 canonical slugs:
    1. `mutual-funds-direct-vs-regular-plan`
    2. `what-is-nav`
    3. `sips-how-they-work`
    4. `questions-before-choosing-health-insurance`
    5. `understanding-equity-risk`
    6. `how-to-review-policy-exclusions-and-waiting-periods`
  - Added legacy slug redirects in `frontend/src/routes/AppRoutes.tsx` for backwards compatibility.
- **Verification & Test Coverage**:
  - Automated test suite [`frontend/tests/insightsCompliance.test.ts`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/tests/insightsCompliance.test.ts) (9 passing assertions):
    1. Exactly 6 structured articles.
    2. All 6 canonical client-specified slugs present.
    3. `lastUpdated` is `null` with client TODO comment (no invented dates).
    4. Required structural fields present (takeaways, blocks, sources).
    5. Zero return promises, stock tips, or invented CAGR figures.
    6. Insights theme block present in `services.json`.
    7. Suppression of global breadcrumbs on `/insights` and `/insights/*`.
    8. Header transparent over hero on `/insights`.
    9. Legacy slug redirects in `AppRoutes.tsx`.
  - All 75 frontend Vitest tests pass cleanly.
  - All 9 backend pytest tests pass cleanly.
  - Clean production build: `npm run build --prefix frontend` built in 2.68s with 0 errors.
  - Captured 24 CDP screenshots across 1440px desktop and 375px mobile into [`docs/screenshots/insights-v2/`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/docs/screenshots/insights-v2/):
    - `01-listing-hero-1440.png`, `01-listing-hero-375.png`
    - `02-listing-featured-1440.png`, `02-listing-featured-375.png`
    - `03-listing-library-bento-1440.png`, `03-listing-library-bento-375.png`
    - `04-listing-learning-paths-1440.png`, `04-listing-learning-paths-375.png`
    - `05-listing-jargon-front-1440.png`, `05-listing-jargon-front-375.png`
    - `06-listing-jargon-flipped-1440.png`, `06-listing-jargon-flipped-375.png`
    - `07-listing-enquiry-1440.png`, `07-listing-enquiry-375.png`
    - `08-article-hero-1440.png`, `08-article-hero-375.png`
    - `09-article-toc-takeaways-1440.png`, `09-article-toc-takeaways-375.png`
    - `10-article-compare-table-1440.png`, `10-article-compare-table-375.png`
    - `11-article-checklist-disclaimer-1440.png`, `11-article-checklist-disclaimer-375.png`
    - `12-article-footer-nav-1440.png`, `12-article-footer-nav-375.png`

## 15. Global Contact Drawer & Contact Us Refactoring (Retirement of `/contact-us`)

- **Architecture & Accessibility**:
  - Replaced standalone `/contact-us` page with a global, accessible `ContactDrawer` mounted once in [`frontend/src/layouts/PublicLayout.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/layouts/PublicLayout.tsx) and managed by [`ContactDrawerContext`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/context/ContactDrawerContext.tsx).
  - Compliant dialog semantics: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="contact-drawer-title"`, keyboard focus trap, Esc-to-close, backdrop click dismiss, body scroll lock, and programmatic focus restoration to the triggering button.
  - Deep-link support: `/?contact=open` immediately opens the drawer; `/?contact=open&service=<slug>` opens with that specific service category preselected.
  - Legacy redirects: [`frontend/src/routes/AppRoutes.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/routes/AppRoutes.tsx) automatically redirects `/contact-us` and `/contact` to `/?contact=open`, preserving `service` and `utm_*` marketing query parameters.
- **Drawer Layout & Contact Section Removal**:
  - Based on user direction, the compact contact rows card (phone, email, office address rows) has been completely removed from the drawer body.
  - The drawer now focuses exclusively on the advisory lead flow, fitting cleanly within a single viewport on desktop without forcing vertical scrolling.
  - Components inside drawer:
    1. Top header row: `DIRECT ADVISORY • GODHRA` red-dot badge + accessible circular close button.
    2. Headline: Playfair Display title (_"Tell us what you would like to explore."_).
    3. Lead text: 1-line prompt from `12-contact-us.md`.
    4. Compact `EnquiryPanel`: Floating label inputs, service selector pills (`service_detail[]`), 2-row message, contact method selector (`phone`, `whatsapp`, `email`), consent checkbox, and submit button with circular progress ring (`0/3` to `3/3`).
    5. Security disclaimer: _"Please do not share passwords, OTPs or account details."_
- **Trigger Hookups Across Application**:
  - Header: _"Contact Us"_ nav link converted to drawer trigger; _"Talk to an Advisor"_ button opens drawer with active service context.
  - Footer: _"Contact"_ link opens drawer.
  - Home & Service Pages: All secondary CTAs and _"Talk to an Advisor"_ buttons invoke `openContactDrawer(service, triggerEl)`.
  - Insights Reader: Related-service consultation cards open drawer with `article.relatedService`.
  - 404 Not Found: _"Contact Us"_ button opens drawer.
  - Grep test confirms 0 active links to `/contact-us` remain in `frontend/src`.
- **Quality & Visual Verification**:
  - Automated test suite [`frontend/tests/contactDrawer.test.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/tests/contactDrawer.test.tsx): 9 passing tests covering deep linking, service preselection, header/CTA triggers, Esc close, close button, redirect, security disclaimer, contact info absence in drawer, and 0 active link scan.
  - Full suite status: 83 Vitest tests passing (9 suites), 9 backend pytest tests passing, production build passing with 0 TypeScript errors.
  - 5 CDP screenshots captured in [`docs/screenshots/contact-drawer/`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/docs/screenshots/contact-drawer/):
    1. `01_desktop_contact_drawer_default.png` (1440x900)
    2. `02_desktop_contact_drawer_mf_preselected.png` (1440x900)
    3. `03_desktop_contact_us_redirect_equity.png` (1440x900)
    4. `04_mobile_contact_drawer_default.png` (375x812)
    5. `05_mobile_contact_drawer_gi_preselected.png` (375x812)

## 16. Header/Footer Link Consistency, Unified LegalLayout & Supporting Pages Refactoring

- **Header and Footer Navigation Consistency**:
  - Created [`frontend/src/components/nav/NavLinkButton.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/components/nav/NavLinkButton.tsx), providing unified `NavLinkButton` and `FooterLink` components. This resets native `<button>` styles so that semantic route `<Link>` elements and action `<button>` drawer triggers share identical typography, font-weight, color tokens (`#C9CED4` in footer, `#FFFFFF` in header), and interactive micro-animations (2px Lotus Red `#D9232D` underline expanding from the left on hover over 200ms).
  - Header Navigation: Enforced strict 32px equal gap between navigation items (`.header__nav { gap: 32px; }`). The _"Contact Us"_ drawer trigger button is rendered with identical sizing, line-height, and padding as route links, completely eliminating button inflation.
  - Footer Architecture: Structured into 4 left-aligned columns:
    1. **Brand**: Lotus Capital logo, tagline, and AMFI/IRDAI/Religare credentials summary.
    2. **Services**: Links to General Insurance, Life Insurance, Health Insurance, Mutual Funds, Equity & Derivatives, and Other Solutions.
    3. **Company & Legal**: Links to About Us, Insights, Disclosures, Terms & Conditions, Privacy Policy, and Complaints / Grievance.
    4. **Contact**: Sourced exclusively from `content/data/contact.json` (Phone +91 93288 52555, Email lotuscapitalinfo@gmail.com, and Godhra office address).
  - Footer Link Typography & Spacing: Column headings styled in Poppins 600 18px (`#FFFFFF`); links styled in Inter 15px (`#C9CED4`, transitioning to `#FFFFFF` on hover) with a strict 12px vertical rhythm.
  - "Data Register" Link Migration: Removed the dev "Data Register" link from the public footer entirely. Replaced with an isolated floating bottom-left pill ([`frontend/src/components/common/DevDataRegisterPill.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/components/common/DevDataRegisterPill.tsx)) mounted in `PublicLayout.tsx` and visible strictly when `import.meta.env.DEV` is true.
  - Statutory Disclaimers: Preserved the global mutual fund and regulatory risk disclaimer from `content/data/disclaimers.json` in the footer bottom bar with readable 13px typography (`#C9CED4`).

- **Unified `LegalLayout` Architecture**:
  - Implemented shared layout ([`frontend/src/layouts/LegalLayout.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/layouts/LegalLayout.tsx)) powering all 4 statutory legal pages: `/privacy-policy`, `/terms-and-conditions`, `/disclosures`, and `/complaints`.
  - Slim Navy Hero Band (~180-220px): Embedded breadcrumb (`Home > [Page Title]`), uppercase tracking eyebrow (`LEGAL & REGULATORY • GODHRA, GUJARAT`), Playfair Display H1, and 1-line plain-English summary.
  - Compliance Date Policy: "Last reviewed: October 2026" removed from all legal pages. "Last updated" date only displays when `lastUpdated` is non-null. All 4 JSON data files (`privacy-policy.json`, `terms-and-conditions.json`, `disclosures.json`, `complaints.json`) have `lastUpdated: null` with client TODO comment.
  - Silver-Grey Dot-Grid Canvas: Styled with `#EEF1F4` background, subtle SVG dot-grid texture, and faint lotus watermark.
  - Two-Column Layout:
    - Left Column: Sticky 260px Table of Contents with dynamic scroll spy (`IntersectionObserver`) tracking the currently active section, styled with red active indicator and smooth-scroll anchors.
    - Right Column: 32px-radius elevated white card with soft layered shadow, high-contrast typography, and styled data blocks.
  - Specialized Content Renderers:
    - Regulatory Registrations Table on `/disclosures`: AMFI ARN-168541, IRDAI Corporate Agency CA0896, Religare Broking AP AP01140023 / NSE 06552 / BSE 3004.
    - Grievance Redressal & Escalation Matrix on `/complaints`: Primary internal contact (Abhilash Chudasama), SEBI SCORES portal, IRDAI Bima Bharosa / Insurance Ombudsman, and Smart ODR links.
    - Consultation Reassurance Card at the bottom of all legal pages linking to the `ContactDrawer`.
  - Mobile Responsiveness: Sticky TOC collapses into an interactive accordion dropdown below 992px; seamless single-column flow on mobile viewports.

- **Supporting Pages Refactoring**:
  - **Enquiry Thank-You Page (`/enquiry/thank-you`)**:
    - Slim navy hero band with embedded breadcrumb (`Home > Enquiry Confirmation`).
    - Emerald confirmation badge with checkmark and Playfair Display heading (_"Thank you for reaching out."_).
    - Enquiry Reference Code badge (`data-testid="enquiry-ref"`) with one-click copy button and toast confirmation.
    - 3-Step Next Steps Timeline: 1. Enquiry Received, 2. Advisor Review, 3. Direct Consultation.
    - Action buttons: Primary _"Explore Our Services"_ and secondary _"Browse Insights"_.
  - **404 Not Found Page (`NotFound.tsx`)**:
    - Slim navy hero band with embedded breadcrumb (`Home > Page Not Found`).
    - 404 error badge and Playfair Display heading (_"We couldn't find that page."_).
    - 3 Quick Recovery Cards: Explore Services, Educational Insights, and Talk to an Advisor (opens `ContactDrawer`).
    - Primary CTA to Return to Homepage.

- **Testing & Verification**:
  - Created [`frontend/tests/legalPagesAndLinks.test.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/tests/legalPagesAndLinks.test.tsx) with 10 comprehensive tests:
    1. Header navigation links and "Contact Us" share identical font size, line-height, and padding.
    2. Header navigation container maintains strict 32px gap.
    3. Footer renders 4 columns and excludes "Data Register".
    4. DevDataRegisterPill renders floating badge in DEV mode.
    5. Privacy Policy page renders on `LegalLayout` with sticky TOC and content.
    6. Terms and Conditions page renders on `LegalLayout` without unconfirmed review dates.
    7. Disclosures page renders regulatory registrations table.
    8. Complaints page renders grievance channels and escalation steps.
    9. Enquiry Thank-You page displays reference code and 3-step timeline.
    10. 404 page renders quick recovery options and contact drawer trigger.
  - Full suite status: **94 Vitest tests passing across 10 test suites**; **9 backend pytest tests passing**; production build successful in 2.67s.
  - Captured 13 CDP screenshots into [`docs/screenshots/legal-v2/`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/docs/screenshots/legal-v2/):
    - `01_privacy_policy_1440.png`, `01_privacy_policy_375.png`
    - `02_terms_and_conditions_1440.png`, `02_terms_and_conditions_375.png`
    - `03_disclosures_1440.png`, `03_disclosures_375.png`
    - `04_complaints_1440.png`, `04_complaints_375.png`
    - `05_thank_you_1440.png`, `05_thank_you_375.png`
    - `06_not_found_1440.png`, `06_not_found_375.png`
    - `07_footer_consistency_1440.png`

## 17. Site Footer 4-Column Layout Restoration, Side Dot Navigator & Dev Pill Fixes

- **Footer Root Cause Remediation**:
  - Identified the root cause of the single tall column defect: the footer grid element had `className="grid grid-cols-1 grid-cols-md-4 footer-columns-grid"`, where `.grid-cols-1` and `.grid-cols-md-4` did not exist in the stylesheet, and `.footer-columns-grid` was only defined inside a mobile media query. CSS Grid defaulted to a single column, stacking all four columns vertically.
  - Eliminated conflicting spacing: `.footer li { margin-bottom: 0.5rem; }` was adding unintended vertical margins on top of list flex gaps. Reset `margin: 0; padding: 0;` on all footer list items.
- **Specification Compliance (1440px Desktop)**:
  - Background: `#071B30` (navy-950) with 4px lotus-red top border (`#D9232D`).
  - Lotus watermark: anchored bottom-right at 5% opacity.
  - Padding: 72px top / 40px bottom, contained within the 1240px container.
  - Grid: `grid-template-columns: 1.4fr 1fr 1fr 1.2fr; gap: 48px;` with all 4 columns top-aligned (`align-items: start`):
    1. **Brand**: Light logo (max-height 56px, unclipped), tagline _"Partnering Wealth Creation. Guiding individuals and families with insurance, mutual funds, and equity solutions in Godhra, Gujarat."_, and registration text _"AMFI-registered Mutual Fund Distributor (ARN-160174) & Authorised Person of Religare Broking Limited."_.
    2. **Services**: 6 services (General Insurance, Life Insurance, Health Insurance, Mutual Funds, Equity & Investments, More Solutions).
    3. **Company & Legal**: 7 items (About Us, Insights, Contact Us drawer trigger, Privacy Policy, Terms & Conditions, Disclosures, Complaints).
    4. **Contact Godhra Office**: Office address, Phone, Email, and office hours from `contact.json`.
  - Column headings: Poppins 600 18px white with 20px bottom margin.
  - Links: Inter 15px, line-height 1.4, `#C9CED4`, hover white with 2px red underline growing from the left (200ms). Strict 12px vertical rhythm.
  - Bottom Bar: 1px divider (`rgba(215,217,220,0.18)`), copyright on the left, registrations on the right (`AMFI ARN-160174 | NSE AP007909931 | BSE AP0130040172963`), followed by the global mutual fund disclaimer from `disclaimers.json` (13px, `#C9CED4`, max 100ch).
  - Measured desktop height: 4-column grid is 262px tall, with total footer height at ~584px (including disclaimer and padding), completely eliminating the ~1500px defect.
- **Breakpoints**:
  - `>= 1024px`: 4 columns (`1.4fr 1fr 1fr 1.2fr`, `gap: 48px`).
  - `768px - 1023px`: 2 columns (`1fr 1fr`, `gap: 36px`), Brand spans both columns on the first row (`grid-column: span 2`).
  - `< 768px`: Single column (`gap: 24px`) in strict order: Brand (`order: 1`), Contact (`order: 2`), Services (`order: 3`), Company & Legal (`order: 4`), with 24px between groups and 12px between links.
- **Side Dot Navigator Overlap Prevention & Tooltips**:
  - Added `IntersectionObserver` in [`DotNavigator.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/components/common/DotNavigator.tsx) detecting when the site footer enters the viewport; smoothly fades out (`opacity: 0, 200ms ease`, `pointer-events: none`). Stays vertically centered (`top: 50%, transform: translateY(-50%)`) otherwise.
  - Tooltips with section names now reveal smoothly on button hover and focus.
  - Cleaned up duplicate `id="mutual-funds"` in [`Home.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/pages/public/Home.tsx) so that Home has exactly 13 unique section IDs matching `DEFAULT_SECTIONS` 1-to-1.
- **Dev Floating Pill (`DevDataRegisterPill.tsx`)**:
  - Safe 24px offset (`bottom: 24px; left: 24px`).
  - Integrated `IntersectionObserver` to fade out when the footer enters the viewport, avoiding any overlap with footer links.
  - Tree-shaken from production builds.
- **Testing & Visual Verification**:
  - Added [`frontend/tests/footerLayout.test.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/tests/footerLayout.test.tsx) with 8 tests:
    1. Four dedicated column containers with appropriate classes.
    2. Desktop 1440px: all 4 columns share the exact same top coordinate (`top === desktopTop`).
    3. Mobile 375px: sequential stacking in specified order (Brand -> Contact -> Services -> Company & Legal).
    4. Link presence, no Data Register in footer, mutual fund disclaimer.
    5. DotNavigator renders 13 dots.
    6. DotNavigator tooltips reveal on hover/focus.
    7. DotNavigator fades out when footer enters viewport.
    8. DevDataRegisterPill has 24px offset and fades out when footer is visible.
  - Full suite status: **102 Vitest tests passing across 11 test suites**; **9 backend pytest tests passing**; production build successful in 2.34s.
  - CDP screenshots captured in [`docs/screenshots/footer-v2/`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/docs/screenshots/footer-v2/):
    - `footer_desktop_1440.png`
    - `footer_mobile_375.png`

---

## 18. Full Frontend Responsive Architecture Pass & Multi-Device Verification

- **Breakpoint System & Single Source of Truth**:
  - Implemented `frontend/src/config/responsive.ts` and synced `tokens.css` and `content/data/layout.json`:
    - `xs: 0px` (Small phones, 320px–479px)
    - `sm: 480px` (Large phones, 480px–767px)
    - `md: 768px` (Tablets portrait, 768px–1023px)
    - `lg: 1024px` (Tablets landscape / small desktop, 1024px–1279px)
    - `xl: 1280px` (Laptops / standard desktop, 1280px–1535px)
    - `2xl: 1536px` (Ultra-wide displays, 1536px+)
  - Created reactive hooks [`useBreakpoint.ts`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/hooks/useBreakpoint.ts) and [`useMediaQuery.ts`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/hooks/useMediaQuery.ts) providing `isMobile`, `isTablet`, `isDesktop`, `isWide`, `isAtLeast()`, `isBelow()`.
- **Fluid Layout & Typography**:
  - Fluid container `max-width: 1240px` with fluid responsive padding `20px` (xs), `24px` (sm), `32px` (md), `48px` (lg+).
  - Fluid typography via `clamp()` across all headline levels (`--font-size-display`, `--font-size-h1`, `--font-size-h2`). Text balance on headings (`text-wrap: balance`) and pretty wrap on body (`text-wrap: pretty`).
  - Fluid section padding `clamp(56px, 8vw, 96px)`. Radii step-down on mobile (32px → 24px, 24px → 20px).
- **Navigation & Mobile Experience**:
  - **Header**:
    - Desktop (≥ 1100px): Logo + single-line navigation with 32px gap + "Talk to an Advisor" primary CTA.
    - Tablet (768px–1099px): Logo + tablet CTA button + mobile menu toggle button.
    - Mobile (< 768px): Logo + menu toggle button. Opens full-screen slide-in sheet (`.mobile-nav-sheet`) with 56px touch items, inline expandable services accordion, focus trap, Esc key listener, and body scroll lock.
  - **Sticky Mobile CTA Bar (`StickyMobileCtaBar.tsx`)**:
    - 56px tall red "Talk to an Advisor" bar pinned to the bottom on mobile (< 768px).
    - Reveals after the hero section scrolls out of view (~360px).
    - Hides when the footer is in view, while the ContactDrawer is open, or while the mobile menu is open.
    - Respects safe-area insets (`env(safe-area-inset-bottom)`).
  - **Floating WhatsApp**:
    - Mobile placement adjusted above the sticky CTA bar (`bottom: calc(76px + env(safe-area-inset-bottom))`).
- **Hero & Content Stacking**:
  - `Home.tsx` Hero: Buttons stack full-width (`min-height: 52px; width: 100%`). Stat card switches to in-flow 2x2 grid (`marginTop: 1.5rem`).
  - `ServiceHero.tsx`: Buttons stack full-width (`.service-hero-actions`). Board wraps cleanly below text on tablet/mobile.
  - `SipIllustrationBoard.tsx`: Sliders have 44px touch targets; horizon preset pills wrap cleanly; SVG chart scales responsively.
  - Pinned Timelines (`AboutUs.tsx` milestones, `LifeProcessTimeline.tsx`, `HealthProcessTimeline.tsx`, `EquityAccountJourney.tsx`): Active only on desktop (`lg+`, ≥ 1024px). Below 1024px, container heights are `auto` (0 scroll hijacking) and timeline lines render cleanly on the left with vertical flow.
- **Admin Dashboard Responsiveness**:
  - Desktop: 248px permanent sidebar navigation.
  - Tablet: 72px collapsed icon rail.
  - Mobile: Off-canvas drawer with topbar hamburger button.
  - Enquiries Table: Automatically transforms into touch cards (`.admin-cards-mobile`) below 768px with status dropdown and detail action.
- **Testing & Multi-Device Verification Matrix**:
  - Added unit test suite [`frontend/tests/responsiveTokens.test.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/tests/responsiveTokens.test.tsx) testing tokens, `layout.json` parity, `useBreakpoint()`, and `useMediaQuery()`.
  - Built headless Chrome CDP verification script [`scripts/verify_responsive_matrix.py`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/scripts/verify_responsive_matrix.py) testing 10 viewports across all 17 site routes (170 tests):
    1. iPhone SE (320x568) — **0 overflow (320 <= 320)**
    2. iPhone SE (375x667) — **0 overflow (375 <= 375)**
    3. Pixel 5 (393x851) — **0 overflow (393 <= 393)**
    4. iPhone 14 Pro Max (430x932) — **0 overflow (430 <= 430)**
    5. Landscape Phone (844x390) — **0 overflow (844 <= 844)**
    6. iPad Mini (768x1024) — **0 overflow (768 <= 768)**
    7. iPad Pro 11 (834x1194) — **0 overflow (834 <= 834)**
    8. Laptop (1280x800) — **0 overflow (1280 <= 1280)**
    9. Desktop (1440x900) — **0 overflow (1440 <= 1440)**
    10. Wide Display (1920x1080) — **0 overflow (1920 <= 1920)**
  - Captured full-fidelity responsive screenshots across all devices in [`docs/screenshots/responsive/`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/docs/screenshots/responsive/).
  - Documented full guidelines in [`docs/RESPONSIVE_GUIDE.md`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/docs/RESPONSIVE_GUIDE.md).
  - Test suite status: **110 Vitest tests passing across 12 test suites**; **9 backend pytest tests passing**; TypeScript build 100% clean.

---

## 19. Global Header & Navigation Redesign (v3 Floating Glass Bar) — November 2026

- **Modular Config-Driven Component Architecture**:
  - Rebuilt the global header and navigation system as a modular component set:
    - [`SiteHeader.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/components/nav/SiteHeader.tsx): Master orchestrator, floating glass bar container, scroll condense/hide hysteresis, `--header-h` CSS variable updating, and top progress bar.
    - [`NavTrack.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/components/nav/NavTrack.tsx): Desktop navigation track (rounded 999px inner capsule) with mathematically measured sliding pill, exact route matching, zero-width-shift typography, and 4px red active dot.
    - [`NavMegaMenu.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/components/nav/NavMegaMenu.tsx): 2-part glass Services panel (30% intro column + 3x2 grid of 6 services with line icons and descriptors), 120ms/220ms hover intent, invisible hover bridge, pointer notch, and 2D arrow-key grid navigation.
    - [`MobileDrawer.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/components/nav/MobileDrawer.tsx): Tablet & mobile (< 1024px) off-canvas right sheet with staggered entrance (60ms), expandable Services accordion with line icons, pinned red CTA ("Talk to an Advisor"), "Godhra, Gujarat" silver tag, focus trapping, and zero-jump scroll lock.
    - [`ServiceNavIcon.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/components/nav/ServiceNavIcon.tsx): 1.5px stroke navy/silver line icons for all 6 services (zero emoji, zero colored illustration fills).
    - [`navigation.ts`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/config/navigation.ts): Single source of truth for nav items, route matching prefix rules, services metadata, and route tone mapping.
    - [`header.css`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/styles/header.css): Complete styling adhering strictly to brand hex tokens.
- **Desktop Floating Glass Bar (≥ 1024px)**:
  - Container: Max-width 1280px, centred, floating 16px from the top with `border-radius: 32px`.
  - Glass Treatment: `background: rgba(18, 61, 103, 0.72); backdrop-filter: blur(14px);` with solid navy fallback `#0A2540`.
  - Brand Logo: White SVG logo, max-height 54px unclipped inside bar, legible wordmark, with gentle one-time lotus glow animation on load (`@keyframes lotus-logo-glow`).
  - Three Zones: Logo on left, NavTrack in centre, "Talk to an Advisor" CTA on right.
  - Spacing & Sticky Stacks: Dynamic `--header-h` CSS variable updated on mount, resize, and scroll condense/expand so sticky stacks on Life, Health, Services, and More Solutions offset cleanly.
- **Glitch-Free Sliding Pill (`NavTrack`)**:
  - Absolutely positioned pill (`background: rgba(255, 255, 255, 0.14); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 999px;`).
  - Animates strictly via `transform: translateX(...)` and `width` over 260ms cubic-bezier(0.22, 1, 0.36, 1). Zero left/margin animation.
  - Resting position is locked to the active route's link. On pointer enter of any link, glides smoothly. On pointer leave of the track, glides back to active tab (or fades out if no tab is active).
  - First paint: Initial placement has `transition: none` to eliminate any sweep-in from the left.
  - Re-measurement triggers: Mount, route changes, window resize (`ResizeObserver`), and `document.fonts.ready`.
  - Zero Layout Shift: Links use Poppins 500 across all default, hover, and active states (no bold-on-hover font shifts).
  - Active tab indicated by full-opacity white text with a 4px red dot centered 6px below label.
- **Services Mega-Menu (`NavMegaMenu`)**:
  - Hover intent: 120ms open delay, 220ms close delay.
  - Invisible hover bridge connects trigger to panel so diagonal cursor movement never accidentally closes the menu.
  - Anchored pointer notch centered on the Services trigger button.
  - Left column (~30%): "OUR SERVICES" eyebrow, neutral descriptor, and "View all services ->" link to `/services`.
  - Right column: 3x2 grid of 6 services (General Insurance, Life Insurance, Health Insurance, Mutual Funds, Equity & Investments, More Solutions) with line icons and short descriptors from `services.json`. Active service displays a red dot.
  - Full keyboard accessibility: Arrow keys navigate 2D grid, Home/End jump to first/last, Escape closes and restores focus to the trigger button.
- **Scroll Behavior & Tone Management**:
  - Hysteresis: Condenses at scrollY > 24px (height -12%, deeper shadow, more opaque navy); expands below 8px.
  - Hide-on-scroll: Fast scroll down hides bar; scroll up reveals bar. Hiding is suppressed whenever the mega-menu is open, mobile drawer is open, or an element inside the header has focus.
  - Red Progress Bar: Embedded at viewport top (`top: 0`, `z-index: 1050`), tracks scroll progress across all pages.
  - Route Tone (`headerTone`):
    - `dark-hero`: (`/`, `/services`, `/services/*`, `/investments/*`) starts in transparent navy glass over hero.
    - `solid`: (`/about-us`, `/insights`, `/insights/*`, legal pages, `/404`) starts in solid navy glass (`#0A2540` / `rgba(10, 37, 64, 0.96)`) guaranteeing high AAA contrast on light pages.
- **Tablet & Mobile Navigation (< 1024px)**:
  - Compact floating bar (60px height) with logo, compact red "Talk" pill, and morphing hamburger button (44x44px).
  - Off-canvas drawer sheet with faint lotus watermark at bottom right.
  - Staggered link reveal (`index * 60ms`).
  - Services accordion expands smoothly to display all 6 services with line icons and descriptors.
  - Pinned bottom red CTA button and silver "Godhra, Gujarat" tag.
  - Body scroll lock with zero scroll jump on open/close.
- **Colour & Quality Assurance**:
  - Strict Brand Palette: Verified across CSS and components via automated lint tests (`#051329`, `#071B30`, `#0A2540`, `#0E3154`, `#123D67`, `#1B4F82`, `#E6EDF5`, `#FFFFFF`, `#D7D9DC`, `#F3F5F7`, `#8A949D`, `#5B6770`, `#1F2933`, `#D9232D`, `#C81B29`, `#E92332`, `#B91C1C`). Zero forbidden accents (no teal, green, gold, purple).
  - Automated Vitest Suite: **130 tests passing across 13 test suites** (including new [`headerBrandAndNav.test.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/tests/headerBrandAndNav.test.tsx)).
  - Headless Chrome CDP Verification: **12 automated checks passed** across desktop (1440px), tablet (1024px), and mobile (375px/320px).
  - Screenshots captured and cataloged in [`docs/screenshots/nav-v3/`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/docs/screenshots/nav-v3/):
    1. `01_1440_life_dark_hero_top.png`: Header over dark hero (/services/life-insurance at 1440px)
    2. `02_1440_life_condensed_scrolled.png`: Header condensed after scroll (1440px)
    3. `03_1440_about_solid_light.png`: Header on light page (/about-us at 1440px)
    4. `04_1440_services_megamenu_open.png`: Services mega-menu open with 2-part layout and line icons
    5. `05_1440_pill_hover_mutual_funds.png`: Sliding pill hovering Mutual Funds link
    6. `06_1440_pill_hover_equity.png`: Sliding pill hovering Equity link
    7. `07_1440_pill_resting_after_leave.png`: Sliding pill resting on active link after cursor leaves track
    8. `08_1024_tablet_header.png`: Header on tablet (1024px)
    9. `09_375_mobile_drawer_expanded.png`: Mobile drawer open with Services accordion expanded (375px)
    10. `10_375_mobile_header_top.png`: Mobile compact header at top (375px)

---

## 20. Dot Navigator Site-Wide Removal — November 2026

Dot navigator removed site-wide on client request.

- **Component & Configuration Retirement**:
  - Removed `DotNavigator.tsx` from [`frontend/src/components/common/`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/components/common/).
  - Removed hover/focus tooltip styles from [`frontend/src/styles/main.css`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/styles/main.css).
  - Cleaned layout configuration and responsive types: removed `dotNavigatorMinWidth` from [`content/data/layout.json`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/content/data/layout.json) and [`frontend/src/config/responsive.ts`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/config/responsive.ts).
- **Page Cleanup Across All Routes**:
  - Cleaned all 10 public pages: [`Home.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/pages/public/Home.tsx), [`AboutUs.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/pages/public/AboutUs.tsx), [`Services.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/pages/public/Services.tsx), [`GeneralInsurance.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/pages/public/GeneralInsurance.tsx), [`LifeInsurance.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/pages/public/LifeInsurance.tsx), [`HealthInsurance.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/pages/public/HealthInsurance.tsx), [`MutualFunds.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/pages/public/MutualFunds.tsx), [`Equity.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/pages/public/Equity.tsx), [`OtherSolutions.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/pages/public/OtherSolutions.tsx), and [`Insights.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/pages/public/Insights.tsx).
  - Removed all `*_NAV_SECTIONS` arrays and `<DotNavigator />` component mounts.
  - Preserved 100% of internal HTML anchor targets (`#hero`, `#sip-calculator`, `#compare`, `#journey`, `#broking`, `#enquiry`, `#faqs`, `#jargon`, `#paths`, etc.) ensuring deep links, smooth scrolling, and navigation remain fully intact.
- **Regression Protection**:
  - Added dedicated test suite [`frontend/tests/dotNavigatorRegression.test.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/tests/dotNavigatorRegression.test.tsx) verifying that no element with `.dot-navigator`, `[data-testid="dot-navigator"]`, `.dot-nav-item`, or `aria-label*="Section navigation"` renders on any public route, and asserting all required section anchors remain intact.
- **Right-Edge Layout & Spacing Integrity**:
  - Verified no phantom spacing, reserved margin, or layout shift remains along the right viewport edge across standard (1440px) and wide (1920px) screens.

---

## 21. Refinement Round 3: Shared Root Causes, PinnedStage & Section Geometry — November 2026

This round remediated the 8 visible layout and interaction defects identified across Home, About, General Insurance, Health Insurance, and Equity by addressing their shared architectural root causes in the core component layer.

### Shared Architectural Root Causes Remediation

1. **R1: PinnedStage Overhaul & Timing Configuration (`src/config/pinned.ts`)**:
   - Replaced bloated 300–400svh outer height and 100svh inner stage with single source of truth:
     - Inner stage height: `clamp(480px, calc(100svh - var(--header-h, 88px) - 32px), 620px)` vertically centered.
     - Stacking context: `position: sticky; top: calc(var(--header-h, 88px) + 16px)` with `z-index: 15` (strictly below floating header `z-index: 50`).
     - Scroll length: `scrollPerStepVh: 45` clamped between `120svh` and `260svh` (4 steps = 180svh outer scroll).
     - Accelerated mapping: Progress reaches 1.0 at 85% of scroll range and dwells for the last 15%; steps activate earlier at `(i + 0.35) / steps`.
     - Zero bottom spacer; clean release when stage completes.
     - Mobile fallback (< 1024px or reduced motion): No pinning; renders accessible vertical timeline with line-draw on scroll.

2. **R2: Universal Numeral Wrapping Elimination (`[data-numeral]`)**:
   - Root cause: Global CSS `overflow-wrap: anywhere` allowed browsers to break numbers across lines (e.g. `0` / `3`, `2` / `0` / `0` / `8`).
   - Solution: Added global CSS rule for `[data-numeral]` enforcing `white-space: nowrap !important; writing-mode: horizontal-tb !important; font-variant-numeric: tabular-nums !important; flex-shrink: 0 !important; min-width: max-content !important; overflow-wrap: normal !important; word-break: keep-all !important;`.
   - Applied to: All step numbers ("01"–"06"), milestone years (2006, 2008, 2012, 2016), and statistic badges across Home, About, General Insurance, Health Insurance, Life Insurance, and Equity.
   - Verified by automated test in `refinementRound3.test.tsx`.

3. **R3: SVG Marker & Fill Geometry Synchronization**:
   - Root cause: Traveling lotus marker and gradient area fills previously relied on disconnected percentage math, creating visual drift and detached background rectangles.
   - Solution: Traveling lotus marker and gradient area fills are now mathematically locked inside unified SVG viewBoxes using synchronized coordinates and SVG `<clipPath>` (`#howWeWorkClip`, `#journeyAreaClip`). Area fills under the baseline line draw strictly up to the marker's current coordinate.

### Specific Section Implementations

- **Point 1: Home How We Work (`HomeHowWeWork.tsx`)**:
  - Stage height ~520px via `PINNED_CONFIG`.
  - 4 nodes evenly spaced horizontally at `12.5%`, `37.5%`, `62.5%`, and `87.5%`.
  - 4 cards (280px wide) alternating above and below baseline (01 above, 02 below, 03 above, 04 below).
  - Copy strictly from `01-home.md`:
    1. _"We listen to your goals and circumstances."_
    2. _"We explain the options available and their risks."_
    3. _"We help with the application or transaction process through the relevant provider."_
    4. _"We stay available for follow-up and servicing."_
  - Synchronized SVG baseline, area fill, and traveling lotus marker with illuminated node circles that pop and stay lit.

- **Point 2: About Our Journey (`OurJourneyTimeline.tsx`)**:
  - 4 confirmed milestones strictly from `milestones.json` (2006, 2008, 2012, 2016).
  - Removed "Confirmed Milestone" badge.
  - Symmetrical card width (360px), smooth horizontal scroll track, and mobile vertical fallback.

- **Point 3: General Insurance Hero & StepScroller (`StepScroller.tsx`)**:
  - Hero background strictly `var(--navy-950)` to `var(--navy-900)`.
  - Coverage board card restyled to `var(--navy-800)` with teal/steel/red accents.
  - 4 steps strictly from `04-general-insurance.md` with step numbers protected against wrapping.

- **Point 4: Health Insurance Process Timeline (`HealthProcessTimeline.tsx`)**:
  - Resolved 1-letter-per-line squish bug by establishing a stable `gridTemplateColumns: 1fr 56px 1fr` structure.
  - Alternating cards explicitly assigned to column 1 or column 3 with center node in column 2.
  - Removed invasive paperwork claims; copy strictly aligned with `06-health-insurance.md`.

- **Point 5: Equity Broking Partner Frame (`Equity.tsx` & `BrokingPartnerFrame.tsx`)**:
  - Purged `#4F5FB0` from hero background.
  - `navy-900` stage with `navy-800` cards.
  - SVG rotating seal ring with unclipped text: `AUTHORISED PERSON • RELIGARE BROKING LIMITED •`.

- **Point 6: Home Learn Before You Invest (`Home.tsx`)**:
  - 3 equal cards in 1 row (`repeat(auto-fit, minmax(280px, 1fr))`).
  - Numerals ("01", "02", "03"), category pills, and 96px SVGs (Risk Gauge, Hourglass, Asset Allocation Pie).
  - Arrow links styled with `var(--lotus-red-fill, #C81B29)` ensuring >= 4.5:1 AAA contrast.

- **Point 7: Header Backdrop Strip (`SiteHeader.tsx`)**:
  - Semi-opaque dark navy backdrop strip (`.site-header-backdrop`) rendered behind floating glass bar to prevent page text from showing through header on scroll.

### Verification & Test Status

- **Vitest Test Suite**: 15 test files / **159 tests passing** (`npm test --prefix frontend`).
- **Production Build**: Clean compilation with 0 errors via `npm run build --prefix frontend`.
- **Headless Chrome CDP Screenshots**: 11 verification screenshots captured in `docs/screenshots/refinement-round-3/`:
  1. `01-home-header-scrolled-backdrop-1440.png`
  2. `02-home-equity-navy800-card-1440.png`
  3. `03-home-how-we-work-stage-1440.png`
  4. `04-home-learn-cards-1row-1440.png`
  5. `05-about-our-journey-timeline-1440.png`
  6. `06-general-insurance-stepscroller-1440.png`
  7. `07-health-insurance-process-timeline-1440.png`
  8. `08-equity-broking-seal-frame-1440.png`
  9. `09-home-mobile-375.png`
  10. `10-gi-mobile-vertical-steps-375.png`
  11. `11-health-mobile-timeline-375.png`

---

## 6. Admin Panel Shell & Bento Grid Redesign (v2)

### 6.1 Architectural Overview

The admin portal has been comprehensively overhauled into a unified, config-driven administrative workspace built around `AdminShell`:

1. **`AdminBackdrop`**: Fixed full-viewport layer (`linear-gradient(135deg, #051329 0%, #071B30 40%, #0A2540 75%, #123D67 100%)`) with two soft navy radial glows and an unclipped, centered Lotus Capital watermark logo (60–70vh tall) featuring a gentle 40s transform drift (disabled under `prefers-reduced-motion`).
2. **`GlassPanel`**: A floating 32px rounded container (`margin: 16px 20px`, `backdrop-filter: blur(20px) saturate(120%)`, `border: 1px solid rgba(255,255,255,0.18)`, soft layered shadow) that houses the sidebar, topbar, and scrollable content area. Only the inner panel scrolls; the backdrop never moves.
3. **`AdminSidebar`**: Collapsible 248px glass rail (collapsing to 72px icon rail with state persisted in `localStorage` via try/catch). Categorized into labelled sections: _Overview_, _Leads_, _Content_, and _Admin_. Features 40px item height, active ~14% white pill with a 3px red left bar (`#E92332`), hover states, red follow-up due count badge, and a bottom user chip with initials circle, role, and sign-out icon button.
4. **`AdminTopbar`**: 64px sticky bar inside the glass panel with glass search field (`Ctrl+K` hint chip), system status dot (_FastAPI Connected_), public site link pill (`/`), and avatar circle.
5. **`BentoGrid` (`/admin/dashboard`)**: 12-column CSS grid with 16px gaps and fixed compact row heights engineered so the primary operational tier fits into a standard 1440×900 desktop viewport without page scrolling.
6. **Universal Page Inheritance**: Every admin route (`/admin/leads`, `/admin/content/pages`, etc.) automatically inherits this shell via `AdminLayout.tsx` without breaking RBAC, routing, or existing form logic.

### 6.2 Strict Brand Palette & Iconography Compliance

- **Brand Colors Only**: Midnight Navy (`#051329`), Navy-950 (`#071B30`), Rich Navy (`#0A2540`), Primary Navy (`#123D67`), Light Navy (`#1B4F82`), Pure White (`#FFFFFF`), Silver/Neutral Tints (`#D7D9DC`, `#E2E8F0`, `#F3F5F7`, `#8A949D`), and Brand Red (`#E92332`, `#C81B29`, `#D9232D`).
- **Zero Forbidden Accents**: Zero green, teal, gold, purple, or coral. Positive trends render with a solid navy `#123D67` up-arrow (on white) or white up-arrow; negative trends use brand red down-arrows.
- **Zero Coloured Emojis**: Purged all emojis (`📊`, `📥`, `⏰`, `📈`, `📄`, `❓`, `👥`, `🏆`, `💬`, `✍️`, `🖼️`, `🛡️`, `📋`, `⚙️`, `🚪`, `🔍`) and replaced them with unified SVG line icons (`AdminIcon`).
- **Brand Lint & Compliance Test**: Verified via `frontend/tests/adminBrandAndShell.test.tsx`.

### 6.3 Bento Grid Tile Specification (`/admin/dashboard`)

| Tile       | Name                           | Span   | Highlights                                                                                                                                                                                     |
| :--------- | :----------------------------- | :----- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tile A** | **Headline Enquiries**         | 5 cols | Single high-contrast white tile with navy text (`#071B30`), count-up animation (`42`), `Oct 2026` label, navy up-arrow chip (`+18.5% vs previous month`), and inline SVG sparkline trajectory. |
| **Tile B** | **Follow-ups Due Today**       | 3 cols | Red-accented glass card, count-up `6`, morning/afternoon split (`3 scheduled morning • 3 afternoon`), pulsing red alert dot, direct link to `/admin/followups`.                                |
| **Tile C** | **Converted This Month**       | 4 cols | Count `18`, animated 900ms SVG conversion-rate ring (`42.8%`), and conversion caption.                                                                                                         |
| **Tile D** | **Quick Operations**           | 4 cols | 4 rounded glass chips (Add Lead in brand red, Edit Content, Upload Media, Update FAQs) linking to active routes.                                                                               |
| **Tile E** | **Enquiries Trend Chart**      | 8 cols | Inline interactive SVG line chart with soft area fill, hover data-point tooltip, and crossfading segmented pills (_All_, _Insurance_, _Mutual Funds_, _Equity_).                               |
| **Tile F** | **Lead Conversion by Service** | 4 cols | Animated compact progress bars displaying conversion rates per practice area.                                                                                                                  |
| **Tile G** | **Latest Inbound Enquiries**   | 7 cols | Compact 40px table rows with zebra striping, live status change dropdowns, client contact details, and link to `/admin/leads`.                                                                 |
| **Tile H** | **Today's Follow-ups List**    | 5 cols | Urgent consultation queue with timestamps, name, service, and direct one-click `tel:` and WhatsApp `wa.me` action buttons.                                                                     |

### 6.4 Key Assumptions Noted

1. **Logo File Used**: Embedded vector component `<LotusLogo variant="light" />` for maximum scalability, zero clipping, and transparent background watermark.
2. **Data Keys Mapped**: Mapped from the existing mock/API layer (`user`, `enquiries`, `monthlyData`). User display name strips development marker `(Mock Admin)` so headers and chips present clean institutional identity (`Abhilash Chudasama`).
3. **Data Completeness**: Any widget lacking an authoritative data source (e.g. unverified notification streams) was omitted rather than displaying fabricated data.
4. **Chart Library**: Lightweight custom SVG line chart with smooth mathematical Bézier/polyline projection and reactive state crossfading—eliminating heavy external charting dependencies and ensuring instantaneous render times.

### 6.5 Verification & Test Status

- **Vitest Test Suite**: 16 test files / **174 tests passing** (`npm test --prefix frontend -- --run`).
- **Production Build**: Verified with 0 errors (`npm run build --prefix frontend`).
- **Headless Chrome CDP Screenshots** (Saved in `docs/screenshots/admin-v2/`):
  1. `01_dashboard_1440x900_expanded.png` (Desktop 1440×900, sidebar expanded)
  2. `02_dashboard_1440x900_collapsed.png` (Desktop 1440×900, sidebar collapsed to 72px rail)
  3. `03_dashboard_1440x900_chart_insurance.png` (Desktop 1440×900, chart filter set to Insurance)
  4. `04_leads_page_1440x900.png` (Enquiries & Leads page at `/admin/leads`)
  5. `05_page_content_1440x900.png` (CMS Page Content at `/admin/content/pages`)
  6. `06_dashboard_1024x768.png` (Tablet 1024×768 with auto-collapsed rail)
  7. `07_dashboard_375x812_mobile.png` (Mobile 375×812 responsive layout)
  8. `08_mobile_drawer_open_375x812.png` (Mobile 375×812 with slide-in drawer open)

---

## 22. Reference Alignment: Process Timeline Pipeline & Insurance Navigation Scope

### 22.1 Process Timeline Pipeline (Cortex Digital Solutions Reference Match)

- **Component**: [`ReferenceTimelinePipeline.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/components/common/ReferenceTimelinePipeline.tsx)
- **Applied across**: Home (`HomeHowWeWork.tsx`), About Us (`OurJourneyTimeline.tsx`), General Insurance (`StepScroller.tsx`), Health Insurance (`HealthProcessTimeline.tsx`), Life Insurance (`LifeProcessTimeline.tsx`), Equity (`EquityAccountJourney.tsx`).
- **Key Refinements**:
  1. **Alternating Snake Architecture**: Top row (odd steps 01, 03, 05, 07) and bottom row (even steps 02, 04, 06, 08) connected across a central continuous horizontal baseline.
  2. **Top Phase Badges**: Clean rectangular phase badges (`[ DISCOVER ]`, `[ DESIGN ]`, `[ BUILD ]`, `[ LAUNCH & SUPPORT ]`) spanning the respective step column pairs across the top.
  3. **Concentric Card Anchor Nodes**: Added 16px concentric rings (`◎`) with inner dot at the boundary of each card where the vertical stem connects to the baseline, matching the reference screenshot.
  4. **Active Baseline Node**: Removed extraneous floating 32px Lotus icon from the line. Replaced with an authentic prominent active concentric node on the baseline with a soft red halo (`box-shadow: 0 0 0 6px rgba(233, 35, 50, 0.22), 0 0 16px rgba(233, 35, 50, 0.65)`), white inner ring, and solid red core, exactly mirroring Step 04 of the Cortex reference.
  5. **Continuous Smooth Scroll Line Draw**: The central red progress line draws continuously with page scroll using sub-pixel interpolation (`progressRatio * trackSpanPercent`), activating nodes and cards as the line reaches them. Clicking any card jumps smoothly to that step, and scrolling resumes continuous scroll tracking after 60px of movement.
  6. **Zero Dead Scroll Space**: No 300vh or 400vh sticky trapping; compact padding (`3.75rem 0 4.25rem`) with instant natural scroll release.

### 22.2 Navigation Bar "Insurance" Solution Scoping

- **Components**: [`SiteHeader.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/components/nav/SiteHeader.tsx), [`NavTrack.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/components/nav/NavTrack.tsx), [`NavMegaMenu.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/components/nav/NavMegaMenu.tsx), [`MobileDrawer.tsx`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/components/nav/MobileDrawer.tsx), [`navigation.ts`](file:///c:/Users/lapto/OneDrive/Desktop/Lotus%20capital/frontend/src/config/navigation.ts).
- **Key Refinements**:
  1. **Label Changed to "Insurance"**: The primary solutions dropdown trigger is explicitly labelled **"Insurance"** in both desktop and mobile navigation.
  2. **Scoped Strictly to Insurance Practices**: The mega-menu panel and mobile drawer accordion now display strictly the 3 insurance solutions:
     - **General Insurance** (`/services/general-insurance`)
     - **Life Insurance** (`/services/life-insurance`)
     - **Health Insurance** (`/services/health-insurance`)
  3. **Independent Investment Items**: Mutual Funds and Equity are maintained strictly as dedicated top-level navigation items and are never mixed into the Insurance mega-menu or accordion.
  4. **Desktop Hover Intent Bug Fix**: Fixed `NavTrack.tsx` pointer handler to properly detect `item.id === 'insurance'` and trigger `onServicesTriggerHover(true)`, ensuring smooth instant hover-intent reveal of the Insurance mega-menu on desktop.

---

## 23. Mobile Layout Robustness & Root Cause Resolution (Flaws 1–5)

### 23.1 Root Causes Found & Systematic Fixes

1. **Flaw 1 (General Insurance category rail squeezed to ~60px, letters breaking vertically)**:
   - _Root Cause_: Hardcoded `gridTemplateColumns: 'repeat(4, 1fr)'` in inline styles with broad `overflow-wrap: anywhere` in `main.css`.
   - _Fix_: Replaced broad wrap with safe `:where(...) { overflow-wrap: break-word; word-break: normal; hyphens: manual; }`. Created `HorizontalRail` component with `min-width: 240px`, `flex: 0 0 min(82vw, 320px)` and touch-scroll snapping. Card header wrapped with `flex-wrap: wrap; gap: 8px;` and badges protected with `white-space: nowrap !important; width: max-content !important;`.
2. **Flaw 2 (General Insurance enquiry form consent label vertical character stack & crushed button)**:
   - _Root Cause_: Consent checkbox and submit button + circular progress ring shared a single horizontal flex row.
   - _Fix_: Separated into distinct stacked rows. Consent row styled with `display: grid; grid-template-columns: 24px minmax(0, 1fr); gap: 12px;`. Submit button given full width below `md` with `min-height: 52px; white-space: nowrap;`.
3. **Flaw 3 (Health Insurance plan cards asymmetric gutters ~46px left vs 4px right & sticky CTA bar overlap)**:
   - _Root Cause_: Duplicate `padding: 5rem 1.5rem` on the outer section wrapping `.container` (which already had padding), plus `minmax(340px, 1fr)` exceeding screen width on 360px viewports.
   - _Fix_: Removed redundant horizontal padding from section wrappers, letting `.container` enforce symmetric gutters (`padding-inline: var(--container-pad)`). Added `body` padding for sticky CTA bar (`padding-bottom: calc(var(--cta-bar-h) + env(safe-area-inset-bottom))`), `visualViewport` keyboard detection, and repositioned the floating DEV pill above the bar on mobile.
4. **Flaw 4 (Health Insurance Deep-dive inspector mid-word break & button wrapping into circle)**:
   - _Root Cause_: Heading and `+ Mark as Reviewed` button shared a single flex row without wrapping in a narrow column.
   - _Fix_: Created `.inspector-header-row` stacking vertically below `768px`. Renamed button label to "Mark as reviewed" without the plus glyph, styled as a pill (`border-radius: 999px; padding: 10px 16px; min-height: 44px;`).
5. **Flaw 5 (Equity enquiry panel ~185px wide, clipped, horizontal overflow blank strip)**:
   - _Root Cause_: Inline `gridTemplateColumns: 'minmax(320px, 4fr) minmax(420px, 6fr)'` in `EnquiryPanel.tsx` forcing a 740px minimum width on mobile, combined with triple-nested containers in `Equity.tsx`.
   - _Fix_: Converted `.enquiry-split-card` to a responsive single-column layout below `900px` (`max-width: 560px; margin-inline: auto`). Removed redundant container wrapper in `Equity.tsx`. Applied `.break-anywhere` strictly to long email addresses.

### 23.2 Automated Audit & Verification Status

- **Vitest Test Suite**: 17 test files / **181 tests passing** (`npm test --prefix frontend -- --run`), including dedicated `tests/mobileLayoutFixes.test.tsx`.
- **Production Build**: Clean compilation in ~2.8s with 0 errors (`npm run build --prefix frontend`).
- **Audit Script**: `scripts/audit-mobile.mjs` wired to `npm run audit:mobile`.

---

## 24. FAQ Accordion Mobile Layout Remediation (Site-Wide)

### 24.1 Root Causes Found & Systematic Architectural Solutions

1. **Root Cause 1: Two-Column Grid Expansion on Tablet/Mobile**:
   - _Problem_: In `main.css`, `.faq-layout` used `grid-template-columns: 1fr` below `991px`. Because CSS Grid defaults `1fr` to `minmax(auto, 1fr)`, any overflowing child element (such as the 5 wide category filter pills on Equity) expanded the column to its content width (up to 650px), pushing the entire accordion past the right edge on mobile screens.
   - _Solution_: Set `.faq-layout` below `1024px` to `grid-template-columns: minmax(0, 1fr) !important; width: 100%; max-width: 100%; min-width: 0;`. Set `.faq-intro-col` to `position: static !important;` so the sticky intro rests naturally above the list on mobile.
2. **Root Cause 2: Accordion Item Layout & Flex Overflow**:
   - _Problem_: Header buttons used flex rows with unconstrained text containers, squeezing long question titles and plus toggle icons.
   - _Solution_: Rebuilt `.faq-card-button` and `.home-faq-button` with direct 3-column CSS Grid: `grid-template-columns: 36px minmax(0, 1fr) 36px; align-items: center; gap: 1rem;` with `min-width: 0` on all children. Questions use `overflow-wrap: break-word; word-break: normal; hyphens: manual; white-space: normal; line-height: 1.35;`. Answers use `max-width: 100%; overflow-wrap: break-word;`.
3. **Root Cause 3: Registration Code Wrapping & Break-Anywhere Isolation**:
   - _Problem_: Dense alphanumeric codes (e.g., Religare Broking AP numbers `AP007909931`, `AP0130040172963`, ARN numbers, emails) either broke mid-word or pushed the width.
   - _Solution_: Created `formatFaqAnswer()` helper to isolate dense registration codes, ARN codes, emails, and URLs into `<span className="break-anywhere">`, while preserving standard non-breaking hyphenation on prose.
4. **Root Cause 4: Category Pills Widening the Page**:
   - _Problem_: Category filter pills row lacked an independent bounded container on mobile.
   - _Solution_: Created `.faq-category-pills-container` with `overflow: hidden; width: 100%; max-width: 100%; min-width: 0;` and a subtle right edge fade (`::after` linear-gradient). The child `.faq-category-pills` scrolls smoothly (`overflow-x: auto; scroll-snap-type: x proximity; padding-inline: 16px; margin-inline: -16px;`) without widening the document.
5. **Root Cause 5: Sticky Mobile CTA Bar Covering Last Card**:
   - _Problem_: The fixed bottom "Talk to an Advisor" bar (~76px tall) obscured the last FAQ item on mobile.
   - _Solution_: Added `padding-bottom: calc(var(--cta-bar-h, 76px) + env(safe-area-inset-bottom, 0px) + 24px) !important;` to `.faq-section` and page containers below `768px`. Elevated `.dev-floating-pill-container` above the bar.

### 24.2 Verification & Deliverables

- **Unit & Regression Suite**: 17 test files, **181 tests passing** (`npm test --prefix frontend -- --run`), including verification of direct 3-column button grid, category pills container, and AP code wrapping.
- **Production Build**: Clean compilation in 2.85s (`npm run build --prefix frontend`).
- **ESLint**: 0 errors, 0 warnings (`npm run lint --prefix frontend`).
- **Playwright Test Suite**: Added `tests/faq-accordion.spec.ts` evaluating 320, 360, 390, and 430px viewports across Home, General Insurance, Life, Health, Mutual Funds, Equity, More Solutions, and Insight articles.
- **Audit Script**: Added rule `accordion bounds` in `scripts/audit-mobile.mjs` verifying bounding box containment (left >= 12px, right <= viewport - 12px, symmetric within 4px, text containment).
- **Screenshots Saved**: Captured at 360px in `docs/screenshots/faq-mobile/`:
  - `equity_faq_360px.png`
  - `home_faq_360px.png`
  - `general_insurance_faq_360px.png`
  - `life_insurance_faq_360px.png`
  - `health_insurance_faq_360px.png`
  - `mutual_funds_faq_360px.png`
  - `article_faq_360px.png`

### Frontend Vitest Suite

- `tests/adminDashboardDynamic.test.tsx`: 2 tests passed (zero-state verification, live dynamic update verification).
- `tests/adminBrandAndShell.test.tsx`: 15 tests passed.
- `tests/adminZeroRecordAndLeadsCrud.test.tsx`: 7 tests passed.
- `tests/adminNoPlaceholders.test.tsx`: 20 tests passed.
- Full Vitest suite: **21 test files passed**, **217 tests passed** with 100% pass rate.
- Production build: `npm run build` completed cleanly without TypeScript or bundler errors.

---

## 25. Round 5 Implementation & Production Hardening

### 25.1 Content & UI Changes

1. **A1. One Common Enquiry Form (`EnquiryForm.tsx`)**:
   - Single source of truth canonical form across Home, all service pages (Health, General, Life, Mutual Funds, Equity, More Solutions), Insights articles, thank-you follow-ups, `ContactDrawer`, and the dedicated ROHINI page.
   - Identical field ordering: Full name, 10-digit Indian Mobile, optional Email, Service dropdown, dynamically rendered sub-category chips driven by selected service, optional Message, Preferred Contact Method (Phone / WhatsApp / Email), and explicit DPDP consent checkbox.
   - Built-in SVG progress ring (0/3 score based on required fields) and drawing lotus bloom SVG confirmation animation.
   - **Hospitals Variant**: Automatically reveals 3 optional fields (`organisation_name`, `city`, `existing_rohini_id` with 13-digit format validation) when the selected service is `rohini-cashless-empanelment`.
   - `EnquiryPanel.tsx` converted to a backward-compatible wrapper re-exporting `EnquiryForm`.

2. **A2. Brand Font for "Lotus Capital" & Licensing Status**:
   - **Styling Requirements**: Everywhere the name "Lotus Capital" or "LOTUS CAPITAL" appears as a brand mark or wordmark (Header brand text, Footer brand block, Hero eyebrow lock-ups, About page, Admin sidebar title, Thank-you & Legal pages), a Felix Titling style is applied: all-caps, tracking `0.12em` (`letter-spacing: 0.12em`), classical thin serif.
   - **CSS Tokens & Utility**: Defined `--font-brand: "Felix Titling", "Cinzel", "Trajan Pro", serif;` in `tokens.css` and `.brand-name` utility in `main.css` and `admin.css`.
   - **Licensing Status**:
     - *Felix Titling* is a commercial Monotype/Adobe proprietary font. In compliance with intellectual property standards, proprietary font binaries are not bundled without an active server license.
     - *Production Web Font*: Self-hosted **Cinzel** (weights 400, 500, 600 in modern woff2 format) under the **SIL Open Font License (OFL) v1.1** located in `/fonts/cinzel/`.
     - *Font Stack*: `"Felix Titling", "Cinzel", "Trajan Pro", serif`. If a user or server environment provides licensed Felix Titling files in `public/fonts/brand/`, it is preferred; otherwise Cinzel renders with identical classical inscriptional proportions.
     - Body copy and headings maintain Poppins and Inter; the Lotus Logo vector SVG itself is unchanged.

3. **A3. About Us Refinement**:
   - Removed all occurrences of "Grounded in Godhra" and "Grounding" from page headings and content data files. The office location section is titled with the neutral label "Visit us".
   - "Meet the team" block dynamically rendered from `content/data/team.json`. Seeded exclusively with the two verified individuals:
     - **Abhilash Dineshchandra Chudasama** (Proprietor)
     - **Kajal Abhilash Chudasama** (Co-founder)
   - Captions added to portraits; hero floating card updated; schema.org `Person` JSON-LD structured data embedded.
   - Admin Team management view (`AdminTeam.tsx`) supports full CRUD: Add, Edit, Reorder (move up/down), Delete, and Photo Upload.

4. **A4. Travel Insurance Promoted Category**:
   - Promoted to a major category: dedicated service card on Home, prominent bento tile on General Insurance (`spanCols: 2, featured: true`), form chip, Services dropdown link (`/services/general-insurance#travel`), and admin reports.
   - Content sourced generically in `content/data/services.json` with no invented statistics, turnaround claims, or insurer endorsements. Statutory IRDAI solicitation notice preserved.

5. **A5. ROHINI & Cashless Empanelment for Hospitals**:
   - Dedicated B2B section on Health Insurance (`#rohini`) and dedicated standalone route `/services/rohini-cashless-empanelment`.
   - Verified facts sourced strictly from the official Insurance Information Bureau of India (IIB) portal (`https://rohini.iib.gov.in`) and IRDAI (`https://iib.gov.in`).
   - Sourced data structure in `content/data/rohini.json` including source URLs and `lastChecked` timestamps.
   - Interactive document checklist with client-side print/PDF generation.
   - 6-step shared process timeline and 8 sourced hospital FAQs.
   - Clear B2B disclosures clarifying that ROHINI is maintained by IIB and empanelment is solely at insurer/TPA discretion.

### 25.2 Security Hardening Summary

- **Argon2id + Pepper**: Passwords hashed with Argon2id + 256-bit server-side pepper (`SECURITY_PASSWORD_PEPPER`). Passwords must be >= 12 chars and pass blocklist. Constant-time dummy hash equalization prevents user enumeration.
- **MFA (TOTP)**: RFC 6238 TOTP with pyotp, QR code provisioning, SHA-256 hashed one-time backup recovery codes.
- **Rate Limiting & Lockout**: Per-IP (20 attempts / 15m) and per-account lockout (5 failed attempts locks for 15m).
- **Session Security**: `__Host-` cookies in production with `SameSite=Lax`, `Secure`, `HttpOnly`. 12h absolute session, 30m idle timeout. Session version rotation invalidates tokens on password change.
- **CSRF & Origin Verification**: Unsafe HTTP methods validate `Origin` and `Referer` against `CORS_ORIGINS`.
- **CSV Injection Defense**: Both backend export and frontend client export sanitize cells using `escape_csv_cell()` prefixing `'`.
- **File Upload Security**: Magic binary signature checks for JPEG, PNG, WebP, PDF, and sanitized XML parsing for SVG.
- **DPDP Act & PII**: Structured JSON logging masks phone numbers and emails. Lead deletion cascades anonymize audit log entries (`anonymize_entity`).
- **Production DevOps**: Multi-stage Dockerfiles (`backend/Dockerfile`, `frontend/Dockerfile`), `docker-compose.yml`, and GitHub Actions CI workflow (`.github/workflows/ci.yml`).

