import React, { useState, useId } from 'react';
import faqsData from '@content/data/faqs.json';
import contactData from '@content/data/contact.json';

interface FaqItem {
  id: string;
  page: string;
  category?: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  page?: string;
  title?: string;
  subtitle?: string;
  onEnquiryClick?: () => void;
}

const BAR_COLORS = [
  'var(--navy-600, #123d67)',
  'var(--navy-700, #0d2b4a)',
  'var(--navy-800, #0a2540)',
  'var(--navy-900, #051329)',
  'var(--silver-400, #adb5bd)',
];

/**
 * Wraps alphanumeric registration codes (e.g. AP007909931, ARN-XXXX), emails, and URLs in .break-anywhere
 * so normal copy wraps cleanly with hyphens: manual, and only dense codes break anywhere if needed.
 */
function formatFaqAnswer(text: string) {
  const parts = text.split(/((?:NSE\s+|BSE\s+)?AP\d+|ARN-?\d+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|https?:\/\/\S+)/g);
  return parts.map((part, index) => {
    if (/^((?:NSE\s+|BSE\s+)?AP\d+|ARN-?\d+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|https?:\/\/\S+)$/.test(part)) {
      return (
        <span key={index} className="break-anywhere">
          {part}
        </span>
      );
    }
    return part;
  });
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  page = 'general-insurance',
  title = 'Questions, answered.',
  subtitle = 'Clear information on coverage terms, renewals, and vehicle add-ons.',
  onEnquiryClick,
}) => {
  const baseId = useId();
  const pageFaqs: FaqItem[] = (faqsData as FaqItem[]).filter((f) => f.page === page);

  // Derive categories
  const rawCategories = Array.from(new Set(pageFaqs.map((f) => f.category || 'General')));
  const categories = ['All', ...rawCategories.filter((c) => c !== 'All')];

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openId, setOpenId] = useState<string | null>(pageFaqs[0]?.id || null);

  const filteredFaqs = activeCategory === 'All'
    ? pageFaqs
    : pageFaqs.filter((f) => f.category === activeCategory);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleAdvisorClick = (e: React.MouseEvent) => {
    if (onEnquiryClick) {
      e.preventDefault();
      onEnquiryClick();
    } else {
      const enquiryEl = document.getElementById('enquiry');
      if (enquiryEl) {
        e.preventDefault();
        enquiryEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      className="faq-section section-padding gi-stacked-section"
      id="faqs"
      style={{
        backgroundColor: 'var(--silver-100, #f8f9fa)',
        position: 'relative',
        zIndex: 14,
        marginTop: '-36px',
        borderTopLeftRadius: '36px',
        borderTopRightRadius: '36px',
        boxShadow: '0 -10px 40px rgba(10,37,64,0.06)',
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="faq-layout">
          
          {/* Left Sticky Intro */}
          <div className="faq-intro-col">
            <span
              className="eyebrow"
              style={{
                display: 'inline-block',
                color: 'var(--navy-700, #0d2b4a)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}
            >
              CLARITY FIRST
            </span>

            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                color: 'var(--navy-950, #051329)',
                marginBottom: '1rem',
              }}
            >
              {title === 'Questions, answered.' ? (
                <>
                  Questions,{' '}
                  <span style={{ fontStyle: 'italic', color: 'var(--navy-700, #0d2b4a)' }}>
                    answered.
                  </span>
                </>
              ) : (
                title
              )}
            </h2>

            <p
              style={{
                fontSize: '1.02rem',
                lineHeight: 1.65,
                color: 'var(--muted, #556270)',
                marginBottom: '2rem',
              }}
            >
              {subtitle}
            </p>

            {/* Advisor Action Card */}
            <div
              className="advisor-contact-card"
              style={{
                padding: '1.5rem',
                borderRadius: '24px',
                backgroundColor: 'var(--white, #ffffff)',
                border: '1px solid var(--silver-300, #d7d9dc)',
                boxShadow: '0 10px 30px rgba(10,37,64,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(217, 35, 45, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--red-500, #d9232d)',
                    fontSize: '1.1rem',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.98rem', color: 'var(--navy-950, #051329)', fontWeight: 600 }}>
                    Have a specific question?
                  </h4>
                  <span style={{ fontSize: '0.82rem', color: 'var(--muted, #556270)' }}>
                    Licensed consultation in Godhra
                  </span>
                </div>
              </div>

              <a
                href="#enquiry"
                onClick={handleAdvisorClick}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '14px',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  marginBottom: '1rem',
                  textDecoration: 'none',
                }}
              >
                Talk to an advisor
              </a>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  fontSize: '0.86rem',
                  borderTop: '1px solid var(--silver-300, #d7d9dc)',
                  paddingTop: '0.85rem',
                }}
              >
                <a
                  href={`tel:${contactData.phone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--navy-700, #0d2b4a)',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ opacity: 0.7 }}>Direct:</span>
                  <span>{contactData.phoneDisplay}</span>
                </a>
                <a
                  href={`mailto:${contactData.email}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--muted, #556270)',
                    textDecoration: 'none',
                    fontSize: '0.82rem',
                    wordBreak: 'break-all',
                  }}
                >
                  <span style={{ opacity: 0.7 }}>Email:</span>
                  <span>{contactData.email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Accordion Col */}
          <div className="faq-content-col">
            {/* Category Filter Pills Container */}
            <div className="faq-category-pills-container">
              <div
                className="faq-category-pills"
                role="tablist"
                aria-label="FAQ categories"
              >
                {categories.map((cat) => {
                  const isSelected = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      role="tab"
                      className="faq-category-pill"
                      aria-selected={isSelected}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        backgroundColor: isSelected ? 'var(--navy-900, #0a2540)' : 'var(--white, #ffffff)',
                        color: isSelected ? 'var(--white, #ffffff)' : 'var(--navy-700, #0d2b4a)',
                        borderColor: isSelected ? 'var(--navy-900, #0a2540)' : 'var(--silver-300, #d7d9dc)',
                        boxShadow: isSelected ? '0 4px 12px rgba(10,37,64,0.15)' : 'none',
                      }}
                    >
                      {isSelected && (
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--red-500, #d9232d)',
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accordion Items */}
            <div
              className="faq-items-list"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openId === faq.id;
                const barColor = isOpen ? 'var(--red-500, #d9232d)' : BAR_COLORS[idx % BAR_COLORS.length];
                const headerId = `${baseId}-faq-btn-${faq.id}`;
                const panelId = `${baseId}-faq-panel-${faq.id}`;

                return (
                  <div
                    key={faq.id}
                    className={`faq-card ${isOpen ? 'is-open' : ''}`}
                    style={{
                      borderRadius: '20px',
                      backgroundColor: isOpen
                        ? 'linear-gradient(135deg, rgba(240, 244, 248, 0.95), #ffffff)'
                        : 'var(--white, #ffffff)',
                      border: `1px solid ${isOpen ? 'rgba(217, 35, 45, 0.3)' : 'var(--silver-300, #d7d9dc)'}`,
                      boxShadow: isOpen
                        ? '0 16px 36px rgba(10,37,64,0.12), 0 2px 6px rgba(10,37,64,0.04)'
                        : '0 4px 14px rgba(10,37,64,0.04)',
                      position: 'relative',
                      overflow: 'hidden',
                      transform: 'none',
                      transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {/* 4px Left Accent Bar (inside card, does not push width) */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        backgroundColor: barColor,
                        transition: 'background-color 0.28s ease',
                      }}
                    />

                    {/* Button Header (Direct 36px minmax(0, 1fr) 36px CSS Grid) */}
                    <button
                      id={headerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleFaq(faq.id)}
                      className="faq-card-button"
                    >
                      {/* Number in Tinted Circle (36px) */}
                      <div
                        className="faq-number-circle"
                        style={{
                          backgroundColor: isOpen ? 'rgba(217, 35, 45, 0.1)' : 'var(--silver-100, #f8f9fa)',
                          color: isOpen ? 'var(--red-500, #d9232d)' : 'var(--navy-700, #0d2b4a)',
                        }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </div>

                      {/* Question Text (minmax(0, 1fr)) */}
                      <span
                        className="faq-question-text"
                        style={{
                          color: isOpen ? 'var(--navy-950, #051329)' : 'var(--navy-900, #0a2540)',
                        }}
                      >
                        {faq.question}
                      </span>

                      {/* Plus / Cross Icon in Circle (36px) */}
                      <div
                        className="faq-toggle-icon"
                        style={{
                          backgroundColor: isOpen ? 'var(--red-500, #d9232d)' : 'var(--silver-200, #e9ecef)',
                          color: isOpen ? '#ffffff' : 'var(--navy-800, #0a2540)',
                          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        }}
                      >
                        +
                      </div>
                    </button>

                    {/* Expandable Answer Panel */}
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headerId}
                      style={{
                        display: 'grid',
                        gridTemplateRows: isOpen ? '1fr' : '0fr',
                        transition: 'grid-template-rows 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
                        maxWidth: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ overflow: 'hidden', maxWidth: '100%' }}>
                        <div
                          className="faq-card-answer"
                          style={{
                            borderTop: isOpen ? '1px dashed rgba(215, 217, 220, 0.6)' : 'none',
                            marginTop: '0.25rem',
                            paddingTop: '0.85rem',
                          }}
                        >
                          {formatFaqAnswer(faq.answer)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
