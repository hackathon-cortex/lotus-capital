import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import * as fs from 'fs';
import * as path from 'path';
import { AdminShell } from '../src/components/admin/AdminShell';
import { AdminDashboard } from '../src/pages/admin/AdminDashboard';
import { MockAuthProvider } from '../src/context/MockAuthContext';

const renderAdmin = (initialRoute = '/admin/dashboard') => {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <MockAuthProvider>
          <AdminShell dueFollowupsCount={6}>
            <AdminDashboard />
          </AdminShell>
        </MockAuthProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
};

describe('Admin Shell & Dashboard (v2 Glass & Bento Grid)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Brand Color & Icon Compliance', () => {
    const adminFiles = [
      'src/styles/admin.css',
      'src/components/admin/AdminIcons.tsx',
      'src/components/admin/AdminBackdrop.tsx',
      'src/components/admin/GlassPanel.tsx',
      'src/components/admin/AdminSidebar.tsx',
      'src/components/admin/AdminTopbar.tsx',
      'src/components/admin/AdminShell.tsx',
      'src/components/admin/BentoWidgets.tsx',
      'src/components/admin/BentoDataWidgets.tsx',
      'src/pages/admin/AdminDashboard.tsx',
      'src/pages/admin/AdminPlaceholder.tsx',
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
      { name: 'success-green', hex: '#28a745' },
      { name: 'ledger-gold', hex: '#b7893a' },
      { name: 'warm-ivory', hex: '#fbf5e9' },
      { name: 'mint-tint', hex: '#e6f5ef' },
      { name: 'purple', hex: '#7c3aed' },
      { name: 'coral', hex: '#ff6b6b' },
    ];

    it('contains ONLY approved Lotus Capital brand hex colors across all admin files', () => {
      adminFiles.forEach((relPath) => {
        const fullPath = path.resolve(__dirname, '..', relPath);
        const content = fs.readFileSync(fullPath, 'utf8');
        const hexMatches = content.match(/#[0-9a-fA-F]{3,8}/g) || [];

        hexMatches.forEach((hex) => {
          const lower = hex.toLowerCase();
          expect(
            ALLOWED_BRAND_HEX_WHITELIST.has(lower),
            `File ${relPath} contains non-brand hex color "${hex}". Admin shell must strictly use brand palette only.`
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

    it('contains ZERO emoji icons in admin components and markup', () => {
      const forbiddenEmojis = ['📊', '📥', '⏰', '📈', '📄', '❓', '👥', '🏆', '💬', '✍️', '🖼️', '🛡️', '📋', '⚙️', '🚪', '🔍', '🚗', '🏥'];

      adminFiles.forEach((relPath) => {
        const fullPath = path.resolve(__dirname, '..', relPath);
        const content = fs.readFileSync(fullPath, 'utf8');

        forbiddenEmojis.forEach((emoji) => {
          expect(
            content.includes(emoji),
            `File ${relPath} contains emoji "${emoji}". All icons must be consistent SVG line icons.`
          ).toBe(false);
        });
      });
    });
  });

  describe('Admin Shell Structure & Layout', () => {
    it('renders the admin shell with backdrop watermark and floating glass panel', () => {
      renderAdmin();

      expect(document.querySelector('.admin-backdrop')).toBeInTheDocument();
      expect(document.querySelector('.admin-backdrop__watermark-wrap')).toBeInTheDocument();
      expect(document.querySelector('.admin-glass-panel')).toBeInTheDocument();
    });

    it('renders the sidebar with brand logo, "Lotus Admin", and categorized navigation items', () => {
      renderAdmin();

      const sidebar = screen.getByRole('complementary', { name: /admin navigation/i });
      expect(sidebar).toBeInTheDocument();

      // Check section titles
      expect(within(sidebar).getByText('Overview')).toBeInTheDocument();
      expect(within(sidebar).getByText('Leads')).toBeInTheDocument();
      expect(within(sidebar).getByText('Content')).toBeInTheDocument();
      expect(within(sidebar).getByText('Admin')).toBeInTheDocument();

      // Check navigation items
      expect(within(sidebar).getByText('Dashboard')).toBeInTheDocument();
      expect(within(sidebar).getByText('Enquiries & Leads')).toBeInTheDocument();
      expect(within(sidebar).getByText('Follow-ups')).toBeInTheDocument();
      expect(within(sidebar).getByText('Page Content')).toBeInTheDocument();

      // Check due count badge on follow-ups
      expect(within(sidebar).getByLabelText(/6 follow-ups due/i)).toBeInTheDocument();
    });

    it('displays user info without "(Mock Admin)" in user chip and dashboard header', () => {
      renderAdmin();

      // Name should be "Abhilash Chudasama" without "(Mock Admin)"
      const names = screen.getAllByText(/Abhilash Chudasama/i);
      expect(names.length).toBeGreaterThan(0);
      names.forEach((el) => {
        expect(el.textContent).not.toContain('Mock Admin');
      });
    });

    it('renders the sticky topbar with glass search input, status dot, and public site link', () => {
      renderAdmin();

      const searchInput = screen.getByPlaceholderText(/search leads/i);
      expect(searchInput).toBeInTheDocument();

      const publicLink = screen.getByRole('link', { name: /public site/i });
      expect(publicLink).toBeInTheDocument();
      expect(publicLink).toHaveAttribute('href', '/');

      expect(screen.getByText(/fastapi connected/i)).toBeInTheDocument();
    });

    it('toggles sidebar collapse to 72px rail and saves state in localStorage', () => {
      renderAdmin();

      const toggleBtn = screen.getByRole('button', { name: /collapse sidebar/i });
      expect(toggleBtn).toBeInTheDocument();

      fireEvent.click(toggleBtn);
      expect(localStorage.getItem('lotus_admin_sidebar_collapsed')).toBe('true');

      // Expand again
      const expandBtn = screen.getByRole('button', { name: /expand sidebar/i });
      fireEvent.click(expandBtn);
      expect(localStorage.getItem('lotus_admin_sidebar_collapsed')).toBe('false');
    });
  });

  describe('Bento Grid & Dashboard Tiles', () => {
    it('renders the 12-column Bento Grid on /admin/dashboard', () => {
      renderAdmin();

      expect(document.querySelector('.admin-bento-grid')).toBeInTheDocument();
    });

    it('renders Tile A (Headline) with count 42, month label, and navy up-arrow (no green)', () => {
      renderAdmin();

      expect(screen.getByText(/new enquiries \(oct 2026\)/i)).toBeInTheDocument();
      expect(screen.getByText('+18.5% vs previous month')).toBeInTheDocument();
      // Verify no element contains green color style
      const upChip = screen.getByText('+18.5% vs previous month').parentElement;
      expect(upChip).toHaveStyle({ color: '#123D67' });
    });

    it('renders Tile B (Follow-ups Due Today) with count 6, split text, and red dot', () => {
      renderAdmin();

      expect(screen.getByText(/follow-ups due today/i)).toBeInTheDocument();
      expect(screen.getByText(/3 scheduled morning • 3 afternoon/i)).toBeInTheDocument();
      expect(document.querySelector('.admin-pulsing-dot')).toBeInTheDocument();
    });

    it('renders Tile C (Converted This Month) with count 18 and conversion rate 42.8%', () => {
      renderAdmin();

      expect(screen.getByText(/converted this month/i)).toBeInTheDocument();
      expect(screen.getByText(/42.8% lead-to-client conversion rate/i)).toBeInTheDocument();
    });

    it('renders Tile D (Quick Operations) with 4 action chips linking to routes', () => {
      renderAdmin();

      expect(screen.getByRole('link', { name: /add lead/i })).toHaveAttribute('href', '/admin/leads');
      expect(screen.getByRole('link', { name: /edit content/i })).toHaveAttribute('href', '/admin/content/pages');
      expect(screen.getByRole('link', { name: /upload media/i })).toHaveAttribute('href', '/admin/media');
      expect(screen.getByRole('link', { name: /update faqs/i })).toHaveAttribute('href', '/admin/content/faqs');
    });

    it('renders Tile E (Enquiries Trend Chart) with service filter pills', () => {
      renderAdmin();

      expect(screen.getByText(/enquiries trend \(last 6 months\)/i)).toBeInTheDocument();
      const allFilter = screen.getByRole('radio', { name: /^all/i });
      const insuranceFilter = screen.getByRole('radio', { name: /^insurance/i });
      expect(allFilter).toHaveClass('is-active');

      fireEvent.click(insuranceFilter);
      expect(insuranceFilter).toHaveClass('is-active');
      expect(allFilter).not.toHaveClass('is-active');
    });

    it('renders Tile G (Latest Inbound Enquiries) table with 5 recent leads and status dropdowns', () => {
      renderAdmin();

      expect(screen.getByText(/latest inbound enquiries/i)).toBeInTheDocument();
      expect(screen.getAllByText('Rajeshbhai Patel').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Dr. Meena Shah').length).toBeGreaterThan(0);

      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThan(0);
      fireEvent.change(selects[0], { target: { value: 'Contacted' } });
      expect(selects[0]).toHaveValue('Contacted');
    });

    it('renders Tile H (Today\'s Scheduled Follow-ups) with Call and WhatsApp quick links', () => {
      renderAdmin();

      expect(screen.getByText(/today's scheduled follow-ups/i)).toBeInTheDocument();
      const callLinks = screen.getAllByTitle(/call rajeshbhai patel/i);
      expect(callLinks.length).toBeGreaterThan(0);
      expect(callLinks[0]).toHaveAttribute('href', 'tel:+919825011223');
    });
  });
});
