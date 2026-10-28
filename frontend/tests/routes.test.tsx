import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect } from 'vitest';
import { AppRoutes } from '../src/routes/AppRoutes';
import { MockAuthProvider } from '../src/context/MockAuthContext';

function renderAt(route: string) {
  return render(
    <HelmetProvider>
      <MockAuthProvider>
        <MemoryRouter initialEntries={[route]}>
          <AppRoutes />
        </MemoryRouter>
      </MockAuthProvider>
    </HelmetProvider>
  );
}

describe('Route Table Coverage & Redirects', () => {
  describe('Public Route Rendering', () => {
    it('renders Home route (/)', () => {
      renderAt('/');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Plan with confidence/i
      );
    });

    it('renders About Us route (/about-us)', () => {
      renderAt('/about-us');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Financial decisions deserve clear conversations/i
      );
    });

    it('renders Services route (/services)', () => {
      renderAt('/services');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Solutions for protection/i
      );
    });

    it('renders General Insurance route (/services/general-insurance)', () => {
      renderAt('/services/general-insurance');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Protection for the Things That Matter/i
      );
    });

    it('renders Life Insurance route (/services/life-insurance)', () => {
      renderAt('/services/life-insurance');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Protect Your Family/i
      );
    });

    it('renders Health Insurance route (/services/health-insurance)', () => {
      renderAt('/services/health-insurance');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Healthcare Decisions Shouldn't Become Financial Burdens/i
      );
    });

    it('renders Mutual Funds route (/investments/mutual-funds)', () => {
      renderAt('/investments/mutual-funds');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Invest with a Goal/i
      );
      expect(screen.getByTestId('sip-calculator')).toBeInTheDocument();
    });

    it('renders Equity route (/investments/equity)', () => {
      renderAt('/investments/equity');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Understand the Markets/i
      );
      expect(screen.getAllByText(/Religare Broking Limited/i).length).toBeGreaterThan(0);
    });

    it('renders Other Solutions route (/investments/other-solutions)', () => {
      renderAt('/investments/other-solutions');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /More Ways to Build and Protect Your Wealth/i
      );
    });

    it('renders Insights listing route (/insights)', () => {
      renderAt('/insights');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Learn before you decide/i
      );
    });

    it('renders Contact Us route (/contact-us)', () => {
      renderAt('/contact-us');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Tell us what you would like to explore/i
      );
      expect(screen.getByTestId('enquiry-form')).toBeInTheDocument();
    });

    it('renders Thank You route (/enquiry/thank-you)', () => {
      renderAt('/enquiry/thank-you?ref=LC-20261028-123456');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Thank you for contacting Lotus Capital/i
      );
      expect(screen.getByTestId('enquiry-ref')).toHaveTextContent('LC-20261028-123456');
    });

    it('renders 404 for unknown route (*)', () => {
      renderAt('/non-existent-page-xyz');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /We couldn't find that page/i
      );
    });
  });

  describe('Section 3.5 Redirects', () => {
    it('redirects /about -> /about-us', () => {
      renderAt('/about');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Financial decisions deserve clear conversations/i
      );
    });

    it('redirects /contact -> /contact-us', () => {
      renderAt('/contact');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Tell us what you would like to explore/i
      );
    });

    it('redirects /mutual-funds -> /investments/mutual-funds', () => {
      renderAt('/mutual-funds');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Invest with a Goal/i
      );
    });

    it('redirects /equity -> /investments/equity', () => {
      renderAt('/equity');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Understand the Markets/i
      );
    });

    it('redirects /general-insurance -> /services/general-insurance', () => {
      renderAt('/general-insurance');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Protection for the Things That Matter/i
      );
    });

    it('redirects /investments -> /services', () => {
      renderAt('/investments');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Solutions for protection/i
      );
    });

    it('redirects trailing slash: /about-us/ -> /about-us', () => {
      renderAt('/about-us/');
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Financial decisions deserve clear conversations/i
      );
    });
  });
});
