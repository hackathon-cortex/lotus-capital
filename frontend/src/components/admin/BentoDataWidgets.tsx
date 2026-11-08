import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminIcon } from './AdminIcons';

// -------------------------------------------------------------
// Tile E: Enquiries by Month Line Chart (Interactive SVG)
// -------------------------------------------------------------
export interface MonthlyDataPoint {
  month: string;
  count: number;
}

export interface EnquiriesChartTileProps {
  monthlyData: Record<string, MonthlyDataPoint[]>;
  serviceFilter: string;
  onFilterChange: (filter: 'All' | 'Insurance' | 'Mutual Funds' | 'Equity') => void;
}

export const EnquiriesChartTile: React.FC<EnquiriesChartTileProps> = ({
  monthlyData,
  serviceFilter,
  onFilterChange,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<MonthlyDataPoint | null>(null);

  const chartData = monthlyData[serviceFilter] || monthlyData['All'] || [];
  if (chartData.length === 0) return null;

  const chartW = 560;
  const chartH = 170;
  const maxVal = Math.max(...chartData.map((d) => d.count), 45);
  const getX = (idx: number) => 40 + (idx / (chartData.length - 1)) * (chartW - 65);
  const getY = (count: number) => chartH - 25 - (count / maxVal) * (chartH - 50);

  const linePath = chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.count)}`).join(' ');
  const areaPath = `${linePath} L ${getX(chartData.length - 1)} ${chartH - 25} L ${getX(0)} ${chartH - 25} Z`;

  return (
    <div
      className="admin-bento-tile admin-bento-tile--chart"
      style={{ animationDelay: '240ms' }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
            }}
          >
            Enquiries Trend (Last 6 Months)
          </span>
          <div style={{ fontSize: '12px', color: '#8A949D', marginTop: '2px' }}>
            Inbound volume across digital forms and offline visits
          </div>
        </div>

        {/* Segmented Filter Pills */}
        <div className="admin-chart-pills" role="radiogroup" aria-label="Filter enquiries by service">
          {(['All', 'Insurance', 'Mutual Funds', 'Equity'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              role="radio"
              aria-checked={serviceFilter === filter}
              onClick={() => onFilterChange(filter)}
              className={`admin-chart-pill-btn ${serviceFilter === filter ? 'is-active' : ''}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Line Chart */}
      <div style={{ flex: 1, position: 'relative', minHeight: '160px' }}>
        <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          {/* Subtle Horizontal Grid lines */}
          {[10, 20, 30, 40].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line x1="35" y1={y} x2={chartW - 20} y2={y} stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="3 3" />
                <text x="12" y={y + 4} fill="#8A949D" fontSize="10" fontFamily="Inter, sans-serif">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="rgba(255, 255, 255, 0.08)" />

          {/* Line Path */}
          <path d={linePath} fill="none" stroke="#FFFFFF" strokeWidth="2.5" />

          {/* Points */}
          {chartData.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.count);
            const isLatest = i === chartData.length - 1;

            return (
              <g key={d.month}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isLatest ? 5.5 : 4}
                  fill={isLatest ? '#E92332' : '#FFFFFF'}
                  stroke="#0A2540"
                  strokeWidth="2"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredPoint(d)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                <text x={cx - 10} y={chartH - 8} fill="#8A949D" fontSize="11" fontFamily="Inter, sans-serif">
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '12px',
              background: '#071B30',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '4px 10px',
              fontSize: '12px',
              color: '#FFFFFF',
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            }}
          >
            <strong>{hoveredPoint.month} 2026:</strong> {hoveredPoint.count} Enquiries
          </div>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Tile F: Lead Conversion by Service (Progress Bars)
// -------------------------------------------------------------
export interface ServiceConversionItem {
  name: string;
  rate: string;
  closedText: string;
  pctValue: number;
}

export const ServiceConversionTile: React.FC = () => {
  const serviceStats: ServiceConversionItem[] = [
    { name: 'Health Insurance', rate: '48.2%', closedText: '14 closed / 29', pctValue: 48.2 },
    { name: 'Mutual Funds (SIP)', rate: '54.0%', closedText: '13 closed / 24', pctValue: 54.0 },
    { name: 'Motor & General', rate: '39.5%', closedText: '8 closed / 20', pctValue: 39.5 },
    { name: 'Equity & Demat', rate: '33.3%', closedText: '4 closed / 12', pctValue: 33.3 },
  ];

  return (
    <div
      className="admin-bento-tile admin-bento-tile--conversion-service"
      style={{ animationDelay: '300ms' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
            }}
          >
            Lead Conversion by Service
          </span>
          <div style={{ fontSize: '12px', color: '#8A949D', marginTop: '2px' }}>
            Closed policies vs qualified pipeline
          </div>
        </div>

        <span style={{ fontSize: '11.5px', color: '#D7D9DC', fontWeight: 600 }}>
          Target: 40%
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'space-around' }}>
        {serviceStats.map((item) => (
          <div key={item.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{item.name}</span>
              <span style={{ color: '#D7D9DC' }}>
                <strong>{item.rate}</strong> ({item.closedText})
              </span>
            </div>

            {/* Progress Bar Container */}
            <div
              style={{
                height: '7px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${item.pctValue}%`,
                  height: '100%',
                  borderRadius: '999px',
                  background: item.pctValue >= 40 ? '#FFFFFF' : '#8A949D',
                  transition: 'width 800ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Tile G: Latest Enquiries Interactive Table
// -------------------------------------------------------------
export interface EnquiryRow {
  id: string;
  name: string;
  phone: string;
  service: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'In Progress' | 'Converted' | 'Closed';
  assignee: string;
  followUpDate: string;
  updated?: boolean;
}

export interface LatestEnquiriesTileProps {
  enquiries: EnquiryRow[];
  onStatusChange: (id: string, newStatus: EnquiryRow['status']) => void;
}

export const LatestEnquiriesTile: React.FC<LatestEnquiriesTileProps> = ({
  enquiries,
  onStatusChange,
}) => {
  const getBadgeClass = (status: EnquiryRow['status']) => {
    switch (status) {
      case 'New':
        return 'admin-status-badge--new';
      case 'Contacted':
        return 'admin-status-badge--contacted';
      case 'Qualified':
        return 'admin-status-badge--qualified';
      case 'In Progress':
        return 'admin-status-badge--inprogress';
      case 'Converted':
        return 'admin-status-badge--converted';
      case 'Closed':
        return 'admin-status-badge--closed';
    }
  };

  return (
    <div
      className="admin-bento-tile admin-bento-tile--latest-enquiries"
      style={{ animationDelay: '360ms' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
            }}
          >
            Latest Inbound Enquiries
          </span>
          <div style={{ fontSize: '12px', color: '#8A949D', marginTop: '2px' }}>
            5 most recent client submissions across public forms
          </div>
        </div>

        <Link
          to="/admin/leads"
          style={{
            color: '#FFFFFF',
            fontSize: '12.5px',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>View all leads</span>
          <AdminIcon name="chevron-right" size={14} />
        </Link>
      </div>

      <div style={{ overflowX: 'auto', flex: 1 }}>
        <table className="admin-compact-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Service</th>
              <th className="admin-table-hide-mobile">Follow-up</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.slice(0, 5).map((enq) => (
              <tr key={enq.id}>
                <td>
                  <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{enq.name}</div>
                  <div style={{ fontSize: '11px', color: '#8A949D', fontFamily: 'monospace' }}>
                    {enq.id} • {enq.phone}
                  </div>
                </td>
                <td style={{ color: '#D7D9DC' }}>{enq.service}</td>
                <td
                  className="admin-table-hide-mobile"
                  style={{
                    color: enq.followUpDate.includes('Today') ? '#E92332' : '#8A949D',
                    fontWeight: enq.followUpDate.includes('Today') ? 600 : 400,
                  }}
                >
                  {enq.followUpDate}
                </td>
                <td>
                  <select
                    value={enq.status}
                    onChange={(e) => onStatusChange(enq.id, e.target.value as EnquiryRow['status'])}
                    className={`admin-status-badge ${getBadgeClass(enq.status)}`}
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'transparent',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value="New" style={{ background: '#071B30', color: '#FFFFFF' }}>New</option>
                    <option value="Contacted" style={{ background: '#071B30', color: '#FFFFFF' }}>Contacted</option>
                    <option value="Qualified" style={{ background: '#071B30', color: '#FFFFFF' }}>Qualified</option>
                    <option value="In Progress" style={{ background: '#071B30', color: '#FFFFFF' }}>In Progress</option>
                    <option value="Converted" style={{ background: '#071B30', color: '#FFFFFF' }}>Converted</option>
                    <option value="Closed" style={{ background: '#071B30', color: '#FFFFFF' }}>Closed</option>
                  </select>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Link
                    to={`/admin/leads/${enq.id}`}
                    className="admin-btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '11.5px' }}
                  >
                    <span>View</span>
                    <AdminIcon name="chevron-right" size={12} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Tile H: Today's Follow-ups List
// -------------------------------------------------------------
export interface FollowupItem {
  id: string;
  name: string;
  phone: string;
  service: string;
  time: string;
}

export const TodayFollowupsTile: React.FC = () => {
  const followups: FollowupItem[] = [
    { id: 'F1', name: 'Rajeshbhai Patel', phone: '+919825011223', service: 'Health Insurance • Sum Insured review', time: '2:30 PM' },
    { id: 'F2', name: 'Dr. Meena Shah', phone: '+919426044556', service: 'Mutual Funds • ELSS + Child SIP', time: '4:00 PM' },
    { id: 'F3', name: 'Vikramsinh Solanki', phone: '+919712077889', service: 'Motor Insurance • Renewal', time: '5:15 PM' },
  ];

  return (
    <div
      className="admin-bento-tile admin-bento-tile--today-followups"
      style={{ animationDelay: '420ms' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
            }}
          >
            Today's Scheduled Follow-ups
          </span>
          <div style={{ fontSize: '12px', color: '#8A949D', marginTop: '2px' }}>
            Urgent consultations awaiting staff call
          </div>
        </div>

        <Link
          to="/admin/followups"
          style={{
            color: '#FFFFFF',
            fontSize: '12.5px',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>All follow-ups (6)</span>
          <AdminIcon name="chevron-right" size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {followups.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '13px', color: '#FFFFFF' }}>{item.name}</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#E92332',
                    background: 'rgba(233, 35, 50, 0.15)',
                    padding: '2px 6px',
                    borderRadius: '6px',
                  }}
                >
                  {item.time}
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#8A949D', marginTop: '2px' }}>
                {item.service}
              </div>
            </div>

            {/* Quick Call / WhatsApp Action Chips */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <a
                href={`tel:${item.phone}`}
                className="admin-btn-secondary"
                style={{ padding: '6px 10px', fontSize: '11px' }}
                title={`Call ${item.name}`}
              >
                <AdminIcon name="phone" size={12} />
                <span>Call</span>
              </a>

              <a
                href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn-secondary"
                style={{ padding: '6px 10px', fontSize: '11px' }}
                title={`WhatsApp ${item.name}`}
              >
                <AdminIcon name="whatsapp" size={12} />
                <span>Chat</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

