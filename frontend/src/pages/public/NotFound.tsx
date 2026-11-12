import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useContactDrawer } from '../../context/ContactDrawerContext';
import { LotusLogo } from '../../components/common/LotusLogo';

export const NotFound: React.FC = () => {
  const { openContactDrawer } = useContactDrawer();

  return (
    <>
      <Helmet>
        <title>Not Found | Lotus Capital</title>
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
            aria-label="Breadcrumb inside 404 hero"
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
            <span style={{ color: '#ffffff', fontWeight: 500 }}>Page Not Found</span>
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
                backgroundColor: 'var(--red-500, #D9232D)',
              }}
            />
            PAGE NOT FOUND • ERROR 404
          </div>
        </div>
      </section>

      {/* Main 404 Card on Silver-Grey Canvas */}
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
          overflow: 'hidden',
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
            {/* 404 Numerical Indicator */}
            <div
              style={{
                fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                fontSize: 'clamp(3.5rem, 6vw, 4.5rem)',
                fontWeight: 700,
                color: 'var(--navy-900, #0A2540)',
                lineHeight: 1,
                marginBottom: '1rem',
                letterSpacing: '-0.02em',
              }}
            >
              4<span style={{ color: 'var(--red-500, #D9232D)' }}>0</span>4
            </div>

            {/* Display H1 */}
            <h1
              style={{
                fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                lineHeight: 1.25,
                fontWeight: 600,
                color: 'var(--navy-900, #0A2540)',
                margin: '0 0 1rem',
              }}
            >
              We couldn&apos;t find that page.
            </h1>

            {/* Descriptive Text from 18-404.md */}
            <p
              style={{
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                color: 'var(--silver-700, #475569)',
                margin: '0 0 2.25rem',
                maxWidth: '560px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              The link may be outdated or the address may have been entered incorrectly. You can return to the homepage or browse our services.
            </p>

            {/* Quick Navigation Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                marginBottom: '2.5rem',
                textAlign: 'left',
              }}
            >
              <Link
                to="/services"
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '1.25rem',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.backgroundColor = '#F1F5F9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                }}
              >
                <div style={{ fontSize: '1.1rem' }}>🏛️</div>
                <div style={{ fontWeight: 600, color: 'var(--navy-900, #0A2540)', fontSize: '0.92rem' }}>
                  Explore Services
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Insurance, mutual funds &amp; equity
                </div>
              </Link>

              <Link
                to="/insights"
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '1.25rem',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.backgroundColor = '#F1F5F9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                }}
              >
                <div style={{ fontSize: '1.1rem' }}>📖</div>
                <div style={{ fontWeight: 600, color: 'var(--navy-900, #0A2540)', fontSize: '0.92rem' }}>
                  Financial Insights
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Guides &amp; jargon busters
                </div>
              </Link>

              <button
                type="button"
                onClick={(e) => openContactDrawer(undefined, e.currentTarget)}
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.backgroundColor = '#F1F5F9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                }}
              >
                <div style={{ fontSize: '1.1rem' }}>💬</div>
                <div style={{ fontWeight: 600, color: 'var(--navy-900, #0A2540)', fontSize: '0.92rem' }}>
                  Talk to an Advisor
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Open quick consultation drawer
                </div>
              </button>
            </div>

            {/* Primary Action Button */}
            <div>
              <Link
                to="/"
                className="btn btn-primary"
                style={{
                  backgroundColor: 'var(--red-500, #D9232D)',
                  borderColor: 'var(--red-500, #D9232D)',
                  borderRadius: '24px',
                  padding: '0.8rem 2rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: '#ffffff',
                  display: 'inline-block',
                }}
              >
                Return to Homepage &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
