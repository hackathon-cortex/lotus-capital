import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminIcon } from '../../components/admin/AdminIcons';
import { AdminToast } from '../../components/admin/AdminToast';

export const AdminInsightEditor: React.FC = () => {
  const { insightId } = useParams();
  const navigate = useNavigate();

  const isNew = insightId === 'new';

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Mutual Funds');
  const [excerpt, setExcerpt] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [contentId, setContentId] = useState<number | null>(null);

  const [saving, setSaving] = useState(false);
  const [previewToken, setPreviewToken] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (isNew) {
      setTitle('');
      setSlug('');
      setCategory('Mutual Funds');
      setExcerpt('');
      setBodyText('');
      setStatus('draft');
      return;
    }

    api.admin
      .getContent({ content_type: 'insight', page_size: 50 })
      .then((res: any) => {
        if (res && Array.isArray(res.items)) {
          const matched = res.items.find(
            (i: any) => String(i.id) === insightId || i.slug === insightId
          );
          if (matched) {
            setContentId(matched.id);
            setTitle(matched.title || '');
            setSlug(matched.slug || '');
            setCategory(matched.meta_description || 'Mutual Funds');
            setExcerpt(matched.meta_title || '');
            setBodyText(matched.body || '');
            setStatus(matched.status || 'published');
          } else {
            // Default populate for standard mock slugs
            setTitle(insightId?.replace(/-/g, ' ').toUpperCase() || 'Educational Article');
            setSlug(insightId || '');
            setBodyText('Insight article educational content.');
          }
        }
      })
      .catch(() => {
        // Fallback
      });
  }, [insightId, isNew]);

  const handleSave = async (publishNow = false) => {
    if (!title.trim()) {
      setToast({ type: 'error', message: 'Article title is required.' });
      return;
    }

    setSaving(true);
    setToast(null);

    const targetStatus = publishNow ? 'published' : status;
    const computedSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload = {
      title: title.trim(),
      slug: computedSlug,
      content_type: 'insight',
      meta_title: excerpt.trim(),
      meta_description: category,
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
        message: publishNow ? 'Insight published to website!' : 'Insight draft saved.',
      });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to save article.' });
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
          message: `Preview token generated: ${token.substring(0, 8)}... (Valid 24h)`,
        });
      }
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to generate preview token.' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminPageHeader
        title={isNew ? 'Create Educational Insight' : `Edit: ${title}`}
        description="Craft factual, compliant investor educational content with structured reading times and category tags."
        secondaryAction={{
          label: 'Back to Insights',
          onClick: () => navigate('/admin/content/insights'),
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

      {/* Editor Tile */}
      <div
        className="admin-bento-tile"
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
              Article Headline
            </label>
            <input
              type="text"
              required
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
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. mutual-funds-direct-vs-regular-plan"
              className="admin-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
              Knowledge Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="admin-input"
            >
              <option value="Mutual Funds">Mutual Funds</option>
              <option value="Health Insurance">Health Insurance</option>
              <option value="Life Insurance">Life Insurance</option>
              <option value="Direct Equity">Direct Equity</option>
              <option value="Systematic Investing">Systematic Investing</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
            Short Summary / Excerpt
          </label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Key takeaway for investors preview cards..."
            className="admin-input"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
            Full Educational Content (Markdown / Article Body)
          </label>
          <textarea
            rows={10}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className="admin-input"
            style={{ resize: 'vertical', lineHeight: 1.6 }}
          />
        </div>

        {/* Footer controls */}
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
            <span style={{ fontSize: '12px', color: '#D7D9DC' }}>Publish State:</span>
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
                <span>Preview Token</span>
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
              <span>Publish Article</span>
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
    </div>
  );
};

