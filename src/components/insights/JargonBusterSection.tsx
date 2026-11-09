import React, { useState } from 'react';

interface JargonCard {
  id: string;
  term: string;
  abbreviation?: string;
  category: string;
  plainMeaning: string;
  whatToWatch: string;
}

const JARGON_CARDS: JargonCard[] = [
  {
    id: 'nav',
    term: 'NAV',
    abbreviation: 'Net Asset Value',
    category: 'Mutual Funds',
    plainMeaning:
      'The per-unit market value of all underlying assets in a mutual fund scheme minus its liabilities and operational fees.',
    whatToWatch:
      'A common misconception is that a ₹10 NAV is "cheaper" than a ₹100 NAV. NAV simply reflects per-unit book value, not bargain pricing.',
  },
  {
    id: 'sip',
    term: 'SIP',
    abbreviation: 'Systematic Investment Plan',
    category: 'Investing',
    plainMeaning:
      'An investment route where a fixed sum is automatically invested at regular intervals into a mutual fund scheme.',
    whatToWatch:
      'SIP leverages rupee-cost averaging by buying more units when prices dip, but it does NOT guarantee positive returns or eliminate market drawdowns.',
  },
  {
    id: 'ter',
    term: 'TER',
    abbreviation: 'Total Expense Ratio',
    category: 'Mutual Funds',
    plainMeaning:
      'The annual percentage fee deducted from scheme assets by the AMC to cover management fees, custodial costs, and distributor commissions (in Regular plans).',
    whatToWatch:
      'Direct plans have lower TERs because they omit distributor commissions. Regular plans include distributor ongoing support.',
  },
  {
    id: 'sum-assured',
    term: 'Sum Assured',
    abbreviation: 'Guaranteed Coverage Amount',
    category: 'Life & Health',
    plainMeaning:
      'The pre-agreed contract sum payable by the insurer to the policyholder or nominee upon occurrence of an insured event.',
    whatToWatch:
      'For life insurance, aim for 10x-15x annual income to cover dependent obligations rather than focusing solely on lower premium figures.',
  },
  {
    id: 'waiting-period',
    term: 'Waiting Period',
    abbreviation: 'Moratorium Window',
    category: 'Health Insurance',
    plainMeaning:
      'The stipulated timeframe from policy start during which specific treatments or pre-existing conditions cannot be claimed.',
    whatToWatch:
      'Typically ranges from 30 days for general illnesses to 1-3 years for pre-existing conditions. Claims filed during this period are rejected.',
  },
  {
    id: 'deductible',
    term: 'Deductible & Co-Pay',
    abbreviation: 'Cost Sharing Clauses',
    category: 'Health Insurance',
    plainMeaning:
      'A deductible is the upfront bill amount you pay before insurance activates; a co-pay is a fixed percentage (e.g. 10% or 20%) you pay on every claim.',
    whatToWatch:
      'Policies with mandatory co-pays or high deductibles often feature cheaper premiums, but mean substantial out-of-pocket costs at hospitalisation.',
  },
  {
    id: 'free-look',
    term: 'Free-Look Period',
    abbreviation: 'Statutory Review Window',
    category: 'Insurance',
    plainMeaning:
      'A statutory 15 to 30 day window starting from the receipt of policy documentation to review all clauses and cancel for a full refund.',
    whatToWatch:
      'Use this window to read the actual policy schedule carefully. If terms do not match what you were promised, you can cancel without penalties.',
  },
  {
    id: 'demat',
    term: 'Demat Account',
    abbreviation: 'Dematerialised Account',
    category: 'Equity',
    plainMeaning:
      'An electronic securities depository account (CDSL or NSDL) that stores your equity shares, government bonds, and mutual funds digitally.',
    whatToWatch:
      'A Demat account holds your assets; a Trading account executes buy/sell orders; a Bank account funds the transactions.',
  },
];

export const JargonBusterSection: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFlip(id);
    }
  };

  return (
    <section id="jargon" className="section-padding" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--navy-700, #123D67)',
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
            Plain-English Terminology
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
              fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)',
              color: 'var(--navy-900, #0A2540)',
              marginBottom: '0.5rem',
            }}
          >
            Financial Jargon Buster
          </h2>

          <p style={{ color: 'var(--silver-700, #475569)', fontSize: '1rem', maxWidth: '680px' }}>
            Click, tap, or press Enter on any card to flip it and read the exact, unspun definition behind complex
            financial industry terms.
          </p>
        </div>

        {/* 8 Flip Cards Grid */}
        <div
          className="grid grid-cols-4"
          style={{
            gap: '1.5rem',
          }}
        >
          {JARGON_CARDS.map((card) => {
            const isFlipped = !!flippedCards[card.id];

            return (
              <div
                key={card.id}
                tabIndex={0}
                role="button"
                aria-pressed={isFlipped}
                aria-label={`Definition for ${card.term}. Press enter to flip.`}
                onClick={() => toggleFlip(card.id)}
                onKeyDown={(e) => handleKeyDown(e, card.id)}
                className="jargon-flip-card-container"
                style={{
                  perspective: '1000px',
                  minHeight: '270px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <div
                  className="jargon-flip-card-inner"
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    textAlign: 'left',
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'none',
                  }}
                >
                  {/* Front Face */}
                  <div
                    className="jargon-card-front"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '24px',
                      padding: '1.75rem 1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 8px 24px rgba(18, 61, 103, 0.06), 0 2px 6px rgba(18, 61, 103, 0.04)',
                      border: '1px solid rgba(215, 217, 220, 0.7)',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '1.25rem',
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: 'rgba(91, 141, 184, 0.12)',
                            color: 'var(--navy-800, #123D67)',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                          }}
                        >
                          {card.category}
                        </span>

                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: '#F1F5F9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#64748B',
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 4 23 10 17 10" />
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                          </svg>
                        </span>
                      </div>

                      <div
                        style={{
                          fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                          fontSize: '1.65rem',
                          fontWeight: 700,
                          color: 'var(--navy-900, #0A2540)',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {card.term}
                      </div>

                      {card.abbreviation && (
                        <div
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--silver-600, #64748b)',
                            fontWeight: 500,
                            lineHeight: 1.35,
                          }}
                        >
                          {card.abbreviation}
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid #EEF1F4',
                        paddingTop: '0.75rem',
                        fontSize: '0.78rem',
                        color: 'var(--silver-500, #94a3b8)',
                      }}
                    >
                      <span>Click to reveal definition</span>
                      <span style={{ color: 'var(--navy-600, #123D67)', fontWeight: 600 }}>Flip →</span>
                    </div>
                  </div>

                  {/* Back Face */}
                  <div
                    className="jargon-card-back"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      backgroundColor: 'var(--navy-900, #0A2540)',
                      borderRadius: '24px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      color: '#FFFFFF',
                      boxShadow: '0 12px 28px rgba(10, 37, 64, 0.25)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: '#5B8DB8',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Plain Meaning
                      </div>

                      <p
                        style={{
                          fontSize: '0.84rem',
                          lineHeight: 1.5,
                          color: '#E2E8F0',
                          marginBottom: '0.85rem',
                        }}
                      >
                        {card.plainMeaning}
                      </p>

                      <div
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: 'var(--red-400, #f87171)',
                          marginBottom: '0.25rem',
                        }}
                      >
                        What to Watch
                      </div>

                      <p
                        style={{
                          fontSize: '0.76rem',
                          lineHeight: 1.45,
                          color: 'var(--silver-300, #CBD5E1)',
                          margin: 0,
                        }}
                      >
                        {card.whatToWatch}
                      </p>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        paddingTop: '0.5rem',
                        fontSize: '0.72rem',
                        color: 'var(--silver-400, #94a3b8)',
                      }}
                    >
                      <span>Tap to flip back</span>
                      <span style={{ color: '#5B8DB8', fontWeight: 600 }}>↺ Front</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

