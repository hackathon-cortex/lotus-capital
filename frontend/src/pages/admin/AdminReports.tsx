import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { DashboardMetrics } from '../../api/types';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminIcon } from '../../components/admin/AdminIcons';
import { AdminToast } from '../../components/admin/AdminToast';

export const AdminReports: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.getDashboard();
      setMetrics(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to aggregate report metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const total = metrics?.total_enquiries || 0;
  const resolved = metrics?.resolved_enquiries || 0;
  const conversionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : '0.0';

  const breakdown = metrics?.service_breakdown || [];
  const maxCount = Math.max(1, ...breakdown.map((s) => s.count));

  const handleExportCSV = () => {
    if (!breakdown.length) {
      setToast({ type: 'error', message: 'No metrics available to export.' });
      return;
    }

    const headers = ['Service Category', 'Lead Volume', 'Percentage Share (%)'];
    const rows = breakdown.map((item) => [
      `"${item.service_slug.replace(/-/g, ' ').toUpperCase()}"`,
      item.count,
      total > 0 ? ((item.count / total) * 100).toFixed(1) : '0.0',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lotus_capital_service_breakdown_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast({ type: 'success', message: 'Report data exported to CSV.' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminPageHeader
        title="Performance & Conversion Reports"
        description="Comprehensive audit of inbound portfolio inquiries grouped by service vertical, resolution rates, and historical volume trends."
        primaryAction={{
          label: 'Export Report CSV',
          onClick: handleExportCSV,
          icon: 'download',
        }}
        secondaryAction={{
          label: 'Refresh Data',
          onClick: fetchReports,
          icon: 'refresh',
        }}
      />

      {toast && (
        <AdminToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* KPI Overview Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
        }}
      >
        <div className="admin-bento-tile" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#8A949D', textTransform: 'uppercase' }}>
            Total Inbound Volume
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#FFFFFF', marginTop: '6px' }}>
            {total}
          </div>
          <div style={{ fontSize: '12px', color: '#D7D9DC', marginTop: '4px' }}>
            All time client registrations
          </div>
        </div>

        <div className="admin-bento-tile" style={{ padding: '20px', borderTop: '3px solid #D7D9DC' }}>
          <div style={{ fontSize: '12px', color: '#8A949D', textTransform: 'uppercase' }}>
            Resolution & Conversion Rate
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#FFFFFF', marginTop: '6px' }}>
            {conversionRate}%
          </div>
          <div style={{ fontSize: '12px', color: '#D7D9DC', marginTop: '4px' }}>
            {resolved} resolved out of {total} leads
          </div>
        </div>

        <div className="admin-bento-tile" style={{ padding: '20px', borderTop: '3px solid #E92332' }}>
          <div style={{ fontSize: '12px', color: '#8A949D', textTransform: 'uppercase' }}>
            Active Follow-up Pipeline
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#FFFFFF', marginTop: '6px' }}>
            {metrics?.in_progress_enquiries || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#D7D9DC', marginTop: '4px' }}>
            Leads in discussion / consultation
          </div>
        </div>
      </div>

      {/* Visual Chart: Service Category Breakdown */}
      <div className="admin-bento-tile" style={{ padding: '24px' }}>
        <h3
          style={{
            margin: '0 0 16px',
            fontSize: '16px',
            color: '#FFFFFF',
            fontFamily: 'Poppins, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AdminIcon name="chart" size={18} color="#D7D9DC" />
          <span>Inbound Portfolio Inquiries by Vertical</span>
        </h3>

        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
            Aggregating service volume trends...
          </div>
        ) : error ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#E92332' }}>{error}</div>
        ) : breakdown.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#8A949D' }}>
            No service breakdown data logged.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {breakdown.map((item) => {
              const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';
              const widthPct = Math.max(4, Math.round((item.count / maxCount) * 100));
              return (
                <div key={item.service_slug} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#FFFFFF', fontWeight: 500 }}>
                      {item.service_slug.replace(/-/g, ' ').toUpperCase()}
                    </span>
                    <span style={{ color: '#D7D9DC' }}>
                      {item.count} leads ({pct}%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${widthPct}%`,
                        backgroundColor: '#1B4F82',
                        borderRadius: '999px',
                        transition: 'width 300ms ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Accessible Data Table Breakdown */}
      <div className="admin-bento-tile" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h4 style={{ margin: 0, fontSize: '14px', color: '#FFFFFF', fontFamily: 'Poppins, sans-serif' }}>
            Vertical Metric Breakdown Table
          </h4>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1B4F82', backgroundColor: 'rgba(5, 19, 41, 0.6)', color: '#8A949D' }}>
                <th style={{ padding: '12px 16px' }}>Service Vertical</th>
                <th style={{ padding: '12px 16px' }}>Lead Count</th>
                <th style={{ padding: '12px 16px' }}>Share of Pipeline</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#8A949D' }}>
                    No breakdown rows available.
                  </td>
                </tr>
              ) : (
                breakdown.map((item) => {
                  const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';
                  return (
                    <tr key={item.service_slug} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '12px 16px', color: '#FFFFFF', fontWeight: 500 }}>
                        {item.service_slug.replace(/-/g, ' ').toUpperCase()}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#FFFFFF' }}>
                        {item.count}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#D7D9DC' }}>
                        {pct}%
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            backgroundColor: '#123D67',
                            color: '#FFFFFF',
                          }}
                        >
                          ACTIVE VERTICAL
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

