import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminToast } from '../../components/admin/AdminToast';

export interface InsightItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  readingTime: string;
  status: 'published' | 'draft' | 'archived';
  date: string;
}

export const AdminInsights: React.FC = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res: any = await api.admin.getContent({ content_type: 'insight', page_size: 50 });
      if (res && Array.isArray(res.items)) {
        const mapped = res.items.map((item: any) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          category: item.meta_description || 'Investments',
          readingTime: '5 min read',
          status: item.status || 'published',
          date: item.created_at ? item.created_at.slice(0, 10) : '2026-01-01',
        }));
        setInsights(mapped);
      }
    } catch {
      // Empty on failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to archive this article?')) return;
    try {
      await api.admin.archiveContent(id);
      setInsights((prev) => prev.filter((i) => i.id !== id));
      setToast({ type: 'success', message: 'Article archived successfully.' });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to archive article.' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminPageHeader
        title="Educational Insights & Articles"
        description="Draft, edit, and publish investor educational guides strictly adhering to SEBI guidelines without speculative claims."
        primaryAction={{
          label: 'Create Article',
          onClick: () => navigate('/admin/content/insights/new'),
          icon: 'plus',
        }}
        secondaryAction={{
          label: 'Refresh',
          onClick: fetchInsights,
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
                <th style={{ padding: '12px 16px' }}>Article Title</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Read Time</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
                    Loading educational insights from database...
                  </td>
                </tr>
              ) : insights.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
                    No insight articles published yet. Click "Write New Insight" to create one.
                  </td>
                </tr>
              ) : (
                insights.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/admin/content/insights/${item.slug || item.id}`)}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    transition: 'background-color 120ms ease',
                  }}
                >
                  <td style={{ padding: '12px 16px', color: '#FFFFFF', fontWeight: 600 }}>
                    {item.title}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#D7D9DC' }}>
                    {item.category}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#8A949D' }}>
                    {item.readingTime}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: item.status === 'published' ? '#123D67' : 'rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        textTransform: 'uppercase',
                        border: '1px solid #1B4F82',
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#8A949D' }}>
                    {item.date}
                  </td>
                  <td
                    style={{ padding: '12px 16px', textAlign: 'right' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/content/insights/${item.slug || item.id}`)}
                        className="admin-btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '11.5px' }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="admin-btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '11.5px', color: '#E92332' }}
                      >
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              )))
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
