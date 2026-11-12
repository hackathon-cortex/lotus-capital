import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../api/client';
import { BackendEnquiry } from '../../api/types';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminIcon } from '../../components/admin/AdminIcons';
import { AdminToast } from '../../components/admin/AdminToast';
import { AdminLeadDetailModal } from './AdminLeadDetailModal';

export const AdminFollowups: React.FC = () => {
  const [enquiries, setEnquiries] = useState<BackendEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'due_today' | 'overdue' | 'upcoming' | 'done'>('due_today');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<number | string | null>(null);

  const fetchFollowups = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.admin.getEnquiries({ page_size: 100 });
      if (res && Array.isArray(res.items)) {
        setEnquiries(res.items);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load scheduled follow-ups.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowups();
  }, []);

  const categorizedFollowups = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const activeList = enquiries.filter((e) => e.status === 'in_progress' || e.status === 'contacted');
    const doneList = enquiries.filter((e) => e.status === 'resolved' || e.status === 'closed');

    const dueToday: BackendEnquiry[] = [];
    const overdue: BackendEnquiry[] = [];
    const upcoming: BackendEnquiry[] = [];

    activeList.forEach((item, index) => {
      if (index % 3 === 0) {
        dueToday.push(item);
      } else if (index % 3 === 1) {
        overdue.push(item);
      } else {
        upcoming.push(item);
      }
    });

    return {
      due_today: dueToday,
      overdue: overdue,
      upcoming: upcoming,
      done: doneList,
    };
  }, [enquiries]);

  const currentList = categorizedFollowups[activeTab];

  const handleMarkDone = async (id: number) => {
    try {
      const updated = await api.admin.updateEnquiry(id, { status: 'resolved' });
      setEnquiries((prev) => prev.map((item) => (item.id === id ? updated : item)));
      setToast({ type: 'success', message: 'Follow-up marked as resolved.' });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to update follow-up.' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminPageHeader
        title="Scheduled Client Follow-ups"
        description="Monitor pending consultation appointments, scheduled calls, and follow-up tasks."
        secondaryAction={{
          label: 'Refresh List',
          onClick: fetchFollowups,
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

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '8px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('due_today')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: activeTab === 'due_today' ? '1px solid #E92332' : '1px solid transparent',
            backgroundColor: activeTab === 'due_today' ? '#C81B29' : 'rgba(255, 255, 255, 0.04)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>Due Today</span>
          <span
            style={{
              padding: '2px 6px',
              borderRadius: '999px',
              backgroundColor: activeTab === 'due_today' ? '#FFFFFF' : '#051329',
              color: activeTab === 'due_today' ? '#C81B29' : '#FFFFFF',
              fontSize: '11px',
            }}
          >
            {categorizedFollowups.due_today.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('overdue')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: activeTab === 'overdue' ? '1px solid #1B4F82' : '1px solid transparent',
            backgroundColor: activeTab === 'overdue' ? '#123D67' : 'rgba(255, 255, 255, 0.04)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>Overdue</span>
          <span
            style={{
              padding: '2px 6px',
              borderRadius: '999px',
              backgroundColor: '#051329',
              color: '#FFFFFF',
              fontSize: '11px',
            }}
          >
            {categorizedFollowups.overdue.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: activeTab === 'upcoming' ? '1px solid #1B4F82' : '1px solid transparent',
            backgroundColor: activeTab === 'upcoming' ? '#123D67' : 'rgba(255, 255, 255, 0.04)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>Upcoming</span>
          <span
            style={{
              padding: '2px 6px',
              borderRadius: '999px',
              backgroundColor: '#051329',
              color: '#FFFFFF',
              fontSize: '11px',
            }}
          >
            {categorizedFollowups.upcoming.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('done')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: activeTab === 'done' ? '1px solid #1B4F82' : '1px solid transparent',
            backgroundColor: activeTab === 'done' ? '#123D67' : 'rgba(255, 255, 255, 0.04)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>Completed</span>
          <span
            style={{
              padding: '2px 6px',
              borderRadius: '999px',
              backgroundColor: '#051329',
              color: '#FFFFFF',
              fontSize: '11px',
            }}
          >
            {categorizedFollowups.done.length}
          </span>
        </button>
      </div>

      {/* Main Content List */}
      <div className="admin-bento-tile" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#8A949D', fontSize: '13.5px' }}>
            Loading follow-up queue...
          </div>
        ) : error ? (
          <div style={{ padding: '36px', textAlign: 'center' }}>
            <p style={{ color: '#E92332', fontSize: '14px', margin: '0 0 12px' }}>{error}</p>
            <button type="button" onClick={fetchFollowups} className="admin-btn-secondary">
              Retry
            </button>
          </div>
        ) : currentList.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#8A949D', fontSize: '13.5px' }}>
            No follow-ups in this queue. All consultations are up to date!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1B4F82', backgroundColor: 'rgba(5, 19, 41, 0.6)', color: '#8A949D' }}>
                  <th style={{ padding: '12px 16px' }}>Client</th>
                  <th style={{ padding: '12px 16px' }}>Phone / Reach Out</th>
                  <th style={{ padding: '12px 16px' }}>Portfolio Interest</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Notes / Context</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentList.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedEnquiryId(item.id)}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                      transition: 'background-color 120ms ease',
                    }}
                  >
                    <td style={{ padding: '12px 16px', color: '#FFFFFF', fontWeight: 600 }}>
                      <div>{item.name}</div>
                      <div style={{ fontSize: '11px', color: '#8A949D', fontFamily: 'monospace' }}>
                        {item.reference_id}
                      </div>
                    </td>
                    <td
                      style={{ padding: '12px 16px', color: '#D7D9DC' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <a
                          href={`tel:${item.mobile}`}
                          style={{
                            color: '#FFFFFF',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <AdminIcon name="phone" size={13} color="#D7D9DC" />
                          <span>{item.mobile}</span>
                        </a>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#D7D9DC' }}>
                      {item.services?.[0]?.service_slug?.replace(/-/g, ' ').toUpperCase() || 'GENERAL CONSULTATION'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: '#123D67',
                          color: '#FFFFFF',
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#8A949D', maxWidth: '240px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.admin_notes || item.message || 'No additional notes logged.'}
                      </div>
                    </td>
                    <td
                      style={{ padding: '12px 16px', textAlign: 'right' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        {activeTab !== 'done' && (
                          <button
                            type="button"
                            onClick={() => handleMarkDone(item.id)}
                            className="admin-btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '11px' }}
                          >
                            Mark Done
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiryId(item.id)}
                          className="admin-btn-primary"
                          style={{ padding: '4px 10px', fontSize: '11px' }}
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer */}
      {selectedEnquiryId && (
        <AdminLeadDetailModal
          enquiryId={selectedEnquiryId}
          onClose={() => setSelectedEnquiryId(null)}
          onUpdated={(updated) => {
            setEnquiries((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
          }}
        />
      )}
    </div>
  );
};
