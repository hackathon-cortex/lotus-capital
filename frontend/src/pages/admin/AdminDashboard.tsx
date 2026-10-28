import React from 'react';
import statisticsData from '@content/data/statistics.json';
import { StatisticItem } from '@content/data/types';
import { useAuth } from '../../context/MockAuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const stats = statisticsData as StatisticItem[];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Welcome back, {user?.name || 'Administrator'}</h2>
        <p style={{ color: 'var(--muted)' }}>
          Overview of website statistics, pending content approvals, and lead queues.
        </p>
      </div>

      {/* Structured Statistics from Data Layer Example */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Statistics Master Data (from @content/data/statistics.json)</h3>
        <div className="grid grid-cols-4">
          {stats.slice(0, 8).map((s) => (
            <div key={s.id} className="card" style={{ borderLeft: `4px solid ${s.tier === 'A' ? 'var(--navy-600)' : 'var(--warning)'}` }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                {s.label}
              </div>
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="badge badge-info">Tier {s.tier}</span>
                <span className={`badge ${s.approvalStatus === 'approved' ? 'badge-success' : s.approvalStatus === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                  {s.approvalStatus}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--silver-500)', marginTop: '0.5rem' }}>
                As of: {s.asOfDate || 'Pending client confirmation'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TODO List for Coworker */}
      <section className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--danger)' }}>
        <h3 style={{ color: 'var(--navy-900)' }}>Admin Dashboard — Engineering Hand-off Checklist</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
          Items to be wired up with backend API and PostgreSQL database:
        </p>
        <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.8', fontSize: '0.9rem' }}>
          <li>[ ] Wire live enquiry counters from <code>GET /api/v1/admin/dashboard</code>.</li>
          <li>[ ] Add follow-ups due alert card and assign to logged-in user.</li>
          <li>[ ] Implement conversion chart with monthly filtering per Design.md animation A26.</li>
          <li>[ ] Provide inline &quot;Approve Statistic&quot; action that updates <code>approvalStatus</code> and sets <code>asOfDate</code>.</li>
          <li>[ ] Replace mock auth context with real JWT / HTTP-only session cookie flow.</li>
        </ul>
      </section>
    </div>
  );
};

