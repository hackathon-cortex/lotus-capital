import React, { useState } from 'react';
import { useAuth } from '../../context/MockAuthContext';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminIcon } from '../../components/admin/AdminIcons';
import { AdminToast } from '../../components/admin/AdminToast';

export const AdminAccount: React.FC = () => {
  const { user, changePassword, logout } = useAuth();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const cleanName = user?.name ? user.name.replace(/\s*\(mock\s*admin\)/i, '').trim() : 'Abhilash Chudasama';
  const roleDisplay = user?.role ? user.role.toUpperCase() : 'ADMIN';
  const initials = cleanName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AC';

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (newPassword !== confirmPassword) {
      setToast({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setToast({ type: 'error', message: 'Password must be at least 8 characters long.' });
      return;
    }

    setLoading(true);
    try {
      const res = await changePassword(oldPassword, newPassword);
      if (res.success) {
        setToast({ type: 'success', message: 'Account password updated successfully!' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setToast({ type: 'error', message: res.error || 'Failed to update account password.' });
      }
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Error updating password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminPageHeader
        title="My Account & Security"
        description="Review personal authentication profile, active session permissions, and update password credentials."
      />

      {toast && (
        <AdminToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Profile Card */}
        <div
          className="admin-bento-tile"
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#123D67',
                border: '2px solid #1B4F82',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '20px',
                fontWeight: 700,
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              {initials}
            </div>

            <div>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#FFFFFF', fontWeight: 600 }}>
                {cleanName}
              </h2>
              <div style={{ fontSize: '13px', color: '#8A949D', marginTop: '2px' }}>
                {user?.email || 'admin@lotuscapital.in'}
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '13px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#8A949D' }}>System Role:</span>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: '#123D67',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '11px',
                }}
              >
                {roleDisplay}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#8A949D' }}>Authentication:</span>
              <span style={{ color: '#FFFFFF' }}>FastAPI JWT Bearer</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#8A949D' }}>Session Security:</span>
              <span style={{ color: '#FFFFFF' }}>Active (Token auto-refreshed)</span>
            </div>
          </div>

          <div style={{ paddingTop: '12px' }}>
            <button
              type="button"
              onClick={logout}
              className="admin-btn-secondary"
              style={{ width: '100%', color: '#E92332' }}
            >
              <AdminIcon name="signout" size={14} color="#E92332" />
              <span>Sign Out of Admin Console</span>
            </button>
          </div>
        </div>

        {/* Password Change Form */}
        <div
          className="admin-bento-tile"
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '16px', color: '#FFFFFF', fontFamily: 'Poppins, sans-serif' }}>
            Change Account Password
          </h3>

          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                Current Password
              </label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="admin-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                New Password (minimum 8 characters)
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="admin-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="admin-input"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                type="submit"
                disabled={loading}
                className="admin-btn-primary"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

