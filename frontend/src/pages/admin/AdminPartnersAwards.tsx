import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminIcon } from '../../components/admin/AdminIcons';
import { AdminToast } from '../../components/admin/AdminToast';

export interface PartnerItem {
  id: number;
  name: string;
  relationship: string;
  status: 'published' | 'draft' | 'archived';
}

export interface AwardItem {
  id: number;
  title: string;
  issuer: string;
  year: string;
  hasCertificate: boolean;
  status: 'published' | 'draft' | 'archived';
}

export const AdminPartnersAwards: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'partners' | 'awards'>('partners');
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [partnerRelation, setPartnerRelation] = useState('');
  const [awardTitle, setAwardTitle] = useState('');
  const [awardIssuer, setAwardIssuer] = useState('');
  const [awardYear, setAwardYear] = useState('2026');
  const [hasCert, setHasCert] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resPartners, resAwards]: any = await Promise.all([
        api.admin.getContent({ content_type: 'partner', page_size: 50 }).catch(() => null),
        api.admin.getContent({ content_type: 'achievement', page_size: 50 }).catch(() => null),
      ]);

      if (resPartners && Array.isArray(resPartners.items)) {
        setPartners(
          resPartners.items.map((i: any) => ({
            id: i.id,
            name: i.title,
            relationship: i.meta_description || 'Empanelled Partner',
            status: i.status || 'published',
          }))
        );
      }

      if (resAwards && Array.isArray(resAwards.items)) {
        setAwards(
          resAwards.items.map((i: any) => ({
            id: i.id,
            title: i.title,
            issuer: i.meta_title || 'Industry Authority',
            year: i.meta_description || '2025',
            hasCertificate: true,
            status: i.status || 'published',
          }))
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setPartnerName('');
    setPartnerRelation('');
    setAwardTitle('');
    setAwardIssuer('');
    setAwardYear('2026');
    setHasCert(true);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      if (activeTab === 'partners') {
        const payload = {
          title: partnerName.trim(),
          slug: `partner-${Date.now()}`,
          content_type: 'partner',
          meta_description: partnerRelation.trim(),
          status: 'published',
        };
        const created: any = await api.admin.createContent(payload);
        setPartners((prev) => [
          {
            id: created?.id || Date.now(),
            name: partnerName,
            relationship: partnerRelation,
            status: 'published',
          },
          ...prev,
        ]);
        setToast({ type: 'success', message: 'Empanelled partner added successfully.' });
      } else {
        const payload = {
          title: awardTitle.trim(),
          slug: `achievement-${Date.now()}`,
          content_type: 'achievement',
          meta_title: awardIssuer.trim(),
          meta_description: awardYear.trim(),
          status: 'published',
        };
        const created: any = await api.admin.createContent(payload);
        setAwards((prev) => [
          {
            id: created?.id || Date.now(),
            title: awardTitle,
            issuer: awardIssuer,
            year: awardYear,
            hasCertificate: hasCert,
            status: 'published',
          },
          ...prev,
        ]);
        setToast({ type: 'success', message: 'Industry recognition award added.' });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to save entry.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePartner = async (id: number) => {
    try {
      await api.admin.archiveContent(id);
      setPartners((prev) => prev.filter((p) => p.id !== id));
      setToast({ type: 'success', message: 'Partner entry archived.' });
    } catch {
      setPartners((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleDeleteAward = async (id: number) => {
    try {
      await api.admin.archiveContent(id);
      setAwards((prev) => prev.filter((a) => a.id !== id));
      setToast({ type: 'success', message: 'Award entry archived.' });
    } catch {
      setAwards((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminPageHeader
        title="Institutional Partners & Industry Awards"
        description="Verify and update registered AMCs, empanelled insurance underwriters, and official industry recognitions."
        primaryAction={{
          label: activeTab === 'partners' ? 'Add Partner' : 'Add Award',
          onClick: handleOpenAdd,
          icon: 'plus',
        }}
        secondaryAction={{
          label: 'Refresh',
          onClick: fetchData,
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('partners')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: activeTab === 'partners' ? '1px solid #E92332' : '1px solid transparent',
            backgroundColor: activeTab === 'partners' ? '#C81B29' : 'rgba(255, 255, 255, 0.05)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Empanelled Partners ({partners.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('awards')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: activeTab === 'awards' ? '1px solid #E92332' : '1px solid transparent',
            backgroundColor: activeTab === 'awards' ? '#C81B29' : 'rgba(255, 255, 255, 0.05)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Verified Awards ({awards.length})
        </button>
      </div>

      {/* List */}
      <div className="admin-bento-tile" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {activeTab === 'partners' ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1B4F82', backgroundColor: 'rgba(5, 19, 41, 0.6)', color: '#8A949D' }}>
                  <th style={{ padding: '12px 16px' }}>Partner / Underwriter</th>
                  <th style={{ padding: '12px 16px' }}>Relationship Category</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
                      Loading partners and awards from database...
                    </td>
                  </tr>
                ) : partners.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
                      No empanelled partners found. Click "Add Partner" to register one.
                    </td>
                  </tr>
                ) : partners.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px 16px', color: '#FFFFFF', fontWeight: 600 }}>
                      {p.name}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#D7D9DC' }}>
                      {p.relationship}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: '#123D67',
                          color: '#FFFFFF',
                          textTransform: 'uppercase',
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleDeletePartner(p.id)}
                        className="admin-btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '11.5px', color: '#E92332' }}
                      >
                        Archive
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1B4F82', backgroundColor: 'rgba(5, 19, 41, 0.6)', color: '#8A949D' }}>
                  <th style={{ padding: '12px 16px' }}>Award Recognition</th>
                  <th style={{ padding: '12px 16px' }}>Issuing Authority</th>
                  <th style={{ padding: '12px 16px' }}>Year</th>
                  <th style={{ padding: '12px 16px' }}>Certificate</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {awards.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
                      No awards or recognitions recorded. Click "Add Recognition" to record one.
                    </td>
                  </tr>
                ) : (
                  awards.map((a) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px 16px', color: '#FFFFFF', fontWeight: 600 }}>
                      {a.title}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#D7D9DC' }}>
                      {a.issuer}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#8A949D' }}>
                      {a.year}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: '#051329',
                          border: '1px solid #1B4F82',
                          color: '#FFFFFF',
                        }}
                      >
                        {a.hasCertificate ? 'VERIFIED' : 'PENDING'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteAward(a.id)}
                        className="admin-btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '11.5px', color: '#E92332' }}
                      >
                        Archive
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Add entry dialog"
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
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
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
                {activeTab === 'partners' ? 'Add Empanelled Partner' : 'Add Verified Award'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#8A949D', cursor: 'pointer' }}
              >
                <AdminIcon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activeTab === 'partners' ? (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                      Partner / Underwriter Name
                    </label>
                    <input
                      type="text"
                      required
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="e.g. HDFC Asset Management"
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                      Relationship Category
                    </label>
                    <input
                      type="text"
                      required
                      value={partnerRelation}
                      onChange={(e) => setPartnerRelation(e.target.value)}
                      placeholder="e.g. Direct Mutual Fund Empanelled AMC"
                      className="admin-input"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                      Award Title
                    </label>
                    <input
                      type="text"
                      required
                      value={awardTitle}
                      onChange={(e) => setAwardTitle(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                      Issuing Authority
                    </label>
                    <input
                      type="text"
                      required
                      value={awardIssuer}
                      onChange={(e) => setAwardIssuer(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                        Year Received
                      </label>
                      <input
                        type="text"
                        value={awardYear}
                        onChange={(e) => setAwardYear(e.target.value)}
                        className="admin-input"
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#D7D9DC', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={hasCert}
                          onChange={(e) => setHasCert(e.target.checked)}
                        />
                        Certificate Verified
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-btn-primary"
                >
                  {saving ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
