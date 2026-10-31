import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { LotusLogo } from '../../components/common/LotusLogo';

export const EnquiryThankYou: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref');
  const [copied, setCopied] = useState(false);

  const handleCopyRef = () => {
    if (ref) {
      navigator.clipboard.writeText(ref);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <Helmet>
        <title>Thank You | Lotus Capital</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Slim Navy Band Hero */}
      <section
        style={{
          position: 'relative',
          backgroundColor: 'var(--navy-950, #06182c)',
          backgroundImage: `
            linear-gradient(135deg, #07192d 0%, #0a2540 60%, #123d67 100%)
          `,
          color: 'var(--white, #ffffff)',
          paddingTop: 'calc(var(--header-h, 76px) + 20px)',
          paddingBottom: '2.5rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(to right, rgba(215, 217, 220, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(215, 217, 220, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 3, maxWidth: '840px', textAlign: 'center' }}>
          {/* Breadcrumb INSIDE hero */}
          <nav
            aria-label="Breadcrumb inside thank you hero"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              color: 'var(--silver-300, #d7d9dc)',
              marginBottom: '0.85rem',
            }}
          >
            <Link
              to="/"
              style={{
                color: 'var(--silver-300, #d7d9dc)',
                textDecoration: 'none',
              }}
            >
              Home
            </Link>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>&gt;</span>
            <span style={{ color: '#ffffff', fontWeight: 500 }}>Enquiry Confirmation</span>
          </nav>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              fontSize: '0.74rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#8FA3C8',
              marginBottom: '0.5rem',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--green-500, #10B981)',
              }}
            />
            ENQUIRY RECEIVED • GODHRA, GUJARAT
          </div>
        </div>
      </section>

      {/* Main Card on Silver-Grey Canvas */}
      <div
        style={{
          backgroundColor: '#EEF1F4',
          minHeight: '70vh',
          backgroundImage: `
            radial-gradient(#CBD5E1 1px, transparent 1px),
            linear-gradient(to bottom, #EEF1F4 0%, #E6EAF0 100%)
          `,
          backgroundSize: '24px 24px, 100% 100%',
          paddingTop: '3rem',
          paddingBottom: '5rem',
          position: 'relative',
        }}
      >
        {/* Subtle Watermark */}
        <div
          style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            width: '360px',
            height: '360px',
            opacity: 0.04,
            pointerEvents: 'none',
          }}
        >
          <LotusLogo variant="watermark" width="100%" height="100%" />
        </div>

        <div className="container" style={{ maxWidth: '720px', position: 'relative', zIndex: 2 }}>
          <div
            className="card"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '32px',
              padding: 'clamp(2rem, 5vw, 3.5rem)',
              boxShadow: '0 12px 36px rgba(18, 61, 103, 0.06), 0 2px 8px rgba(18, 61, 103, 0.04)',
              border: '1px solid rgba(215, 217, 220, 0.7)',
              textAlign: 'center',
            }}
          >
            {/* Green Success Icon Badge */}
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                color: 'var(--green-600, #16a34a)',
                border: '2px solid rgba(22, 163, 74, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                margin: '0 auto 1.5rem',
                boxShadow: '0 4px 16px rgba(22, 163, 74, 0.15)',
              }}
            >
              ✓
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                fontSize: 'clamp(1.85rem, 3.2vw, 2.4rem)',
                lineHeight: 1.25,
                fontWeight: 600,
                color: 'var(--navy-900, #0A2540)',
                margin: '0 0 1rem',
              }}
            >
              Thank you for contacting Lotus Capital.
            </h1>

            {/* Subtext */}
            <p
              style={{
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                color: 'var(--silver-700, #475569)',
                margin: '0 0 2rem',
              }}
            >
              Your enquiry has been received. Our team will review the details and contact you by your chosen method, during business hours.
            </p>

            {/* Reference Box */}
            {ref && (
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '1.25rem 1.75rem',
                  marginBottom: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
                data-testid="enquiry-ref"
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--silver-500, #64748b)' }}>
                    Enquiry Reference
                  </div>
                  <strong
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '1.2rem',
                      color: 'var(--navy-900, #0A2540)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {ref}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={handleCopyRef}
                  style={{
                    backgroundColor: copied ? 'rgba(22, 163, 74, 0.1)' : '#ffffff',
                    color: copied ? 'var(--green-600, #16a34a)' : 'var(--navy-800, #123D67)',
                    border: `1px solid ${copied ? 'rgba(22, 163, 74, 0.3)' : '#cbd5e1'}`,
                    borderRadius: '12px',
                    padding: '0.45rem 0.9rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {copied ? '✓ Copied' : 'Copy Code'}
                </button>
              </div>
            )}

            {/* What Happens Next Timeline */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '20px',
                padding: '1.5rem',
                border: '1px solid #E2E8F0',
                marginBottom: '2.25rem',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--navy-700, #123D67)',
                  marginBottom: '0.85rem',
                }}
              >
                What to Expect Next
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#334155' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--red-500, #D9232D)', fontWeight: 700 }}>1.</span>
                  <div><strong>Review:</strong> An advisor reviews your request against your selected service category.</div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--red-500, #D9232D)', fontWeight: 700 }}>2.</span>
                  <div><strong>Direct Contact:</strong> We connect with you via your preferred channel during working hours.</div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--red-500, #D9232D)', fontWeight: 700 }}>3.</span>
                  <div><strong>Confidential Guidance:</strong> Clear conversation explaining next steps with zero pressure.</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/"
                className="btn btn-primary"
                style={{
                  backgroundColor: 'var(--red-500, #D9232D)',
                  borderColor: 'var(--red-500, #D9232D)',
                  borderRadius: '24px',
                  padding: '0.75rem 1.6rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: '#ffffff',
                }}
              >
                Return to Home
              </Link>
              <Link
                to="/services"
                className="btn btn-secondary"
                style={{
                  borderRadius: '24px',
                  padding: '0.75rem 1.6rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Explore Our Services
              </Link>
            </div>

            {/* Security Caution */}
            <div
              style={{
                marginTop: '2rem',
                paddingTop: '1rem',
                borderTop: '1px solid #f1f5f9',
                fontSize: '0.78rem',
                color: 'var(--silver-500, #94a3b8)',
              }}
            >
              Please note: Lotus Capital will never ask for your passwords, OTPs, or bank account PINs.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
