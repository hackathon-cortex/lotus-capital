# Lotus Capital — Responsive Architecture & Developer Guide

This document defines the responsive architecture, layout tokens, component behaviors, and coding patterns across Lotus Capital frontend applications.

---

## 1. Single Source of Truth

All breakpoint tokens, fluid typography clamp definitions, container paddings, touch target sizes, and responsive behavior flags originate from three synchronized sources:

1. **TypeScript Export (`frontend/src/config/responsive.ts`)**: Used by React components, hooks (`useBreakpoint()`, `useMediaQuery()`), and unit tests.
2. **CSS Custom Properties (`frontend/src/styles/tokens.css`)**: Used by CSS stylesheets, fluid typography, layout padding, and animation timing.
3. **Content Data (`content/data/layout.json`)**: Config-driven layout parameters ensuring parity across backend and frontend systems.

### Breakpoint Matrix

| Token | Min Width | Target Viewports | Component Adaptation |
| :--- | :--- | :--- | :--- |
| `xs` | `0px` | Small phones (iPhone SE, 320px–479px) | 1-col grids, 20px padding, full-screen mobile menu sheet, sticky CTA bar |
| `sm` | `480px` | Large phones & phablets (480px–767px) | 1-col grids, 24px padding, 2x2 stat chips, full-screen menu |
| `md` | `768px` | Tablets portrait (iPad Mini, iPad 10th) | 2-col grids, 32px padding, Header tablet CTA + menu toggle, 72px admin rail |
| `lg` | `1024px` | Tablets landscape, iPad Pro, Small Laptops | 3-col / 12-col grids, 48px padding, pinned timelines active, 248px admin sidebar |
| `xl` | `1280px` | Standard Laptops & Desktops | Single-line nav (>=1100px), full 4-col footer |
| `2xl` | `1536px` | Ultra-wide Displays (1920px+) | 1240px container centred, fluid typography upper bounds |

---

## 2. Fluid Typography & Spacing Scale

Lotus Capital uses CSS `clamp()` functions for fluid scaling, preventing jarring step jumps between breakpoints:

```css
/* Typography Clamps */
--font-size-display: clamp(2.25rem, 6vw + 1rem, 4.5rem);
--font-size-h1: clamp(2rem, 4vw + 0.75rem, 3.25rem);
--font-size-h2: clamp(1.625rem, 2.5vw + 0.75rem, 2.5rem);
--font-size-body: 16px; /* Mobile */
--font-size-body-desktop: 17px; /* >= 1024px */
--font-size-legal: 13px;

/* Fluid Section Spacing */
--section-padding-fluid: clamp(56px, 8vw, 96px);

/* Fluid Container Padding */
.container {
  width: 100%;
  max-width: 1240px;
  margin-inline: auto;
  padding-inline: 20px; /* xs */
}
@media (min-width: 480px) { .container { padding-inline: 24px; } }
@media (min-width: 768px) { .container { padding-inline: 32px; } }
@media (min-width: 1024px) { .container { padding-inline: 48px; } }
```

Headings enforce `text-wrap: balance` to eliminate awkward typographic orphans, and body copy enforces `text-wrap: pretty`.

---

## 3. Component Responsive Behavior

| Component | Mobile (< 768px) | Tablet (768px – 1023px) | Desktop (≥ 1024px) |
| :--- | :--- | :--- | :--- |
| **Header** | 64px height. Logo + menu button. Opens full-screen slide-in sheet (56px items, expandable services). | 72px height. Logo + "Talk to an Advisor" CTA + menu button. Nav links collapsed. | 96px initial / 76px scrolled. Logo + single-line nav (≥1100px, 32px gap) + CTA button. |
| **Sticky CTA Bar** | 56px red button pinned to bottom with safe-area padding. Reveals after hero scrolls out; hides on footer & drawer. | Hidden (`display: none`). | Hidden (`display: none`). |
| **Hero Sections** | Single column. Stacked full-width buttons (52px). Stat card in-flow 2x2 grid. | 2-column or stacked. Board below text. 4-across stat card. | 2-column split (7 cols text / 5 cols board). Overlapping 4-chip stat card. |
| **SIP Board** | Single column. Controls on top, results metrics above SVG chart (220px). 44px touch sliders. | Single column. Sliders and results stacked. Full width. | 2-column grid (~45% sliders, ~55% results & chart). 320px chart height. |
| **Timelines** | Vertical timeline with connecting line on left. Container height `auto` (zero scroll hijack). | Vertical timeline with connecting line on left. Container height `auto`. | Pinned horizontal / scroll-linked stages (100vh sticky window, 250vh–400vh wrapper). |
| **Dot Navigator** | Removed site-wide. | Removed site-wide. | Removed site-wide on client request. |
| **Site Footer** | 1 column in logical order: Brand → Contact → Services → Company & Legal. | 2 columns side by side. 12px link vertical rhythm. | 4 columns: Brand (1.4fr), Services (1fr), Company & Legal (1fr), Contact & Hours (1.2fr). |
| **Admin Panel** | Off-canvas drawer with hamburger topbar. Tables transform into responsive cards. | 72px collapsed icon rail sidebar. | 248px permanent sidebar with full navigation and metrics table. |
| **WhatsApp Button** | 52x52px pill/circle, elevated above sticky CTA (`bottom: calc(76px + env(safe-area-inset-bottom))`). | Fixed bottom-right `24px`. | Fixed bottom-right `24px`. Hover elevation active. |

---

## 4. Platform & Touch Ergonomics

- **Minimum Touch Targets:** All interactive buttons, nav links, and drawer triggers enforce a minimum bounding box of 44×44px (with `min-height: 52px` on primary CTA buttons and form controls).
- **Form Input Auto-Zoom Prevention:** All `<input>`, `<select>`, and `<textarea>` elements declare `font-size: 16px` on mobile screens to prevent iOS Safari auto-zooming.
- **Dynamic Viewports (`dvh` / `svh`):** Mobile overlays and sheets declare `height: 100dvh` (with `100vh` fallback) so dynamic address bars do not push content off-screen.
- **Safe-Area Awareness:** Fixed headers, sticky mobile bars, and bottom sheets declare `padding-bottom: max(..., env(safe-area-inset-bottom))` to respect home indicator bars on iPhone and Android gesture navigation.
- **Hover Isolation:** Hover styles (`transform: translateY(-2px)`, shadow lift) are wrapped in `@media (hover: hover) and (pointer: fine)` to prevent "sticky hover" states on touch taps.

---

## 5. React Hooks for Responsive Logic

### `useBreakpoint()`
```tsx
import { useBreakpoint } from '../hooks/useBreakpoint';

export const MyComponent = () => {
  const { isMobile, isTablet, isDesktop, breakpoint, isAtLeast, isBelow } = useBreakpoint();

  return (
    <div>
      {isDesktop ? <DesktopFeature /> : <MobileFeature />}
      {isBelow('lg') && <CompactNotice />}
    </div>
  );
};
```

### `useMediaQuery(query)`
```tsx
import { useMediaQuery } from '../hooks/useMediaQuery';

export const FilterPill = () => {
  const isLandscapePhone = useMediaQuery('(max-height: 520px) and (orientation: landscape)');
  return <div className={isLandscapePhone ? 'compact-pill' : 'standard-pill'}>Filter</div>;
};
```

---

## 6. How to Build a New Responsive Section

When building a new section or page:
1. **Container Wrapper:** Always wrap content in `<div className="container">` to inherit responsive fluid padding (20/24/32/48px).
2. **Avoid Hardcoded Widths:** Never use fixed pixel widths on layout containers (e.g., `width: 800px`). Use `width: 100%; max-width: 800px;`.
3. **Grid Tracks:** In CSS Grid, use `minmax(0, 1fr)` rather than `1fr` alone on columns containing tables or code blocks to prevent layout blowout.
4. **Watermarks & Bleeds:** Any section with background watermarks or decorative SVGs extending into negative margins (`right: -40px`) must declare `overflow: hidden;` (and `overflow: clip;`).
5. **Verify Matrix:** Run `npm run audit:mobile` or `.\backend\.venv\Scripts\python.exe scripts/verify_responsive_matrix.py` to confirm zero horizontal overflow across all device viewports from 320px to 1920px.

---

## 7. Mobile Layout Robustness Rules (Post-Audit Standard)

### A. Word-Break & Typography Reset
- Global reset prevents single-letter wraps: `:where(h1,h2,h3,h4,h5,h6,p,li,dd,dt,label,a,button,span,td,th) { overflow-wrap: break-word; word-break: normal; hyphens: manual; }`.
- `overflow-wrap: anywhere` and `word-break: break-all` are strictly forbidden on broad selectors and reserved exclusively for `.break-anywhere` (used on emails, URLs, registration codes, copy chips).
- Heading clamp floors enforce minimum readable scale: H1 >= 28px (`clamp(1.75rem, 4vw + 0.75rem, 3.25rem)`), H2 >= 24px (`clamp(1.5rem, 2.5vw + 0.75rem, 2.5rem)`), H3 >= 20px (`clamp(1.25rem, 1.8vw + 0.5rem, 1.75rem)`).

### B. HorizontalRail & Min-Width Protection
- Any category rail, card list, or pill track on mobile must render via `HorizontalRail` or responsive flex with `min-width: 240px`, `flex: 0 0 min(82vw, 320px)`, and `scroll-snap-align: start`.
- Hardcoded multi-column desktop grids (`repeat(4, 1fr)`) must never be applied to mobile viewports without responsive overrides.

### C. Badges, Numerals & Chips
- Badges and numeric indicators must declare `white-space: nowrap !important; flex-shrink: 0 !important; width: max-content !important;`.
- Header rows containing an icon/title and a badge must use `flex-wrap: wrap; gap: 8px;` so badges wrap gracefully rather than squeezing.

### D. Header Rows with Action Buttons
- Below `768px`, header rows containing a heading and an action button (e.g. Deep-dive inspector "Mark as reviewed") stack vertically (`grid-template-columns: 1fr`).
- Buttons must have `width: auto; white-space: nowrap; border-radius: 999px; padding: 10px 16px; min-height: 44px;`.

### E. Symmetric Gutters
- Content blocks must maintain symmetric left/right gutters (`padding-inline: var(--container-pad, clamp(16px, 5vw, 24px))`) across all viewports.
- Never add ad-hoc `padding-left: 1.5rem` or `margin-left: 46px` to wrappers enclosing a `.container`.

### F. Sticky CTA Bar Spacing
- On mobile (< 768px), `body` declares `padding-bottom: calc(var(--cta-bar-h, 64px) + env(safe-area-inset-bottom, 0px))` so sticky bars never obscure content or submit buttons.
- The floating DEV pill is repositioned above the bar or hidden on small viewports (`< 480px`).

### G. Enquiry Forms
- Below `900px`, split enquiry cards stack vertically into a single column (`max-width: 560px; margin-inline: auto`).
- The consent row uses `display: grid; grid-template-columns: 24px minmax(0, 1fr); gap: 12px;` and is never shared in a row with the submit button on mobile.
- The submit button is full-width with `min-height: 52px; white-space: nowrap;`.

### H. FAQ Sections (FaqAccordion, Home & Mini-FAQ)
- **Single-Column Stacking below 992px**: Collapses from 2 columns (`minmax(280px, 1fr) minmax(320px, 1.8fr)`) to 1 column (`grid-template-columns: 1fr; gap: 2rem;`) with sticky left intro resetting to `position: relative`.
- **Category Filter Rail**: Category pills use `.faq-category-pills` with horizontal scroll touch support below `992px` (`overflow-x: auto; flex-wrap: nowrap; scrollbar-width: none;`) and `white-space: nowrap; flex-shrink: 0; min-height: 40px;` per pill.
- **No Redundant Container Padding**: Outer sections must not double-pad `.container`. The inner `.container` provides `padding-inline: clamp(16px, 5vw, 24px)`.
- **Button & Question Text**: Uses `.faq-card-button` with responsive padding (`1rem 1rem 1rem 1.15rem` on mobile, `1.25rem 1.5rem 1.25rem 1.75rem` on desktop). The question container specifies `min-width: 0; flex: 1;` with `word-break: break-word; overflow-wrap: break-word;` on text to prevent flex blowout.
- **Answer Indentation Reset**: Desktop indentation (`padding: 0 1.75rem 1.35rem 3.75rem`) aligns under the question text. On mobile (`< 768px`), left padding resets to `1.15rem` (`.faq-card-answer` / `.home-faq-answer`) so copy reads comfortably without letter-squeezing.
- **Brand Palette Adherence**: Left accent bar and active status indicators use brand tokens (`var(--red-500, #d9232d)` when open, navy tones when closed). No unbranded blue or teal hex values.



