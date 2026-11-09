import React, { useState } from 'react';

export interface ArticleBlock {
  type: 'heading' | 'paragraph' | 'list' | 'callout' | 'compareTable';
  level?: number;
  text?: string;
  ordered?: boolean;
  items?: string[];
  variant?: 'remember' | 'caution' | 'example';
  title?: string;
  headers?: string[];
  rows?: string[][];
}

export interface ArticleFaq {
  question?: string;
  answer?: string;
  q?: string;
  a?: string;
}

export interface ArticleSource {
  title: string;
  url?: string;
}

export interface ArticleBlockRendererProps {
  takeaways?: string[];
  blocks: ArticleBlock[];
  questionsToAsk?: string[];
  faqs?: ArticleFaq[];
  sources?: ArticleSource[];
  isInsurance?: boolean;
}

export const ArticleBlockRenderer: React.FC<ArticleBlockRendererProps> = ({
  takeaways,
  blocks,
  questionsToAsk,
  faqs,
  sources,
  isInsurance = false,
}) => {
  // State for interactive questions checklist
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});
  // State for mini FAQ accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleQuestion = (idx: number) => {
    setCheckedQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  // Helper to slugify heading text for anchor links
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

  return (
    <div className="article-content-body" style={{ color: 'var(--navy-950, #0a192f)', lineHeight: 1.8 }}>
      {/* Key Takeaways Box at top */}
      {takeaways && takeaways.length > 0 && (
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderLeft: '4px solid var(--navy-700, #123D67)',
            borderRadius: '20px',
            padding: '1.75rem 2rem',
            marginBottom: '2.5rem',
            boxShadow: '0 4px 16px rgba(18, 61, 103, 0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--navy-800, #123D67)',
              marginBottom: '1rem',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Key Takeaways at a Glance
          </div>

          <ul
            style={{
              margin: 0,
              paddingLeft: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            {takeaways.map((takeaway, idx) => (
              <li key={idx} style={{ fontSize: '0.98rem', color: 'var(--navy-900, #1e293b)', lineHeight: 1.6 }}>
                {takeaway}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content Blocks */}
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading': {
            const headingId = block.text ? slugify(block.text) : `section-${index}`;
            if (block.level === 3) {
              return (
                <h3
                  key={index}
                  id={headingId}
                  style={{
                    fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                    fontSize: '1.35rem',
                    fontWeight: 600,
                    color: 'var(--navy-900, #0A2540)',
                    marginTop: '2.2rem',
                    marginBottom: '0.85rem',
                    paddingTop: '0.5rem',
                  }}
                >
                  {block.text}
                </h3>
              );
            }
            return (
              <h2
                key={index}
                id={headingId}
                style={{
                  fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                  fontSize: '1.8rem',
                  fontWeight: 600,
                  color: 'var(--navy-900, #0A2540)',
                  marginTop: '2.8rem',
                  marginBottom: '1rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '2px solid #EEF1F4',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: 0,
                    width: '40px',
                    height: '2px',
                    backgroundColor: 'var(--red-500, #D9232D)',
                  }}
                />
                {block.text}
              </h2>
            );
          }

          case 'paragraph':
            return (
              <p
                key={index}
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  color: 'var(--ink, #1e293b)',
                  marginBottom: '1.4rem',
                }}
              >
                {block.text}
              </p>
            );

          case 'list': {
            const isOrdered = block.ordered ?? false;
            const ListTag = isOrdered ? 'ol' : 'ul';
            return (
              <ListTag
                key={index}
                style={{
                  paddingLeft: '1.5rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx} style={{ fontSize: '1.02rem', lineHeight: 1.65, color: 'var(--ink, #1e293b)' }}>
                    {item}
                  </li>
                ))}
              </ListTag>
            );
          }

          case 'callout': {
            const variant = block.variant || 'remember';
            let bg = 'rgba(91, 141, 184, 0.08)';
            let border = '1px solid rgba(91, 141, 184, 0.35)';
            let accentColor = '#123D67';
            let iconSvg = (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            );

            if (variant === 'caution') {
              bg = 'rgba(217, 35, 45, 0.06)';
              border = '1px solid rgba(217, 35, 45, 0.25)';
              accentColor = '#B81D25';
              iconSvg = (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              );
            } else if (variant === 'example') {
              bg = 'rgba(18, 61, 103, 0.05)';
              border = '1px solid rgba(18, 61, 103, 0.2)';
              accentColor = '#123D67';
              iconSvg = (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              );
            }

            return (
              <div
                key={index}
                style={{
                  backgroundColor: bg,
                  border: border,
                  borderRadius: '18px',
                  padding: '1.4rem 1.6rem',
                  marginBottom: '1.75rem',
                  color: accentColor,
                }}
              >
                {block.title && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      marginBottom: '0.45rem',
                      color: accentColor,
                    }}
                  >
                    {iconSvg}
                    {block.title}
                  </div>
                )}
                <div style={{ fontSize: '0.96rem', lineHeight: 1.65, color: '#1e293b' }}>
                  {block.text}
                </div>
              </div>
            );
          }

          case 'compareTable': {
            return (
              <div
                key={index}
                style={{
                  marginBottom: '2rem',
                  marginTop: '1.5rem',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 14px rgba(18, 61, 103, 0.04)',
                }}
              >
                {block.title && (
                  <div
                    style={{
                      backgroundColor: 'var(--navy-900, #0A2540)',
                      color: '#ffffff',
                      padding: '0.85rem 1.25rem',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {block.title}
                  </div>
                )}

                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '0.94rem',
                      textAlign: 'left',
                    }}
                  >
                    {block.headers && (
                      <thead>
                        <tr style={{ backgroundColor: '#F1F5F9' }}>
                          {block.headers.map((h, hIdx) => (
                            <th
                              key={hIdx}
                              style={{
                                padding: '0.85rem 1.2rem',
                                fontWeight: 600,
                                color: 'var(--navy-900, #0A2540)',
                                borderBottom: '2px solid #CBD5E1',
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {block.rows?.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          style={{
                            backgroundColor: rIdx % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                            borderBottom: '1px solid #E2E8F0',
                          }}
                        >
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              style={{
                                padding: '0.85rem 1.2rem',
                                color: cIdx === 0 ? 'var(--navy-900, #0A2540)' : 'var(--silver-800, #334155)',
                                fontWeight: cIdx === 0 ? 600 : 400,
                                lineHeight: 1.5,
                              }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          default:
            return null;
        }
      })}

      {/* Questions to Ask Interactive Checklist */}
      {questionsToAsk && questionsToAsk.length > 0 && (
        <div
          id="questions-to-ask"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid rgba(215, 217, 220, 0.7)',
            boxShadow: '0 8px 24px rgba(18, 61, 103, 0.05)',
            marginTop: '3rem',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--navy-700, #123D67)',
              marginBottom: '0.4rem',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--red-500, #D9232D)',
              }}
            />
            Interactive Checklist
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
              fontSize: '1.45rem',
              color: 'var(--navy-900, #0A2540)',
              marginBottom: '0.75rem',
            }}
          >
            Questions to Ask Before You Decide
          </h3>

          <p style={{ color: 'var(--silver-600, #64748b)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            Check off these key questions as you review your options or discuss them with your advisor.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {questionsToAsk.map((q, idx) => {
              const isChecked = !!checkedQuestions[idx];

              return (
                <label
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '14px',
                    backgroundColor: isChecked ? 'rgba(91, 141, 184, 0.08)' : '#F8FAFC',
                    border: isChecked ? '1px solid #5B8DB8' : '1px solid #EEF1F4',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleQuestion(idx)}
                    style={{
                      marginTop: '3px',
                      accentColor: 'var(--navy-700, #123D67)',
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                      color: isChecked ? 'var(--navy-900, #0A2540)' : '#334155',
                      textDecoration: isChecked ? 'line-through' : 'none',
                      opacity: isChecked ? 0.75 : 1,
                    }}
                  >
                    {q}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Mini FAQ Accordion if article has faqs */}
      {faqs && faqs.length > 0 && (
        <div
          id="faqs"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid rgba(215, 217, 220, 0.7)',
            boxShadow: '0 8px 24px rgba(18, 61, 103, 0.05)',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--navy-700, #123D67)',
              marginBottom: '0.4rem',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--red-500, #D9232D)',
              }}
            />
            Frequently Asked Questions
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
              fontSize: '1.45rem',
              color: 'var(--navy-900, #0A2540)',
              marginBottom: '1.25rem',
            }}
          >
            Common Queries on This Topic
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={idx}
                  style={{
                    borderRadius: '16px',
                    border: '1px solid var(--silver-300, #d7d9dc)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.15rem',
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 1fr) 32px',
                      alignItems: 'center',
                      backgroundColor: isOpen ? 'var(--silver-100, #f8f9fa)' : '#FFFFFF',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '0.98rem',
                      fontWeight: 600,
                      color: 'var(--navy-900, #0A2540)',
                      cursor: 'pointer',
                      gap: '0.75rem',
                      minWidth: 0,
                      boxSizing: 'border-box',
                    }}
                  >
                    <span
                      style={{
                        minWidth: 0,
                        overflowWrap: 'break-word',
                        wordBreak: 'normal',
                        hyphens: 'manual',
                        whiteSpace: 'normal',
                        lineHeight: 1.35,
                      }}
                    >
                      {faq.question || faq.q}
                    </span>
                    <span
                      style={{
                        fontSize: '1.1rem',
                        color: isOpen ? 'var(--red-500, #d9232d)' : 'var(--navy-700, #0d2b4a)',
                        flexShrink: 0,
                        fontWeight: 700,
                        minWidth: 0,
                        textAlign: 'center',
                      }}
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '1rem 1.15rem 1.25rem',
                        backgroundColor: '#FFFFFF',
                        borderTop: '1px solid var(--silver-300, #d7d9dc)',
                        fontSize: '0.92rem',
                        lineHeight: 1.65,
                        color: 'var(--ink, #1f2937)',
                      }}
                    >
                      {faq.answer || faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sources / References */}
      {sources && sources.length > 0 && (
        <div
          style={{
            borderTop: '1px solid #E2E8F0',
            paddingTop: '1.25rem',
            marginBottom: '2rem',
            fontSize: '0.85rem',
            color: 'var(--silver-600, #64748b)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--navy-900, #0A2540)' }}>
            Authoritative References:
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {sources.map((s, idx) => (
              <li key={idx}>
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#5B8DB8', textDecoration: 'underline' }}
                  >
                    {s.title}
                  </a>
                ) : (
                  <span>{s.title}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Common Educational Disclaimer Box */}
      <div
        style={{
          backgroundColor: '#EEF1F4',
          borderRadius: '20px',
          padding: '1.5rem 1.75rem',
          border: '1px solid rgba(215, 217, 220, 0.8)',
          fontSize: '0.86rem',
          lineHeight: 1.6,
          color: 'var(--silver-700, #475569)',
          marginTop: '2.5rem',
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--navy-900, #0A2540)',
            marginBottom: '0.5rem',
          }}
        >
          Educational & Regulatory Disclaimer
        </div>

        <p style={{ margin: 0, marginBottom: isInsurance ? '0.5rem' : 0 }}>
          The information provided in this article is intended solely for general educational and informational
          purposes. It should not be considered investment advice, financial recommendations, or a guarantee of returns.
          Mutual fund investments are subject to market risks. Insurance coverage is subject to the respective policy
          terms, conditions, exclusions, and limitations. Investors should carefully assess their financial objectives
          and risk tolerance and consult an appropriately qualified professional before making financial decisions.
          Lotus Capital does not guarantee any particular investment outcome or return.
        </p>

        {isInsurance && (
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--navy-900, #0A2540)' }}>
            Insurance is the subject matter of solicitation.
          </p>
        )}
      </div>
    </div>
  );
};
