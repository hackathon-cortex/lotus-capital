import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../api/client';
import { BackendEnquiry } from '../../api/types';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminIcon } from '../../components/admin/AdminIcons';
import { AdminLeadDetailModal } from './AdminLeadDetailModal';
import { AdminAddEnquiryDrawer } from './AdminAddEnquiryDrawer';

export const AdminLeads: React.FC = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<'active' | 'trash'>('active');
  const [leads, setLeads] = useState<BackendEnquiry[]>([]);
  const [trashCount, setTrashCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
    undoAction?: () => void;
  } | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Selected for bulk actions
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkUpdating, setBulkUpdating] = useState(false);

  // Active drawer & modals
  const [activeLeadId, setActiveLeadId] = useState<number | string | null>(leadId || null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  // Single / Bulk Move to Trash Modal
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [leadToTrash, setLeadToTrash] = useState<BackendEnquiry | null>(null);
  const [trashReason, setTrashReason] = useState('other');

  // Permanent Delete Modal
  const [showPermanentModal, setShowPermanentModal] = useState(false);
  const [permanentTargetIds, setPermanentTargetIds] = useState<number[]>([]);
  const [typedConfirm, setTypedConfirm] = useState('');
  const [isDeletingPermanently, setIsDeletingPermanently] = useState(false);

  // Auto-refetch ref & previous count
  const prevCountRef = useRef<number | null>(null);
  const undoTimeoutRef = useRef<any>(null);

  // Check action=add query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'add') {
      setIsAddDrawerOpen(true);
    }
  }, [location.search]);

  useEffect(() => {
    if (leadId) {
      setActiveLeadId(leadId);
    }
  }, [leadId]);

  const fetchLeads = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const isTrash = activeTab === 'trash';
      const [resLeads, resTrash] = await Promise.all([
        api.admin.getEnquiries({
          search: search.trim() || undefined,
          status: statusFilter === 'all' ? undefined : statusFilter,
          service_slug: serviceFilter === 'all' ? undefined : serviceFilter,
          is_deleted: isTrash,
          page_size: 100,
        }),
        // Fetch trash count for tab badge
        api.admin.getEnquiries({ is_deleted: true, page_size: 1 }),
      ]);

      if (resLeads && Array.isArray(resLeads.items)) {
        // Detect new incoming enquiries
        if (
          !isTrash &&
          prevCountRef.current !== null &&
          resLeads.total > prevCountRef.current
        ) {
          const diff = resLeads.total - prevCountRef.current;
          setToast({
            type: 'success',
            message: `${diff} new client enquiry received.`,
          });
        }
        prevCountRef.current = resLeads.total;
        setLeads(resLeads.items);
      }

      if (resTrash) {
        setTrashCount(resTrash.total || 0);
      }
    } catch (err: any) {
      if (!silent) {
        setError(err?.message || 'Failed to fetch incoming enquiries.');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search, statusFilter, serviceFilter, activeTab]);

  // 60-second background polling when tab is visible
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchLeads(true);
      }
    }, 60000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchLeads(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [search, statusFilter, serviceFilter, activeTab]);

  // Derived Quick Stats
  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === 'new').length;
    const inProgressCount = leads.filter((l) => l.status === 'in_progress' || l.status === 'contacted').length;
    const resolvedCount = leads.filter((l) => l.status === 'resolved' || l.status === 'closed').length;
    return { total, newCount, inProgressCount, resolvedCount };
  }, [leads]);

  // Soft delete with 8s undo
  const triggerUndoableDelete = (deletedItem: BackendEnquiry) => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }

    setToast({
      type: 'success',
      message: `Enquiry "${deletedItem.name}" moved to trash.`,
      undoAction: async () => {
        try {
          await api.admin.restoreEnquiry(deletedItem.id);
          setToast({ type: 'success', message: `Enquiry "${deletedItem.name}" restored.` });
          await fetchLeads(true);
        } catch {
          setToast({ type: 'error', message: 'Failed to undo deletion.' });
        }
      },
    });

    undoTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 8000);
  };

  const handleConfirmMoveToTrash = async () => {
    const idsToTrash = leadToTrash ? [leadToTrash.id] : selectedIds;
    if (idsToTrash.length === 0) return;

    setBulkUpdating(true);
    try {
      const results = await Promise.all(
        idsToTrash.map((id) => api.admin.deleteEnquiry(id, trashReason))
      );
      setShowTrashModal(false);
      setSelectedIds([]);
      setLeadToTrash(null);
      await fetchLeads();

      if (results.length === 1) {
        triggerUndoableDelete(results[0]);
      } else {
        setToast({
          type: 'success',
          message: `${results.length} enquiries moved to trash.`,
        });
      }
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to move to trash.' });
    } finally {
      setBulkUpdating(false);
    }
  };

  // Restore lead(s)
  const handleRestore = async (id: number) => {
    try {
      await api.admin.restoreEnquiry(id);
      setToast({ type: 'success', message: 'Enquiry restored to active leads.' });
      await fetchLeads();
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to restore enquiry.' });
    }
  };

  const handleBulkRestore = async () => {
    if (selectedIds.length === 0) return;
    setBulkUpdating(true);
    try {
      await Promise.all(selectedIds.map((id) => api.admin.restoreEnquiry(id)));
      setToast({ type: 'success', message: `${selectedIds.length} enquiries restored.` });
      setSelectedIds([]);
      await fetchLeads();
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to restore selected enquiries.' });
    } finally {
      setBulkUpdating(false);
    }
  };

  // Permanent Delete
  const handleConfirmPermanentDelete = async () => {
    if (typedConfirm.trim() !== 'DELETE' || permanentTargetIds.length === 0) return;
    setIsDeletingPermanently(true);
    try {
      await Promise.all(permanentTargetIds.map((id) => api.admin.permanentDeleteEnquiry(id)));
      setShowPermanentModal(false);
      setTypedConfirm('');
      setPermanentTargetIds([]);
      setSelectedIds([]);
      setToast({ type: 'success', message: 'Permanently deleted from database.' });
      await fetchLeads();
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to permanently delete.' });
    } finally {
      setIsDeletingPermanently(false);
    }
  };

  // Bulk status update
  const handleBulkStatusChange = async (newStatus: 'new' | 'contacted' | 'in_progress' | 'resolved' | 'closed') => {
    if (selectedIds.length === 0) return;
    setBulkUpdating(true);
    setToast(null);
    try {
      await Promise.all(
        selectedIds.map((id) => api.admin.updateEnquiry(id, { status: newStatus }))
      );
      setToast({
        type: 'success',
        message: `Successfully updated ${selectedIds.length} lead(s) to ${newStatus.replace('_', ' ').toUpperCase()}.`,
      });
      setSelectedIds([]);
      await fetchLeads();
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to complete bulk update.' });
    } finally {
      setBulkUpdating(false);
    }
  };

  // CSV Formula Injection Sanitizer
  const escapeCsvCell = (val: any): string => {
    if (val === null || val === undefined) return '""';
    let s = String(val);
    if (/^[=+\-@\t\r]/.test(s)) {
      s = `'` + s;
    }
    return `"${s.replace(/"/g, '""')}"`;
  };

  // CSV Export
  const handleExportCSV = () => {
    if (leads.length === 0) {
      setToast({ type: 'error', message: 'No records available to export.' });
      return;
    }

    const headers = [
      'Ref ID',
      'Submission Date',
      'Client Name',
      'Mobile',
      'Email',
      'Hospital / Organisation',
      'City',
      'Existing ROHINI ID',
      'Source',
      'Services',
      'Status',
      'Notes',
    ];
    const rows = leads.map((l: any) => [
      escapeCsvCell(l.reference_id),
      escapeCsvCell(new Date(l.created_at).toISOString()),
      escapeCsvCell(l.name),
      escapeCsvCell(l.mobile),
      escapeCsvCell(l.email || ''),
      escapeCsvCell(l.organisation_name || ''),
      escapeCsvCell(l.city || ''),
      escapeCsvCell(l.existing_rohini_id || ''),
      escapeCsvCell(l.source || l.created_via),
      escapeCsvCell(l.services?.map((s: any) => s.service_slug).join('; ') || 'General'),
      escapeCsvCell(l.status),
      escapeCsvCell(l.admin_notes || ''),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lotus_capital_${activeTab}_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast({ type: 'success', message: `Exported ${leads.length} lead records to CSV.` });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(leads.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const closeDrawer = () => {
    setActiveLeadId(null);
    if (leadId) {
      navigate('/admin/leads');
    }
  };

  const hasActiveFilters = search.trim() !== '' || statusFilter !== 'all' || serviceFilter !== 'all';

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setServiceFilter('all');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminPageHeader
        title="Enquiries & Leads Management"
        description="Filter, review, assign and track inbound client portfolio enquiries from all digital and offline touchpoints."
        primaryAction={{
          label: 'Add Enquiry',
          onClick: () => setIsAddDrawerOpen(true),
          icon: 'plus',
        }}
        secondaryAction={{
          label: 'Export CSV',
          onClick: handleExportCSV,
          icon: 'download',
        }}
      />

      {/* Undo Toast Banner */}
      {toast && (
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: toast.type === 'error' ? 'rgba(233, 35, 50, 0.15)' : '#0A2540',
            border: `1px solid ${toast.type === 'error' ? '#E92332' : '#1B4F82'}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#FFFFFF',
            fontSize: '13.5px',
          }}
        >
          <span>{toast.message}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {toast.undoAction && (
              <button
                type="button"
                onClick={toast.undoAction}
                style={{
                  background: 'transparent',
                  border: '1px solid #FFFFFF',
                  borderRadius: '4px',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Undo (8s)
              </button>
            )}
            <button
              type="button"
              onClick={() => setToast(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#8A949D',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <AdminIcon name="close" size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats Strip (Active leads only) */}
      {activeTab === 'active' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          <div className="admin-bento-tile" style={{ padding: '16px' }}>
            <div style={{ fontSize: '11.5px', color: '#8A949D', textTransform: 'uppercase' }}>Total Enquiries</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>{stats.total}</div>
          </div>
          <div className="admin-bento-tile" style={{ padding: '16px', borderTop: '3px solid #E92332' }}>
            <div style={{ fontSize: '11.5px', color: '#8A949D', textTransform: 'uppercase' }}>New Leads (Pending)</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>{stats.newCount}</div>
          </div>
          <div className="admin-bento-tile" style={{ padding: '16px', borderTop: '3px solid #1B4F82' }}>
            <div style={{ fontSize: '11.5px', color: '#8A949D', textTransform: 'uppercase' }}>In Progress / Active</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>{stats.inProgressCount}</div>
          </div>
          <div className="admin-bento-tile" style={{ padding: '16px', borderTop: '3px solid #D7D9DC' }}>
            <div style={{ fontSize: '11.5px', color: '#8A949D', textTransform: 'uppercase' }}>Resolved / Converted</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>{stats.resolvedCount}</div>
          </div>
        </div>
      )}

      {/* Tabs Header: Active Leads vs Trash */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(215, 217, 220, 0.15)', paddingBottom: '2px' }}>
        <button
          type="button"
          onClick={() => {
            setActiveTab('active');
            setSelectedIds([]);
          }}
          style={{
            padding: '10px 18px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'active' ? '2px solid #FFFFFF' : '2px solid transparent',
            color: activeTab === 'active' ? '#FFFFFF' : '#8A949D',
            fontSize: '14px',
            fontWeight: activeTab === 'active' ? 600 : 500,
            cursor: 'pointer',
          }}
        >
          Active Leads
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('trash');
            setSelectedIds([]);
          }}
          style={{
            padding: '10px 18px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'trash' ? '2px solid #E92332' : '2px solid transparent',
            color: activeTab === 'trash' ? '#FFFFFF' : '#8A949D',
            fontSize: '14px',
            fontWeight: activeTab === 'trash' ? 600 : 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>Trash</span>
          {trashCount > 0 && (
            <span
              style={{
                padding: '2px 7px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 600,
                background: '#E92332',
                color: '#FFFFFF',
              }}
            >
              {trashCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Bar */}
      <div
        className="admin-bento-tile"
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#8A949D',
                pointerEvents: 'none',
              }}
            >
              <AdminIcon name="search" size={18} />
            </span>
            <input
              type="text"
              placeholder="Search name, mobile or ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                height: '44px',
                fontSize: '15px',
                paddingLeft: '38px',
                paddingRight: '14px',
                width: '100%',
                backgroundColor: '#051329',
                border: '1px solid #1B4F82',
                borderRadius: '8px',
                color: '#FFFFFF',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {activeTab === 'active' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                height: '44px',
                fontSize: '14px',
                padding: '0 12px',
                backgroundColor: '#051329',
                border: '1px solid #1B4F82',
                borderRadius: '8px',
                color: '#FFFFFF',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          )}

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            style={{
              height: '44px',
              fontSize: '14px',
              padding: '0 12px',
              backgroundColor: '#051329',
              border: '1px solid #1B4F82',
              borderRadius: '8px',
              color: '#FFFFFF',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Services</option>
            <option value="mutual-funds">Mutual Funds</option>
            <option value="life-insurance">Life Insurance</option>
            <option value="health-insurance">Health Insurance</option>
            <option value="general-insurance">General Insurance</option>
            <option value="travel">Travel Insurance</option>
            <option value="rohini-cashless-empanelment">ROHINI &amp; Cashless Empanelment</option>
            <option value="equity">Equity</option>
            <option value="other-solutions">Other Solutions</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              style={{
                padding: '8px 12px',
                background: 'transparent',
                border: '1px solid rgba(215, 217, 220, 0.25)',
                borderRadius: '6px',
                color: '#D7D9DC',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#D7D9DC' }}>
              {selectedIds.length} selected:
            </span>

            {activeTab === 'active' ? (
              <>
                <button
                  type="button"
                  disabled={bulkUpdating}
                  onClick={() => handleBulkStatusChange('contacted')}
                  className="admin-btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  Mark Contacted
                </button>
                <button
                  type="button"
                  disabled={bulkUpdating}
                  onClick={() => handleBulkStatusChange('resolved')}
                  className="admin-btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  Mark Resolved
                </button>
                <button
                  type="button"
                  disabled={bulkUpdating}
                  onClick={() => {
                    setLeadToTrash(null);
                    setShowTrashModal(true);
                  }}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    background: 'transparent',
                    border: '1px solid #E92332',
                    color: '#FFFFFF',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Move to Trash
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  disabled={bulkUpdating}
                  onClick={handleBulkRestore}
                  className="admin-btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  Restore Selected
                </button>
                <button
                  type="button"
                  disabled={bulkUpdating}
                  onClick={() => {
                    setPermanentTargetIds(selectedIds);
                    setShowPermanentModal(true);
                  }}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    background: '#E92332',
                    border: 'none',
                    color: '#FFFFFF',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Permanently Delete Selected
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Main Leads / Trash Table */}
      <div className="admin-bento-tile" style={{ padding: '0', overflow: 'hidden' }}>
        {error ? (
          <div style={{ padding: '36px', textAlign: 'center' }}>
            <p style={{ color: '#E92332', fontSize: '14px', margin: '0 0 12px' }}>{error}</p>
            <button type="button" onClick={() => fetchLeads()} className="admin-btn-secondary">
              Retry Connection
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1B4F82', backgroundColor: 'rgba(5, 19, 41, 0.6)', color: '#8A949D' }}>
                  <th style={{ padding: '12px 14px', width: '38px' }}>
                    <input
                      type="checkbox"
                      checked={leads.length > 0 && selectedIds.length === leads.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      aria-label="Select all leads"
                    />
                  </th>
                  <th style={{ padding: '12px 14px' }}>Ref ID</th>
                  <th style={{ padding: '12px 14px' }}>Client Name</th>
                  <th style={{ padding: '12px 14px' }}>Mobile & Contact</th>
                  <th style={{ padding: '12px 14px' }}>Service Requested</th>
                  {activeTab === 'active' ? (
                    <>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px' }}>Submitted (IST)</th>
                    </>
                  ) : (
                    <>
                      <th style={{ padding: '12px 14px' }}>Deleted Date</th>
                      <th style={{ padding: '12px 14px' }}>Reason</th>
                    </>
                  )}
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
                      Fetching leads from database...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '48px 16px', textAlign: 'center', color: '#8A949D' }}>
                      <div style={{ marginBottom: '12px', color: '#D7D9DC', fontSize: '15px', fontWeight: 600 }}>
                        {hasActiveFilters
                          ? 'No enquiries match your filters'
                          : activeTab === 'trash'
                          ? 'Trash is empty'
                          : 'No enquiries found'}
                      </div>
                      <div style={{ fontSize: '13px', maxWidth: '440px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                        {hasActiveFilters
                          ? 'Try broadening your search keyword or clearing the status/service filter dropdowns.'
                          : activeTab === 'trash'
                          ? 'Soft-deleted leads will appear here. Admins can restore them or permanently purge.'
                          : 'The database has 0 active enquiries. New submissions from the public website or manual intake by staff will appear here.'}
                      </div>
                      {hasActiveFilters ? (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="admin-btn-secondary"
                        >
                          Clear filters
                        </button>
                      ) : activeTab === 'active' ? (
                        <button
                          type="button"
                          onClick={() => setIsAddDrawerOpen(true)}
                          className="admin-btn-primary"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                        >
                          <AdminIcon name="plus" size={14} />
                          <span>Add enquiry</span>
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const isSelected = selectedIds.includes(lead.id);
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setActiveLeadId(lead.id)}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background-color 120ms ease',
                        }}
                      >
                        <td
                          style={{ padding: '12px 14px' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(lead.id)}
                            aria-label={`Select lead ${lead.reference_id}`}
                          />
                        </td>
                        <td style={{ padding: '12px 14px', color: '#FFFFFF', fontFamily: 'monospace', fontWeight: 600 }}>
                          {lead.reference_id}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#FFFFFF', fontWeight: 500 }}>
                          {lead.name || lead.full_name}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#D7D9DC' }}>
                          <div>{lead.mobile}</div>
                          {lead.email && <div style={{ fontSize: '11px', color: '#8A949D' }}>{lead.email}</div>}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#D7D9DC' }}>
                          {lead.services?.[0]?.service_slug?.replace(/-/g, ' ').toUpperCase() || 'GENERAL'}
                        </td>

                        {activeTab === 'active' ? (
                          <>
                            <td style={{ padding: '12px 14px' }}>
                              <span
                                style={{
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  backgroundColor:
                                    lead.status === 'new'
                                      ? '#E92332'
                                      : lead.status === 'contacted'
                                      ? '#1B4F82'
                                      : lead.status === 'in_progress'
                                      ? '#0D2847'
                                      : '#123D67',
                                  color: '#FFFFFF',
                                }}
                              >
                                {lead.status.toUpperCase()}
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px', color: '#8A949D', fontSize: '12px' }}>
                              {new Date(lead.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ padding: '12px 14px', color: '#8A949D', fontSize: '12px' }}>
                              {lead.deleted_at
                                ? new Date(lead.deleted_at).toLocaleString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : '—'}
                            </td>
                            <td style={{ padding: '12px 14px', color: '#D7D9DC', fontSize: '12px' }}>
                              {lead.delete_reason || 'other'}
                            </td>
                          </>
                        )}

                        <td
                          style={{ padding: '12px 14px', textAlign: 'right' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {activeTab === 'active' ? (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => setActiveLeadId(lead.id)}
                                style={{
                                  padding: '4px 10px',
                                  background: 'transparent',
                                  border: '1px solid rgba(215, 217, 220, 0.25)',
                                  borderRadius: '4px',
                                  color: '#FFFFFF',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                }}
                              >
                                View
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setLeadToTrash(lead);
                                  setShowTrashModal(true);
                                }}
                                style={{
                                  padding: '4px 8px',
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#8A949D',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                }}
                                title="Move to Trash"
                              >
                                <AdminIcon name="trash" size={14} />
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => handleRestore(lead.id)}
                                style={{
                                  padding: '4px 10px',
                                  background: '#123D67',
                                  border: '1px solid #FFFFFF',
                                  borderRadius: '4px',
                                  color: '#FFFFFF',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                }}
                              >
                                Restore
                              </button>
                              <button
                                type="button"
                                title="Permanent Delete"
                                onClick={() => {
                                  setPermanentTargetIds([lead.id]);
                                  setShowPermanentModal(true);
                                }}
                                style={{
                                  padding: '4px 10px',
                                  background: 'transparent',
                                  border: '1px solid #E92332',
                                  borderRadius: '4px',
                                  color: '#FFFFFF',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over Detail Drawer */}
      {activeLeadId && (
        <AdminLeadDetailModal
          enquiryId={activeLeadId}
          onClose={closeDrawer}
          onUpdated={(updated) => {
            setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
          }}
          onDeleted={(deleted) => {
            setLeads((prev) => prev.filter((l) => l.id !== deleted.id));
            triggerUndoableDelete(deleted);
            fetchLeads(true);
          }}
          onRestored={(_restored) => {
            fetchLeads(true);
          }}
          onPermanentDeleted={(id) => {
            setLeads((prev) => prev.filter((l) => l.id !== id));
            setToast({ type: 'success', message: 'Lead permanently deleted.' });
            fetchLeads(true);
          }}
        />
      )}

      {/* Add Enquiry Drawer */}
      <AdminAddEnquiryDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onEnquiryCreated={(newEnquiry) => {
          setToast({ type: 'success', message: `Enquiry ${newEnquiry.reference_id} created successfully.` });
          fetchLeads();
          setActiveLeadId(newEnquiry.id);
        }}
        onSelectExistingLead={(existing) => {
          setIsAddDrawerOpen(false);
          setActiveLeadId(existing.id);
        }}
      />

      {/* Move to Trash Modal */}
      {showTrashModal && (
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
            if (e.target === e.currentTarget) setShowTrashModal(false);
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
              Move {leadToTrash ? 'Enquiry' : `${selectedIds.length} Enquiries`} to Trash?
            </h3>
            <p style={{ fontSize: '13px', color: '#D7D9DC', lineHeight: 1.5, margin: '0 0 16px' }}>
              {leadToTrash
                ? `Move ${leadToTrash.name} (${leadToTrash.reference_id}) to trash. You can restore it later.`
                : `Move ${selectedIds.length} selected enquiries to trash. They can be restored from the Trash tab.`}
            </p>

            <label style={{ display: 'block', fontSize: '12px', color: '#8A949D', marginBottom: '6px' }}>
              Select Reason
            </label>
            <select
              value={trashReason}
              onChange={(e) => setTrashReason(e.target.value)}
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
              <option value="duplicate">Duplicate Entry</option>
              <option value="spam">Spam / Invalid Mobile</option>
              <option value="test_data">Internal Test Submission</option>
              <option value="client_requested_removal">Client Requested Removal</option>
              <option value="unresponsive">Unresponsive after multiple attempts</option>
              <option value="other">Other Reason</option>
            </select>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowTrashModal(false)}
                disabled={bulkUpdating}
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
                data-testid="confirm-trash-btn"
                onClick={handleConfirmMoveToTrash}
                disabled={bulkUpdating}
                style={{
                  padding: '8px 18px',
                  background: '#E92332',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: bulkUpdating ? 'not-allowed' : 'pointer',
                }}
              >
                {bulkUpdating ? 'Moving...' : 'Move to Trash'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation Modal */}
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
              Permanently Delete {permanentTargetIds.length === 1 ? 'Enquiry' : `${permanentTargetIds.length} Enquiries`}?
            </h3>
            <p style={{ fontSize: '13px', color: '#D7D9DC', lineHeight: 1.5, margin: '0 0 14px' }}>
              This action <strong>CANNOT BE UNDONE</strong>. It permanently removes the record(s) and all associated service lines from the database.
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
                onClick={() => {
                  setShowPermanentModal(false);
                  setTypedConfirm('');
                }}
                disabled={isDeletingPermanently}
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
                data-testid="confirm-permanent-delete-btn"
                onClick={handleConfirmPermanentDelete}
                disabled={isDeletingPermanently || typedConfirm.trim() !== 'DELETE'}
                style={{
                  padding: '8px 18px',
                  background: typedConfirm.trim() === 'DELETE' ? '#E92332' : '#5B6770',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: typedConfirm.trim() === 'DELETE' && !isDeletingPermanently ? 'pointer' : 'not-allowed',
                }}
              >
                {isDeletingPermanently ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
