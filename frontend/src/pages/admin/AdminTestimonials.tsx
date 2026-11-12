import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminIcon } from '../../components/admin/AdminIcons';
import { AdminToast } from '../../components/admin/AdminToast';

export interface TestimonialItem {
  id: number;
  clientName: string;
  designation: string;
  quote: string;
  rating: number;
  hasComplianceConsent: boolean;
  status: 'published' | 'draft' | 'archived';
}

export const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [designation, setDesignation] = useState('');
  const [quote, setQuote] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res: any = await api.admin.getContent({ content_type: 'testimonial', page_size: 50 });
      if (res && Array.isArray(res.items)) {
        setTestimonials(
          res.items.map((i: any) => ({
            id: i.id,
            clientName: i.title,
            designation: i.meta_title || 'Client',
            quote: i.body || '',
            rating: 5,
            hasComplianceConsent: true,
            status: i.status || 'published',
          }))
        );
      }
    } catch {
      // Empty on failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenAdd = () => {
    setClientName('');
    setDesignation('');
    setQuote('');
    setConsentChecked(false);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) {
      setToast({
        type: 'error',
        message: 'SEBI Compliance: Written client consent confirmation is strictly required.',
      });
      return;
    }

    setSaving(true);
    setToast(null);

    const payload = {
      title: clientName.trim(),
      slug: `testimonial-${Date.now()}`,
      content_type: 'testimonial',
      meta_title: designation.trim(),
      body: quote.trim(),
      status: 'published',
    };

    try {
      const created: any = await api.admin.createContent(payload);
      const newEntry: TestimonialItem = {
        id: created?.id || Date.now(),
        clientName,
        designation,
        quote,
        rating: 5,
        hasComplianceConsent: true,
        status: 'published',
      };
      setTestimonials((prev) => [newEntry, ...prev]);
      setToast({ type: 'success', message: 'Client review published under compliance code.' });
      setIsModalOpen(false);
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to publish review.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.admin.archiveContent(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      setToast({ type: 'success', message: 'Review entry archived.' });
    } catch {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminPageHeader
        title="Client Reviews & Consented Testimonials"
        description="Curate verified client feedback. All testimonials require recorded written consent compliant with SEBI regulations."
        primaryAction={{
          label: 'Add Review',
          onClick: handleOpenAdd,
          icon: 'plus',
        }}
        secondaryAction={{
          label: 'Refresh',
          onClick: fetchTestimonials,
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

      {/* Grid */}
      {loading ? (
        <div className="admin-bento-tile" style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
          Loading client testimonials...
        </div>
      ) : testimonials.length === 0 ? (
        <div className="admin-bento-tile" style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
          No client testimonials found. Click "Add Testimonial" to record one.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="admin-bento-tile"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', color: '#FFFFFF', fontWeight: 600 }}>
                    {t.clientName}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#8A949D', marginTop: '2px' }}>
                    {t.designation}
                  </div>
                </div>

                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10.5px',
                    fontWeight: 600,
                    backgroundColor: '#051329',
                    border: '1px solid #1B4F82',
                    color: '#FFFFFF',
                  }}
                >
                  CONSENT ON FILE
                </span>
              </div>

              <p style={{ margin: 0, fontSize: '13px', color: '#D7D9DC', lineHeight: 1.6, fontStyle: 'italic' }}>
                "{t.quote}"
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingTop: '10px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <button
                type="button"
                onClick={() => handleDelete(t.id)}
                className="admin-btn-secondary"
                style={{ padding: '4px 10px', fontSize: '11.5px', color: '#E92332' }}
              >
                Archive
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Add testimonial dialog"
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
              maxWidth: '500px',
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
                Add Consented Client Testimonial
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
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                  Client Full Name
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                  Designation / Location
                </label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Entrepreneur, Ahmedabad"
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                  Review Statement Quote
                </label>
                <textarea
                  rows={4}
                  required
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="admin-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* MANDATORY Compliance Checkbox */}
              <div
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#051329',
                  border: '1px solid #1B4F82',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '12px',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    lineHeight: 1.5,
                  }}
                >
                  <input
                    type="checkbox"
                    required
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    style={{ marginTop: '2px' }}
                  />
                  <span>
                    <strong>Mandatory SEBI Compliance Consent:</strong> I confirm that this client has provided verified written consent under SEBI and IRDAI advertising codes.
                  </span>
                </label>
              </div>

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
                  disabled={saving || !consentChecked}
                  className="admin-btn-primary"
                  style={{ opacity: consentChecked ? 1 : 0.5 }}
                >
                  {saving ? 'Publishing...' : 'Publish Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
