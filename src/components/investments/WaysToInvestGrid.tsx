import React from 'react';

export interface WaysToInvestGridProps {
  id?: string;
  onSelectAction?: (targetId: string) => void;
}

export const WaysToInvestGrid: React.FC<WaysToInvestGridProps> = ({
  id = 'ways-to-invest',
  onSelectAction,
}) => {
  const handleNav = (targetId: string, e: React.MouseEvent) => {
    if (onSelectAction) {
      e.preventDefault();
      onSelectAction(targetId);
    }
  };

  return (
    <section
      id={id}
      className="ways-to-invest-section section-padding gi-stacked-section"
      style={{
        backgroundColor: 'var(--silver-100, #f8f9fa)',
        position: 'relative',
        zIndex: 13,
        marginTop: '-36px',
        borderTopLeftRadius: '36px',
        borderTopRightRadius: '36px',
        boxShadow: '0 -10px 40px rgba(10,37,64,0.06)',
        padding: '5rem 0',
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
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
            APPROACHES TO INVESTING
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
              color: 'var(--navy-950, #051329)',
              fontWeight: 700,
              margin: '0 0 1rem',
              letterSpacing: '-0.01em',
            }}
          >
            Three ways to invest.
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--ink, #1f2933)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Choose the method that suits your cash flow, available capital, and milestone horizon.
          </p>
        </div>

        {/* 3-Column Action Cards Row (Max ~320px tall on desktop) */}
        <div
          className="ways-to-invest-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.75rem',
            alignItems: 'stretch',
          }}
        >
          {/* Card 1: Start a SIP (Royal Blue Gradient) */}
          <div
            className="way-card way-card-sip"
            style={{
              background:
                'linear-gradient(145deg, #0A2540 0%, #123D67 55%, #2F6FB0 100%)',
              borderRadius: '24px',
              padding: '2rem 1.75rem',
              color: '#ffffff',
              boxShadow: '0 10px 30px rgba(10,37,64,0.08), 0 2px 6px rgba(10,37,64,0.05)',
              border: '1.5px solid rgba(91, 141, 184, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '290px',
              maxHeight: '340px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
          >
            <div>
              {/* Animated Icon: Coins dropping at intervals */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="sip-coin-icon"
                >
                  <circle cx="12" cy="7" r="4" />
                  <path d="M12 11v6" />
                  <path d="M9 14h6" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </div>

              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '0.65rem',
                }}
              >
                Start a SIP
              </h3>
              <p
                style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.55,
                  color: 'rgba(235, 240, 245, 0.9)',
                  margin: 0,
                }}
              >
                Invest a fixed amount at regular intervals. Build discipline through automated monthly contributions across market cycles.
              </p>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <a
                href="#sip-calculator"
                onClick={(e) => handleNav('sip-calculator', e)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#ffffff',
                  color: '#123D67',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Calculate SIP</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Card 2: Invest a Lump Sum (Teal-Navy Gradient) */}
          <div
            className="way-card way-card-lumpsum"
            style={{
              background:
                'linear-gradient(145deg, #071B30 0%, #0A2540 50%, #1F6F8B 100%)',
              borderRadius: '24px',
              padding: '2rem 1.75rem',
              color: '#ffffff',
              boxShadow: '0 10px 30px rgba(10,37,64,0.08), 0 2px 6px rgba(10,37,64,0.05)',
              border: '1.5px solid rgba(31, 111, 139, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '290px',
              maxHeight: '340px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
          >
            <div>
              {/* Animated Icon: One large drop */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lump-drop-icon"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v10" />
                  <path d="m8 13 4 4 4-4" />
                </svg>
              </div>

              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '0.65rem',
                }}
              >
                Invest a lump sum
              </h3>
              <p
                style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.55,
                  color: 'rgba(235, 240, 245, 0.9)',
                  margin: 0,
                }}
              >
                Invest an amount available to you in one go. Deploy surplus liquidity across categories suited to your investment timeline.
              </p>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <a
                href="#compare"
                onClick={(e) => handleNav('compare', e)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#ffffff',
                  color: '#0A2540',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Compare methods</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Card 3: Review your plan (Silver-White with Navy Text) */}
          <div
            className="way-card way-card-review"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '2rem 1.75rem',
              color: 'var(--navy-950, #051329)',
              boxShadow: '0 10px 30px rgba(10,37,64,0.08), 0 2px 6px rgba(10,37,64,0.05)',
              border: '1.5px solid var(--silver-300, #d7d9dc)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '290px',
              maxHeight: '340px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
          >
            <div>
              {/* Animated Icon: Sweeping dial */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(18, 61, 103, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#123D67"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="dial-sweep-icon"
                >
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>

              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: 'var(--navy-950, #051329)',
                  marginBottom: '0.65rem',
                }}
              >
                Review your plan
              </h3>
              <p
                style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.55,
                  color: 'var(--ink, #1f2933)',
                  margin: 0,
                }}
              >
                Talk to us about whether your current mix still fits your goals. Review asset distribution, portfolio overlap, and rebalancing needs.
              </p>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <a
                href="#enquiry"
                onClick={(e) => handleNav('enquiry', e)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#123D67',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(10, 37, 64, 0.18)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0A2540';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#123D67';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Discuss your goals</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

