import { describe, it, expect } from 'vitest';
import insightsData from '../../content/data/insights.json';
import servicesData from '../../content/data/services.json';
import fs from 'fs';
import path from 'path';

describe('Insights Learning Hub Compliance & Data Integrity', () => {
  it('contains exactly 6 structured articles', () => {
    expect(Array.isArray(insightsData)).toBe(true);
    expect(insightsData.length).toBe(6);
  });

  it('matches all 6 canonical client-specified slugs', () => {
    const expectedSlugs = [
      'mutual-funds-direct-vs-regular-plan',
      'what-is-nav',
      'sips-how-they-work',
      'questions-before-choosing-health-insurance',
      'understanding-equity-risk',
      'how-to-review-policy-exclusions-and-waiting-periods',
    ];

    const actualSlugs = insightsData.map((a: any) => a.slug);
    expect(actualSlugs).toEqual(expectedSlugs);
  });

  it('sets lastUpdated to null for all articles (no invented dates)', () => {
    insightsData.forEach((article: any) => {
      expect(article.lastUpdated).toBeNull();
      expect(article._comment).toContain('TODO: client to set real publication dates');
    });
  });

  it('contains required structural fields for each article', () => {
    insightsData.forEach((article: any) => {
      expect(article.slug).toBeTruthy();
      expect(article.title).toBeTruthy();
      expect(article.summary).toBeTruthy();
      expect(article.category).toBeTruthy();
      expect(article.readMinutes).toBeGreaterThan(0);
      expect(Array.isArray(article.takeaways)).toBe(true);
      expect(article.takeaways.length).toBeGreaterThan(0);
      expect(Array.isArray(article.blocks)).toBe(true);
      expect(article.blocks.length).toBeGreaterThan(0);
      expect(Array.isArray(article.sources)).toBe(true);
      expect(article.sources.length).toBeGreaterThan(0);
    });
  });

  it('contains zero return promises, stock tips, or invented CAGR numbers', () => {
    const jsonString = JSON.stringify(insightsData);
    expect(jsonString).not.toMatch(/23\s*%/);
    expect(jsonString).not.toMatch(/equity_cagr/i);
    expect(jsonString).not.toMatch(/guaranteed return/i);
    expect(jsonString).not.toMatch(/stock tip/i);
  });

  it('includes insights theme block in services.json', () => {
    const insightsTheme = servicesData.find((s: any) => s.slug === 'insights');
    expect(insightsTheme).toBeDefined();
    expect(insightsTheme?.theme?.canvas).toBe('#EEF1F4');
    expect(insightsTheme?.theme?.accent).toBe('#5B8DB8');
    expect(insightsTheme?.theme?.secondaryAccent).toBe('#123D67');
  });

  it('suppresses global breadcrumbs on /insights and /insights/*', () => {
    const breadcrumbsPath = path.resolve(__dirname, '../src/components/nav/Breadcrumbs.tsx');
    const content = fs.readFileSync(breadcrumbsPath, 'utf8');
    expect(content).toContain("path === '/insights'");
    expect(content).toContain("path.startsWith('/insights/')");
  });

  it('marks /insights in Header isHeroPage for transparent header styling', () => {
    const headerPath = path.resolve(__dirname, '../src/components/nav/Header.tsx');
    const content = fs.readFileSync(headerPath, 'utf8');
    expect(content).toContain("location.pathname.startsWith('/insights')");
  });

  it('includes redirects for legacy insight slugs in AppRoutes', () => {
    const routesPath = path.resolve(__dirname, '../src/routes/AppRoutes.tsx');
    const content = fs.readFileSync(routesPath, 'utf8');
    expect(content).toContain('/insights/mutual-funds-direct-vs-regular');
    expect(content).toContain('/insights/what-nav-means');
    expect(content).toContain('/insights/how-sips-work');
    expect(content).toContain('/insights/choosing-health-insurance');
    expect(content).toContain('/insights/policy-exclusions-waiting-periods');
  });
});

