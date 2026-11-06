import { useContactDrawer } from '../../context/ContactDrawerContext';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import seoData from '@content/data/seo.json';
import awardsData from '@content/data/awards.json';
import partnersData from '@content/data/partners.json';
import contactData from '@content/data/contact.json';
import siteData from '@content/data/site.json';
import teamData from '@content/data/team.json';
import { useStatistics } from '../../hooks/useStatistics';
import { useCountUp } from '../../hooks/useCountUp';
import { LotusLogo } from '../../components/common/LotusLogo';
import { ScrollProgressBar } from '../../components/common/ScrollProgressBar';
import { OurJourneyTimeline } from '../../components/about/OurJourneyTimeline';

const AnimatedNum: React.FC<{ value: string; isDark?: boolean }> = ({ value, isDark }) => {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
    return <span className={isDark ? 'text-white' : ''}>{value}</span>;
  }
  const match = value.match(/^([^\d]*)(\d+)(.*)$/);
  if (!match) {
    return <span className={isDark ? 'text-white' : ''}>{value}</span>;
  }
  const prefix = match[1];
  const num = parseInt(match[2], 10);
  const suffix = match[3];
  const animated = useCountUp(num, 1600);

  return (
    <span className={isDark ? 'text-white' : ''} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {animated.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
};

export const AboutUs: React.FC = () => {
  const { openContactDrawer } = useContactDrawer();
  const seo = seoData['/about-us'];
  const [searchParams] = useSearchParams();
  const sectionQuery = searchParams.get('section');
  const { stats, statsAsOf } = useStatistics([
    'clients_serviced',
    'mf_folios',
    'demat_accounts',
    'insurance_policies_total',
  ]);

  const confirmedPartners = partnersData.filter((p) => p.status === 'confirmed');
  const abhilash = teamData.find((t) => t.id === 'abhilash-chudasama') || teamData[0];
  const kajal = teamData.find((t) => t.id === 'kajal-chudasama') || teamData[1];

  useEffect(() => {
    if (sectionQuery) {
      const scrollTarget = () => {
        const el = document.getElementById(sectionQuery);
        if (el) {
          window.scrollTo({ top: Math.max(0, el.offsetTop - 70), behavior: 'instant' as ScrollBehavior });
        }
      };
      scrollTarget();
      const t1 = setTimeout(scrollTarget, 80);
      const t2 = setTimeout(scrollTarget, 250);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [sectionQuery]);

  // Filter out any image loading error for Kajal photo
  const [kajalImgError, setKajalImgError] = useState(false);

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Red Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* 1. HERO SECTION (FINRE reference: portrait right, headline + copy + 3 chips left) */}
      <section id="hero" data-tone="dark" className="about-hero-section" aria-label="About Lotus Capital Hero">
        <div
          style={{
            position: 'absolute',
            right: '-60px',
            bottom: '-60px',
            width: '460px',
            height: '460px',
            opacity: 0.05,
            pointerEvents: 'none',
          }}
        >
          <LotusLogo variant="watermark" width="100%" height="100%" />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="about-hero-grid">
            {/* Left Content */}
            <div>
              <div className="eyebrow-rule" />
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--red-400)',
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--red-500)',
                  }}
                />
                About Lotus Capital
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.3rem, 4.4vw, 3.8rem)',
                  lineHeight: 1.15,
                  marginBottom: '1.5rem',
                  color: 'var(--white)',
                  fontWeight: 700,
                }}
              >
                Financial decisions deserve{' '}
                <span
                  style={{
                    fontStyle: 'italic',
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #D7D9DC 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  clear conversations.
                </span>
              </h1>

              <p
                style={{
                  fontSize: '1.12rem',
                  color: 'var(--silver-300)',
                  lineHeight: 1.7,
                  marginBottom: '2rem',
                  maxWidth: '640px',
                }}
              >
                Lotus Capital is a financial services business based in Godhra, Gujarat. We provide
                access to insurance, mutual funds, equity and other financial solutions for
                individuals and families. Our approach is to explain the options, the costs and the
                risks, and then help clients with the process.
              </p>

              {/* CTAs */}
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  marginBottom: '2.5rem',
                }}
              >
                <button type="button" onClick={(e) => openContactDrawer(undefined, e.currentTarget)} className="btn btn-primary btn-lg" style={{ border: "none", cursor: "pointer" }}>
                  Discuss Your Goals &rarr;
                </button>
                <Link
                  to="/services"
                  className="btn btn-outline btn-lg"
                  style={{
                    color: 'var(--white)',
                    borderColor: 'rgba(215, 217, 220, 0.4)',
                    background: 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  Explore Our Services
                </Link>
              </div>

              {/* 3 Count-up Stat Chips */}
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(215, 217, 220, 0.15)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(8px)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid rgba(215, 217, 220, 0.18)',
                  }}
                >
                  <span style={{ color: 'var(--red-400)', fontSize: '1rem' }}>👥</span>
                  <div style={{ fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--white)', marginRight: '0.35rem' }}>
                      <AnimatedNum value="2500+" isDark />
                    </strong>
                    <span style={{ color: 'var(--silver-400)' }}>Clients</span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(8px)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid rgba(215, 217, 220, 0.18)',
                  }}
                >
                  <span style={{ color: 'var(--red-400)', fontSize: '1rem' }}>📈</span>
                  <div style={{ fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--white)', marginRight: '0.35rem' }}>
                      <AnimatedNum value="1200+" isDark />
                    </strong>
                    <span style={{ color: 'var(--silver-400)' }}>MF Folios</span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(8px)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid rgba(215, 217, 220, 0.18)',
                  }}
                >
                  <span style={{ color: 'var(--red-400)', fontSize: '1rem' }}>📊</span>
                  <div style={{ fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--white)', marginRight: '0.35rem' }}>
                      <AnimatedNum value="800+" isDark />
                    </strong>
                    <span style={{ color: 'var(--silver-400)' }}>Demat A/Cs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Portrait Frame */}
            <div className="about-portrait-card">
              <div className="about-portrait-card__frame">
                <img
                  src={abhilash.photoPath}
                  alt={abhilash.name}
                  className="about-portrait-card__img"
                />
              </div>

              {/* Floating Card */}
              <div className="about-floating-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--red-500)' }} />
                  <strong style={{ fontSize: '0.9rem', color: 'var(--white)' }}>Grounded in Godhra</strong>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--silver-300)', margin: 0, lineHeight: 1.4 }}>
                  Serving families across Gujarat since 2006. AMFI ARN-160174.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PHILOSOPHY SECTION (Enlarged, moved UP directly below hero) */}
      <section id="philosophy" data-tone="light" className="section-padding bg-light stacked-section" data-reveal>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
            <div className="eyebrow-rule" style={{ margin: '0 auto 1rem' }} />
            <span className="eyebrow">Our Philosophy</span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                color: 'var(--navy-900)',
                marginBottom: '1rem',
              }}
            >
              Principles That Guide Every Recommendation
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.6 }}>
              Royalty through security. Premium through simplicity. Trust through transparency.
            </p>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
            {/* Card 01: Clarity */}
            <div className="philosophy-card">
              <span className="philosophy-card__num">01</span>
              <div>
                <div className="philosophy-card__icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
                  Simple Clarity
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>
                  Jargon-free explanations of fees, commissions, lock-ins and tax rules. We explain
                  every choice in terms you understand, giving you the clarity needed to make sound
                  decisions without confusion.
                </p>
              </div>
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--silver-300)', fontSize: '0.8rem', color: 'var(--red-600)', fontWeight: 600 }}>
                Transparent advisory &rarr;
              </div>
            </div>

            {/* Card 02: Responsible Communication */}
            <div className="philosophy-card">
              <span className="philosophy-card__num">02</span>
              <div>
                <div className="philosophy-card__icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
                  Responsible Communication
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>
                  No aggressive sales pressure. We objectively assess your family's actual protection
                  and wealth requirements before recommending any solution, prioritizing long-term
                  safety over short-term transactions.
                </p>
              </div>
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--silver-300)', fontSize: '0.8rem', color: 'var(--red-600)', fontWeight: 600 }}>
                Needs-based guidance &rarr;
              </div>
            </div>

            {/* Card 03: Service */}
            <div className="philosophy-card">
              <span className="philosophy-card__num">03</span>
              <div>
                <div className="philosophy-card__icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
                  Lifelong Service
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>
                  Personal, hands-on local assistance. From regular investment reviews to navigating
                  health insurance hospitalizations and life insurance claim documentation, we remain
                  by your side for decades.
                </p>
              </div>
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--silver-300)', fontSize: '0.8rem', color: 'var(--red-600)', fontWeight: 600 }}>
                End-to-end claim support &rarr;
              </div>
            </div>

            {/* Card 04: Transparency */}
            <div className="philosophy-card">
              <span className="philosophy-card__num">04</span>
              <div>
                <div className="philosophy-card__icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
                  Full Transparency
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>
                  Open credentials and regulatory disclosures. We openly disclose our AMFI, SEBI/Religare,
                  and insurance registrations, presenting terms, risks, and commissions candidly with
                  zero hidden clauses.
                </p>
              </div>
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--silver-300)', fontSize: '0.8rem', color: 'var(--red-600)', fontWeight: 600 }}>
                Verified registrations &rarr;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NUMBERS SECTION (Rounded panel, 4 count-up tiles, quiet caption) */}
      <section id="numbers" data-tone="dark" className="section-padding stacked-section" data-reveal>
        <div className="container">
          <div className="numbers-banner">
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
              <span
                style={{
                  color: 'var(--red-400)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Track Record
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 3.2vw, 2.5rem)',
                  color: 'var(--white)',
                  marginBottom: '0.75rem',
                }}
              >
                Lotus Capital in Numbers
              </h2>
              <p style={{ color: 'var(--silver-300)', fontSize: '0.95rem', margin: 0 }}>
                Two decades of measured, disciplined guidance across Panchmahals and Gujarat.
              </p>
            </div>

            <div className="grid grid-cols-4" style={{ gap: '1.5rem' }}>
              {stats.map((s) => (
                <div key={s.id} className="numbers-tile">
                  <div className="numbers-tile__val">
                    <AnimatedNum value={s.value} isDark />
                  </div>
                  <div className="numbers-tile__line" />
                  <div
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: 'var(--silver-200)',
                      lineHeight: 1.35,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Quiet caption (G1: Figures as of October 2026) */}
            <p
              style={{
                textAlign: 'center',
                fontSize: '0.85rem',
                color: 'var(--silver-400)',
                marginTop: '2.5rem',
                marginBottom: 0,
                borderTop: '1px solid rgba(215, 217, 220, 0.12)',
                paddingTop: '1.25rem',
              }}
            >
              Figures as of {statsAsOf || siteData.statsAsOf || 'October 2026'}
            </p>
          </div>
        </div>
      </section>

      {/* 4. FOUNDERS SECTION (Abhilash left, Kajal right mirrored) */}
      <section id="founders" data-tone="light" className="section-padding bg-light stacked-section" data-reveal>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
            <div className="eyebrow-rule" style={{ margin: '0 auto 1rem' }} />
            <span className="eyebrow">Leadership</span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                color: 'var(--navy-900)',
                marginBottom: '1rem',
              }}
            >
              Meet the People Behind Lotus Capital
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.6 }}>
              Local accountability backed by recognized certifications and two decades of client service.
            </p>
          </div>

          {/* Profile 1: Abhilash Chudasama */}
          <div className="founder-profile-card" style={{ marginBottom: '3rem' }}>
            {/* Left Arch Frame */}
            <div className="founder-arch-frame">
              <img src={abhilash.photoPath} alt={abhilash.name} />
            </div>

            {/* Right Details */}
            <div>
              <span className="eyebrow" style={{ color: 'var(--red-600)' }}>
                {abhilash.designation}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 2.5vw, 2.2rem)',
                  color: 'var(--navy-900)',
                  marginBottom: '1rem',
                  lineHeight: 1.2,
                }}
              >
                {abhilash.name}
              </h3>

              {/* Quote */}
              <blockquote
                style={{
                  fontStyle: 'italic',
                  color: 'var(--navy-800)',
                  fontSize: '1.05rem',
                  lineHeight: 1.6,
                  borderLeft: '3px solid var(--red-500)',
                  paddingLeft: '1.25rem',
                  margin: '0 0 1.25rem 0',
                }}
              >
                &ldquo;True wealth management begins with listening, not selling. Our goal is to
                ensure every family in Godhra and beyond moves forward with absolute confidence in
                their financial safety.&rdquo;
              </blockquote>

              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                {abhilash.bio}
              </p>

              {/* Credential Pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--silver-100)',
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--silver-300)',
                    fontSize: '0.85rem',
                    color: 'var(--navy-900)',
                  }}
                >
                  <span style={{ color: 'var(--red-600)', fontWeight: 700 }}>✓</span>
                  <span><strong>Mutual Funds:</strong> AMFI Registered Distributor (ARN-160174)</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--silver-100)',
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--silver-300)',
                    fontSize: '0.85rem',
                    color: 'var(--navy-900)',
                  }}
                >
                  <span style={{ color: 'var(--red-600)', fontWeight: 700 }}>✓</span>
                  <span><strong>Equity:</strong> Authorised Person of Religare Broking Ltd (NSE AP007909931 · BSE AP0130040172963)</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--silver-100)',
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--silver-300)',
                    fontSize: '0.85rem',
                    color: 'var(--navy-900)',
                  }}
                >
                  <span style={{ color: 'var(--red-600)', fontWeight: 700 }}>✓</span>
                  <span><strong>Insurance:</strong> Partner Agency Representative (Care Health, LIC, HDFC Life)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile 2: Kajal Chudasama (Mirrored) */}
          <div className="founder-profile-card founder-profile-card--reversed">
            {/* Left Details */}
            <div>
              <span className="eyebrow" style={{ color: 'var(--red-600)' }}>
                {kajal.designation}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 2.5vw, 2.2rem)',
                  color: 'var(--navy-900)',
                  marginBottom: '1rem',
                  lineHeight: 1.2,
                }}
              >
                {kajal.name}
              </h3>

              <p style={{ fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                {kajal.bio}
              </p>

              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                Kajal drives operational rigor, application processing, and client coordination at Lotus
                Capital. Her proactive communication ensures investors and policyholders experience prompt
                query resolution and compassionate guidance during claims.
              </p>

              {/* Focus Areas */}
              <div className="grid grid-cols-2" style={{ gap: '0.75rem' }}>
                <div
                  style={{
                    background: 'var(--silver-100)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--silver-300)',
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--navy-900)', marginBottom: '0.2rem' }}>
                    Client Servicing
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                    End-to-end claims & renewals
                  </span>
                </div>

                <div
                  style={{
                    background: 'var(--silver-100)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--silver-300)',
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--navy-900)', marginBottom: '0.2rem' }}>
                    Operations & Coordination
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                    Compliance & records management
                  </span>
                </div>
              </div>
            </div>

            {/* Right Arch Frame */}
            <div className="founder-arch-frame">
              {!kajalImgError ? (
                <img
                  src={kajal.photoPath}
                  alt={kajal.name}
                  onError={() => setKajalImgError(true)}
                />
              ) : (
                <div className="founder-monogram-frame">
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '3.5rem',
                      fontWeight: 700,
                      color: 'var(--red-400)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    KC
                  </div>
                  <strong style={{ color: 'var(--white)', fontSize: '1.1rem' }}>
                    Kajal Chudasama
                  </strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--silver-400)', marginTop: '0.25rem' }}>
                    Co-founder · Operations
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. MILESTONES SECTION (B4: Pinned horizontal scroll timeline graph) */}
      <OurJourneyTimeline />

      {/* 6. AWARDS SECTION (3-column responsive grid, laurel icon, large year) */}
      <section id="awards" data-tone="light" className="section-padding bg-light stacked-section" data-reveal>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
            <div className="eyebrow-rule" style={{ margin: '0 auto 1rem' }} />
            <span className="eyebrow">Industry Recognition</span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                color: 'var(--navy-900)',
                marginBottom: '1rem',
              }}
            >
              Honours & Recognitions
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.6 }}>
              Historical distributor excellence recognitions conferred by industry institutions.
            </p>
          </div>

          <div className="grid grid-cols-3" style={{ gap: '1.75rem' }}>
            {awardsData.map((award) => (
              <div key={award.id} className="award-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(233, 35, 50, 0.08)',
                        color: 'var(--red-600)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                      }}
                    >
                      🏆
                    </div>
                    <span className="award-card__year">{award.year}</span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.15rem',
                      color: 'var(--navy-900)',
                      lineHeight: 1.4,
                      marginBottom: '1rem',
                    }}
                  >
                    {award.award}
                  </h3>
                </div>

                <div style={{ borderTop: '1px solid var(--silver-300)', paddingTop: '0.85rem' }}>
                  {award.issuedBy ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      Conferred by: <strong style={{ color: 'var(--navy-800)' }}>{award.issuedBy}</strong>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: 'var(--silver-500)', fontStyle: 'italic' }}>
                      Distributor Recognition
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PARTNERS SECTION (Large 280x160 tiles, 2-row marquee in opposite directions) */}
      <section id="partners" data-tone="light" className="section-padding stacked-section" data-reveal>
        <div className="container" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="eyebrow-rule" style={{ margin: '0 auto 1rem' }} />
          <span className="eyebrow">Institutional Relationships</span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              color: 'var(--navy-900)',
              marginBottom: '0.75rem',
            }}
          >
            Trusted Industry Partners
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
            Empowering client portfolios through established partnerships with India&apos;s leading financial institutions.
          </p>
        </div>

        {/* Marquee Row 1 (Scroll Left) */}
        <div className="marquee-row-wrapper" style={{ marginBottom: '1.5rem', overflow: 'hidden' }}>
          <div className="marquee-track-left">
            {[...confirmedPartners, ...confirmedPartners].map((partner, index) => (
              <div
                key={`row1-${partner.id}-${index}`}
                className="partner-logo-tile"
                title={`${partner.name} — ${partner.relationshipLabel}`}
              >
                <img
                  src={partner.logoPlaceholder}
                  alt={partner.name}
                  style={{
                    maxHeight: '65px',
                    maxWidth: '180px',
                    objectFit: 'contain',
                    marginBottom: '0.75rem',
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>
                  {partner.relationshipLabel}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Row 2 (Scroll Right) */}
        <div className="marquee-row-wrapper" style={{ overflow: 'hidden' }}>
          <div className="marquee-track-right">
            {[...confirmedPartners, ...confirmedPartners].reverse().map((partner, index) => (
              <div
                key={`row2-${partner.id}-${index}`}
                className="partner-logo-tile"
                title={`${partner.name} — ${partner.relationshipLabel}`}
              >
                <img
                  src={partner.logoPlaceholder}
                  alt={partner.name}
                  style={{
                    maxHeight: '65px',
                    maxWidth: '180px',
                    objectFit: 'contain',
                    marginBottom: '0.75rem',
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>
                  {partner.relationshipLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. LOCATION SECTION (Split: Address card left, Google Map iframe right) */}
      <section id="location" data-tone="light" className="section-padding bg-light stacked-section" data-reveal>
        <div className="container">
          <div className="location-split-grid">
            {/* Left Address Card */}
            <div
              style={{
                background: 'var(--white)',
                border: '1px solid rgba(215, 217, 220, 0.5)',
                borderRadius: 'var(--radius-panel)',
                padding: '3rem',
                boxShadow: 'var(--shadow-soft)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span className="eyebrow" style={{ color: 'var(--red-600)' }}>
                  Visit Our Godhra Office
                </span>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.85rem, 2.8vw, 2.4rem)',
                    color: 'var(--navy-900)',
                    marginBottom: '1.25rem',
                    lineHeight: 1.25,
                  }}
                >
                  Conveniently Located in Godhra
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                  We welcome personal consultations at our office. Come discuss your insurance coverage,
                  mutual fund plans, or portfolio questions directly with our team.
                </p>

                {/* Details List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(18, 61, 103, 0.08)',
                        color: 'var(--navy-800)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      📍
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--navy-900)', fontSize: '0.95rem' }}>
                        Office Address
                      </strong>
                      <span style={{ color: 'var(--ink)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        {contactData.address.full}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(18, 61, 103, 0.08)',
                        color: 'var(--navy-800)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      📞
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--navy-900)', fontSize: '0.95rem' }}>
                        Phone
                      </strong>
                      <a
                        href={`tel:${contactData.phone}`}
                        style={{ color: 'var(--red-600)', fontWeight: 600, fontSize: '0.95rem' }}
                      >
                        {contactData.phoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(18, 61, 103, 0.08)',
                        color: 'var(--navy-800)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      ✉️
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--navy-900)', fontSize: '0.95rem' }}>
                        Email
                      </strong>
                      <a
                        href={`mailto:${contactData.email}`}
                        style={{ color: 'var(--navy-800)', fontSize: '0.9rem' }}
                      >
                        {contactData.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href={contactData.mapsShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <span>Get Directions</span>
                  <span>↗</span>
                </a>
                <a
                  href={`tel:${contactData.phone}`}
                  className="btn btn-secondary"
                >
                  Call Office
                </a>
              </div>
            </div>

            {/* Right Google Map iframe */}
            <div
              style={{
                borderRadius: 'var(--radius-panel)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-soft)',
                border: '1px solid rgba(215, 217, 220, 0.4)',
                minHeight: '440px',
                background: 'var(--silver-200)',
              }}
            >
              <iframe
                src={contactData.mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '440px', display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lotus Capital Godhra Office Location Map"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CTA STRIP */}
      <section
        id="about-cta"
        data-tone="dark"
        className="stacked-section"
        style={{
          background: 'linear-gradient(135deg, var(--navy-950) 0%, var(--navy-900) 100%)',
          color: 'var(--white)',
          padding: '5rem 0',
          position: 'relative',
          overflow: 'hidden',
        }}
        data-reveal
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '760px', position: 'relative', zIndex: 2 }}>
          <span
            style={{
              color: 'var(--red-400)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.75rem',
            }}
          >
            Start a Conversation
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 3.8vw, 3rem)',
              color: 'var(--white)',
              marginBottom: '1.25rem',
              lineHeight: 1.2,
            }}
          >
            Ready to discuss your family&apos;s financial goals?
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--silver-300)',
              lineHeight: 1.65,
              marginBottom: '2.5rem',
            }}
          >
            Visit our office in Godhra or connect with Abhilash and the team to review your existing
            portfolios and insurance policies.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" onClick={(e) => openContactDrawer(undefined, e.currentTarget)} className="btn btn-primary btn-lg" style={{ border: "none", cursor: "pointer" }}>
              Discuss Your Goals &rarr;
            </button>
            <Link
              to="/services"
              className="btn btn-outline btn-lg"
              style={{
                color: 'var(--white)',
                borderColor: 'rgba(215, 217, 220, 0.4)',
                background: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
