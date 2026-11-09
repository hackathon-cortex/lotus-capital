import React, { useState, useEffect, useRef } from 'react';

export interface PolicyTypeCard {
  id: string;
  serviceDetail: string;
  name: string;
  description: string;
  purposeTag: 'Protection' | 'Savings' | 'Protection / Savings' | 'Market-linked' | 'Retirement';
  icon: React.ReactNode;
}

export const LIFE_POLICY_TYPES: PolicyTypeCard[] = [
  {
    id: 'term',
    serviceDetail: 'term',
    name: 'Term Life Insurance',
    description: "Cover for a chosen period, focused on protecting your family's finances.",
    purposeTag: 'Protection',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'savings',
    serviceDetail: 'savings',
    name: 'Savings-Oriented Plans',
    description: 'Combines life cover with a savings element; features depend on the specific plan.',
    purposeTag: 'Savings',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    id: 'par',
    serviceDetail: 'par-non-par',
    name: 'Participating & Non-Participating',
    description: 'Plans differ in how benefits are determined; check the policy terms.',
    purposeTag: 'Protection / Savings',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    id: 'ulip',
    serviceDetail: 'ulip',
    name: 'Unit-Linked Plans (ULIP)',
    description: 'Linked to market-based funds, so values can rise or fall.',
    purposeTag: 'Market-linked',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    id: 'pension',
    serviceDetail: 'pension',
    name: 'Retirement & Pension Products',
    description: 'Products designed to support income planning after work, where applicable.',
    purposeTag: 'Retirement',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
];

export interface PolicyTypesStackProps {
  id?: string;
  onSelectType?: (serviceDetail: string) => void;
}

export const PolicyTypesStack: React.FC<PolicyTypesStackProps> = ({
  id = 'types',
  onSelectType,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    // Check for query param activeType or scroll tracking
    const params = new URLSearchParams(window.location.search);
    const queryStack = params.get('stackCard');
    if (queryStack !== null) {
      setActiveCardIndex(Math.min(Math.max(parseInt(queryStack, 10), 0), LIFE_POLICY_TYPES.length - 1));
      return;
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      const cards = containerRef.current.querySelectorAll('.sticky-type-card');
      const headerOffset = 140;

      cards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        if (rect.top <= headerOffset + idx * 24 + 40) {
          setActiveCardIndex(idx);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCardClick = (detail: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelectType) {
      onSelectType(detail);
    }
    const enquiryEl = document.getElementById('enquiry');
    if (enquiryEl) {
      enquiryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id={id}
      className="policy-types-section section-padding gi-stacked-section"
      style={{
        position: 'relative',
        zIndex: 10,
        marginTop: '-36px',
        borderTopLeftRadius: '36px',
        borderTopRightRadius: '36px',
        backgroundColor: 'var(--silver-100, #f8f9fa)',
        boxShadow: '0 -10px 40px rgba(10,37,64,0.06)',
        paddingTop: '4.5rem',
        paddingBottom: '5rem',
      }}
    >
      <div className="container" ref={containerRef} style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="policy-types-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(340px, 1.6fr)', gap: '4rem', alignItems: 'start' }}>
          
          {/* Left Column (Sticky Intro + Vertical Dot Indicator) */}
          <div className="policy-types-sticky-intro" style={{ position: 'sticky', top: '110px' }}>
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
              POLICY TYPES
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
              Choose by purpose, <span style={{ fontStyle: 'italic', color: '#1F6F8B' }}>not by name.</span>
            </h2>

            <p style={{ color: 'var(--muted, #556270)', fontSize: '1.02rem', lineHeight: 1.65, marginBottom: '2rem' }}>
              Understanding the primary function of each life policy category helps align cover with your family’s financial continuity.
            </p>

            {/* Vertical Dot Indicator */}
            <div
              className="policy-types-dots"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                borderLeft: '2px solid var(--silver-300, #d7d9dc)',
                paddingLeft: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              {LIFE_POLICY_TYPES.map((type, idx) => {
                const isActive = activeCardIndex === idx;
                return (
                  <div
                    key={type.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: isActive ? 1 : 0.6,
                    }}
                    onClick={() => {
                      const el = document.getElementById(`type-card-${type.id}`);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <span
                      style={{
                        width: isActive ? '12px' : '8px',
                        height: isActive ? '12px' : '8px',
                        borderRadius: '50%',
                        backgroundColor: isActive ? '#1F6F8B' : 'var(--silver-400, #adb5bd)',
                        boxShadow: isActive ? '0 0 0 4px rgba(31, 111, 139, 0.25)' : 'none',
                        transition: 'all 0.25s ease',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? 'var(--navy-950, #051329)' : 'var(--muted, #556270)',
                      }}
                    >
                      {type.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Statutory Transparency Box */}
            <div
              style={{
                padding: '1.15rem 1.25rem',
                borderRadius: '16px',
                backgroundColor: 'var(--white, #ffffff)',
                border: '1px solid var(--silver-300, #d7d9dc)',
                fontSize: '0.82rem',
                color: 'var(--ink, #1f2937)',
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: 'var(--navy-900, #0a2540)', display: 'block', marginBottom: '0.25rem' }}>
                Objective Alignment:
              </strong>
              No product is presented as a guaranteed investment return unless policy terms establish an explicit guarantee.
            </div>
          </div>

          {/* Right Column: Sticky Card Stack (Desktop) / Vertical List (Mobile) */}
          <div
            className="policy-types-cards-stack"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              minHeight: '1050px',
            }}
          >
            {LIFE_POLICY_TYPES.map((card, idx) => {
              const isPast = idx < activeCardIndex;
              const isCurrent = idx === activeCardIndex;
              // Sticky top offset: 110px base + idx * 24px
              const stickyTop = 110 + idx * 24;

              return (
                <div
                  id={`type-card-${card.id}`}
                  key={card.id}
                  className={`sticky-type-card ${isCurrent ? 'is-current' : ''}`}
                  style={{
                    position: 'sticky',
                    top: `${stickyTop}px`,
                    maxHeight: '220px',
                    borderRadius: '24px',
                    backgroundColor: 'var(--white, #ffffff)',
                    border: isCurrent
                      ? '1.5px solid #1F6F8B'
                      : '1px solid var(--silver-300, #d7d9dc)',
                    boxShadow: isCurrent
                      ? '0 20px 45px rgba(10,37,64,0.12), 0 2px 6px rgba(10,37,64,0.04)'
                      : '0 8px 24px rgba(10,37,64,0.06)',
                    padding: '1.75rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transform: isPast ? 'scale(0.96)' : 'scale(1)',
                    opacity: isPast ? 0.72 : 1,
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                    zIndex: idx + 1,
                    cursor: 'pointer',
                  }}
                  onClick={(e) => handleCardClick(card.serviceDetail, e)}
                >
                  <div>
                    {/* Top row within card: Icon + Purpose Tag */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          backgroundColor: isCurrent ? 'rgba(31, 111, 139, 0.12)' : 'var(--silver-100, #f8f9fa)',
                          color: isCurrent ? '#1F6F8B' : 'var(--navy-700, #0d2b4a)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid var(--silver-300, #d7d9dc)',
                        }}
                      >
                        {card.icon}
                      </div>

                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          backgroundColor: 'rgba(31, 111, 139, 0.1)',
                          color: '#1F6F8B',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          padding: '0.28rem 0.65rem',
                          borderRadius: '9999px',
                          border: '1px solid rgba(31, 111, 139, 0.25)',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {card.purposeTag}
                      </span>
                    </div>

                    {/* Card Title */}
                    <h3
                      style={{
                        margin: '0 0 0.45rem',
                        fontSize: '1.25rem',
                        color: 'var(--navy-950, #051329)',
                        fontWeight: 700,
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      {card.name}
                    </h3>

                    {/* One-line Neutral Description */}
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--muted, #556270)', lineHeight: 1.55 }}>
                      {card.description}
                    </p>
                  </div>

                  {/* Bottom Action: "Ask us ->" preselection link */}
                  <div
                    style={{
                      marginTop: '1.25rem',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid rgba(215, 217, 220, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--red-600, #b91c1c)',
                        fontWeight: 600,
                        fontSize: '0.86rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <span>Ask us</span>
                      <span>&rarr;</span>
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--silver-500, #6c757d)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Preselect for quotation
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

