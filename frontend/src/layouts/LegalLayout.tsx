import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { LotusLogo } from '../components/common/LotusLogo';
import { useContactDrawer } from '../context/ContactDrawerContext';
import contactData from '@content/data/contact.json';
import registrationsData from '@content/data/registrations.json';

export interface LegalSection {
  id: string;
  title: string;
  type?: string;
  copy?: string;
  points?: string[];
  phone?: string;
  email?: string;
  address?: string;
  grievanceOfficer?: string;
  [key: string]: any;
}

export interface LegalLayoutProps {
  title: string;
  pageTitle: string;
  breadcrumbLabel: string;
  summary: string;
  lastUpdated?: string | null;
  sections: LegalSection[];
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  title,
  pageTitle,
  breadcrumbLabel,
  summary,
  lastUpdated,
  sections,
}) => {
  const { openContactDrawer } = useContactDrawer();
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || '');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveId(id);
      setMobileTocOpen(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={summary} />
      </Helmet>

      {/* Slim Navy Band Hero (Header sits over top; about 180-220px total) */}
      <section
        className="legal-hero-band"
        style={{
          position: 'relative',
          backgroundColor: 'var(--navy-950, #06182c)',
          backgroundImage: `
            linear-gradient(135deg, #07192d 0%, #0a2540 60%, #123d67 100%)
          `,
          color: 'var(--white, #ffffff)',
          paddingTop: 'calc(var(--header-h, 76px) + 20px)',
          paddingBottom: '2.5rem',
          overflow: 'hidden',
        }}
      >
        {/* Faint Grid Texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(to right, rgba(215, 217, 220, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(215, 217, 220, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Lotus Watermark */}
        <div
          style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            width: '320px',
            height: '320px',
            opacity: 0.04,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <LotusLogo variant="watermark" width="100%" height="100%" />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 3, maxWidth: '1120px' }}>
          {/* Breadcrumb INSIDE the hero band */}
          <nav
            aria-label="Breadcrumb inside legal hero"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              color: 'var(--silver-300, #d7d9dc)',
              marginBottom: '0.85rem',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/"
              style={{
                color: 'var(--silver-300, #d7d9dc)',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--silver-300, #d7d9dc)')}
            >
              Home
            </Link>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>&gt;</span>
            <span style={{ color: '#ffffff', fontWeight: 500 }}>{breadcrumbLabel}</span>
          </nav>

          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.74rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#8FA3C8',
              marginBottom: '0.5rem',
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
            LEGAL &amp; REGULATORY • GODHRA, GUJARAT
          </div>

          {/* Display H1 */}
          <h1
            style={{
              fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
              fontSize: 'clamp(2rem, 3.4vw, 2.75rem)',
              lineHeight: 1.2,
              fontWeight: 600,
              color: '#ffffff',
              margin: '0 0 0.75rem',
              letterSpacing: '-0.015em',
            }}
          >
            {pageTitle}
          </h1>

          {/* One-Line Plain-English Summary */}
          <p
            style={{
              fontFamily: 'var(--font-body, Inter, sans-serif)',
              fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
              lineHeight: 1.6,
              color: 'var(--silver-200, #e2e8f0)',
              maxWidth: '820px',
              margin: 0,
            }}
          >
            {summary}
          </p>

          {/* Show "Last updated [date]" ONLY if lastUpdated is non-null */}
          {lastUpdated && (
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--silver-400, #94a3b8)',
                marginTop: '0.75rem',
              }}
            >
              Last updated: {lastUpdated}
            </div>
          )}
        </div>
      </section>

      {/* Main Body on Silver-Grey Canvas */}
      <div
        className="legal-canvas-bg"
        style={{
          backgroundColor: '#EEF1F4',
          minHeight: '70vh',
          backgroundImage: `
            radial-gradient(#CBD5E1 1px, transparent 1px),
            linear-gradient(to bottom, #EEF1F4 0%, #E6EAF0 100%)
          `,
          backgroundSize: '24px 24px, 100% 100%',
          paddingTop: '2.5rem',
          paddingBottom: '4.5rem',
        }}
      >
        <div className="container" style={{ maxWidth: '1120px' }}>
          {/* Mobile TOC Drawer Toggle (Below 992px) */}
          <div className="mobile-toc-wrapper" style={{ display: 'none', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              style={{
                width: '100%',
                padding: '0.85rem 1.25rem',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#0A2540',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <span>Table of Contents ({sections.length} Sections)</span>
              <span>{mobileTocOpen ? '▴' : '▾'}</span>
            </button>
            {mobileTocOpen && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '16px',
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                }}
              >
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    style={{
                      textAlign: 'left',
                      padding: '0.5rem 0.75rem',
                      background: activeId === sec.id ? 'rgba(18, 61, 103, 0.08)' : 'none',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: activeId === sec.id ? 600 : 400,
                      color: activeId === sec.id ? 'var(--navy-900, #0A2540)' : 'var(--silver-700, #475569)',
                      cursor: 'pointer',
                    }}
                  >
                    {sec.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2-Column Desktop Layout */}
          <div
            className="legal-grid-layout"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 260px) minmax(0, 1fr)',
              gap: '2.5rem',
              alignItems: 'flex-start',
            }}
          >
            {/* Left Sticky Table of Contents (260px wide) */}
            <aside
              className="legal-toc-sidebar"
              style={{
                position: 'sticky',
                top: '110px',
                maxHeight: 'calc(100vh - 130px)',
                overflowY: 'auto',
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '1.5rem',
                boxShadow: '0 8px 28px rgba(18, 61, 103, 0.05)',
                border: '1px solid rgba(215, 217, 220, 0.7)',
              }}
            >
              <div
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--navy-700, #123D67)',
                  marginBottom: '1rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                Contents &amp; Navigation
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {sections.map((sec) => {
                  const isActive = activeId === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollToSection(sec.id)}
                      style={{
                        textAlign: 'left',
                        background: isActive ? 'rgba(18, 61, 103, 0.06)' : 'none',
                        border: 'none',
                        borderLeft: isActive ? '3px solid var(--red-500, #D9232D)' : '3px solid transparent',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '0 8px 8px 0',
                        fontSize: '0.84rem',
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? 'var(--navy-900, #0A2540)' : 'var(--silver-700, #475569)',
                        cursor: 'pointer',
                        lineHeight: 1.4,
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.color = '#0A2540';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.color = 'var(--silver-700, #475569)';
                      }}
                    >
                      {sec.title}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Right Main Legal Reading Content Card */}
            <main>
              <div
                className="legal-content-card"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '32px',
                  padding: 'clamp(2rem, 4vw, 3.25rem)',
                  boxShadow: '0 12px 36px rgba(18, 61, 103, 0.06), 0 2px 8px rgba(18, 61, 103, 0.04)',
                  border: '1px solid rgba(215, 217, 220, 0.7)',
                  marginBottom: '2.5rem',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  {sections.map((section) => {
                    // 1. Registrations Table (used on /disclosures)
                    if (section.type === 'registrationsTable') {
                      return (
                        <div
                          key={section.id}
                          id={section.id}
                          style={{ scrollMarginTop: '120px' }}
                        >
                          <h2
                            style={{
                              fontFamily: 'var(--font-primary, Poppins, sans-serif)',
                              fontSize: '1.35rem',
                              fontWeight: 600,
                              color: 'var(--navy-900, #0A2540)',
                              marginBottom: '0.75rem',
                            }}
                          >
                            {section.title}
                          </h2>
                          {section.copy && (
                            <p style={{ fontSize: '0.92rem', color: 'var(--silver-700, #475569)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                              {section.copy}
                            </p>
                          )}
                          <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <table
                              className="table"
                              style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                fontSize: '0.88rem',
                                textAlign: 'left',
                              }}
                            >
                              <thead>
                                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                                  <th style={{ padding: '0.85rem 1rem', color: '#0A2540', fontWeight: 600 }}>Registration</th>
                                  <th style={{ padding: '0.85rem 1rem', color: '#0A2540', fontWeight: 600 }}>Number</th>
                                  <th style={{ padding: '0.85rem 1rem', color: '#0A2540', fontWeight: 600 }}>Holder</th>
                                  <th style={{ padding: '0.85rem 1rem', color: '#0A2540', fontWeight: 600 }}>Official Wording</th>
                                </tr>
                              </thead>
                              <tbody>
                                {registrationsData.map((r) => (
                                  <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0A2540' }}>
                                      {r.clientEntry}
                                    </td>
                                    <td style={{ padding: '0.85rem 1rem' }}>
                                      <code
                                        style={{
                                          backgroundColor: '#F1F5F9',
                                          padding: '2px 6px',
                                          borderRadius: '6px',
                                          fontSize: '0.82rem',
                                          color: 'var(--navy-800, #123D67)',
                                        }}
                                      >
                                        {r.number}
                                      </code>
                                    </td>
                                    <td style={{ padding: '0.85rem 1rem', color: 'var(--silver-800, #334155)' }}>
                                      {r.holder}
                                    </td>
                                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.84rem', color: 'var(--silver-700, #475569)', lineHeight: 1.5 }}>
                                      {r.recommendedWording}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    }

                    // 2. Complaint Contact Box (used on /complaints)
                    if (section.type === 'complaintContact') {
                      return (
                        <div
                          key={section.id}
                          id={section.id}
                          style={{
                            scrollMarginTop: '120px',
                            backgroundColor: '#F8FAFC',
                            borderRadius: '20px',
                            padding: '1.75rem',
                            border: '1px solid #E2E8F0',
                            borderLeft: '4px solid var(--navy-700, #123D67)',
                          }}
                        >
                          <h2
                            style={{
                              fontFamily: 'var(--font-primary, Poppins, sans-serif)',
                              fontSize: '1.35rem',
                              fontWeight: 600,
                              color: 'var(--navy-900, #0A2540)',
                              margin: '0 0 1rem',
                            }}
                          >
                            {section.title}
                          </h2>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.92rem', lineHeight: 1.6 }}>
                            <div>
                              <strong style={{ color: '#0A2540' }}>Office Address:</strong>{' '}
                              <span style={{ color: '#475569' }}>{section.address || contactData.address.full}</span>
                            </div>
                            <div>
                              <strong style={{ color: '#0A2540' }}>Direct Phone:</strong>{' '}
                              <a href={`tel:${section.phone || contactData.phone}`} style={{ color: 'var(--navy-800, #123D67)', fontWeight: 600, textDecoration: 'none' }}>
                                {contactData.phoneDisplay}
                              </a>
                            </div>
                            <div>
                              <strong style={{ color: '#0A2540' }}>Direct Email:</strong>{' '}
                              <a href={`mailto:${section.email || contactData.email}`} style={{ color: 'var(--navy-800, #123D67)', fontWeight: 600, textDecoration: 'none' }}>
                                {contactData.email}
                              </a>
                            </div>
                            <div style={{ marginTop: '0.35rem', color: '#64748B', fontSize: '0.86rem' }}>
                              <strong style={{ color: '#0A2540' }}>Grievance Officer:</strong> {section.grievanceOfficer}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // 3. Escalation Guide (used on /complaints)
                    if (section.type === 'escalationGuide') {
                      return (
                        <div
                          key={section.id}
                          id={section.id}
                          style={{
                            scrollMarginTop: '120px',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '20px',
                            padding: '1.75rem',
                            border: '1px solid #E2E8F0',
                          }}
                        >
                          <h2
                            style={{
                              fontFamily: 'var(--font-primary, Poppins, sans-serif)',
                              fontSize: '1.35rem',
                              fontWeight: 600,
                              color: 'var(--navy-900, #0A2540)',
                              margin: '0 0 0.85rem',
                            }}
                          >
                            {section.title}
                          </h2>
                          <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1rem' }}>
                            If an issue remains unresolved or pertains directly to a product provider or exchange, clients may utilise official statutory redressal mechanisms:
                          </p>
                          <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', color: '#334155', lineHeight: 1.6 }}>
                            {section.points?.map((pt: string, idx: number) => (
                              <li key={idx}>{pt}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    }

                    // 4. Callout / Notice Block
                    if (section.type === 'calloutBlock') {
                      return (
                        <div
                          key={section.id}
                          id={section.id}
                          style={{
                            scrollMarginTop: '120px',
                            backgroundColor: '#FFFBEB',
                            borderRadius: '18px',
                            padding: '1.5rem 1.75rem',
                            border: '1px solid #FDE68A',
                            borderLeft: '4px solid #D97706',
                          }}
                        >
                          <h2
                            style={{
                              fontFamily: 'var(--font-primary, Poppins, sans-serif)',
                              fontSize: '1.25rem',
                              fontWeight: 600,
                              color: '#92400E',
                              margin: '0 0 0.5rem',
                            }}
                          >
                            {section.title}
                          </h2>
                          <p style={{ margin: 0, color: '#78350F', lineHeight: 1.7, fontSize: '0.94rem' }}>
                            {section.copy}
                          </p>
                        </div>
                      );
                    }

                    // 5. Default Standard Text / Disclosure Block
                    return (
                      <div
                        key={section.id}
                        id={section.id}
                        style={{ scrollMarginTop: '120px' }}
                      >
                        <h2
                          style={{
                            fontFamily: 'var(--font-primary, Poppins, sans-serif)',
                            fontSize: '1.35rem',
                            fontWeight: 600,
                            color: 'var(--navy-900, #0A2540)',
                            margin: '0 0 0.75rem',
                          }}
                        >
                          {section.title}
                        </h2>
                        <p
                          style={{
                            fontFamily: 'var(--font-body, Inter, sans-serif)',
                            fontSize: '0.96rem',
                            lineHeight: 1.75,
                            color: 'var(--silver-900, #1E293B)',
                            margin: 0,
                          }}
                        >
                          {section.copy}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Consultation Reassurance Card */}
              <div
                style={{
                  backgroundColor: '#0A2540',
                  color: '#ffffff',
                  borderRadius: '28px',
                  padding: '2.25rem 2.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  boxShadow: '0 12px 32px rgba(10, 37, 64, 0.25)',
                }}
              >
                <div style={{ maxWidth: '580px' }}>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: '#8FA3C8',
                      marginBottom: '0.35rem',
                    }}
                  >
                    CONFIDENTIAL ADVISORY • GODHRA BRANCH
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                      fontSize: '1.45rem',
                      color: '#ffffff',
                      margin: '0 0 0.45rem',
                    }}
                  >
                    Have Questions Regarding Our Terms or Disclosures?
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#C9CED4', margin: 0, lineHeight: 1.55 }}>
                    Our advisors are available for structured, confidential consultations at Shri Chudasama Bhuvan, M.G. Road, Godhra.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => openContactDrawer(undefined, e.currentTarget)}
                  className="btn btn-primary"
                  style={{
                    backgroundColor: 'var(--red-500, #D9232D)',
                    border: 'none',
                    borderRadius: '24px',
                    padding: '0.75rem 1.6rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Talk to an Advisor &rarr;
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

