import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminIcon } from '../../components/admin/AdminIcons';
import { AdminToast } from '../../components/admin/AdminToast';

export interface UserItem {
  id: number;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'editor';
  is_active: boolean;
  created_at?: string;
}

const DEFAULT_USERS: UserItem[] = [
  {
    id: 1,
    email: 'admin@lotuscapital.in',
    full_name: 'Abhilash Chudasama',
    role: 'super_admin',
    is_active: true,
  },
];

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>(DEFAULT_USERS);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Invite Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'super_admin' | 'admin' | 'editor'>('editor');
  const [saving, setSaving] = useState(false);

  // Reset Password Modal
  const [resetModalUserId, setResetModalUserId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resettingPw, setResettingPw] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res: any = await api.admin.getUsers();
      if (res && Array.isArray(res)) {
        setUsers(res);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    const payload = {
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: role,
      is_active: true,
    };

    try {
      const created: any = await api.admin.createUser(payload);
      const newUser: UserItem = {
        id: created?.id || Date.now(),
        email: email.trim().toLowerCase(),
        full_name: fullName.trim(),
        role: role,
        is_active: true,
      };
      setUsers((prev) => [newUser, ...prev]);
      setToast({ type: 'success', message: `Staff member "${fullName}" invited successfully.` });
      setIsModalOpen(false);
      setFullName('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to create user.' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user: UserItem) => {
    try {
      const nextActive = !user.is_active;
      await api.admin.updateUser(user.id, { is_active: nextActive });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: nextActive } : u))
      );
      setToast({
        type: 'success',
        message: `User ${user.full_name} ${nextActive ? 'activated' : 'deactivated'}.`,
      });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to update user status.' });
    }
  };

  const handleRoleChange = async (userId: number, newRole: 'super_admin' | 'admin' | 'editor') => {
    try {
      await api.admin.updateUser(userId, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setToast({ type: 'success', message: 'User role updated.' });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to change role.' });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUserId) return;
    if (newPassword.length < 8) {
      setToast({ type: 'error', message: 'Password must be at least 8 characters.' });
      return;
    }

    setResettingPw(true);
    try {
      await api.admin.updateUser(resetModalUserId, { password: newPassword });
      setToast({ type: 'success', message: 'Password reset successfully.' });
      setResetModalUserId(null);
      setNewPassword('');
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to reset password.' });
    } finally {
      setResettingPw(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminPageHeader
        title="Users & Access Permissions"
        description="Provision administrative credentials, assign advisory roles, and manage system authentication states."
        primaryAction={{
          label: 'Invite User',
          onClick: () => setIsModalOpen(true),
          icon: 'user-plus',
        }}
        secondaryAction={{
          label: 'Refresh',
          onClick: fetchUsers,
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

      {/* Table */}
      <div className="admin-bento-tile" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1B4F82', backgroundColor: 'rgba(5, 19, 41, 0.6)', color: '#8A949D' }}>
                <th style={{ padding: '12px 16px' }}>Staff Member</th>
                <th style={{ padding: '12px 16px' }}>Email Address</th>
                <th style={{ padding: '12px 16px' }}>Permission Role</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
                    Loading staff accounts...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '12px 16px', color: '#FFFFFF', fontWeight: 600 }}>
                    {u.full_name}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#D7D9DC' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#051329',
                        border: '1px solid #1B4F82',
                        color: '#FFFFFF',
                        fontSize: '12px',
                      }}
                    >
                      <option value="super_admin">Super Admin</option>
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: u.is_active ? '#123D67' : 'rgba(233, 35, 50, 0.15)',
                        border: `1px solid ${u.is_active ? '#1B4F82' : '#E92332'}`,
                        color: u.is_active ? '#FFFFFF' : '#E92332',
                      }}
                    >
                      {u.is_active ? 'ACTIVE' : 'DEACTIVATED'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setResetModalUserId(u.id)}
                        className="admin-btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                      >
                        Reset PW
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(u)}
                        className="admin-btn-secondary"
                        style={{
                          padding: '4px 10px',
                          fontSize: '11px',
                          color: u.is_active ? '#E92332' : '#FFFFFF',
                        }}
                      >
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Invite user dialog"
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
                Invite Staff Member
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#8A949D', cursor: 'pointer' }}
              >
                <AdminIcon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                  Work Email Address
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
                  Initial Password (min 8 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                  Role & Access Level
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="admin-input"
                >
                  <option value="editor">Editor (Leads & Content)</option>
                  <option value="admin">Admin (Reports, Content & Settings)</option>
                  <option value="super_admin">Super Admin (All Permissions)</option>
                </select>
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
                  disabled={saving}
                  className="admin-btn-primary"
                >
                  {saving ? 'Inviting...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetModalUserId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Reset password dialog"
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
          onClick={() => setResetModalUserId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#071B30',
              border: '1px solid #1B4F82',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#FFFFFF', fontFamily: 'Poppins, sans-serif' }}>
                Reset User Password
              </h3>
              <button
                type="button"
                onClick={() => setResetModalUserId(null)}
                style={{ background: 'transparent', border: 'none', color: '#8A949D', cursor: 'pointer' }}
              >
                <AdminIcon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                  New Password (min 8 chars)
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setResetModalUserId(null)}
                  className="admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resettingPw}
                  className="admin-btn-primary"
                >
                  {resettingPw ? 'Saving...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
