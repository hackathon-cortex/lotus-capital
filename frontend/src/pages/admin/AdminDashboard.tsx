import React, { useState } from 'react';
import { useAuth } from '../../context/MockAuthContext';

interface EnquiryRow {
  id: string;
  name: string;
  phone: string;
  service: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'In Progress' | 'Converted' | 'Closed';
  assignee: string;
  followUpDate: string;
  updated?: boolean;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [serviceFilter, setServiceFilter] = useState<'All' | 'Insurance' | 'Mutual Funds' | 'Equity'>('All');
  const [hoveredMonth, setHoveredMonth] = useState<{ month: string; count: number } | null>(null);

  // Sample lead inquiries for the live dashboard table
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

  // Monthly enquiries data for chart (A26)
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

  const chartData = monthlyData[serviceFilter];
  const chartW = 600;
  const chartH = 200;
  const maxCount = 50;
  const getX = (idx: number) => 50 + (idx / (chartData.length - 1)) * (chartW - 80);
  const getY = (count: number) => chartH - 30 - (count / maxCount) * (chartH - 60);

  const linePath = chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.count)}`).join(' ');
  const areaPath = `${linePath} L ${getX(chartData.length - 1)} ${chartH - 30} L ${getX(0)} ${chartH - 30} Z`;

  const getStatusBadgeStyle = (status: EnquiryRow['status']) => {
    switch (status) {
      case 'New':
        return { backgroundColor: '#FDE8EA', color: 'var(--red-600)', border: '1px solid #F9C2C6' };
      case 'Contacted':
        return { backgroundColor: 'var(--navy-100)', color: 'var(--navy-700)', border: '1px solid var(--navy-300)' };
      case 'Qualified':
        return { backgroundColor: '#E3F1E6', color: 'var(--success)', border: '1px solid #C4E3CA' };
      case 'In Progress':
        return { backgroundColor: '#FFF1D6', color: '#B7791F', border: '1px solid #FFE2A8' };
      case 'Converted':
        return { backgroundColor: 'var(--navy-700)', color: 'var(--white)', border: '1px solid var(--navy-700)' };
      case 'Closed':
        return { backgroundColor: 'var(--silver-100)', color: 'var(--muted)', border: '1px solid var(--silver-300)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Title & Operational Status */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--navy-900)', margin: '0 0 0.25rem', fontFamily: 'Poppins, sans-serif' }}>
            Operations & Lead Dashboard
          </h1>
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem' }}>
            Logged in as <strong>{user?.name || 'Abhilash Chudasama'}</strong> (Role: {user?.role?.toUpperCase()}) • Godhra Central Operations
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
            Export Monthly Summary
          </button>
          <button className="btn btn-primary btn-sm">
            + New Walk-in Lead
          </button>
        </div>
      </div>

      {/* Row 1: Four Summary KPI Cards (Design.md 11.2) */}
      <div className="grid grid-cols-1 grid-cols-md-4" style={{ gap: '1.5rem' }}>
        {/* Card 1: New Enquiries (Primary Red Accent) */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            borderTop: '4px solid var(--red-600)',
            position: 'relative',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>
            New Enquiries (Oct 2026)
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--navy-900)', fontFamily: 'Poppins, sans-serif', margin: '0.35rem 0' }}>
            42
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>
            ↑ +18.5% vs previous month
          </div>
        </div>

        {/* Card 2: Follow-ups Due Today (Alert Status) */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            borderTop: '4px solid var(--navy-700)',
            backgroundColor: '#FFF9F9',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: 'var(--red-600)', fontWeight: 600 }}>
            Follow-ups Due Today
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--red-600)', fontFamily: 'Poppins, sans-serif', margin: '0.35rem 0' }}>
            6
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--red-600)', fontWeight: 500 }}>
            3 scheduled morning • 3 afternoon
          </div>
        </div>

        {/* Card 3: Converted This Month */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            borderTop: '4px solid var(--navy-700)',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>
            Converted This Month
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--navy-900)', fontFamily: 'Poppins, sans-serif', margin: '0.35rem 0' }}>
            18
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--navy-700)', fontWeight: 600 }}>
            42.8% Conversion Rate
          </div>
        </div>

        {/* Card 4: Data Governance & Approvals */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            borderTop: '4px solid var(--navy-700)',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>
            Content Data Register
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--navy-900)', fontFamily: 'Poppins, sans-serif', margin: '0.35rem 0' }}>
            8 / 11
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
            3 Pending client verification
          </div>
        </div>
      </div>

      {/* Row 2: Charts (Left 8 cols line chart, Right 4 cols service breakdown) */}
      <div className="grid grid-cols-12" style={{ gap: '1.5rem' }}>
        {/* Left 8 Cols: Enquiries by Month Chart */}
        <div className="col-span-12 col-span-md-8">
          <div className="card" style={{ padding: '1.75rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--navy-900)' }}>
                  Enquiries Trend (Last 6 Months)
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                  Monthly volume across incoming digital and office channels
                </span>
              </div>

              {/* Service filter buttons (A29) */}
              <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: 'var(--silver-100)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
                {(['All', 'Insurance', 'Mutual Funds', 'Equity'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setServiceFilter(filter)}
                    style={{
                      border: 'none',
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      backgroundColor: serviceFilter === filter ? 'var(--navy-700)' : 'transparent',
                      color: serviceFilter === filter ? 'var(--white)' : 'var(--muted)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Chart (A26) */}
            <div style={{ flex: 1, position: 'relative', minHeight: '200px' }}>
              <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                {/* Silver Grid lines */}
                {[0, 10, 20, 30, 40, 50].map((val) => {
                  const y = getY(val);
                  return (
                    <g key={val}>
                      <line x1="40" y1={y} x2={chartW - 20} y2={y} stroke="var(--silver-300)" strokeDasharray="3 3" />
                      <text x="15" y={y + 4} fill="var(--muted)" fontSize="10" fontFamily="Inter, sans-serif">
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Area fill */}
                <path d={areaPath} fill="rgba(18, 61, 103, 0.12)" />

                {/* 2px Navy Line */}
                <path d={linePath} fill="none" stroke="var(--navy-700)" strokeWidth="2.5" />

                {/* Data Points */}
                {chartData.map((d, i) => {
                  const cx = getX(i);
                  const cy = getY(d.count);
                  const isCurrent = i === chartData.length - 1;
                  return (
                    <g key={d.month}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isCurrent ? 6 : 4}
                        fill={isCurrent ? 'var(--red-600)' : 'var(--navy-700)'}
                        stroke="var(--white)"
                        strokeWidth="2"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredMonth(d)}
                        onMouseLeave={() => setHoveredMonth(null)}
                      />
                      <text x={cx - 10} y={chartH - 10} fill="var(--muted)" fontSize="11" fontFamily="Inter, sans-serif">
                        {d.month}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip */}
              {hoveredMonth && (
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '15px',
                    backgroundColor: 'var(--navy-900)',
                    color: 'var(--white)',
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    pointerEvents: 'none',
                  }}
                >
                  <strong>{hoveredMonth.month} 2026:</strong> {hoveredMonth.count} Enquiries
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Enquiries by Service Category */}
        <div className="col-span-12 col-span-md-4">
          <div className="card" style={{ padding: '1.75rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.15rem', color: 'var(--navy-900)' }}>
              Enquiries by Service
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
              Current active pipeline distribution
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', flex: 1, justifyContent: 'space-around' }}>
              {[
                { name: 'Health Insurance', count: 16, pct: '38%', color: 'var(--red-600)' },
                { name: 'Mutual Funds (SIP)', count: 12, pct: '28%', color: 'var(--navy-700)' },
                { name: 'General & Motor', count: 7, pct: '17%', color: 'var(--navy-600)' },
                { name: 'Equity & Demat', count: 5, pct: '12%', color: 'var(--navy-500)' },
                { name: 'Fixed Deposits & Bonds', count: 2, pct: '5%', color: 'var(--silver-500)' },
              ].map((s) => (
                <div key={s.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{s.name}</span>
                    <span style={{ color: 'var(--muted)' }}>{s.count} ({s.pct})</span>
                  </div>
                  <div style={{ height: '7px', backgroundColor: 'var(--silver-100)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: s.pct, height: '100%', backgroundColor: s.color, borderRadius: '4px', transition: 'width 0.6s ease-out' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Follow-ups counter + Lead Conversion Bars (4 + 8 cols) */}
      <div className="grid grid-cols-12" style={{ gap: '1.5rem' }}>
        {/* Left 4 Cols: Urgent Scheduled Follow-ups Card */}
        <div className="col-span-12 col-span-md-4">
          <div className="card" style={{ padding: '1.75rem', height: '100%', borderLeft: '4px solid var(--red-600)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--navy-900)' }}>
                Urgent Follow-ups
              </h3>
              <span className="badge badge-danger">3 Overdue</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--silver-100)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--navy-900)' }}>Rajeshbhai Patel</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Health Insurance • Sum Insured review</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--red-600)', marginTop: '0.25rem', fontWeight: 600 }}>Scheduled: 2:30 PM Today</div>
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: 'var(--silver-100)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--navy-900)' }}>Dr. Meena Shah</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Mutual Funds • ELSS + Child SIP</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--red-600)', marginTop: '0.25rem', fontWeight: 600 }}>Scheduled: 4:00 PM Today</div>
              </div>
            </div>

            <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '1.25rem' }}>
              Review All Follow-ups (6) →
            </button>
          </div>
        </div>

        {/* Right 8 Cols: Lead Conversion Rates */}
        <div className="col-span-12 col-span-md-8">
          <div className="card" style={{ padding: '1.75rem', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--navy-900)' }}>
                  Lead Conversion Performance
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                  Percentage of qualified enquiries resulting in active policies or opened folios
                </span>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--navy-700)' }}>
                Target: 40.0%
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              {[
                { category: 'Health Insurance', rate: '48.2%', status: 'Above Target', count: '14 closed / 29' },
                { category: 'Mutual Funds', rate: '54.0%', status: 'Above Target', count: '13 closed / 24' },
                { category: 'Motor & General', rate: '39.5%', status: 'On Track', count: '8 closed / 20' },
                { category: 'Equity & Demat', rate: '33.3%', status: 'In Progress', count: '4 closed / 12' },
              ].map((c) => (
                <div key={c.category} style={{ backgroundColor: 'var(--silver-100)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{c.category}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy-900)', fontFamily: 'Poppins, sans-serif', margin: '0.2rem 0' }}>
                    {c.rate}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>{c.status}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--silver-500)', marginTop: '0.2rem' }}>{c.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Latest Enquiries Interactive Table (Design.md 11.2 Row 4) */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--navy-900)' }}>
              Recent Inbound Enquiries
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
              Real-time feed with instant status workflow transition (A27)
            </span>
          </div>

          <span className="badge badge-info">Auto-sync Active</span>
        </div>

        {/* Desktop Table View (>= 768px) */}
        <div className="admin-table-desktop" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--silver-100)', borderBottom: '2px solid var(--silver-300)' }}>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--muted)', fontWeight: 600 }}>ID</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--muted)', fontWeight: 600 }}>Client Name</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--muted)', fontWeight: 600 }}>Phone</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--muted)', fontWeight: 600 }}>Service</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--muted)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--muted)', fontWeight: 600 }}>Assignee</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--muted)', fontWeight: 600 }}>Follow-up</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--muted)', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enq) => {
                const badge = getStatusBadgeStyle(enq.status);
                return (
                  <tr
                    key={enq.id}
                    style={{
                      borderBottom: '1px solid var(--silver-300)',
                      backgroundColor: enq.updated ? 'rgba(230, 237, 245, 0.6)' : 'transparent',
                      transition: 'background-color 1.2s ease',
                    }}
                  >
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--navy-700)' }}>
                      {enq.id}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--ink)' }}>
                      {enq.name}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--muted)' }}>
                      {enq.phone}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--ink)' }}>
                      {enq.service}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryRow['status'])}
                        style={{
                          ...badge,
                          padding: '0.25rem 0.5rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          outline: 'none',
                        }}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--muted)' }}>
                      {enq.assignee}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: enq.followUpDate.includes('Today') ? 'var(--red-600)' : 'var(--muted)', fontWeight: enq.followUpDate.includes('Today') ? 600 : 400 }}>
                      {enq.followUpDate}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={() => alert(`Opening record for ${enq.name} (${enq.id})`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards View (< 768px, phone-usable for status changes & follow-ups) */}
        <div className="admin-cards-mobile" style={{ display: 'none', flexDirection: 'column', gap: '1rem' }}>
          {enquiries.map((enq) => {
            const badge = getStatusBadgeStyle(enq.status);
            return (
              <div
                key={enq.id}
                style={{
                  border: '1px solid var(--silver-300)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  backgroundColor: enq.updated ? 'rgba(230, 237, 245, 0.7)' : 'var(--white)',
                  boxShadow: 'var(--shadow-1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                {/* Card Title Row: Client Name & ID */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--navy-700)', fontWeight: 600 }}>
                      {enq.id}
                    </span>
                    <h4 style={{ margin: '0.1rem 0 0', fontSize: '1.05rem', color: 'var(--navy-900)' }}>
                      {enq.name}
                    </h4>
                  </div>
                  <span
                    style={{
                      ...badge,
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    {enq.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem' }}>
                  <div>
                    <span style={{ color: 'var(--muted)', display: 'block', fontSize: '0.72rem' }}>Phone</span>
                    <a href={`tel:${enq.phone}`} style={{ color: 'var(--navy-700)', fontWeight: 500 }}>
                      {enq.phone}
                    </a>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted)', display: 'block', fontSize: '0.72rem' }}>Service</span>
                    <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{enq.service}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted)', display: 'block', fontSize: '0.72rem' }}>Assignee</span>
                    <span style={{ color: 'var(--muted)' }}>{enq.assignee}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted)', display: 'block', fontSize: '0.72rem' }}>Follow-up</span>
                    <span style={{ color: enq.followUpDate.includes('Today') ? 'var(--red-600)' : 'var(--muted)', fontWeight: enq.followUpDate.includes('Today') ? 700 : 500 }}>
                      {enq.followUpDate}
                    </span>
                  </div>
                </div>

                {/* Card Action Row: Status dropdown + View Details */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.65rem', borderTop: '1px solid var(--silver-300)' }}>
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryRow['status'])}
                    aria-label={`Change status for ${enq.name}`}
                    style={{
                      flex: 1,
                      minHeight: '44px',
                      padding: '0.4rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: '1px solid var(--silver-300)',
                      backgroundColor: 'var(--white)',
                      color: 'var(--navy-900)',
                    }}
                  >
                    <option value="New">Status: New</option>
                    <option value="Contacted">Status: Contacted</option>
                    <option value="Qualified">Status: Qualified</option>
                    <option value="In Progress">Status: In Progress</option>
                    <option value="Converted">Status: Converted</option>
                    <option value="Closed">Status: Closed</option>
                  </select>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ minHeight: '44px', padding: '0.4rem 0.85rem', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                    onClick={() => alert(`Opening record for ${enq.name} (${enq.id})`)}
                  >
                    Details &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
