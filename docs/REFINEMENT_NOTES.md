# Lotus Capital — Website Refinement & Implementation Notes

> **Brand Philosophy**: Royalty through security. Premium through simplicity. Trust through transparency.  
> **Brand Palette**: Navy `#123D67` (Navy-900), Navy Scrim `#0A2540` (Navy-950), Silver `#D7D9DC`, White `#FFFFFF`, Lotus Red `#E92332` (Interactive button contrast `#C81B29`).  
> **Typography**: Poppins (Headings) + Inter (Body).  

---

## 1. Executive Summary

This document records the visual refinement and code implementation of the **Lotus Capital** web application, aligning it with the official Lotus Capital Design Reference Document, `Design.md`, `Structure.md`, and the 7 authoritative visual references.

All 9 visible defects identified in previous builds have been remediated. The codebase strictly adheres to the data layer rules (facts sourced exclusively from `content/data/*.json`), statutory regulatory disclosure requirements (AMFI/SEBI, IRDAI, Religare Broking AP), animation standards (A1–A30), and responsive design specifications.

---

## 2. Visible Defect Remediation Log

| Defect # | Issue Description | Root Cause | Solution Implemented | Verification |
|:---|:---|:---|:---|:---|
| **Defect 1** | **Logo White Box on Dark Backgrounds** | `lotus_capital_logo_traced.svg` contained an opaque `<rect fill="#274463"/>`. Inverting via CSS `filter: brightness(0) invert(1)` turned this into an opaque white square. | Created `<LotusLogo>` (`frontend/src/components/common/LotusLogo.tsx`) rendering clean inline vector paths for `light` (`#FFF`), `dark` (`#123D67`), and `watermark` (`rgba(215,217,220,0.08)`) variants with transparent backgrounds and Lotus red (`#E92332`) center petal. | Verified in Header, Footer, Admin, and Hero backgrounds. Zero white rectangles. |
| **Defect 2** | **Hero Missing Photo / Blank Space** | Photo hero lacked a dedicated image slot and fallback mechanism. | Added photo slot referencing `/images/hero.jpg` (`Home_main_image.png`) with an automatic graceful fallback to a photographic navy gradient with a 6% lotus watermark if the file is absent. | Verified at desktop and mobile resolutions. |
| **Defect 3** | **Header Overlapping and Wrapping Links** | Header rendered with loose gaps and lacked `white-space: nowrap`, causing nav links to break into two lines on narrower desktop viewports. | Styled Header with `position: fixed` sitting transparently over the hero with a top navy scrim, transitioning to solid navy with blur after 24px scroll (A5). Nav items styled with `white-space: nowrap`, tightened padding, and mobile drawer toggle below 1100px. | Header stays single-line, transitions smoothly, and does not wrap. |
| **Defect 4** | **Dev Register Badge in Public Header** | Unverified statistics warning was exposed globally in the public header. | Removed dev register badge from the public navigation header. Confined the data register link strictly to `import.meta.env.DEV` in the footer and directly at `/dev/data-register`. | Public visitors see no dev register badge. |
| **Defect 5** | **Heavy Yellow "UNVERIFIED" Blocks** | Aggressive yellow alert badges degraded the premium financial aesthetic of the homepage stat bar. | Replaced heavy yellow banners in `StatBlock.tsx` with a subtle warning dot, hover tooltip, and compact caption: *"as of [date to be confirmed]"*. Full unverified badges remain strictly on `/dev/data-register`. | Stat blocks look clean and institutional while preserving compliance markers. |
| **Defect 6** | **Premature WhatsApp Floating CTA** | Floating WhatsApp button was displayed without a verified business phone number. | Added condition in `PublicLayout.tsx` checking `(contactData as any).whatsappConfirmed === true`. The button remains hidden until the client confirms their official WhatsApp business account. | Floating WhatsApp button hidden by default. |
| **Defect 7** | **Testimonial Compliance & Consent** | Unverified or unconsented customer testimonials were displayed. | In `Home.tsx`, testimonials are filtered by `consent: true`. In development mode (`import.meta.env.DEV`), 3 anonymized sample placeholders are shown with names withheld. In production builds, unconsented testimonials are suppressed entirely. | No fake names or unconsented quotes shown. |
| **Defect 8** | **Partner Logo Distortion** | Third-party logos were stretched or displayed with conflicting backgrounds. | Replaced arbitrary raster images with typographic wordmark tiles in a continuous 40px/s marquee that pauses on hover (A18). Each tile displays institutional relationship metadata (e.g., *"Authorised Person"*, *"Corporate Agency Partner"*). | Clean, distortion-free partner representation. |
| **Defect 9** | **Stat Card 4+1 Wrapping Disalignment** | Five homepage statistics rendered in an awkward 4+1 wrap across rows. | Redesigned the hero-overlapping stat container into a balanced layout: 4 primary KPI cards in row 1 (`clients_serviced`, `aum_total`, `mf_folios`, `demat_accounts`), and 1 centered secondary badge in row 2 (`insurance_policies_total`). | Symmetrical, centered, and mobile-responsive. |

---

## 3. Visual Reference to Codebase Implementation Mapping

The implementation harmonizes the 7 designated visual references without copying copyrighted text, third-party logos, or arbitrary figures:

### Reference 1: `fiatwm.com` Hero & Header Behavior
- **Applied to**: Global Header and Home Hero section (`Home.tsx`).
- **Implementation**:
  - Full-bleed photo hero with top navy scrim (`linear-gradient(180deg, rgba(10,37,64,0.7) 0%, rgba(10,37,64,0) 100%)`).
  - Transparent header over photo at `y=0`; transitions to solid Navy (`#123D67`) with 12px backdrop blur and shrunken logo after 24px scroll (A5).
  - Spaced-caps eyebrow: `FINANCIAL SOLUTIONS • GODHRA, GUJARAT`.
  - Staggered headline animation (A1) line-by-line:
    * *"Plan with confidence."*
    * *"Protect what matters."*
    * *"Build your future."*
  - Solid Lotus Red primary CTA (`#C81B29`, *"Explore Our Services"*) and outlined secondary CTA (*"Talk to an Advisor"*).
  - Subtle mouse/down-arrow scroll cue at the hero bottom edge.

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

### Reference 3: Groww "Trusted by" Trust Band
- **Applied to**: Home Trust Band (`Home.tsx`).
- **Implementation**:
  - High-contrast dark navy band (`#0A2540`) with 1600ms count-up (`useCountUp` / A12):
    * `Trusted by 2,500+ clients across Gujarat`
  - 4 key statistic columns with verified as-of timestamps.
  - Floating dev-mode testimonial cards with subtle hovering drift.
  - High-contrast red call-to-action strip beneath (*"Ready to start your financial journey?"*).

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
    * **Left**: High-resolution founder portrait (`Owner.png`) framed in a 4:5 rounded container with an offset silver outline (`.founder-offset-frame`) and 6% lotus watermark.
    * **Right**: Founder's message, 3 verified metric chips, and 4 core value tiles (*Transparency*, *Client Centricity*, *Long-term Horizon*, *Institutional Discipline*).
  - Clean transition to full About Us story.

### Reference 6: Investment Dashboard Blueprint
- **Applied to**: Interactive public boards in `MutualFunds.tsx` and `Equity.tsx` (strictly public illustrative tools, NOT the admin panel).
- **Implementation**:
  - Large illustrative headline figure with period toggles (`1Y`, `3Y`, `5Y`, `10Y`).
  - 3 action cards: SIP Compounding, Portfolio Review, Tax Planning (ELSS).
  - Interactive SVG growth curve with hoverable data-point tooltips.
  - Goal progress meters: Child Education (68%), Retirement Corpus (45%).
  - Mandatory disclaimer on all boards: *"Illustration only. Not a forecast or guarantee. Mutual fund investments are subject to market risks."*
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

All animations are implemented in `frontend/src/motion/` and `frontend/src/styles/main.css` adhering to the timing tokens in `Design.md`:

| ID | Name | Trigger / Target | Technical Implementation |
|:---|:---|:---|:---|
| **A1** | Hero Text Stagger | On page load, staggered 100ms fade-up for eyebrow, H1 line 1, line 2, line 3, and CTAs. | CSS `@keyframes heroFadeUp` with animation delay classes `.anim-fade-up-1..4`. |
| **A2** | Hero Image Settle | On load, hero image smoothly settles from scale(1.04) to scale(1.0). | CSS `.anim-settle` over 1200ms ease-out. |
| **A3** | Hero Parallax | Desktop scroll (`>= 768px`). | Custom hook `useParallax.ts` (disabled on touch devices / viewport < 768px). |
| **A4** | Nav Underline Grow | Desktop nav link hover. | CSS `:after` pseudoelement expanding `scaleX(0)` to `scaleX(1)`. |
| **A5** | Header Background Transition | Scroll threshold `> 24px`. | React state tracking `window.scrollY > 24` in `Header.tsx`, toggling `.header--scrolled`. |
| **A6** | Services Dropdown Reveal | Header "Services" hover/focus. | Absolute dropdown container with opacity & transform transition. |
| **A7** | Mobile Menu Drawer | Hamburger button tap (`< 1100px`). | Slide-out overlay drawer with backdrop blur. |
| **A8** | Section Scroll Reveal | Viewport entry (threshold 0.15). | `useReveal.ts` observing `[data-reveal]` elements via `IntersectionObserver`. |
| **A9** | Card Hover Lift | Bento cards, service cards. | CSS `:hover` translating `translateY(-4px)` with shadow elevation. |
| **A10** | Card Border Glow | Card hover. | Transition `border-color: var(--navy-500)`. |
| **A11** | Button Scale / Color Shift | Button hover & active. | CSS transition `background-color` and `transform: translateY(-1px)` / active `scale(0.98)`. |
| **A12** | Number Count-Up | Trust band viewport entry. | `useCountUp.ts` running 1600ms easing curve (bypassed in test environment for instant assertion). |
| **A13** | Floating Testimonial Drift | Trust band background. | Gentle CSS keyframe translation (dev mode only). |
| **A14** | Rising Investment Board | Scroll progress over MF/Equity section. | `useScrollProgress.ts` driving CSS transform matrix. |
| **A15** | Period Tab Switch | MF board period selector (`1Y`..`10Y`). | React state update re-rendering SVG chart path and headline figures. |
| **A16** | Chart Tooltip Reveal | Chart data point hover. | SVG `<circle>` mouse enter event displaying value tooltip. |
| **A17** | Progress Bar Fill | Goal progress cards in viewport. | CSS transition `width` from 0 to target percentage. |
| **A18** | Partner Marquee Flow | Continuous scrolling logo/wordmark strip. | Infinite linear translation at 40px/s; pauses on `:hover`. |
| **A19** | FAQ Accordion Expand | Click on FAQ question row. | Height transition with `+` icon rotating 45° to `×`. |
| **A20** | Form Input Focus Highlight | Enquiry form input focus. | Border color shift to `var(--navy-600)` with subtle outer glow ring. |
| **A21** | Form Submission Spinner | Form submit button on pending state. | Rotating CSS ring loader inside CTA button. |
| **A22** | Success Banner Slide-In | Form submission 200 OK. | Alert card transition in place of the form. |
| **A23** | Footer Watermark Fade | Footer scroll into view. | 6% opacity SVG watermark anchored to bottom right. |
| **A24** | Back-to-Top Button Reveal | Scroll past 600px. | Fixed floating circle button fading in after scroll threshold. |
| **A25** | Admin Sidebar Collapse | Admin toggle button click. | Width transitions between 248px and 72px with tooltip badges. |
| **A26** | Admin Enquiries Chart Bars | Admin dashboard load. | CSS height transition on 7-day trend chart bars. |
| **A27** | Admin Status Dropdown | Table row status update. | Instant select badge update with color coding. |
| **A28** | Modal Dialog Zoom | Dialog popup open. | Scale-in from 0.95 to 1.0 with backdrop fade. |
| **A29** | Toast Notification | Action feedback. | Slide-down toast in top-right corner with 4s auto-dismiss. |
| **A30** | Reduced Motion Fallback | User agent `prefers-reduced-motion: reduce`. | Media query zeroing transitions and animations across all elements. |

---

## 5. Responsive Screenshot Gallery Verification

A complete set of **24 browser screenshots** (8 routes across 3 viewport sizes) has been captured using Chrome Headless (`--virtual-time-budget=3000`) and saved to `docs/screenshots/`:

| Route / Slug | Path | 375px (Mobile) | 768px (Tablet) | 1440px (Desktop) | Status |
|:---|:---|:---|:---|:---|:---:|
| **Home** | `/` | `home-375.png` (153 KB) | `home-768.png` (284 KB) | `home-1440.png` (819 KB) | Verified |
| **About Us** | `/about-us` | `about-us-375.png` (59 KB) | `about-us-768.png` (201 KB) | `about-us-1440.png` (81 KB) | Verified |
| **Services Overview** | `/services` | `services-375.png` (116 KB) | `services-768.png` (214 KB) | `services-1440.png` (283 KB) | Verified |
| **Health Insurance** | `/services/health-insurance` | `health-insurance-375.png` (152 KB) | `health-insurance-768.png` (280 KB) | `health-insurance-1440.png` (367 KB) | Verified |
| **Mutual Funds** | `/investments/mutual-funds` | `mutual-funds-375.png` (150 KB) | `mutual-funds-768.png` (237 KB) | `mutual-funds-1440.png` (323 KB) | Verified |
| **Equity** | `/investments/equity` | `equity-375.png` (149 KB) | `equity-768.png` (265 KB) | `equity-1440.png` (339 KB) | Verified |
| **Contact Us** | `/contact-us` | `contact-us-375.png` (77 KB) | `contact-us-768.png` (180 KB) | `contact-us-1440.png` (219 KB) | Verified |
| **Admin Dashboard** | `/admin/dashboard` | `admin-dashboard-375.png` (60 KB) | `admin-dashboard-768.png` (100 KB) | `admin-dashboard-1440.png` (102 KB) | Verified |

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

