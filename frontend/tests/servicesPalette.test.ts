import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Services Hub (v2) Brand Palette & Content Compliance', () => {
  const serviceFiles = [
    'src/pages/public/Services.tsx',
    'src/components/services/ServicesLineupBoard.tsx',
    'src/components/services/ServicesStackedDeck.tsx',
  ];

  // Whitelist of allowed brand hex colours:
  // Lotus Navy shades, Brand Red, Pure White, Silver/Neutral greys and Ink.
  const ALLOWED_BRAND_HEX_WHITELIST = new Set([
    '#051329', // deep midnight navy
    '#071b30', // darker navy shade
    '#0a2540', // rich navy
    '#0d2b4a', // navy accent
    '#0e3154', // navy mid
    '#123d67', // primary brand navy
    '#1b4f82', // navy light
    '#e6edf5', // soft navy tint
    '#eaf1f8', // pale ice navy tint
    '#ffffff', // pure white
    '#fff',
    '#d7d9dc', // brand silver border
    '#e2e8f0', // silver slate light
    '#e9ecef', // silver grey
    '#cbd5e1', // slate border
    '#f3f5f7', // silver background
    '#f8f9fa', // silver soft tint
    '#8a949d', // silver mid
    '#5b6770', // muted slate
    '#1f2933', // body ink
    '#000000', // black
    '#000',
    '#e92332', // brand red primary
    '#c81b29', // brand red active
    '#d9232d', // brand red
    '#b91c1c', // brand red dark
  ]);

  const FORBIDDEN_THEME_ACCENTS = [
    { name: 'teal', hex: '#1f6f8b' },
    { name: 'care-green', hex: '#1e8e6e' },
    { name: 'ledger-gold', hex: '#b7893a' },
    { name: 'warm-ivory', hex: '#fbf5e9' },
    { name: 'mint-tint', hex: '#e6f5ef' },
    { name: 'purple', hex: '#7c3aed' },
  ];

  it('contains ONLY approved Lotus Capital brand hex colors', () => {
    serviceFiles.forEach((relPath) => {
      const fullPath = path.resolve(__dirname, '..', relPath);
      const content = fs.readFileSync(fullPath, 'utf8');
      const hexMatches = content.match(/#[0-9a-fA-F]{3,8}/g) || [];

      hexMatches.forEach((hex) => {
        const lower = hex.toLowerCase();
        expect(
          ALLOWED_BRAND_HEX_WHITELIST.has(lower),
          `File ${relPath} contains non-brand hex color "${hex}". Services Hub must strictly use brand palette only.`
        ).toBe(true);
      });
    });
  });

  it('contains zero forbidden service theme accents (teal, green, gold, ivory, purple)', () => {
    serviceFiles.forEach((relPath) => {
      const fullPath = path.resolve(__dirname, '..', relPath);
      const content = fs.readFileSync(fullPath, 'utf8').toLowerCase();

      FORBIDDEN_THEME_ACCENTS.forEach(({ name, hex }) => {
        expect(
          content.includes(hex),
          `File ${relPath} contains forbidden theme accent ${name} (${hex}).`
        ).toBe(false);
      });
    });
  });

  it('contains NO emoji icons in markup or data', () => {
    const forbiddenEmojis = ['🚗', '🛡️', '🏥', '📈', '📊', '🏛️', '💰', '💼'];

    serviceFiles.forEach((relPath) => {
      const fullPath = path.resolve(__dirname, '..', relPath);
      const content = fs.readFileSync(fullPath, 'utf8');

      forbiddenEmojis.forEach((emoji) => {
        expect(
          content.includes(emoji),
          `File ${relPath} should not contain emoji "${emoji}". Use consistent SVG line icons instead.`
        ).toBe(false);
      });
    });
  });

  it('has all 6 practice areas from 03-services.md with verified statistics', () => {
    const deckPath = path.resolve(__dirname, '../src/components/services/ServicesStackedDeck.tsx');
    const lineupPath = path.resolve(__dirname, '../src/components/services/ServicesLineupBoard.tsx');
    const deckContent = fs.readFileSync(deckPath, 'utf8');
    const lineupContent = fs.readFileSync(lineupPath, 'utf8');

    const expectedServices = [
      'General Insurance',
      'Life Insurance',
      'Health Insurance',
      'Mutual Funds',
      'Equity & Investments',
      'More Solutions',
    ];

    expectedServices.forEach((serviceName) => {
      expect(deckContent).toContain(serviceName);
      expect(lineupContent).toContain(serviceName);
    });

    // Check descriptors from 03-services.md
    expect(deckContent).toContain('Understand cover for your vehicle, property and business.');
    expect(deckContent).toContain('Understand life cover options and policy features.');
    expect(deckContent).toContain('Compare features, exclusions, waiting periods and claims process.');
    expect(deckContent).toContain('Learn about fund categories, time horizons, costs and market risk.');
    expect(deckContent).toContain('Understand demat, trading and IPO access, and equity market risk.');
    expect(deckContent).toContain('Ask about fixed deposits, bonds, NPS and related services.');

    // Check verified stat chips
    expect(deckContent).toContain('140+ motor policies');
    expect(deckContent).toContain('180+ life policies');
    expect(deckContent).toContain('250+ health policies');
    expect(deckContent).toContain('1,200+ mutual fund folios');
    expect(deckContent).toContain('800+ demat accounts');
    expect(deckContent).toContain('₹50 lakh+ in corporate FDs');
  });
});

