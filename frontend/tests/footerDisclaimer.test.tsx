import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect } from 'vitest';
import { Footer } from '../src/components/nav/Footer';
import { AppRoutes } from '../src/routes/AppRoutes';
import { MockAuthProvider } from '../src/context/MockAuthContext';
import disclaimersData from '@content/data/disclaimers.json';

describe('Global Footer Disclaimer', () => {
  it('renders exact mutual fund disclaimer in the Footer component', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const disclaimerEl = screen.getByTestId('footer-disclaimer');
    expect(disclaimerEl).toBeInTheDocument();
    expect(disclaimerEl.textContent).toContain(disclaimersData.footer_disclaimer);
  });

  const publicRoutes = [
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
    '/contact-us',
    '/privacy-policy',
    '/terms-and-conditions',
    '/disclosures',
    '/complaints',
  ];

  publicRoutes.forEach((route) => {
    it(`displays footer disclaimer on public route: ${route}`, () => {
      render(
        <HelmetProvider>
          <MockAuthProvider>
            <MemoryRouter initialEntries={[route]}>
              <AppRoutes />
            </MemoryRouter>
          </MockAuthProvider>
        </HelmetProvider>
      );

      const disclaimer = screen.getByTestId('footer-disclaimer');
      expect(disclaimer).toBeInTheDocument();
      expect(disclaimer.textContent).toContain('Mutual fund investments are subject to market risks');
    });
  });
});

