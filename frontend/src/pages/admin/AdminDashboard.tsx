import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/MockAuthContext';
import { api } from '../../api/client';
import { DashboardMetrics, FollowupsCountResponse } from '../../api/types';
import {
  HeadlineTile,
  FollowupsTile,
  ConvertedTile,
  QuickActionsTile,
} from '../../components/admin/BentoWidgets';
import {
  EnquiriesChartTile,
  ServiceConversionTile,
  LatestEnquiriesTile,
  TodayFollowupsTile,
  EnquiryRow,
} from '../../components/admin/BentoDataWidgets';
import { AdminIcon } from '../../components/admin/AdminIcons';
import { AdminAddEnquiryDrawer } from './AdminAddEnquiryDrawer';
import { AdminToast } from '../../components/admin/AdminToast';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Dashboard Filter State
  const [range, setRange] = useState<string>('30d');
  const [service, setService] = useState<string>('all');
  const [assignee, setAssignee] = useState<string>('all');

  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, EnquiryRow['status']>>({});
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(() =>
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST'
  );

  const prevCountRef = useRef<number | null>(null);

  // TanStack Query for Dashboard Metrics (Live 60s polling & refetch on focus)
  const {
    data: metrics,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery<DashboardMetrics>({
    queryKey: ['admin', 'dashboard', range, service, assignee],
    queryFn: async () => {
      const params: { range?: string; service?: string; assignee?: string } = {};
      if (range) params.range = range;
      if (service && service !== 'all') params.service = service;
      if (assignee && assignee !== 'all') params.assignee = assignee;
      const res = await api.admin.getDashboard(params);
      setLastRefreshedAt(
        new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST'
      );
      return res;
    },
    refetchInterval: 60000,
    staleTime: 15000,
    refetchOnWindowFocus: true,
  });

  // Query for Follow-up counts (shared with sidebar badge)
  const { data: followupsCountData } = useQuery<FollowupsCountResponse>({
    queryKey: ['admin', 'followups-count'],
    queryFn: () => api.admin.getFollowupsCount(),
    refetchInterval: 60000,
    staleTime: 15000,
  });

  // Toast notification when live count increases
  useEffect(() => {
    if (metrics?.total_enquiries !== undefined) {
      if (prevCountRef.current !== null && metrics.total_enquiries > prevCountRef.current) {
        const diff = metrics.total_enquiries - prevCountRef.current;
        setToast({ type: 'success', message: `${diff} new client enquiry received.` });
      }
      prevCountRef.current = metrics.total_enquiries;
    }
  }, [metrics?.total_enquiries]);

  // Map latest enquiries to frontend table rows with optimistic override support
  const rawLatest = metrics?.latest_enquiries ?? metrics?.recent_enquiries ?? [];
  const enquiries: EnquiryRow[] = rawLatest.map((item: any) => {
    const id = item.reference_id || `ENQ-${item.id}`;
    let rowStatus: EnquiryRow['status'] = statusOverrides[id] || (
      item.status === 'contacted' ? 'Contacted' :
      item.status === 'in_progress' ? 'In Progress' :
      item.status === 'resolved' ? 'Converted' :
      item.status === 'closed' ? 'Closed' : 'New'
    );

    const sName = item.services?.[0]?.service_slug
      ? item.services[0].service_slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
      : 'Advisory Consult';

    const d = new Date(item.created_at);
    const followUpDate = !isNaN(d.getTime())
      ? d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
      : 'Recent';

    return {
      id,
      name: item.name,
      phone: item.mobile,
      service: sName,
      status: rowStatus,
      assignee: item.assigned_to ? `Staff #${item.assigned_to}` : 'Unassigned',
      followUpDate,
    };
  });

  // Handle lead status change from table dropdown
  const handleStatusChange = async (id: string, newStatus: EnquiryRow['status']) => {
    setStatusOverrides((prev) => ({ ...prev, [id]: newStatus }));
    const numericId = parseInt(id.replace(/\D/g, ''), 10);
    if (!isNaN(numericId)) {
      const backendStatusMap: Record<string, 'new' | 'contacted' | 'in_progress' | 'resolved' | 'closed'> = {
        New: 'new',
        Contacted: 'contacted',
        Qualified: 'in_progress',
        'In Progress': 'in_progress',
        Converted: 'resolved',
        Closed: 'closed',
      };
      try {
        await api.admin.updateEnquiry(numericId, { status: backendStatusMap[newStatus] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'followups-count'] });
        setToast({ type: 'success', message: `Enquiry status updated to ${newStatus}.` });
      } catch {
        setToast({ type: 'error', message: 'Failed to update enquiry status.' });
      }
    }
  };

  // Headline metrics calculations
  const headlineCount = metrics?.summary?.current_period_count ?? metrics?.total_enquiries ?? 0;
  const changePct = metrics?.summary?.change_pct;
  const pctChangeStr =
    changePct !== null && changePct !== undefined
      ? `${changePct >= 0 ? '+' : ''}${changePct.toFixed(1)}% vs prev`
      : '— vs prev';

  const monthlyTrend = metrics?.by_month && metrics.by_month.length > 0
    ? metrics.by_month.map((m) => m.enquiries)
    : [0, headlineCount];

  const headlineMonthLabel = range === '30d' ? 'Last 30 Days' : range === '90d' ? 'Last 90 Days' : 'Last 12 Months';

  // Followups tile metrics
  const followupsTodayCount = followupsCountData?.due_today ?? (metrics?.follow_ups_due?.length ?? 0);
  const followupsOverdueCount = followupsCountData?.overdue ?? 0;
  const followupsSplitText =
    followupsTodayCount > 0 || followupsOverdueCount > 0
      ? `${followupsOverdueCount} overdue · ${followupsTodayCount} due today`
      : 'All caught up';

  // Converted tile metrics
  const convertedCount = metrics?.summary?.converted_this_month ?? metrics?.resolved_enquiries ?? 0;
  const totalLeads = metrics?.summary?.total_leads ?? metrics?.total_enquiries ?? 0;
  const conversionRate = totalLeads > 0 ? Math.round((convertedCount / totalLeads) * 1000) / 10 : 0;

  // Chart data
  const chartData = metrics?.by_month && metrics.by_month.length > 0
    ? metrics.by_month.map((m) => ({ month: m.month_label.split(' ')[0], count: m.enquiries }))
    : [{ month: 'Current', count: 0 }];

  const cleanName = user?.name ? user.name.replace(/\s*\(mock\s*admin\)/i, '').trim() : 'Abhilash Chudasama';

  return (
    <>
      {toast && (
        <div style={{ marginBottom: '16px' }}>
          <AdminToast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Dashboard Top Header & Add Enquiry CTA */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#FFFFFF',
              margin: '0 0 4px 0',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Welcome, {cleanName}
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#8A949D' }}>
            Godhra branch portfolio performance & advisory pipeline overview.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            style={{
              padding: '9px 14px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Refresh dashboard data"
          >
            <AdminIcon name="refresh" size={14} />
            <span>{isRefetching ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddDrawerOpen(true)}
            style={{
              padding: '9px 16px',
              backgroundColor: '#123D67',
              border: '1px solid #FFFFFF',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
            }}
          >
            <AdminIcon name="plus" size={15} />
            <span>Add enquiry</span>
          </button>
        </div>
      </div>

      {/* Filter and Synchronization Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '10px 14px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Range Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#8A949D', fontWeight: 500 }}>Range:</span>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              style={{
                background: '#071B30',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '12px',
                outline: 'none',
              }}
            >
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="12m">Last 12 Months</option>
            </select>
          </div>

          {/* Service Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#8A949D', fontWeight: 500 }}>Service:</span>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              style={{
                background: '#071B30',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '12px',
                outline: 'none',
              }}
            >
              <option value="all">All Services</option>
              <option value="health-insurance">Health Insurance</option>
              <option value="mutual-funds">Mutual Funds</option>
              <option value="motor-insurance">Motor Insurance</option>
              <option value="life-insurance">Life Insurance</option>
              <option value="fixed-deposits">Fixed Deposits & Bonds</option>
              <option value="equity-demat">Equity & Demat</option>
            </select>
          </div>

          {/* Assignee Filter (Admin only) */}
          {user?.role === 'admin' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#8A949D', fontWeight: 500 }}>Assignee:</span>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                style={{
                  background: '#071B30',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  outline: 'none',
                }}
              >
                <option value="all">All Assignees</option>
                <option value="me">My Assigned</option>
                <option value="unassigned">Unassigned</option>
              </select>
            </div>
          )}
        </div>

        <div style={{ fontSize: '11.5px', color: '#8A949D' }}>
          Last updated: <span style={{ color: '#D7D9DC' }}>{lastRefreshedAt}</span>
        </div>
      </div>

      {/* 12-Column Responsive Bento Grid */}
      <div className="admin-bento-grid">
        {/* Tile A: Monthly Headline KPI */}
        <HeadlineTile
          count={headlineCount}
          monthLabel={headlineMonthLabel}
          pctChange={pctChangeStr}
          monthlyTrend={monthlyTrend}
        />

        {/* Tile B: Follow-ups Due Today */}
        <FollowupsTile
          count={followupsTodayCount}
          splitText={followupsSplitText}
        />

        {/* Tile C: Converted This Month */}
        <ConvertedTile
          count={convertedCount}
          ratePct={conversionRate}
        />

        {/* Tile D: Quick Operations Palette */}
        <QuickActionsTile />

        {/* Tile E: Interactive Trend SVG Line Chart */}
        <EnquiriesChartTile
          monthlyData={chartData}
          serviceFilter={service}
          onFilterChange={() => {}}
        />

        {/* Tile F: Conversion Ratio by Vertical (Role Scoped: Staff displays friendly advisory note) */}
        {user?.role === 'staff' ? (
          <div
            className="admin-bento-tile admin-bento-tile--conversion-service"
            style={{ animationDelay: '300ms' }}
          >
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                color: '#FFFFFF',
                marginBottom: '12px',
              }}
            >
              Lead Conversion by Service
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                color: '#8A949D',
                fontSize: '12.5px',
                textAlign: 'center',
                padding: '16px',
              }}
            >
              Conversion breakdowns by service are restricted to administrative managers. Contact your admin for vertical performance reports.
            </div>
          </div>
        ) : (
          <ServiceConversionTile services={metrics?.by_service} />
        )}

        {/* Tile G: Latest Inbound Client Leads Table */}
        <LatestEnquiriesTile
          enquiries={enquiries}
          onStatusChange={handleStatusChange}
        />

        {/* Tile H: Follow-ups Outreach List */}
        <TodayFollowupsTile
          followups={metrics?.follow_ups_due}
          totalDueCount={followupsCountData?.count}
        />
      </div>

      {/* Manual Add Enquiry Drawer */}
      <AdminAddEnquiryDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onEnquiryCreated={(newEnq) => {
          setToast({
            type: 'success',
            message: `Enquiry ${newEnq.reference_id} created successfully.`,
          });
          queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
          queryClient.invalidateQueries({ queryKey: ['admin', 'followups-count'] });
        }}
      />
    </>
  );
};
