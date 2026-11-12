import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminIcon } from './AdminIcons';

// Custom Count-Up Animation Hook with Reduced-Motion Fallback
export function useCountUp(target: number, durationMs = 1200): number {
  const [count, setCount] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return target;
    }
    return 0;
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(target);
      return;
    }

    let startTime: number | null = null;
    let animFrame: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / durationMs, 1);
      // ease-out-quart
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(ease * target));

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [target, durationMs]);

  return count;
}

// -------------------------------------------------------------
// Tile A: Headline Enquiries Card (Solid White/Silver Highlight)
// -------------------------------------------------------------
export interface HeadlineTileProps {
  count: number;
  monthLabel: string;
  pctChange: string;
  monthlyTrend: number[];
}

export const HeadlineTile: React.FC<HeadlineTileProps> = ({
  count,
  monthLabel,
  pctChange,
  monthlyTrend,
}) => {
  const animatedCount = useCountUp(count, 1200);

  // Sparkline calculation with safe boundary protection
  const sparkW = 180;
  const sparkH = 40;
  const trendSafe = monthlyTrend && monthlyTrend.length > 0 ? monthlyTrend : [0, 0];
  const maxVal = Math.max(...trendSafe, 1);
  const minVal = Math.min(...trendSafe, 0);
  const len = trendSafe.length;
  const points = trendSafe
    .map((v, i) => {
      const x = len > 1 ? (i / (len - 1)) * sparkW : sparkW / 2;
      const y = sparkH - 4 - ((v - minVal) / (maxVal - minVal || 1)) * (sparkH - 8);
      return `${x},${y}`;
    })
    .join(' ');

  const isPositive = pctChange.startsWith('+');
  const isNegative = pctChange.startsWith('-');

  return (
    <div
      className="admin-bento-tile admin-bento-tile--highlight admin-bento-tile--headline"
      style={{ animationDelay: '0ms' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#5B6770',
            }}
          >
            New Enquiries ({monthLabel})
          </span>
          <div
            style={{
              fontSize: '44px',
              fontWeight: 700,
              fontFamily: 'Poppins, sans-serif',
              color: '#071B30',
              lineHeight: 1.1,
              marginTop: '4px',
            }}
          >
            {animatedCount}
          </div>
        </div>

        {/* Change chip: Navy up-arrow or down-arrow or neutral */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '999px',
            background: 'rgba(18, 61, 103, 0.1)',
            color: '#123D67',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          {isPositive ? (
            <AdminIcon name="arrow-up" size={13} color="#123D67" />
          ) : isNegative ? (
            <AdminIcon name="arrow-down" size={13} color="#E92332" />
          ) : null}
          <span>{pctChange}</span>
        </div>
      </div>

      {/* Sparkline at bottom */}
      <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', color: '#8A949D', fontWeight: 500 }}>
          Period pipeline trajectory
        </span>

        <svg width={sparkW} height={sparkH} style={{ overflow: 'visible' }} aria-hidden="true">
          <polyline
            fill="none"
            stroke="#123D67"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Tile B: Follow-ups Due Today (Red-accented glass card)
// -------------------------------------------------------------
export interface FollowupsTileProps {
  count: number;
  splitText: string;
}

export const FollowupsTile: React.FC<FollowupsTileProps> = ({
  count,
  splitText,
}) => {
  const animatedCount = useCountUp(count, 800);

  return (
    <Link
      to="/admin/followups"
      className="admin-bento-tile admin-bento-tile--followups"
      style={{
        textDecoration: 'none',
        color: '#FFFFFF',
        animationDelay: '60ms',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#D7D9DC',
          }}
        >
          Follow-ups Due Today
        </span>

        {count > 0 && <span className="admin-pulsing-dot" aria-hidden="true" />}
      </div>

      <div
        style={{
          fontSize: '44px',
          fontWeight: 700,
          fontFamily: 'Poppins, sans-serif',
          color: '#E92332',
          lineHeight: 1.1,
          marginTop: '6px',
        }}
      >
        {animatedCount}
      </div>

      <div style={{ marginTop: 'auto', fontSize: '12px', color: '#D7D9DC' }}>
        {splitText}
      </div>
    </Link>
  );
};

// -------------------------------------------------------------
// Tile C: Converted This Month (Progress Ring)
// -------------------------------------------------------------
export interface ConvertedTileProps {
  count: number;
  ratePct: number;
}

export const ConvertedTile: React.FC<ConvertedTileProps> = ({
  count,
  ratePct,
}) => {
  const animatedCount = useCountUp(count, 900);
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      setAnimatedPct(ratePct);
      return;
    }
    const timer = setTimeout(() => {
      setAnimatedPct(ratePct);
    }, 100);
    return () => clearTimeout(timer);
  }, [ratePct]);

  // Circle progress math
  const r = 24;
  const circ = 2 * Math.PI * r;
  const strokeDashoffset = circ - (animatedPct / 100) * circ;

  return (
    <div
      className="admin-bento-tile admin-bento-tile--converted"
      style={{ animationDelay: '120ms' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#D7D9DC',
            }}
          >
            Converted This Month
          </span>

          <div
            style={{
              fontSize: '44px',
              fontWeight: 700,
              fontFamily: 'Poppins, sans-serif',
              color: '#FFFFFF',
              lineHeight: 1.1,
              marginTop: '6px',
            }}
          >
            {animatedCount}
          </div>
        </div>

        {/* Conversion ring */}
        <div style={{ position: 'relative', width: '56px', height: '56px' }}>
          <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="28"
              cy="28"
              r={r}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="4.5"
              fill="transparent"
            />
            <circle
              cx="28"
              cy="28"
              r={r}
              stroke="#FFFFFF"
              strokeWidth="4.5"
              fill="transparent"
              strokeDasharray={circ}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
              color: '#FFFFFF',
            }}
          >
            {Math.round(ratePct)}%
          </div>
        </div>
      </div>

      <div style={{ marginTop: 'auto', fontSize: '12px', color: '#D7D9DC' }}>
        {ratePct}% Lead-to-client conversion rate
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Tile D: Quick Actions (4 Glass Chips)
// -------------------------------------------------------------
export const QuickActionsTile: React.FC = () => {
  return (
    <div
      className="admin-bento-tile admin-bento-tile--quick-actions"
      style={{ animationDelay: '180ms' }}
    >
      <span
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '12px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#D7D9DC',
          marginBottom: '10px',
        }}
      >
        Quick Operations
      </span>

      <div className="admin-quick-actions-row">
        <Link
          to="/admin/leads"
          className="admin-quick-action-btn admin-quick-action-btn--primary"
          title="Add Walk-in or Offline Lead"
        >
          <AdminIcon name="plus" size={16} />
          <span>Add Lead</span>
        </Link>

        <Link
          to="/admin/content/pages"
          className="admin-quick-action-btn"
          title="Edit Website Page Content"
        >
          <AdminIcon name="pages" size={16} />
          <span>Edit Content</span>
        </Link>

        <Link
          to="/admin/media"
          className="admin-quick-action-btn"
          title="Upload to Media Library"
        >
          <AdminIcon name="upload" size={16} />
          <span>Upload Media</span>
        </Link>

        <Link
          to="/admin/content/faqs"
          className="admin-quick-action-btn"
          title="Update Public FAQs"
        >
          <AdminIcon name="faqs" size={16} />
          <span>Update FAQs</span>
        </Link>
      </div>
    </div>
  );
};

