# Browser Support & Mobile Hardening Specification

## Overview

This document specifies the browser support targets, mobile layout hardening, and WebKit/Blink/Gecko compatibility standards implemented across Lotus Capital.

---

## 1. Target Matrices & Build Configuration

### 1.1 Supported Browser Tiers
- **iOS Safari**: iOS 14.0+ (Tested against iPhone 13, 14, 15 viewport sizes: 390px, 393px, 430px)
- **Desktop Safari**: Safari 14.0+ (macOS Big Sur+)
- **Google Chrome / Chromium**: Chrome 90+ (Android & Desktop)
- **Microsoft Edge**: Edge 90+
- **Mozilla Firefox**: Firefox 100+

### 1.2 Toolchain Configuration
- **Browserslist**: `["iOS >= 14", "Safari >= 14", "Chrome >= 90", "Edge >= 90", "Firefox >= 100"]` defined in `frontend/package.json`.
- **Vite Build Targets**:
  - `build.target`: `['es2019', 'safari14']`
  - `build.cssTarget`: `'safari14'`
- **CSS Autoprefixer**: Active via PostCSS pipeline for `-webkit-backdrop-filter`, `-webkit-appearance`, and `-webkit-text-size-adjust`.

---

## 2. iOS Safari Defect Remediation & Layout Isolation

### 2.1 Logo Rendering & Canvas Blowout Prevention
- **Root Cause**: Inline SVGs lacking explicit `width` attributes inside flex rows with `overflow: visible` and `backdrop-filter` caused WebKit to expand the SVG canvas to its full 725x405 coordinate frame (2-3x iPhone 13 390px viewport). Furthermore, the watermark variant previously included the 674px divider rule which struck through the hero paragraph.
- **Remediation**:
  1. Shipped dedicated un-recolored vector assets with explicit `width`, `height`, `viewBox`, and `preserveAspectRatio="xMinYMid meet"`:
     - `frontend/public/images/logo/light.svg` (725x405, white petals and Felix Titling typography for dark navy surfaces).
     - `frontend/public/images/logo/dark.svg` (725x405, navy petals and typography for light surfaces).
     - `frontend/public/images/logo/mark.svg` (250x250, emblem petals only for badges and watermarks).
  2. Implemented `BrandLogo` component wrapping assets in `<picture>`/`<img>` with:
     - Explicit width and height attributes (`width="190" height="54"` on desktop, height 36-40px on mobile).
     - Container isolation: `overflow: hidden; contain: layout paint; flex: 0 0 auto; min-width: 0;`.
     - Zero CSS filters (`invert`, `brightness`) or `mix-blend-mode` to ensure consistent rendering across WebKit GPU threads.
  3. Sanitized `LotusLogo` watermark variant: restricts `viewBox` to `235 0 250 250` and completely removes wordmark text and divider rule paths.

### 2.2 Header Layout & Stacking Context
- **Root Cause**: WebKit establishes a new containing block for fixed descendants when `-webkit-backdrop-filter` or `transform` is present on a parent element.
- **Remediation**:
  1. `.site-header__bar` maintains a single row flex container with `min-width: 0;` and `justify-content: space-between;`.
  2. Mobile navigation drawer rendered through `ReactDOM.createPortal(..., document.body)` so it mounts outside the header's stacking context, preventing clipping.
  3. Safe area insets integrated: `padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom);`.

### 2.3 Hero Section & Artwork
- **Hero Background**: Configured to `/images/hero.svg` with `object-fit: cover;` and navy gradient scrim.
- **Hero Artwork**: `.hero-lotus-art` on mobile screens (max-width 767px) sits at `z-index: 0; pointer-events: none; opacity: 0.18; max-width: 35vw;` behind the text container (`position: relative; z-index: 2;`).
- **Typography Sizing**: Fluid clamp notation (`clamp(2.25rem, 4.5vw, 3.4rem)`) prevents title wrapping collisions on 320px-390px viewports.

---

## 3. Mobile WebKit Input & Form Behavior

1. **Auto-Zoom Prevention**:
   - `input, select, textarea` configured with `font-size: 16px !important;` below 768px to prevent iOS Safari from automatically zooming into form fields.
2. **Native Stylings**:
   - `-webkit-appearance: none;` applied to inputs and select dropdowns to suppress default iOS rounded gray gradients.
3. **Viewport Fit**:
   - `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />` ensures content spans the physical display boundary around the notch and dynamic island.
4. **BFCache Handling**:
   - Back-Forward Cache (BFCache) `pageshow` event handler attached in `main.tsx` to refresh layout state upon history navigation.

---

## 4. Verification Evidence

- **Vitest Suites**: 23 test suites passing (227 tests total), including `tests/iosSafariAndCrossDevice.test.tsx` and `tests/mobileLayoutFixes.test.tsx`.
- **Vite Build**: Production compilation cleanly generated with target `['es2019', 'safari14']`.
- **Backend Test Suite**: 36 pytest tests passing with 100% compliance.
