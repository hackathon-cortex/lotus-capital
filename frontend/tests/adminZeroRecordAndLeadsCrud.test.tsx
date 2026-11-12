import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as fs from 'fs';
import * as path from 'path';
import { api } from '../src/api/client';
import { AdminLeads } from '../src/pages/admin/AdminLeads';
import { AdminAddEnquiryDrawer } from '../src/pages/admin/AdminAddEnquiryDrawer';
import { AdminDashboard } from '../src/pages/admin/AdminDashboard';
import { AdminShell } from '../src/components/admin/AdminShell';
import { MockAuthProvider } from '../src/context/MockAuthContext';
import { BackendEnquiry } from '../src/api/types';

describe('Admin Zero-Record State & Leads CRUD Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Brand Color & Emoji Compliance in Leads Files', () => {
    const leadsFiles = [
      'src/pages/admin/AdminAddEnquiryDrawer.tsx',
      'src/pages/admin/AdminLeadDetailModal.tsx',
      'src/pages/admin/AdminLeads.tsx',
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

    it('contains ONLY approved Lotus Capital brand hex colors across all leads admin components', () => {
      leadsFiles.forEach((relPath) => {
        const fullPath = path.resolve(__dirname, '..', relPath);
        const content = fs.readFileSync(fullPath, 'utf8');
        const hexMatches = content.match(/#[0-9a-fA-F]{3,8}/g) || [];

        hexMatches.forEach((hex) => {
          const lower = hex.toLowerCase();
          expect(
            ALLOWED_BRAND_HEX_WHITELIST.has(lower),
            `File ${relPath} contains non-brand hex color "${hex}". Must strictly adhere to brand palette.`
          ).toBe(true);
        });
      });
    });

    it('contains ZERO unicode emojis in leads admin components', () => {
      const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      leadsFiles.forEach((relPath) => {
        const fullPath = path.resolve(__dirname, '..', relPath);
        const content = fs.readFileSync(fullPath, 'utf8');
        expect(
          emojiRegex.test(content),
          `File ${relPath} contains prohibited emoji characters.`
        ).toBe(false);
      });
    });
  });

  describe('Zero-Record Dashboard & Sidebar State', () => {
    it('renders clean zero state on Dashboard when total enquiries is 0', async () => {
      vi.spyOn(api.admin, 'getDashboard').mockResolvedValue({
        total_enquiries: 0,
        new_enquiries: 0,
        in_progress_enquiries: 0,
        resolved_enquiries: 0,
        service_breakdown: [],
        monthly_trends: [],
        recent_enquiries: [],
        summary: {
          new_this_month: 0,
          new_today: 0,
          converted_this_month: 0,
          in_progress_total: 0,
          previous_period_count: 0,
          current_period_count: 0,
          total_leads: 0,
        },
        by_status: {},
        by_service: [],
        by_month: [],
        by_source: [],
        latest_enquiries: [],
        follow_ups_due: [],
      } as any);

      vi.spyOn(api.admin, 'getFollowupsCount').mockResolvedValue({
        count: 0,
        due_today: 0,
        overdue: 0,
        upcoming: 0,
      });

      const testQueryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });

      render(
        <HelmetProvider>
          <QueryClientProvider client={testQueryClient}>
            <MemoryRouter initialEntries={['/admin/dashboard']}>
              <MockAuthProvider>
                <AdminShell dueFollowupsCount={0}>
                  <AdminDashboard />
                </AdminShell>
              </MockAuthProvider>
            </MemoryRouter>
          </QueryClientProvider>
        </HelmetProvider>
      );

      // Follow-up sidebar badge should not display when count is 0
      const sidebarBadge = screen.queryByLabelText(/follow-ups due/i);
      expect(sidebarBadge).toBeNull();

      // Heading and action button
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1, name: /Welcome,/i })).toBeInTheDocument();
      });

      // Quick "Add enquiry" button in header
      const addBtns = screen.getAllByRole('button', { name: /Add enquiry/i });
      expect(addBtns.length).toBeGreaterThan(0);

      // Recent Enquiries table should show empty state
      await waitFor(() => {
        expect(screen.getByText(/No enquiries yet/i)).toBeInTheDocument();
      });
    });
  });

  describe('Zero-Record Leads Management View', () => {
    it('displays empty state with "Add enquiry" action when database has 0 records', async () => {
      vi.spyOn(api.admin, 'getEnquiries').mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        page_size: 100,
        total_pages: 0,
      });

      render(
        <HelmetProvider>
          <MemoryRouter initialEntries={['/admin/leads']}>
            <MockAuthProvider>
              <AdminLeads />
            </MockAuthProvider>
          </MemoryRouter>
        </HelmetProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/No enquiries found/i)).toBeInTheDocument();
      });

      // Action button to open drawer
      const addBtns = screen.getAllByRole('button', { name: /Add enquiry/i });
      expect(addBtns.length).toBeGreaterThan(0);
    });
  });

  describe('Manual Enquiry Creation Drawer', () => {
    it('validates 10-digit mobile number, checks duplicate, and requires consent', async () => {
      const mockCheckMobile = vi.spyOn(api.admin, 'checkMobile').mockResolvedValue({
        id: 42,
        reference_id: 'LC-ENQ-00042',
        full_name: 'Existing Client',
        mobile: '9825012345',
        service_slug: 'mutual-funds',
        status: 'contacted',
      } as any);

      const mockCreateEnquiry = vi.spyOn(api.admin, 'createEnquiry').mockResolvedValue({
        id: 101,
        reference_id: 'LC-ENQ-00101',
        full_name: 'Rajesh Vora',
        mobile: '9825099999',
        status: 'new',
      } as any);

      const onClose = vi.fn();
      const onEnquiryCreated = vi.fn();

      render(
        <AdminAddEnquiryDrawer
          isOpen={true}
          onClose={onClose}
          onEnquiryCreated={onEnquiryCreated}
        />
      );

      // Verify title
      expect(screen.getByText(/Add New Enquiry/i)).toBeInTheDocument();

      // Form inputs
      const nameInput = screen.getByLabelText(/Full Name/i);
      const mobileInput = screen.getByLabelText(/Mobile \(10-Digit\)/i);
      const consentCheckbox = screen.getByRole('checkbox', { name: /I confirm the client gave verbal or written consent/i });

      // 1. Enter invalid short name and invalid mobile
      fireEvent.change(nameInput, { target: { value: 'A' } });
      fireEvent.change(mobileInput, { target: { value: '123' } });
      
      const submitBtn = screen.getByRole('button', { name: /Create Enquiry/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/Full name must be at least 2 characters/i)).toBeInTheDocument();
        expect(screen.getByText(/Enter a valid 10-digit Indian mobile/i)).toBeInTheDocument();
      });

      // 2. Enter duplicate mobile and test live duplicate check
      fireEvent.change(mobileInput, { target: { value: '9825012345' } });
      await waitFor(() => {
        expect(mockCheckMobile).toHaveBeenCalledWith('9825012345');
      }, { timeout: 1500 });

      await waitFor(() => {
        expect(screen.getByText(/Duplicate mobile detected/i)).toBeInTheDocument();
      }, { timeout: 1500 });

      // 3. Enter clean fresh mobile
      mockCheckMobile.mockResolvedValue(null as any);
      fireEvent.change(nameInput, { target: { value: 'Rajesh Vora' } });
      fireEvent.change(mobileInput, { target: { value: '9825099999' } });

      await waitFor(() => {
        expect(mockCheckMobile).toHaveBeenCalledWith('9825099999');
      }, { timeout: 1500 });

      await waitFor(() => {
        expect(screen.queryByText(/Duplicate mobile detected/i)).toBeNull();
      });

      // Uncheck consent checkbox
      fireEvent.click(consentCheckbox);
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/Consent disclaimer is required/i)).toBeInTheDocument();
      });

      // Re-check consent and submit
      fireEvent.click(consentCheckbox);
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockCreateEnquiry).toHaveBeenCalledWith(
          expect.objectContaining({
            full_name: 'Rajesh Vora',
            mobile: '9825099999',
            consent: true,
          })
        );
        expect(onEnquiryCreated).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe('Soft-Delete, Trash & Permanent Delete Operations', () => {
    const mockLead: BackendEnquiry = {
      id: 99,
      reference_id: 'LC-ENQ-00099',
      name: 'Sunil Mehta',
      full_name: 'Sunil Mehta',
      mobile: '9898011223',
      email: 'sunil@example.com',
      service_slug: 'mutual-funds',
      service_name: 'Mutual Funds',
      status: 'new',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_demo: false,
    };

    it('supports moving lead to trash with reason and provides undo toast', async () => {
      vi.spyOn(api.admin, 'getEnquiries').mockResolvedValue({
        items: [mockLead],
        total: 1,
        page: 1,
        page_size: 100,
        total_pages: 1,
      });

      const mockDelete = vi.spyOn(api.admin, 'deleteEnquiry').mockResolvedValue({} as any);

      render(
        <HelmetProvider>
          <MemoryRouter initialEntries={['/admin/leads']}>
            <MockAuthProvider>
              <AdminLeads />
            </MockAuthProvider>
          </MemoryRouter>
        </HelmetProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Sunil Mehta')).toBeInTheDocument();
      });

      // Find trash action button
      const trashBtn = screen.getByTitle(/Move to trash/i);
      fireEvent.click(trashBtn);

      // Confirm modal opens with reasons
      expect(screen.getByText(/Move Enquiry to Trash/i)).toBeInTheDocument();
      const confirmMoveBtn = screen.getByTestId('confirm-trash-btn');
      fireEvent.click(confirmMoveBtn);

      await waitFor(() => {
        expect(mockDelete).toHaveBeenCalledWith(99, 'other');
      });

      // Undo toast should appear
      await waitFor(() => {
        expect(screen.getByText(/Moved to trash/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Undo/i })).toBeInTheDocument();
      });
    });

    it('requires typing "DELETE" to permanently purge a trashed enquiry', async () => {
      const trashedLead: BackendEnquiry = {
        ...mockLead,
        deleted_at: new Date().toISOString(),
        delete_reason: 'duplicate',
      };

      vi.spyOn(api.admin, 'getEnquiries').mockImplementation(async (params) => {
        if (params?.is_deleted) {
          return {
            items: [trashedLead],
            total: 1,
            page: 1,
            page_size: 100,
            total_pages: 1,
          };
        }
        return {
          items: [],
          total: 0,
          page: 1,
          page_size: 100,
          total_pages: 0,
        };
      });

      const mockPermDelete = vi.spyOn(api.admin, 'permanentDeleteEnquiry').mockResolvedValue({} as any);

      render(
        <HelmetProvider>
          <MemoryRouter initialEntries={['/admin/leads']}>
            <MockAuthProvider>
              <AdminLeads />
            </MockAuthProvider>
          </MemoryRouter>
        </HelmetProvider>
      );

      // Switch to Trash tab
      const trashTab = await screen.findByRole('button', { name: /Trash/i });
      fireEvent.click(trashTab);

      await waitFor(() => {
        expect(screen.getByText('Sunil Mehta')).toBeInTheDocument();
      });

      // Click permanent delete
      const permDeleteBtn = screen.getByTitle('Permanent Delete');
      fireEvent.click(permDeleteBtn);

      // Verify permanent delete modal
      expect(screen.getByText(/Permanently Delete/i)).toBeInTheDocument();
      const confirmBtn = screen.getByTestId('confirm-permanent-delete-btn');
      
      // Initially disabled
      expect(confirmBtn).toBeDisabled();

      // Type incorrect confirmation
      const confirmInput = screen.getByPlaceholderText('Type DELETE');
      fireEvent.change(confirmInput, { target: { value: 'del' } });
      expect(confirmBtn).toBeDisabled();

      // Type exact "DELETE"
      fireEvent.change(confirmInput, { target: { value: 'DELETE' } });
      expect(confirmBtn).not.toBeDisabled();

      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(mockPermDelete).toHaveBeenCalledWith(99);
      });
    });
  });
});
