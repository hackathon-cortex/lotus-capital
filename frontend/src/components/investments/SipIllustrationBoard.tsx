import React, { useState, useId, useMemo } from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import { LotusLogo } from '../common/LotusLogo';

export interface SipIllustrationBoardProps {
  id?: string;
  defaultMonthly?: number;
  defaultYears?: number;
  defaultRate?: number;
  compact?: boolean;
}

export const SipIllustrationBoard: React.FC<SipIllustrationBoardProps> = ({
  id = 'sip-calculator',
  defaultMonthly = 5000,
  defaultYears = 10,
  defaultRate = 10,
  compact = false,
}) => {
  const [monthlyAmount, setMonthlyAmount] = useState<number>(defaultMonthly);
  const [years, setYears] = useState<number>(defaultYears);
  const [annualRate, setAnnualRate] = useState<number>(defaultRate);
  const [hoveredPoint, setHoveredPoint] = useState<{
    year: number;
    invested: number;
    total: number;
  } | null>(null);

  const monthlyInputId = useId();
  const yearsInputId = useId();
  const rateInputId = useId();

  // Monthly interest rate and total installments
  const i = annualRate / 12 / 100;
  const n = years * 12;

  // Total invested & Future illustrative value
  const totalInvested = monthlyAmount * n;
  const futureValue =
    i > 0
      ? Math.round(monthlyAmount * ((Math.pow(1 + i, n) - 1) / i) * (1 + i))
      : totalInvested;
  const illustrativeGrowth = Math.max(0, futureValue - totalInvested);

  // Animated display values
  const animatedFutureValue = useCountUp(futureValue, 600);
  const animatedInvested = useCountUp(totalInvested, 600);
  const animatedGrowth = useCountUp(illustrativeGrowth, 600);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Generate chart data points for each year
  const chartPoints = useMemo(() => {
    return Array.from({ length: years }, (_, idx) => {
      const yr = idx + 1;
      const months = yr * 12;
      const inv = monthlyAmount * months;
      const fv =
        i > 0
          ? Math.round(monthlyAmount * ((Math.pow(1 + i, months) - 1) / i) * (1 + i))
          : inv;
      return { year: yr, invested: inv, total: fv };
    });
  }, [monthlyAmount, years, i]);

  // Chart SVG Coordinates
  const svgWidth = 540;
  const svgHeight = 200;
  const maxVal = futureValue > 0 ? futureValue : 1;
  const getX = (yr: number) => ((yr - 1) / (years - 1 || 1)) * (svgWidth - 60) + 40;
  const getY = (val: number) => svgHeight - 25 - (val / maxVal) * (svgHeight - 55);

  const totalPointsPath = chartPoints
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p.total)}`)
    .join(' ');
  const investedPointsPath = chartPoints
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p.invested)}`)
    .join(' ');
  const areaPath = `${totalPointsPath} L ${getX(years)} ${svgHeight - 25} L ${getX(1)} ${svgHeight - 25} Z`;
  const investedAreaPath = `${investedPointsPath} L ${getX(years)} ${svgHeight - 25} L ${getX(1)} ${svgHeight - 25} Z`;

  // Quick Preset Horizon Pills
  const horizonPresets = [5, 10, 15, 20];

  return (
    <div
      id={id}
      data-testid={id}
      className="sip-illustration-board-container"
      style={{
        position: 'relative',
        zIndex: 12,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: compact ? '1rem 0' : '2.5rem 1.5rem',
      }}
    >
      <div
        className="sip-illustration-frame"
        style={{
          background:
            'linear-gradient(145deg, #051329 0%, #0A2540 40%, #123D67 80%, #2F6FB0 100%)',
          borderRadius: '32px',
          border: '1.5px solid rgba(91, 141, 184, 0.35)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
          padding: '2.5rem 2.25rem',
          position: 'relative',
          overflow: 'hidden',
          color: '#ffffff',
          maxHeight: compact ? 'none' : '720px',
        }}
      >
        {/* Subtle Lotus Watermark in Background */}
        <div
          style={{
            position: 'absolute',
            right: '-60px',
            bottom: '-40px',
            width: '360px',
            height: '360px',
            opacity: 0.04,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <LotusLogo variant="watermark" width="100%" height="100%" />
        </div>

        {/* Board Top Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
            borderBottom: '1px solid rgba(215, 217, 220, 0.15)',
            paddingBottom: '1.25rem',
            marginBottom: '2rem',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-block',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 700,
                color: '#5B8DB8',
                marginBottom: '0.35rem',
              }}
            >
              SIP illustration
            </div>
            <h2
              style={{
                color: '#ffffff',
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
                fontWeight: 700,
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              See how regular investing can add up
            </h2>
          </div>

          <div
            style={{
              padding: '0.45rem 0.9rem',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(91, 141, 184, 0.35)',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              color: 'rgba(235, 240, 245, 0.9)',
              fontWeight: 500,
              maxWidth: '480px',
              lineHeight: 1.4,
            }}
          >
            Illustration only. Not a forecast or guarantee. Actual returns vary with market movements and scheme performance.
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div
          className="sip-board-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 1fr) minmax(320px, 1.25fr)',
            gap: '2.5rem',
            alignItems: 'stretch',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Left Column (~45%): Three Sliders */}
          <div
            className="sip-controls-col"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.5rem',
            }}
          >
            {/* Slider 1: Monthly Investment */}
            <div
              style={{
                backgroundColor: 'rgba(5, 19, 41, 0.55)',
                padding: '1.25rem 1.4rem',
                borderRadius: '20px',
                border: '1px solid rgba(91, 141, 184, 0.22)',
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
                <label
                  htmlFor={monthlyInputId}
                  style={{ fontSize: '0.86rem', color: '#CBD5E1', fontWeight: 600 }}
                >
                  Monthly investment
                </label>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {formatCurrency(monthlyAmount)}
                </span>
              </div>

              <input
                id={monthlyInputId}
                type="range"
                min={500}
                max={100000}
                step={500}
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                className="custom-range-slider"
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  outline: 'none',
                  cursor: 'pointer',
                  accentColor: '#2F6FB0',
                }}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                  color: '#5B8DB8',
                  marginTop: '0.5rem',
                }}
              >
                <span>₹500</span>
                <span>₹50,000</span>
                <span>₹1,00,000</span>
              </div>
            </div>

            {/* Slider 2: Investment Horizon with Quick Preset Pills */}
            <div
              style={{
                backgroundColor: 'rgba(5, 19, 41, 0.55)',
                padding: '1.25rem 1.4rem',
                borderRadius: '20px',
                border: '1px solid rgba(91, 141, 184, 0.22)',
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
                <label
                  htmlFor={yearsInputId}
                  style={{ fontSize: '0.86rem', color: '#CBD5E1', fontWeight: 600 }}
                >
                  Investment horizon
                </label>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {years} {years === 1 ? 'Year' : 'Years'}
                </span>
              </div>

              <input
                id={yearsInputId}
                type="range"
                min={1}
                max={30}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="custom-range-slider"
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  outline: 'none',
                  cursor: 'pointer',
                  accentColor: '#2F6FB0',
                }}
              />

              {/* Horizon Quick Preset Pills */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '0.75rem',
                }}
              >
                <span style={{ fontSize: '0.7rem', color: '#5B8DB8', marginRight: '0.25rem' }}>
                  Presets:
                </span>
                {horizonPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setYears(preset)}
                    style={{
                      padding: '0.2rem 0.65rem',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      borderRadius: '9999px',
                      border:
                        years === preset
                          ? '1px solid #ffffff'
                          : '1px solid rgba(91, 141, 184, 0.35)',
                      backgroundColor:
                        years === preset ? '#2F6FB0' : 'rgba(255, 255, 255, 0.06)',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {preset}Y
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 3: Assumed Annual Rate (Hypothetical) */}
            <div
              style={{
                backgroundColor: 'rgba(5, 19, 41, 0.55)',
                padding: '1.25rem 1.4rem',
                borderRadius: '20px',
                border: '1px solid rgba(91, 141, 184, 0.22)',
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
                  <label
                    htmlFor={rateInputId}
                    style={{ fontSize: '0.86rem', color: '#CBD5E1', fontWeight: 600 }}
                  >
                    Assumed annual rate
                  </label>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.68rem',
                      color: '#5B8DB8',
                      fontStyle: 'italic',
                    }}
                  >
                    Assumed rate, hypothetical
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {annualRate}% p.a.
                </span>
              </div>

              <input
                id={rateInputId}
                type="range"
                min={6}
                max={14}
                step={0.5}
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                className="custom-range-slider"
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  outline: 'none',
                  cursor: 'pointer',
                  accentColor: '#2F6FB0',
                }}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                  color: '#5B8DB8',
                  marginTop: '0.5rem',
                }}
              >
                <span>6%</span>
                <span>10% (benchmark)</span>
                <span>14%</span>
              </div>
            </div>
          </div>

          {/* Right Column (~55%): Results Block & Area Chart */}
          <div
            className="sip-results-col"
            style={{
              backgroundColor: 'rgba(5, 19, 41, 0.72)',
              borderRadius: '24px',
              border: '1.5px solid rgba(91, 141, 184, 0.28)',
              padding: '1.75rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Top Results Metrics (Illustrative value & Chips) */}
            <div>
              <span
                style={{
                  fontSize: '0.76rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#5B8DB8',
                  fontWeight: 600,
                  display: 'block',
                }}
              >
                Illustrative value ({years} Yrs @ {annualRate}%)
              </span>
              <div
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: '0.25rem 0 1rem',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                }}
              >
                {formatCurrency(animatedFutureValue)}
              </div>

              {/* Data Chips: Amount Invested & Illustrative Growth (Neutral Silver-Blue, NOT green) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(215, 217, 220, 0.15)',
                    borderRadius: '12px',
                    padding: '0.65rem 0.9rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: '#CBD5E1',
                      display: 'block',
                      marginBottom: '0.2rem',
                    }}
                  >
                    Amount invested
                  </span>
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#ffffff',
                    }}
                  >
                    {formatCurrency(animatedInvested)}
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(91, 141, 184, 0.12)',
                    border: '1px solid rgba(91, 141, 184, 0.35)',
                    borderRadius: '12px',
                    padding: '0.65rem 0.9rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: '#5B8DB8',
                      display: 'block',
                      marginBottom: '0.2rem',
                    }}
                  >
                    Illustrative growth
                  </span>
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#CBD5E1', // Neutral silver-blue, NOT green
                    }}
                  >
                    +{formatCurrency(animatedGrowth)}
                  </span>
                </div>
              </div>
            </div>

            {/* SVG Area Chart */}
            <div style={{ width: '100%', height: `${svgHeight}px`, position: 'relative' }}>
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="sipTotalLineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor="#5B8DB8" />
                    <stop offset="100%" stopColor="#2F6FB0" />
                  </linearGradient>
                  <linearGradient id="sipTotalAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2F6FB0" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#2F6FB0" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="sipInvestedAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5B8DB8" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#5B8DB8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Reference Grid Lines */}
                {[0, 0.33, 0.66, 1].map((pct, idx) => {
                  const y = svgHeight - 25 - pct * (svgHeight - 55);
                  return (
                    <g key={idx}>
                      <line
                        x1="35"
                        y1={y}
                        x2={svgWidth - 15}
                        y2={y}
                        stroke="rgba(215, 217, 220, 0.12)"
                        strokeDasharray="4 4"
                      />
                      <text
                        x="5"
                        y={y + 4}
                        fill="rgba(215, 217, 220, 0.55)"
                        fontSize="9"
                        fontFamily="Inter, sans-serif"
                      >
                        {Math.round((maxVal * pct) / 100000)}L
                      </text>
                    </g>
                  );
                })}

                {/* Invested Area Fill (Silver-blue) */}
                <path d={investedAreaPath} fill="url(#sipInvestedAreaGrad)" />

                {/* Illustrative Total Area Fill (Royal Blue) */}
                <path d={areaPath} fill="url(#sipTotalAreaGrad)" />

                {/* Invested Line */}
                <path
                  d={investedPointsPath}
                  fill="none"
                  stroke="#5B8DB8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Total Illustrative Value Line */}
                <path
                  d={totalPointsPath}
                  fill="none"
                  stroke="url(#sipTotalLineGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Interactive circles for each year */}
                {chartPoints.map((p) => {
                  const cx = getX(p.year);
                  const cy = getY(p.total);
                  return (
                    <circle
                      key={p.year}
                      cx={cx}
                      cy={cy}
                      r="4.5"
                      fill="#ffffff"
                      stroke="#2F6FB0"
                      strokeWidth="2"
                      style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  );
                })}
              </svg>

              {/* Hover Tooltip */}
              {hoveredPoint && (
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(10, 37, 64, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(91, 141, 184, 0.4)',
                    padding: '0.6rem 0.9rem',
                    borderRadius: '12px',
                    fontSize: '0.78rem',
                    color: '#ffffff',
                    pointerEvents: 'none',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: '#5B8DB8',
                      marginBottom: '0.2rem',
                    }}
                  >
                    Year {hoveredPoint.year}
                  </div>
                  <div style={{ color: '#CBD5E1' }}>
                    Invested: {formatCurrency(hoveredPoint.invested)}
                  </div>
                  <div style={{ color: '#ffffff', fontWeight: 600 }}>
                    Illustrative value: {formatCurrency(hoveredPoint.total)}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Chart Legend */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.74rem',
                color: '#5B8DB8',
                marginTop: '1rem',
                borderTop: '1px solid rgba(215, 217, 220, 0.12)',
                paddingTop: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span
                    style={{
                      width: '12px',
                      height: '3px',
                      backgroundColor: '#ffffff',
                      borderRadius: '2px',
                    }}
                  />
                  Illustrative value
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span
                    style={{
                      width: '12px',
                      height: '3px',
                      backgroundColor: '#5B8DB8',
                      borderRadius: '2px',
                    }}
                  />
                  Amount invested
                </span>
              </div>
              <span style={{ fontStyle: 'italic', fontSize: '0.7rem' }}>
                Compounding illustration
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

