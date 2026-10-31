import React, { useState, useEffect, useRef } from 'react';

export interface SolutionCardItem {
  id: string;
  serviceDetail: string;
  name: string;
  tag: string;
  neutralLine: string;
  whatToCheck: string;
  icon: React.ReactNode;
}

export const SOLUTIONS_LIST: SolutionCardItem[] = [
  {
    id: 'corporate-fd',
    serviceDetail: 'corporate-fd',
    name: 'Corporate Fixed Deposits',
    tag: 'Fixed Income',
    neutralLine:
      'Term deposits placed with corporate issuers for specified tenures and payment terms.',
    whatToCheck:
      'Check issuer credit risk, premature withdrawal terms, and interest payment schedules.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--navy-900, #123D67)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <line x1="7" y1="8" x2="17" y2="8" />
        <line x1="7" y1="12" x2="13" y2="12" />
        <line x1="7" y1="16" x2="11" y2="16" />
      </svg>
    ),
  },
  {
    id: 'bonds',
    serviceDetail: 'bonds',
    name: 'Bonds & Debentures',
    tag: 'Debt Capital',
    neutralLine:
      'Government securities and corporate debt instruments offering scheduled coupon payments.',
    whatToCheck:
      'Check issuer credibility, secondary market liquidity, and interest rate sensitivity.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--navy-900, #123D67)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 'nps',
    serviceDetail: 'nps',
    name: 'National Pension System (NPS)',
    tag: 'Retirement',
    neutralLine:
      'Voluntary long-term pension planning framework accessed via Religare Broking Limited (Reg: 4199).',
    whatToCheck:
      'Check Tier I lock-in criteria, asset allocation guidelines, and annuity requirements upon exit.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--navy-900, #123D67)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'mlds',
    serviceDetail: 'mlds',
    name: 'Market-Linked Debentures (MLDs)',
    tag: 'Structured Debt',
    neutralLine:
      'Structured debt securities where final returns are referenced to an underlying market index.',
    whatToCheck:
      'Check payoff formula, underlying benchmark definitions, and counterparty credit exposure.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--navy-900, #123D67)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
];

export interface SolutionsCategoriesStackProps {
  id?: string;
  onSelectSolution?: (serviceDetail: string) => void;
}

export const SolutionsCategoriesStack: React.FC<SolutionsCategoriesStackProps> = ({
  id = 'types',
  onSelectSolution,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const c = new URLSearchParams(window.location.search).get('catIndex');
      if (c !== null) return parseInt(c, 10);
    }
    return 0;
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const topOffset = rect.top;
      const totalHeight = rect.height - window.innerHeight;
      if (totalHeight <= 0) return;

      const progress = Math.min(Math.max(-topOffset / totalHeight, 0), 1);
      const index = Math.min(
        Math.floor(progress * SOLUTIONS_LIST.length),
        SOLUTIONS_LIST.length - 1
      );
      setActiveCardIndex(index);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelect = (serviceDetail: string) => {
    if (onSelectSolution) {
      onSelectSolution(serviceDetail);
    } else {
      const el = document.getElementById('enquiry');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id={id}
      className="solutions-categories-section gi-stacked-section"
      style={{
        position: 'relative',
        zIndex: 12,
        marginTop: '-36px',
        borderTopLeftRadius: '36px',
        borderTopRightRadius: '36px',
        backgroundColor: 'var(--silver-100, #f8f9fa)',
        boxShadow: '0 -10px 40px rgba(10,37,64,0.06)',
        padding: '5rem 1.5rem',
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 1fr) minmax(360px, 1.5fr)',
            gap: '3.5rem',
            alignItems: 'start',
          }}
          className="solutions-stack-layout"
        >
          {/* Left Column: Sticky Heading & Progress Dots */}
          <div
            className="solutions-stack-intro"
            style={{ position: 'sticky', top: '120px' }}
          >
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
              OPTIONS
            </span>

            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2.1rem, 3.4vw, 3rem)',
                fontWeight: 700,
                color: 'var(--navy-950, #051329)',
                lineHeight: 1.2,
                marginBottom: '1rem',
              }}
            >
              Choose by purpose, <span style={{ fontStyle: 'italic', color: 'var(--navy-900, #123D67)' }}>not by name.</span>
            </h2>

            <p
              style={{
                fontSize: '1.02rem',
                color: 'var(--ink, #1f2933)',
                lineHeight: 1.65,
                marginBottom: '2rem',
              }}
            >
              Different financial instruments serve distinct wealth preservation goals. Terms, returns and risks depend on the issuer and the product; read the offer document.
            </p>

            {/* Vertical Dot Tracker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {SOLUTIONS_LIST.map((item, idx) => {
                const isActive = idx === activeCardIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveCardIndex(idx)}
                    style={{
                      outline: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      background: 'none',
                      border: 'none',
                      padding: '0.25rem 0',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: isActive ? 'var(--navy-900, #123D67)' : 'var(--silver-300, #cbd5e1)',
                        transition: 'all 0.25s ease',
                        boxShadow: isActive ? '0 0 8px rgba(18, 61, 103, 0.5)' : 'none',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? 'var(--navy-950, #051329)' : 'var(--muted, #5b6770)',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Sticky Card Stack */}
          <div
            ref={containerRef}
            className="solutions-cards-container"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              minHeight: '750px',
            }}
          >
            {SOLUTIONS_LIST.map((solution, index) => {
              const isCurrent = index === activeCardIndex;
              const isPassed = index < activeCardIndex;
              const topOffset = 120 + index * 24;

              return (
                <div
                  key={solution.id}
                  className="solution-sticky-card"
                  style={{
                    position: 'sticky',
                    top: `${topOffset}px`,
                    maxHeight: '230px',
                    backgroundColor: '#ffffff',
                    borderRadius: '24px',
                    border: isCurrent
                      ? '2px solid var(--navy-900, #123D67)'
                      : '1.5px solid var(--silver-300, #e2e8f0)',
                    padding: '1.75rem',
                    boxShadow: isCurrent
                      ? '0 16px 36px rgba(10, 37, 64, 0.08), 0 4px 12px rgba(10, 37, 64, 0.04)'
                      : '0 4px 16px rgba(10, 37, 64, 0.04)',
                    transform: isPassed ? 'scale(0.96)' : 'scale(1)',
                    opacity: isPassed ? 0.7 : 1,
                    transition: 'transform 0.3s ease, opacity 0.3s ease, border-color 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '12px',
                            backgroundColor: 'var(--navy-100, #eaf1f8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {solution.icon}
                        </div>
                        <h3
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '1.15rem',
                            fontWeight: 700,
                            color: 'var(--navy-950, #051329)',
                            margin: 0,
                          }}
                        >
                          {solution.name}
                        </h3>
                      </div>

                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          padding: '0.28rem 0.65rem',
                          borderRadius: '9999px',
                          backgroundColor: isCurrent ? 'var(--navy-100, #eaf1f8)' : 'var(--silver-100, #f1f5f9)',
                          color: isCurrent ? 'var(--navy-900, #123D67)' : 'var(--muted, #5b6770)',
                          border: isCurrent ? '1px solid rgba(18, 61, 103, 0.25)' : '1px solid var(--silver-300, #e2e8f0)',
                        }}
                      >
                        {solution.tag}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: '0.88rem',
                        color: 'var(--ink, #1f2933)',
                        lineHeight: 1.5,
                        margin: '0 0 0.65rem',
                      }}
                    >
                      {solution.neutralLine}
                    </p>

                    <div
                      style={{
                        backgroundColor: 'var(--silver-100, #f8f9fa)',
                        borderRadius: '10px',
                        padding: '0.55rem 0.75rem',
                        borderLeft: '3px solid var(--navy-900, #123D67)',
                        fontSize: '0.8rem',
                        color: 'var(--ink, #1f2933)',
                        lineHeight: 1.45,
                      }}
                    >
                      <strong style={{ color: 'var(--navy-900, #0a2540)' }}>What to check: </strong>
                      {solution.whatToCheck}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.85rem' }}>
                    <button
                      type="button"
                      onClick={() => handleSelect(solution.serviceDetail)}
                      style={{
                        outline: 'none',
                        cursor: 'pointer',
                        padding: '0.45rem 1rem',
                        borderRadius: '10px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        backgroundColor: isCurrent ? 'var(--navy-900, #0a2540)' : 'var(--silver-100, #f8f9fa)',
                        color: isCurrent ? '#ffffff' : 'var(--navy-900, #0a2540)',
                        border: isCurrent ? '1px solid var(--navy-900, #0a2540)' : '1px solid var(--silver-300, #cbd5e1)',
                        transition: 'all 0.2s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--red-500, #d9232d)';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.borderColor = 'var(--red-500, #d9232d)';
                      }}
                      onMouseLeave={(e) => {
                        if (isCurrent) {
                          e.currentTarget.style.backgroundColor = 'var(--navy-900, #0a2540)';
                          e.currentTarget.style.color = '#ffffff';
                          e.currentTarget.style.borderColor = 'var(--navy-900, #0a2540)';
                        } else {
                          e.currentTarget.style.backgroundColor = 'var(--silver-100, #f8f9fa)';
                          e.currentTarget.style.color = 'var(--navy-900, #0a2540)';
                          e.currentTarget.style.borderColor = 'var(--silver-300, #cbd5e1)';
                        }
                      }}
                    >
                      <span>Ask us</span>
                      <span>&rarr;</span>
                    </button>
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

