import React, { useState } from 'react';
import { useAuth } from '../../context/MockAuthContext';
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

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [serviceFilter, setServiceFilter] = useState<'All' | 'Insurance' | 'Mutual Funds' | 'Equity'>('All');

  // Lead enquiries from existing mock layer
  const [enquiries, setEnquiries] = useState<EnquiryRow[]>([
    { id: 'ENQ-1042', name: 'Rajeshbhai Patel', phone: '+91 98250 11223', service: 'Health Insurance', status: 'New', assignee: 'Abhilash C.', followUpDate: 'Today, 2:30 PM' },
    { id: 'ENQ-1041', name: 'Dr. Meena Shah', phone: '+91 94260 44556', service: 'Mutual Funds (SIP)', status: 'Contacted', assignee: 'Abhilash C.', followUpDate: 'Today, 4:00 PM' },
    { id: 'ENQ-1040', name: 'Vikramsinh Solanki', phone: '+91 97120 77889', service: 'Motor Insurance', status: 'Qualified', assignee: 'Kajal C.', followUpDate: 'Tomorrow, 11:00 AM' },
    { id: 'ENQ-1039', name: 'Harishbhai Desai', phone: '+91 98980 33221', service: 'Equity & Demat', status: 'In Progress', assignee: 'Abhilash C.', followUpDate: '30-Oct-2026' },
    { id: 'ENQ-1038', name: 'Pooja Bhatt', phone: '+91 99090 88776', service: 'Term Life Cover', status: 'Converted', assignee: 'Kajal C.', followUpDate: 'Completed' },
    { id: 'ENQ-1037', name: 'Kamlesh Soni', phone: '+91 94270 55443', service: 'Corporate FD', status: 'Contacted', assignee: 'Abhilash C.', followUpDate: '31-Oct-2026' },
  ]);

  const handleStatusChange = (id: string, newStatus: EnquiryRow['status']) => {
    setEnquiries((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus, updated: true } : item
      )
    );
  };

  // Monthly data from existing layer
  const monthlyData: Record<string, { month: string; count: number }[]> = {
    All: [
      { month: 'May', count: 18 },
      { month: 'Jun', count: 24 },
      { month: 'Jul', count: 29 },
      { month: 'Aug', count: 32 },
      { month: 'Sep', count: 35 },
      { month: 'Oct', count: 42 },
    ],
    Insurance: [
      { month: 'May', count: 9 },
      { month: 'Jun', count: 12 },
      { month: 'Jul', count: 14 },
      { month: 'Aug', count: 15 },
      { month: 'Sep', count: 18 },
      { month: 'Oct', count: 21 },
    ],
    'Mutual Funds': [
      { month: 'May', count: 5 },
      { month: 'Jun', count: 7 },
      { month: 'Jul', count: 9 },
      { month: 'Aug', count: 11 },
      { month: 'Sep', count: 11 },
      { month: 'Oct', count: 13 },
    ],
    Equity: [
      { month: 'May', count: 4 },
      { month: 'Jun', count: 5 },
      { month: 'Jul', count: 6 },
      { month: 'Aug', count: 6 },
      { month: 'Sep', count: 6 },
      { month: 'Oct', count: 8 },
    ],
  };

  // Clean user display name removing "(Mock Admin)"
  const cleanName = user?.name ? user.name.replace(/\s*\(mock\s*admin\)/i, '').trim() : 'Abhilash Chudasama';
  const roleDisplay = user?.role ? user.role.toUpperCase() : 'ADMIN';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Dashboard Header Row (Compact) */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '26px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              color: '#FFFFFF',
              margin: '0 0 4px',
              letterSpacing: '-0.02em',
            }}
          >
            Operations & Lead Dashboard
          </h1>
          <p
            style={{
              color: '#8A949D',
              margin: 0,
              fontSize: '13px',
              lineHeight: 1.4,
            }}
          >
            Logged in as <strong style={{ color: '#D7D9DC' }}>{cleanName}</strong> (Role: {roleDisplay}) • Godhra Central Operations
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => window.print()}
          >
            <AdminIcon name="clipboard" size={14} />
            <span>Export Monthly Summary</span>
          </button>

          <button
            type="button"
            className="admin-btn-primary"
            onClick={() => alert('New Walk-in Lead modal opening')}
          >
            <AdminIcon name="plus" size={14} />
            <span>+ New Walk-in Lead</span>
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="admin-bento-grid">
        {/* Row 1: KPI Tier */}
        {/* Tile A: Headline Enquiries (Span 5 cols) */}
        <HeadlineTile
          count={42}
          monthLabel="Oct 2026"
          pctChange="+18.5% vs previous month"
          monthlyTrend={[18, 24, 29, 32, 35, 42]}
        />

        {/* Tile B: Follow-ups Due Today (Span 3 cols) */}
        <FollowupsTile
          count={6}
          splitText="3 scheduled morning • 3 afternoon"
        />

        {/* Tile C: Converted This Month (Span 4 cols) */}
        <ConvertedTile
          count={18}
          ratePct={42.8}
        />

        {/* Row 2: Charts & Breakdown Tier */}
        {/* Tile E: Enquiries by Month Line Chart (Span 8 cols) */}
        <EnquiriesChartTile
          monthlyData={monthlyData}
          serviceFilter={serviceFilter}
          onFilterChange={setServiceFilter}
        />

        {/* Tile F: Lead Conversion by Service (Span 4 cols) */}
        <ServiceConversionTile />

        {/* Row 3: Operational Action & Pipeline Tier */}
        {/* Tile D: Quick Operations (Span 4 cols) */}
        <QuickActionsTile />

        {/* Tile G: Latest Inbound Enquiries Table (Span 7 cols) */}
        <LatestEnquiriesTile
          enquiries={enquiries}
          onStatusChange={handleStatusChange}
        />

        {/* Tile H: Today's Follow-ups List (Span 5 cols) */}
        <TodayFollowupsTile />
      </div>
    </div>
  );
};
