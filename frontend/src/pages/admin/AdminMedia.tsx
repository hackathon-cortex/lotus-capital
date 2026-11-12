import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../api/client';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminIcon } from '../../components/admin/AdminIcons';
import { AdminToast } from '../../components/admin/AdminToast';

export interface MediaItem {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  url: string;
  created_at?: string;
}

export const AdminMedia: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res: any = await api.admin.getMedia({ page_size: 50 });
      if (res && Array.isArray(res.items)) {
        setMediaList(res.items);
      }
    } catch {
      // Empty on failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side MIME and size validation (max 5MB)
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setToast({
        type: 'error',
        message: 'Invalid file format. Allowed: PNG, JPEG, WebP, SVG, and PDF documents.',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setToast({ type: 'error', message: 'File size exceeds maximum allowed 5MB limit.' });
      return;
    }

    setUploading(true);
    setUploadProgress(40);
    setToast(null);

    try {
      setUploadProgress(75);
      const res: any = await api.admin.uploadMedia(file);
      setUploadProgress(100);

      const newMedia: MediaItem = {
        id: res?.id || res?.data?.id || Date.now(),
        filename: res?.filename || res?.data?.filename || file.name,
        original_name: file.name,
        mime_type: file.type,
        file_size: file.size,
        url: res?.url || res?.data?.url || `/api/v1/media/${res?.filename || file.name}`,
      };

      setMediaList((prev) => [newMedia, ...prev]);
      setToast({ type: 'success', message: `Uploaded "${file.name}" successfully.` });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to upload media asset.' });
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setToast({ type: 'success', message: 'Asset URL copied to clipboard!' });
      })
      .catch(() => {
        setToast({ type: 'error', message: 'Failed to copy URL to clipboard.' });
      });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this media asset?')) return;
    try {
      await api.admin.deleteMedia(id);
      setMediaList((prev) => prev.filter((m) => m.id !== id));
      setToast({ type: 'success', message: 'Media asset deleted successfully.' });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to delete asset.' });
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminPageHeader
        title="Media & Document Library"
        description="Securely upload and host corporate logos, certificates, and compliance PDF disclosures with MIME-type verification."
        primaryAction={{
          label: uploading ? 'Uploading...' : 'Upload Asset',
          onClick: () => fileInputRef.current?.click(),
          icon: 'upload',
          disabled: uploading,
        }}
        secondaryAction={{
          label: 'Refresh',
          onClick: fetchMedia,
          icon: 'refresh',
        }}
      />

      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
      />

      {toast && (
        <AdminToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Upload Progress Bar */}
      {uploading && uploadProgress !== null && (
        <div className="admin-bento-tile" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span style={{ color: '#FFFFFF' }}>Uploading asset to secure storage...</span>
            <span style={{ color: '#D7D9DC' }}>{uploadProgress}%</span>
          </div>
          <div
            style={{
              height: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${uploadProgress}%`,
                backgroundColor: '#E92332',
                borderRadius: '999px',
                transition: 'width 200ms ease',
              }}
            />
          </div>
        </div>
      )}

      {/* Media Grid */}
      {loading ? (
        <div className="admin-bento-tile" style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
          Loading media assets from secure storage...
        </div>
      ) : mediaList.length === 0 ? (
        <div className="admin-bento-tile" style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
          No media assets uploaded. Use the "Upload Asset" button above to upload brand assets or documents.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
        {mediaList.map((item) => {
          const isPdf = item.mime_type.includes('pdf');
          return (
            <div
              key={item.id}
              className="admin-bento-tile"
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div
                style={{
                  height: '120px',
                  borderRadius: '8px',
                  backgroundColor: '#051329',
                  border: '1px solid #1B4F82',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {isPdf ? (
                  <div style={{ textAlign: 'center', color: '#D7D9DC' }}>
                    <AdminIcon name="pages" size={32} color="#D7D9DC" />
                    <div style={{ fontSize: '11px', marginTop: '4px', textTransform: 'uppercase' }}>PDF Document</div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#D7D9DC' }}>
                    <AdminIcon name="media" size={32} color="#D7D9DC" />
                    <div style={{ fontSize: '11px', marginTop: '4px', textTransform: 'uppercase' }}>Image Asset</div>
                  </div>
                )}
              </div>

              <div>
                <div
                  style={{
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={item.filename}
                >
                  {item.filename}
                </div>
                <div style={{ fontSize: '11px', color: '#8A949D', marginTop: '2px' }}>
                  {formatSize(item.file_size)} &bull; {item.mime_type.split('/')[1]?.toUpperCase()}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleCopyUrl(item.url)}
                  className="admin-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                >
                  <AdminIcon name="copy" size={12} />
                  <span>Copy URL</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="admin-btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '11px', color: '#E92332' }}
                  title="Delete asset"
                >
                  <AdminIcon name="trash" size={12} color="#E92332" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
