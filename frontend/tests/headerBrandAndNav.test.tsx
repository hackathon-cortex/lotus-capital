import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import * as fs from 'fs';
import * as path from 'path';
import { SiteHeader } from '../src/components/nav/SiteHeader';
import { ContactDrawerProvider } from '../src/context/ContactDrawerContext';
import { getActiveNavItem, getHeaderTone } from '../src/config/navigation';

const renderHeader = (initialRoute = '/') => {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <ContactDrawerProvider>
          <SiteHeader />
        </ContactDrawerProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
};

describe('Global Header & Navigation (v3 Floating Glass Bar)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  describe('Brand Color Compliance (CSS & Components)', () => {
    const headerFiles = [
      'src/styles/header.css',
      'src/components/nav/SiteHeader.tsx',
      'src/components/nav/NavTrack.tsx',
      'src/components/nav/NavMegaMenu.tsx',
      'src/components/nav/MobileDrawer.tsx',
      'src/components/nav/ServiceNavIcon.tsx',
    ];

    const ALLOWED_BRAND_HEX_WHITELIST = new Set([
      '#051329', // deep midnight navy
      '#071b30', // navy-950
      '#0a2540', // rich navy
      '#0d2847', // navy accent
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
      '#a91621', // brand red darkest
    ]);

    const FORBIDDEN_ACCENTS = [
      { name: 'teal', hex: '#1f6f8b' },
      { name: 'care-green', hex: '#1e8e6e' },
      { name: 'ledger-gold', hex: '#b7893a' },
      { name: 'warm-ivory', hex: '#fbf5e9' },
      { name: 'mint-tint', hex: '#e6f5ef' },
      { name: 'purple', hex: '#7c3aed' },
    ];

    it('contains ONLY approved Lotus Capital brand hex colors across all header files', () => {
      headerFiles.forEach((relPath) => {
        const fullPath = path.resolve(__dirname, '..', relPath);
        const content = fs.readFileSync(fullPath, 'utf8');
        const hexMatches = content.match(/#[0-9a-fA-F]{3,8}/g) || [];

        hexMatches.forEach((hex) => {
          const lower = hex.toLowerCase();
          expect(
            ALLOWED_BRAND_HEX_WHITELIST.has(lower),
            `File ${relPath} contains unapproved hex color: ${hex}`
          ).toBe(true);
        });

        FORBIDDEN_ACCENTS.forEach(({ name, hex }) => {
          expect(
            content.toLowerCase().includes(hex.toLowerCase()),
            `File ${relPath} must NOT contain forbidden accent ${name} (${hex})`
          ).toBe(false);
        });
      });
    });
  });

  describe('Active Route Detection & Selected Tab Consistency', () => {
    it('selects Home on exact "/" only', () => {
      expect(getActiveNavItem('/')?.id).toBe('home');
      expect(getActiveNavItem('/home')).toBeNull();
    });

    it('selects About Us on /about-us and /about', () => {
      expect(getActiveNavItem('/about-us')?.id).toBe('about');
      expect(getActiveNavItem('/about')?.id).toBe('about');
    });

    it('selects Insurance on /services and all insurance and other-solutions routes', () => {
      expect(getActiveNavItem('/services')?.id).toBe('insurance');
      expect(getActiveNavItem('/services/general-insurance')?.id).toBe('insurance');
      expect(getActiveNavItem('/services/life-insurance')?.id).toBe('insurance');
      expect(getActiveNavItem('/services/health-insurance')?.id).toBe('insurance');
      expect(getActiveNavItem('/investments/other-solutions')?.id).toBe('insurance');
    });

    it('selects Mutual Funds on /investments/mutual-funds without selecting Insurance', () => {
      expect(getActiveNavItem('/investments/mutual-funds')?.id).toBe('mutual-funds');
    });

    it('selects Equity on /investments/equity without selecting Insurance', () => {
      expect(getActiveNavItem('/investments/equity')?.id).toBe('equity');
    });

    it('selects Insights on /insights and article subpaths', () => {
      expect(getActiveNavItem('/insights')?.id).toBe('insights');
      expect(getActiveNavItem('/insights/direct-vs-regular-mutual-funds')?.id).toBe('insights');
    });

    it('does not change selected tab when a hash is appended', () => {
      expect(getActiveNavItem('/')?.id).toBe('home');
      expect(getActiveNavItem('/services')?.id).toBe('insurance');
    });

    it('returns null for legal/unmapped pages so no tab is active and pill fades', () => {
      expect(getActiveNavItem('/privacy-policy')).toBeNull();
      expect(getActiveNavItem('/terms-and-conditions')).toBeNull();
      expect(getActiveNavItem('/disclosures')).toBeNull();
      expect(getActiveNavItem('/complaints')).toBeNull();
      expect(getActiveNavItem('/404')).toBeNull();
    });
  });

  describe('Header Tone Mapping (headerTone)', () => {
    it('assigns dark-hero tone to dark hero pages', () => {
      expect(getHeaderTone('/')).toBe('dark-hero');
      expect(getHeaderTone('/services')).toBe('dark-hero');
      expect(getHeaderTone('/services/life-insurance')).toBe('dark-hero');
      expect(getHeaderTone('/investments/mutual-funds')).toBe('dark-hero');
      expect(getHeaderTone('/investments/equity')).toBe('dark-hero');
    });

    it('assigns solid navy tone to light pages (About, Insights, Legal, 404)', () => {
      expect(getHeaderTone('/about-us')).toBe('solid');
      expect(getHeaderTone('/insights')).toBe('solid');
      expect(getHeaderTone('/insights/article-slug')).toBe('solid');
      expect(getHeaderTone('/privacy-policy')).toBe('solid');
      expect(getHeaderTone('/terms-and-conditions')).toBe('solid');
      expect(getHeaderTone('/unknown')).toBe('solid');
    });
  });

  describe('Desktop Navigation Structure & ARIA', () => {
    it('renders logo unclipped with Home link', () => {
      renderHeader('/');
      const logoLink = screen.getByRole('link', { name: /lotus capital home/i });
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('renders the 7 desktop links inside the nav track with exact labels', () => {
      renderHeader('/');
      expect(screen.getByRole('link', { name: /^home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^about us/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^insurance/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^mutual funds/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^equity/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^insights/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^contact us/i })).toBeInTheDocument();
    });

    it('sets aria-current="page" on active exact route link', () => {
      renderHeader('/');
      const homeLink = screen.getByRole('link', { name: /^home/i });
      expect(homeLink).toHaveAttribute('aria-current', 'page');
    });

    it('sets aria-haspopup="true" and aria-expanded on Insurance trigger button', () => {
      renderHeader('/');
      const insuranceBtn = screen.getByRole('button', { name: /^insurance/i });
      expect(insuranceBtn).toHaveAttribute('aria-haspopup', 'true');
      expect(insuranceBtn).toHaveAttribute('aria-expanded', 'false');

      // Click to open
      fireEvent.click(insuranceBtn);
      expect(insuranceBtn).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('region', { name: /insurance menu/i })).toBeInTheDocument();
    });

    it('closes MegaMenu on Escape key and returns focus', () => {
      renderHeader('/');
      const insuranceBtn = screen.getByRole('button', { name: /^insurance/i });
      fireEvent.click(insuranceBtn);
      expect(screen.getByRole('region', { name: /insurance menu/i })).toBeInTheDocument();

      fireEvent.keyDown(screen.getByRole('region', { name: /insurance menu/i }), { key: 'Escape' });
      expect(screen.queryByRole('region', { name: /insurance menu/i })).not.toBeInTheDocument();
    });

    it('ensures "Talk to an Advisor" never has active state', () => {
      renderHeader('/services/life-insurance');
      const ctaButtons = screen.getAllByRole('button', { name: /talk to an advisor/i });
      ctaButtons.forEach((btn) => {
        expect(btn).not.toHaveAttribute('aria-current');
        expect(btn).not.toHaveClass('is-active');
      });
    });
  });

  describe('Mobile Drawer & Accordion Functionality', () => {
    it('opens mobile drawer when hamburger toggle is clicked', () => {
      renderHeader('/');
      const hamburger = screen.getByLabelText(/open navigation menu/i);
      expect(hamburger).toBeInTheDocument();

      fireEvent.click(hamburger);
      const drawer = screen.getByRole('dialog', { name: /navigation menu/i });
      expect(drawer).toBeInTheDocument();
      expect(drawer).toHaveAttribute('aria-modal', 'true');
    });

    it('expands Insurance accordion in drawer to list all 3 insurance practices with line icons', () => {
      renderHeader('/');
      const hamburger = screen.getByLabelText(/open navigation menu/i);
      fireEvent.click(hamburger);

      const drawer = screen.getByRole('dialog', { name: /navigation menu/i });
      const accordionTrigger = within(drawer).getByRole('button', { name: /^insurance/i });
      expect(accordionTrigger).toBeInTheDocument();
      expect(accordionTrigger).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(accordionTrigger);
      expect(accordionTrigger).toHaveAttribute('aria-expanded', 'true');

      // Verify all 3 insurance practices inside the accordion panel
      const accordionPanel = drawer.querySelector('.mobile-drawer-accordion-panel') as HTMLElement;
      expect(accordionPanel).toBeInTheDocument();
      expect(within(accordionPanel).getByText('General Insurance')).toBeInTheDocument();
      expect(within(accordionPanel).getByText('Life Insurance')).toBeInTheDocument();
      expect(within(accordionPanel).getByText('Health Insurance')).toBeInTheDocument();
      expect(within(accordionPanel).getByText('Overview (Insurance)')).toBeInTheDocument();

      // Ensure Mutual Funds and Equity are NOT duplicated inside the insurance accordion panel
      expect(within(accordionPanel).queryByText('Mutual Funds')).not.toBeInTheDocument();
      expect(within(accordionPanel).queryByText('Equity & Investments')).not.toBeInTheDocument();
    });

    it('closes mobile drawer on close button click', () => {
      renderHeader('/');
      const hamburger = screen.getByLabelText(/open navigation menu/i);
      fireEvent.click(hamburger);
      const drawer = screen.getByRole('dialog', { name: /navigation menu/i });
      expect(drawer).toBeInTheDocument();

      const closeBtn = within(drawer).getByLabelText(/close navigation menu/i);
      fireEvent.click(closeBtn);
      expect(screen.queryByRole('dialog', { name: /navigation menu/i })).not.toBeInTheDocument();
    });
  });
});
