import React, { useState, useEffect } from 'react';

interface CompareRow {
  aspect: string;
  term: string;
  savings: string;
}

const COMPARE_ROWS: CompareRow[] = [
  {
    aspect: 'Primary Purpose',
    term: 'Pure financial protection designed to safeguard dependants from loss of income or liabilities upon premature demise.',
    savings: 'Dual-structure providing financial protection combined with an endowment or capital preservation savings feature.',
  },
  {
    aspect: 'Cover Period',
    term: 'Defined protection tenure selected to cover active working years or specific liability payoff horizons.',
    savings: 'Predetermined policy term structured around specific medium or long-term financial milestones.',
  },
  {
    aspect: 'Premium Focus',
    term: 'Maximum sum assured per rupee of premium; the entire premium contributes to mortality risk cover.',
    savings: 'Premium is allocated between mortality protection risk charges and the structured endowment/savings component.',
  },
  {
    aspect: 'Benefits Payout',
    term: 'Sum assured is paid out to nominees upon demise; there is no maturity payout or return of premium unless specifically chosen.',
    savings: 'Sum assured paid to nominees on demise, or accrued maturity benefit paid if surviving the full policy duration.',
  },
  {
    aspect: 'What to Inspect',
    term: 'Adequacy of sum assured, policy tenure length, claim filing requirements, and relevant supplemental riders.',
    savings: 'Premium payment terms, surrender charges, lock-in vesting rules, and whether benefits are participating or guaranteed by policy terms.',
  },
];

interface ConsiderationChip {
  id: string;
  label: string;
  explanation: string;
}

const CONSIDERATION_CHIPS: ConsiderationChip[] = [
  {
    id: 'sum_assured',
    label: 'Sum Assured',
    explanation: 'The fixed capital amount payable to your nominees to replace family income or cover outstanding debts.',
  },
  {
    id: 'policy_term',
    label: 'Policy Term',
    explanation: 'The duration of coverage, typically selected to protect dependants throughout your active earning career.',
  },
  {
    id: 'premium_affordability',
    label: 'Premium Affordability',
    explanation: 'Ensuring scheduled premium commitments remain comfortably manageable across future life transitions.',
  },
  {
    id: 'exclusions',
    label: 'Exclusions',
    explanation: 'Specific non-covered events or initial policy duration waiting periods clearly defined in the insurer schedule.',
  },
  {
    id: 'surrender_conditions',
    label: 'Surrender Conditions',
    explanation: 'Clauses and potential surrender penalties that apply if you discontinue premium payments before maturity.',
  },
  {
    id: 'riders',
    label: 'Riders',
    explanation: 'Check which optional riders (such as critical illness or accidental disability) are available and when they apply.',
  },
  {
    id: 'nominee_details',
    label: 'Nominee Details',
    explanation: 'Maintaining accurate nominee names and relationships to ensure prompt and undisputed claim disbursement.',
  },
  {
    id: 'claim_requirements',
    label: 'Claim Requirements',
    explanation: 'Understanding the intimation channels, official claim documents, and verification procedures required by the insurer.',
  },
];

export interface LifeCompareProps {
  id?: string;
  onEnquiryClick?: () => void;
}

export const LifeCompare: React.FC<LifeCompareProps> = ({
  id = 'compare',
  onEnquiryClick,
}) => {
  const [activeTab, setActiveTab] = useState<'term' | 'savings'>('term');
  const [selectedChipId, setSelectedChipId] = useState<string>(CONSIDERATION_CHIPS[0].id);

  // Check URL params for testing/screenshot capture
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('compareTab');
    if (tabParam === 'term' || tabParam === 'savings') {
      setActiveTab(tabParam);
    }
    const chipParam = params.get('chip');
    if (chipParam && CONSIDERATION_CHIPS.some((c) => c.id === chipParam)) {
      setSelectedChipId(chipParam);
    }
  }, []);

  const activeChip = CONSIDERATION_CHIPS.find((c) => c.id === selectedChipId) || CONSIDERATION_CHIPS[0];

  const handleEnquiry = (e: React.MouseEvent) => {
    if (onEnquiryClick) {
      e.preventDefault();
      onEnquiryClick();
    } else {
      const el = document.getElementById('enquiry');
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id={id}
      className="life-compare-section section-padding gi-stacked-section"
      style={{
        position: 'relative',
        zIndex: 11,
        marginTop: '-36px',
        borderTopLeftRadius: '36px',
        borderTopRightRadius: '36px',
        backgroundColor: 'var(--white, #ffffff)',
        boxShadow: '0 -10px 40px rgba(10,37,64,0.06)',
        paddingTop: '4.5rem',
        paddingBottom: '5rem',
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
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
            OBJECTIVE COMPARISON
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
            Term vs. Savings-Oriented <span style={{ fontStyle: 'italic', color: '#1F6F8B' }}>Protection</span>
          </h2>

          <p style={{ color: 'var(--muted, #556270)', fontSize: '1.02rem', lineHeight: 1.65 }}>
            Both models serve vital yet distinctly different purposes. Compare how each structure allocates premiums and provides financial continuity.
          </p>

          {/* Segmented Switch */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'var(--silver-100, #f8f9fa)',
              padding: '0.35rem',
              borderRadius: '9999px',
              border: '1px solid var(--silver-300, #d7d9dc)',
              marginTop: '1.5rem',
              boxShadow: '0 4px 14px rgba(10,37,64,0.04)',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('term')}
              style={{
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                padding: '0.65rem 1.75rem',
                borderRadius: '9999px',
                fontSize: '0.92rem',
                fontWeight: 600,
                backgroundColor: activeTab === 'term' ? '#1F6F8B' : 'transparent',
                color: activeTab === 'term' ? '#ffffff' : 'var(--navy-800, #0a2540)',
                boxShadow: activeTab === 'term' ? '0 4px 12px rgba(31, 111, 139, 0.3)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              Term Life Cover
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('savings')}
              style={{
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                padding: '0.65rem 1.75rem',
                borderRadius: '9999px',
                fontSize: '0.92rem',
                fontWeight: 600,
                backgroundColor: activeTab === 'savings' ? '#1F6F8B' : 'transparent',
                color: activeTab === 'savings' ? '#ffffff' : 'var(--navy-800, #0a2540)',
                boxShadow: activeTab === 'savings' ? '0 4px 12px rgba(31, 111, 139, 0.3)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              Savings-Oriented Plans
            </button>
          </div>
        </div>

        {/* 5-Row Comparison Panel */}
        <div
          className="life-compare-card"
          style={{
            maxWidth: '1000px',
            margin: '0 auto 4rem',
            backgroundColor: 'var(--white, #ffffff)',
            borderRadius: '24px',
            border: '1px solid var(--silver-300, #d7d9dc)',
            boxShadow: '0 16px 40px rgba(10,37,64,0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              padding: '1.25rem 2rem',
              backgroundColor: 'var(--navy-950, #051329)',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--silver-300, #d7d9dc)' }}>
              Core Dimension
            </span>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#ffffff',
                backgroundColor: 'rgba(31, 111, 139, 0.4)',
                padding: '0.3rem 0.85rem',
                borderRadius: '9999px',
                border: '1px solid rgba(31, 111, 139, 0.6)',
              }}
            >
              {activeTab === 'term' ? 'Term Life Architecture' : 'Savings-Oriented Architecture'}
            </span>
          </div>

          {/* Rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {COMPARE_ROWS.map((row, idx) => {
              const textContent = activeTab === 'term' ? row.term : row.savings;
              return (
                <div
                  key={row.aspect}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(180px, 1fr) minmax(280px, 2.5fr)',
                    gap: '2rem',
                    padding: '1.35rem 2rem',
                    borderBottom: idx < COMPARE_ROWS.length - 1 ? '1px solid var(--silver-200, #e9ecef)' : 'none',
                    backgroundColor: idx % 2 === 0 ? 'var(--white, #ffffff)' : 'var(--silver-100, #f8f9fa)',
                    alignItems: 'center',
                  }}
                >
                  <strong style={{ color: 'var(--navy-900, #0a2540)', fontSize: '0.98rem' }}>
                    {row.aspect}
                  </strong>
                  <div
                    key={`${activeTab}-${row.aspect}`}
                    style={{
                      fontSize: '0.93rem',
                      lineHeight: 1.62,
                      color: 'var(--ink, #1f2937)',
                      animation: 'fadeIn 320ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    }}
                  >
                    {textContent}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Considerations Chip Cloud & Side Card */}
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span
              className="eyebrow"
              style={{
                display: 'inline-block',
                color: 'var(--navy-700, #0d2b4a)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              EVALUATION FACTORS
            </span>
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'var(--navy-950, #051329)',
                margin: 0,
              }}
            >
              Key Considerations Prior to Issuing a Life Policy
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(300px, 1.3fr) minmax(280px, 1fr)',
              gap: '2.5rem',
              alignItems: 'center',
              backgroundColor: 'var(--silver-100, #f8f9fa)',
              padding: '2.25rem',
              borderRadius: '28px',
              border: '1px solid var(--silver-300, #d7d9dc)',
            }}
          >
            {/* Left: Chip Cloud */}
            <div>
              <div style={{ fontSize: '0.84rem', color: 'var(--muted, #556270)', marginBottom: '1rem' }}>
                Select an aspect to view guidance from our Godhra advisory team:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                {CONSIDERATION_CHIPS.map((chip) => {
                  const isSelected = selectedChipId === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => setSelectedChipId(chip.id)}
                      style={{
                        border: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                        padding: '0.55rem 1.15rem',
                        borderRadius: '9999px',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        backgroundColor: isSelected ? '#1F6F8B' : 'var(--white, #ffffff)',
                        color: isSelected ? '#ffffff' : 'var(--navy-800, #0a2540)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: isSelected ? '#1F6F8B' : 'var(--silver-300, #d7d9dc)',
                        boxShadow: isSelected ? '0 4px 14px rgba(31, 111, 139, 0.25)' : 'none',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Active Detail Explanation Card */}
            <div
              key={activeChip.id}
              style={{
                backgroundColor: 'var(--white, #ffffff)',
                borderRadius: '20px',
                border: '1.5px solid rgba(31, 111, 139, 0.25)',
                padding: '1.75rem',
                boxShadow: '0 10px 30px rgba(10,37,64,0.06)',
                animation: 'fadeIn 0.28s ease-out forwards',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1F6F8B' }} />
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--navy-950, #051329)', fontWeight: 700 }}>
                  {activeChip.label}
                </h4>
              </div>

              <p style={{ margin: '0 0 1.25rem', fontSize: '0.92rem', color: 'var(--ink, #1f2937)', lineHeight: 1.6 }}>
                {activeChip.explanation}
              </p>

              <a
                href="#enquiry"
                onClick={handleEnquiry}
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: 'var(--red-600, #b91c1c)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>Discuss this in your quote enquiry</span>
                <span>&rarr;</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

