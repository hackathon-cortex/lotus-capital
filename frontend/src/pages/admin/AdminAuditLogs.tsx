import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminIcon } from '../../components/admin/AdminIcons';
import { AdminToast } from '../../components/admin/AdminToast';

export interface AuditLogItem {
  id: number;
  action: string;
  entity_type?: string;
  entity_id?: string;
  user_id?: number;
  metadata?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res: any = await api.admin.getAuditLogs({ page_size: 100 });
      if (res && Array.isArray(res.items)) {
        setLogs(res.items);
      }
    } catch {
      // Empty on failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = actionFilter === 'ALL'
    ? logs
    : logs.filter((l) => l.action.includes(actionFilter));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminPageHeader
        title="Immutable System Audit Logs"
        description="Chronological, tamper-evident record of administrative operations, authentication events, and data modifications."
        secondaryAction={{
          label: 'Refresh Log',
          onClick: fetchLogs,
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

      {/* Filter bar */}
      <div className="admin-bento-tile" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '12px', color: '#8A949D' }}>Action Type:</span>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          style={{
            padding: '6px 12px',
            backgroundColor: '#051329',
            border: '1px solid #1B4F82',
            color: '#FFFFFF',
            borderRadius: '6px',
            fontSize: '12.5px',
          }}
        >
          <option value="ALL">All Actions</option>
          <option value="LOGIN">Logins & Auth</option>
          <option value="ENQUIRY">Enquiry Updates</option>
          <option value="CONTENT">Content Modifications</option>
          <option value="USER">User Account Changes</option>
          <option value="EXPORT">Data Exports</option>
        </select>
        <span style={{ fontSize: '12px', color: '#8A949D', marginLeft: 'auto' }}>
          {filteredLogs.length} audit records
        </span>
      </div>

      {/* Table */}
      <div className="admin-bento-tile" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1B4F82', backgroundColor: 'rgba(5, 19, 41, 0.6)', color: '#8A949D' }}>
                <th style={{ padding: '12px 16px' }}>Timestamp (IST)</th>
                <th style={{ padding: '12px 16px' }}>Action</th>
                <th style={{ padding: '12px 16px' }}>Target Entity</th>
                <th style={{ padding: '12px 16px' }}>Admin User ID</th>
                <th style={{ padding: '12px 16px' }}>IP Address</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
                    Loading audit trail from database...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
                    No audit records logged for this filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                      transition: 'background-color 120ms ease',
                    }}
                  >
                    <td style={{ padding: '12px 16px', color: '#D7D9DC' }}>
                      {new Date(log.created_at).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
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
                          fontFamily: 'monospace',
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#FFFFFF' }}>
                      {log.entity_type || 'system'} {log.entity_id ? `(#${log.entity_id})` : ''}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#8A949D' }}>
                      {log.user_id ? `User #${log.user_id}` : 'System'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#8A949D', fontFamily: 'monospace' }}>
                      {log.ip_address || 'internal'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(log);
                        }}
                        className="admin-btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                      >
                        Diff / JSON
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Diff Modal */}
      {selectedLog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Audit log details"
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
          onClick={() => setSelectedLog(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: '#071B30',
              border: '1px solid #1B4F82',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#FFFFFF', fontFamily: 'Poppins, sans-serif' }}>
                  Audit Event #{selectedLog.id}: {selectedLog.action}
                </h3>
                <span style={{ fontSize: '12px', color: '#8A949D' }}>
                  {new Date(selectedLog.created_at).toISOString()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                style={{ background: 'transparent', border: 'none', color: '#8A949D', cursor: 'pointer' }}
              >
                <AdminIcon name="close" size={16} />
              </button>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                Event Payload & Metadata
              </span>
              <pre
                style={{
                  margin: 0,
                  padding: '14px',
                  backgroundColor: '#051329',
                  border: '1px solid #1B4F82',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontFamily: 'Consolas, monospace',
                  overflowX: 'auto',
                  maxHeight: '260px',
                }}
              >
                {JSON.stringify(
                  {
                    action: selectedLog.action,
                    entity_type: selectedLog.entity_type,
                    entity_id: selectedLog.entity_id,
                    user_id: selectedLog.user_id,
                    ip_address: selectedLog.ip_address,
                    timestamp: selectedLog.created_at,
                    metadata: selectedLog.metadata || {},
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="admin-btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
