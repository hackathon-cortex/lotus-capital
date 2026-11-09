
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCountUp } from '../../hooks/useCountUp';
import { LotusLogo } from '../common/LotusLogo';

interface HouseholdStop {
  id: string;
  label: string;
  memberCount: number;
  reviewFocus: string;
  badge: string;
}

const HOUSEHOLD_STOPS: HouseholdStop[] = [
  {
    id: 'individual',
    label: 'Just me',
    memberCount: 1,
    reviewFocus: 'Review individual sum insured, personal waiting periods, and room-rent limits.',
    badge: '1 Adult',
  },
  {
    id: 'couple',
    label: 'Couple',
    memberCount: 2,
    reviewFocus: 'Review maternity waiting periods, shared sum insured buffer, and restoration benefits.',
    badge: '2 Adults',
  },
  {
    id: 'family',
    label: 'Family with children',
    memberCount: 4,
    reviewFocus: 'Review pediatric care coverage, day-care treatments, and automatic sum insured reload.',
    badge: '2 Adults + Children',
  },
  {
    id: 'seniors',
    label: 'Parents / seniors',
    memberCount: 2,
    reviewFocus: 'Review co-payment percentages, pre-existing ailment waiting periods, and network hospitals.',
    badge: 'Elderly Parents',
  },
];

const HEALTH_POLICY_PILLS = [
  {
    id: 'individual',
    label: 'Individual',
    desc: 'Dedicated sum insured for a single individual with independent annual limits.',
  },
  {
    id: 'family',
    label: 'Family floater',
    desc: 'Shared sum insured covering spouse, dependent children, and parents under a single umbrella.',
  },
  {
    id: 'senior',
    label: 'Senior citizen',
    desc: 'Specialised healthcare cover designed for elderly parents with age-adapted terms.',
  },
  {
    id: 'critical',
    label: 'Critical illness',
    desc: 'Fixed lump-sum benefit payable upon diagnosis of specified major medical conditions.',
  },
  {
    id: 'group',
    label: 'Group health',
    desc: 'Corporate and organizational health cover tailored for employees and members.',
  },
];

export interface HealthCareBoardProps {
  onActionClick?: (targetId: string) => void;
}

export const HealthCareBoard: React.FC<HealthCareBoardProps> = ({ onActionClick }) => {
  const animatedPolicies = useCountUp(250, 1600);
  const [selectedType, setSelectedType] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('policyType');
      if (p) return p;
    }
    return HEALTH_POLICY_PILLS[1].id;
  });
  const [householdIndex, setHouseholdIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const h = new URLSearchParams(window.location.search).get('household');
      if (h) return parseInt(h, 10);
    }
    return 2;
  });

  const activeHousehold = HOUSEHOLD_STOPS[householdIndex];
  const activeTypeObj = HEALTH_POLICY_PILLS.find((p) => p.id === selectedType) || HEALTH_POLICY_PILLS[0];

  const handleLinkClick = (targetId: string, e: React.MouseEvent) => {
    if (onActionClick) {
      e.preventDefault();
      onActionClick(targetId);
    }
  };

  // Positions for orbiting dots in the household ring (radius = 50px, center = 70, 70)
  const getOrbitalDots = (count: number) => {
    const dots: { x: number; y: number; label: string }[] = [];
    const center = 70;
    const r = 46;
    if (count === 1) {
      dots.push({ x: center, y: center - r, label: 'Self' });
    } else if (count === 2 && activeHousehold.id === 'seniors') {
      dots.push({ x: center - r * 0.75, y: center - r * 0.45, label: 'Father' });
      dots.push({ x: center + r * 0.75, y: center - r * 0.45, label: 'Mother' });
    } else if (count === 2) {
      dots.push({ x: center - r * 0.8, y: center - r * 0.3, label: 'You' });
      dots.push({ x: center + r * 0.8, y: center + r * 0.3, label: 'Spouse' });
    } else {
      dots.push({ x: center - r * 0.75, y: center - r * 0.6, label: 'You' });
      dots.push({ x: center + r * 0.75, y: center - r * 0.6, label: 'Spouse' });
      dots.push({ x: center - r * 0.8, y: center + r * 0.55, label: 'Child 1' });
      dots.push({ x: center + r * 0.8, y: center + r * 0.55, label: 'Child 2' });
    }
    return dots;
  };

  const orbitalDots = getOrbitalDots(activeHousehold.memberCount);

  return (
    <div
      className="health-care-board"
      style={{
        background: 'linear-gradient(145deg, rgba(10, 37, 64, 0.95) 0%, rgba(18, 61, 103, 0.90) 55%, rgba(10, 37, 64, 0.98) 100%)',
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
          background: 'radial-gradient(ellipse at 70% 30%, rgba(18, 61, 103, 0.35) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Row: Stat Count-Up + Total Policies Chip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.65rem', position: 'relative', zIndex: 2 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2.5rem, 4vw, 3.25rem)',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1,
              }}
            >
              {animatedPolicies}+
            </span>
            <span style={{ fontSize: '0.88rem', color: 'var(--silver-300, #d7d9dc)', fontWeight: 600 }}>
              Health Policies
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(235, 240, 245, 0.9)', marginTop: '0.35rem' }}>
            health insurance policies serviced &bull; Figures as of October 2026
          </div>
        </div>

        {/* Small Chip: 570+ total policies */}
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
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--red-500, #d9232d)' }} />
          <span>570+ total policies &rarr;</span>
        </Link>
      </div>

      {/* Segmented Pill Control for Policy Types */}
      <div style={{ marginBottom: '1.65rem', position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--silver-200, #e9ecef)', marginBottom: '0.5rem', fontWeight: 600 }}>
          Explore Health Categories
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.35rem',
            backgroundColor: 'rgba(0, 0, 0, 0.24)',
            padding: '0.35rem',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {HEALTH_POLICY_PILLS.map((pill) => {
            const isSelected = selectedType === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setSelectedType(pill.id)}
                style={{
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '0.38rem 0.75rem',
                  borderRadius: '10px',
                  fontSize: '0.76rem',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected ? 'var(--navy-900, #0a2540)' : 'transparent',
                  color: isSelected ? '#ffffff' : 'var(--silver-200, #e9ecef)',
                  boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                  border: isSelected ? '1px solid rgba(215, 217, 220, 0.55)' : '1px solid transparent',
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
          key={activeTypeObj.id}
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
          {activeTypeObj.desc}
        </div>
      </div>

      {/* Household Coverage Ring: "Who is covered?" */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
          <div>
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--silver-200, #e9ecef)', fontWeight: 700, display: 'block' }}>
              Household Protection
            </span>
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>
              Who is covered in your plan?
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
            {activeHousehold.badge}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1.25rem', alignItems: 'center' }}>
          {/* Orbital Ring SVG Graphic */}
          <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto' }}>
            <svg width="140" height="140" viewBox="0 0 140 140" style={{ overflow: 'visible' }}>
              {/* Outer faint dashed orbit track */}
              <circle
                cx="70"
                cy="70"
                r="46"
                fill="none"
                stroke="rgba(215, 217, 220, 0.2)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {/* Active orbit ring */}
              <circle
                cx="70"
                cy="70"
                r="46"
                fill="none"
                stroke="rgba(215, 217, 220, 0.45)"
                strokeWidth="2"
              />
              {/* Center shield/lotus circle */}
              <circle
                cx="70"
                cy="70"
                r="26"
                fill="rgba(10, 37, 64, 0.95)"
                stroke="rgba(215, 217, 220, 0.4)"
                strokeWidth="1.5"
              />
              {/* Center subtle red pulse aura */}
              <circle
                cx="70"
                cy="70"
                r="30"
                fill="none"
                stroke="var(--red-500, #d9232d)"
                strokeWidth="1"
                opacity="0.35"
                className="animate-pulse"
              />

              {/* Orbiting member dots */}
              {orbitalDots.map((dot, idx) => (
                <g key={idx}>
                  {/* Subtle glow halo */}
                  <circle cx={dot.x} cy={dot.y} r="10" fill="rgba(233, 35, 50, 0.2)" />
                  {/* Core dot */}
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r="6.5"
                    fill={idx === 0 ? 'var(--red-500, #d9232d)' : '#ffffff'}
                    stroke="var(--navy-950, #051329)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={dot.x}
                    y={dot.y + (dot.y < 70 ? -12 : 18)}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="600"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                  >
                    {dot.label}
                  </text>
                </g>
              ))}
            </svg>

            {/* Center Lotus Emblem */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <LotusLogo variant="light" height={16} width="auto" />
            </div>
          </div>

          {/* Household Selection Pill List */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.75rem' }}>
              {HOUSEHOLD_STOPS.map((stop, idx) => {
                const isActive = idx === householdIndex;
                return (
                  <button
                    key={stop.id}
                    type="button"
                    onClick={() => setHouseholdIndex(idx)}
                    style={{
                      outline: 'none',
                      cursor: 'pointer',
                      padding: '0.38rem 0.5rem',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: isActive ? 700 : 500,
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.05)',
                      color: isActive ? '#ffffff' : 'var(--silver-200, #e9ecef)',
                      border: isActive ? '1px solid rgba(215, 217, 220, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                      textAlign: 'left',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    {stop.label}
                  </button>
                );
              })}
            </div>

            {/* Educational Focus line for chosen household stop */}
            <div
              key={activeHousehold.id}
              style={{
                fontSize: '0.76rem',
                color: 'var(--silver-200, #e9ecef)',
                lineHeight: 1.45,
                backgroundColor: 'rgba(0,0,0,0.25)',
                padding: '0.5rem 0.65rem',
                borderRadius: '8px',
                borderLeft: '2px solid var(--red-500, #d9232d)',
              }}
            >
              <strong style={{ color: '#ffffff' }}>What people often review: </strong>
              {activeHousehold.reviewFocus}
            </div>
          </div>
        </div>
      </div>

      {/* 3 Interactive Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', position: 'relative', zIndex: 2 }}>
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
          <span style={{ fontSize: '0.72rem', color: 'var(--silver-200, #e9ecef)', fontWeight: 600 }}>01. Categorise</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, lineHeight: 1.2 }}>5 Policy Types</span>
        </a>

        <a
          href="#compare"
          onClick={(e) => handleLinkClick('compare', e)}
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
          <span style={{ fontSize: '0.72rem', color: 'var(--silver-200, #e9ecef)', fontWeight: 600 }}>02. Evaluate</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, lineHeight: 1.2 }}>Checklist Inspector</span>
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
          <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>03. Consultation</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, lineHeight: 1.2 }}>Request Quote &rarr;</span>
        </a>
      </div>
    </div>
  );
};
