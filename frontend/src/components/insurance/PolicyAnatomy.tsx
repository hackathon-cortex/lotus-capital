import React, { useState, useEffect, useRef } from 'react';

export interface AnatomyNode {
  id: string;
  number: string;
  title: string;
  shortExplanation: string;
  mockupHighlight: string;
  detailedText: string;
}

export interface PolicyAnatomyProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  nodes?: AnatomyNode[];
  onEnquiryClick?: () => void;
}

export const DEFAULT_GI_ANATOMY_NODES: AnatomyNode[] = [
  {
    id: 'idv',
    number: '01',
    title: 'Accurate Insured Declared Value (IDV)',
    shortExplanation: 'The agreed market valuation of your vehicle establishing maximum claim liability.',
    mockupHighlight: 'INSURED DECLARED VALUE: calibrated against age grid',
    detailedText: 'Avoid artificial under-insurance to lower premium; correct IDV guarantees full compensation in total loss or theft.',
  },
  {
    id: 'zero_dep',
    number: '02',
    title: 'Zero Depreciation Add-on',
    shortExplanation: 'Waiver of standard depreciation deductions on replaced plastic, rubber, and metal parts.',
    mockupHighlight: 'ZERO DEPRECIATION: 100% parts settlement enabled',
    detailedText: 'Crucial for vehicles under 5 years old to eliminate out-of-pocket parts costs during accidental repairs.',
  },
  {
    id: 'deductibles',
    number: '03',
    title: 'Compulsory & Voluntary Deductibles',
    shortExplanation: 'Out-of-pocket threshold payable by the insured before policy coverage triggers.',
    mockupHighlight: 'DEDUCTIBLE CLAUSE: ₹1,000 compulsory + ₹0 voluntary',
    detailedText: 'Voluntary deductibles lower renewal premiums but increase policyholder liability during minor claims.',
  },
  {
    id: 'cashless',
    number: '04',
    title: 'Cashless Network Garages',
    shortExplanation: 'Authorised workshop network providing direct settlement without upfront out-of-pocket payment.',
    mockupHighlight: 'CASHLESS NETWORK: authorized tie-ups verified',
    detailedText: 'Verify regional garage coverage in Panchmahals and central Gujarat for swift processing.',
  },
  {
    id: 'consumables',
    number: '05',
    title: 'Consumables & Tyre Cover',
    shortExplanation: 'Reimbursement for engine oil, coolant, fasteners, clips, and lubricant costs during repair.',
    mockupHighlight: 'CONSUMABLES RIDER: nuts, bolts & lubricants covered',
    detailedText: 'Standard motor policies exclude consumables; adding this rider covers typical repair expense overruns.',
  },
  {
    id: 'ncb',
    number: '06',
    title: 'No Claim Bonus (NCB) Retention',
    shortExplanation: 'Progressive discount up to 50% on own-damage premium earned through claim-free policy years.',
    mockupHighlight: 'NO CLAIM BONUS: up to 50% discount carry-forward',
    detailedText: 'NCB belongs to the owner, not the vehicle, and can be transferred upon selling or upgrading cars.',
  },
];

export const PolicyAnatomy: React.FC<PolicyAnatomyProps> = ({
  id = 'compare',
  eyebrow = 'Inspection Checklist',
  title = 'Policy Anatomy: What to Compare',
  subtitle = 'Understand the key variables that determine your actual claim recovery and protection limits.',
  nodes = DEFAULT_GI_ANATOMY_NODES,
  onEnquiryClick,
}) => {
  const [activeNodeId, setActiveNodeId] = useState<string>(nodes[0]?.id || '');
  const [hasAutoCycled, setHasAutoCycled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryNode = params.get('activeNode');
    if (queryNode && nodes.some((n) => n.id === queryNode)) {
      setActiveNodeId(queryNode);
      setHasAutoCycled(true);
    }
  }, [nodes]);

  // IntersectionObserver to start auto-cycling once when scrolled into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-cycle through nodes once on first view (unless user interacts)
  useEffect(() => {
    if (!inView || hasAutoCycled) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < nodes.length) {
        setActiveNodeId(nodes[currentIndex].id);
      } else {
        setHasAutoCycled(true);
        clearInterval(interval);
      }
    }, 2200);

    return () => clearInterval(interval);
  }, [inView, hasAutoCycled, nodes]);

  const activeNode = nodes.find((n) => n.id === activeNodeId) || nodes[0];

  const handleSelectNode = (nodeId: string) => {
    setActiveNodeId(nodeId);
    setHasAutoCycled(true); // User manually interacted, stop auto-cycling
  };

  return (
    <section
      id={id}
      className="section-padding stacked-section gi-stacked-section"
      ref={containerRef}
      style={{
        position: 'relative',
        zIndex: 11,
        marginTop: '-36px',
        borderTopLeftRadius: '36px',
        borderTopRightRadius: '36px',
        backgroundColor: 'var(--white, #ffffff)',
        boxShadow: '0 -10px 40px rgba(10,37,64,0.06)',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
          <div className="eyebrow-rule" style={{ margin: '0 auto 1rem' }} />
          <span className="eyebrow">{eyebrow}</span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              color: 'var(--navy-900)',
              marginBottom: '1rem',
            }}
          >
            {title}
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.6 }}>
            {subtitle}
          </p>
        </div>

        {/* Desktop Interactive Layout (Hidden below 992px) */}
        <div className="policy-anatomy-desktop">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.25fr 1fr',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            {/* Left 3 Callout Nodes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {nodes.slice(0, 3).map((node) => {
                const isActive = activeNodeId === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => handleSelectNode(node.id)}
                    className={`anatomy-node-btn ${isActive ? 'active' : ''}`}
                    style={{
                      background: isActive ? 'var(--navy-900)' : 'var(--white)',
                      color: isActive ? 'var(--white)' : 'var(--navy-900)',
                      border: isActive
                        ? '1.5px solid var(--red-500)'
                        : '1px solid rgba(215, 217, 220, 0.6)',
                      borderRadius: '20px',
                      padding: '1.25rem 1.5rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      boxShadow: isActive ? 'var(--shadow-hover)' : 'var(--shadow-soft)',
                      transition: 'all 0.24s ease',
                      position: 'relative',
                    }}
                    aria-selected={isActive}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <span
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: isActive ? 'var(--red-500)' : 'var(--silver-200)',
                          color: isActive ? 'var(--white)' : 'var(--navy-800)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {node.number}
                      </span>
                      <strong style={{ fontSize: '1.02rem' }}>{node.title}</strong>
                    </div>
                    <p
                      style={{
                        fontSize: '0.82rem',
                        color: isActive ? 'var(--silver-300)' : 'var(--muted)',
                        margin: 0,
                        lineHeight: 1.45,
                      }}
                    >
                      {node.shortExplanation}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Center: Stylised Policy Card Mockup */}
            <div
              className="policy-card-mockup"
              style={{
                background: 'linear-gradient(145deg, #FFFFFF 0%, #F5F7FA 100%)',
                borderRadius: '28px',
                border: '1.5px solid rgba(18, 61, 103, 0.15)',
                boxShadow: '0 24px 48px rgba(10, 37, 64, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.8)',
                padding: '2rem',
                position: 'relative',
                minHeight: '440px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Header of Mockup Card */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(215, 217, 220, 0.5)',
                    paddingBottom: '1rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--red-500)' }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--navy-900)', letterSpacing: '0.04em' }}>
                      SCHEDULE OF INSURANCE
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      color: 'var(--silver-500)',
                      textTransform: 'uppercase',
                      background: 'var(--silver-200)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 600,
                    }}
                  >
                    Sample layout
                  </span>
                </div>

                {/* Skeleton Document Bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* IDV Section */}
                  <div
                    style={{
                      padding: '0.75rem',
                      borderRadius: '12px',
                      background: activeNodeId === 'idv' ? 'rgba(233, 35, 50, 0.08)' : 'rgba(18, 61, 103, 0.03)',
                      border: activeNodeId === 'idv' ? '1.5px solid var(--red-500)' : '1px solid transparent',
                      transition: 'all 0.24s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <div style={{ width: '40%', height: '8px', background: 'var(--navy-300)', borderRadius: '4px' }} />
                      <div style={{ width: '25%', height: '8px', background: activeNodeId === 'idv' ? 'var(--red-500)' : 'var(--silver-400)', borderRadius: '4px' }} />
                    </div>
                    <div style={{ width: '70%', height: '6px', background: 'var(--silver-300)', borderRadius: '3px' }} />
                  </div>

                  {/* Deductibles Section */}
                  <div
                    style={{
                      padding: '0.75rem',
                      borderRadius: '12px',
                      background: activeNodeId === 'deductibles' ? 'rgba(233, 35, 50, 0.08)' : 'rgba(18, 61, 103, 0.03)',
                      border: activeNodeId === 'deductibles' ? '1.5px solid var(--red-500)' : '1px solid transparent',
                      transition: 'all 0.24s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <div style={{ width: '45%', height: '8px', background: 'var(--navy-300)', borderRadius: '4px' }} />
                      <div style={{ width: '20%', height: '8px', background: activeNodeId === 'deductibles' ? 'var(--red-500)' : 'var(--silver-400)', borderRadius: '4px' }} />
                    </div>
                    <div style={{ width: '60%', height: '6px', background: 'var(--silver-300)', borderRadius: '3px' }} />
                  </div>

                  {/* Add-ons Section */}
                  <div
                    style={{
                      padding: '0.75rem',
                      borderRadius: '12px',
                      background: activeNodeId === 'addons' ? 'rgba(233, 35, 50, 0.08)' : 'rgba(18, 61, 103, 0.03)',
                      border: activeNodeId === 'addons' ? '1.5px solid var(--red-500)' : '1px solid transparent',
                      transition: 'all 0.24s ease',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ width: '30%', height: '14px', background: activeNodeId === 'addons' ? 'rgba(233, 35, 50, 0.2)' : 'var(--silver-200)', borderRadius: '4px' }} />
                      <div style={{ width: '30%', height: '14px', background: activeNodeId === 'addons' ? 'rgba(233, 35, 50, 0.2)' : 'var(--silver-200)', borderRadius: '4px' }} />
                    </div>
                    <div style={{ width: '80%', height: '6px', background: 'var(--silver-300)', borderRadius: '3px' }} />
                  </div>

                  {/* Exclusions Section */}
                  <div
                    style={{
                      padding: '0.75rem',
                      borderRadius: '12px',
                      background: activeNodeId === 'exclusions' ? 'rgba(233, 35, 50, 0.08)' : 'rgba(18, 61, 103, 0.03)',
                      border: activeNodeId === 'exclusions' ? '1.5px solid var(--red-500)' : '1px solid transparent',
                      transition: 'all 0.24s ease',
                    }}
                  >
                    <div style={{ width: '35%', height: '8px', background: 'var(--navy-300)', borderRadius: '4px', marginBottom: '0.35rem' }} />
                    <div style={{ width: '90%', height: '6px', background: 'var(--silver-300)', borderRadius: '3px', marginBottom: '0.25rem' }} />
                    <div style={{ width: '65%', height: '6px', background: 'var(--silver-300)', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>

              {/* Active Highlight Banner inside card */}
              <div
                style={{
                  background: 'var(--navy-900)',
                  borderRadius: '16px',
                  padding: '1rem',
                  color: 'var(--white)',
                  marginTop: '1.25rem',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ color: 'var(--red-400)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                  Inspecting: {activeNode.title}
                </div>
                <div style={{ color: 'var(--silver-200)', lineHeight: 1.45 }}>
                  {activeNode.mockupHighlight}
                </div>
              </div>
            </div>

            {/* Right 3 Callout Nodes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {nodes.slice(3, 6).map((node) => {
                const isActive = activeNodeId === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => handleSelectNode(node.id)}
                    className={`anatomy-node-btn ${isActive ? 'active' : ''}`}
                    style={{
                      background: isActive ? 'var(--navy-900)' : 'var(--white)',
                      color: isActive ? 'var(--white)' : 'var(--navy-900)',
                      border: isActive
                        ? '1.5px solid var(--red-500)'
                        : '1px solid rgba(215, 217, 220, 0.6)',
                      borderRadius: '20px',
                      padding: '1.25rem 1.5rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      boxShadow: isActive ? 'var(--shadow-hover)' : 'var(--shadow-soft)',
                      transition: 'all 0.24s ease',
                      position: 'relative',
                    }}
                    aria-selected={isActive}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <span
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: isActive ? 'var(--red-500)' : 'var(--silver-200)',
                          color: isActive ? 'var(--white)' : 'var(--navy-800)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {node.number}
                      </span>
                      <strong style={{ fontSize: '1.02rem' }}>{node.title}</strong>
                    </div>
                    <p
                      style={{
                        fontSize: '0.82rem',
                        color: isActive ? 'var(--silver-300)' : 'var(--muted)',
                        margin: 0,
                        lineHeight: 1.45,
                      }}
                    >
                      {node.shortExplanation}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Side / Bottom Explanation Box */}
          <div
            style={{
              marginTop: '2.5rem',
              padding: '1.5rem 2rem',
              borderRadius: '20px',
              backgroundColor: 'var(--silver-100)',
              border: '1px solid var(--silver-300)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>💡</span>
              <div>
                <strong style={{ color: 'var(--navy-900)', fontSize: '0.98rem', display: 'block', marginBottom: '0.2rem' }}>
                  Advisor Guidance on {activeNode.title}:
                </strong>
                <span style={{ color: 'var(--ink)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {activeNode.detailedText}
                </span>
              </div>
            </div>
            <a
              href="#enquiry"
              onClick={(e) => {
                if (onEnquiryClick) {
                  e.preventDefault();
                  onEnquiryClick();
                }
              }}
              className="btn btn-primary btn-sm"
              style={{ whiteSpace: 'nowrap' }}
            >
              Ask Advisor &rarr;
            </a>
          </div>
        </div>

        {/* Mobile Accordion List Fallback (< 992px or reduced-motion) */}
        <div className="policy-anatomy-mobile">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {nodes.map((node) => {
              const isOpen = activeNodeId === node.id;
              return (
                <div
                  key={node.id}
                  style={{
                    background: 'var(--white)',
                    borderRadius: '18px',
                    border: isOpen ? '1.5px solid var(--red-500)' : '1px solid var(--silver-300)',
                    padding: '1.25rem',
                    boxShadow: 'var(--shadow-soft)',
                  }}
                  onClick={() => setActiveNodeId(isOpen ? '' : node.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: isOpen ? 'var(--red-500)' : 'var(--navy-100)',
                          color: isOpen ? 'var(--white)' : 'var(--navy-800)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                        }}
                      >
                        {node.number}
                      </span>
                      <strong style={{ fontSize: '0.98rem', color: 'var(--navy-900)' }}>
                        {node.title}
                      </strong>
                    </div>
                    <span style={{ fontSize: '1.2rem', color: 'var(--navy-700)' }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </div>

                  {isOpen && (
                    <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--silver-300)' }}>
                      <p style={{ fontSize: '0.88rem', color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 0.5rem 0' }}>
                        {node.shortExplanation}
                      </p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0, fontStyle: 'italic' }}>
                        {node.detailedText}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
