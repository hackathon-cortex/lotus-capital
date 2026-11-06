import React, { useState } from 'react';
import registrationsData from '@content/data/registrations.json';
import milestonesData from '@content/data/milestones.json';
import { LotusLogo } from '../common/LotusLogo';
import religareLogo from '../../assets/RELIGARE.NS_BIG.svg';

export const BrokingPartnerFrame: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const nseReg = registrationsData.find((r) => r.id === 'religare_ap_nse');
  const bseReg = registrationsData.find((r) => r.id === 'religare_ap_bse');

  // Religare Broking Limited's SEBI broker registration number ONLY if verified: true in registrations.json
  const brokerReg = registrationsData.find(
    (r) => (r.id === 'religare_sebi_broker' || r.id === 'religare_broker') && r.verified === true
  );

  // Partnership milestone
  const partnerMilestone = milestonesData.find((m) => m.year === 2008);
  const partnerSinceText = partnerMilestone ? `Partner since ${partnerMilestone.year}` : 'Partner since 2008';

  const nseCode = nseReg?.number || 'AP007909931';
  const bseCode = bseReg?.number || 'AP0130040172963';

  const handleCopy = (code: string, label: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedCode(label);
        setTimeout(() => setCopiedCode(null), 2200);
      });
    }
  };

  return (
    <section
      id="broking"
      data-tone="dark"
      className="broking-partner-frame stacked-section"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--navy-900, #0A2540)',
        backgroundImage: 'linear-gradient(180deg, var(--navy-950, #071B30) 0%, var(--navy-900, #0A2540) 100%)',
        position: 'relative',
        padding: '5rem 1.5rem',
        overflow: 'hidden',
        borderTop: '1px solid rgba(215, 217, 220, 0.12)',
        borderBottom: '1px solid rgba(215, 217, 220, 0.12)',
      }}
    >
      {/* Background Watermark */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '-80px',
          bottom: '-60px',
          width: '520px',
          height: '520px',
          opacity: 0.035,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <LotusLogo variant="watermark" width="100%" height="100%" />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1240px' }}>
        <div
          className="broking-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 45%) minmax(320px, 55%)',
            alignItems: 'center',
            gap: '3.5rem',
          }}
        >
          {/* Left 45%: Animated Authorised Person Seal */}
          <div
            className="broking-seal-column"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              className="authorised-person-seal"
              style={{
                position: 'relative',
                width: '320px',
                height: '320px',
                maxWidth: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Outer static concentric thin ring */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '1px solid rgba(143, 163, 200, 0.22)',
                  boxShadow: '0 0 35px rgba(79, 95, 176, 0.22)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: '14px',
                  borderRadius: '50%',
                  border: '1px dashed rgba(143, 163, 200, 0.35)',
                }}
              />

              {/* Rotating Ring with Text: AUTHORISED PERSON • RELIGARE BROKING LIMITED */}
              <svg
                className="rotating-seal-svg"
                viewBox="0 0 300 300"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                }}
              >
                <defs>
                  <path
                    id="sealCirclePath"
                    d="M 150, 150 m -112, 0 a 112,112 0 1,1 224,0 a 112,112 0 1,1 -224,0"
                  />
                </defs>
                <text
                  fill="var(--silver-300, #D7D9DC)"
                  fontSize="9.5"
                  fontWeight="600"
                  style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}
                >
                  <textPath
                    href="#sealCirclePath"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    AUTHORISED PERSON • RELIGARE BROKING LIMITED •
                  </textPath>
                </text>
              </svg>

              {/* Inner Circle with Lotus Mark */}
              <div
                style={{
                  position: 'relative',
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(10, 37, 64, 0.85)',
                  border: '1.5px solid rgba(143, 163, 200, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 0 20px rgba(79, 95, 176, 0.4)',
                  zIndex: 2,
                }}
              >
                <div style={{ width: '48px', height: '48px', color: '#FFFFFF', marginBottom: '0.35rem' }}>
                  <LotusLogo variant="light" width="100%" height="100%" />
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: '#D7D9DC',
                    fontWeight: 700,
                  }}
                >
                  AUTHORISED
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: '#8FA3C8',
                    fontWeight: 600,
                  }}
                >
                  PERSON
                </span>
              </div>
            </div>

            {/* Timeline Chip: Partner since 2008 */}
            <div
              style={{
                marginTop: '1.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1.1rem',
                backgroundColor: 'rgba(79, 95, 176, 0.15)',
                border: '1px solid rgba(143, 163, 200, 0.28)',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                color: '#D7D9DC',
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#4F5FB0',
                }}
              />
              <span>{partnerSinceText}</span>
              <span style={{ color: '#8FA3C8', fontSize: '0.72rem' }}>• 18+ Years</span>
            </div>
          </div>

          {/* Right 55%: Broking Partner Credentials & Code Cards */}
          <div className="broking-info-column" style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Top row: Eyebrow & Religare Logo Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <span
                className="eyebrow"
                style={{
                  color: '#8FA3C8',
                  letterSpacing: '0.14em',
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                BROKING PARTNER
              </span>

              {/* Religare logo on trimmed white pill */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '0.45rem 1.25rem',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(215, 217, 220, 0.4)',
                }}
              >
                <img
                  src={religareLogo}
                  alt="Religare Broking"
                  style={{
                    height: '28px',
                    maxWidth: '150px',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>
            </div>

            {/* Playfair Heading */}
            <h2
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: 'clamp(1.9rem, 3.2vw, 2.75rem)',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.2,
                marginBottom: '1.25rem',
              }}
            >
              Lotus Capital is an Authorised Person of{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  color: '#D7D9DC',
                  fontWeight: 400,
                }}
              >
                Religare Broking Limited
              </em>
            </h2>

            {/* One single authoritative paragraph from 08-equity.md */}
            <p
              style={{
                color: '#D7D9DC',
                fontSize: '1.02rem',
                lineHeight: 1.7,
                marginBottom: '2rem',
                maxWidth: '680px',
              }}
            >
              Share prices can rise and fall, and investors can lose part or all of the money invested.
              Equity services at Lotus Capital are offered as an Authorised Person of Religare Broking
              Limited. Speak with the team to confirm the service, the process, the costs and the
              disclosures before you begin.
            </p>

            {/* Two Large AP Code Cards with Copy Buttons */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
                marginBottom: '1rem',
              }}
            >
              {/* NSE AP Code Card */}
              <div
                className="broking-code-card"
                style={{
                  backgroundColor: 'var(--navy-800, #0E3154)',
                  border: '1px solid rgba(215, 217, 220, 0.12)',
                  borderRadius: '20px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.85rem',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                  transition: 'transform 0.24s ease, border-color 0.24s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: 'rgba(79, 95, 176, 0.3)',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(143, 163, 200, 0.3)',
                    }}
                  >
                    NSE
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#8FA3C8' }}>Authorised Person</span>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#8FA3C8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    NSE Registration Code
                  </div>
                  <div
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      letterSpacing: '0.04em',
                      fontFamily: 'monospace',
                      marginTop: '0.25rem',
                    }}
                  >
                    {nseCode}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(nseCode, 'NSE')}
                  className="broking-copy-btn"
                  style={{
                    alignSelf: 'flex-start',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.85rem',
                    backgroundColor: copiedCode === 'NSE' ? '#123D67' : 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(143, 163, 200, 0.3)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  aria-label={`Copy NSE Authorised Person Code ${nseCode}`}
                >
                  {copiedCode === 'NSE' ? (
                    <>
                      <span style={{ color: '#8FA3C8' }}>✓</span> Copied
                    </>
                  ) : (
                    <>
                      <span>📋</span> Copy Code
                    </>
                  )}
                </button>
              </div>

              {/* BSE AP Code Card */}
              <div
                className="broking-code-card"
                style={{
                  backgroundColor: 'var(--navy-800, #0E3154)',
                  border: '1px solid rgba(215, 217, 220, 0.12)',
                  borderRadius: '20px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.85rem',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                  transition: 'transform 0.24s ease, border-color 0.24s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: 'rgba(18, 61, 103, 0.45)',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(143, 163, 200, 0.3)',
                    }}
                  >
                    BSE
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#8FA3C8' }}>Authorised Person</span>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#8FA3C8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    BSE Registration Code
                  </div>
                  <div
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      letterSpacing: '0.04em',
                      fontFamily: 'monospace',
                      marginTop: '0.25rem',
                    }}
                  >
                    {bseCode}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(bseCode, 'BSE')}
                  className="broking-copy-btn"
                  style={{
                    alignSelf: 'flex-start',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.85rem',
                    backgroundColor: copiedCode === 'BSE' ? '#123D67' : 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(143, 163, 200, 0.3)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  aria-label={`Copy BSE Authorised Person Code ${bseCode}`}
                >
                  {copiedCode === 'BSE' ? (
                    <>
                      <span style={{ color: '#8FA3C8' }}>✓</span> Copied
                    </>
                  ) : (
                    <>
                      <span>📋</span> Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* SEBI Broker Registration rendered ONLY if verified: true in registrations.json */}
            {brokerReg && (
              <div
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#8FA3C8',
                }}
              >
                Religare Broking Limited SEBI Registration: {brokerReg.number}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
