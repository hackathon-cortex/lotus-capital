import React from 'react';
import { Helmet } from 'react-helmet-async';
import statisticsData from '@content/data/statistics.json';
import registrationsData from '@content/data/registrations.json';
import { StatisticItem, RegistrationItem } from '@content/data/types';

export const DataRegisterPage: React.FC = () => {
  const stats = statisticsData as StatisticItem[];
  const registrations = registrationsData as RegistrationItem[];

  return (
    <div className="container section-padding">
      <Helmet>
        <title>Developer Data Register | Lotus Capital</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div style={{ marginBottom: '2rem' }}>
        <span className="badge badge-warning" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          INTERNAL DEVELOPER REGISTRY (DEV ONLY)
        </span>
        <h1>Source of Truth Data Register</h1>
        <p style={{ color: 'var(--muted)' }}>
          Review all structured statistics, registration entries, and client documentation
          discrepancies from <code>00-client-data-register.md</code> in one place.
        </p>
      </div>

      {/* 1. Statistics Table */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>1. Statistics Master Register</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
          Public site renders only when <code>approvalStatus === &quot;approved&quot;</code> and <code>asOfDate</code> is set.
          Current dev mode shows pending stats with unverified badge. Tier C is always withheld.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Label</th>
                <th>Client Figure</th>
                <th>Tier</th>
                <th>Status</th>
                <th>As of Date</th>
                <th>Pages</th>
                <th>Definition / Compliance Note</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.id}>
                  <td><code>{s.id}</code></td>
                  <td>{s.label}</td>
                  <td><strong>{s.value}</strong></td>
                  <td>
                    <span className={`badge ${s.tier === 'A' ? 'badge-success' : s.tier === 'B' ? 'badge-warning' : 'badge-danger'}`}>
                      Tier {s.tier}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${s.approvalStatus === 'approved' ? 'badge-success' : s.approvalStatus === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                      {s.approvalStatus}
                    </span>
                  </td>
                  <td>{s.asOfDate || <em>null (unconfirmed)</em>}</td>
                  <td>{s.pages.join(', ')}</td>
                  <td style={{ fontSize: '0.8rem', maxWidth: '300px' }}>{s.definitionNote || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Registrations Table */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>2. Registrations & Licences Register</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
          Strict rule: Never output &quot;SEBI-registered&quot; or &quot;RERA registered&quot;. Always name holder and specific capacity.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Registration</th>
                <th>Number</th>
                <th>Holder</th>
                <th>Role Capacity</th>
                <th>Recommended Public Wording</th>
                <th>Verification Notes Before Publishing</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.clientEntry}</strong></td>
                  <td><code>{r.number}</code></td>
                  <td>{r.holder}</td>
                  <td>{r.role}</td>
                  <td style={{ fontSize: '0.85rem' }}>{r.recommendedWording}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{r.verifyBeforePublishing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Document Discrepancies */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>3. Document Discrepancies (Audit from Client Records)</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Earlier Document (Welcome Letter)</th>
                <th>Latest Document (Required Data)</th>
                <th>Resolution in Codebase</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Clients Serviced</strong></td>
                <td>2,000+</td>
                <td>2,500+</td>
                <td>Use <strong>2,500+</strong> once as-of date is verified by client.</td>
              </tr>
              <tr>
                <td><strong>Insurance Total</strong></td>
                <td>Not stated</td>
                <td>250 health + 180 life + 140 motor</td>
                <td>Derived as <strong>570+</strong>; explicitly labelled &quot;health, life and motor&quot;.</td>
              </tr>
              <tr>
                <td><strong>Advisory Returns</strong></td>
                <td>Not stated</td>
                <td>Approx. 23% CAGR</td>
                <td>Tier C / Withheld from public website pending compliance audit.</td>
              </tr>
              <tr>
                <td><strong>RERA Status</strong></td>
                <td>Real estate services since 2016</td>
                <td>Under process</td>
                <td>Labelled &quot;under process&quot;; real estate section hidden behind feature flag.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

