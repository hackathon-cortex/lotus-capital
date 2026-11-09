# Lotus Capital — Frontend

Official frontend application and backoffice admin panel for **Lotus Capital**, a premier financial services consultancy in Godhra, Gujarat (offering Insurance, Mutual Funds, Equity Broking as an Authorised Person, Fixed Deposits, Bonds, and allied wealth advisory).

**Stack:** React 18, Vite 5, TypeScript 5, React Router 6, Vitest, CSS3 Custom Properties (Brand Design System).

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Run test suite (181 tests across 17 suites)
npm test

# Production build
npm run build

# Code linting
npm run lint
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Launch local Vite development server on port 5173 |
| `npm run build` | TypeScript compile (`tsc`) followed by optimized production Vite bundle |
| `npm test` | Run Vitest unit & integration test suites (181 tests) |
| `npm run lint` | ESLint verification with zero warning allowance |
| `npm run preview` | Locally preview production build |
| `npm run format` | Code formatting with Prettier |

---

## Project Structure

```
├── content/              # Regulatory, SEO, milestones, partner, and page content JSON
│   ├── data/             # Site data, FAQs, statistics, partners, registrations
│   └── pages/            # Legal pages & route-specific content
├── public/               # Static assets, SVG icons, fonts, and imagery
│   ├── assets/           # Brand emblems, partner logos, avatar assets
│   ├── fonts/            # Felix Titling and brand typography
│   └── images/           # High-resolution hero visuals and media
├── src/                  # React TypeScript source code
│   ├── api/              # API clients and HTTP abstractions
│   ├── components/       # UI components (Admin, Enquiry, Nav, Insurance, Investments)
│   ├── config/           # Breakpoints, navigation, and pinned stage configurations
│   ├── context/          # ContactDrawer and Auth contexts
│   ├── guards/           # Route guards (RequireAuth, RequireRole)
│   ├── hooks/            # Custom hooks (breakpoints, counter animations, media queries)
│   ├── layouts/          # Admin, Legal, and Public layouts
│   ├── pages/            # Public & Admin route components
│   ├── routes/           # Declarative React Router route definitions
│   └── styles/           # CSS modules, design tokens, and global typography
└── tests/                # Vitest test suites (181 test cases)
```

---

## Brand & Compliance Rules

- **Brand Palette:** Strictly Navy (`#123D67` with tints), White, Silver, and Brand Red (`#D13227`).
- **Typography:** Bodoni Moda (hero headline), Felix Titling (Lotus Capital brand wordmark), Poppins & Inter (content & body).
- **Stat Verification:** Only approved and verified statistics render in production mode.
- **SEBI/AMFI Compliance:** Disclaimer blocks and ARN/AP registration details are rendered on all financial routes.
