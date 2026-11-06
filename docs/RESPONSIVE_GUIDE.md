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
5. **Verify Matrix:** Run `.\backend\.venv\Scripts\python.exe scripts/verify_responsive_matrix.py` to confirm zero horizontal overflow across all 10 device viewports from 320px to 1920px.

