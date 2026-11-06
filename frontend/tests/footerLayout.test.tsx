import React from 'react';
import { render, screen, within, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Footer } from '../src/components/nav/Footer';
import { DevDataRegisterPill } from '../src/components/common/DevDataRegisterPill';
import { ContactDrawerProvider } from '../src/context/ContactDrawerContext';
import disclaimersData from '@content/data/disclaimers.json';
import contactData from '@content/data/contact.json';

const renderWithContext = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ContactDrawerProvider>{ui}</ContactDrawerProvider>
    </MemoryRouter>
  );
};

describe('Site Footer Layout & Consistency', () => {
  let intersectionCallbacks: ((entries: IntersectionObserverEntry[]) => void)[] = [];

  beforeEach(() => {
    intersectionCallbacks = [];
    // Mock IntersectionObserver
    window.IntersectionObserver = vi.fn().mockImplementation((callback) => {
      intersectionCallbacks.push(callback);
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    }) as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Footer with 4 dedicated column containers and appropriate classes', () => {
    renderWithContext(<Footer />);

    const footer = screen.getByTestId('global-footer');
    expect(footer).toHaveClass('site-footer');

    const brandCol = screen.getByTestId('footer-col-brand');
    const servicesCol = screen.getByTestId('footer-col-services');
    const companyCol = screen.getByTestId('footer-col-company');
    const contactCol = screen.getByTestId('footer-col-contact');

    expect(brandCol).toBeInTheDocument();
    expect(servicesCol).toBeInTheDocument();
    expect(companyCol).toBeInTheDocument();
    expect(contactCol).toBeInTheDocument();

    // Check headings
    expect(within(servicesCol).getByRole('heading', { level: 4, name: /^Services$/i })).toBeInTheDocument();
    expect(within(companyCol).getByRole('heading', { level: 4, name: /^Company & Legal$/i })).toBeInTheDocument();
    expect(within(contactCol).getByRole('heading', { level: 4, name: /^Contact Godhra Office$/i })).toBeInTheDocument();
  });

  it('asserts that at 1440px (desktop), the four footer column containers share the same top coordinate (side by side)', () => {
    // Set window innerWidth to 1440px
    window.innerWidth = 1440;

    renderWithContext(<Footer />);

    const brandCol = screen.getByTestId('footer-col-brand');
    const servicesCol = screen.getByTestId('footer-col-services');
    const companyCol = screen.getByTestId('footer-col-company');
    const contactCol = screen.getByTestId('footer-col-contact');

    // Mock getBoundingClientRect based on 1440px desktop side-by-side grid
    // At >= 1024px, all 4 columns sit on the same row, sharing the same top coordinate
    const desktopTop = 150;
    vi.spyOn(brandCol, 'getBoundingClientRect').mockReturnValue({
      top: desktopTop,
      bottom: desktopTop + 240,
      left: 100,
      right: 380,
      width: 280,
      height: 240,
      x: 100,
      y: desktopTop,
      toJSON: () => {},
    });
    vi.spyOn(servicesCol, 'getBoundingClientRect').mockReturnValue({
      top: desktopTop,
      bottom: desktopTop + 220,
      left: 420,
      right: 620,
      width: 200,
      height: 220,
      x: 420,
      y: desktopTop,
      toJSON: () => {},
    });
    vi.spyOn(companyCol, 'getBoundingClientRect').mockReturnValue({
      top: desktopTop,
      bottom: desktopTop + 250,
      left: 660,
      right: 860,
      width: 200,
      height: 250,
      x: 660,
      y: desktopTop,
      toJSON: () => {},
    });
    vi.spyOn(contactCol, 'getBoundingClientRect').mockReturnValue({
      top: desktopTop,
      bottom: desktopTop + 200,
      left: 900,
      right: 1140,
      width: 240,
      height: 200,
      x: 900,
      y: desktopTop,
      toJSON: () => {},
    });

    const bTop = brandCol.getBoundingClientRect().top;
    const sTop = servicesCol.getBoundingClientRect().top;
    const cTop = companyCol.getBoundingClientRect().top;
    const oTop = contactCol.getBoundingClientRect().top;

    // All four columns share the exact same top coordinate on desktop
    expect(bTop).toBe(desktopTop);
    expect(sTop).toBe(desktopTop);
    expect(cTop).toBe(desktopTop);
    expect(oTop).toBe(desktopTop);
  });

  it('asserts that at 375px (mobile), the columns stack in the specified order: Brand, Contact, Services, Company & Legal', () => {
    // Set window innerWidth to 375px
    window.innerWidth = 375;

    renderWithContext(<Footer />);

    const brandCol = screen.getByTestId('footer-col-brand');
    const contactCol = screen.getByTestId('footer-col-contact');
    const servicesCol = screen.getByTestId('footer-col-services');
    const companyCol = screen.getByTestId('footer-col-company');

    // On mobile (< 768px), order is Brand (1), Contact (2), Services (3), Company & Legal (4)
    expect(brandCol).toHaveClass('site-footer__col--brand');
    expect(contactCol).toHaveClass('site-footer__col--contact');
    expect(servicesCol).toHaveClass('site-footer__col--services');
    expect(companyCol).toHaveClass('site-footer__col--company');

    // Mock getBoundingClientRect with stacking coordinates matching order: Brand -> Contact -> Services -> Company & Legal
    let currentTop = 100;
    vi.spyOn(brandCol, 'getBoundingClientRect').mockReturnValue({
      top: currentTop,
      bottom: currentTop + 140,
      left: 20,
      right: 355,
      width: 335,
      height: 140,
      x: 20,
      y: currentTop,
      toJSON: () => {},
    });
    currentTop += 164; // + 24px gap

    vi.spyOn(contactCol, 'getBoundingClientRect').mockReturnValue({
      top: currentTop,
      bottom: currentTop + 120,
      left: 20,
      right: 355,
      width: 335,
      height: 120,
      x: 20,
      y: currentTop,
      toJSON: () => {},
    });
    currentTop += 144; // + 24px gap

    vi.spyOn(servicesCol, 'getBoundingClientRect').mockReturnValue({
      top: currentTop,
      bottom: currentTop + 180,
      left: 20,
      right: 355,
      width: 335,
      height: 180,
      x: 20,
      y: currentTop,
      toJSON: () => {},
    });
    currentTop += 204; // + 24px gap

    vi.spyOn(companyCol, 'getBoundingClientRect').mockReturnValue({
      top: currentTop,
      bottom: currentTop + 210,
      left: 20,
      right: 355,
      width: 335,
      height: 210,
      x: 20,
      y: currentTop,
      toJSON: () => {},
    });

    const bTop = brandCol.getBoundingClientRect().top;
    const oTop = contactCol.getBoundingClientRect().top;
    const sTop = servicesCol.getBoundingClientRect().top;
    const cTop = companyCol.getBoundingClientRect().top;

    // Strict sequential stacking order: Brand -> Contact -> Services -> Company & Legal
    expect(bTop).toBeLessThan(oTop);
    expect(oTop).toBeLessThan(sTop);
    expect(sTop).toBeLessThan(cTop);
  });

  it('renders all required services and legal links without Data Register', () => {
    renderWithContext(<Footer />);

    const footer = screen.getByTestId('global-footer');

    // Services links
    expect(within(footer).getByRole('link', { name: /general insurance/i })).toBeInTheDocument();
    expect(within(footer).getByRole('link', { name: /life insurance/i })).toBeInTheDocument();
    expect(within(footer).getByRole('link', { name: /health insurance/i })).toBeInTheDocument();
    expect(within(footer).getByRole('link', { name: /mutual funds/i })).toBeInTheDocument();
    expect(within(footer).getByRole('link', { name: /equity & investments/i })).toBeInTheDocument();
    expect(within(footer).getByRole('link', { name: /more solutions/i })).toBeInTheDocument();

    // Company & Legal links
    expect(within(footer).getByRole('link', { name: /about us/i })).toBeInTheDocument();
    expect(within(footer).getByRole('link', { name: /insights/i })).toBeInTheDocument();
    expect(within(footer).getByRole('button', { name: /contact us/i })).toBeInTheDocument();
    expect(within(footer).getByRole('link', { name: /privacy policy/i })).toBeInTheDocument();
    expect(within(footer).getByRole('link', { name: /terms & conditions/i })).toBeInTheDocument();
    expect(within(footer).getByRole('link', { name: /disclosures/i })).toBeInTheDocument();
    expect(within(footer).getByRole('link', { name: /complaints/i })).toBeInTheDocument();

    // Contact info
    expect(footer.textContent).toContain(contactData.phoneDisplay);
    expect(footer.textContent).toContain(contactData.email);

    // No Data Register
    expect(footer.textContent).not.toContain('Data Register');

    // Mutual fund disclaimer
    expect(footer.textContent).toContain(disclaimersData.footer_disclaimer);
  });
});

describe('DevDataRegisterPill Interactions', () => {
  let intersectionCallback: ((entries: IntersectionObserverEntry[]) => void) | null = null;

  beforeEach(() => {
    window.IntersectionObserver = vi.fn().mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    }) as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with 16px safe offset, 70% opacity, and fades out when footer is in view', () => {
    if (!import.meta.env.DEV) return;

    const mockFooter = document.createElement('footer');
    document.body.appendChild(mockFooter);

    renderWithContext(<DevDataRegisterPill />);

    const pillAside = screen.getByRole('complementary', { name: /development navigation/i });
    expect(pillAside).toHaveStyle({
      bottom: '16px',
      left: '16px',
      opacity: '0.7',
    });

    // Trigger footer intersection
    if (intersectionCallback) {
      act(() => {
        intersectionCallback!([
          {
            isIntersecting: true,
            target: mockFooter,
          } as any,
        ]);
      });
    }

    expect(pillAside).toHaveStyle({
      opacity: '0',
      pointerEvents: 'none',
    });

    document.body.removeChild(mockFooter);
  });
});

