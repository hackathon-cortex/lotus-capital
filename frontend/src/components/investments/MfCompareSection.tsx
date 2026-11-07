import React, { useState } from 'react';

export interface MfCompareSectionProps {
  id?: string;
}

type MainTab = 'methods' | 'plans'; // 'methods' = How you invest (SIP vs Lump Sum), 'plans' = Which plan (Regular vs Direct)
type MethodSub = 'sip' | 'lumpsum';
type PlanSub = 'regular' | 'direct';

export const MfCompareSection: React.FC<MfCompareSectionProps> = ({
  id = 'compare',
}) => {
  const [mainTab, setMainTab] = useState<MainTab>('methods');
  const [methodSub, setMethodSub] = useState<MethodSub>('sip');
  const [planSub, setPlanSub] = useState<PlanSub>('regular');

  return (
    <section
      id={id}
      className="mf-compare-section section-padding gi-stacked-section"
      style={{
        backgroundColor: 'var(--silver-100, #f8f9fa)',
        position: 'relative',
        zIndex: 15,
        marginTop: '-36px',
        borderTopLeftRadius: '36px',
        borderTopRightRadius: '36px',
        boxShadow: '0 -10px 40px rgba(10,37,64,0.06)',
        padding: '5rem 0',
      }}
    >
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
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
            TRANSPARENT COMPARISON
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
            Understand how you invest.
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--ink, #1f2933)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Compare investment modes and plan structures so you understand the mechanics, costs, and trade-offs.
          </p>

          {/* Group Switcher Tabs: Group A (How you invest) vs Group B (Which plan) */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: '#ffffff',
              padding: '0.35rem',
              borderRadius: '9999px',
              border: '1.5px solid var(--silver-300, #d7d9dc)',
              marginTop: '1.75rem',
              boxShadow: '0 4px 12px rgba(10, 37, 64, 0.05)',
            }}
          >
            <button
              type="button"
              onClick={() => setMainTab('methods')}
              style={{
                padding: '0.6rem 1.4rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: mainTab === 'methods' ? '#2F6FB0' : 'transparent',
                color: mainTab === 'methods' ? '#ffffff' : 'var(--navy-800, #0a2540)',
                fontWeight: mainTab === 'methods' ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              How you invest (SIP vs Lump sum)
            </button>
            <button
              type="button"
              onClick={() => setMainTab('plans')}
              style={{
                padding: '0.6rem 1.4rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: mainTab === 'plans' ? '#123D67' : 'transparent',
                color: mainTab === 'plans' ? '#ffffff' : 'var(--navy-800, #0a2540)',
                fontWeight: mainTab === 'plans' ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Which plan (Regular vs Direct)
            </button>
          </div>
        </div>

        {/* Main Compare Container (Max ~560px tall) */}
        <div
          className="mf-compare-module"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '28px',
            border: '1.5px solid var(--silver-300, #d7d9dc)',
            padding: '2.5rem',
            boxShadow: '0 16px 40px rgba(10, 37, 64, 0.07)',
            minHeight: '480px',
            maxHeight: '600px',
            overflowY: 'auto',
          }}
        >
          {mainTab === 'methods' ? (
            /* GROUP A: HOW YOU INVEST (SIP vs Lump sum) */
            <div>
              {/* Segmented Switch with VS Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  marginBottom: '2rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => setMethodSub('sip')}
                  style={{
                    padding: '0.55rem 1.4rem',
                    borderRadius: '12px',
                    border:
                      methodSub === 'sip'
                        ? '2px solid #2F6FB0'
                        : '1.5px solid var(--silver-300, #d7d9dc)',
                    backgroundColor: methodSub === 'sip' ? 'rgba(47, 111, 176, 0.1)' : '#ffffff',
                    color: methodSub === 'sip' ? '#123D67' : 'var(--ink, #1f2933)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Systematic Investment Plan (SIP)
                </button>

                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: 'var(--silver-500, #8a949d)',
                    letterSpacing: '0.08em',
                  }}
                >
                  VS
                </span>

                <button
                  type="button"
                  onClick={() => setMethodSub('lumpsum')}
                  style={{
                    padding: '0.55rem 1.4rem',
                    borderRadius: '12px',
                    border:
                      methodSub === 'lumpsum'
                        ? '2px solid #1F6F8B'
                        : '1.5px solid var(--silver-300, #d7d9dc)',
                    backgroundColor:
                      methodSub === 'lumpsum' ? 'rgba(31, 111, 139, 0.1)' : '#ffffff',
                    color: methodSub === 'lumpsum' ? '#0A2540' : 'var(--ink, #1f2933)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Lump Sum Investment
                </button>
              </div>

              {/* Visual Diagram: Staircase vs Tall Bar */}
              <div
                style={{
                  backgroundColor: 'var(--silver-100, #f8f9fa)',
                  borderRadius: '16px',
                  padding: '1.25rem 2rem',
                  marginBottom: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid var(--silver-300, #d7d9dc)',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--navy-700, #0d2b4a)',
                      fontWeight: 700,
                    }}
                  >
                    Capital Inflow Illustration
                  </span>
                  <div
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--navy-950, #051329)',
                      marginTop: '0.2rem',
                    }}
                  >
                    {methodSub === 'sip'
                      ? 'Staggered Periodic Installments (Rupee Cost Averaging)'
                      : 'Single Upfront Capital Deployment'}
                  </div>
                </div>

                {/* SVG Representation */}
                <div style={{ width: '160px', height: '60px' }}>
                  <svg viewBox="0 0 160 60" style={{ width: '100%', height: '100%' }}>
                    {methodSub === 'sip' ? (
                      /* Rising staircase of 6 small bars */
                      <g fill="#2F6FB0">
                        <rect x="10" y="44" width="16" height="16" rx="3" opacity="0.5" />
                        <rect x="34" y="36" width="16" height="24" rx="3" opacity="0.6" />
                        <rect x="58" y="28" width="16" height="32" rx="3" opacity="0.7" />
                        <rect x="82" y="20" width="16" height="40" rx="3" opacity="0.8" />
                        <rect x="106" y="12" width="16" height="48" rx="3" opacity="0.9" />
                        <rect x="130" y="4" width="16" height="56" rx="3" opacity="1" />
                      </g>
                    ) : (
                      /* One tall bar dropping in */
                      <g fill="#1F6F8B">
                        <rect x="45" y="6" width="70" height="54" rx="6" />
                        <text
                          x="80"
                          y="36"
                          fill="#ffffff"
                          fontSize="11"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          100%
                        </text>
                      </g>
                    )}
                  </svg>
                </div>
              </div>

              {/* 4 Qualitative Comparison Rows (slide + fade) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  {
                    label: 'How money goes in',
                    sip: 'Fixed periodic contributions (e.g. monthly) automated via bank mandate.',
                    lumpsum: 'Single one-off transaction deploying available surplus capital in one go.',
                  },
                  {
                    label: 'Timing of entry',
                    sip: 'Buys units at different prices over time (rupee cost averaging), dampening short-term entry volatility.',
                    lumpsum: 'All units are acquired at a single point in time at that day’s applicable NAV.',
                  },
                  {
                    label: 'What to consider',
                    sip: 'Cash-flow alignment with regular salary or income; instils ongoing savings discipline.',
                    lumpsum: 'Multi-year holding timeline and comfort with immediate market fluctuations post-investment.',
                  },
                  {
                    label: 'Often considered by',
                    sip: 'Salaried earners or recurring savers accumulating long-term milestone corpus.',
                    lumpsum: 'Investors with windfall capital, business sale proceeds, or maturing term deposits.',
                  },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(160px, 1.2fr) minmax(280px, 3fr)',
                      gap: '1.25rem',
                      padding: '0.85rem 1.15rem',
                      borderRadius: '12px',
                      backgroundColor: idx % 2 === 0 ? 'var(--silver-100, #f8f9fa)' : '#ffffff',
                      border: '1px solid var(--silver-300, #d7d9dc)',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: 'var(--navy-900, #0a2540)', fontSize: '0.88rem' }}>
                      {row.label}
                    </div>
                    <div style={{ fontSize: '0.92rem', color: 'var(--ink, #1f2933)', lineHeight: 1.5 }}>
                      {methodSub === 'sip' ? row.sip : row.lumpsum}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* GROUP B: WHICH PLAN (Regular vs Direct) */
            <div>
              {/* Plan Switch: Regular vs Direct */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  marginBottom: '2rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => setPlanSub('regular')}
                  style={{
                    padding: '0.55rem 1.4rem',
                    borderRadius: '12px',
                    border:
                      planSub === 'regular'
                        ? '2px solid #2F6FB0'
                        : '1.5px solid var(--silver-300, #d7d9dc)',
                    backgroundColor:
                      planSub === 'regular' ? 'rgba(47, 111, 176, 0.1)' : '#ffffff',
                    color: planSub === 'regular' ? '#123D67' : 'var(--ink, #1f2933)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Regular Plan (Via Distributor)
                </button>

                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: 'var(--silver-500, #8a949d)',
                    letterSpacing: '0.08em',
                  }}
                >
                  VS
                </span>

                <button
                  type="button"
                  onClick={() => setPlanSub('direct')}
                  style={{
                    padding: '0.55rem 1.4rem',
                    borderRadius: '12px',
                    border:
                      planSub === 'direct'
                        ? '2px solid #5B8DB8'
                        : '1.5px solid var(--silver-300, #d7d9dc)',
                    backgroundColor:
                      planSub === 'direct' ? 'rgba(91, 141, 184, 0.15)' : '#ffffff',
                    color: planSub === 'direct' ? '#123D67' : 'var(--ink, #1f2933)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Direct Plan (Direct with AMC)
                </button>
              </div>

              {/* Animated Flow Diagram */}
              <div
                style={{
                  backgroundColor: 'var(--silver-100, #f8f9fa)',
                  borderRadius: '16px',
                  padding: '1.5rem 2rem',
                  marginBottom: '2rem',
                  border: '1px solid var(--silver-300, #d7d9dc)',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--navy-700, #0d2b4a)',
                      fontWeight: 700,
                    }}
                  >
                    Investment Route Flow
                  </span>
                </div>

                {/* Flow SVG */}
                <div style={{ width: '100%', height: '70px' }}>
                  <svg viewBox="0 0 500 70" style={{ width: '100%', height: '100%' }}>
                    {planSub === 'regular' ? (
                      /* You -> Lotus Capital -> AMC */
                      <g>
                        {/* Node 1: You */}
                        <rect x="20" y="15" width="80" height="40" rx="8" fill="#ffffff" stroke="#2F6FB0" strokeWidth="2" />
                        <text x="60" y="39" fill="#123D67" fontSize="12" fontWeight="700" textAnchor="middle">You</text>

                        {/* Arrow 1 */}
                        <line x1="105" y1="35" x2="185" y2="35" stroke="#2F6FB0" strokeWidth="2" strokeDasharray="4 4" />
                        <polygon points="185,35 177,30 177,40" fill="#2F6FB0" />

                        {/* Node 2: Lotus Capital */}
                        <rect x="190" y="15" width="160" height="40" rx="8" fill="#123D67" />
                        <text x="270" y="34" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">Lotus Capital</text>
                        <text x="270" y="47" fill="#5B8DB8" fontSize="9" textAnchor="middle">AMFI ARN-160174</text>

                        {/* Arrow 2 */}
                        <line x1="355" y1="35" x2="415" y2="35" stroke="#2F6FB0" strokeWidth="2" strokeDasharray="4 4" />
                        <polygon points="415,35 407,30 407,40" fill="#2F6FB0" />

                        {/* Node 3: AMC */}
                        <rect x="420" y="15" width="70" height="40" rx="8" fill="#ffffff" stroke="#2F6FB0" strokeWidth="2" />
                        <text x="455" y="39" fill="#123D67" fontSize="12" fontWeight="700" textAnchor="middle">AMC</text>
                      </g>
                    ) : (
                      /* You -> AMC */
                      <g>
                        {/* Node 1: You */}
                        <rect x="60" y="15" width="90" height="40" rx="8" fill="#ffffff" stroke="#5B8DB8" strokeWidth="2" />
                        <text x="105" y="39" fill="#123D67" fontSize="12" fontWeight="700" textAnchor="middle">You</text>

                        {/* Direct Arrow */}
                        <line x1="155" y1="35" x2="340" y2="35" stroke="#5B8DB8" strokeWidth="2.5" />
                        <polygon points="340,35 330,29 330,41" fill="#5B8DB8" />
                        <text x="247" y="27" fill="#5B8DB8" fontSize="10" fontWeight="600" textAnchor="middle">Direct Investment (No intermediary)</text>

                        {/* Node 2: AMC */}
                        <rect x="345" y="15" width="90" height="40" rx="8" fill="#123D67" />
                        <text x="390" y="39" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">AMC</text>
                      </g>
                    )}
                  </svg>
                </div>
              </div>

              {/* Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  {
                    label: 'Who you invest through',
                    regular: 'Facilitated through an AMFI-registered distributor (ARN-160174) who assists with onboarding and documentation.',
                    direct: 'Invested directly with the Asset Management Company (AMC) via their portal or registrar without an intermediary.',
                  },
                  {
                    label: 'Distributor commission',
                    regular: 'Regular plans include distributor commission paid by the AMC, reflected in the scheme’s Total Expense Ratio (TER).',
                    direct: 'Direct plans do not include distributor commission, which is why direct plan expense ratios are slightly lower.',
                  },
                  {
                    label: 'What to ask',
                    regular: 'Ask us what service you receive with regular plans.',
                    direct: 'Self-directed execution: the investor handles their own scheme selection, mandate setup, and portfolio tracking.',
                  },
                  {
                    label: 'Documents to read',
                    regular: 'Scheme Information Document (SID), Key Information Memorandum (KIM), and Statement of Additional Information (SAI).',
                    direct: 'Scheme Information Document (SID), Key Information Memorandum (KIM), and Statement of Additional Information (SAI).',
                  },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(160px, 1.2fr) minmax(280px, 3fr)',
                      gap: '1.25rem',
                      padding: '0.85rem 1.15rem',
                      borderRadius: '12px',
                      backgroundColor: idx % 2 === 0 ? 'var(--silver-100, #f8f9fa)' : '#ffffff',
                      border: '1px solid var(--silver-300, #d7d9dc)',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: 'var(--navy-900, #0a2540)', fontSize: '0.88rem' }}>
                      {row.label}
                    </div>
                    <div style={{ fontSize: '0.92rem', color: 'var(--ink, #1f2933)', lineHeight: 1.5 }}>
                      {planSub === 'regular' ? row.regular : row.direct}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
