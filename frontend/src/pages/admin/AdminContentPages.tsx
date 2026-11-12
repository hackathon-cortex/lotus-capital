import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminToast } from '../../components/admin/AdminToast';

export interface PageItem {
  id?: number;
  slug: string;
  title: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  updated_at?: string;
  meta_title?: string;
}

const STATIC_WEBSITE_PAGES: PageItem[] = [
  { slug: 'home', title: 'Homepage & Core Positioning', category: 'Main', status: 'published' },
  { slug: 'about-us', title: 'About Us & Corporate Heritage', category: 'Corporate', status: 'published' },
  { slug: 'services', title: 'Services Hub & Offerings', category: 'Services', status: 'published' },
  { slug: 'general-insurance', title: 'General & Commercial Insurance', category: 'Insurance', status: 'published' },
  { slug: 'life-insurance', title: 'Life Insurance Solutions', category: 'Insurance', status: 'published' },
  { slug: 'health-insurance', title: 'Health Insurance Plans', category: 'Insurance', status: 'published' },
  { slug: 'mutual-funds', title: 'Mutual Funds & Systematic Investing', category: 'Investments', status: 'published' },
  { slug: 'equity', title: 'Direct Equity & Demat Advisory', category: 'Investments', status: 'published' },
  { slug: 'other-solutions', title: 'Bonds, FDs & Other Solutions', category: 'Investments', status: 'published' },
  { slug: 'privacy-policy', title: 'Privacy Policy & Data Security', category: 'Compliance', status: 'published' },
  { slug: 'terms-and-conditions', title: 'Terms and Conditions', category: 'Compliance', status: 'published' },
  { slug: 'disclosures', title: 'Regulatory Disclosures & Disclaimers', category: 'Compliance', status: 'published' },
  { slug: 'complaints', title: 'Client Complaints Redressal', category: 'Compliance', status: 'published' },
];

export const AdminContentPages: React.FC = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState<PageItem[]>(STATIC_WEBSITE_PAGES);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    let active = true;

    api.admin
      .getContent({ content_type: 'page', page_size: 50 })
      .then((res: any) => {
        if (!active) return;
        if (res && Array.isArray(res.items) && res.items.length > 0) {
          const apiMap = new Map(res.items.map((i: any) => [i.slug, i]));
          const merged = STATIC_WEBSITE_PAGES.map((sp) => {
            const remote: any = apiMap.get(sp.slug);
            if (remote) {
              return {
                id: remote.id,
                slug: remote.slug,
                title: remote.title || sp.title,
                category: sp.category,
                status: remote.status || 'published',
                updated_at: remote.updated_at,
              };
            }
            return sp;
          });
          setPages(merged);
        }
      })
      .catch(() => {
        // Fallback to static list gracefully
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminPageHeader
        title="CMS Page Management"
        description="Review website landing pages, draft status, and SEO metadata configurations."
      />

      {toast && (
        <AdminToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Pages Table */}
      <div className="admin-bento-tile" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1B4F82', backgroundColor: 'rgba(5, 19, 41, 0.6)', color: '#8A949D' }}>
                <th style={{ padding: '12px 16px' }}>Page Title</th>
                <th style={{ padding: '12px 16px' }}>URL Route</th>
                <th style={{ padding: '12px 16px' }}>Section Category</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr
                  key={p.slug}
                  onClick={() => navigate(`/admin/content/pages/${p.slug}`)}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    transition: 'background-color 120ms ease',
                  }}
                >
                  <td style={{ padding: '12px 16px', color: '#FFFFFF', fontWeight: 600 }}>
                    {p.title}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#D7D9DC', fontFamily: 'monospace' }}>
                    /{p.slug === 'home' ? '' : p.slug}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#8A949D' }}>
                    {p.category}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: p.status === 'published' ? '#123D67' : 'rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        textTransform: 'uppercase',
                        border: '1px solid #1B4F82',
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td
                    style={{ padding: '12px 16px', textAlign: 'right' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/content/pages/${p.slug}`)}
                      className="admin-btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                    >
                      Edit Page
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
