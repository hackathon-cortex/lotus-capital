# Lotus Capital — Design System

**Version:** 1.0 (October 2026)
**Stack:** React + Vite, CSS variables (Tailwind-compatible tokens), optional Framer Motion
**Companion documents:** `Lotus_Capital_Site_Structure.md` (routes), `lotus_capital_content_md/` (page content), `Lotus_Capital_Design_Reference_Document.pdf` (layout references)

This document turns the brand vision into implementation rules: colours, type, components, layouts, **every animation**, and **every positioning rule**, including the header that sits over a full-bleed photograph, as shown in the Lotus Capital logo lock-up and the hero reference.

---

## 1. Core vision

> **Royalty through security. Premium through simplicity. Trust through transparency.**

Lotus Capital should look like an established, premium financial institution that communicates stability, protection, credibility and long-term wealth creation across insurance, equity, mutual funds, bonds and other services.

It should feel **royal, sophisticated, secure and approachable**. It should not feel flashy or palace-like.

### Principles

| Principle                  | What it means in practice                                                                |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| Security first             | Deep navy anchors, generous space, calm motion, clear risk and disclosure treatment      |
| Premium through simplicity | Few colours, strong type, fine silver details, no ornament for its own sake              |
| Transparency               | Statistics always show an as-of date; disclaimers are readable, never hidden             |
| Local and human            | Real photography of the team and families, Godhra and Gujarat context, a visible founder |
| Restraint                  | Motion and shadow are used to guide attention, not to decorate                           |

### Avoid

Excessive gold, heavy gradients, ornate decoration, glossy effects, shadows on every component, flashy stock-market animations, and any imagery or wording that promises wealth or returns.

---

## 2. Reference map

The layouts come from the uploaded **Lotus Capital Design Reference Document**. Page numbers below are the PDF's physical pages (cover = page 1).

| Ref | PDF page | Reference                                                                          | Used for                                                                                | Section in this document |
| --- | -------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------ |
| 1   | 3        | fiatwm.com hero                                                                    | Home hero: eyebrow, bold headline, full-width photo, two CTAs, highlighted nav button   | 8.1, 7                   |
| 2   | 4        | groww.in services grid                                                             | Six service cards with icon and one-line description                                    | 8.3                      |
| 3   | 5        | groww.in "Trusted by" recording                                                    | Customer-count section, floating testimonial cards, contrasting dark CTA area           | 8.5                      |
| 4   | 6        | ETMoney health insurance link                                                      | Insurance page structure: overview, categories, compare, partners, quote, FAQs, enquiry | 9.1                      |
| 5   | 7        | Investment website template                                                        | Founder portrait, split layout, statistic chips, four value tiles, partner logo strip   | 8.2, 8.6                 |
| 6   | 8        | Dashboard reference (large headline figure, action cards, growth chart, goal bars) | Mutual funds page visuals                                                               | 9.2                      |
| 7   | 9–10     | Admin panel layout (our proposal)                                                  | Admin dashboard, enquiry metrics, follow-ups, CMS, role-based access                    | 11                       |

Note: the PDF copy this system was written from lists reference 6 as "to be added" and shows the dashboard image under reference 7. The correct assignment, as updated with the client, is: the dashboard image guides the **Mutual Funds** page; the admin panel uses our own proposed layout.

Rules for using references:

- Take **layout, hierarchy and feel** only. Never copy imagery, wording, logos or figures from a reference site.
- Replace palettes with the Lotus Capital palette.
- All placeholder statistics, testimonials and photographs are replaced by approved Lotus Capital content.

---

## 3. Colour system

### 3.1 Brand palette

| Role                | Name            | Hex       | Meaning                                                       |
| ------------------- | --------------- | --------- | ------------------------------------------------------------- |
| Primary             | Royal Navy Blue | `#123D67` | Authority, stability, security, trust                         |
| Premium accent      | Silver          | `#D7D9DC` | Refinement, prestige, understated luxury                      |
| Main canvas         | White           | `#FFFFFF` | Clarity, openness, readability                                |
| Selective highlight | Lotus Red       | `#E92332` | Important actions, small highlights, continuity with the logo |

### 3.2 Extended tokens

| Token          | Hex       | Use                                                            |
| -------------- | --------- | -------------------------------------------------------------- |
| `--navy-950`   | `#071B30` | Footer base, deepest overlays                                  |
| `--navy-900`   | `#0A2540` | Dark sections, scrolled header, hero scrim                     |
| `--navy-800`   | `#0E3154` | Dark card surfaces                                             |
| `--navy-700`   | `#123D67` | **Brand navy**: headings, primary surfaces                     |
| `--navy-600`   | `#1B4F82` | Hover on navy, links, focus ring                               |
| `--navy-100`   | `#E6EDF5` | Tinted backgrounds, selected rows                              |
| `--silver-300` | `#D7D9DC` | Borders, dividers, watermark                                   |
| `--silver-100` | `#F3F5F7` | Alternate section background, card surface                     |
| `--silver-500` | `#8A949D` | Form field borders (3.09:1 on white)                           |
| `--red-500`    | `#E92332` | Brand red: icons, underline accents, large text, focus on dark |
| `--red-600`    | `#C81B29` | **Button fill** (white text 5.76:1)                            |
| `--red-700`    | `#A91621` | Button hover and pressed                                       |
| `--red-300`    | `#FF6B76` | Red text on dark backgrounds (5.64:1 on `--navy-900`)          |
| `--ink`        | `#1F2933` | Body text                                                      |
| `--muted`      | `#5B6770` | Secondary text (5.8:1 on white)                                |
| `--success`    | `#1E7F4F` | Success states                                                 |
| `--warning`    | `#9A6700` | Warning states                                                 |
| `--danger`     | `#B42318` | Error states (always with an icon and text)                    |

### 3.3 Usage rules

| Surface                                         | Allowed colours                                                                         |
| ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| Hero, trust, customer-count and footer sections | Navy 900/800/700 background, white and silver text, red for the one primary action      |
| Content sections                                | White or `--silver-100` background, navy headings, `--ink` body                         |
| Service and info cards                          | White card on `--silver-100`, or `--silver-100` card on white, 1px silver border        |
| Forms                                           | White fields, `--silver-500` borders, navy focus ring                                   |
| Admin                                           | Navy sidebar, `--silver-100` canvas, white cards, red for alerts and one primary action |

Proportions on a typical page: **white and light surfaces about 60%, navy about 30%, silver about 8%, red under 2%.** Red appears at most **once per viewport as a button**, plus small icon or underline accents.

### 3.4 Verified contrast (WCAG 2.1)

| Foreground on background       | Ratio      | Result                                           |
| ------------------------------ | ---------- | ------------------------------------------------ |
| White on `#123D67`             | 11.12      | AAA                                              |
| White on `#0A2540`             | 15.54      | AAA                                              |
| `#D7D9DC` on `#0A2540`         | 10.99      | AAA                                              |
| `#D7D9DC` on `#123D67`         | 7.86       | AAA                                              |
| `#1F2933` on white             | 14.76      | AAA                                              |
| `#5B6770` on white / `#F3F5F7` | 5.8 / 5.31 | AA                                               |
| White on `#C81B29` (button)    | 5.76       | AA                                               |
| White on `#E92332`             | 4.42       | **Fails AA for body-size text**                  |
| `#E92332` on white             | 4.42       | Large text and graphics only                     |
| `#E92332` on `#0A2540`         | 3.52       | Large text and graphics only                     |
| `#FF6B76` on `#0A2540`         | 5.64       | AA (red text on dark)                            |
| `#D7D9DC` on white             | 1.41       | **Decorative only**; never text or field borders |

Rules that follow: **buttons use `--red-600`, not the brand red; brand red is for icons, accents and large text**; silver is a border and background colour, not a text colour on white.

### 3.5 Lotus watermark

Use the lotus mark from the logo in `--silver-300` at **6–8% opacity** (on dark: white at 5%), 480–640px wide, cropped by the section edge. Allowed in the trust section, customer-count section, footer and 404 page. Never behind body text.

---

## 4. Typography

### 4.1 Fonts

| Role                       | Font                   | Weights       | Notes                                                                 |
| -------------------------- | ---------------------- | ------------- | --------------------------------------------------------------------- |
| Headings, buttons, numbers | **Poppins**            | 600, 700      | Strong, geometric, close to the bold hero reference                   |
| Body, UI, tables           | **Inter**              | 400, 500, 600 | Tabular numbers for statistics (`font-variant-numeric: tabular-nums`) |
| Gujarati (if used)         | **Noto Sans Gujarati** | 400, 600, 700 | Fallback and Gujarati content                                         |

Load with `font-display: swap`, subset Latin, preload the two primary weights. Provide system fallbacks: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.

### 4.2 Type scale (fluid)

| Style             | Desktop                    | Mobile | Weight | Line height | Letter spacing    | Use                                  |
| ----------------- | -------------------------- | ------ | ------ | ----------- | ----------------- | ------------------------------------ |
| Display / H1 hero | `clamp(40px, 5.2vw, 72px)` | 40px   | 700    | 1.05        | -0.02em           | Home hero only                       |
| H1 page           | `clamp(34px, 4vw, 52px)`   | 34px   | 700    | 1.1         | -0.015em          | Page titles                          |
| H2                | `clamp(28px, 3vw, 40px)`   | 28px   | 600    | 1.15        | -0.01em           | Section titles                       |
| H3                | 24px                       | 22px   | 600    | 1.25        | 0                 | Card and block titles                |
| H4                | 20px                       | 18px   | 600    | 1.3         | 0                 | Sub-blocks                           |
| Eyebrow           | 13px                       | 12px   | 600    | 1.2         | 0.18em, uppercase | Above headlines                      |
| Lead              | 20px                       | 18px   | 400    | 1.55        | 0                 | Supporting copy under H1/H2          |
| Body              | 17px                       | 16px   | 400    | 1.65        | 0                 | Paragraphs                           |
| Small             | 14px                       | 14px   | 400    | 1.5         | 0                 | Captions, notes                      |
| Stat number       | `clamp(36px, 4vw, 56px)`   | 36px   | 700    | 1           | -0.01em           | Statistics                           |
| Legal             | 13px                       | 13px   | 400    | 1.55        | 0                 | Footer disclaimer (never below 12px) |

### 4.3 Rules

- One H1 per page. Heading levels never skip.
- Headline measure: max **18ch per line in the hero** ("Plan with confidence. Protect what matters. Build your future." breaks into three lines on desktop), body measure **60–70 characters**.
- Eyebrows use silver on dark backgrounds and navy on light.
- Optional hero accent: a 6px red underline bar (`--red-500`) under the last headline word or the eyebrow, not both.
- Numbers always use tabular figures. Indian digit grouping: `2,500+`, `₹50 crore+`.

---

## 5. Spacing, grid, radius, elevation

### 5.1 Spacing scale (8px base)

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`

### 5.2 Breakpoints

| Name         | Min width | Columns | Gutter | Page margin    |
| ------------ | --------- | ------- | ------ | -------------- |
| Mobile       | 0         | 4       | 16     | 20             |
| Large mobile | 480       | 4       | 16     | 24             |
| Tablet       | 768       | 8       | 24     | 32             |
| Desktop      | 1024      | 12      | 24     | 48             |
| Wide         | 1280      | 12      | 32     | auto (centred) |
| Ultra-wide   | 1536      | 12      | 32     | auto           |

**Container:** `max-width: 1240px`, centred. Full-bleed sections (hero, dark bands, footer) extend to the viewport edge, with their content inside the container.

### 5.3 Section rhythm

| Viewport | Section padding (top/bottom) | Gap between blocks inside a section |
| -------- | ---------------------------- | ----------------------------------- |
| Desktop  | 96px                         | 48px                                |
| Tablet   | 72px                         | 40px                                |
| Mobile   | 56px                         | 32px                                |

### 5.4 Radius

| Token           | Value | Use                                        |
| --------------- | ----- | ------------------------------------------ |
| `--radius-sm`   | 8px   | Chips, small buttons, tags                 |
| `--radius-md`   | 12px  | Cards, inputs, buttons                     |
| `--radius-lg`   | 20px  | Large panels, hero stat card, image frames |
| `--radius-pill` | 999px | Status badges                              |

### 5.5 Elevation (shadows are rare)

| Level | Value                             | Used for                                     |
| ----- | --------------------------------- | -------------------------------------------- |
| 0     | none                              | Default for cards, sections, inputs          |
| 1     | `0 6px 20px rgba(10,37,64,0.08)`  | Card hover, dropdown menus                   |
| 2     | `0 16px 40px rgba(10,37,64,0.14)` | Overlapping hero stat card, modals, popovers |

No shadows on resting cards. Separation comes from silver borders and background contrast.

### 5.6 Z-index scale

| Layer                                          | z-index |
| ---------------------------------------------- | ------- |
| Page content                                   | 0       |
| Hero image / background                        | 0       |
| Hero scrim                                     | 1       |
| Hero content                                   | 2       |
| Sticky section nav, floating testimonial cards | 10      |
| Header                                         | 50      |
| Dropdown menus                                 | 60      |
| Mobile menu panel                              | 70      |
| WhatsApp floating button                       | 80      |
| Modal and backdrop                             | 90      |
| Toast                                          | 100     |
| Skip link (focused)                            | 110     |

---

## 6. Logo and brand assets

The Lotus Capital logo (lotus mark with the wordmark and "Partnering Wealth Creation") is supplied by the client. **Required files:** SVG in three variants, with transparent backgrounds.

| Variant            | Colours                                       | Used on                                                           |
| ------------------ | --------------------------------------------- | ----------------------------------------------------------------- |
| Light (reversed)   | White wordmark and mark, red accent preserved | Transparent header over photo, navy sections, footer              |
| Dark (full colour) | Navy wordmark, red accent                     | White header states, admin sidebar header (light mode), documents |
| Mark only          | Lotus mark                                    | Favicon, mobile header on narrow screens, watermark source        |

Rules:

- Minimum width: **140px** desktop, **120px** mobile. Below that, use the mark only.
- Clear space: the height of one lotus petal on all sides.
- Never recolour, stretch, rotate, outline or add effects. Never place the full-colour logo on a photograph; use the light variant over the scrim.
- Tagline "Partnering Wealth Creation" appears with the logo in the footer and on the hero header lock-up; it is hidden in the scrolled header and on mobile.
- Favicon: lotus mark on navy, 32px and 180px (touch icon), plus a maskable PWA icon.

---

## 7. Header over photography (positioning and states)

The header sits **on top of the hero photograph**, with no separate bar above the image. It is fixed to the top of the viewport and changes state as the page scrolls.

### 7.1 Structure and positioning

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo]   Home  About Us  Services ▾  Mutual Funds  Equity  Insights    │  ← header, position: fixed; top: 0
│          Contact Us                                  [Talk to an Advisor]│
└────────────────────────────────────────────────────────────────────────┘
  hero photograph runs behind the header, from y = 0
```

| Property                | Value                                                                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Position                | `position: fixed; top: 0; left: 0; right: 0; z-index: 50`                                                                                                 |
| Height (top state)      | 88px desktop, 72px tablet, 64px mobile                                                                                                                    |
| Height (scrolled state) | 72px desktop, 64px tablet, 56px mobile                                                                                                                    |
| Container               | Same 1240px container as the page                                                                                                                         |
| Layout                  | Three zones: logo (left, fixed width 180px), navigation (centre, flexible, left-aligned after logo), actions (right: CTA button, optional language/phone) |
| Vertical alignment      | Items centred on the header's vertical axis                                                                                                               |
| Navigation gap          | 32px between links                                                                                                                                        |
| Hero offset             | Hero content starts at `header height + 64px` so nothing is covered                                                                                       |

### 7.2 States

| State                     | When                                                                                      | Background                                                                                                                              | Logo          | Link colour                                                    | CTA                      | Border                                     |
| ------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------- | ------------------------ | ------------------------------------------ |
| **A: Over hero**          | `scrollY ≤ 24px` on a page with a hero photo                                              | Transparent, with a top scrim `linear-gradient(to bottom, rgba(10,37,64,0.72) 0%, rgba(10,37,64,0) 100%)` behind the header, 160px tall | Light variant | White, active link has a 2px `--red-500` underline, offset 8px | Red button (`--red-600`) | none                                       |
| **B: Scrolled**           | `scrollY > 24px`                                                                          | `rgba(10,37,64,0.96)` with `backdrop-filter: blur(12px)`                                                                                | Light variant | White                                                          | Red button               | 1px `rgba(215,217,220,0.18)` bottom border |
| **C: Solid**              | Pages without a hero photo (legal, insights article, thank-you, 404, contact if no image) | `--navy-900` from the start                                                                                                             | Light variant | White                                                          | Red button               | same as B                                  |
| **D: Menu open (mobile)** | Mobile panel open                                                                         | `--navy-950` full-screen panel                                                                                                          | Light variant | White                                                          | Pinned at panel bottom   | none                                       |

Active link: a 2px underline in `--red-500`, 8px below the text; "Services" is active on any `/services/*` page and on `/investments/other-solutions`.

### 7.3 Behaviour

- The header **stays visible while scrolling** so the enquiry button is always reachable. It does not hide on scroll down.
- State A to B transition: **240ms**, `cubic-bezier(0.22, 1, 0.36, 1)`. Height, background and border animate; logo size shrinks from 180px to 150px wide.
- Skip link "Skip to main content" appears on focus, top-left, above the header.
- The hero image is rendered at `top: 0` (not below the header), so there is no gap or colour seam.

### 7.4 Services dropdown

Position: anchored under the "Services" link, left-aligned to it, `top: 100% + 8px`, width 320px, `--radius-md`, white surface, elevation 1, 1px silver border, 8px padding. Items 44px tall; hover background `--silver-100`; "All Services" separated by a silver divider.
Animation: fade and rise (see section 12, A6).

### 7.5 Mobile header

Logo (mark plus short wordmark) on the left, menu button (44×44) on the right. Tapping opens a full-height panel from the right (width 100%, max 420px). Navigation items 56px tall, 20px type; "Services" expands in place. **Talk to an Advisor** is pinned to the panel bottom, 56px tall, full width, with safe-area padding.

---

## 8. Public page layouts

All hero and band sections are full-bleed; content sits in the container. Positions below use the desktop layout, with mobile behaviour noted.

### 8.1 Home — hero (Reference 1)

**Dimensions:** `min-height: min(86vh, 820px)`; mobile `min-height: 640px`. The hero image fills the section (`object-fit: cover`).

**Layers (back to front)**

1. Photograph (z 0), focal point right of centre (`object-position: 70% center` desktop, `60% center` mobile).
2. Navy scrim (z 1): `linear-gradient(90deg, rgba(10,37,64,0.90) 0%, rgba(10,37,64,0.68) 42%, rgba(10,37,64,0.18) 72%, rgba(10,37,64,0) 100%)`. On mobile: `linear-gradient(180deg, rgba(10,37,64,0.55) 0%, rgba(10,37,64,0.85) 100%)`.
3. Lotus watermark (z 1), bottom-left, 6% opacity, partly cropped.
4. Content (z 2).

**Content block position:** left-aligned in the container, occupying the first 7 of 12 columns (max-width 640px). Vertically it starts at `header height + 64px` and the block is centred within the remaining height.

| Order | Element                                                              | Style                                                                                                           | Spacing below |
| ----- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------- |
| 1     | Eyebrow: "FINANCIAL SOLUTIONS • GODHRA, GUJARAT"                     | Eyebrow style, silver, 6px red bar (40×3px) above it                                                            | 16px          |
| 2     | H1: "Plan with confidence. Protect what matters. Build your future." | Display, white                                                                                                  | 24px          |
| 3     | Supporting copy                                                      | Lead, `#D7D9DC`, max 520px                                                                                      | 40px          |
| 4     | Button row                                                           | Primary "Explore Our Services" (red), secondary "Talk to an Advisor" (outlined white), gap 16px, both 56px tall | 0             |

**Hero statistic card** (overlaps the section below): a white card, `--radius-lg`, elevation 2, **centred horizontally, positioned with `transform: translateY(50%)` on the hero's bottom edge**, width `min(1100px, 100% - 48px)`. It holds four statistics separated by 1px silver dividers (see 8.5 for content). On mobile it becomes a 2×2 grid and sits fully inside the hero's bottom padding. Add `margin-bottom` equal to half the card height to the next section.

**Hero photography:** natural light, warm; team members, an advisor with a family, or local Godhra families; navy or soft grey backgrounds; faces visible on the right two-thirds. Shot in landscape, minimum 2400×1350, delivered as AVIF/WebP with a JPEG fallback, plus a 4:5 portrait crop for mobile.

### 8.2 Home — about preview and founder (Reference 5)

Split layout on a white background:

- Left (5 columns): founder portrait, 4:5 ratio, `--radius-lg`, a silver 1px frame offset 16px bottom-right behind it (decorative, `z-index: -1`).
- Right (7 columns): eyebrow "About Lotus Capital", H2, one paragraph, **four value tiles** in a 2×2 grid (each tile: 40px silver-100 circle with a navy icon, title H4, one line), then a text link "Learn more →".
- Statistic chips sit below the paragraph as three inline chips (`2,500+ clients serviced`, `1,200+ mutual fund folios`, `800+ demat accounts`), each with the as-of date in the section caption.
- Mobile: portrait first (full width, 4:3 crop), then text, tiles stacked in one column.

### 8.3 Home and `/services` — service cards (Reference 2)

Heading block centred above the grid: eyebrow "Our services", H2 "Solutions for protection, investing and long-term planning."

**Grid:** 3 columns × 2 rows on desktop (gap 24px), 2 columns on tablet, 1 column on mobile. Six identical cards in this order: General Insurance, Life Insurance, Health Insurance, Mutual Funds, Equity & Investments, More Solutions.

**Card anatomy** (padding 32px, `--radius-md`, white, 1px silver border):

1. Icon circle 56px, `--silver-100`, navy line icon (1.5px stroke, 28px).
2. H3 title.
3. One-line descriptor (body, `--muted`), max two lines.
4. Statistic badge (small chip, optional, with as-of date in the section footnote).
5. "Explore →" link at the bottom, navy, with the arrow shifting 4px on hover.
   The whole card is one link (single focusable element).

Icons (line style, silver shield motif where relevant): General Insurance: shield with check. Life Insurance: shield with heart. Health Insurance: shield with cross. Mutual Funds: rising bars within a circle. Equity: line chart. More Solutions: grid of four.

### 8.4 Home — "How we work"

Four steps in one row, connected by a 1px silver line running through the circles (line at `top: 28px`). Each step: numbered circle 56px (navy, white number), H4, two lines of text. Mobile: vertical list with the line on the left.

### 8.5 Customer-count and testimonials band (Reference 3)

Dark band (`--navy-900`) with the lotus watermark. Vertical stack centred:

1. Eyebrow "Trusted by".
2. Stat headline: **"Trusted by 2,500+ clients"**, Display size (clamp 40–72px), white, number counts up (animation A12).
3. Caption: "As of [date]. Figures supplied by Lotus Capital." in `#C9CED4`, 14px.
4. Four statistic columns under the headline (`2,500+ clients`, `1,200+ folios`, `800+ demat accounts`, `570+ insurance policies`), 1px `rgba(215,217,220,0.2)` dividers.
5. **Floating testimonial cards** arranged around the headline: 6 cards positioned absolutely at the band's left and right edges (3 each side, staggered vertically at 8%, 38%, 68% of the band height, horizontally offset ±(0–60px) from the container edge). Card: white, `--radius-md`, 280px wide, padding 20px, quote 15px, name and place 13px. Cards drift slowly (animation A13). On tablet show 4, on mobile show a horizontal scroll-snap carousel below the headline instead of floating cards.
6. A contrast CTA strip at the bottom of the band: `--navy-800` rounded panel, text "Ready to talk about your goals?" and the red button "Talk to an Advisor".

Only approved testimonials with consent are used; if none are approved, this band shows the statistics and the CTA only.

### 8.6 Partner logo strip (Reference 5)

Full-width band on `--silver-100`, centred label "Our partners" (small caps, `--muted`). Logos in a single row, greyscale at 70% opacity, **colour and 100% opacity on hover**, height 32px, 56px gaps, auto-scrolling marquee (A14) when more than six logos, static centred row when six or fewer. Each logo has a tooltip label ("Insurance partner", "Broking partner"). Only approved logos with permission are shown.

### 8.7 Home — FAQ and enquiry band

- FAQ: two-column layout (left 4 columns heading and intro, right 8 columns accordion). Accordion items 64px tall closed, a plus icon rotating 45° when opened (A9).
- Enquiry band: navy panel, `--radius-lg`, 2 columns: left copy and contact details, right a white form card (see 10.6).

### 8.8 Footer

Background `--navy-950`, lotus watermark at bottom-right (white, 5%). Layout (desktop, 12 columns):

| Columns | Content                                               |
| ------- | ----------------------------------------------------- |
| 1–4     | Light logo, tagline, short description, social handle |
| 5–7     | Services links                                        |
| 8–9     | Company links                                         |
| 10–12   | Contact: phone, WhatsApp, email, address              |

Below, a full-width divider (silver 18%), then a row: Legal links (Privacy, Terms, Disclosures, Complaints) left, copyright right. **Below that, the global disclaimer** (13px, `#C9CED4`, max 100ch, left-aligned, on every public page):

> Mutual fund investments are subject to market risks, read all scheme related documents carefully. The Net Asset Value (NAV) of schemes can go up or down based on market forces and interest rate changes. Past performance does not guarantee future results, and dividends or payouts depend on distributable surplus availability. Investors must read the Key Information Memorandum (KIM), Scheme Information Document (SID), and Statement of Additional Information (SAI) before investing.

Registration lines (exact wording from the content register) sit between the legal row and the disclaimer. Mobile: columns stack, in this order: logo, contact, services, company, legal, registrations, disclaimer.

### 8.9 About Us

- Page hero (not full height): `--navy-900` band, 360px tall, H1 and breadcrumb, lotus watermark; header in state C or over a 360px photograph in state A.
- Founder split (Reference 5): portrait left, bio right, name H2, designation, two or three credential chips (only verified), a short biography. Kajal Abhilash Chudasama follows the same layout mirrored (portrait right).
- Four value tiles, milestones timeline (horizontal on desktop, vertical on mobile), awards grid (cards with year as a large navy numeral), registrations table, office address with map (map left 7 columns, address card right 5).

### 8.10 Contact Us

Two-column: left (5 columns) contact cards (phone, email, address, WhatsApp), each with an icon circle; right (7 columns) enquiry form card. Map full-width below, height 400px, `--radius-lg`.

### 8.11 Insights

Listing: 3-column article cards (image 16:9, category chip, title, summary, read time). Article page: single column, 720px measure, sticky table of contents on desktop (right, 4 columns), related services block and soft enquiry CTA at the end.

### 8.12 Legal pages, thank-you, 404

- Legal: solid header (state C), H1, "Last updated" caption, 720px reading column, sticky anchor list on desktop.
- Thank-you: centred card, 96px navy circle with a white check that draws in (A16), reference ID in a monospace chip, two links.
- 404: large "404" numeral in `--silver-300` with the lotus watermark, headline, three buttons.

---

## 9. Service pages

### 9.1 Insurance pages (Reference 4)

Applies to General, Life and Health Insurance.

| Order | Block              | Layout and position                                                                                                                                                                                                                   |
| ----- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Page hero          | 480px band, photo behind the header (state A), H1 (the page hero line), lead, one red button "Request a Quote" (label per page), statistic chip (`140+ motor policies`, `180+ life policies`, `250+ health policies`) with as-of date |
| 2     | Overview           | 2 columns: text left (7), a "Key facts" card right (5, silver-100)                                                                                                                                                                    |
| 3     | Categories         | Card grid 3 or 4 columns, icon, title, short text                                                                                                                                                                                     |
| 4     | What to compare    | A checklist panel: 2-column list with navy check icons; Health page has the anchor `#compare`                                                                                                                                         |
| 5     | Insurer partners   | Logo strip (8.6) with relationship labels                                                                                                                                                                                             |
| 6     | How to get a quote | Four-step row (8.4 style)                                                                                                                                                                                                             |
| 7     | FAQs               | Accordion                                                                                                                                                                                                                             |
| 8     | Disclosure note    | Risk note component (10.9): "Insurance is the subject matter of solicitation. Cover depends on the selected policy's terms, conditions, waiting periods and exclusions."                                                              |
| 9     | Enquiry            | Form card with the service preselected                                                                                                                                                                                                |

Imagery: reassuring, natural family and everyday scenes; silver shield motifs as line illustrations; no stock-market imagery.

### 9.2 Mutual Funds (Reference 6 visual)

The visual direction comes from the dashboard-style reference: a large headline figure, colour-coded action cards, a growth chart with tooltip, and goal progress bars, all in the Lotus palette and **all clearly labelled as illustrations**.

| Order | Block                              | Notes                                                                                                                                                                                                                                                  |
| ----- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1     | Hero                               | "Invest with a Goal. Review with a Plan." Photo behind header, state A. Statistic chip: `1,200+ mutual fund folios`.                                                                                                                                   |
| 2     | Registration line                  | "Abhilash Chudasama is an AMFI-registered Mutual Fund Distributor (ARN-160174)" with validity date, in a silver-100 strip                                                                                                                              |
| 3     | Illustration board                 | Navy panel with a large illustrative figure (the SIP calculator result), three action cards (Start a SIP, Invest a lump sum, Review your plan), a line chart and two goal bars. A visible label: **"Illustration only. Not a forecast or guarantee."** |
| 4     | Basics and categories              | Info cards: equity, debt, hybrid, index and ETFs, ELSS (only those offered)                                                                                                                                                                            |
| 5     | SIP vs lump sum                    | Two-column comparison cards                                                                                                                                                                                                                            |
| 6     | SIP calculator (`#sip-calculator`) | Sliders for amount, years and assumed rate; result updates live (A17); assumptions visible; same illustration label                                                                                                                                    |
| 7     | FAQs, disclaimer, enquiry          | As in 9.1; the mutual fund disclaimer is shown in full in a risk note above the form                                                                                                                                                                   |

The 23% equity CAGR is **never** shown on this page or as a hero statistic anywhere.

### 9.3 Equity & Investments

Hero "Understand the Markets. Make Informed Decisions." Statistic chip: `800+ demat accounts`. Blocks: market-risk panel (navy-100 background), broker relationship card (logo, "Authorised Person of Religare Broking Limited", NSE and BSE codes), services list, onboarding steps, FAQs, enquiry. Charts, if used, are clean line charts in navy with a silver grid, labelled "Illustration". No ticker animations, no red/green flashing.

If the 23% CAGR is ever approved (see the content register), it appears **only inside a bordered data card** with period, basis, benchmark and the risk note attached directly beneath, never in a hero or chip.

### 9.4 More Solutions

Card sections per category (Fixed deposits, Bonds, NPS, Market-linked debentures, Real estate, Loans). Each card ends with a risk or terms line. Real estate is hidden until the client and compliance confirm it. Statistics (`₹50 lakh+`, `30+ properties`, `₹15 lakh+`) appear only after their definitions are approved.

---

## 10. Components

### 10.1 Buttons

| Variant              | Background     | Text         | Border                   | Use                         |
| -------------------- | -------------- | ------------ | ------------------------ | --------------------------- |
| Primary              | `--red-600`    | White        | none                     | One main action per section |
| Primary hover        | `--red-700`    | White        | none                     |                             |
| Secondary (light bg) | Transparent    | `--navy-700` | 1.5px `--navy-700`       | Second action               |
| Secondary (dark bg)  | Transparent    | White        | 1.5px white at 70%       | Over photo or navy          |
| Tertiary             | Transparent    | `--navy-600` | none, underline on hover | Inline links with arrow     |
| Disabled             | `--silver-100` | `--muted`    | none                     |                             |

Sizes: **Large 56px** (hero, forms), **Medium 48px** (default), **Small 40px** (tables, cards). Horizontal padding 28px (large), 24px (medium), 16px (small). Radius `--radius-md`. Type: Poppins 600, 16px (15px small). Minimum width 140px. Icon gap 8px. Touch target never under 44px.

States:

- Hover: background step, `translateY(-1px)`, 200ms.
- Active: `translateY(0)`, background `--red-700`.
- Focus-visible: 3px outline `--navy-600` with 3px offset on light, white on dark.
- Loading: label replaced by a 18px spinner, width locked.

### 10.2 Cards

- Resting: white, 1px `--silver-300` border, `--radius-md`, padding 24 to 32px, no shadow.
- Hover (interactive cards only): `translateY(-4px)`, border `--navy-700` at 28% opacity, elevation 1, 240ms.
- Dark card (on navy): `--navy-800`, 1px `rgba(215,217,220,0.16)` border.
- Statistic chip: height 40, padding 0 16px, `--silver-100` background, number in Poppins 700 navy, label in Inter 14px `--muted`.

### 10.3 Statistic block

Number (Stat style, navy or white on dark), label below (Inter 15px), as-of caption (13px). Separators are 1px silver. Statistics render only when `approval_status = approved` and an as-of date exists; otherwise the block collapses and the grid re-flows (no empty slots).

### 10.4 Navigation components

- Links: Inter 500, 15px, uppercase not used. Hover: colour to `--silver-300`, underline 2px `--red-500` grows from the left (A4).
- Breadcrumbs: 14px, `--muted`, "›" separators, current page in `--ink`.
- Footer links: `#C9CED4`, hover white.

### 10.5 Icons

Line icons (Lucide set), **1.5px stroke, round caps**, sizes 20, 24, 28, 40. Navy by default, white on dark. Icon circles: 48 to 56px, `--silver-100` background; on card hover the circle turns navy and the icon white (200ms). Silver shield motif: an outlined shield in `--silver-300` used as a decorative background element in insurance sections, 8% opacity.

### 10.6 Forms

- Label above field: Inter 600, 14px, `--ink`. Required marker "\*" in `--red-500`.
- Field: height **52px**, padding 0 16px, `--radius-md`, 1px `--silver-500` border, white background, 16px text (prevents mobile zoom). Textarea min-height 120px.
- Focus: border `--navy-600`, ring `0 0 0 4px rgba(27,79,130,0.20)`, 160ms.
- Error: border `--danger`, ring `rgba(180,35,24,0.18)`, message below in `--danger` with an icon, 14px. Success tick appears after valid input (optional).
- Helper text: 13px `--muted`.
- Service select: custom dropdown, 44px options, preselected from the page.
- Contact method: three radio cards (Phone, WhatsApp, Email) 48px tall, selected card navy border and navy-100 background.
- Consent: checkbox 24px with the privacy link; the submit button is disabled until ticked.
- Submit: Primary large, full width on mobile. Loading, then success transition to `/enquiry/thank-you`.
- Honeypot field hidden from users; rate-limit and spam protection handled by the API.

### 10.7 Tables (admin and public)

Header row `--silver-100`, 13px uppercase 600 `--muted`; rows 56px; row hover `--navy-100` at 50%; 1px silver row dividers; sticky header; numeric columns right-aligned with tabular figures. Mobile: tables become stacked cards.

### 10.8 Badges and chips

Status badges (pill, 28px tall, 13px 600): New (red-tint `#FDE8EA` with `--red-600` text), Contacted (navy-100 with navy), Qualified (`#E3F1E6` with `--success`), In Progress (`#FFF1D6` with `--warning`), Converted (navy solid with white), Closed (silver-100 with muted). Each has a small leading dot; colour is never the only signal (text label always present).

### 10.9 Risk note

Silver-100 background, 3px navy left border, 20px info icon, text 14 to 15px `--ink`, padding 20px, `--radius-md`. Placed directly beneath any performance, calculator, chart or investment-product content. Never collapsed by default.

### 10.10 Toasts, modals, tooltips

- Toast: bottom-center (mobile) or bottom-right (desktop), 24px from edges, white, elevation 2, 4px left border by type, auto-dismiss 5s, pausable on hover.
- Modal: centred, max 560px, `--radius-lg`, backdrop `rgba(7,27,48,0.60)`, focus trapped, Esc closes.
- Tooltip: navy-900, white 13px, `--radius-sm`, 8px offset, delay 300ms.

### 10.11 WhatsApp floating button

Fixed bottom-right, 24px from the edges (plus safe-area), 56px circle, brand-neutral navy with a white WhatsApp glyph (not green), elevation 1. Shown only after the client confirms the official WhatsApp number. Never overlaps the cookie banner or the mobile pinned CTA.

---

## 11. Admin dashboard (Reference 7, our proposed layout)

Distinct from the public site: denser, calmer, no photography, and light motion. Palette: navy sidebar, `--silver-100` canvas, white cards, red used for the one primary action and urgent counts.

### 11.1 Frame and positioning

| Region                | Position and size                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Sidebar               | Fixed left, width **248px** (collapsed **72px** icons only), full height, `--navy-900`, light logo at top (64px high), nav items 44px tall |
| Top bar               | Sticky, height **64px**, white, 1px silver bottom border; contains page title, search (480px max), notification bell, profile menu         |
| Content               | Margin-left equal to the sidebar width, padding 32px, max-width 1440px, 12-column grid, gap 24px                                           |
| Mobile (under 1024px) | Sidebar becomes an off-canvas drawer; top bar shows menu button, title and profile; content padding 16px                                   |

Sidebar items: icon 20px, label 15px; active item has a `--navy-700` fill, a 3px `--red-500` bar on its left edge and white text; hover `rgba(255,255,255,0.08)`. Order and routes as defined in the site structure document (Dashboard, Enquiries & Leads, Follow-ups, Reports, Page Content, FAQs, Team & Contacts, Partners & Awards, Testimonials, Insights, Media Library, Users & Roles, Audit Log). Items the role cannot access are not rendered.

### 11.2 Dashboard grid

| Row | Content                                                                                                     | Columns       |
| --- | ----------------------------------------------------------------------------------------------------------- | ------------- |
| 1   | Four summary cards: New enquiries this month, Follow-ups due today, Converted this month, Awaiting review   | 3 + 3 + 3 + 3 |
| 2   | Line chart "Enquiries by month" (filter by service) and bar list "Enquiries by service"                     | 8 + 4         |
| 3   | "Pending follow-ups" counter card (large number, Review button), "Lead conversion" progress bars by service | 4 + 8         |
| 4   | "Latest enquiries" table with status, assignee, follow-up date                                              | 12            |

Summary card: white, `--radius-md`, 1px silver border, 4px top accent (red for the main metric, navy for others), label 14px `--muted`, number 36px Poppins 700, trend line 13px. The "Follow-ups due" card turns red-tinted when overdue items exist.

Charts: navy line (2px), 10% navy area fill, silver grid lines, red marker for the current month, tooltip dark navy. Bars: navy, with the leading bar red. Axis text 12px `--muted`. Every chart has a text summary for screen readers and a data table toggle.

### 11.3 Leads, content and media screens

- **Leads list:** filter bar (service, status, assignee, dates, search) above a table; bulk action bar slides up from the bottom when rows are selected; export button (permission-controlled). Detail screen: two columns, left (8) lead info, status stepper (New → Contacted → Qualified → In Progress → Converted/Closed), notes timeline; right (4) assignment, follow-up scheduler, activity log.
- **Content editor:** left page list, centre editor with draft/published toggle and a persistent "Preview" button, right panel for SEO fields (title, description, social image). A yellow-free "Draft" indicator uses navy-100 with the text "Draft"; "Published" uses success tint.
- **Media library:** grid of 160px thumbnails, upload dropzone with dashed silver border turning navy on drag-over.
- **Role-based visuals:** disabled features show a lock icon with a tooltip "Administrators only"; staff never see admin-only menu entries.

### 11.4 Admin states

Skeleton loaders for cards and tables, empty states with an icon and one action, error banners (danger border, icon, retry), session-expiry modal before logout.

---

## 12. Animation system

### 12.1 Principles

1. Motion explains, it does not entertain: it shows where something came from, what changed, or what is interactive.
2. Calm and premium: slow, soft easing, small distances. No bouncing, no spinning, no flashing.
3. Fast for UI feedback (under 250ms), slower for page and section reveals (400 to 700ms).
4. Animate only `transform` and `opacity` (GPU-friendly), plus `background-color` and `border-color` for hovers. Never animate layout properties (`width`, `height`, `top`) on large elements, except accordion height via grid rows or `max-height`.
5. Everything respects `prefers-reduced-motion` (see 12.4).

### 12.2 Motion tokens

```css
:root {
  --dur-instant: 80ms;
  --dur-fast: 160ms;
  --dur-base: 240ms;
  --dur-slow: 400ms;
  --dur-slower: 640ms;
  --dur-count: 1600ms;

  --ease-standard: cubic-bezier(
    0.22,
    1,
    0.36,
    1
  ); /* default: soft deceleration */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

  --reveal-distance: 24px;
  --stagger: 80ms;
}
```

### 12.3 Animation catalogue

Each entry gives the trigger, the effect, timing and the reduced-motion fallback.

| ID      | Element                                          | Trigger                                                                                                       | Effect                                                                                                                                                                                                                               | Duration, easing, delay                                                                                             | Reduced motion                              |
| ------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| **A1**  | Page load: hero content                          | On first paint                                                                                                | Eyebrow, H1 (line by line), lead, buttons fade up in sequence: `opacity 0→1`, `translateY(24px→0)`                                                                                                                                   | 640ms `--ease-standard`; stagger 100ms starting at 150ms (eyebrow 150, H1 lines 250/350/450, lead 600, buttons 750) | Fade only, 200ms, no movement               |
| **A2**  | Hero photograph                                  | On first paint                                                                                                | Slow settle: `scale(1.06→1)` and `opacity 0→1`                                                                                                                                                                                       | 1400ms `--ease-standard`                                                                                            | Static image, fade 200ms                    |
| **A3**  | Hero parallax                                    | Scroll within the hero                                                                                        | Image moves `translate3d(0, 0→40px, 0)` over the hero's height; scrim unchanged                                                                                                                                                      | Linear, tied to scroll, throttled by rAF                                                                            | Disabled; also disabled below 768px         |
| **A4**  | Nav link hover                                   | Pointer hover / focus                                                                                         | Colour change and a 2px red underline growing from the left (`scaleX 0→1`, origin left)                                                                                                                                              | 200ms `--ease-standard`                                                                                             | Underline appears instantly                 |
| **A5**  | Header state change                              | `scrollY` crosses 24px                                                                                        | Background, border, height (88→72) and logo width (180→150) transition from state A to B                                                                                                                                             | 240ms `--ease-standard`                                                                                             | Instant swap                                |
| **A6**  | Services dropdown                                | Hover/focus on "Services" (150ms intent delay) or click                                                       | Panel `opacity 0→1`, `translateY(8px→0)`, scale 0.98→1, origin top left; closes on outside click, Esc or leaving after 200ms                                                                                                         | Open 200ms, close 140ms `--ease-standard`                                                                           | Opacity only                                |
| **A7**  | Mobile menu                                      | Menu button                                                                                                   | Panel slides from right (`translateX(100%→0)`), backdrop fades to 60%; list items rise and fade with 40ms stagger starting at 120ms; button icon morphs bars to ✕                                                                    | 320ms `--ease-standard`                                                                                             | Panel appears with a 150ms fade, no stagger |
| **A8**  | Scroll reveal (sections, cards, tiles, images)   | Element enters viewport (IntersectionObserver, threshold 0.15, root margin `0px 0px -10% 0px`, **once only**) | `opacity 0→1`, `translateY(24px→0)`; cards in a grid stagger by 80ms (max 6 steps, then 0)                                                                                                                                           | 560ms `--ease-standard`                                                                                             | No animation; content visible immediately   |
| **A9**  | FAQ accordion                                    | Click / Enter / Space                                                                                         | Panel height expands (grid-template-rows 0fr→1fr), content fades in; plus icon rotates 45° (to ✕); only one open at a time optional                                                                                                  | 320ms `--ease-standard`; icon 240ms                                                                                 | Instant expand, no rotate                   |
| **A10** | Card hover                                       | Hover / focus-within (pointer devices only)                                                                   | `translateY(-4px)`, border to navy 28%, elevation 1; icon circle fills navy and icon turns white; "→" shifts `translateX(4px)`                                                                                                       | 240ms `--ease-standard`                                                                                             | Border and colour change only               |
| **A11** | Button hover and press                           | Hover / press                                                                                                 | Hover: background step and `translateY(-1px)`; press: `translateY(0)` and `scale(0.99)`; arrow icon shifts 4px                                                                                                                       | 160ms `--ease-standard`                                                                                             | Colour change only                          |
| **A12** | Statistic count-up                               | Statistic enters viewport, once                                                                               | Number counts from 0 to the approved value with ease-out; the "+" and unit appear at the end; caption fades in 200ms after                                                                                                           | 1600ms `--ease-out`; stagger 120ms between statistics                                                               | Final value shown immediately               |
| **A13** | Floating testimonial cards (customer-count band) | Band in view                                                                                                  | Each card fades and rises on entry (A8), then drifts continuously: `translateY(0 ↔ -10px)` on an alternating loop, each card with a different period (7s, 8.5s, 10s) and delay; pauses on hover; **stops entirely while off-screen** | Loop `--ease-in-out`, `infinite alternate`                                                                          | Static positions, no drift                  |
| **A14** | Partner logo marquee                             | Strip in view                                                                                                 | Track scrolls left at **40px/s**, seamless loop (content duplicated); pauses on hover and focus; grey to colour on hover                                                                                                             | Linear, infinite                                                                                                    | Static, horizontally scrollable row         |
| **A15** | Section divider and lotus watermark              | Section enters viewport                                                                                       | Watermark fades in (`opacity 0→0.06`) and drifts `translateY(24px→0)`; silver divider line draws (`scaleX 0→1`, origin left)                                                                                                         | 800ms `--ease-standard`                                                                                             | Static                                      |
| **A16** | Enquiry success                                  | After a successful API response                                                                               | Circle scales in (`0.8→1`, fade); check mark stroke draws (`stroke-dashoffset`); heading and reference fade up with 120ms stagger                                                                                                    | Circle 320ms, check 480ms starting at 200ms                                                                         | Static final state                          |
| **A17** | SIP calculator result and chart                  | Slider or input change                                                                                        | Result number tweens to the new value (300ms, ease-out); chart line morphs between states (400ms); a short highlight pulse on the result (background navy-100 fading out, 600ms)                                                     | As stated                                                                                                           | Values update instantly                     |
| **A18** | Form validation                                  | Blur or submit                                                                                                | Error message fades and drops in (`translateY(-4px→0)`, 160ms); invalid field gives a single 6px horizontal shake (240ms) on submit only; valid check fades in                                                                       | 160 to 240ms                                                                                                        | No shake; message fades only                |
| **A19** | Focus ring                                       | Keyboard focus                                                                                                | Ring fades in                                                                                                                                                                                                                        | 120ms                                                                                                               | Instant                                     |
| **A20** | Route transition                                 | Navigating between pages                                                                                      | Outgoing content fades to 0 (120ms), new page fades in with `translateY(8px→0)` (260ms); scroll resets to top; header state recalculated                                                                                             | 120ms out, 260ms in `--ease-standard`                                                                               | Instant swap                                |
| **A21** | Skeleton loading                                 | Data pending (admin, insights)                                                                                | Silver-100 blocks with a soft shimmer sweeping left to right (gradient 200% wide)                                                                                                                                                    | 1400ms linear, infinite                                                                                             | Static blocks                               |
| **A22** | Toast                                            | Show / dismiss                                                                                                | Slide up 16px and fade in; dismiss fades out                                                                                                                                                                                         | In 240ms, out 160ms                                                                                                 | Fade only                                   |
| **A23** | Modal                                            | Open / close                                                                                                  | Backdrop fades 200ms; dialog `opacity 0→1`, `scale(0.96→1)`, `translateY(8px→0)`                                                                                                                                                     | 240ms `--ease-standard`                                                                                             | Fade only                                   |
| **A24** | Back-to-top / scroll cue                         | Hero scroll cue (optional)                                                                                    | A small chevron bobs `translateY(0→6px)` on a 2s loop at the hero bottom centre; hidden once scrolled                                                                                                                                | 2000ms `--ease-in-out`, infinite                                                                                    | Hidden                                      |
| **A25** | Admin sidebar collapse                           | Toggle                                                                                                        | Width 248→72px, labels fade out first (120ms) then width changes; reverse on expand                                                                                                                                                  | 240ms `--ease-standard`                                                                                             | Instant                                     |
| **A26** | Admin chart draw                                 | Dashboard load, chart visible                                                                                 | Line draws left to right (`stroke-dashoffset`), area fades in after, bars grow from baseline with 60ms stagger; tooltip fades on hover                                                                                               | Line 800ms, bars 500ms `--ease-out`                                                                                 | Final chart shown instantly                 |
| **A27** | Admin row and status changes                     | Status updated, row added or removed                                                                          | Updated row background flashes `--navy-100` fading over 1200ms; removed rows collapse height 240ms; bulk bar slides up 240ms                                                                                                         | As stated                                                                                                           | Colour flash only                           |
| **A28** | Admin counters                                   | Dashboard load                                                                                                | Summary numbers count up (as A12, 1000ms)                                                                                                                                                                                            | 1000ms `--ease-out`                                                                                                 | Instant                                     |
| **A29** | Tabs and segmented controls                      | Selection change                                                                                              | Active underline or pill slides to the new position (`transform`, 240ms); panel content cross-fades 160ms                                                                                                                            | 240ms `--ease-standard`                                                                                             | Instant                                     |
| **A30** | Image load                                       | Image decoded                                                                                                 | Blur-up: low-quality placeholder fades to the sharp image                                                                                                                                                                            | 400ms `--ease-out`                                                                                                  | Instant                                     |

**Not allowed:** auto-playing carousels that advance on a timer, bouncing or elastic easing, parallax on text, scroll-jacking, flashing market tickers, red/green pulsing numbers, looping animation on more than two elements in the same viewport, animation that delays access to content or a form by more than 800ms.

### 12.4 Reduced motion and performance

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

- Looping animations (A13, A14, A21, A24) stop when off-screen and when `document.hidden`.
- Reveal and count-up run **once per page view**.
- Keep total JavaScript for motion under 15 KB; prefer CSS and IntersectionObserver. Framer Motion, if used, is lazy-loaded for the SIP calculator and admin charts only.
- Pointer-only effects (hover lifts) are wrapped in `@media (hover: hover)`.
- Cumulative Layout Shift stays under 0.1: reserve space for images and statistics; reveal uses transforms, not layout.
- No animation starts until the page is interactive; hero animation A1 begins on `DOMContentLoaded`.

### 12.5 Reference implementation

```css
/* Scroll reveal */
[data-reveal] {
  opacity: 0;
  transform: translateY(var(--reveal-distance));
  transition:
    opacity var(--dur-slower) var(--ease-standard),
    transform var(--dur-slower) var(--ease-standard);
  transition-delay: calc(var(--i, 0) * var(--stagger));
}
[data-reveal].is-visible {
  opacity: 1;
  transform: none;
}

/* Nav link underline */
.nav-link {
  position: relative;
}
.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -8px;
  height: 2px;
  background: var(--red-500);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--dur-base) var(--ease-standard);
}
.nav-link:hover::after,
.nav-link[aria-current="page"]::after {
  transform: scaleX(1);
}

/* Card hover */
@media (hover: hover) {
  .card--interactive {
    transition:
      transform var(--dur-base) var(--ease-standard),
      border-color var(--dur-base),
      box-shadow var(--dur-base);
  }
  .card--interactive:hover {
    transform: translateY(-4px);
    border-color: rgba(18, 61, 103, 0.28);
    box-shadow: 0 6px 20px rgba(10, 37, 64, 0.08);
  }
}

/* Marquee */
.marquee__track {
  display: flex;
  width: max-content;
  animation: marquee 40s linear infinite;
}
.marquee:hover .marquee__track {
  animation-play-state: paused;
}
@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}

/* Floating testimonial card */
@keyframes float {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-10px);
  }
}
.float-card {
  animation: float var(--float-period, 8s) var(--ease-in-out) infinite alternate;
  animation-delay: var(--float-delay, 0s);
}

/* Skeleton */
.skeleton {
  background: linear-gradient(90deg, #f3f5f7 25%, #e6edf5 50%, #f3f5f7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s linear infinite;
}
@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}
```

```js
// useCountUp: eased count from 0 to value, once, when visible
function useCountUp(ref, value, duration = 1600) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.textContent = format(value);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min((t - t0) / duration, 1),
            eased = 1 - Math.pow(1 - p, 3);
          el.textContent = format(Math.round(value * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
}
```

---

## 13. Photography and imagery

| Rule             | Detail                                                                                                                                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Subjects         | Real Lotus Capital team and founder, local Godhra and Gujarat families, advisors speaking with clients; no generic handshake stock                                                                                 |
| Light and colour | Natural, soft light; backgrounds in understated navy, grey or warm neutral; avoid saturated colour clashes with navy and red                                                                                       |
| Founder portrait | 4:5, head and shoulders to mid-thigh, eye-level, soft key light, neutral or navy background, relaxed professional pose, formal attire; consistent treatment for all team portraits; delivered at 1600×2000 minimum |
| Hero photos      | Landscape 16:9, minimum 2400×1350; subject placed in the right 40% of frame; left 60% calm for text                                                                                                                |
| Treatment        | Apply the navy scrim in CSS (not baked into the file); do not add colour filters; keep skin tones natural                                                                                                          |
| Formats          | AVIF and WebP with JPEG fallback; `srcset` at 480, 768, 1200, 1600, 2400px; `loading="lazy"` except the hero (`fetchpriority="high"`)                                                                              |
| Alt text         | Descriptive and specific; decorative images use `alt=""`                                                                                                                                                           |
| Illustrations    | Thin-line silver shield, lotus and chart motifs only; 1.5px stroke; no 3D, no gradients                                                                                                                            |
| Not allowed      | Cash and gold imagery, rising-arrow-with-coins clichés, exaggerated wealth, copyrighted or borrowed reference imagery, AI-generated people presented as real clients or staff                                      |

---

## 14. Responsive rules

| Area          | Mobile (< 768)                                                                                                                         | Tablet (768–1023)                                  | Desktop (≥ 1024)                      |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------- |
| Header        | 64px, logo mark and short wordmark, menu button                                                                                        | 72px, logo and menu button                         | 88px, full navigation                 |
| Hero          | Content bottom-aligned, scrim vertical, buttons stacked full width, image `object-position: 60% center`, stat card 2×2 inside the hero | Content left, 8 columns, stat card centred overlap | Content left, 7 columns, overlap card |
| Service cards | 1 column                                                                                                                               | 2 columns                                          | 3 columns                             |
| Statistics    | 2×2                                                                                                                                    | 4 across, smaller                                  | 4 across                              |
| Testimonials  | Scroll-snap carousel                                                                                                                   | 2 floating, 2 in row                               | 6 floating                            |
| Founder split | Stacked, portrait first                                                                                                                | 5/7 split                                          | 5/7 split                             |
| Footer        | Stacked                                                                                                                                | 2 columns                                          | 4 zones                               |
| Forms         | Full width, 52px fields                                                                                                                | Card 520px wide                                    | Card inside 2-column layout           |
| Admin         | Off-canvas sidebar, card tables                                                                                                        | Collapsed sidebar                                  | Full sidebar                          |
| Hover effects | None (tap states only)                                                                                                                 | Pointer-dependent                                  | Enabled                               |

Other rules: design mobile first; no horizontal scroll at any width from 320px; touch targets at least 44×44px with 8px spacing; sticky mobile CTA bar ("Talk to an Advisor", 56px, `--red-600`) appears after the hero scrolls out of view on service pages and hides near the footer; fixed elements respect `env(safe-area-inset-*)`; test at 320, 375, 414, 768, 1024, 1280 and 1536px.

---

## 15. Accessibility and interaction states

- **Standard:** WCAG 2.1 AA minimum for all public pages and the admin panel.
- **Contrast:** use only the pairs listed in 3.4. Red button text must use `--red-600`. Do not place brand red text under 18.66px bold on white.
- **Keyboard:** every interactive element is reachable and operable; visible focus ring on all controls (3px, 3px offset, navy on light, white on dark); skip link; logical tab order; dropdowns open with Enter/Space/Arrow keys and close with Esc.
- **Semantics:** one `<h1>`, landmarks (`header`, `nav`, `main`, `footer`), `aria-current="page"` on active links, `aria-expanded` on menus and accordions, `aria-live="polite"` for form messages and toasts, labelled form fields, `autocomplete` attributes (`name`, `tel`, `email`).
- **Colour independence:** status and errors use icon plus text, not colour alone.
- **Motion:** see 12.4. No content is conveyed only through animation.
- **Text:** supports 200% zoom and text-spacing overrides; line length 60 to 70 characters; no text in images.
- **Charts and calculators:** text alternative and data table; calculator inputs labelled with units and assumptions.
- **Language:** `lang="en"` with Gujarati sections marked `lang="gu"`.

### Interaction states for every interactive component

| State            | Treatment                                                                         |
| ---------------- | --------------------------------------------------------------------------------- |
| Default          | As specified                                                                      |
| Hover            | Background or border step, 160–240ms (pointer devices only)                       |
| Focus-visible    | 3px ring, 3px offset                                                              |
| Active / pressed | One step darker, no lift                                                          |
| Disabled         | `--silver-100` background, `--muted` text, `cursor: not-allowed`, `aria-disabled` |
| Loading          | Spinner in place of label, width locked, `aria-busy="true"`                       |
| Error            | `--danger` border, icon and message                                               |
| Success          | `--success` tint, check icon, message                                             |
| Selected         | `--navy-100` background with navy border and a check or filled indicator          |

---

## 16. Consistency rules

1. **One source of tokens.** Colours, spacing, radii, shadows, durations and easings come only from the CSS variables in this document. No hard-coded hex values in components.
2. **One primary action per section**, red, and one red button per viewport where possible.
3. **Same layout, same position:** headers, footers, enquiry forms, service cards and statistic blocks are shared components; pages do not restyle them.
4. **Statistics and disclaimers are data-driven.** They render from the CMS with approval status and as-of date; no numbers typed into page code. The footer disclaimer appears on every public page.
5. **Risk and "illustration" labels travel with the content** they qualify (calculators, charts, any performance figure).
6. **Dark sections alternate with light sections** (no more than two dark bands between hero and footer on a page, besides the footer).
7. **Photography and portrait treatment** is consistent across the site (aspect ratios, lighting, background).
8. **Motion budget:** at most two continuous animations in a viewport; reveal and count-up run once.
9. **Content before decoration:** if a decorative element hurts readability, performance or contrast, remove it.
10. **Admin never inherits marketing flourishes:** no parallax, floating cards or marquee in the admin.

---

## 17. Implementation tokens

```css
:root {
  /* Colour */
  --navy-950: #071b30;
  --navy-900: #0a2540;
  --navy-800: #0e3154;
  --navy-700: #123d67;
  --navy-600: #1b4f82;
  --navy-100: #e6edf5;
  --silver-300: #d7d9dc;
  --silver-100: #f3f5f7;
  --silver-500: #8a949d;
  --white: #ffffff;
  --red-300: #ff6b76;
  --red-500: #e92332;
  --red-600: #c81b29;
  --red-700: #a91621;
  --ink: #1f2933;
  --muted: #5b6770;
  --success: #1e7f4f;
  --warning: #9a6700;
  --danger: #b42318;

  /* Type */
  --font-heading: "Poppins", system-ui, "Noto Sans Gujarati", sans-serif;
  --font-body: "Inter", system-ui, "Noto Sans Gujarati", sans-serif;

  /* Layout */
  --container: 1240px;
  --header-h: 88px;
  --header-h-scrolled: 72px;
  --sidebar-w: 248px;
  --sidebar-w-collapsed: 72px;
  --topbar-h: 64px;

  /* Shape and elevation */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-pill: 999px;
  --shadow-1: 0 6px 20px rgba(10, 37, 64, 0.08);
  --shadow-2: 0 16px 40px rgba(10, 37, 64, 0.14);

  /* Focus */
  --focus-ring: 0 0 0 3px #fff, 0 0 0 6px var(--navy-600);
}
@media (max-width: 1023px) {
  :root {
    --header-h: 72px;
    --header-h-scrolled: 64px;
  }
}
@media (max-width: 767px) {
  :root {
    --header-h: 64px;
    --header-h-scrolled: 56px;
  }
}
```

Tailwind mapping (if used): extend `colors` with `navy`, `silver`, `red`, `ink`, `muted`; `fontFamily.heading` and `fontFamily.body`; `borderRadius` with `sm`, `md`, `lg`; `boxShadow` with `card`, `overlay`; `maxWidth.container = 1240px`; `screens` with `sm 480`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.

---

## 18. Delivery checklist

- [ ] Logo SVGs supplied: light, dark and mark-only variants.
- [ ] Hero, founder and team photography supplied or scheduled; portrait crops prepared.
- [ ] Fonts licensed and self-hosted (Poppins, Inter, Noto Sans Gujarati).
- [ ] Tokens implemented once and used everywhere.
- [ ] Header states A–D built and tested over the hero photo, on mobile and with the menu open.
- [ ] Hero scrim verified for contrast over every hero image.
- [ ] All 30 animations built to the catalogue, with reduced-motion behaviour.
- [ ] Statistic blocks render only for approved figures with an as-of date.
- [ ] Footer disclaimer present on every public page.
- [ ] Risk note present with every calculator, chart and investment product block.
- [ ] Contrast, keyboard and screen reader checks passed.
- [ ] Responsive checks passed at 320, 375, 414, 768, 1024, 1280, 1536px.
- [ ] Admin dashboard built to section 11 with role-based visibility.
- [ ] Lighthouse targets: Performance ≥ 90 mobile, Accessibility ≥ 95, CLS < 0.1.
