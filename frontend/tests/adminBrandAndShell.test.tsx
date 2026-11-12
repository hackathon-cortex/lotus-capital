import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as fs from 'fs';
import * as path from 'path';
import { AdminShell } from '../src/components/admin/AdminShell';
import { AdminDashboard } from '../src/pages/admin/AdminDashboard';
import { MockAuthProvider } from '../src/context/MockAuthContext';
import { api } from '../src/api/client';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderAdmin = (initialRoute = '/admin/dashboard') => {
  return render(
    <HelmetProvider>
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <MockAuthProvider>
            <AdminShell dueFollowupsCount={6}>
              <AdminDashboard />
            </AdminShell>
          </MockAuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

describe('Admin Shell & Dashboard (v2 Glass & Bento Grid)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    vi.spyOn(api.admin, 'getDashboard').mockResolvedValue({
      total_enquiries: 42,
      new_enquiries: 42,
      in_progress_enquiries: 6,
      resolved_enquiries: 18,
      service_breakdown: [],
      monthly_trends: [],
      recent_enquiries: [],
      summary: {
        new_this_month: 42,
        new_today: 4,
        converted_this_month: 18,
        in_progress_total: 6,
        change_pct: 18.5,
        previous_period_count: 36,
        current_period_count: 42,
        total_leads: 42,
      },
      by_status: { new: 20, contacted: 10, in_progress: 6, resolved: 18, closed: 0 },
      by_service: [
        { service_slug: 'health-insurance', name: 'Health Insurance', count: 29, converted_count: 14, conversion_rate: 48.2 },
        { service_slug: 'mutual-funds', name: 'Mutual Funds', count: 24, converted_count: 13, conversion_rate: 54.0 },
      ],
      by_month: [
        { month_key: '2026-05', month_label: 'May 2026', enquiries: 18, conversions: 5 },
        { month_key: '2026-06', month_label: 'Jun 2026', enquiries: 24, conversions: 7 },
        { month_key: '2026-07', month_label: 'Jul 2026', enquiries: 28, conversions: 9 },
        { month_key: '2026-08', month_label: 'Aug 2026', enquiries: 31, conversions: 11 },
        { month_key: '2026-09', month_label: 'Sep 2026', enquiries: 36, conversions: 14 },
        { month_key: '2026-10', month_label: 'Oct 2026', enquiries: 42, conversions: 18 },
      ],
      by_source: [{ source: 'website', label: 'Website Form', count: 42 }],
      latest_enquiries: [
        {
          id: 1042,
          reference_id: 'ENQ-1042',
          name: 'Rajeshbhai Patel',
          mobile: '+91 98250 11223',
          status: 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          consent: true,
          services: [{ service_slug: 'health-insurance' }],
        },
        {
          id: 1041,
          reference_id: 'ENQ-1041',
          name: 'Dr. Meena Shah',
          mobile: '+91 94260 44556',
          status: 'contacted',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          consent: true,
          services: [{ service_slug: 'mutual-funds' }],
        },
      ],
      follow_ups_due: [
        {
          id: 1,
          enquiry_id: 1042,
          reference_id: 'ENQ-1042',
          client_name: 'Rajeshbhai Patel',
          phone: '+919825011223',
          service_slug: 'health-insurance',
          service_name: 'Health Insurance',
          due_at: new Date().toISOString(),
          is_overdue: false,
        },
      ],
    } as any);

    vi.spyOn(api.admin, 'getFollowupsCount').mockResolvedValue({
      count: 6,
      due_today: 6,
      overdue: 0,
      upcoming: 0,
    });
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

    it('renders Tile A (Headline) with count 42, month label, and navy up-arrow (no green)', async () => {
      renderAdmin();

      expect(await screen.findByText(/new enquiries/i)).toBeInTheDocument();
      expect(screen.getByText('+18.5% vs prev')).toBeInTheDocument();
      // Verify no element contains green color style
      const upChip = screen.getByText('+18.5% vs prev').parentElement;
      expect(upChip).toHaveStyle({ color: '#123D67' });
    });

    it('renders Tile B (Follow-ups Due Today) with count 6, split text, and red dot', async () => {
      renderAdmin();

      expect(await screen.findByText(/follow-ups due today/i)).toBeInTheDocument();
      expect(screen.getByText(/0 overdue · 6 due today/i)).toBeInTheDocument();
      expect(document.querySelector('.admin-pulsing-dot')).toBeInTheDocument();
    });

    it('renders Tile C (Converted This Month) with count 18 and conversion rate', async () => {
      renderAdmin();

      expect(await screen.findByText(/converted this month/i)).toBeInTheDocument();
      expect(await screen.findByText(/42.9% lead-to-client conversion rate/i)).toBeInTheDocument();
    });

    it('renders Tile D (Quick Operations) with 4 action chips linking to routes', async () => {
      renderAdmin();

      expect(await screen.findByRole('link', { name: /add lead/i })).toHaveAttribute('href', '/admin/leads');
      expect(screen.getByRole('link', { name: /edit content/i })).toHaveAttribute('href', '/admin/content/pages');
      expect(screen.getByRole('link', { name: /upload media/i })).toHaveAttribute('href', '/admin/media');
      expect(screen.getByRole('link', { name: /update faqs/i })).toHaveAttribute('href', '/admin/content/faqs');
    });

    it('renders Tile E (Enquiries Trend Chart) with trend indicators', async () => {
      renderAdmin();

      expect(await screen.findByText(/enquiries trend/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /toggle accessible data table view/i })).toBeInTheDocument();
    });

    it('renders Tile G (Latest Inbound Enquiries) table with recent leads and status dropdowns', async () => {
      renderAdmin();

      expect(await screen.findByText(/latest inbound enquiries/i)).toBeInTheDocument();
      const names = await screen.findAllByText('Rajeshbhai Patel');
      expect(names.length).toBeGreaterThan(0);
      expect(screen.getByText('Dr. Meena Shah')).toBeInTheDocument();

      const tableTile = document.querySelector('.admin-bento-tile--latest-enquiries');
      expect(tableTile).toBeInTheDocument();
      const selects = within(tableTile as HTMLElement).getAllByRole('combobox');
      expect(selects.length).toBeGreaterThan(0);
      fireEvent.change(selects[0], { target: { value: 'Contacted' } });
      expect(selects[0]).toHaveValue('Contacted');
    });

    it('renders Tile H (Today\'s Scheduled Follow-ups) with Call and WhatsApp quick links', async () => {
      renderAdmin();

      expect(await screen.findByText(/today's scheduled follow-ups/i)).toBeInTheDocument();
      const callLink = await screen.findByTitle(/call rajeshbhai patel/i);
      expect(callLink).toBeInTheDocument();
      expect(callLink).toHaveAttribute('href', 'tel:+919825011223');
    });
  });
});
