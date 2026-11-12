import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminIcon } from '../../components/admin/AdminIcons';
import { AdminToast } from '../../components/admin/AdminToast';

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
}

export const AdminFaqs: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);

  // Form states
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formCategory, setFormCategory] = useState('Mutual Funds');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res: any = await api.admin.getContent({ content_type: 'faq', page_size: 100 });
      if (res && Array.isArray(res.items)) {
        const mapped = res.items.map((item: any) => ({
          id: item.id,
          question: item.title,
          answer: item.body || '',
          category: item.meta_description || 'General',
          status: item.status || 'published',
        }));
        setFaqs(mapped);
      }
    } catch {
      // Empty on failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openAddModal = () => {
    setEditingFaq(null);
    setFormQuestion('');
    setFormAnswer('');
    setFormCategory('Mutual Funds');
    setFormStatus('published');
    setIsModalOpen(true);
  };

  const openEditModal = (faq: FAQItem) => {
    setEditingFaq(faq);
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    setFormCategory(faq.category);
    setFormStatus(faq.status === 'archived' ? 'draft' : faq.status);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || !formAnswer.trim()) {
      setToast({ type: 'error', message: 'Question and answer are required.' });
      return;
    }

    setSaving(true);
    setToast(null);

    const payload = {
      title: formQuestion.trim(),
      slug: `faq-${Date.now()}`,
      content_type: 'faq',
      body: formAnswer.trim(),
      meta_description: formCategory,
      status: formStatus,
    };

    try {
      if (editingFaq) {
        await api.admin.updateContent(editingFaq.id, payload);
        setFaqs((prev) =>
          prev.map((f) =>
            f.id === editingFaq.id
              ? { ...f, question: formQuestion, answer: formAnswer, category: formCategory, status: formStatus }
              : f
          )
        );
        setToast({ type: 'success', message: 'FAQ updated successfully.' });
      } else {
        const created: any = await api.admin.createContent(payload);
        const newFaq: FAQItem = {
          id: created?.id || Date.now(),
          question: formQuestion,
          answer: formAnswer,
          category: formCategory,
          status: formStatus,
        };
        setFaqs((prev) => [newFaq, ...prev]);
        setToast({ type: 'success', message: 'FAQ created successfully.' });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to save FAQ.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to archive this FAQ entry?')) return;
    try {
      await api.admin.archiveContent(id);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      setToast({ type: 'success', message: 'FAQ entry archived.' });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to delete FAQ.' });
    }
  };

  const filteredFaqs = selectedCategory === 'All'
    ? faqs
    : faqs.filter((f) => f.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminPageHeader
        title="Frequently Asked Questions (FAQs)"
        description="Curate consumer knowledge base questions displayed across public service portfolios."
        primaryAction={{
          label: 'Add New FAQ',
          onClick: openAddModal,
          icon: 'plus',
        }}
        secondaryAction={{
          label: 'Refresh',
          onClick: fetchFaqs,
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

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['All', 'Mutual Funds', 'Insurance', 'Equity', 'General'].map((cat) => {
          const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '12.5px',
                fontWeight: isActive ? 600 : 400,
                backgroundColor: isActive ? '#C81B29' : 'rgba(255, 255, 255, 0.06)',
                border: isActive ? '1px solid #E92332' : '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* FAQs List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <div className="admin-bento-tile" style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
            Loading FAQs from database...
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="admin-bento-tile" style={{ padding: '36px', textAlign: 'center', color: '#8A949D' }}>
            No FAQs found in this category. Click "Add New FAQ" to create one.
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="admin-bento-tile"
              style={{
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#8A949D',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      display: 'inline-block',
                      marginBottom: '4px',
                    }}
                  >
                    {faq.category}
                  </span>
                  <h3 style={{ margin: 0, fontSize: '15px', color: '#FFFFFF', fontWeight: 600 }}>
                    {faq.question}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => openEditModal(faq)}
                    className="admin-btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '11.5px' }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(faq.id)}
                    className="admin-btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '11.5px', color: '#E92332' }}
                  >
                    Archive
                  </button>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '13px', color: '#D7D9DC', lineHeight: 1.6 }}>
                {faq.answer}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="FAQ dialog"
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
                {editingFaq ? 'Edit FAQ Item' : 'Add New FAQ Item'}
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
                  Question
                </label>
                <input
                  type="text"
                  required
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="e.g. What is the claim settlement ratio?"
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                  Answer Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  placeholder="Provide compliant, factual answer details..."
                  className="admin-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="admin-input"
                  >
                    <option value="Mutual Funds">Mutual Funds</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Equity">Equity</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#D7D9DC', marginBottom: '6px' }}>
                    Publish Status
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
                  disabled={saving}
                  className="admin-btn-primary"
                >
                  {saving ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
