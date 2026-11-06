import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export interface EquityServiceDef {
  id: string;
  chipId: string;
  title: string;
  subtitle: string;
  shortDesc: string;
  details: string;
  offered: boolean;
  ctaText: string;
  ctaTarget: string; // '#enquiry' or '/insights'
  iconType: 'demat' | 'trading' | 'ipo' | 'portfolio' | 'education';
}

const RAW_SERVICES: EquityServiceDef[] = [
  {
    id: 'demat-opening',
    chipId: 'demat-account',
    title: 'Demat & Trading Account Opening',
    subtitle: 'Account Origination',
    shortDesc: 'We help you begin the account-opening process through our broking partner.',
    details:
      'Guidance through the documentation and KYC verification process required by Religare Broking Limited to open electronic demat and secondary market trading facilities.',
    offered: true,
    ctaText: 'Ask us about this →',
    ctaTarget: '#enquiry',
    iconType: 'demat',
  },
  {
    id: 'equity-trading',
    chipId: 'equity-trading',
    title: 'Equity & Commodity Trading Access',
    subtitle: 'Secondary Markets',
    shortDesc: 'Execution access across stock exchanges facilitated through Religare Broking Limited.',
    details:
      'Direct order placement channels for cash delivery equities and commodity contracts on NSE and BSE through our broking partner’s trade infrastructure.',
    offered: true,
    ctaText: 'Ask us about this →',
    ctaTarget: '#enquiry',
    iconType: 'trading',
  },
  {
    id: 'ipo-applications',
    chipId: 'ipo-applications',
    title: 'IPO Applications',
    subtitle: 'Primary Market Issues',
    shortDesc: 'Assistance with primary public offerings and ASBA application procedures.',
    details:
      'Timely notifications and application support for mainline and SME initial public offerings using bank ASBA and UPI mandates, with clear risk understanding.',
    offered: true,
    ctaText: 'Ask us about this →',
    ctaTarget: '#enquiry',
    iconType: 'ipo',
  },
  {
    id: 'portfolio-review',
    chipId: 'portfolio-review',
    title: 'Portfolio Review or Reporting',
    subtitle: 'Advisory Reporting',
    shortDesc: 'Periodic portfolio consolidation and review statements.',
    details: 'Customised portfolio holding statements and allocation reviews.',
    offered: false, // Hidden unless offered: true per 08-equity.md and prompt requirements
    ctaText: 'Ask us about this →',
    ctaTarget: '#enquiry',
    iconType: 'portfolio',
  },
  {
    id: 'market-education',
    chipId: 'market-education',
    title: 'Market Education',
    subtitle: 'Investor Orientation',
    shortDesc: 'Educational orientation on market mechanisms, settlement cycles, and risk.',
    details:
      'Objective learning materials covering T+1 settlement cycles, order types, circuit limits, and capital preservation fundamentals before initiating trades.',
    offered: true,
    ctaText: 'Explore insights →',
    ctaTarget: '/insights',
    iconType: 'education',
  },
];

interface EquityServicesStageProps {
  onServiceSelect?: (chipId: string) => void;
}

export const EquityServicesStage: React.FC<EquityServicesStageProps> = ({ onServiceSelect }) => {
  // Filter offered services only
  const services = RAW_SERVICES.filter((s) => s.offered);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [isCrossfading, setIsCrossfading] = useState<boolean>(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Auto-advance once on first view then stop
  useEffect(() => {
    if (hasInteracted) return;

    let observer: IntersectionObserver | null = null;
    let autoAdvanceInterval: NodeJS.Timeout | null = null;

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window && stageRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && !hasInteracted && !autoAdvanceInterval) {
            autoAdvanceInterval = setInterval(() => {
              setActiveTab((prev) => {
                const next = prev + 1;
                if (next >= services.length) {
                  clearInterval(autoAdvanceInterval!);
                  setHasInteracted(true);
                  return prev;
                }
                return next;
              });
            }, 3600);
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(stageRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
      if (autoAdvanceInterval) clearInterval(autoAdvanceInterval);
    };
  }, [hasInteracted, services.length]);

  const selectTab = (idx: number) => {
    setHasInteracted(true);
    if (idx === activeTab) return;
    setIsCrossfading(true);
    setTimeout(() => {
      setActiveTab(idx);
      setIsCrossfading(false);
    }, 160);
  };

  const handleCtaClick = (e: React.MouseEvent, service: EquityServiceDef) => {
    if (service.ctaTarget.startsWith('#')) {
      e.preventDefault();
      if (onServiceSelect) {
        onServiceSelect(service.chipId);
      }
      const el = document.getElementById(service.ctaTarget.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const current = services[activeTab] || services[0];

  return (
    <section
      id="services"
      ref={stageRef}
      data-tone="dark"
      className="equity-services-stage-section stacked-section"
      style={{
        backgroundColor: 'var(--navy-900, #0A2540)',
        padding: '5rem 1.5rem',
        position: 'relative',
        color: '#FFFFFF',
      }}
    >
      <div className="container" style={{ maxWidth: '1240px' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
          <span
            className="eyebrow"
            style={{
              color: '#8FA3C8',
              letterSpacing: '0.12em',
              fontSize: '0.82rem',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            SERVICE SCOPE
          </span>
          <h2
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(2rem, 3.4vw, 2.85rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              margin: '0.5rem 0 1rem',
            }}
          >
            What you can do with us
          </h2>
          <p
            style={{
              color: '#D7D9DC',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Authorised Person facilities connecting individual and institutional clients in Godhra to secondary market execution and IPO channels.
          </p>
        </div>

        {/* Market Floor Stage Frame */}
        <div
          className="equity-market-floor"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 360px) 1fr',
            gap: '2rem',
            backgroundColor: 'rgba(10, 37, 64, 0.65)',
            border: '1px solid rgba(143, 163, 200, 0.22)',
            borderRadius: '28px',
            padding: '2rem',
            boxShadow: '0 20px 48px rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Left Vertical Tab List */}
          <div
            className="equity-tabs-sidebar"
            role="tablist"
            aria-label="Equity services available"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              position: 'relative',
            }}
          >
            {services.map((svc, idx) => {
              const isActive = idx === activeTab;
              return (
                <button
                  key={svc.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`equity-tabpanel-${svc.id}`}
                  id={`equity-tab-${svc.id}`}
                  onClick={() => selectTab(idx)}
                  className={`equity-tab-item ${isActive ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: isActive ? 'rgba(79, 95, 176, 0.65)' : 'transparent',
                    backgroundColor: isActive ? 'rgba(79, 95, 176, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                    color: isActive ? '#FFFFFF' : '#8FA3C8',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    width: '100%',
                  }}
                >
                  {/* Sliding active indicator bar */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '18%',
                        bottom: '18%',
                        width: '4px',
                        borderRadius: '0 4px 4px 0',
                        backgroundColor: '#8FA3C8',
                        boxShadow: '0 0 10px rgba(143, 163, 200, 0.8)',
                      }}
                    />
                  )}

                  {/* Icon */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      backgroundColor: isActive ? 'rgba(79, 95, 176, 0.4)' : 'rgba(18, 61, 103, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: isActive ? '#FFFFFF' : '#8FA3C8',
                    }}
                  >
                    {svc.iconType === 'demat' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <line x1="7" y1="8" x2="17" y2="8" />
                        <line x1="7" y1="12" x2="13" y2="12" />
                      </svg>
                    )}
                    {svc.iconType === 'trading' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                    )}
                    {svc.iconType === 'ipo' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    )}
                    {svc.iconType === 'education' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        color: isActive ? '#FFFFFF' : '#D7D9DC',
                        lineHeight: 1.3,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {svc.title}
                    </div>
                    <div
                      style={{
                        fontSize: '0.74rem',
                        color: isActive ? '#8FA3C8' : '#6A80A0',
                        marginTop: '0.2rem',
                      }}
                    >
                      {svc.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Detail Stage (Crossfading in 320ms) */}
          <div
            id={`equity-tabpanel-${current.id}`}
            role="tabpanel"
            aria-labelledby={`equity-tab-${current.id}`}
            className="equity-stage-detail"
            style={{
              backgroundColor: 'rgba(5, 19, 41, 0.75)',
              borderRadius: '20px',
              border: '1px solid rgba(143, 163, 200, 0.2)',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '340px',
              opacity: isCrossfading ? 0 : 1,
              transform: isCrossfading ? 'translateY(8px)' : 'translateY(0)',
              transition: 'opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div>
              {/* Badge & Number */}
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
                    display: 'inline-block',
                    padding: '0.25rem 0.85rem',
                    backgroundColor: 'rgba(79, 95, 176, 0.25)',
                    border: '1px solid rgba(143, 163, 200, 0.3)',
                    borderRadius: '9999px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    color: '#D7D9DC',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {current.subtitle}
                </span>

                <span
                  style={{
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'rgba(143, 163, 200, 0.4)',
                  }}
                >
                  0{activeTab + 1}
                </span>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: 'clamp(1.5rem, 2.2vw, 1.95rem)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  marginBottom: '1rem',
                  lineHeight: 1.25,
                }}
              >
                {current.title}
              </h3>

              {/* 2-line Description */}
              <p
                style={{
                  color: '#FFFFFF',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  lineHeight: 1.6,
                  marginBottom: '0.85rem',
                }}
              >
                {current.shortDesc}
              </p>

              {/* Detail paragraph */}
              <p
                style={{
                  color: '#8FA3C8',
                  fontSize: '0.94rem',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {current.details}
              </p>
            </div>

            {/* Stage Action Footer */}
            <div
              style={{
                marginTop: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                borderTop: '1px solid rgba(143, 163, 200, 0.15)',
                paddingTop: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.82rem', color: '#8FA3C8' }}>
                Offered via Authorised Person registration with Religare Broking Limited
              </div>

              {current.ctaTarget.startsWith('#') ? (
                <a
                  href={current.ctaTarget}
                  onClick={(e) => handleCtaClick(e, current)}
                  className="equity-stage-action-pill"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.4rem',
                    backgroundColor: '#123D67',
                    border: '1px solid rgba(143, 163, 200, 0.4)',
                    borderRadius: '9999px',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {current.ctaText}
                </a>
              ) : (
                <Link
                  to={current.ctaTarget}
                  className="equity-stage-action-pill"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.4rem',
                    backgroundColor: '#123D67',
                    border: '1px solid rgba(143, 163, 200, 0.4)',
                    borderRadius: '9999px',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {current.ctaText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

