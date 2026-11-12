import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminDashboard } from '../src/pages/admin/AdminDashboard';
import { AdminShell } from '../src/components/admin/AdminShell';
import { MockAuthProvider } from '../src/context/MockAuthContext';
import { api } from '../src/api/client';
import { DashboardMetrics, FollowupsCountResponse } from '../src/api/types';

describe('Admin Dashboard Dynamic Live Data Verification Suite', () => {
  let testQueryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    testQueryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const renderDashboard = () => {
    return render(
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
  };

  it('proves zero-state behavior: renders all zeroes and empty indicators when database is empty', async () => {
    const emptyMetrics: DashboardMetrics = {
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
        change_pct: null,
        previous_period_count: 0,
        current_period_count: 0,
        total_leads: 0,
      },
      by_status: { new: 0, contacted: 0, in_progress: 0, resolved: 0, closed: 0 },
      by_service: [],
      by_month: [
        { month_key: '2026-10', month_label: 'Oct 2026', enquiries: 0, conversions: 0 },
        { month_key: '2026-11', month_label: 'Nov 2026', enquiries: 0, conversions: 0 },
      ],
      by_source: [],
      latest_enquiries: [],
      follow_ups_due: [],
      generated_at: new Date().toISOString(),
    };

    const emptyFollowups: FollowupsCountResponse = {
      count: 0,
      due_today: 0,
      overdue: 0,
      upcoming: 0,
    };

    vi.spyOn(api.admin, 'getDashboard').mockResolvedValue(emptyMetrics);
    vi.spyOn(api.admin, 'getFollowupsCount').mockResolvedValue(emptyFollowups);

    renderDashboard();

    // 1. Headline card shows 0 and safe change string
    expect(await screen.findByText(/new enquiries \(last 30 days\)/i)).toBeInTheDocument();
    expect(screen.getByText('— vs prev')).toBeInTheDocument();

    // 2. Follow-ups shows all caught up
    expect(screen.getByText(/all caught up/i)).toBeInTheDocument();

    // 3. Converted rate shows 0%
    expect(screen.getByText(/0% lead-to-client conversion rate/i)).toBeInTheDocument();

    // 4. Latest enquiries table shows clean empty state
    expect(screen.getByText(/no enquiries yet/i)).toBeInTheDocument();

    // 5. Scheduled followups tile shows clean empty state
    expect(screen.getByText(/no follow-ups due today\. you are completely caught up!/i)).toBeInTheDocument();

    // 6. Service conversion shows clean empty state
    expect(screen.getByText(/no service conversion records in this period/i)).toBeInTheDocument();
  });

  it('proves dynamic updates: changes numbers, charts, and lists when new enquiries are received', async () => {
    // Initial State: 1 lead
    const initialMetrics: DashboardMetrics = {
      total_enquiries: 1,
      new_enquiries: 1,
      in_progress_enquiries: 0,
      resolved_enquiries: 0,
      service_breakdown: [],
      monthly_trends: [],
      recent_enquiries: [],
      summary: {
        new_this_month: 1,
        new_today: 1,
        converted_this_month: 0,
        in_progress_total: 0,
        change_pct: null,
        previous_period_count: 0,
        current_period_count: 1,
        total_leads: 1,
      },
      by_status: { new: 1, contacted: 0, in_progress: 0, resolved: 0, closed: 0 },
      by_service: [
        { service_slug: 'health-insurance', name: 'Health Insurance', count: 1, converted_count: 0, conversion_rate: 0 },
      ],
      by_month: [
        { month_key: '2026-11', month_label: 'Nov 2026', enquiries: 1, conversions: 0 },
      ],
      by_source: [{ source: 'website', label: 'Website Form', count: 1 }],
      latest_enquiries: [
        {
          id: 101,
          reference_id: 'LC-ENQ-101',
          name: 'Pooja Bhatt',
          mobile: '+91 99090 88776',
          status: 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          consent: true,
          services: [{ service_slug: 'health-insurance' }],
        },
      ],
      follow_ups_due: [],
      generated_at: new Date().toISOString(),
    };

    const getDashboardSpy = vi.spyOn(api.admin, 'getDashboard').mockResolvedValue(initialMetrics);
    vi.spyOn(api.admin, 'getFollowupsCount').mockResolvedValue({ count: 0, due_today: 0, overdue: 0, upcoming: 0 });

    renderDashboard();

    expect(await screen.findByText(/LC-ENQ-101/i)).toBeInTheDocument();
    expect(screen.getByText('Pooja Bhatt')).toBeInTheDocument();

    // Mutate Data: New lead inserted with scheduled follow-up
    const updatedMetrics: DashboardMetrics = {
      ...initialMetrics,
      total_enquiries: 2,
      summary: {
        ...initialMetrics.summary!,
        current_period_count: 2,
        total_leads: 2,
        change_pct: 100.0,
      },
      latest_enquiries: [
        {
          id: 102,
          reference_id: 'LC-ENQ-102',
          name: 'Hiteshbhai Soni',
          mobile: '+91 98250 44556',
          status: 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          consent: true,
          services: [{ service_slug: 'mutual-funds' }],
        },
        ...initialMetrics.latest_enquiries!,
      ],
      follow_ups_due: [
        {
          id: 55,
          enquiry_id: 102,
          reference_id: 'LC-ENQ-102',
          client_name: 'Hiteshbhai Soni',
          phone: '+919825044556',
          service_slug: 'mutual-funds',
          service_name: 'Mutual Funds',
          due_at: new Date().toISOString(),
          topic: 'SIP Portfolio Allocation',
          is_overdue: false,
        },
      ],
    };

    getDashboardSpy.mockResolvedValue(updatedMetrics);

    // Invalidate query to trigger refetch
    await act(async () => {
      await testQueryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    });

    // Verify dynamic response reflected in UI
    await waitFor(() => {
      expect(screen.getAllByText('Hiteshbhai Soni').length).toBeGreaterThan(0);
      expect(screen.getByText(/LC-ENQ-102/i)).toBeInTheDocument();
      expect(screen.getByText(/SIP Portfolio Allocation/i)).toBeInTheDocument();
      expect(screen.getByText('+100.0% vs prev')).toBeInTheDocument();
    });
  });
});
