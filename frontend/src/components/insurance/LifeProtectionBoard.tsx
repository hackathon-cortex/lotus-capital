import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCountUp } from '../../hooks/useCountUp';

interface LifeStage {
  id: string;
  label: string;
  reviewFocus: string;
}

const LIFE_STAGES: LifeStage[] = [
  {
    id: 'starting',
    label: 'Starting out',
    reviewFocus: 'Personal liability cover, loan coverage, and establishing early premium affordability.',
  },
  {
    id: 'family',
    label: 'Building a family',
    reviewFocus: 'Adequate sum assured for dependants, home liabilities, and household financial continuity.',
  },
  {
    id: 'peak',
    label: 'Peak earning years',
    reviewFocus: 'Protecting peak earning capacity, children’s higher education timelines, and family security.',
  },
  {
    id: 'retirement',
    label: 'Planning retirement',
    reviewFocus: 'Annuity income continuity, healthcare contingency coordination, and legacy planning.',
  },
];

const POLICY_TYPES_PILLS = [
  {
    id: 'term',
    label: 'Term',
    desc: 'Pure financial protection paying a designated sum to nominees in an unfortunate event.',
  },
  {
    id: 'savings',
    label: 'Savings-oriented',
    desc: 'Combines life protection with an endowment or structured savings payout feature.',
  },
  {
    id: 'par',
    label: 'Participating',
    desc: 'Benefits differ based on participating profit bonuses or pre-fixed policy terms.',
  },
  {
    id: 'ulip',
    label: 'Unit-linked',
    desc: 'Values fluctuate according to market fund performance; policyholder bears investment risk.',
  },
  {
    id: 'pension',
    label: 'Retirement',
    desc: 'Designed to support systematic post-work income planning and financial continuity.',
  },
];

export interface LifeProtectionBoardProps {
  onActionClick?: (targetId: string) => void;
}

export const LifeProtectionBoard: React.FC<LifeProtectionBoardProps> = ({ onActionClick }) => {
  const animatedPolicies = useCountUp(180, 1600);
  const [selectedType, setSelectedType] = useState(POLICY_TYPES_PILLS[0].id);
  const [stageIndex, setStageIndex] = useState(1); // Default to 'Building a family'
  const [lineDrawn, setLineDrawn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLineDrawn(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const activeStage = LIFE_STAGES[stageIndex];
  const activeTypeObj = POLICY_TYPES_PILLS.find((p) => p.id === selectedType) || POLICY_TYPES_PILLS[0];

  const handleLinkClick = (targetId: string, e: React.MouseEvent) => {
    if (onActionClick) {
      e.preventDefault();
      onActionClick(targetId);
    }
  };

  // Curved line path calculations for the stage slider:
  // Points: (20, 30), (100, 18), (180, 12), (260, 24) on a 280x45 SVG
  const markerX = 25 + stageIndex * 75;
  const markerY = stageIndex === 0 ? 30 : stageIndex === 1 ? 18 : stageIndex === 2 ? 14 : 26;

  return (
    <div
      className="life-protection-board"
      style={{
        background: 'linear-gradient(145deg, rgba(10, 37, 64, 0.88) 0%, rgba(18, 61, 103, 0.82) 55%, rgba(31, 111, 139, 0.75) 100%)',
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
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(ellipse at center, rgba(31, 111, 139, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Row: Stat Count-Up + Total Policies Chip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', position: 'relative', zIndex: 2 }}>
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
              Life Policies
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(215, 217, 220, 0.75)', marginTop: '0.35rem' }}>
            life insurance policies serviced &bull; Figures as of October 2026
          </div>
        </div>

        {/* Small Chip: 570+ policies in total */}
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

      {/* Feature (b): Segmented Pill Control for Policy Types */}
      <div style={{ marginBottom: '1.75rem', position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--silver-400, #ced4da)', marginBottom: '0.5rem', fontWeight: 600 }}>
          Explore Protection Categories
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
            backgroundColor: 'rgba(0, 0, 0, 0.22)',
            padding: '0.35rem',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {POLICY_TYPES_PILLS.map((pill) => {
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
                  color: isSelected ? '#ffffff' : 'var(--silver-300, #d7d9dc)',
                  boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                  border: isSelected ? '1px solid rgba(31, 111, 139, 0.6)' : '1px solid transparent',
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
            backgroundColor: 'rgba(31, 111, 139, 0.15)',
            borderLeft: '3px solid #1F6F8B',
            fontSize: '0.8rem',
            lineHeight: 1.5,
            color: 'var(--silver-200, #e9ecef)',
            animation: 'fadeIn 0.25s ease-out forwards',
          }}
        >
          {activeTypeObj.desc}
        </div>
      </div>

      {/* Feature (c): Life Stages Interactive Slider & Curved Indicator */}
      <div
        style={{
          backgroundColor: 'rgba(10, 37, 64, 0.55)',
          borderRadius: '20px',
          border: '1px solid rgba(215, 217, 220, 0.14)',
          padding: '1.25rem 1.35rem',
          marginBottom: '1.75rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--silver-300, #d7d9dc)', fontWeight: 600 }}>
            Life Stage Review
          </span>
          <span style={{ fontSize: '0.7rem', color: 'rgba(215, 217, 220, 0.6)' }}>
            Illustration only. Not advice.
          </span>
        </div>

        {/* Curved SVG Track with Animated Line & Marker */}
        <div style={{ position: 'relative', height: '45px', width: '100%', marginBottom: '0.5rem' }}>
          <svg viewBox="0 0 280 45" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            {/* Background guide path */}
            <path
              d="M 25 30 Q 100 12, 175 14 T 250 26"
              fill="none"
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
            {/* Animated drawing active path */}
            <path
              d="M 25 30 Q 100 12, 175 14 T 250 26"
              fill="none"
              stroke="#1F6F8B"
              strokeWidth="3"
              strokeDasharray="260"
              strokeDashoffset={lineDrawn ? 0 : 260}
              style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
            {/* Stop anchors */}
            {[0, 1, 2, 3].map((idx) => {
              const cx = 25 + idx * 75;
              const cy = idx === 0 ? 30 : idx === 1 ? 18 : idx === 2 ? 14 : 26;
              const isPast = idx <= stageIndex;
              return (
                <circle
                  key={idx}
                  cx={cx}
                  cy={cy}
                  r="5"
                  fill={isPast ? '#1F6F8B' : '#0a2540'}
                  stroke={isPast ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'}
                  strokeWidth="2"
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => setStageIndex(idx)}
                />
              );
            })}
            {/* Glowing marker indicator */}
            <circle
              cx={markerX}
              cy={markerY}
              r="8"
              fill="var(--red-500, #d9232d)"
              stroke="#ffffff"
              strokeWidth="2.5"
              style={{
                transition: 'cx 0.35s cubic-bezier(0.16, 1, 0.3, 1), cy 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                filter: 'drop-shadow(0 0 8px rgba(217, 35, 45, 0.8))',
              }}
            />
          </svg>
        </div>

        {/* 4 Clickable Stage Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.25rem', textAlign: 'center' }}>
          {LIFE_STAGES.map((stage, idx) => {
            const isActive = stageIndex === idx;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setStageIndex(idx)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '0.2rem 0',
                  fontSize: '0.72rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#ffffff' : 'rgba(215, 217, 220, 0.65)',
                  transition: 'color 0.2s ease',
                }}
              >
                {stage.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Focus Line */}
        <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.78rem', color: 'var(--silver-200, #e9ecef)', lineHeight: 1.5 }}>
          <strong style={{ color: '#ffffff' }}>What people often review at this stage: </strong>
          <span>{activeStage.reviewFocus}</span>
        </div>
      </div>

      {/* Feature (d): 3 Clean Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', position: 'relative', zIndex: 2 }}>
        <a
          href="#enquiry"
          onClick={(e) => handleLinkClick('enquiry', e)}
          style={{
            padding: '0.75rem 0.5rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(215, 217, 220, 0.15)',
            textAlign: 'center',
            textDecoration: 'none',
            color: '#ffffff',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(217, 35, 45, 0.2)';
            e.currentTarget.style.borderColor = 'var(--red-500, #d9232d)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.borderColor = 'rgba(215, 217, 220, 0.15)';
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>Discuss your needs</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--silver-300, #d7d9dc)', marginTop: '0.15rem' }}>Quotation enquiry &rarr;</div>
        </a>

        <a
          href="#compare"
          onClick={(e) => handleLinkClick('compare', e)}
          style={{
            padding: '0.75rem 0.5rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(215, 217, 220, 0.15)',
            textAlign: 'center',
            textDecoration: 'none',
            color: '#ffffff',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(31, 111, 139, 0.3)';
            e.currentTarget.style.borderColor = '#1F6F8B';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.borderColor = 'rgba(215, 217, 220, 0.15)';
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>Term vs savings</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--silver-300, #d7d9dc)', marginTop: '0.15rem' }}>Interactive table &rarr;</div>
        </a>

        <a
          href="#types"
          onClick={(e) => handleLinkClick('types', e)}
          style={{
            padding: '0.75rem 0.5rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(215, 217, 220, 0.15)',
            textAlign: 'center',
            textDecoration: 'none',
            color: '#ffffff',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(31, 111, 139, 0.3)';
            e.currentTarget.style.borderColor = '#1F6F8B';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.borderColor = 'rgba(215, 217, 220, 0.15)';
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>Review options</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--silver-300, #d7d9dc)', marginTop: '0.15rem' }}>Sticky card stack &rarr;</div>
        </a>
      </div>
    </div>
  );
};
