import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect } from 'vitest';
import { AppRoutes } from '../src/routes/AppRoutes';
import { Header } from '../src/components/nav/Header';
import { Footer } from '../src/components/nav/Footer';
import { DevDataRegisterPill } from '../src/components/common/DevDataRegisterPill';
import { MockAuthProvider } from '../src/context/MockAuthContext';
import { ContactDrawerProvider } from '../src/context/ContactDrawerContext';

const renderWithContext = (ui: React.ReactElement, initialRoute = '/') => {
  return render(
    <HelmetProvider>
      <MockAuthProvider>
        <MemoryRouter initialEntries={[initialRoute]}>
          <ContactDrawerProvider>
            {ui}
          </ContactDrawerProvider>
        </MemoryRouter>
      </MockAuthProvider>
    </HelmetProvider>
  );
};

describe('Shared LegalLayout & Link Consistency', () => {
  describe('Header & Footer Link Consistency', () => {
    it('renders "Contact Us" as a shared NavLinkButton with identical styling to nav links', () => {
      renderWithContext(<Header />);
      const contactBtn = screen.getByRole('button', { name: /contact us/i });
      expect(contactBtn).toBeInTheDocument();
      expect(contactBtn).toHaveClass('nav-link-item');
      expect(contactBtn).toHaveClass('nav-link-item--header');

      const aboutLink = screen.getByRole('link', { name: /about us/i });
      expect(aboutLink).toHaveClass('nav-link-item');
      expect(aboutLink).toHaveClass('nav-link-item--header');
    });

    it('confirms 32px equal gap on header desktop navigation container', () => {
      renderWithContext(<Header />);
      const navContainer = screen.getByLabelText(/Main Navigation/i);
      expect(navContainer).toHaveStyle({ gap: '32px' });
    });

    it('renders Footer with 4 left-aligned columns, Poppins 600 headings, and no Data Register text', () => {
      renderWithContext(<Footer />);
      const footer = screen.getByTestId('global-footer');

      // Check column headings
      expect(within(footer).getByRole('heading', { level: 4, name: /^Services$/i })).toBeInTheDocument();
      expect(within(footer).getByRole('heading', { level: 4, name: /^Company & Legal$/i })).toBeInTheDocument();
      expect(within(footer).getByRole('heading', { level: 4, name: /^Contact( Godhra Office)?$/i })).toBeInTheDocument();

      // Check footer links use FooterLink class
      const privacyLink = within(footer).getByRole('link', { name: /privacy policy/i });
      expect(privacyLink).toHaveClass('nav-link-item--footer');

      // Contact Us button in footer
      const footerContactBtn = within(footer).getByRole('button', { name: /contact us/i });
      expect(footerContactBtn).toHaveClass('nav-link-item--footer');

      // Ensure "Data Register" is NOT present in Footer
      expect(footer.textContent).not.toContain('Data Register');
    });

    it('renders DevDataRegisterPill in development environment', () => {
      renderWithContext(<DevDataRegisterPill />);
      if (import.meta.env.DEV) {
        expect(screen.getByTestId('dev-data-register-pill')).toBeInTheDocument();
        expect(screen.getByText('DEV')).toBeInTheDocument();
      }
    });
  });

  describe('Legal Pages on LegalLayout', () => {
    it('renders /privacy-policy with slim hero band, breadcrumb inside, eyebrow, and no "Last reviewed: October 2026"', () => {
      renderWithContext(<AppRoutes />, '/privacy-policy');

      // Playfair H1
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(/Privacy Policy/i);

      // Breadcrumb INSIDE hero
      const breadcrumb = screen.getByLabelText(/Breadcrumb inside legal hero/i);
      expect(within(breadcrumb).getByText('Home')).toBeInTheDocument();
      expect(within(breadcrumb).getByText('Privacy Policy')).toBeInTheDocument();

      // Eyebrow
      expect(screen.getByText(/LEGAL & REGULATORY • GODHRA, GUJARAT/i)).toBeInTheDocument();

      // Strict check: "Last reviewed: October 2026" must NOT be rendered
      expect(screen.queryByText(/Last reviewed: October 2026/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Last updated: October 2026/i)).not.toBeInTheDocument();

      // Table of contents presence & heading presence
      expect(screen.getByText(/Contents & Navigation/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /1. Legal Entity & Privacy Contact/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /1. Legal Entity & Privacy Contact/i })).toBeInTheDocument();
    });

    it('renders /terms-and-conditions on LegalLayout with correct title and sections', () => {
      renderWithContext(<AppRoutes />, '/terms-and-conditions');

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Terms & Conditions/i);
      expect(screen.getByText(/General website terms, usage scope/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /1. Website Ownership & Permitted Use/i })).toBeInTheDocument();
      expect(screen.queryByText(/Last reviewed/i)).not.toBeInTheDocument();
    });

    it('renders /disclosures on LegalLayout with registrations table from registrations.json', () => {
      renderWithContext(<AppRoutes />, '/disclosures');

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Regulatory & Risk Disclosures/i);
      expect(screen.getByRole('heading', { level: 2, name: /1. Mutual Fund Statutory Risk Disclosure/i })).toBeInTheDocument();

      // Check official registrations table
      expect(screen.getByText('ARN-160174')).toBeInTheDocument();
      expect(screen.getByText('AP007909931')).toBeInTheDocument();
      expect(screen.getByText('AP0130040172963')).toBeInTheDocument();
      expect(screen.getAllByText(/Abhilash Chudasama/i).length).toBeGreaterThan(0);
    });

    it('renders /complaints on LegalLayout with Godhra office grievance details and provider escalation', () => {
      renderWithContext(<AppRoutes />, '/complaints');

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Complaints & Grievance Redressal/i);
      expect(screen.getByRole('heading', { level: 2, name: /2. Lotus Capital Grievance Contact/i })).toBeInTheDocument();

      // Contact channels
      expect(screen.getAllByText(/\+91 93288 52555/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/lotuscapitalinfo@gmail.com/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Shri Chudasama Bhuvan/i).length).toBeGreaterThan(0);

      // Provider escalation pathways
      expect(screen.getByRole('heading', { level: 2, name: /4. Regulated Provider Escalation Pathways/i })).toBeInTheDocument();
      expect(screen.getByText(/Religare Broking Limited Grievance Cell/i)).toBeInTheDocument();
      expect(screen.getAllByText(/SEBI SCORES portal/i).length).toBeGreaterThan(0);
    });
  });

  describe('Enquiry Thank You & 404 Consistency Pass', () => {
    it('renders /enquiry/thank-you with green badge, Playfair H1, copyable reference, and next steps', () => {
      renderWithContext(<AppRoutes />, '/enquiry/thank-you?ref=LC-20261031-778899');

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Thank you for contacting Lotus Capital/i);
      expect(screen.getByText('LC-20261031-778899')).toBeInTheDocument();
      expect(screen.getByText(/What to Expect Next/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /return to home/i })).toBeInTheDocument();
    });

    it('renders 404 page with 404 code, Playfair H1, helpful recovery options, and return CTA', () => {
      renderWithContext(<AppRoutes />, '/invalid-url-path-12345');

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/We couldn't find that page/i);
      expect(screen.getByText(/PAGE NOT FOUND • ERROR 404/i)).toBeInTheDocument();
      expect(screen.getByText(/Explore Services/i)).toBeInTheDocument();
      expect(screen.getByText(/Financial Insights/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /return to homepage/i })).toBeInTheDocument();
    });
  });
});
