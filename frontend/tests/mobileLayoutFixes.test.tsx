import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { HorizontalRail } from '../src/components/common/HorizontalRail';
import { EnquiryPanel } from '../src/components/enquiry/EnquiryPanel';
import { HealthCompareInspector } from '../src/components/insurance/HealthCompareInspector';
import { SiteHeader } from '../src/components/nav/SiteHeader';
import { ContactDrawerProvider } from '../src/context/ContactDrawerContext';
import { StickyMobileCtaBar } from '../src/components/common/StickyMobileCtaBar';
import { FaqAccordion } from '../src/components/insurance/FaqAccordion';

describe('Mobile Layout Robustness & Root Cause Verification (Flaws 1-5)', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  // --------------------------------------------------------------------------
  // 1. HorizontalRail child min width (Root Cause B)
  // --------------------------------------------------------------------------
  it('guarantees HorizontalRail items have a minimum width of at least 240px and never shrink', () => {
    const { container } = render(
      <HorizontalRail ariaLabel="Test Category Rail">
        <div data-testid="card-1">Card 1</div>
        <div data-testid="card-2">Card 2</div>
      </HorizontalRail>
    );

    const rail = container.querySelector('.horizontal-rail');
    expect(rail).not.toBeNull();
    expect(rail).toHaveStyle({
      display: 'flex',
      overflowX: 'auto',
    });

    const items = container.querySelectorAll('.horizontal-rail-item');
    expect(items.length).toBe(2);

    items.forEach((item) => {
      const style = (item as HTMLElement).getAttribute('style') || '';
      expect(style).toContain('min-width: 240px');
      expect(style).toContain('flex-shrink: 0');
    });
  });

  // --------------------------------------------------------------------------
  // 2. EnquiryPanel Single-Column & Consent Row (Root Cause G & Flaw 2)
  // --------------------------------------------------------------------------
  it('renders EnquiryPanel with separate consent row and full-width submit button', () => {
    const { container } = render(
      <BrowserRouter>
        <EnquiryPanel defaultService="general-insurance" />
      </BrowserRouter>
    );

    // Consent row must have display: grid with fixed 24px column for checkbox
    const consentRow = container.querySelector('.enquiry-consent-row');
    expect(consentRow).not.toBeNull();

    const consentLabel = consentRow?.querySelector('label');
    expect(consentLabel).not.toBeNull();
    const labelStyle = consentLabel?.getAttribute('style') || '';
    expect(labelStyle).toContain('display: grid');
    expect(labelStyle).toContain('grid-template-columns: 24px minmax(0, 1fr)');

    // Submit button must have min-height >= 48px and white-space: nowrap
    const submitBtn = container.querySelector('.enquiry-submit-btn');
    expect(submitBtn).not.toBeNull();
    const btnStyle = submitBtn?.getAttribute('style') || '';
    expect(btnStyle).toContain('min-height: 52px');
    expect(btnStyle).toContain('white-space: nowrap');
  });

  // --------------------------------------------------------------------------
  // 3. HealthCompareInspector Header Stack (Root Cause D & Flaw 4)
  // --------------------------------------------------------------------------
  it('renders HealthCompareInspector with inspector-header-row and reviewed action button (>= 44px)', () => {
    const { container } = render(<HealthCompareInspector />);

    const headerRow = container.querySelector('.inspector-header-row');
    expect(headerRow).not.toBeNull();

    const reviewBtn = screen.getByRole('button', { name: /Reviewed/i });
    expect(reviewBtn).not.toBeNull();
    expect(reviewBtn.textContent).not.toContain('+');

    const btnStyle = reviewBtn.getAttribute('style') || '';
    expect(btnStyle).toContain('min-height: 44px');
    expect(btnStyle).toContain('white-space: nowrap');
  });

  // --------------------------------------------------------------------------
  // 4. Header Height Variable Synchronization (Root Cause I)
  // --------------------------------------------------------------------------
  it('synchronizes --header-h variable to documentElement when SiteHeader mounts', () => {
    render(
      <BrowserRouter>
        <HelmetProvider>
          <ContactDrawerProvider>
            <SiteHeader />
          </ContactDrawerProvider>
        </HelmetProvider>
      </BrowserRouter>
    );

    const headerH = document.documentElement.style.getPropertyValue('--header-h');
    expect(headerH).toBeTruthy();
    expect(headerH).toMatch(/^\d+px$/);
  });

  // --------------------------------------------------------------------------
  // 5. Sticky Mobile CTA Bar Integration (Root Cause H)
  // --------------------------------------------------------------------------
  it('renders StickyMobileCtaBar with accessible Talk to an Advisor CTA and test ID', () => {
    render(
      <BrowserRouter>
        <ContactDrawerProvider>
          <StickyMobileCtaBar />
        </ContactDrawerProvider>
      </BrowserRouter>
    );

    const ctaBar = screen.getByTestId('sticky-mobile-cta-bar');
    expect(ctaBar).not.toBeNull();

    const ctaBtn = screen.getByRole('button', { name: /Talk to an Advisor/i, hidden: true });
    expect(ctaBtn).not.toBeNull();
  });

  // --------------------------------------------------------------------------
  // 6. FAQ Accordion Mobile Layout & Category Pills
  // --------------------------------------------------------------------------
  it('renders FaqAccordion with responsive layout, category pills, and card button classes', () => {
    const { container } = render(
      <FaqAccordion page="general-insurance" />
    );

    // .faq-layout exists and container does not have hardcoded inline double padding
    const faqLayout = container.querySelector('.faq-layout');
    expect(faqLayout).not.toBeNull();
    const layoutStyle = faqLayout?.getAttribute('style') || '';
    expect(layoutStyle).not.toContain('minmax(280px, 1fr)');

    // Category pills present with proper class
    const categoryPills = container.querySelector('.faq-category-pills');
    expect(categoryPills).not.toBeNull();

    // Buttons have faq-card-button class
    const cardButtons = container.querySelectorAll('.faq-card-button');
    expect(cardButtons.length).toBeGreaterThan(0);

    // Answers have faq-card-answer class
    const cardAnswers = container.querySelectorAll('.faq-card-answer');
    expect(cardAnswers.length).toBeGreaterThan(0);
  });

  // --------------------------------------------------------------------------
  // 7. FAQ Accordion Grid & Alphanumeric Code Wrapping (.break-anywhere)
  // --------------------------------------------------------------------------
  it('renders FaqAccordion with direct 3-column button children and AP codes wrapped in .break-anywhere', () => {
    const { container } = render(
      <FaqAccordion page="equity" />
    );

    // Button must have exactly 3 direct children (number, question, plus toggle)
    const firstButton = container.querySelector('.faq-card-button');
    expect(firstButton).not.toBeNull();
    expect(firstButton?.children.length).toBe(3);

    const numberCircle = firstButton?.querySelector('.faq-number-circle');
    const questionText = firstButton?.querySelector('.faq-question-text');
    const toggleIcon = firstButton?.querySelector('.faq-toggle-icon');

    expect(numberCircle).not.toBeNull();
    expect(questionText).not.toBeNull();
    expect(toggleIcon).not.toBeNull();

    // Category pills container wrapper exists for edge fade
    const pillsContainer = container.querySelector('.faq-category-pills-container');
    expect(pillsContainer).not.toBeNull();

    // Answer with AP codes wraps AP codes in .break-anywhere
    const breakAnywhereSpans = container.querySelectorAll('.faq-card-answer .break-anywhere');
    expect(breakAnywhereSpans.length).toBeGreaterThan(0);
    const codes = Array.from(breakAnywhereSpans).map((s) => s.textContent);
    expect(codes.some((c) => c?.includes('AP007909931'))).toBe(true);
  });
});
