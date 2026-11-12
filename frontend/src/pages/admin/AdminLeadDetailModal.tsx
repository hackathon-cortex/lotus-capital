import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { BackendEnquiry } from '../../api/types';
import { AdminIcon } from '../../components/admin/AdminIcons';
import { AdminToast } from '../../components/admin/AdminToast';

export interface AdminLeadDetailModalProps {
  enquiryId: number | string | null;
  onClose: () => void;
  onUpdated?: (updated: BackendEnquiry) => void;
  onDeleted?: (deleted: BackendEnquiry) => void;
  onRestored?: (restored: BackendEnquiry) => void;
  onPermanentDeleted?: (id: number) => void;
}

const PIPELINE_STATUSES: Array<{ id: 'new' | 'contacted' | 'in_progress' | 'resolved' | 'closed'; label: string }> = [
  { id: 'new', label: 'New' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'closed', label: 'Closed' },
];

const DELETE_REASONS = [
  { value: 'duplicate', label: 'Duplicate Entry' },
  { value: 'spam', label: 'Spam / Invalid Mobile' },
  { value: 'test_data', label: 'Internal Test Submission' },
  { value: 'client_requested_removal', label: 'Client Requested Removal' },
  { value: 'unresponsive', label: 'Unresponsive after multiple attempts' },
  { value: 'other', label: 'Other Reason' },
];

export const AdminLeadDetailModal: React.FC<AdminLeadDetailModalProps> = ({
  enquiryId,
  onClose,
  onUpdated,
  onDeleted,
  onRestored,
  onPermanentDeleted,
}) => {
  const [enquiry, setEnquiry] = useState<BackendEnquiry | null>(null);
  const [loading, setLoading] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [users, setUsers] = useState<Array<{ id: number; full_name: string; email: string }>>([]);

  // Delete & Trash states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('other');
  const [isDeleting, setIsDeleting] = useState(false);

  // Permanent Delete Modal
  const [showPermanentModal, setShowPermanentModal] = useState(false);
  const [typedConfirm, setTypedConfirm] = useState('');
  const [isPermanentDeleting, setIsPermanentDeleting] = useState(false);

  useEffect(() => {
    if (!enquiryId) return;
    let active = true;
    setLoading(true);

    Promise.all([
      api.admin.getEnquiry(enquiryId),
      api.admin.getUsers().catch(() => []),
    ])
      .then(([resEnquiry, resUsers]) => {
        if (!active) return;
        setEnquiry(resEnquiry);
        setNotesText(resEnquiry.admin_notes || '');
        if (Array.isArray(resUsers)) {
          setUsers(resUsers);
        }
      })
      .catch((err) => {
        if (!active) return;
        setToast({ type: 'error', message: err?.message || 'Failed to load lead details.' });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [enquiryId]);

  const handleStatusChange = async (newStatus: 'new' | 'contacted' | 'in_progress' | 'resolved' | 'closed') => {
    if (!enquiry) return;
    setUpdatingStatus(true);
    setToast(null);
    try {
      const updated = await api.admin.updateEnquiry(enquiry.id, { status: newStatus });
      setEnquiry(updated);
      onUpdated?.(updated);
      setToast({ type: 'success', message: `Lead status updated to ${newStatus.toUpperCase()}.` });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to update lead status.' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAssigneeChange = async (newAssigneeId: number | null) => {
    if (!enquiry) return;
    setToast(null);
    try {
      const updated = await api.admin.updateEnquiry(enquiry.id, { assigned_to: newAssigneeId });
      setEnquiry(updated);
      onUpdated?.(updated);
      setToast({ type: 'success', message: 'Assigned advisor updated.' });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to update assigned advisor.' });
    }
  };

  const handleSaveNotes = async () => {
    if (!enquiry) return;
    setSavingNote(true);
    setToast(null);
    try {
      const updated = await api.admin.updateEnquiry(enquiry.id, { admin_notes: notesText });
      setEnquiry(updated);
      onUpdated?.(updated);
      setToast({ type: 'success', message: 'Internal consultation notes saved.' });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to save notes.' });
    } finally {
      setSavingNote(false);
    }
  };

  // Move to trash (Soft Delete)
  const handleSoftDelete = async () => {
    if (!enquiry) return;
    setIsDeleting(true);
    try {
      const deleted = await api.admin.deleteEnquiry(enquiry.id, deleteReason);
      setShowDeleteModal(false);
      onDeleted?.(deleted);
      onClose();
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to move enquiry to trash.' });
      setIsDeleting(false);
    }
  };

  // Restore lead
  const handleRestore = async () => {
    if (!enquiry) return;
    try {
      const restored = await api.admin.restoreEnquiry(enquiry.id);
      setEnquiry(restored);
      onRestored?.(restored);
      setToast({ type: 'success', message: 'Lead successfully restored from trash.' });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to restore enquiry.' });
    }
  };

  // Permanent Delete
  const handlePermanentDelete = async () => {
    if (!enquiry || typedConfirm.trim() !== 'DELETE') return;
    setIsPermanentDeleting(true);
    try {
      await api.admin.permanentDeleteEnquiry(enquiry.id);
      setShowPermanentModal(false);
      onPermanentDeleted?.(enquiry.id);
      onClose();
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to permanently delete enquiry.' });
      setIsPermanentDeleting(false);
    }
  };

  if (!enquiryId) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(5, 19, 41, 0.75)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-label="Enquiry Details"
        style={{
          width: '100%',
          maxWidth: '560px',
          height: '100%',
          backgroundColor: '#071B30',
          borderLeft: '1px solid #1B4F82',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 24px rgba(0, 0, 0, 0.5)',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #1B4F82',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#051329',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#8A949D', textTransform: 'uppercase' }}>
                Enquiry Detail
              </span>
              {enquiry?.reference_id && (
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: '#FFFFFF',
                    backgroundColor: '#123D67',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {enquiry.reference_id}
                </span>
              )}
              {enquiry?.deleted_at && (
                <span
                  style={{
                    fontSize: '11px',
                    color: '#FFFFFF',
                    backgroundColor: '#E92332',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  TRASH
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 0 0' }}>
              {enquiry ? enquiry.name : 'Loading...'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#8A949D',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <AdminIcon name="close" size={20} />
          </button>
        </div>

        {/* Toast inside drawer */}
        {toast && (
          <div style={{ padding: '12px 24px 0' }}>
            <AdminToast
              type={toast.type}
              message={toast.message}
              onClose={() => setToast(null)}
            />
          </div>
        )}

        {/* Content Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#8A949D', fontSize: '13.5px' }}>
              Loading lead details from secure database...
            </div>
          ) : !enquiry ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#8A949D', fontSize: '13.5px' }}>
              Enquiry record not found.
            </div>
          ) : (
            <>
              {/* Trashed Banner if soft-deleted */}
              {enquiry.deleted_at && (
                <div
                  style={{
                    backgroundColor: 'rgba(233, 35, 50, 0.1)',
                    border: '1px solid #E92332',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                    This lead is in Trash
                  </div>
                  <div style={{ fontSize: '12px', color: '#D7D9DC' }}>
                    Deleted on {new Date(enquiry.deleted_at).toLocaleString('en-IN')}{' '}
                    {enquiry.delete_reason ? `(Reason: ${enquiry.delete_reason})` : ''}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={handleRestore}
                      style={{
                        padding: '6px 14px',
                        background: '#123D67',
                        border: '1px solid #FFFFFF',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Restore Lead
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPermanentModal(true)}
                      style={{
                        padding: '6px 14px',
                        background: 'transparent',
                        border: '1px solid #E92332',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Permanently Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Pipeline Status Stepper (Active only) */}
              {!enquiry.deleted_at && (
                <div
                  style={{
                    backgroundColor: '#051329',
                    border: '1px solid #1B4F82',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div style={{ fontSize: '12px', color: '#D7D9DC', fontWeight: 600, marginBottom: '12px' }}>
                    Pipeline Progression Stage
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                    {PIPELINE_STATUSES.map((st) => {
                      const isActive = enquiry.status === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          disabled={updatingStatus}
                          onClick={() => handleStatusChange(st.id)}
                          style={{
                            padding: '8px 4px',
                            borderRadius: '6px',
                            border: isActive ? '1px solid #E92332' : '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor: isActive ? '#C81B29' : 'rgba(255, 255, 255, 0.04)',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: isActive ? 600 : 400,
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 120ms ease',
                          }}
                        >
                          {st.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Client Contact Profile */}
              <div
                style={{
                  backgroundColor: '#051329',
                  border: '1px solid #1B4F82',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ fontSize: '12px', color: '#D7D9DC', fontWeight: 600 }}>
                  Contact Information
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: '#8A949D', display: 'block', fontSize: '11px' }}>Mobile Number</span>
                    <a
                      href={`tel:${enquiry.mobile}`}
                      style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 500 }}
                    >
                      {enquiry.mobile}
                    </a>
                  </div>

                  <div>
                    <span style={{ color: '#8A949D', display: 'block', fontSize: '11px' }}>Email Address</span>
                    <a
                      href={`mailto:${enquiry.email || ''}`}
                      style={{ color: enquiry.email ? '#FFFFFF' : '#8A949D', textDecoration: 'none' }}
                    >
                      {enquiry.email || 'Not provided'}
                    </a>
                  </div>

                  <div>
                    <span style={{ color: '#8A949D', display: 'block', fontSize: '11px' }}>Source / Channel</span>
                    <span style={{ color: '#FFFFFF' }}>{enquiry.source || enquiry.created_via}</span>
                  </div>

                  <div>
                    <span style={{ color: '#8A949D', display: 'block', fontSize: '11px' }}>Submission Date (IST)</span>
                    <span style={{ color: '#FFFFFF' }}>
                      {new Date(enquiry.created_at).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Hospital / Healthcare Details if present */}
                {((enquiry as any).organisation_name || (enquiry as any).city || (enquiry as any).existing_rohini_id) && (
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: 'rgba(217, 35, 45, 0.08)',
                      border: '1px solid rgba(217, 35, 45, 0.25)',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#e92332', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Hospital / Facility Details (ROHINI Variant)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', fontSize: '12px' }}>
                      {(enquiry as any).organisation_name && (
                        <div>
                          <span style={{ color: '#8A949D', display: 'block', fontSize: '11px' }}>Organisation</span>
                          <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{(enquiry as any).organisation_name}</span>
                        </div>
                      )}
                      {(enquiry as any).city && (
                        <div>
                          <span style={{ color: '#8A949D', display: 'block', fontSize: '11px' }}>City</span>
                          <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{(enquiry as any).city}</span>
                        </div>
                      )}
                      {(enquiry as any).existing_rohini_id && (
                        <div>
                          <span style={{ color: '#8A949D', display: 'block', fontSize: '11px' }}>Existing ROHINI ID</span>
                          <span style={{ color: '#FFFFFF', fontWeight: 600, fontFamily: 'monospace' }}>{(enquiry as any).existing_rohini_id}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Service requested */}
                <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ color: '#8A949D', display: 'block', fontSize: '11px', marginBottom: '6px' }}>
                    Requested Portfolio Solutions
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {enquiry.services && enquiry.services.length > 0 ? (
                      enquiry.services.map((s, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '3px 8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '4px',
                            fontSize: '11.5px',
                            color: '#FFFFFF',
                          }}
                        >
                          {s.service_slug.replace(/-/g, ' ').toUpperCase()}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: '#FFFFFF', fontSize: '12px' }}>General Consultation</span>
                    )}
                  </div>
                </div>

                {/* Initial Client Message */}
                {enquiry.message && (
                  <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ color: '#8A949D', display: 'block', fontSize: '11px', marginBottom: '4px' }}>
                      Client Enquiry Note
                    </span>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#D7D9DC', lineHeight: 1.5 }}>
                      {enquiry.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Staff Assignment */}
              <div
                style={{
                  backgroundColor: '#051329',
                  border: '1px solid #1B4F82',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <label
                  htmlFor="assignee-select"
                  style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', fontWeight: 600, marginBottom: '8px' }}
                >
                  Assigned Wealth Advisor
                </label>
                <select
                  id="assignee-select"
                  value={enquiry.assigned_to || ''}
                  onChange={(e) => handleAssigneeChange(e.target.value ? Number(e.target.value) : null)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#071B30',
                    border: '1px solid #1B4F82',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                >
                  <option value="">Unassigned (General Pool)</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Internal Admin Notes */}
              <div
                style={{
                  backgroundColor: '#051329',
                  border: '1px solid #1B4F82',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label
                    htmlFor="lead-admin-notes"
                    style={{ fontSize: '12px', color: '#D7D9DC', fontWeight: 600 }}
                  >
                    Internal Consultation Notes
                  </label>
                  <span style={{ fontSize: '11px', color: '#8A949D' }}>Confidential to team</span>
                </div>

                <textarea
                  id="lead-admin-notes"
                  rows={4}
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Record consultation outcomes, asset discussion points, or next follow-up agenda..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#071B30',
                    border: '1px solid #1B4F82',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    lineHeight: 1.5,
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={savingNote}
                    className="admin-btn-primary"
                    style={{ fontSize: '12px', padding: '6px 14px' }}
                  >
                    {savingNote ? 'Saving Notes...' : 'Save Notes'}
                  </button>
                </div>
              </div>

              {/* Danger Zone: Move to Trash */}
              {!enquiry.deleted_at && (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(233, 35, 50, 0.3)',
                    backgroundColor: 'rgba(233, 35, 50, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                      Move to Trash
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#8A949D', marginTop: '2px' }}>
                      Moves lead to trash view. Admins can restore or permanently purge.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    style={{
                      padding: '8px 14px',
                      background: 'transparent',
                      border: '1px solid #E92332',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Move to Trash
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Move to Trash Confirmation Modal */}
      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1200,
            background: 'rgba(5, 19, 41, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeleteModal(false);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              background: '#071B30',
              border: '1px solid rgba(215, 217, 220, 0.2)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: '0 0 8px' }}>
              Move Enquiry to Trash?
            </h3>
            <p style={{ fontSize: '13px', color: '#D7D9DC', lineHeight: 1.5, margin: '0 0 16px' }}>
              This will remove <strong>{enquiry?.name}</strong> ({enquiry?.reference_id}) from active lead lists, dashboard counts, and follow-ups. You can restore it later from Trash.
            </p>

            <label style={{ display: 'block', fontSize: '12px', color: '#8A949D', marginBottom: '6px' }}>
              Select Reason for Removal
            </label>
            <select
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: '#0D2847',
                border: '1px solid rgba(215, 217, 220, 0.2)',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontSize: '13px',
                marginBottom: '20px',
              }}
            >
              {DELETE_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid rgba(215, 217, 220, 0.3)',
                  borderRadius: '6px',
                  color: '#D7D9DC',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSoftDelete}
                disabled={isDeleting}
                style={{
                  padding: '8px 18px',
                  background: '#E92332',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                }}
              >
                {isDeleting ? 'Moving...' : 'Move to Trash'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Modal */}
      {showPermanentModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1200,
            background: 'rgba(5, 19, 41, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPermanentModal(false);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              background: '#071B30',
              border: '1px solid #E92332',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8)',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#E92332', margin: '0 0 8px' }}>
              Permanently Delete Lead?
            </h3>
            <p style={{ fontSize: '13px', color: '#D7D9DC', lineHeight: 1.5, margin: '0 0 14px' }}>
              This action <strong>CANNOT BE UNDONE</strong>. It permanently removes <strong>{enquiry?.name}</strong> and all associated services from the database. Client PII will be irreversibly erased in compliance with privacy policies.
            </p>

            <label style={{ display: 'block', fontSize: '12px', color: '#FFFFFF', marginBottom: '6px' }}>
              Type <strong>DELETE</strong> below to confirm:
            </label>
            <input
              type="text"
              value={typedConfirm}
              onChange={(e) => setTypedConfirm(e.target.value)}
              placeholder="Type DELETE"
              style={{
                width: '100%',
                padding: '10px 12px',
                background: '#0D2847',
                border: '1px solid rgba(215, 217, 220, 0.2)',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontSize: '14px',
                marginBottom: '20px',
                fontFamily: 'monospace',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowPermanentModal(false)}
                disabled={isPermanentDeleting}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid rgba(215, 217, 220, 0.3)',
                  borderRadius: '6px',
                  color: '#D7D9DC',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePermanentDelete}
                disabled={isPermanentDeleting || typedConfirm.trim() !== 'DELETE'}
                style={{
                  padding: '8px 18px',
                  background: typedConfirm.trim() === 'DELETE' ? '#E92332' : '#5B6770',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: typedConfirm.trim() === 'DELETE' && !isPermanentDeleting ? 'pointer' : 'not-allowed',
                }}
              >
                {isPermanentDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
