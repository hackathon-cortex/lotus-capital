import React, { useState, useEffect } from 'react';
import { useCountUp } from '../../hooks/useCountUp';

interface EquityMarketBoardProps {
  onActionClick?: (targetId: string, chipId?: string) => void;
}

export const EquityMarketBoard: React.FC<EquityMarketBoardProps> = ({ onActionClick }) => {
  const accountsCount = useCountUp(800, 1600);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsRendered(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = (e: React.MouseEvent, targetId: string, chipId?: string) => {
    e.preventDefault();
    if (onActionClick) {
      onActionClick(targetId, chipId);
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      className="equity-market-board"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '540px',
        margin: '0 auto',
        backgroundColor: 'rgba(10, 37, 64, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '32px',
        border: '1px solid rgba(143, 163, 200, 0.22)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45), 0 0 40px rgba(79, 95, 176, 0.18)',
        padding: '1.75rem',
        color: '#FFFFFF',
        overflow: 'hidden',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
      }}
    >
      {/* Background radial indigo glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79, 95, 176, 0.3) 0%, rgba(18, 61, 103, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Top Header Row with Exchange Chips & Count-Up Stat */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1.25rem',
          }}
        >
          {/* Exchange Chips with Drift */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              className="equity-drift-chip equity-drift-1"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(79, 95, 176, 0.25)',
                border: '1px solid rgba(143, 163, 200, 0.35)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#D7D9DC',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#8FA3C8',
                }}
              />
              NSE
            </span>

            <span
              className="equity-drift-chip equity-drift-2"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(18, 61, 103, 0.35)',
                border: '1px solid rgba(143, 163, 200, 0.3)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#D7D9DC',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#8FA3C8',
                }}
              />
              BSE
            </span>
          </div>

          {/* 800+ Count-Up Metric Card */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              borderRadius: '12px',
              border: '1px solid rgba(215, 217, 220, 0.2)',
            }}
          >
            <span
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1,
              }}
            >
              {accountsCount}+
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#8FA3C8',
                lineHeight: 1.2,
                fontWeight: 500,
              }}
            >
              Demat Accounts<br />Serviced
            </span>
          </div>
        </div>

        {/* Abstract Candlestick & Line Illustration (Neutral Indigo/Steel Tones ONLY) */}
        <div
          style={{
            position: 'relative',
            backgroundColor: 'rgba(5, 19, 41, 0.65)',
            borderRadius: '20px',
            border: '1px solid rgba(79, 95, 176, 0.25)',
            padding: '1.25rem 1rem 0.85rem',
            marginBottom: '1.25rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              fontSize: '0.7rem',
              color: '#8FA3C8',
            }}
          >
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Secondary Market Execution Architecture
            </span>
            <span
              style={{
                fontStyle: 'italic',
                color: '#D7D9DC',
                fontSize: '0.65rem',
                opacity: 0.8,
              }}
            >
              Illustration only
            </span>
          </div>

          {/* Abstract SVG Graphic */}
          <div style={{ position: 'relative', height: '120px', width: '100%' }}>
            <svg
              viewBox="0 0 460 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              <defs>
                {/* Area gradient under trendline */}
                <linearGradient id="eqLineArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F5FB0" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#4F5FB0" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Reference Gridlines */}
              <line x1="10" y1="25" x2="450" y2="25" stroke="rgba(143, 163, 200, 0.12)" strokeDasharray="3 3" />
              <line x1="10" y1="65" x2="450" y2="65" stroke="rgba(143, 163, 200, 0.12)" strokeDasharray="3 3" />
              <line x1="10" y1="105" x2="450" y2="105" stroke="rgba(143, 163, 200, 0.12)" strokeDasharray="3 3" />

              {/* Abstract Candlesticks (Indigo / Steel / Navy - NO Green or Red) */}
              {/* Candlestick 1 */}
              <line x1="45" y1="50" x2="45" y2="95" stroke="#8FA3C8" strokeWidth="1.5" opacity="0.6" />
              <rect x="39" y="60" width="12" height="25" rx="2" fill="#4F5FB0" opacity="0.85" />

              {/* Candlestick 2 */}
              <line x1="105" y1="40" x2="105" y2="85" stroke="#8FA3C8" strokeWidth="1.5" opacity="0.6" />
              <rect x="99" y="48" width="12" height="22" rx="2" fill="#123D67" stroke="rgba(143, 163, 200, 0.5)" strokeWidth="1" />

              {/* Candlestick 3 */}
              <line x1="165" y1="30" x2="165" y2="78" stroke="#8FA3C8" strokeWidth="1.5" opacity="0.6" />
              <rect x="159" y="38" width="12" height="28" rx="2" fill="#4F5FB0" opacity="0.9" />

              {/* Candlestick 4 */}
              <line x1="225" y1="20" x2="225" y2="65" stroke="#8FA3C8" strokeWidth="1.5" opacity="0.6" />
              <rect x="219" y="30" width="12" height="20" rx="2" fill="#123D67" stroke="rgba(143, 163, 200, 0.5)" strokeWidth="1" />

              {/* Candlestick 5 */}
              <line x1="285" y1="15" x2="285" y2="60" stroke="#8FA3C8" strokeWidth="1.5" opacity="0.6" />
              <rect x="279" y="22" width="12" height="26" rx="2" fill="#4F5FB0" opacity="0.95" />

              {/* Candlestick 6 */}
              <line x1="345" y1="12" x2="345" y2="52" stroke="#8FA3C8" strokeWidth="1.5" opacity="0.6" />
              <rect x="339" y="18" width="12" height="22" rx="2" fill="#123D67" stroke="rgba(143, 163, 200, 0.5)" strokeWidth="1" />

              {/* Candlestick 7 */}
              <line x1="405" y1="8" x2="405" y2="45" stroke="#8FA3C8" strokeWidth="1.5" opacity="0.6" />
              <rect x="399" y="14" width="12" height="18" rx="2" fill="#4F5FB0" />

              {/* Stepped Smooth Trendline with Draw Animation */}
              <path
                d="M 10 90 Q 60 85 105 65 T 225 45 T 345 28 T 450 16 L 450 115 L 10 115 Z"
                fill="url(#eqLineArea)"
                opacity={isRendered ? 0.7 : 0}
                style={{ transition: 'opacity 0.9s ease' }}
              />
              <path
                className="equity-trend-line"
                d="M 10 90 Q 60 85 105 65 T 225 45 T 345 28 T 450 16"
                fill="none"
                stroke="#8FA3C8"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 500,
                  strokeDashoffset: isRendered ? 0 : 500,
                  transition: 'stroke-dashoffset 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />

              {/* Marker nodes on the trendline */}
              <circle cx="105" cy="65" r="3.5" fill="#FFFFFF" stroke="#4F5FB0" strokeWidth="2" />
              <circle cx="225" cy="45" r="3.5" fill="#FFFFFF" stroke="#4F5FB0" strokeWidth="2" />
              <circle cx="345" cy="28" r="3.5" fill="#FFFFFF" stroke="#4F5FB0" strokeWidth="2" />
              <circle cx="450" cy="16" r="4" fill="#D7D9DC" stroke="#123D67" strokeWidth="2" />
            </svg>
          </div>

          {/* Outlined "Market risk" note chip inside illustration footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginTop: '0.35rem',
              padding: '0.3rem 0.65rem',
              backgroundColor: 'rgba(18, 61, 103, 0.45)',
              borderRadius: '8px',
              border: '1px solid rgba(143, 163, 200, 0.25)',
              fontSize: '0.68rem',
              color: '#D7D9DC',
            }}
          >
            <span style={{ color: '#8FA3C8', fontSize: '0.8rem', lineHeight: 1 }}>ⓘ</span>
            <span>Investments in securities market are subject to market risks.</span>
          </div>
        </div>

        {/* Three Compact Action Cards with Micro-Animations */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.65rem',
          }}
        >
          {/* Card 1: Open a demat account */}
          <a
            href="#enquiry"
            onClick={(e) => handleClick(e, 'enquiry', 'demat-account')}
            className="equity-action-card group"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '0.85rem 0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(143, 163, 200, 0.2)',
              textDecoration: 'none',
              color: '#FFFFFF',
              transition: 'all 0.25s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div
                className="action-icon-flip"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(79, 95, 176, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D7D9DC',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#8FA3C8' }}>→</span>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.25 }}>
                Open a Demat Account
              </div>
              <div style={{ fontSize: '0.66rem', color: '#8FA3C8', marginTop: '0.2rem' }}>
                Initiate KYC onboarding
              </div>
            </div>
          </a>

          {/* Card 2: Trade through broking partner */}
          <a
            href="#services"
            onClick={(e) => handleClick(e, 'services')}
            className="equity-action-card group"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '0.85rem 0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(143, 163, 200, 0.2)',
              textDecoration: 'none',
              color: '#FFFFFF',
              transition: 'all 0.25s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div
                className="action-icon-pulse"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(18, 61, 103, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D7D9DC',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#8FA3C8' }}>→</span>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.25 }}>
                Trade via Broking Partner
              </div>
              <div style={{ fontSize: '0.66rem', color: '#8FA3C8', marginTop: '0.2rem' }}>
                NSE & BSE secondary access
              </div>
            </div>
          </a>

          {/* Card 3: Apply for IPOs */}
          <a
            href="#journey"
            onClick={(e) => handleClick(e, 'journey')}
            className="equity-action-card group"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '0.85rem 0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(143, 163, 200, 0.2)',
              textDecoration: 'none',
              color: '#FFFFFF',
              transition: 'all 0.25s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div
                className="action-icon-slide"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(79, 95, 176, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D7D9DC',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
                  <path d="M13 5v2" />
                  <path d="M13 17v2" />
                  <path d="M13 11v2" />
                </svg>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#8FA3C8' }}>→</span>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.25 }}>
                Apply for IPOs
              </div>
              <div style={{ fontSize: '0.66rem', color: '#8FA3C8', marginTop: '0.2rem' }}>
                Primary public offerings
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

