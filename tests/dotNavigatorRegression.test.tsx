import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AppRoutes } from '../src/routes/AppRoutes';
import { MockAuthProvider } from '../src/context/MockAuthContext';
import { ContactDrawerProvider } from '../src/context/ContactDrawerContext';

function renderAt(route: string) {
  return render(
    <HelmetProvider>
      <MockAuthProvider>
        <MemoryRouter initialEntries={[route]}>
          <ContactDrawerProvider>
            <AppRoutes />
          </ContactDrawerProvider>
        </MemoryRouter>
      </MockAuthProvider>
    </HelmetProvider>
  );
}

const PUBLIC_ROUTES = [
  '/',
  '/about-us',
  '/services',
  '/services/general-insurance',
  '/services/life-insurance',
  '/services/health-insurance',
  '/investments/mutual-funds',
  '/investments/equity',
  '/investments/other-solutions',
  '/insights',
  '/privacy-policy',
  '/terms-and-conditions',
  '/disclosures',
  '/complaints',
  '/enquiry/thank-you',
  '/unknown-route-404',
];

describe('DotNavigator Site-Wide Removal & Regression Protection', () => {
  beforeEach(() => {
    window.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })) as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  PUBLIC_ROUTES.forEach((route) => {
    it(`guarantees NO dot navigator or section navigation indicators render on ${route}`, () => {
      const { container } = renderAt(route);

      // Verify no DotNavigator element or test id
      expect(container.querySelector('.dot-navigator')).toBeNull();
      expect(container.querySelector('[data-testid="dot-navigator"]')).toBeNull();
      expect(container.querySelector('[data-testid^="dot-nav-"]')).toBeNull();

      // Verify no element with section navigation ARIA label
      expect(
        container.querySelector('[aria-label*="Section navigation"]')
      ).toBeNull();

      // Verify no dot nav item/label/circle class
      expect(container.querySelector('.dot-nav-item')).toBeNull();
      expect(container.querySelector('.dot-nav-label')).toBeNull();
      expect(container.querySelector('.dot-nav-circle')).toBeNull();
    });
  });

  it('preserves all vital section IDs and anchors on Home', () => {
    const { container } = renderAt('/');
    const expectedIds = [
      'hero',
      'overview-strip',
      'about',
      'services',
      'mutual-funds',
      'equity',
      'insurance',
      'trust',
      'partners',
      'process',
      'learn',
      'faq',
      'enquiry',
    ];
    expectedIds.forEach((id) => {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    });
  });

  it('preserves section IDs and anchors on Mutual Funds', () => {
    const { container } = renderAt('/investments/mutual-funds');
    const expectedIds = [
      'hero',
      'sip-calculator',
      'ways-to-invest',
      'categories',
      'compare',
      'faqs',
      'enquiry',
    ];
    expectedIds.forEach((id) => {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    });
  });

  it('preserves section IDs and anchors on Equity', () => {
    const { container } = renderAt('/investments/equity');
    const expectedIds = ['hero', 'broking', 'services', 'journey', 'faqs', 'enquiry'];
    expectedIds.forEach((id) => {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    });
  });

  it('preserves section IDs and anchors on Insights', () => {
    const { container } = renderAt('/insights');
    const expectedIds = ['hero', 'featured', 'library', 'paths', 'jargon', 'enquiry'];
    expectedIds.forEach((id) => {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    });
  });
});
