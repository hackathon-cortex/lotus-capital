import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LotusLogo } from '../common/LotusLogo';

export interface StackDeckCard {
  id: string;
  slug: 'general-insurance' | 'life-insurance' | 'health-insurance' | 'mutual-funds' | 'equity' | 'other-solutions';
  numeral: string;
  title: string;
  descriptor: string;
  dataChip: string;
  path: string;
  icon: React.ReactNode;
}

export const SERVICES_DECK_CARDS: StackDeckCard[] = [
  {
    id: 'general-insurance',
    slug: 'general-insurance',
    numeral: '01',
    title: 'General Insurance',
    descriptor: 'Understand cover for your vehicle, property and business.',
    dataChip: '140+ motor policies',
    path: '/services/general-insurance',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <line x1="7" y1="8" x2="17" y2="8" />
        <line x1="7" y1="12" x2="13" y2="12" />
        <line x1="7" y1="16" x2="11" y2="16" />
      </svg>
    ),
  },
  {
    id: 'life-insurance',
    slug: 'life-insurance',
    numeral: '02',
    title: 'Life Insurance',
    descriptor: 'Understand life cover options and policy features.',
    dataChip: '180+ life policies',
    path: '/services/life-insurance',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      </svg>
    ),
  },
  {
    id: 'health-insurance',
    slug: 'health-insurance',
    numeral: '03',
    title: 'Health Insurance',
    descriptor: 'Compare features, exclusions, waiting periods and claims process.',
    dataChip: '250+ health policies',
    path: '/services/health-insurance',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    id: 'mutual-funds',
    slug: 'mutual-funds',
    numeral: '04',
    title: 'Mutual Funds',
    descriptor: 'Learn about fund categories, time horizons, costs and market risk.',
    dataChip: '1,200+ mutual fund folios',
    path: '/investments/mutual-funds',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    id: 'equity',
    slug: 'equity',
    numeral: '05',
    title: 'Equity & Investments',
    descriptor: 'Understand demat, trading and IPO access, and equity market risk.',
    dataChip: '800+ demat accounts',
    path: '/investments/equity',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: 'other-solutions',
    slug: 'other-solutions',
    numeral: '06',
    title: 'More Solutions',
    descriptor: 'Ask about fixed deposits, bonds, NPS and related services.',
    dataChip: '₹50 lakh+ in corporate FDs',
    path: '/investments/other-solutions',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 7v2" />
        <path d="M12 15v2" />
      </svg>
    ),
  },
];

export interface ServicesStackedDeckProps {
  id?: string;
  onSelectService?: (serviceSlug: string) => void;
}

export const ServicesStackedDeck: React.FC<ServicesStackedDeckProps> = ({
  id = 'services',
  onSelectService,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const idx = new URLSearchParams(window.location.search).get('deckIndex');
      if (idx !== null) return parseInt(idx, 10);
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
        Math.floor(progress * SERVICES_DECK_CARDS.length),
        SERVICES_DECK_CARDS.length - 1
      );
      setActiveCardIndex(index);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleConsultation = (slug: string) => {
    if (onSelectService) {
      onSelectService(slug);
    } else {
      const el = document.getElementById('enquiry');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Ring coordinates for 6 dots around a radius 46 circle (center 70, 70)
  const dialRadius = 46;
  const dialCenter = 70;
  const dialPoints = SERVICES_DECK_CARDS.map((_, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    return {
      x: dialCenter + dialRadius * Math.cos(angle),
      y: dialCenter + dialRadius * Math.sin(angle),
    };
  });

  return (
    <section
      id={id}
      className="services-deck-section gi-stacked-section"
      style={{
        position: 'relative',
        zIndex: 12,
        marginTop: '-36px',
        borderTopLeftRadius: '36px',
        borderTopRightRadius: '36px',
        backgroundColor: 'var(--silver-100, #f8f9fa)',
        boxShadow: '0 -10px 40px rgba(10,37,64,0.06)',
        padding: '5rem 0',
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 1fr) minmax(360px, 1.45fr)',
            gap: '3.5rem',
            alignItems: 'start',
          }}
          className="services-deck-layout"
        >
          {/* Left Column: Sticky Heading & Lotus-Ring Progress Dial */}
          <div
            className="services-deck-intro"
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
              OUR SERVICES
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
              Six ways we <span style={{ fontStyle: 'italic', color: 'var(--navy-900, #123D67)' }}>can help.</span>
            </h2>

            <p
              style={{
                fontSize: '1.02rem',
                color: 'var(--ink, #1f2933)',
                lineHeight: 1.65,
                marginBottom: '2rem',
              }}
            >
              Different financial instruments serve distinct wealth protection and investment goals. Features, costs and risks depend on the product and the provider.
            </p>

            {/* Lotus-Ring Progress Dial */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                marginBottom: '2rem',
                padding: '1rem 1.25rem',
                borderRadius: '20px',
                backgroundColor: 'var(--white, #ffffff)',
                border: '1px solid var(--silver-300, #d7d9dc)',
                boxShadow: '0 4px 16px rgba(10, 37, 64, 0.04)',
              }}
            >
              <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
                <svg width="90" height="90" viewBox="0 0 140 140">
                  {/* Orbit Track */}
                  <circle
                    cx="70"
                    cy="70"
                    r="46"
                    fill="none"
                    stroke="var(--silver-300, #d7d9dc)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  {/* 6 Peripheral Dots */}
                  {dialPoints.map((pt, idx) => {
                    const isActive = idx === activeCardIndex;
                    return (
                      <g key={idx}>
                        {isActive && (
                          <circle cx={pt.x} cy={pt.y} r="12" fill="rgba(233, 35, 50, 0.2)" />
                        )}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isActive ? '6' : '4.5'}
                          fill={isActive ? 'var(--red-500, #d9232d)' : 'var(--navy-700, #123D67)'}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          style={{ transition: 'all 0.25s ease' }}
                        />
                      </g>
                    );
                  })}
                </svg>
                {/* Center Lotus Logo */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <LotusLogo variant="dark" height={16} width="auto" />
                </div>
              </div>

              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--navy-700, #0d2b4a)',
                    fontWeight: 700,
                    display: 'block',
                  }}
                >
                  Active Practice Area
                </span>
                <span style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--navy-950, #051329)' }}>
                  {SERVICES_DECK_CARDS[activeCardIndex].title}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--ink, #1f2933)', display: 'block', marginTop: '0.2rem' }}>
                  Card {activeCardIndex + 1} of 6 &bull; Figures as of October 2026
                </span>
              </div>
            </div>

            {/* Vertical Pill Jumper Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {SERVICES_DECK_CARDS.map((card, idx) => {
                const isActive = idx === activeCardIndex;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setActiveCardIndex(idx)}
                    style={{
                      outline: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      background: 'none',
                      border: 'none',
                      padding: '0.25rem 0',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: isActive ? 'var(--navy-900, #123D67)' : 'var(--silver-300, #cbd5e1)',
                        transition: 'all 0.2s ease',
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
                      {card.numeral}. {card.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: 6 Stacked Deck Cards */}
          <div
            ref={containerRef}
            className="services-deck-cards-container"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              minHeight: '1100px',
            }}
          >
            {SERVICES_DECK_CARDS.map((card, index) => {
              const isCurrent = index === activeCardIndex;
              const isPassed = index < activeCardIndex;
              const topOffset = 110 + index * 24;
              const isOddCard = index % 2 === 0; // 0, 2, 4 -> Navy card; 1, 3, 5 -> White card
              const tiltDegree = isCurrent ? 0 : index % 2 === 0 ? 2 : -2;

              return (
                <div
                  key={card.id}
                  className="services-deck-card"
                  style={{
                    position: 'sticky',
                    top: `${topOffset}px`,
                    maxHeight: '260px',
                    backgroundColor: isOddCard ? 'transparent' : '#ffffff',
                    backgroundImage: isOddCard
                      ? 'linear-gradient(135deg, #071b30 0%, #0a2540 60%, #123d67 100%)'
                      : 'none',
                    borderRadius: '24px',
                    border: isOddCard
                      ? '1px solid rgba(215, 217, 220, 0.22)'
                      : '1.5px solid var(--silver-300, #d7d9dc)',
                    padding: '1.75rem 2rem',
                    boxShadow: isCurrent
                      ? '0 16px 36px rgba(10, 37, 64, 0.12), 0 4px 12px rgba(10, 37, 64, 0.04)'
                      : '0 4px 16px rgba(10, 37, 64, 0.04)',
                    transform: isPassed
                      ? 'scale(0.95)'
                      : `rotate(${tiltDegree}deg)`,
                    opacity: isPassed ? 0.7 : 1,
                    transition:
                      'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease, border-color 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    positionAnchor: 'relative' as any,
                    overflow: 'hidden',
                  }}
                >
                  {/* Faint Background Numeral Watermark */}
                  <div
                    style={{
                      position: 'absolute',
                      right: '1.75rem',
                      top: '0.5rem',
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '5.2rem',
                      fontWeight: 800,
                      color: isOddCard ? '#ffffff' : 'var(--navy-900, #0a2540)',
                      opacity: isOddCard ? 0.07 : 0.05,
                      lineHeight: 1,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    {card.numeral}
                  </div>

                  <div>
                    {/* Header Row: Icon, Title, and Verified Data Chip */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.85rem',
                        position: 'relative',
                        zIndex: 2,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            backgroundColor: isOddCard
                              ? 'rgba(255, 255, 255, 0.12)'
                              : 'var(--navy-100, #eaf1f8)',
                            color: isOddCard ? '#ffffff' : 'var(--navy-900, #123D67)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {card.icon}
                        </div>
                        <h3
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: isOddCard ? '#ffffff' : 'var(--navy-950, #051329)',
                            margin: 0,
                          }}
                        >
                          {card.title}
                        </h3>
                      </div>

                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '9999px',
                          backgroundColor: isOddCard
                            ? 'rgba(255, 255, 255, 0.12)'
                            : 'var(--navy-100, #eaf1f8)',
                          color: isOddCard ? '#ffffff' : 'var(--navy-900, #123D67)',
                          border: isOddCard
                            ? '1px solid rgba(215, 217, 220, 0.25)'
                            : '1px solid rgba(18, 61, 103, 0.2)',
                        }}
                      >
                        {card.dataChip}
                      </span>
                    </div>

                    {/* Descriptor */}
                    <p
                      style={{
                        fontSize: '0.92rem',
                        color: isOddCard
                          ? 'var(--silver-200, #e9ecef)'
                          : 'var(--ink, #1f2933)',
                        lineHeight: 1.55,
                        margin: '0 0 1rem',
                        maxWidth: '540px',
                        position: 'relative',
                        zIndex: 2,
                      }}
                    >
                      {card.descriptor}
                    </p>
                  </div>

                  {/* Actions Row: Guide Link + Consultation Pill */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '0.75rem',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    <Link
                      to={card.path}
                      style={{
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        color: isOddCard ? '#ffffff' : 'var(--navy-900, #123D67)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = 'var(--red-500, #d9232d)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = isOddCard ? '#ffffff' : 'var(--navy-900, #123D67)')
                      }
                    >
                      <span>View service guide</span>
                      <span>&rarr;</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleConsultation(card.slug)}
                      style={{
                        outline: 'none',
                        cursor: 'pointer',
                        padding: '0.45rem 1.05rem',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: 'var(--red-500, #d9232d)',
                        color: '#ffffff',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(217, 35, 45, 0.3)',
                        transition: 'all 0.2s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--red-600, #b91c1c)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--red-500, #d9232d)';
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      <span>Request consultation</span>
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

