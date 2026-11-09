import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCountUp } from '../../hooks/useCountUp';

export interface ServiceLineupItem {
  id: string;
  slug: string;
  name: string;
  shortLabel: string;
  path: string;
  descriptor: string;
  statText?: string;
}

export const SERVICES_LINEUP: ServiceLineupItem[] = [
  {
    id: 'general-insurance',
    slug: 'general-insurance',
    name: 'General Insurance',
    shortLabel: 'General',
    path: '/services/general-insurance',
    descriptor: 'Understand cover for your vehicle, property and business.',
    statText: '140+ motor policies',
  },
  {
    id: 'life-insurance',
    slug: 'life-insurance',
    name: 'Life Insurance',
    shortLabel: 'Life',
    path: '/services/life-insurance',
    descriptor: 'Understand life cover options and policy features.',
    statText: '180+ life policies',
  },
  {
    id: 'health-insurance',
    slug: 'health-insurance',
    name: 'Health Insurance',
    shortLabel: 'Health',
    path: '/services/health-insurance',
    descriptor: 'Compare features, exclusions, waiting periods and claims process.',
    statText: '250+ health policies',
  },
  {
    id: 'mutual-funds',
    slug: 'mutual-funds',
    name: 'Mutual Funds',
    shortLabel: 'Mutual Funds',
    path: '/investments/mutual-funds',
    descriptor: 'Learn about fund categories, time horizons, costs and market risk.',
    statText: '1,200+ mutual fund folios',
  },
  {
    id: 'equity',
    slug: 'equity',
    name: 'Equity & Investments',
    shortLabel: 'Equity',
    path: '/investments/equity',
    descriptor: 'Understand demat, trading and IPO access, and equity market risk.',
    statText: '800+ demat accounts',
  },
  {
    id: 'other-solutions',
    slug: 'other-solutions',
    name: 'More Solutions',
    shortLabel: 'More Solutions',
    path: '/investments/other-solutions',
    descriptor: 'Ask about fixed deposits, bonds, NPS and related services.',
    statText: '₹50 lakh+ in corporate FDs',
  },
];

export interface VerifiedStatChip {
  id: string;
  value: string;
  label: string;
}

export interface ServicesLineupBoardProps {
  onActionClick?: (targetId: string) => void;
  verifiedStats?: VerifiedStatChip[];
}

export const ServicesLineupBoard: React.FC<ServicesLineupBoardProps> = ({
  onActionClick,
  verifiedStats = [
    { id: 'insurance_total', value: '570+', label: 'Insurance policies' },
    { id: 'mf_folios', value: '1,200+', label: 'MF folios' },
    { id: 'demat', value: '800+', label: 'Demat accounts' },
    { id: 'clients', value: '2,500+', label: 'Clients serviced' },
  ],
}) => {
  const animatedCount = useCountUp(SERVICES_LINEUP.length, 1600);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const s = new URLSearchParams(window.location.search).get('service');
      if (s && SERVICES_LINEUP.some((item) => item.slug === s)) return s;
    }
    return SERVICES_LINEUP[0].slug;
  });

  const activeService =
    SERVICES_LINEUP.find((s) => s.slug === selectedServiceId) || SERVICES_LINEUP[0];

  const handleLinkClick = (targetId: string, e: React.MouseEvent) => {
    if (onActionClick) {
      e.preventDefault();
      onActionClick(targetId);
    }
  };

  return (
    <div
      className="services-lineup-board"
      style={{
        background:
          'linear-gradient(145deg, rgba(10, 37, 64, 0.95) 0%, rgba(18, 61, 103, 0.90) 55%, rgba(10, 37, 64, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '32px',
        border: '1.5px solid rgba(215, 217, 220, 0.22)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
        padding: '2.25rem 2rem',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff',
      }}
    >
      {/* Subtle Shimmer Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '-40%',
          right: '-40%',
          width: '180%',
          height: '180%',
          background:
            'radial-gradient(ellipse at 70% 30%, rgba(18, 61, 103, 0.35) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Row: Giant Count-Up of Services + Verified caption */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.65rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
            <span
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2.5rem, 4vw, 3.25rem)',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1,
              }}
            >
              0{animatedCount}
            </span>
            <span
              style={{
                fontSize: '0.88rem',
                color: 'var(--silver-200, #e9ecef)',
                fontWeight: 600,
              }}
            >
              service areas
            </span>
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              color: 'rgba(235, 240, 245, 0.9)',
              marginTop: '0.35rem',
            }}
          >
            comprehensive portfolio solutions &bull; Figures as of October 2026
          </div>
        </div>

        {/* Action Link: Scroll to Deck */}
        <a
          href="#services"
          onClick={(e) => handleLinkClick('services', e)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(215, 217, 220, 0.25)',
            color: 'var(--silver-200, #e9ecef)',
            fontSize: '0.74rem',
            fontWeight: 600,
            textDecoration: 'none',
            backdropFilter: 'blur(6px)',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')
          }
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--red-500, #d9232d)',
            }}
          />
          <span>Explore lineup &darr;</span>
        </a>
      </div>

      {/* Segmented 6-Tile Selector */}
      <div style={{ marginBottom: '1.65rem', position: 'relative', zIndex: 2 }}>
        <div
          style={{
            fontSize: '0.76rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--silver-200, #e9ecef)',
            marginBottom: '0.5rem',
            fontWeight: 600,
          }}
        >
          Select a Practice Area
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.4rem',
            backgroundColor: 'rgba(0, 0, 0, 0.28)',
            padding: '0.4rem',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {SERVICES_LINEUP.map((s) => {
            const isSelected = selectedServiceId === s.slug;
            return (
              <button
                key={s.slug}
                type="button"
                onClick={() => setSelectedServiceId(s.slug)}
                style={{
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '0.45rem 0.5rem',
                  borderRadius: '10px',
                  fontSize: '0.74rem',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected
                    ? 'var(--navy-900, #0a2540)'
                    : 'transparent',
                  color: isSelected ? '#ffffff' : 'var(--silver-200, #e9ecef)',
                  boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                  border: isSelected
                    ? '1px solid rgba(215, 217, 220, 0.55)'
                    : '1px solid transparent',
                  textAlign: 'center',
                  transition: 'all 0.18s ease',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {s.shortLabel}
              </button>
            );
          })}
        </div>

        {/* Crossfading 1-line educational description + Open guide link */}
        <div
          key={activeService.slug}
          style={{
            marginTop: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
            borderLeft: '3px solid var(--red-500, #d9232d)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.75rem',
            animation: 'fadeIn 0.25s ease-out forwards',
          }}
        >
          <div style={{ fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--silver-200, #e9ecef)' }}>
            <span style={{ fontWeight: 700, color: '#ffffff' }}>{activeService.name}: </span>
            {activeService.descriptor}
          </div>
          <Link
            to={activeService.path}
            style={{
              flexShrink: 0,
              fontSize: '0.76rem',
              fontWeight: 700,
              color: '#ffffff',
              textDecoration: 'none',
              padding: '0.25rem 0.6rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(215, 217, 220, 0.3)',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')
            }
          >
            Open &rarr;
          </Link>
        </div>
      </div>

      {/* Feature (c): Compact Verified Figures Row */}
      <div
        style={{
          backgroundColor: 'rgba(10, 37, 64, 0.65)',
          borderRadius: '20px',
          border: '1px solid rgba(215, 217, 220, 0.14)',
          padding: '1rem 1.15rem',
          marginBottom: '1.65rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.65rem',
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--silver-200, #e9ecef)',
              fontWeight: 700,
            }}
          >
            Verified Client Servicing Reach
          </span>
          <span
            style={{
              fontSize: '0.68rem',
              color: 'rgba(235, 240, 245, 0.85)',
              fontWeight: 600,
            }}
          >
            Figures as of October 2026
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.4rem',
            textAlign: 'center',
          }}
        >
          {verifiedStats.map((stat) => (
            <div
              key={stat.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '0.45rem 0.25rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '0.66rem',
                  color: 'var(--silver-200, #e9ecef)',
                  marginTop: '0.15rem',
                  lineHeight: 1.2,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature (d): 3 Interactive Quick Actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.65rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <a
          href="#services"
          onClick={(e) => handleLinkClick('services', e)}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
            borderRadius: '16px',
            padding: '0.75rem 0.6rem',
            textAlign: 'center',
            textDecoration: 'none',
            color: '#ffffff',
            border: '1px solid rgba(215, 217, 220, 0.15)',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.2rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.14)';
            e.currentTarget.style.borderColor = 'rgba(215, 217, 220, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)';
            e.currentTarget.style.borderColor = 'rgba(215, 217, 220, 0.15)';
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--silver-200, #e9ecef)', fontWeight: 600 }}>
            01. Catalog
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, lineHeight: 1.2 }}>
            Explore services
          </span>
        </a>

        <a
          href="#services"
          onClick={(e) => handleLinkClick('services', e)}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
            borderRadius: '16px',
            padding: '0.75rem 0.6rem',
            textAlign: 'center',
            textDecoration: 'none',
            color: '#ffffff',
            border: '1px solid rgba(215, 217, 220, 0.15)',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.2rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.14)';
            e.currentTarget.style.borderColor = 'rgba(215, 217, 220, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)';
            e.currentTarget.style.borderColor = 'rgba(215, 217, 220, 0.15)';
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--silver-200, #e9ecef)', fontWeight: 600 }}>
            02. Method
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, lineHeight: 1.2 }}>
            Compare approaches
          </span>
        </a>

        <a
          href="#enquiry"
          onClick={(e) => handleLinkClick('enquiry', e)}
          style={{
            backgroundColor: 'var(--red-500, #d9232d)',
            borderRadius: '16px',
            padding: '0.75rem 0.6rem',
            textAlign: 'center',
            textDecoration: 'none',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 14px rgba(217, 35, 45, 0.35)',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.2rem',
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
          <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 600 }}>
            03. Advisor
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, lineHeight: 1.2 }}>
            Speak with our team &rarr;
          </span>
        </a>
      </div>

      {/* Feature (e): Mandatory Neutral Label */}
      <div
        style={{
          marginTop: '1rem',
          fontSize: '0.7rem',
          color: 'rgba(235, 240, 245, 0.75)',
          textAlign: 'right',
          fontStyle: 'italic',
        }}
      >
        Illustration only. Not advice or a recommendation.
      </div>
    </div>
  );
};

