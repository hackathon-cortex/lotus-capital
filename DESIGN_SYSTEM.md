# Lotus Capital — Design System & UI Specification

**Version:** 2.0 (Refined Blueprint & Tailwind Integration)  
**Brand Identity:** *Royalty through security. Premium through simplicity. Trust through transparency.*  
**Primary Colors:** Navy Blue (`#123D67`), White (`#FFFFFF`), Silver (`#D7D9DC`), Red Accent (`#E92332`)  
**Companion Documents:** `Design.md`, `REFERENCE_ANALYSIS.md`, `Structure.md`

---

## 1. Core Design Philosophy

Lotus Capital represents stability, multigenerational protection, and disciplined wealth creation. The design avoids the visual tropes of speculative retail trading (no flashing greens/reds, no aggressive return tickers, no gamified interfaces) and avoids false royal decadence (no gold leaf, ornate filigrees, or heavy drop shadows). 

### Four Visual Pillars:
1. **Architectural Navy Canvas:** Dark navy anchors critical trust zones (hero scrims, trust bands, navigation bars, and footers), creating visual depth and authority.
2. **Clinical White & Silver Breathing Room:** Content zones use ample white space and soft silver borders to convey precision, calm, and institutional clarity.
3. **Surgical Red Accents:** Lotus Red is reserved strictly for primary calls-to-action (maximum once per viewport) and subtle focal points (active navigation underline, required form asterisks, key alert badges).
4. **Transparent Data Presentation:** Every financial metric is accompanied by its verified as-of date, clear regulatory context, and standard disclaimer note.

---

## 2. Color System & Design Tokens

### 2.1 Master Palette & Semantic Tokens

```css
:root {
  /* Brand Primitives */
  --color-brand-navy: #123D67;
  --color-brand-silver: #D7D9DC;
  --color-brand-white: #FFFFFF;
  --color-brand-red: #E92332;

  /* Extended Navy Scale (Surfaces, Overlays, Deep Typography) */
  --navy-950: #071B30;  /* Deepest footer base, modal backdrop */
  --navy-900: #0A2540;  /* Dark band sections, hero scrims, scrolled navbar */
  --navy-800: #0E3154;  /* Dark card backgrounds, elevated dark panels */
  --navy-700: #123D67;  /* Primary Brand Navy: headings, hero titles */
  --navy-600: #1B4F82;  /* Interactive hover states on navy, active focus rings */
  --navy-100: #E6EDF5;  /* Subtle tinted surface, selected table rows */
  --navy-50:  #F4F7FA;  /* Ultra-light background tint */

  /* Extended Silver Scale (Borders, Dividers, Neutral Canvases) */
  --silver-500: #8A949D; /* Form field borders, secondary icons (WCAG 3.09:1 on white) */
  --silver-300: #D7D9DC; /* Master Brand Silver: structural card borders, dividers */
  --silver-200: #E5E8EB; /* Subtle inner dividers */
  --silver-100: #F3F5F7; /* Secondary section background, alternate card canvas */
  --silver-50:  #FAFBFC; /* Clean off-white surface */

  /* Extended Red Scale (Calls to Action & Urgency) */
  --red-700: #A91621;  /* Primary button pressed & active state */
  --red-600: #C81B29;  /* Accessible primary button background (White text 5.76:1) */
  --red-500: #E92332;  /* Brand Red: icon accents, active indicators, asterisks */
  --red-300: #FF6B76;  /* High-contrast red for dark navy surfaces (5.64:1 on navy-900) */
  --red-100: #FDE8EA;  /* Light red badge background for urgent alerts / new leads */

  /* Neutral Typography & Functional States */
  --ink:     #1F2933;  /* High-contrast body text (14.76:1 on white) */
  --muted:   #5B6770;  /* Secondary supporting copy, captions (5.8:1 on white) */
  --success: #1E7F4F;  /* Form validation success, published state badges */
  --warning: #9A6700;  /* In-progress lead badges, cautious notes */
  --danger:  #B42318;  /* Form validation errors, critical alerts */

  /* Elevation Shadows (Restrained) */
  --shadow-none: none;
  --shadow-sm:   0 2px 8px rgba(10, 37, 64, 0.05);
  --shadow-md:   0 6px 20px rgba(10, 37, 64, 0.08);  /* Card hover, dropdown menus */
  --shadow-lg:   0 16px 40px rgba(10, 37, 64, 0.14); /* Floating hero cards, modals */

  /* Border Radii */
  --radius-xs: 4px;
  --radius-sm: 8px;   /* Filter chips, small buttons, tags */
  --radius-md: 12px;  /* Standard cards, input fields, interactive buttons */
  --radius-lg: 20px;  /* Hero stat blocks, major panel containers */
  --radius-pill: 999px; /* Status badges, pill tags */
}
```

### 2.2 Tailwind CSS Theme Mapping
```javascript
// tailwind.config.js snippet
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#123D67',
          silver: '#D7D9DC',
          white: '#FFFFFF',
          red: '#E92332',
        },
        navy: {
          50: '#F4F7FA',
          100: '#E6EDF5',
          600: '#1B4F82',
          700: '#123D67',
          800: '#0E3154',
          900: '#0A2540',
          950: '#071B30',
        },
        silver: {
          50: '#FAFBFC',
          100: '#F3F5F7',
          200: '#E5E8EB',
          300: '#D7D9DC',
          500: '#8A949D',
        },
        redAccent: {
          100: '#FDE8EA',
          300: '#FF6B76',
          500: '#E92332',
          600: '#C81B29',
          700: '#A91621',
        },
        ink: '#1F2933',
        mutedText: '#5B6770',
      },
      borderRadius: {
        'card': '12px',
        'panel': '20px',
      }
    }
  }
}
```

### 2.3 Accessibility & Contrast Matrix (WCAG 2.1 Compliance)
- **White on `#123D67` (Navy):** 11.12:1 (Exceeds WCAG AAA requirement)
- **White on `#0A2540` (Navy-900):** 15.54:1 (Exceeds WCAG AAA requirement)
- **`#D7D9DC` (Silver) on `#0A2540`:** 10.99:1 (Exceeds WCAG AAA requirement)
- **`#1F2933` (Ink) on `#FFFFFF`:** 14.76:1 (Exceeds WCAG AAA requirement)
- **`#5B6770` (Muted) on `#FFFFFF`:** 5.80:1 (Meets WCAG AA requirement)
- **White on `#C81B29` (Primary Button Fill):** 5.76:1 (Meets WCAG AA for body and interactive buttons)
- *Critical Rule:* Pure Brand Red `#E92332` on white achieves 4.42:1 (slightly below AA for small text). Therefore, interactive buttons use `--red-600` (`#C81B29`) to guarantee 100% WCAG AA compliance.

---

## 3. Typography Architecture

### 3.1 Font Families
- **Display, Headings & Numerical Highlights:** **Poppins** (Weights: 600 SemiBold, 700 Bold)
  - Geometric, authoritative, crisp structure aligned with international financial institutions.
- **Body Text, Form Controls & Data Tables:** **Inter** (Weights: 400 Regular, 500 Medium, 600 SemiBold)
  - Exceptional micro-legibility at small sizes; tabular numerical support via `font-variant-numeric: tabular-nums`.
- **Regional Gujarati Fallback:** **Noto Sans Gujarati** (Weights: 400, 600, 700).

### 3.2 Fluid Type Scale

| Role | Desktop | Mobile | Weight | Line Height | Letter Spacing | CSS Rule / Utility |
|---|---|---|---|---|---|---|
| **Display / Hero H1** | `clamp(40px, 5.2vw, 72px)` | 40px | 700 | 1.05 | -0.02em | `font-display tracking-tight` |
| **Page Title H1** | `clamp(34px, 4vw, 52px)` | 34px | 700 | 1.10 | -0.015em | `font-heading tracking-tight` |
| **Section Title H2** | `clamp(28px, 3vw, 40px)` | 28px | 600 | 1.15 | -0.01em | `font-heading font-semibold` |
| **Card / Subtitle H3** | 24px | 22px | 600 | 1.25 | 0 | `text-2xl font-semibold` |
| **Feature Title H4** | 20px | 18px | 600 | 1.30 | 0 | `text-xl font-semibold` |
| **Eyebrow Headline** | 13px | 12px | 600 | 1.20 | 0.18em | `uppercase tracking-widest` |
| **Lead Paragraph** | 20px | 18px | 400 | 1.55 | 0 | `text-lg text-muted` |
| **Body Paragraph** | 17px | 16px | 400 | 1.65 | 0 | `text-base text-ink` |
| **Caption / Notes** | 14px | 14px | 400 | 1.50 | 0 | `text-sm text-muted` |
| **Stat Big Number** | `clamp(36px, 4vw, 56px)` | 36px | 700 | 1.00 | -0.01em | `font-mono tabular-nums font-bold` |
| **Legal / Disclaimer** | 13px | 13px | 400 | 1.55 | 0 | `text-xs text-muted leading-relaxed` |

---

## 4. Layout, Spacing & Container Rules

### 4.1 Spacing Rhythm (8px Foundation)
- Base Grid: `4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px`.
- Section Vertical Padding:
  - Desktop: `96px` top and bottom (`py-24`).
  - Tablet: `72px` top and bottom (`py-18`).
  - Mobile: `56px` top and bottom (`py-14`).
- Section Component Gap: `48px` desktop, `32px` mobile.

### 4.2 Breakpoints & Grid System
- `sm`: 640px (4-column layout, 16px gutters, 20px margins)
- `md`: 768px (8-column layout, 24px gutters, 32px margins)
- `lg`: 1024px (12-column layout, 24px gutters, 48px margins)
- `xl`: 1280px (12-column layout, 32px gutters, centered container)
- `2xl`: 1536px (12-column layout, max-width container 1240px)
- **Standard Container:** `max-w-[1240px] mx-auto px-6 md:px-8 lg:px-12`.

---

## 5. Navigation & Header Mechanics

### 5.1 Four Dynamic Header States
The header is fixed to the top viewport edge (`z-index: 50`) and dynamically transitions based on scroll depth and page context:

1. **State A — Over Hero Photography (`scrollY ≤ 24px`):**
   - Background: Transparent with a vertical dark gradient scrim (`linear-gradient(to bottom, rgba(10,37,64,0.75) 0%, rgba(10,37,64,0) 100%)`).
   - Height: 88px desktop, 72px mobile.
   - Logo: Light (reversed white logo with preserved red accent).
   - Navigation Links: Pure white (`#FFFFFF`) with 2px `--red-500` active underline.
   - CTA: Solid Red `Talk to an Advisor` button (`--red-600`).
2. **State B — Scrolled Persistent Header (`scrollY > 24px`):**
   - Background: `rgba(10, 37, 64, 0.96)` with `backdrop-filter: blur(12px)`.
   - Height: 72px desktop, 64px mobile (compact transition over 240ms).
   - Border: 1px bottom border in `rgba(215, 217, 220, 0.18)`.
   - Logo: Compact width (150px desktop).
3. **State C — Solid Default Header (Pages without Hero Image):**
   - Solid `--navy-900` from initial render on legal pages, insight articles, thank-you page, and 404.
4. **State D — Mobile Navigation Drawer:**
   - Full-height off-canvas slideout panel in `--navy-950` with bottom-pinned full-width CTA.

---

## 6. Component Specifications

### 6.1 Buttons
- **Primary CTA:** Background `--red-600`, text `#FFFFFF`, no border, border-radius `--radius-md` (12px).
  - Hover: Background `--red-700`, `transform: translateY(-1px)`, transition 200ms.
  - Active: Background `--red-700`, `transform: translateY(0)`.
- **Secondary Outlined (on Dark):** Background transparent, 1.5px border `#FFFFFF`, text `#FFFFFF`.
  - Hover: Background `rgba(255,255,255,0.10)`.
- **Secondary Outlined (on Light):** Background transparent, 1.5px border `--navy-700`, text `--navy-700`.
  - Hover: Background `--navy-50`.
- **Button Sizing:**
  - Large (Hero / Form Submit): Height 56px, padding `0 28px`, font-size 16px Poppins 600.
  - Medium (Standard Actions): Height 48px, padding `0 24px`, font-size 15px Poppins 600.
  - Small (Table Actions / Chips): Height 40px, padding `0 16px`, font-size 14px Poppins 600.

### 6.2 Service & Feature Cards
- Resting State: Pure white surface, 1px solid `--silver-300` border, `--radius-md` (12px), padding 32px. No drop shadow.
- Hover State: Elevation shadow 1 (`0 6px 20px rgba(10,37,64,0.08)`), border color shifts to `--navy-700` at 28% opacity, subtle lift `transform: translateY(-4px)`.
- Icon Circle: 56px diameter, background `--silver-100`. On card hover, background shifts to `--navy-700` and icon stroke turns pure white.

### 6.3 StatBlock & Verified Number Display
- **Condition for Public Display:** A statistic renders **only** if `approvalStatus === 'approved'` **and** `asOfDate` is populated. If unapproved or missing date, the block is excluded and the surrounding layout cleanly collapses without broken whitespace.
- **Development Mode Visuals:** When `VITE_SHOW_PENDING_STATS=true`, pending figures display an unmistakable amber pill: `UNVERIFIED — Pending Client Approval` with `As of [date to be confirmed]`.
- **Absolute Rule on Tier C:** Speculative figures (e.g. the 23% CAGR) are strictly withheld and **never** rendered on any public-facing component.

### 6.4 Form Controls & Validation States
- Form Input Containers: Height 52px, padding `0 16px`, border 1px solid `--silver-500`, radius `--radius-md` (12px).
- Typography in Inputs: 16px Inter regular (prevents automatic iOS Safari zoom).
- Focus State: Border color `--navy-600` with focus ring `0 0 0 4px rgba(27,79,130,0.20)`.
- Error State: Border color `--danger` (`#B42318`), accompanied by an inline alert icon and specific microcopy.
- Mandatory Disclaimers: Pre-submission consent checkbox with explicit link to `/privacy-policy`.
- Data Privacy Protection: Enquiry forms never collect sensitive identifiers (no PAN, Aadhaar, bank details, or passwords).

---

## 7. Motion & Interaction Standards (A1 – A30)

1. **GPU Acceleration:** All transitions animate exclusively `transform` and `opacity`.
2. **Animation Easing:** Standard smooth deceleration `--ease-standard: cubic-bezier(0.22, 1, 0.36, 1)`.
3. **Scroll Reveal:** IntersectionObserver triggers section fade-and-rise (`opacity: 0 → 1`, `translateY(24px → 0)`) with an 80ms stagger between sibling cards.
4. **Reduced Motion Compliance:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

