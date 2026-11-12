import React, { useState } from 'react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminToast } from '../../components/admin/AdminToast';

export const AdminContactSettings: React.FC = () => {
  const [phone, setPhone] = useState('+91 98250 00000');
  const [email, setEmail] = useState('contact@lotuscapital.in');
  const [address, setAddress] = useState('Lotus Capital Advisory, Gujarat, India');
  const [hours, setHours] = useState('Monday - Saturday: 9:30 AM - 6:30 PM IST');
  const [arnNumber, setArnNumber] = useState('ARN-123456');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);
    setTimeout(() => {
      setSaving(false);
      setToast({ type: 'success', message: 'Office & contact settings saved successfully.' });
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminPageHeader
        title="Office & Contact Settings"
        description="Configure corporate telephone numbers, support email, advisory headquarters address, and operating hours."
      />

      {toast && (
        <AdminToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div
        className="admin-bento-tile"
        style={{
          padding: '24px',
          maxWidth: '640px',
        }}
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
              Primary Advisory Contact Phone
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="admin-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
              Official Support Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
              Corporate Headquarters Address
            </label>
            <textarea
              rows={3}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="admin-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
              Consultation Operating Hours
            </label>
            <input
              type="text"
              required
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="admin-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
              AMFI / SEBI Registration Number (ARN)
            </label>
            <input
              type="text"
              required
              value={arnNumber}
              onChange={(e) => setArnNumber(e.target.value)}
              className="admin-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="submit"
              disabled={saving}
              className="admin-btn-primary"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
