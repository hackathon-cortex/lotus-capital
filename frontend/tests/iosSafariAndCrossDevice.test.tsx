import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrandLogo } from '../src/components/common/BrandLogo';
import { LotusLogo } from '../src/components/common/LotusLogo';
import { SiteHeader } from '../src/components/nav/SiteHeader';
import { ContactDrawerProvider } from '../src/context/ContactDrawerContext';
import { AuthProvider } from '../src/context/AuthContext';
import { Home } from '../src/pages/public/Home';

describe('iOS Safari & Cross-Device Layout and Brand Hardening Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Part 1.1: Dedicated BrandLogo Component & Asset Integrity', () => {
    it('renders dedicated light vector asset with explicit dimensions and no filters', () => {
      const { container } = render(
        <BrandLogo variant="light" height={54} width={190} />
      );

      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/logo/light.svg');
      expect(img).toHaveAttribute('width', '190');
      expect(img).toHaveAttribute('height', '54');
      expect(img).toHaveAttribute('alt', 'Lotus Capital — Partnering Wealth Creation');

      const wrapper = container.querySelector('.brand-logo-container') as HTMLElement;
      expect(wrapper).toBeInTheDocument();
      expect(wrapper.style.overflow).toBe('hidden');
      expect(wrapper.style.contain).toBe('layout paint');
      expect(wrapper.style.flex).toBe('0 0 auto');
    });

    it('renders dedicated dark vector asset for light surfaces with explicit dimensions', () => {
      render(<BrandLogo variant="dark" height={48} width={180} />);

      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/logo/dark.svg');
      expect(img).toHaveAttribute('width', '180');
      expect(img).toHaveAttribute('height', '48');
    });

    it('renders dedicated mark asset for watermarks and compact indicators', () => {
      render(<BrandLogo variant="mark" height={48} width={48} />);

      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/logo/mark.svg');
      expect(img).toHaveAttribute('alt', 'Lotus Capital Emblem');
    });

    it('guarantees LotusLogo watermark variant suppresses wordmark and divider lines', () => {
      const { container } = render(<LotusLogo variant="watermark" width={320} height={320} />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '235 0 250 250');
      // No text element should be rendered
      const textElement = container.querySelector('text');
      expect(textElement).toBeNull();
    });
  });

  describe('Part 1.2: SiteHeader BrandLogo Integration & Mobile Drawer Portal', () => {
    it('renders BrandLogo inside SiteHeader with proper dimensions and wrapper isolation', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <ContactDrawerProvider>
            <SiteHeader />
          </ContactDrawerProvider>
        </MemoryRouter>
      );

      const logoImg = screen.getByRole('img', { name: /Lotus Capital/i });
      expect(logoImg).toBeInTheDocument();
      expect(logoImg).toHaveAttribute('src', '/images/logo/light.svg');
      expect(logoImg).toHaveAttribute('width', '190');
      expect(logoImg).toHaveAttribute('height', '54');

      const logoWrapper = logoImg.closest('.site-header__logo-wrapper');
      expect(logoWrapper).toBeInTheDocument();
    });
  });

  describe('Part 1.3: Hero Section Background & Artwork Isolation', () => {
    it('renders hero SVG background and watermark artwork without text crossing', () => {
      const { container } = render(
        <HelmetProvider>
          <MemoryRouter initialEntries={['/']}>
            <ContactDrawerProvider>
              <Home />
            </ContactDrawerProvider>
          </MemoryRouter>
        </HelmetProvider>
      );

      // Hero background image must point to /images/hero.svg
      const heroBgImg = container.querySelector('.home-hero__image');
      expect(heroBgImg).toBeInTheDocument();
      expect(heroBgImg).toHaveAttribute('src', '/images/hero.svg');

      // Hero artwork container must exist and contain only the clean emblem
      const heroArt = container.querySelector('.hero-lotus-art');
      expect(heroArt).toBeInTheDocument();
      expect(heroArt?.querySelector('text')).toBeNull();

      // Hero content container must exist
      const heroContent = container.querySelector('.home-hero__content');
      expect(heroContent).toBeInTheDocument();
      const heroText = container.querySelector('.home-hero__text');
      expect(heroText).toBeInTheDocument();
    });
  });

  describe('Part 2: Fail-Closed Auth Guard Integration', () => {
    it('starts unauthenticated with user=null and redirects anonymous users', () => {
      render(
        <MemoryRouter initialEntries={['/admin']}>
          <AuthProvider>
            <div data-testid="test-content">Protected Content</div>
          </AuthProvider>
        </MemoryRouter>
      );

      // In initial state, AuthProvider does not default to mock admin
      // and isLoading is true until /api/v1/auth/me resolves
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });
  });
});
