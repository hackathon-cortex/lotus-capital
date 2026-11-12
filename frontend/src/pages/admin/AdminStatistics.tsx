import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminIcon } from '../../components/admin/AdminIcons';
import { AdminToast } from '../../components/admin/AdminToast';

export interface AdminStatItem {
  id: number;
  key: string;
  label: string;
  tier: 'tier_a' | 'tier_b' | 'tier_c';
  value: number;
  prefix?: string;
  suffix?: string;
  as_of_date: string;
  source_note: string;
  approval_status: 'approved' | 'pending' | 'rejected';
}

const DEFAULT_STATS: AdminStatItem[] = [
  {
    id: 1,
    key: 'cr_assets_under_guidance',
    label: 'Assets Under Guidance (Cr)',
    tier: 'tier_a',
    value: 500,
    prefix: '₹',
    suffix: ' Cr+',
    as_of_date: '2026-03-31',
    source_note: 'Audited AUM aggregation report',
    approval_status: 'approved',
  },
  {
    id: 2,
    key: 'families_served',
    label: 'Families Served',
    tier: 'tier_a',
    value: 2500,
    suffix: '+',
    as_of_date: '2026-03-31',
    source_note: 'Internal client register',
    approval_status: 'approved',
  },
  {
    id: 3,
    key: 'claim_settlement_ratio',
    label: 'Claim Settlement Assistance Ratio',
    tier: 'tier_a',
    value: 98.4,
    suffix: '%',
    as_of_date: '2026-03-31',
    source_note: 'Assisted claims outcome register',
    approval_status: 'approved',
  },
  {
    id: 4,
    key: 'mf_active_sips',
    label: 'Active SIP Count',
    tier: 'tier_b',
    value: 4800,
    suffix: '+',
    as_of_date: '2026-03-31',
    source_note: 'RTA registrar records',
    approval_status: 'approved',
  },
  {
    id: 5,
    key: 'equity_cagr',
    label: 'Equity Model Portfolio CAGR (Tier C)',
    tier: 'tier_c',
    value: 16.8,
    suffix: '%',
    as_of_date: '2026-03-31',
    source_note: 'SEBI Audited Performance Register',
    approval_status: 'approved',
  },
];

export const AdminStatistics: React.FC = () => {
  const [stats, setStats] = useState<AdminStatItem[]>(DEFAULT_STATS);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Edit / Confirmation states
  const [editingStat, setEditingStat] = useState<AdminStatItem | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [editDate, setEditDate] = useState('');
  const [editSource, setEditSource] = useState('');
  const [saving, setSaving] = useState(false);

  // Tier C Compliance Confirmation Modal
  const [showTierCModal, setShowTierCModal] = useState(false);
  const [complianceConfirmed, setComplianceConfirmed] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res: any = await api.admin.getStatistics();
      if (res && Array.isArray(res) && res.length > 0) {
        setStats(res);
      }
    } catch {
      // Fallback to default
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const openEditModal = (stat: AdminStatItem) => {
    setEditingStat(stat);
    setEditValue(stat.value);
    setEditDate(stat.as_of_date);
    setEditSource(stat.source_note);
    setComplianceConfirmed(false);

    if (stat.tier === 'tier_c') {
      setShowTierCModal(true);
    } else {
      setShowTierCModal(false);
    }
  };

  const handleCommitUpdate = async () => {
    if (!editingStat) return;
    setSaving(true);
    setToast(null);

    const payload = {
      value: editValue,
      as_of_date: editDate,
      source_note: editSource,
      approval_status: editingStat.approval_status,
    };

    try {
      await api.admin.updateStatistic(editingStat.id, payload);
      setStats((prev) =>
        prev.map((s) =>
          s.id === editingStat.id
            ? { ...s, value: editValue, as_of_date: editDate, source_note: editSource }
            : s
        )
      );
      setToast({ type: 'success', message: `Statistic "${editingStat.label}" updated successfully.` });
      setEditingStat(null);
      setShowTierCModal(false);
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to update statistic.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminPageHeader
        title="Key Operational Statistics & Gating Tiers"
        description="Audit and govern public metrics. Tier A represents general operational figures, Tier B represents service metrics, and Tier C represents strictly gated performance metrics requiring compliance sign-off."
        secondaryAction={{
          label: 'Refresh',
          onClick: fetchStats,
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

      {/* Grid of stats */}
      {loading ? (
        <div className="admin-bento-tile" style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
          Loading statistics and gating tiers...
        </div>
      ) : stats.length === 0 ? (
        <div className="admin-bento-tile" style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
          No statistics registered in the database. Approved statistics will appear here.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
        {stats.map((stat) => {
          const isTierC = stat.tier === 'tier_c';
          const isTierB = stat.tier === 'tier_b';
          const tierLabel = isTierC ? 'Tier C (Performance / Gated)' : isTierB ? 'Tier B (Service Operational)' : 'Tier A (Public Core)';
          const borderColor = isTierC ? '#E92332' : isTierB ? '#1B4F82' : '#D7D9DC';

          return (
            <div
              key={stat.id}
              className="admin-bento-tile"
              style={{
                padding: '20px',
                borderTop: `3px solid ${borderColor}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      color: isTierC ? '#E92332' : '#8A949D',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {isTierC && <AdminIcon name="lock" size={12} color="#E92332" />}
                    <span>{tierLabel}</span>
                  </span>

                  <span
                    style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      backgroundColor: '#051329',
                      border: '1px solid #1B4F82',
                      color: '#FFFFFF',
                      textTransform: 'uppercase',
                    }}
                  >
                    {stat.approval_status}
                  </span>
                </div>

                <h3 style={{ margin: '0 0 6px', fontSize: '15px', color: '#FFFFFF', fontWeight: 600 }}>
                  {stat.label}
                </h3>

                <div style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF', margin: '4px 0' }}>
                  {stat.prefix || ''}{stat.value}{stat.suffix || ''}
                </div>

                <div style={{ fontSize: '12px', color: '#8A949D', marginTop: '6px' }}>
                  As of: <span style={{ color: '#D7D9DC' }}>{stat.as_of_date}</span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#8A949D', marginTop: '2px' }}>
                  Source: <span style={{ color: '#D7D9DC' }}>{stat.source_note}</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <button
                  type="button"
                  onClick={() => openEditModal(stat)}
                  className="admin-btn-secondary"
                  style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    border: isTierC ? '1px solid #E92332' : '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {isTierC ? 'Restricted Edit' : 'Edit Metric'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Standard Edit Modal (Tier A / B) */}
      {editingStat && !showTierCModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Edit statistic"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 19, 41, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setEditingStat(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: '#071B30',
              border: '1px solid #1B4F82',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '17px', color: '#FFFFFF', fontFamily: 'Poppins, sans-serif' }}>
                Edit {editingStat.label}
              </h3>
              <button
                type="button"
                onClick={() => setEditingStat(null)}
                style={{ background: 'transparent', border: 'none', color: '#8A949D', cursor: 'pointer' }}
              >
                <AdminIcon name="close" size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                  Metric Value
                </label>
                <input
                  type="number"
                  step="any"
                  value={editValue}
                  onChange={(e) => setEditValue(Number(e.target.value))}
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                  As Of Date (YYYY-MM-DD)
                </label>
                <input
                  type="text"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                  Source / Verification Reference
                </label>
                <input
                  type="text"
                  value={editSource}
                  onChange={(e) => setEditSource(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setEditingStat(null)}
                  className="admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleCommitUpdate}
                  className="admin-btn-primary"
                >
                  {saving ? 'Updating...' : 'Save Metric'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tier C Restricted Compliance Modal */}
      {editingStat && showTierCModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tier C Compliance Warning"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 19, 41, 0.9)',
            backdropFilter: 'blur(10px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => {
            setEditingStat(null);
            setShowTierCModal(false);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#071B30',
              border: '2px solid #E92332',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(233, 35, 50, 0.15)',
                  border: '1px solid #E92332',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#E92332',
                  flexShrink: 0,
                }}
              >
                <AdminIcon name="lock" size={18} color="#E92332" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', color: '#FFFFFF', fontFamily: 'Poppins, sans-serif' }}>
                  SEBI Compliance Approval Required
                </h3>
                <span style={{ fontSize: '12px', color: '#E92332' }}>Tier C Restricted Metric</span>
              </div>
            </div>

            <div
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: '#051329',
                border: '1px solid #1B4F82',
                fontSize: '12.5px',
                color: '#D7D9DC',
                lineHeight: 1.6,
              }}
            >
              Modifying Tier C performance metrics (e.g. Equity CAGR) requires verified auditor sign-off and mandatory compliance documentation before updating. These metrics are strictly gated and shielded from public display unless explicit compliance approvals are satisfied.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '4px' }}>
                  New Value (%)
                </label>
                <input
                  type="number"
                  step="any"
                  value={editValue}
                  onChange={(e) => setEditValue(Number(e.target.value))}
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '4px' }}>
                  Audited As-of Date
                </label>
                <input
                  type="text"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '4px' }}>
                  Compliance Sign-off Certificate Reference
                </label>
                <input
                  type="text"
                  value={editSource}
                  onChange={(e) => setEditSource(e.target.value)}
                  placeholder="e.g. SEBI Audit Cert Ref #2026-Q1"
                  className="admin-input"
                />
              </div>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  marginTop: '6px',
                }}
              >
                <input
                  type="checkbox"
                  checked={complianceConfirmed}
                  onChange={(e) => setComplianceConfirmed(e.target.checked)}
                  style={{ marginTop: '2px' }}
                />
                <span>
                  I confirm that this change is authorized by the registered Compliance Officer with audited documentation on file.
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => {
                  setEditingStat(null);
                  setShowTierCModal(false);
                }}
                className="admin-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving || !complianceConfirmed}
                onClick={handleCommitUpdate}
                className="admin-btn-primary"
                style={{ opacity: complianceConfirmed ? 1 : 0.5 }}
              >
                {saving ? 'Authorizing...' : 'Authorize & Commit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
