import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCountUp } from '../../hooks/useCountUp';

interface ChoiceStop {
  id: string;
  label: string;
  shortAdvice: string;
  tag: string;
}

const CHOICE_STOPS: ChoiceStop[] = [
  {
    id: 'credit_risk',
    label: 'Issuer & credit risk',
    shortAdvice: 'Check who issues the instrument, their financial track record, and what the offer terms say.',
    tag: 'Creditworthiness',
  },
  {
    id: 'liquidity',
    label: 'Liquidity & lock-in',
    shortAdvice: 'Understand premature withdrawal penalties, maturity dates, and mandatory lock-in horizons.',
    tag: 'Access to Capital',
  },
  {
    id: 'tax',
    label: 'Tax treatment',
    shortAdvice: 'Review applicable income tax slab rates and capital gains rules before allocating funds.',
    tag: 'Net Returns',
  },
];

const SOLUTION_PILLS = [
  {
    id: 'corporate-fd',
    label: 'Corporate fixed deposits',
    desc: 'Term deposits placed with corporate issuers for specified tenures and interest frequencies.',
  },
  {
    id: 'bonds',
    label: 'Bonds & debentures',
    desc: 'Government and corporate debt securities offering scheduled interest coupon structures.',
  },
  {
    id: 'nps',
    label: 'NPS / pension',
    desc: 'Voluntary retirement framework accessed through Religare Broking Limited (Reg: 4199).',
  },
  {
    id: 'mlds',
    label: 'Market-linked debentures',
    desc: 'Structured debt products with returns referenced to an underlying financial index.',
  },
];

export interface OtherSolutionsOptionsBoardProps {
  onActionClick?: (targetId: string) => void;
  fdAumDisplayText?: string;
}

export const OtherSolutionsOptionsBoard: React.FC<OtherSolutionsOptionsBoardProps> = ({
  onActionClick,
  fdAumDisplayText = '₹50 lakh+ in corporate FDs',
}) => {
  const animatedCount = useCountUp(SOLUTION_PILLS.length, 1600);
  const [selectedSolution, setSelectedSolution] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('solution');
      if (p) return p;
    }
    return SOLUTION_PILLS[0].id;
  });

  const [sliderIndex, setSliderIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const s = new URLSearchParams(window.location.search).get('sliderStop');
      if (s !== null) return parseInt(s, 10);
    }
    return 0;
  });

  const [lineDrawn, setLineDrawn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLineDrawn(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const activeChoice = CHOICE_STOPS[sliderIndex];
  const activeSolutionObj =
    SOLUTION_PILLS.find((s) => s.id === selectedSolution) || SOLUTION_PILLS[0];

  const handleLinkClick = (targetId: string, e: React.MouseEvent) => {
    if (onActionClick) {
      e.preventDefault();
      onActionClick(targetId);
    }
  };

  // Curved line path calculations for the slider:
  // Points: (30, 28), (140, 16), (250, 26) on a 280x40 SVG
  const markerX = 35 + sliderIndex * 105;
  const markerY = sliderIndex === 0 ? 27 : sliderIndex === 1 ? 16 : 25;

  return (
    <div
      className="options-board"
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

      {/* Top Header Row: Stat Count-Up + Verified FD AUM */}
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
              Solution Areas
            </span>
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              color: 'rgba(235, 240, 245, 0.9)',
              marginTop: '0.35rem',
            }}
          >
            {fdAumDisplayText ? `${fdAumDisplayText} • ` : ''}Figures as of October 2026
          </div>
        </div>

        {/* Verified Data Layer Stat & Link to Services */}
        <Link
          to="/services"
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
          <span>Explore all services &rarr;</span>
        </Link>
      </div>

      {/* Segmented Pill Control for Solution Areas */}
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
          Explore Complementary Solutions
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.35rem',
            backgroundColor: 'rgba(0, 0, 0, 0.28)',
            padding: '0.35rem',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {SOLUTION_PILLS.map((pill) => {
            const isSelected = selectedSolution === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setSelectedSolution(pill.id)}
                style={{
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '0.38rem 0.75rem',
                  borderRadius: '10px',
                  fontSize: '0.76rem',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected
                    ? 'var(--navy-900, #0a2540)'
                    : 'transparent',
                  color: isSelected ? '#ffffff' : 'var(--silver-200, #e9ecef)',
                  boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                  border: isSelected
                    ? '1px solid rgba(215, 217, 220, 0.55)'
                    : '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Crossfading 1-line educational description */}
        <div
          key={activeSolutionObj.id}
          style={{
            marginTop: '0.65rem',
            padding: '0.65rem 0.85rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
            borderLeft: '3px solid var(--red-500, #d9232d)',
            fontSize: '0.8rem',
            lineHeight: 1.5,
            color: 'var(--silver-200, #e9ecef)',
            animation: 'fadeIn 0.25s ease-out forwards',
          }}
        >
          {activeSolutionObj.desc}
        </div>
      </div>

      {/* Feature (c): "Before You Choose" Slider with 3 Stops */}
      <div
        style={{
          backgroundColor: 'rgba(10, 37, 64, 0.65)',
          borderRadius: '20px',
          border: '1px solid rgba(215, 217, 220, 0.14)',
          padding: '1.25rem 1.35rem',
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
            marginBottom: '0.75rem',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.74rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--silver-200, #e9ecef)',
                fontWeight: 700,
                display: 'block',
              }}
            >
              Essential Due Diligence
            </span>
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>
              Before you choose an option
            </span>
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              padding: '0.22rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontWeight: 600,
              border: '1px solid rgba(215, 217, 220, 0.3)',
            }}
          >
            {activeChoice.tag}
          </span>
        </div>

        {/* 3 Interactive Stop Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.4rem',
            marginBottom: '0.75rem',
          }}
        >
          {CHOICE_STOPS.map((stop, idx) => {
            const isActive = idx === sliderIndex;
            return (
              <button
                key={stop.id}
                type="button"
                onClick={() => setSliderIndex(idx)}
                style={{
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '0.4rem 0.5rem',
                  borderRadius: '10px',
                  fontSize: '0.74rem',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive
                    ? 'rgba(255, 255, 255, 0.16)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: isActive ? '#ffffff' : 'var(--silver-200, #e9ecef)',
                  border: isActive
                    ? '1px solid rgba(215, 217, 220, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                {stop.label}
              </button>
            );
          })}
        </div>

        {/* Curved Track Indicator SVG */}
        <div style={{ position: 'relative', height: '40px', margin: '0.2rem 0' }}>
          <svg width="100%" height="40" viewBox="0 0 280 40" preserveAspectRatio="none">
            {/* Background line track */}
            <path
              d="M 20 28 Q 140 8 260 26"
              fill="none"
              stroke="rgba(215, 217, 220, 0.2)"
              strokeWidth="2.5"
            />
            {/* Active Drawing Line */}
            <path
              d="M 20 28 Q 140 8 260 26"
              fill="none"
              stroke="rgba(215, 217, 220, 0.55)"
              strokeWidth="2.5"
              strokeDasharray="300"
              strokeDashoffset={lineDrawn ? 0 : 300}
              style={{ transition: 'stroke-dashoffset 0.9s ease-out' }}
            />
            {/* Marker Circle */}
            <circle
              cx={markerX}
              cy={markerY}
              r="7"
              fill="var(--red-500, #d9232d)"
              stroke="#ffffff"
              strokeWidth="2"
              style={{
                transition: 'cx 0.35s cubic-bezier(0.22, 1, 0.36, 1), cy 0.35s ease',
                filter: 'drop-shadow(0 0 8px rgba(217, 35, 45, 0.75))',
              }}
            />
          </svg>
        </div>

        {/* Dynamic Focus Guidance Line */}
        <div
          key={activeChoice.id}
          style={{
            fontSize: '0.78rem',
            color: 'var(--silver-200, #e9ecef)',
            lineHeight: 1.45,
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            padding: '0.55rem 0.75rem',
            borderRadius: '10px',
            borderLeft: '3px solid var(--red-500, #d9232d)',
            marginBottom: '0.35rem',
          }}
        >
          <strong style={{ color: '#ffffff' }}>What to inspect: </strong>
          {activeChoice.shortAdvice}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'rgba(235, 240, 245, 0.75)', textAlign: 'right', fontStyle: 'italic' }}>
          Illustration only. Not advice or a recommendation.
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
            01. Guidance
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, lineHeight: 1.2 }}>
            Discuss your needs &rarr;
          </span>
        </a>

        <a
          href="#types"
          onClick={(e) => handleLinkClick('types', e)}
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
            02. Inspection
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, lineHeight: 1.2 }}>
            Compare the options
          </span>
        </a>

        <a
          href="#faqs"
          onClick={(e) => handleLinkClick('faqs', e)}
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
            03. Terms & FAQ
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, lineHeight: 1.2 }}>
            See how it works
          </span>
        </a>
      </div>
    </div>
  );
};
