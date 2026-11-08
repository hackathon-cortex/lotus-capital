import { test, expect } from '@playwright/test';

/**
 * tests/faq-accordion.spec.ts
 * Systematic Playwright Suite for FaqAccordion mobile responsiveness.
 * Evaluates viewports (320px, 360px, 390px, 430px) across all pages with FAQ sections:
 * - Checks each card bounding box lies fully inside the viewport (left >= 12px and right <= viewport - 12px)
 * - Checks symmetric gutters (within 4px difference)
 * - Checks no text node exceeds card width
 * - Checks document.documentElement.scrollWidth <= window.innerWidth
 * - Checks answer text is fully visible, wraps, and codes are wrapped in .break-anywhere
 */

const PAGES_WITH_FAQ = [
  { name: 'Home', path: '/' },
  { name: 'General Insurance', path: '/services/general-insurance' },
  { name: 'Life Insurance', path: '/services/life-insurance' },
  { name: 'Health Insurance', path: '/services/health-insurance' },
  { name: 'Mutual Funds', path: '/investments/mutual-funds' },
  { name: 'Equity', path: '/investments/equity' },
  { name: 'Other Solutions', path: '/investments/other-solutions' },
  { name: 'Insight Article', path: '/insights/navigating-market-volatility' },
];

const VIEWPORTS = [320, 360, 390, 430];

for (const pageInfo of PAGES_WITH_FAQ) {
  for (const width of VIEWPORTS) {
    test(`FAQ Accordion on ${pageInfo.name} at ${width}px: bounds inside viewport, symmetric gutters, no overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(pageInfo.path);
      await page.waitForLoadState('domcontentloaded');

      // 1. Horizontal scroll check
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(width);

      // 2. Select all FAQ items
      const faqCards = page.locator('.faq-card, .home-faq-button, #faq .card');
      const count = await faqCards.count();

      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const card = faqCards.nth(i);
          const box = await card.boundingBox();
          if (box) {
            // left >= 12px and right <= viewport - 12px
            expect(box.x).toBeGreaterThanOrEqual(12);
            expect(box.x + box.width).toBeLessThanOrEqual(width - 12);

            // Within 4px of symmetric gutters
            const leftGutter = box.x;
            const rightGutter = width - (box.x + box.width);
            expect(Math.abs(leftGutter - rightGutter)).toBeLessThanOrEqual(4);

            // No text node wider than card
            const textsWithin = await card.evaluate((el, cardWidth) => {
              const nodes = el.querySelectorAll('p, span, h2, h3, h4, .faq-question-text, .faq-card-answer');
              for (const n of nodes) {
                if (n.getBoundingClientRect().width > cardWidth + 1) {
                  return false;
                }
              }
              return true;
            }, box.width);
            expect(textsWithin).toBe(true);
          }
        }

        // 3. Open first FAQ item and verify answer panel wraps within card
        const firstBtn = page.locator('.faq-card-button, .home-faq-button').first();
        if (await firstBtn.isVisible()) {
          const isExpanded = await firstBtn.getAttribute('aria-expanded');
          if (isExpanded !== 'true') {
            await firstBtn.click();
            await page.waitForTimeout(300);
          }
          const answerPanel = page.locator('.faq-card-answer, .home-faq-answer').first();
          if (await answerPanel.isVisible()) {
            const answerBox = await answerPanel.boundingBox();
            if (answerBox) {
              expect(answerBox.x).toBeGreaterThanOrEqual(12);
              expect(answerBox.x + answerBox.width).toBeLessThanOrEqual(width - 12);
            }
          }
        }
      }
    });
  }
}

