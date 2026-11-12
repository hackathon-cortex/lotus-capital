import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminIcon } from '../../components/admin/AdminIcons';
import { AdminToast } from '../../components/admin/AdminToast';

export interface TeamMember {
  id: number;
  name: string;
  designation: string;
  bio: string;
  photo_url?: string;
  status: 'published' | 'draft' | 'archived';
}

export const AdminTeam: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formDesignation, setFormDesignation] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formPhoto, setFormPhoto] = useState('');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res: any = await api.admin.getContent({ content_type: 'team', page_size: 50 });
      if (res && Array.isArray(res.items)) {
        const mapped = res.items.map((item: any) => ({
          id: item.id,
          name: item.title,
          designation: item.meta_title || 'Advisor',
          bio: item.body || '',
          photo_url: item.featured_image || '',
          status: item.status || 'published',
        }));
        setTeam(mapped);
      }
    } catch {
      // Empty on failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setFormName('');
    setFormDesignation('');
    setFormBio('');
    setFormPhoto('');
    setFormStatus('published');
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormDesignation(member.designation);
    setFormBio(member.bio);
    setFormPhoto(member.photo_url || '');
    setFormStatus(member.status === 'archived' ? 'draft' : member.status);
    setIsModalOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const res: any = await api.admin.uploadMedia(file);
      const url = res?.url || res?.path || res?.file_path || res?.filename;
      if (url) {
        setFormPhoto(url);
        setToast({ type: 'success', message: 'Profile photo uploaded successfully.' });
      }
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to upload photo.' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setTeam((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setToast({ type: 'success', message: 'Team member moved up.' });
  };

  const handleMoveDown = (index: number) => {
    if (index === team.length - 1) return;
    setTeam((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setToast({ type: 'success', message: 'Team member moved down.' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDesignation.trim()) {
      setToast({ type: 'error', message: 'Name and designation are required.' });
      return;
    }

    setSaving(true);
    setToast(null);

    const payload = {
      title: formName.trim(),
      slug: `team-${Date.now()}`,
      content_type: 'team',
      meta_title: formDesignation.trim(),
      body: formBio.trim(),
      featured_image: formPhoto.trim() || undefined,
      status: formStatus,
    };

    try {
      if (editingMember) {
        await api.admin.updateContent(editingMember.id, payload);
        setTeam((prev) =>
          prev.map((m) =>
            m.id === editingMember.id
              ? { ...m, name: formName, designation: formDesignation, bio: formBio, photo_url: formPhoto, status: formStatus }
              : m
          )
        );
        setToast({ type: 'success', message: 'Team profile updated.' });
      } else {
        const created: any = await api.admin.createContent(payload);
        const newMember: TeamMember = {
          id: created?.id || Date.now(),
          name: formName,
          designation: formDesignation,
          bio: formBio,
          photo_url: formPhoto,
          status: formStatus,
        };
        setTeam((prev) => [newMember, ...prev]);
        setToast({ type: 'success', message: 'Team profile created.' });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to save team member.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this profile?')) return;
    try {
      await api.admin.archiveContent(id);
      setTeam((prev) => prev.filter((m) => m.id !== id));
      setToast({ type: 'success', message: 'Team profile archived.' });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to delete profile.' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminPageHeader
        title="Leadership & Advisor Profiles"
        description="Manage advisor names, designations, bios, photos, and team display ordering shown on About Us."
        primaryAction={{
          label: 'Add Team Member',
          onClick: openAddModal,
          icon: 'plus',
        }}
      />

      {toast && <AdminToast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {loading ? (
        <div style={{ padding: '30px', textAlign: 'center', color: '#8A949D' }}>Loading profiles...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {team.map((member, idx) => (
            <div
              key={member.id}
              style={{
                backgroundColor: '#071B30',
                border: '1px solid #1B4F82',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    backgroundColor: '#051329',
                    border: '1px solid #1B4F82',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '18px', fontWeight: 600, color: '#8A949D' }}>
                      {member.name.charAt(0)}
                    </span>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', color: '#FFFFFF', fontWeight: 600 }}>{member.name}</h3>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: member.status === 'published' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(215, 217, 220, 0.15)',
                        color: member.status === 'published' ? '#10B981' : '#D7D9DC',
                      }}
                    >
                      {member.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#E92332', fontWeight: 500, marginTop: '2px' }}>
                    {member.designation}
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#8A949D', lineHeight: 1.4 }}>
                    {member.bio || 'No biography entered.'}
                  </p>
                </div>
              </div>

              {/* Actions & Reordering */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(27, 79, 130, 0.5)', paddingTop: '10px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    title="Move up"
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(215, 217, 220, 0.2)',
                      borderRadius: '4px',
                      color: idx === 0 ? '#556270' : '#FFFFFF',
                      cursor: idx === 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    ↑ Up
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === team.length - 1}
                    title="Move down"
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(215, 217, 220, 0.2)',
                      borderRadius: '4px',
                      color: idx === team.length - 1 ? '#556270' : '#FFFFFF',
                      cursor: idx === team.length - 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    ↓ Down
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => openEditModal(member)}
                    className="admin-btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '11.5px' }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(member.id)}
                    className="admin-btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '11.5px', color: '#E92332' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Team member dialog"
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
              maxWidth: '520px',
              backgroundColor: '#071B30',
              border: '1px solid #1B4F82',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '17px', color: '#FFFFFF', fontFamily: 'Poppins, sans-serif' }}>
                {editingMember ? 'Edit Profile' : 'Add Team Member'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#8A949D',
                  cursor: 'pointer',
                }}
              >
                <AdminIcon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                  Full Name <span style={{ color: '#E92332' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="admin-input"
                  placeholder="e.g. Abhilash Dineshchandra Chudasama"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                  Designation <span style={{ color: '#E92332' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formDesignation}
                  onChange={(e) => setFormDesignation(e.target.value)}
                  placeholder="e.g. Proprietor"
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                  Profile Photo
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    style={{ fontSize: '12px', color: '#D7D9DC' }}
                  />
                  {uploadingPhoto && <span style={{ fontSize: '12px', color: '#8A949D' }}>Uploading...</span>}
                </div>
                {formPhoto && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={formPhoto}
                      alt="Preview"
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontSize: '11px', color: '#8A949D', wordBreak: 'break-all' }}>{formPhoto}</span>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                  Role &amp; Bio Summary
                </label>
                <textarea
                  rows={3}
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  className="admin-input"
                  placeholder="One-line role description and qualifications..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                  Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'published' | 'draft')}
                  className="admin-input"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingPhoto}
                  className="admin-btn-primary"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeam;
