import React, { useState } from 'react';

type Period = '1Y' | '3Y' | '5Y' | '10Y';

interface PeriodData {
  period: Period;
  months: number;
  invested: number;
  illustrativeValue: number;
  points: number[]; // normalized y-values 0 to 100
}

const PERIOD_CONFIGS: Record<Period, PeriodData> = {
  '1Y': {
    period: '1Y',
    months: 12,
    invested: 60000,
    illustrativeValue: 63300,
    points: [15, 22, 28, 36, 42, 50, 58, 65, 73, 82, 91, 100],
  },
  '3Y': {
    period: '3Y',
    months: 36,
    invested: 180000,
    illustrativeValue: 209500,
    points: [10, 16, 24, 30, 37, 45, 52, 60, 69, 78, 88, 100],
  },
  '5Y': {
    period: '5Y',
    months: 60,
    invested: 300000,
    illustrativeValue: 387000,
    points: [8, 14, 21, 28, 35, 43, 51, 60, 70, 80, 90, 100],
  },
  '10Y': {
    period: '10Y',
    months: 120,
    invested: 600000,
    illustrativeValue: 1032800,
    points: [5, 11, 18, 25, 33, 42, 52, 63, 75, 87, 94, 100],
  },
};

const CATEGORY_TILES = [
  { id: 'equity', label: 'Equity', icon: '📈', color: '#2F6FB0', bg: 'rgba(47, 111, 176, 0.15)' },
  { id: 'debt', label: 'Debt', icon: '🏛️', color: '#5B8DB8', bg: 'rgba(91, 141, 184, 0.15)' },
  { id: 'hybrid', label: 'Hybrid', icon: '⚖️', color: '#123D67', bg: 'rgba(18, 61, 103, 0.25)' },
  { id: 'index', label: 'Index & ETFs', icon: '📊', color: '#2F6FB0', bg: 'rgba(47, 111, 176, 0.15)' },
  { id: 'elss', label: 'ELSS', icon: '🛡️', color: '#5B8DB8', bg: 'rgba(91, 141, 184, 0.15)' },
];

export const MfHeroSchemeCard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('5Y');
  const currentData = PERIOD_CONFIGS[selectedPeriod];

  // SVG Chart Dimensions
  const width = 360;
  const height = 150;
  const paddingX = 20;
  const paddingY = 20;

  const points = currentData.points;
  const stepX = (width - 2 * paddingX) / (points.length - 1);

  // Generate SVG path string with smooth bezier
  const coords = points.map((val, idx) => ({
    x: paddingX + idx * stepX,
    y: height - paddingY - (val / 100) * (height - 2 * paddingY),
  }));

  const linePath = coords.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cpX = (prev.x + curr.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`;

  return (
    <div
      className="mf-hero-board-wrapper"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '540px',
        margin: '0 auto',
      }}
    >
      {/* Groww-style Scheme Card */}
      <div
        className="mf-hero-scheme-card"
        style={{
          width: '100%',
          background:
            'linear-gradient(145deg, rgba(10, 37, 64, 0.95) 0%, rgba(18, 61, 103, 0.88) 55%, rgba(10, 37, 64, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '28px',
          border: '1.5px solid rgba(91, 141, 184, 0.28)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
          padding: '2rem 1.75rem',
          position: 'relative',
          overflow: 'hidden',
          color: '#ffffff',
          zIndex: 2,
        }}
      >
        {/* Subtle Radial Shimmer Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '-35%',
            right: '-35%',
            width: '170%',
            height: '170%',
            background:
              'radial-gradient(ellipse at 70% 30%, rgba(47, 111, 176, 0.32) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        {/* Card Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            position: 'relative',
            zIndex: 3,
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '1.18rem',
                fontWeight: 700,
                color: '#ffffff',
                fontFamily: "'Playfair Display', Georgia, serif",
                letterSpacing: '-0.01em',
                margin: 0,
              }}
            >
              Sample scheme card
            </h3>
            <span
              style={{
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#5B8DB8',
                fontWeight: 600,
                display: 'block',
                marginTop: '0.2rem',
              }}
            >
              SIP compounding illustration
            </span>
          </div>

          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '0.3rem 0.65rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(91, 141, 184, 0.16)',
              border: '1px solid rgba(91, 141, 184, 0.35)',
              color: '#ffffff',
            }}
          >
            Sample layout
          </span>
        </div>

        {/* Skeleton Category & Risk Level Tags */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1.25rem',
            position: 'relative',
            zIndex: 3,
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(215, 217, 220, 0.18)',
              color: 'rgba(235, 240, 245, 0.9)',
            }}
          >
            Category: Diversified Equity
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(215, 217, 220, 0.18)',
              color: 'rgba(235, 240, 245, 0.9)',
            }}
          >
            Risk: Very High (Market-linked)
          </span>
        </div>

        {/* Period Selector Tabs (1Y, 3Y, 5Y, 10Y) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'rgba(5, 19, 41, 0.65)',
            padding: '0.3rem',
            borderRadius: '12px',
            border: '1px solid rgba(91, 141, 184, 0.22)',
            marginBottom: '1rem',
            position: 'relative',
            zIndex: 3,
          }}
        >
          {(['1Y', '3Y', '5Y', '10Y'] as Period[]).map((p) => {
            const isSelected = selectedPeriod === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPeriod(p)}
                style={{
                  flex: 1,
                  padding: '0.4rem 0',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? '#ffffff' : '#5B8DB8',
                  backgroundColor: isSelected ? '#2F6FB0' : 'transparent',
                  border: isSelected ? '1px solid rgba(255, 255, 255, 0.25)' : 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  outline: 'none',
                }}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Morphing Line Chart (Default SIP Illustration) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: `${height}px`,
            marginBottom: '0.85rem',
            zIndex: 3,
          }}
        >
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="mfCardLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#5B8DB8" />
                <stop offset="70%" stopColor="#2F6FB0" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
              <linearGradient id="mfCardAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2F6FB0" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#2F6FB0" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Subtle Horizontal Reference Grid Lines */}
            {[0.25, 0.5, 0.75].map((pct, idx) => (
              <line
                key={idx}
                x1={paddingX}
                y1={paddingY + pct * (height - 2 * paddingY)}
                x2={width - paddingX}
                y2={paddingY + pct * (height - 2 * paddingY)}
                stroke="rgba(215, 217, 220, 0.12)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            ))}

            {/* Area Fill */}
            <path
              d={areaPath}
              fill="url(#mfCardAreaGrad)"
              style={{ transition: 'd 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
            />

            {/* Animated Morphing Line */}
            <path
              d={linePath}
              fill="none"
              stroke="url(#mfCardLineGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ transition: 'd 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
            />

            {/* Glowing Endpoint Marker */}
            {coords.length > 0 && (
              <circle
                cx={coords[coords.length - 1].x}
                cy={coords[coords.length - 1].y}
                r="5"
                fill="#ffffff"
                stroke="#2F6FB0"
                strokeWidth="2.5"
                style={{
                  transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                  filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.8))',
                }}
              />
            )}
          </svg>
        </div>

        {/* Mandatory Regulatory Micro-label */}
        <div
          style={{
            fontSize: '0.72rem',
            color: 'rgba(215, 217, 220, 0.75)',
            textAlign: 'center',
            borderTop: '1px solid rgba(215, 217, 220, 0.15)',
            paddingTop: '0.75rem',
            fontStyle: 'italic',
            position: 'relative',
            zIndex: 3,
          }}
        >
          Illustration only. Not a forecast or guarantee.
        </div>
      </div>

      {/* Floating Category Badges / Fund House Tiles (Groww reference) */}
      <div
        className="mf-floating-tiles-stack"
        style={{
          position: 'absolute',
          right: '-24px',
          bottom: '-20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          zIndex: 4,
          pointerEvents: 'auto',
        }}
      >
        {CATEGORY_TILES.map((cat, i) => (
          <div
            key={cat.id}
            className="mf-floating-tile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.75rem',
              backgroundColor: 'rgba(10, 37, 64, 0.92)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(91, 141, 184, 0.35)',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: '#ffffff',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)',
              transform: `translateX(${i % 2 === 0 ? '-6px' : '6px'})`,
              transition: 'all 0.25s ease',
              filter: 'grayscale(70%)',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'grayscale(0%)';
              e.currentTarget.style.transform = 'scale(1.06) translateX(0)';
              e.currentTarget.style.borderColor = '#2F6FB0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'grayscale(70%)';
              e.currentTarget.style.transform = `translateX(${i % 2 === 0 ? '-6px' : '6px'})`;
              e.currentTarget.style.borderColor = 'rgba(91, 141, 184, 0.35)';
            }}
          >
            <span style={{ fontSize: '0.8rem' }}>{cat.icon}</span>
            <span>{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

