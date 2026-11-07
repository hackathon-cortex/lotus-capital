import React, { useState } from 'react';

export interface FundCategoryItem {
  id: string;
  tabLabel: string;
  title: string;
  spectrumPercent: number; // 0 (lowest) to 100 (highest)
  description: string;
  neutralGuidance: string;
  chips: string[];
  enquirySlug: string;
  icon: React.ReactNode;
}

export const FUND_CATEGORIES: FundCategoryItem[] = [
  {
    id: 'equity',
    tabLabel: 'Equity funds',
    title: 'Equity Funds',
    spectrumPercent: 88,
    description:
      'Invest predominantly in equity shares of corporations across market capitalisations (large, mid, small cap) for potential capital appreciation.',
    neutralGuidance: 'Your time horizon and comfort with risk matter. Discuss yours with us.',
    chips: ['Objective', 'Risk level', 'Costs & Expense Ratio'],
    enquirySlug: 'Equity funds',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 'debt',
    tabLabel: 'Debt funds',
    title: 'Debt & Fixed Income Funds',
    spectrumPercent: 22,
    description:
      'Invest in fixed-income securities including government securities, treasury bills, and corporate debt instruments seeking income stability.',
    neutralGuidance: 'Your time horizon and comfort with risk matter. Discuss yours with us.',
    chips: ['Credit quality', 'Duration risk', 'Liquidity terms'],
    enquirySlug: 'Debt funds',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    id: 'hybrid',
    tabLabel: 'Hybrid funds',
    title: 'Hybrid Funds',
    spectrumPercent: 55,
    description:
      'Combine equity and debt allocations within a single scheme (such as aggressive hybrid or balanced advantage) to blend growth and stability.',
    neutralGuidance: 'Your time horizon and comfort with risk matter. Discuss yours with us.',
    chips: ['Asset allocation', 'Rebalancing model', 'Volatility profile'],
    enquirySlug: 'Hybrid funds',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 1 0 20Z" fill="currentColor" fillOpacity="0.25" />
      </svg>
    ),
  },
  {
    id: 'index',
    tabLabel: 'Index funds and ETFs',
    title: 'Index Funds & ETFs',
    spectrumPercent: 72,
    description:
      'Passively managed funds designed to mirror benchmark indices (such as Nifty 50 or Sensex), seeking to track market movements transparently.',
    neutralGuidance: 'Your time horizon and comfort with risk matter. Discuss yours with us.',
    chips: ['Tracking error', 'Expense ratio', 'Benchmark mandate'],
    enquirySlug: 'Index funds and ETFs',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: 'elss',
    tabLabel: 'ELSS (Tax-saving)',
    title: 'Tax-Saving ELSS',
    spectrumPercent: 82,
    description:
      'Equity-linked funds that may offer tax benefits under prevailing rules; scheme terms apply, check scheme documents.',
    neutralGuidance: 'Statutory mandatory lock-in period of 3 years applies to every unit purchased.',
    chips: ['3-year lock-in', 'Tax eligibility', 'Market risk'],
    enquirySlug: 'ELSS',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      </svg>
    ),
  },
];

export interface FundCategoryExplorerProps {
  id?: string;
  onSelectCategoryForEnquiry?: (categorySlug: string) => void;
}

export const FundCategoryExplorer: React.FC<FundCategoryExplorerProps> = ({
  id = 'categories',
  onSelectCategoryForEnquiry,
}) => {
  const [selectedId, setSelectedId] = useState<string>('equity');
  const activeCategory =
    FUND_CATEGORIES.find((cat) => cat.id === selectedId) || FUND_CATEGORIES[0];

  const handleEnquiry = (enquirySlug: string) => {
    if (onSelectCategoryForEnquiry) {
      onSelectCategoryForEnquiry(enquirySlug);
    } else {
      const el = document.getElementById('enquiry');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id={id}
      className="fund-category-explorer-section section-padding gi-stacked-section"
      style={{
        backgroundColor: '#ffffff',
        position: 'relative',
        zIndex: 14,
        marginTop: '-36px',
        borderTopLeftRadius: '36px',
        borderTopRightRadius: '36px',
        boxShadow: '0 -10px 40px rgba(10,37,64,0.06)',
        padding: '5rem 0',
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.75rem' }}>
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
            DISCIPLINED ASSET ALLOCATION
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
              color: 'var(--navy-950, #051329)',
              fontWeight: 700,
              margin: '0 0 1rem',
              letterSpacing: '-0.01em',
            }}
          >
            Mutual fund categories.
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--ink, #1f2933)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Schemes differ by asset class, investment approach, risk horizon, and liquidity. Explore how each fits a portfolio.
          </p>
        </div>

        {/* Top: Volatility Spectrum Bar */}
        <div
          className="volatility-spectrum-panel"
          style={{
            backgroundColor: 'var(--silver-100, #f8f9fa)',
            borderRadius: '24px',
            border: '1.5px solid var(--silver-300, #d7d9dc)',
            padding: '1.75rem 2rem',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.85rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            <span style={{ color: '#5B8DB8' }}>Generally lower volatility</span>
            <span style={{ color: 'var(--navy-700, #0d2b4a)', fontStyle: 'italic', textTransform: 'none', fontWeight: 500 }}>
              General positioning only; individual schemes vary
            </span>
            <span style={{ color: '#2F6FB0' }}>Generally higher volatility</span>
          </div>

          {/* Gradient Track with Gliding Marker */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '10px',
              borderRadius: '5px',
              background: 'linear-gradient(90deg, #5B8DB8 0%, #123D67 50%, #2F6FB0 100%)',
              margin: '1.25rem 0',
            }}
          >
            {/* Category position ticks */}
            {FUND_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                style={{
                  position: 'absolute',
                  left: `${cat.spectrumPercent}%`,
                  top: '-4px',
                  width: '2px',
                  height: '18px',
                  backgroundColor: 'rgba(255, 255, 255, 0.75)',
                  transform: 'translateX(-50%)',
                  pointerEvents: 'none',
                }}
              />
            ))}

            {/* Active Gliding Marker */}
            <div
              style={{
                position: 'absolute',
                left: `${activeCategory.spectrumPercent}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '3.5px solid #2F6FB0',
                boxShadow: '0 2px 8px rgba(10, 37, 64, 0.35)',
                transition: 'left 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                zIndex: 3,
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: 'var(--ink, #1f2933)',
              opacity: 0.8,
            }}
          >
            <span>Debt & Liquid</span>
            <span>Hybrid</span>
            <span>Index & ETFs</span>
            <span>ELSS</span>
            <span>Equity</span>
          </div>
        </div>

        {/* 2-Column Explorer: Tabs on Left, Detail Card on Right */}
        <div
          className="category-explorer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(260px, 1fr) minmax(340px, 1.8fr)',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Vertical Pill Tabs (Horizontally scrollable on mobile) */}
          <div
            className="category-tabs-column"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {FUND_CATEGORIES.map((cat) => {
              const isActive = cat.id === selectedId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedId(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderRadius: '16px',
                    border: isActive
                      ? '2px solid #2F6FB0'
                      : '1.5px solid var(--silver-300, #d7d9dc)',
                    backgroundColor: isActive ? 'rgba(47, 111, 176, 0.08)' : '#ffffff',
                    color: isActive ? '#123D67' : 'var(--navy-900, #0a2540)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.96rem',
                    cursor: 'pointer',
                    outline: 'none',
                    textAlign: 'left',
                    transition: 'all 0.22s ease',
                    boxShadow: isActive ? '0 4px 16px rgba(47, 111, 176, 0.12)' : 'none',
                  }}
                >
                  <span>{cat.tabLabel}</span>
                  <span
                    style={{
                      color: isActive ? '#2F6FB0' : 'var(--silver-500, #8a949d)',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      transform: isActive ? 'translateX(2px)' : 'none',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Detail Card (Crossfades 320ms) */}
          <div
            className="category-detail-card"
            style={{
              backgroundColor: 'var(--silver-100, #f8f9fa)',
              borderRadius: '24px',
              border: '1.5px solid var(--silver-300, #d7d9dc)',
              padding: '2.5rem',
              minHeight: '340px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 10px 30px rgba(10,37,64,0.06)',
              transition: 'opacity 0.32s ease, transform 0.32s ease',
            }}
          >
            <div>
              {/* Header: Icon & Category Name */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(47, 111, 176, 0.12)',
                    color: '#2F6FB0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeCategory.icon}
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: '#5B8DB8',
                      fontWeight: 700,
                      display: 'block',
                    }}
                  >
                    Category Overview
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '1.65rem',
                      fontWeight: 700,
                      color: 'var(--navy-950, #051329)',
                      margin: 0,
                    }}
                  >
                    {activeCategory.title}
                  </h3>
                </div>
              </div>

              {/* 2-line Description */}
              <p
                style={{
                  fontSize: '1.02rem',
                  lineHeight: 1.6,
                  color: 'var(--ink, #1f2933)',
                  marginBottom: '1rem',
                }}
              >
                {activeCategory.description}
              </p>

              {/* Neutral Guidance Note */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--silver-300, #d7d9dc)',
                  borderRadius: '12px',
                  padding: '0.85rem 1.1rem',
                  fontSize: '0.88rem',
                  color: 'var(--navy-800, #0a2540)',
                  marginBottom: '1.5rem',
                  fontStyle: 'italic',
                }}
              >
                {activeCategory.neutralGuidance}
              </div>

              {/* Look at Chips */}
              <div>
                <span
                  style={{
                    fontSize: '0.74rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                    color: 'var(--navy-700, #0d2b4a)',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                >
                  What to examine:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {activeCategory.chips.map((chip, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        padding: '0.35rem 0.8rem',
                        borderRadius: '9999px',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--silver-300, #d7d9dc)',
                        color: 'var(--navy-900, #0a2540)',
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Preselect Action Link */}
            <div
              style={{
                marginTop: '2rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--silver-300, #d7d9dc)',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={() => handleEnquiry(activeCategory.enquirySlug)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#2F6FB0',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  padding: '0.65rem 1.35rem',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(47, 111, 176, 0.25)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#123D67';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2F6FB0';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Ask us about this</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

