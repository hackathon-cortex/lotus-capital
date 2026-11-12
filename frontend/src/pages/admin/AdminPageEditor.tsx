import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminIcon } from '../../components/admin/AdminIcons';
import { AdminToast } from '../../components/admin/AdminToast';

export const AdminPageEditor: React.FC = () => {
  const { pageKey } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [headline, setHeadline] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [contentId, setContentId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewToken, setPreviewToken] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!pageKey) return;
    setLoading(true);

    const prettyTitle = pageKey
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    setTitle(prettyTitle);
    setMetaTitle(`${prettyTitle} | Lotus Capital`);
    setMetaDescription(`Official Lotus Capital advisory and solutions for ${prettyTitle.toLowerCase()}.`);
    setHeadline(`Empowering Your Financial Journey with ${prettyTitle}`);
    setBodyText(`Explore tailored solutions, verified operational statistics, and comprehensive advisory services for ${prettyTitle.toLowerCase()}.`);

    api.admin
      .getContent({ content_type: 'page', page_size: 100 })
      .then((res: any) => {
        if (res && Array.isArray(res.items)) {
          const matched = res.items.find((item: any) => item.slug === pageKey);
          if (matched) {
            setContentId(matched.id);
            if (matched.title) setTitle(matched.title);
            if (matched.meta_title) setMetaTitle(matched.meta_title);
            if (matched.meta_description) setMetaDescription(matched.meta_description);
            if (matched.body) setBodyText(matched.body);
            if (matched.status) setStatus(matched.status);
          }
        }
      })
      .catch(() => {
        // Fallback to defaults
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pageKey]);

  const handleSave = async (publishNow = false) => {
    setSaving(true);
    setToast(null);

    const targetStatus = publishNow ? 'published' : status;
    const payload = {
      title,
      slug: pageKey,
      content_type: 'page',
      meta_title: metaTitle,
      meta_description: metaDescription,
      body: bodyText,
      status: targetStatus,
    };

    try {
      if (contentId) {
        await api.admin.updateContent(contentId, payload);
      } else {
        const created: any = await api.admin.createContent(payload);
        if (created?.id) setContentId(created.id);
      }
      setStatus(targetStatus);
      setToast({
        type: 'success',
        message: publishNow ? 'Page published successfully!' : 'Page draft saved successfully.',
      });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to save page changes.' });
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePreviewToken = async () => {
    if (!contentId) {
      setToast({ type: 'error', message: 'Please save draft before generating preview token.' });
      return;
    }
    setToast(null);
    try {
      const res: any = await api.admin.createPreviewToken(contentId);
      if (res?.data?.token || res?.token) {
        const token = res.data?.token || res.token;
        setPreviewToken(token);
        setToast({
          type: 'success',
          message: `Preview token generated: ${token.substring(0, 8)}... (Valid for 24h)`,
        });
      }
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to generate preview token.' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminPageHeader
        title={`Edit Page: ${title || pageKey}`}
        description={`Manage copy, SEO metadata, and publishing stage for route "/${pageKey === 'home' ? '' : pageKey}".`}
        secondaryAction={{
          label: 'Back to Pages',
          onClick: () => navigate('/admin/content/pages'),
          icon: 'chevron-left',
        }}
      />

      {toast && (
        <AdminToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Editor Bento Tile */}
      {loading ? (
        <div className="admin-bento-tile" style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
          Loading page configuration...
        </div>
      ) : (
        <div
          className="admin-bento-tile"
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
              Internal Page Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="admin-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
              URL Slug
            </label>
            <input
              type="text"
              value={pageKey || ''}
              disabled
              className="admin-input"
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>
        </div>

        {/* SEO Meta Section */}
        <div
          style={{
            padding: '16px',
            backgroundColor: '#051329',
            border: '1px solid #1B4F82',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
            SEO & Social Metadata
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
              Meta Title (Browser Tab & SERP)
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="admin-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
              Meta Description (max 160 characters)
            </label>
            <textarea
              rows={2}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="admin-input"
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Headline & Body Content */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
            Hero Banner Headline
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="admin-input"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
            Main Section Content (Markdown / Text)
          </label>
          <textarea
            rows={8}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className="admin-input"
            style={{ resize: 'vertical', lineHeight: 1.6 }}
          />
        </div>

        {/* Publishing Status & Action Bar */}
        <div
          style={{
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', color: '#D7D9DC' }}>Publishing Stage:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
              style={{
                padding: '6px 12px',
                backgroundColor: '#051329',
                border: '1px solid #1B4F82',
                color: '#FFFFFF',
                borderRadius: '6px',
                fontSize: '12px',
              }}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {contentId && (
              <button
                type="button"
                onClick={handleGeneratePreviewToken}
                className="admin-btn-secondary"
                style={{ fontSize: '12px' }}
              >
                <AdminIcon name="view" size={14} />
                <span>Generate Preview Token</span>
              </button>
            )}

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(false)}
              className="admin-btn-secondary"
              style={{ fontSize: '12px' }}
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(true)}
              className="admin-btn-primary"
              style={{ fontSize: '12px' }}
            >
              <AdminIcon name="check" size={14} />
              <span>Publish Live</span>
            </button>
          </div>
        </div>

        {previewToken && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: '#051329',
              border: '1px solid #1B4F82',
              fontSize: '12px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>
              Preview Token: <code style={{ color: '#D7D9DC' }}>{previewToken}</code>
            </span>
            <span style={{ color: '#8A949D', fontSize: '11px' }}>Valid for 24 Hours</span>
          </div>
        )}
      </div>
      )}
    </div>
  );
};
