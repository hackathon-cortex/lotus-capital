import { useContactDrawer } from '../../context/ContactDrawerContext';
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import seoData from '@content/data/seo.json';
import partnersData from '@content/data/partners.json';
import faqsData from '@content/data/faqs.json';
import registrationsData from '@content/data/registrations.json';
import contactData from '@content/data/contact.json';
import { useStatistics } from '../../hooks/useStatistics';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';
import { useCountUp, useScrollProgress, useParallax } from '../../motion';
import { LotusLogo } from '../../components/common/LotusLogo';
import { ScrollProgressBar } from '../../components/common/ScrollProgressBar';
import { SipIllustrationBoard } from '../../components/investments/SipIllustrationBoard';
import { HomeHowWeWork } from '../../components/home/HomeHowWeWork';
import ownerPhoto from '../../assets/Owner.png';

export const Home: React.FC = () => {
  const { openContactDrawer } = useContactDrawer();
  const seo = seoData['/'];

  // Scroll Parallax for Hero
  const parallaxOffset = useParallax(0.2);

  // Scroll Progress for Rising Boards
  const mfBoardRef = useRef<HTMLDivElement>(null);
  const equityBoardRef = useRef<HTMLDivElement>(null);
  const mfProgress = useScrollProgress(mfBoardRef);
  const equityProgress = useScrollProgress(equityBoardRef);

  // Statistics from single source of truth
  const { stats: mainStats } = useStatistics([
    'clients_serviced',
    'aum_total',
    'mf_folios',
    'demat_accounts',
  ]);

  // Hash scroll listener for direct section navigation
  const { stats: secondaryStats } = useStatistics(['insurance_policies_total']);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'auto' }), 150);
      }
    }
  }, []);

  // FAQ state (one open at a time)
  const homeFaqs = faqsData.filter((f) => f.page === 'home');
  const [openFaq, setOpenFaq] = useState<string | null>(homeFaqs[0]?.id || null);

  // Insurance Highlights active tab
  const [activeInsuranceTab, setActiveInsuranceTab] = useState<'health' | 'life' | 'general'>('health');

  // Trust band count-up
  const trustCount = useCountUp(2500, 1600);

  // Religare AP registrations
  const nseReg = registrationsData.find((r) => r.id === 'religare_ap_nse');
  const bseReg = registrationsData.find((r) => r.id === 'religare_ap_bse');

  // Confirmed partners only
  const confirmedPartners = partnersData.filter((p) => p.status === 'confirmed');

  // Partner logo mapping (check /images/partners/ and fallback to /assets/)
  const getPartnerLogo = (partner: typeof partnersData[0]) => {
    return `/images/partners/${partner.id}.svg`;
  };

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['FinancialService', 'LocalBusiness'],
            name: 'Lotus Capital',
            image: 'https://lotuscapital.org/images/hero.jpg',
            telephone: '+919328852555',
            email: 'lotuscapitalinfo@gmail.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Shri Chudasama Bhuvan, M.G. Road, Near Police Chowki No. 1',
              addressLocality: 'Godhra',
              postalCode: '389001',
              addressRegion: 'Gujarat',
              addressCountry: 'IN'
            },
            areaServed: 'Godhra, Panchmahals, Gujarat, India',
            url: 'https://lotuscapital.org'
          })}
        </script>
      </Helmet>

      {/* Reading Progress Bar under header */}
      <ScrollProgressBar />

      {/* =========================================================
          1. HERO SECTION (Screenshot 1: fiatwm.com style)
         ========================================================= */}
      <section className="home-hero" id="hero" data-tone="dark" aria-labelledby="home-hero-title">
        <div className="home-hero__bg">
          <img
            src="/images/hero.jpg"
            alt="Lotus Capital — Partnering Wealth Creation"
            className="home-hero__image anim-settle"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="home-hero__scrim" />
        </div>

        {/* Slow 40s rotating lotus watermark on right with faint parallax */}
        <div
          className="hero-lotus-art"
          style={{
            transform: `translateY(calc(-50% + ${parallaxOffset * 0.4}px))`,
          }}
          aria-hidden="true"
        >
          <LotusLogo variant="watermark" width={520} height={520} />
        </div>

        <div className="container home-hero__content">
          <div className="home-hero__text">
            <span className="eyebrow-rule" />
            <span className="eyebrow home-hero__eyebrow anim-fade-up anim-fade-up-1">
              FINANCIAL SOLUTIONS • GODHRA, GUJARAT
            </span>

            {/* Playfair Display Headline with red drawing underline under "future." */}
            <h1 id="home-hero-title" className="home-hero__headline anim-fade-up anim-fade-up-2">
              <span className="hero-headline-italic">Plan with confidence. Protect what matters.</span> <br />
              <span className="hero-headline-bold">
                Build your{' '}
                <span className="hero-headline-future">
                  future.
                  <span className="future-underline" />
                </span>
              </span>
            </h1>

            <p
              className="home-hero__intro anim-fade-up anim-fade-up-3"
              style={{ color: 'var(--silver-300)', maxWidth: '640px', lineHeight: '1.7' }}
            >
              Lotus Capital helps individuals and families explore insurance, mutual funds, equity and other
              disciplined financial solutions. Start with a clear conversation about your goals and horizon.
            </p>

            <div className="home-hero__cta-group anim-fade-up anim-fade-up-4">
              <Link
                to="/services"
                className="btn btn-primary btn-lg"
                style={{ borderRadius: 'var(--radius-btn)', backgroundColor: 'var(--red-600)' }}
              >
                Explore Our Services
              </Link>
              <button
                type="button"
                onClick={(e) => openContactDrawer(undefined, e.currentTarget)}
                className="btn btn-secondary-light btn-lg"
                style={{ borderRadius: 'var(--radius-btn)', cursor: 'pointer' }}
              >
                Talk to an Advisor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          STAT CARD OVERLAPPING HERO BOTTOM EDGE (ONE ROW OF FOUR CHIPS)
         ========================================================= */}
      <div
        className="container"
        id="overview-strip"
        style={{ position: 'relative', zIndex: 10, marginTop: '-54px', marginBottom: '3.5rem' }}
      >
        <div
          className="card"
          style={{
            backgroundColor: 'var(--white)',
            borderRadius: '28px',
            padding: '2.25rem 2.5rem',
            boxShadow: 'var(--shadow-soft)',
            border: '1px solid var(--silver-300)',
          }}
          data-reveal
        >
          {/* Row of four chips: clients, aum, folios, demat */}
          <div className="grid grid-cols-2 grid-cols-md-4" style={{ gap: '1.75rem', textAlign: 'center' }}>
            {mainStats.map((stat) => (
              <div key={stat.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  data-numeral="true"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: 'clamp(1.85rem, 2.8vw, 2.4rem)',
                    color: 'var(--navy-900)',
                    lineHeight: 1.15,
                    whiteSpace: 'nowrap',
                    writingMode: 'horizontal-tb',
                    fontVariantNumeric: 'tabular-nums',
                    flexShrink: 0,
                    minWidth: 'max-content',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)', marginTop: '0.35rem' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                  {stat.asOfText}
                </div>
                {stat.isUnverified && (
                  <span
                    data-testid="badge-unverified"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.72rem',
                      color: 'var(--warning)',
                      marginTop: '0.35rem',
                      cursor: 'help',
                    }}
                    title="Figure pending formal client re-verification"
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--warning)' }} />
                    as of [date to be confirmed]
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Centered policy badge */}
          {secondaryStats.length > 0 && (
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--silver-200)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  backgroundColor: 'var(--silver-100)',
                  padding: '0.45rem 1.25rem',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--silver-300)',
                  fontSize: '0.85rem',
                  color: 'var(--navy-900)',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--red-500)' }} />
                <span>
                  <strong
                    data-numeral="true"
                    style={{
                      whiteSpace: 'nowrap',
                      writingMode: 'horizontal-tb',
                      fontVariantNumeric: 'tabular-nums',
                      flexShrink: 0,
                      minWidth: 'max-content',
                    }}
                  >
                    570+
                  </strong> Insurance Policies Serviced across Health, Life & Motor
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Scroll Cue Visible Below the Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '2rem',
            cursor: 'pointer',
          }}
          onClick={() => {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}
          role="button"
          tabIndex={0}
          aria-label="Scroll to About section"
        >
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
            Explore Lotus Capital
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--navy-700)"
            strokeWidth="2"
            style={{ marginTop: '0.25rem', animation: 'heroScrollCue 2s infinite' }}
          >
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </div>
      </div>

      {/* =========================================================
          2. ABOUT / FOUNDER SPLIT (Screenshot 2: FINRE Template)
         ========================================================= */}
      <section className="section-padding stacked-section" id="about" data-tone="light" data-reveal style={{ backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div className="grid grid-cols-12" style={{ gap: '3.5rem', alignItems: 'center' }}>
            {/* Left 5 Cols: Founder portrait in 4:5 rounded (28px) frame with silver offset outline */}
            <div className="col-span-12 col-span-md-5">
              <div
                className="founder-offset-frame"
                style={{
                  borderRadius: '28px',
                  boxShadow: 'var(--shadow-soft)',
                  position: 'relative',
                }}
              >
                <img
                  src={ownerPhoto}
                  alt="Abhilash Dineshchandra Chudasama — Founder & Proprietor"
                  style={{ borderRadius: '28px', width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Right 7 Cols: Text, 3 Pill Stat Chips & 4 Value Tiles */}
            <div className="col-span-12 col-span-md-7">
              <span className="eyebrow-rule" />
              <span className="eyebrow">Leadership & Foundations</span>
              <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.25rem', fontSize: 'clamp(1.75rem, 2.5vw, 2.3rem)' }}>
                Financial Decisions Deserve Clear Conversations
              </h2>

              <p style={{ fontSize: '1.05rem', color: 'var(--ink)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                Lotus Capital is a financial services business based in Godhra, Gujarat, led by{' '}
                <strong>Abhilash Dineshchandra Chudasama</strong> alongside <strong>Kajal Abhilash Chudasama</strong>. We help
                individuals and families understand and access insurance, mutual funds, equity and related services, and we stay in
                touch after the first conversation. Our approach is to explain options, costs and risks clearly before proceeding.
              </p>

              {/* 3 Pill Stat Chips with small icon and soft shadow */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
                <div
                  style={{
                    backgroundColor: 'var(--silver-100)',
                    border: '1px solid var(--silver-300)',
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.84rem',
                    boxShadow: 'var(--shadow-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <span style={{ color: 'var(--navy-700)' }}>👥</span>
                  <strong style={{ color: 'var(--navy-900)' }}>2,500+</strong>
                  <span style={{ color: 'var(--muted)' }}>Clients Serviced</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--silver-100)',
                    border: '1px solid var(--silver-300)',
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.84rem',
                    boxShadow: 'var(--shadow-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <span style={{ color: 'var(--navy-700)' }}>📊</span>
                  <strong style={{ color: 'var(--navy-900)' }}>1,200+</strong>
                  <span style={{ color: 'var(--muted)' }}>Mutual Fund Folios</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--silver-100)',
                    border: '1px solid var(--silver-300)',
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.84rem',
                    boxShadow: 'var(--shadow-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <span style={{ color: 'var(--navy-700)' }}>🏛️</span>
                  <strong style={{ color: 'var(--navy-900)' }}>800+</strong>
                  <span style={{ color: 'var(--muted)' }}>Demat Accounts</span>
                </div>
              </div>

              {/* Four Value Tiles: radius 20px, soft shadow, icon in 44px tinted circle that fills navy on hover */}
              <div className="grid grid-cols-1 grid-cols-md-2" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
                <div
                  className="card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '20px',
                    boxShadow: 'var(--shadow-soft)',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                  }}
                >
                  <div className="value-icon-circle">✓</div>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem', fontSize: '0.95rem', color: 'var(--navy-900)' }}>Personalised Guidance</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)', lineHeight: '1.4' }}>
                      Aligned to family goals and horizon
                    </p>
                  </div>
                </div>

                <div
                  className="card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '20px',
                    boxShadow: 'var(--shadow-soft)',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                  }}
                >
                  <div className="value-icon-circle">✓</div>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem', fontSize: '0.95rem', color: 'var(--navy-900)' }}>Transparent Terms</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)', lineHeight: '1.4' }}>
                      Clear risk and cost disclosures up front
                    </p>
                  </div>
                </div>

                <div
                  className="card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '20px',
                    boxShadow: 'var(--shadow-soft)',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                  }}
                >
                  <div className="value-icon-circle">✓</div>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem', fontSize: '0.95rem', color: 'var(--navy-900)' }}>Dedicated Servicing</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)', lineHeight: '1.4' }}>
                      Claims assistance and annual reviews
                    </p>
                  </div>
                </div>

                <div
                  className="card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '20px',
                    boxShadow: 'var(--shadow-soft)',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                  }}
                >
                  <div className="value-icon-circle">✓</div>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem', fontSize: '0.95rem', color: 'var(--navy-900)' }}>Local Accessibility</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)', lineHeight: '1.4' }}>
                      Physical branch presence in Godhra
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/about-us"
                className="btn btn-secondary arrow-link"
                style={{ borderRadius: 'var(--radius-btn)' }}
              >
                <span>Learn more about our team & credentials</span>
                <span className="arrow-icon">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. SERVICES BENTO GRID (Screenshot 3: Groww-style Bento)
         ========================================================= */}
      <section
        className="section-padding bg-light stacked-section"
        id="services"
        data-tone="light"
        data-reveal
        aria-labelledby="services-heading"
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            <span className="eyebrow-rule" style={{ margin: '0 auto 0.6rem' }} />
            <span className="eyebrow">Disciplined Solutions</span>
            <h2
              id="services-heading"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3vw, 2.6rem)' }}
            >
              Our Financial Services
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.6' }}>
              Protection, investments and long-term planning with transparent regulatory authorisations.
            </p>
          </div>

          <div className="services-bento-grid-v2">
            {/* Bento Card 1 (FEATURED 2 COLS): Goal-Based Mutual Funds */}
            <Link to="/investments/mutual-funds" className="bento-card-v2 bento-card-featured">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--navy-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                      }}
                    >
                      📈
                    </div>
                    <span className="badge badge-info" style={{ borderRadius: 'var(--radius-pill)', padding: '0.35rem 0.85rem' }}>
                      Featured Solution
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--navy-800)',
                      fontWeight: 700,
                      backgroundColor: 'var(--white)',
                      padding: '0.3rem 0.8rem',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid var(--silver-300)',
                    }}
                  >
                    1,200+ Folios
                  </span>
                </div>

                <h3 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', margin: '0 0 0.5rem', fontFamily: 'var(--font-heading)' }}>
                  Goal-Based Mutual Funds
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--muted)', lineHeight: '1.6', margin: '0 0 1.25rem', maxWidth: '580px' }}>
                  Systematic Investment Plans (SIP) and lump-sum investments structured for child education, retirement, and
                  long-term compounding.
                </p>

                {/* Mini UI Mockup (Compounding Area Curve + Neutral Labeled Skeleton Rows) */}
                <div
                  style={{
                    backgroundColor: 'var(--white)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '1px solid var(--silver-300)',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--navy-700)', textTransform: 'uppercase' }}>
                      SIP Compounding Curve
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--muted)', backgroundColor: 'var(--silver-100)', padding: '2px 8px', borderRadius: '4px' }}>
                      Sample layout
                    </span>
                  </div>

                  {/* SVG compounding line mockup */}
                  <svg viewBox="0 0 400 80" style={{ width: '100%', height: '70px', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="sipCurveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#123D67" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#123D67" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M 0 75 Q 120 70 200 50 T 400 10 L 400 80 L 0 80 Z" fill="url(#sipCurveGrad)" />
                    <path d="M 0 75 Q 120 70 200 50 T 400 10" fill="none" stroke="#123D67" strokeWidth="2.5" />
                    <circle cx="400" cy="10" r="4" fill="#E92332" />
                  </svg>

                  {/* Neutral skeleton rows */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem', borderTop: '1px solid var(--silver-200)', paddingTop: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Asset Allocation</span>
                      <div style={{ height: '8px', backgroundColor: 'var(--silver-200)', borderRadius: '4px', width: '85%', marginTop: '4px' }} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Horizon Period</span>
                      <div style={{ height: '8px', backgroundColor: 'var(--silver-200)', borderRadius: '4px', width: '65%', marginTop: '4px' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span className="arrow-link" style={{ color: 'var(--red-600)' }}>
                  <span>Explore Mutual Funds</span>
                  <span className="arrow-icon">&rarr;</span>
                </span>
              </div>
            </Link>

            {/* Bento Card 2: General Insurance */}
            <Link to="/services/general-insurance" className="bento-card-v2">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--navy-100)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}
                  >
                    🚗
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--navy-800)', fontWeight: 600, backgroundColor: 'var(--white)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--silver-300)' }}>
                    140+ Motor Policies
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', margin: '0 0 0.4rem' }}>
                  Motor & Property Cover
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--muted)', lineHeight: '1.5', margin: '0 0 1rem' }}>
                  Vehicle, factory and commercial asset protection through authorized general insurers.
                </p>

                {/* Neutral Mockup */}
                <div style={{ backgroundColor: 'var(--white)', borderRadius: '12px', padding: '0.85rem', border: '1px solid var(--silver-300)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--navy-700)', fontWeight: 600 }}>Coverage Structure</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>Sample layout</span>
                  </div>
                  <div style={{ height: '7px', backgroundColor: 'var(--silver-200)', borderRadius: '4px', width: '90%', marginBottom: '6px' }} />
                  <div style={{ height: '7px', backgroundColor: 'var(--silver-200)', borderRadius: '4px', width: '60%' }} />
                </div>
              </div>
              <span className="arrow-link">
                <span>Explore General Insurance</span>
                <span className="arrow-icon">&rarr;</span>
              </span>
            </Link>

            {/* Bento Card 3: Life Insurance */}
            <Link to="/services/life-insurance" className="bento-card-v2">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--navy-100)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}
                  >
                    🛡️
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--navy-800)', fontWeight: 600, backgroundColor: 'var(--white)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--silver-300)' }}>
                    180+ Policies
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', margin: '0 0 0.4rem' }}>
                  Term & Savings Protection
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--muted)', lineHeight: '1.5', margin: '0 0 1rem' }}>
                  Long-term family security, child milestone savings and guaranteed annuity plans.
                </p>

                {/* Neutral Mockup */}
                <div style={{ backgroundColor: 'var(--white)', borderRadius: '12px', padding: '0.85rem', border: '1px solid var(--silver-300)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--navy-700)', fontWeight: 600 }}>Nominee Security Tier</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>Sample layout</span>
                  </div>
                  <div style={{ height: '7px', backgroundColor: 'var(--silver-200)', borderRadius: '4px', width: '80%', marginBottom: '6px' }} />
                  <div style={{ height: '7px', backgroundColor: 'var(--silver-200)', borderRadius: '4px', width: '50%' }} />
                </div>
              </div>
              <span className="arrow-link">
                <span>Explore Life Insurance</span>
                <span className="arrow-icon">&rarr;</span>
              </span>
            </Link>

            {/* Bento Card 4: Health Insurance */}
            <Link to="/services/health-insurance" className="bento-card-v2">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--navy-100)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}
                  >
                    🏥
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--navy-800)', fontWeight: 600, backgroundColor: 'var(--white)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--silver-300)' }}>
                    250+ Policies
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', margin: '0 0 0.4rem' }}>
                  Family & Senior Health Cover
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--muted)', lineHeight: '1.5', margin: '0 0 1rem' }}>
                  Cashless hospitalization, critical illness riders, and super top-up plans.
                </p>

                {/* Neutral Mockup */}
                <div style={{ backgroundColor: 'var(--white)', borderRadius: '12px', padding: '0.85rem', border: '1px solid var(--silver-300)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--navy-700)', fontWeight: 600 }}>Hospital Network Check</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>Sample layout</span>
                  </div>
                  <div style={{ height: '7px', backgroundColor: 'var(--silver-200)', borderRadius: '4px', width: '75%', marginBottom: '6px' }} />
                  <div style={{ height: '7px', backgroundColor: 'var(--silver-200)', borderRadius: '4px', width: '55%' }} />
                </div>
              </div>
              <span className="arrow-link">
                <span>Explore Health Insurance</span>
                <span className="arrow-icon">&rarr;</span>
              </span>
            </Link>

            {/* Bento Card 5: Equity & Broking */}
            <Link to="/investments/equity" className="bento-card-v2">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--navy-100)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}
                  >
                    🏛️
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--navy-800)', fontWeight: 600, backgroundColor: 'var(--white)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--silver-300)' }}>
                    800+ Demat Accounts
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', margin: '0 0 0.4rem' }}>
                  Equity & Trading Accounts
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--muted)', lineHeight: '1.5', margin: '0 0 1rem' }}>
                  NSE & BSE market access through Authorised Person registration with Religare Broking Limited.
                </p>

                {/* Neutral Mockup */}
                <div style={{ backgroundColor: 'var(--white)', borderRadius: '12px', padding: '0.85rem', border: '1px solid var(--silver-300)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--navy-700)', fontWeight: 600 }}>Religare AP: {nseReg?.number}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>Active</span>
                  </div>
                  <div style={{ height: '7px', backgroundColor: 'var(--silver-200)', borderRadius: '4px', width: '85%', marginBottom: '6px' }} />
                  <div style={{ height: '7px', backgroundColor: 'var(--silver-200)', borderRadius: '4px', width: '65%' }} />
                </div>
              </div>
              <span className="arrow-link">
                <span>Explore Equity</span>
                <span className="arrow-icon">&rarr;</span>
              </span>
            </Link>

            {/* Bento Card 6: More Solutions */}
            <Link to="/investments/other-solutions" className="bento-card-v2">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--navy-100)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}
                  >
                    💼
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--navy-800)', fontWeight: 600, backgroundColor: 'var(--white)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--silver-300)' }}>
                    ₹50 Lakh+ in FDs
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', margin: '0 0 0.4rem' }}>
                  Fixed Deposits & Bonds
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--muted)', lineHeight: '1.5', margin: '0 0 1rem' }}>
                  Corporate FDs, Government Securities, Sovereign Gold Bonds and National Pension System (NPS).
                </p>

                {/* Neutral Mockup */}
                <div style={{ backgroundColor: 'var(--white)', borderRadius: '12px', padding: '0.85rem', border: '1px solid var(--silver-300)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--navy-700)', fontWeight: 600 }}>Capital Preservation</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>Sample layout</span>
                  </div>
                  <div style={{ height: '7px', backgroundColor: 'var(--silver-200)', borderRadius: '4px', width: '70%', marginBottom: '6px' }} />
                  <div style={{ height: '7px', backgroundColor: 'var(--silver-200)', borderRadius: '4px', width: '40%' }} />
                </div>
              </div>
              <span className="arrow-link">
                <span>Explore More Solutions</span>
                <span className="arrow-icon">&rarr;</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. SIP CALCULATOR (Screenshot 4: One Frame <= 620px tall)
         ========================================================= */}
      <section
        className="section-padding stacked-section"
        id="mutual-funds"
        data-tone="dark"
        ref={mfBoardRef}
        data-reveal
        style={{
          backgroundColor: 'var(--navy-950)',
          color: 'var(--white)',
          transform: `translateY(${(1 - mfProgress) * 60}px) scale(${0.96 + mfProgress * 0.04})`,
          opacity: 0.2 + mfProgress * 0.8,
          transition: 'transform 0.4s ease-out, opacity 0.4s ease-out',
        }}
      >
        <div className="container" style={{ maxWidth: '1100px' }}>
          {/* Top Board Tag (Mandatory AMFI Disclaimer) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(215, 217, 220, 0.2)',
                color: 'var(--silver-300)',
                padding: '0.35rem 0.9rem',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              Illustration only. Not a forecast or guarantee. Mutual fund investments are subject to market risks.
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--silver-300)', fontWeight: 600 }}>
              AMFI ARN-160174
            </span>
          </div>

          {/* Unified SIP Illustration Board */}
          <SipIllustrationBoard id="home-sip-illustration" compact={true} />
        </div>
      </section>

      {/* =========================================================
          5. EQUITY BOARD (Screenshot 5: Bento Layout)
         ========================================================= */}
      <section
        className="section-padding stacked-section"
        id="equity"
        data-tone="dark"
        ref={equityBoardRef}
        data-reveal
        style={{
          backgroundColor: 'var(--navy-900)',
          color: 'var(--white)',
          transform: `translateY(${(1 - equityProgress) * 50}px) scale(${0.96 + equityProgress * 0.04})`,
          opacity: 0.2 + equityProgress * 0.8,
          transition: 'transform 0.4s ease-out, opacity 0.4s ease-out',
        }}
      >
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
            <span className="eyebrow" style={{ color: 'var(--silver-300)' }}>Capital Markets</span>
            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--white)', fontSize: 'clamp(2rem, 3vw, 2.5rem)' }}>
              Equity & Demat Infrastructure
            </h2>
            <p style={{ color: 'var(--silver-300)', fontSize: '0.95rem' }}>
              Authorised Person of Religare Broking Limited facilitating access to primary and secondary markets.
            </p>
          </div>

          {/* Equity Bento Grid */}
          <div className="grid grid-cols-1 grid-cols-md-12" style={{ gap: '1.75rem', marginBottom: '2rem' }}>
            {/* Left (4 Cols): Religare Authorised Person "Seal" Card */}
            <div
              className="col-span-12 col-span-md-4 card"
              style={{
                backgroundColor: 'var(--navy-800, #0E3154)',
                border: '1px solid rgba(215, 217, 220, 0.12)',
                borderRadius: '24px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  border: '2px dashed var(--silver-300)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                }}
              >
                <LotusLogo variant="watermark" width={54} height={54} />
              </div>

              <h4 style={{ color: 'var(--white)', margin: '0 0 0.5rem', fontSize: '1.1rem' }}>
                Religare Broking Limited
              </h4>
              <span className="badge badge-info" style={{ marginBottom: '1rem', borderRadius: 'var(--radius-pill)' }}>
                Authorised Person
              </span>

              <div style={{ fontSize: '0.82rem', color: 'var(--silver-300)', lineHeight: '1.6' }}>
                <div><strong>NSE AP:</strong> {nseReg?.number}</div>
                <div><strong>BSE AP:</strong> {bseReg?.number}</div>
              </div>
            </div>

            {/* Centre (4 Cols): Animated Abstract Candlestick / Line Illustration (No prices, no returns) */}
            <div
              className="col-span-12 col-span-md-4 card"
              style={{
                backgroundColor: 'var(--navy-800, #0E3154)',
                border: '1px solid rgba(215, 217, 220, 0.12)',
                borderRadius: '24px',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '0.78rem', color: 'var(--silver-300)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
                Market Execution Flow
              </span>

              {/* Abstract Candlestick Line Illustration drawing itself */}
              <svg viewBox="0 0 200 120" style={{ width: '100%', height: '110px' }}>
                <line x1="25" y1="30" x2="25" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <rect x="18" y="45" width="14" height="30" rx="3" fill="#1b4f82" />

                <line x1="65" y1="20" x2="65" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <rect x="58" y="30" width="14" height="45" rx="3" fill="#1e7f4f" />

                <line x1="105" y1="40" x2="105" y2="105" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <rect x="98" y="55" width="14" height="35" rx="3" fill="#c81b29" />

                <line x1="145" y1="15" x2="145" y2="95" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <rect x="138" y="25" width="14" height="50" rx="3" fill="#1e7f4f" />

                <line x1="185" y1="35" x2="185" y2="85" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <rect x="178" y="42" width="14" height="25" rx="3" fill="#1b4f82" />
              </svg>

              <span style={{ fontSize: '0.74rem', color: 'var(--silver-500)', marginTop: '0.75rem' }}>
                Direct exchange clearing & settlement
              </span>
            </div>

            {/* Right (4 Cols): Vertical 3-Step Journey with Connecting Line */}
            <div
              className="col-span-12 col-span-md-4 card"
              style={{
                backgroundColor: 'var(--navy-800, #0E3154)',
                border: '1px solid rgba(215, 217, 220, 0.12)',
                borderRadius: '24px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--red-500)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                    1
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.92rem', color: 'var(--white)' }}>Open Demat Account</h5>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--silver-300)' }}>Verified KYC onboarding</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--navy-700)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                    2
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.92rem', color: 'var(--white)' }}>Trade via Partner</h5>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--silver-300)' }}>Religare Broking platform</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--navy-700)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                    3
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.92rem', color: 'var(--white)' }}>Apply for Primary IPOs</h5>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--silver-300)' }}>Seamless public offerings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Count-up Chip for 800+ demat accounts */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(215, 217, 220, 0.2)',
                borderRadius: 'var(--radius-pill)',
                padding: '0.5rem 1.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--white)' }}>800+</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--silver-300)' }}>demat accounts serviced</span>
            </div>
          </div>

          {/* Statutory Risk Notice Restyled as Rounded Outlined Note */}
          <div
            style={{
              border: '1px solid rgba(215, 217, 220, 0.25)',
              borderRadius: '20px',
              padding: '1.25rem 1.75rem',
              backgroundColor: 'rgba(7, 27, 48, 0.5)',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <div style={{ color: 'var(--silver-300)', fontSize: '1.3rem' }}>ⓘ</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--silver-300)', margin: 0, lineHeight: '1.6' }}>
              <strong>Securities Market Risk Disclosure:</strong> Investments in securities market are subject to market risks. Read all
              the related documents carefully before investing. Lotus Capital operates as an Authorised Person of Religare Broking
              Limited and does not guarantee returns or trading profits.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          6. INSURANCE HIGHLIGHTS (Screenshot 6: ONE Compact Tabbed Panel < 380px)
         ========================================================= */}
      <section className="section-padding bg-light stacked-section" id="insurance" data-tone="light" data-reveal>
        <div className="container" style={{ maxWidth: '880px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="eyebrow-rule" style={{ margin: '0 auto 0.6rem' }} />
            <span className="eyebrow">Comprehensive Cover</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.85rem, 2.5vw, 2.3rem)' }}>
              Compare Insurance Solutions
            </h2>
          </div>

          {/* Tabbed Panel Container (Radius 28px, Soft Shadow, Height < 380px) */}
          <div
            className="card"
            style={{
              borderRadius: '28px',
              padding: '2rem 2.5rem',
              boxShadow: 'var(--shadow-soft)',
              border: '1px solid var(--silver-300)',
              backgroundColor: 'var(--white)',
            }}
          >
            {/* Pill Switcher */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
                backgroundColor: 'var(--silver-100)',
                padding: '0.35rem',
                borderRadius: 'var(--radius-pill)',
                marginBottom: '2rem',
                border: '1px solid var(--silver-300)',
              }}
            >
              {(['health', 'life', 'general'] as const).map((tab) => {
                const isActive = activeInsuranceTab === tab;
                const labels = {
                  health: 'Health Insurance',
                  life: 'Life Insurance',
                  general: 'General Insurance',
                };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveInsuranceTab(tab)}
                    style={{
                      flex: 1,
                      padding: '0.6rem 1.25rem',
                      borderRadius: 'var(--radius-pill)',
                      border: 'none',
                      backgroundColor: isActive ? 'var(--navy-900)' : 'transparent',
                      color: isActive ? 'var(--white)' : 'var(--navy-800)',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 2px 8px rgba(10,37,64,0.15)' : 'none',
                    }}
                  >
                    {labels[tab]}
                  </button>
                );
              })}
            </div>

            {/* Active Tab 2-Column Checklist (4 items) + Compare Link */}
            {activeInsuranceTab === 'health' && (
              <div>
                <div className="grid grid-cols-1 grid-cols-md-2" style={{ gap: '1rem', marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
                    <span style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>Cashless hospitalisation across leading networks</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
                    <span style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>Pre & post treatment hospitalization expense cover</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
                    <span style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>Critical illness riders & super top-up options</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
                    <span style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>Dedicated claims escalation and paperwork support</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--silver-200)', paddingTop: '1.25rem' }}>
                  <Link to="/services/health-insurance" className="arrow-link" style={{ color: 'var(--red-600)' }}>
                    <span>Compare Health Plans</span>
                    <span className="arrow-icon">&rarr;</span>
                  </Link>
                </div>
              </div>
            )}

            {activeInsuranceTab === 'life' && (
              <div>
                <div className="grid grid-cols-1 grid-cols-md-2" style={{ gap: '1rem', marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
                    <span style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>Pure term assurance with high family protection cover</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
                    <span style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>Capital preservation savings & endowment options</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
                    <span style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>Retirement annuity and child milestone plans</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
                    <span style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>Nominee guidance and claims settlement coordination</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--silver-200)', paddingTop: '1.25rem' }}>
                  <Link to="/services/life-insurance" className="arrow-link" style={{ color: 'var(--red-600)' }}>
                    <span>Compare Life Policies</span>
                    <span className="arrow-icon">&rarr;</span>
                  </Link>
                </div>
              </div>
            )}

            {activeInsuranceTab === 'general' && (
              <div>
                <div className="grid grid-cols-1 grid-cols-md-2" style={{ gap: '1rem', marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
                    <span style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>Comprehensive motor coverage for private & commercial fleets</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
                    <span style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>Factory, machinery breakdown & fire perils protection</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
                    <span style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>Transit, marine cargo and business liability policies</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
                    <span style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>Rapid insurer survey coordination and renewal follow-up</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--silver-200)', paddingTop: '1.25rem' }}>
                  <Link to="/services/general-insurance" className="arrow-link" style={{ color: 'var(--red-600)' }}>
                    <span>Compare General Cover</span>
                    <span className="arrow-icon">&rarr;</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          7. TRUST BAND (Screenshot 7: Signature Moment)
         ========================================================= */}
      <section
        className="section-padding stacked-section"
        id="trust"
        data-tone="dark"
        data-reveal
        style={{
          backgroundColor: 'var(--navy-950)',
          color: 'var(--white)',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '5rem',
          paddingBottom: '4rem',
        }}
      >
        {/* Lotus Watermark */}
        <div
          className="trust-watermark-bg"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '640px',
            height: '640px',
            opacity: 0.05,
            pointerEvents: 'none',
          }}
        >
          <LotusLogo variant="watermark" width="100%" height="100%" />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          {/* Animated Arc & Headline */}
          <div style={{ position: 'relative', display: 'inline-block', padding: '1rem 2rem' }}>
            <span className="eyebrow" style={{ color: 'var(--silver-300)', display: 'block', marginBottom: '0.5rem' }}>
              STABILITY & TRUST
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
                color: 'var(--white)',
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              Trusted by <span style={{ color: 'var(--white)' }}>{trustCount.toLocaleString('en-IN')}+</span> clients
            </h2>
            <p style={{ color: 'var(--silver-300)', fontSize: '1.05rem', marginTop: '0.75rem' }}>
              Across Godhra and Gujarat since our founding
            </p>
          </div>

          {/* Orbiting / Floating Stat Pills */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1.25rem',
              margin: '2.5rem 0 3.5rem',
            }}
          >
            <div
              className="orbiting-pill-1"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(215, 217, 220, 0.2)',
                borderRadius: 'var(--radius-pill)',
                padding: '0.55rem 1.4rem',
                fontSize: '0.9rem',
                color: 'var(--white)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}
            >
              <strong>1,200+</strong> Mutual Fund Folios
            </div>

            <div
              className="orbiting-pill-2"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(215, 217, 220, 0.2)',
                borderRadius: 'var(--radius-pill)',
                padding: '0.55rem 1.4rem',
                fontSize: '0.9rem',
                color: 'var(--white)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}
            >
              <strong>800+</strong> Demat Accounts
            </div>

            <div
              className="orbiting-pill-3"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(215, 217, 220, 0.2)',
                borderRadius: 'var(--radius-pill)',
                padding: '0.55rem 1.4rem',
                fontSize: '0.9rem',
                color: 'var(--white)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}
            >
              <strong>570+</strong> Insurance Policies Serviced
            </div>
          </div>

          {/* Dev-Only Floating Testimonial Placeholders (Strictly consent-gated & labeled) */}
          {import.meta.env.DEV && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
                maxWidth: '920px',
                margin: '0 auto 3rem',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(215, 217, 220, 0.12)',
                  borderRadius: '20px',
                  padding: '1.25rem',
                  fontSize: '0.85rem',
                  color: 'var(--silver-300)',
                }}
              >
                <div style={{ color: 'var(--warning)', fontSize: '0.72rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                  [DEV PLACEHOLDER • NAME WITHHELD]
                </div>
                “Disciplined guidance on our family mutual fund portfolio. Clear risk explanations without any aggressive sales.”
                <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--white)', fontWeight: 600 }}>
                  Long-term Investor, Godhra
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(215, 217, 220, 0.12)',
                  borderRadius: '20px',
                  padding: '1.25rem',
                  fontSize: '0.85rem',
                  color: 'var(--silver-300)',
                }}
              >
                <div style={{ color: 'var(--warning)', fontSize: '0.72rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                  [DEV PLACEHOLDER • NAME WITHHELD]
                </div>
                “Timely support during our factory property insurance claim. The team handled paperwork follow-ups smoothly.”
                <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--white)', fontWeight: 600 }}>
                  Manufacturing Enterprise Client, Gujarat
                </div>
              </div>
            </div>
          )}

          {/* Contrast CTA Strip Beneath */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(215, 217, 220, 0.15)',
              borderRadius: '24px',
              padding: '1.75rem 2.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              maxWidth: '920px',
              margin: '0 auto',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.2rem', color: 'var(--white)' }}>
                Ready to review your wealth and protection strategy?
              </h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--silver-300)' }}>
                Schedule a confidential consultation with Abhilash Chudasama in Godhra.
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => openContactDrawer(undefined, e.currentTarget)}
              className="btn btn-primary"
              style={{
                backgroundColor: 'var(--red-600)',
                borderRadius: 'var(--radius-btn)',
                padding: '0.75rem 1.75rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Talk to an Advisor &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          8. PARTNERS & MARQUEE (Screenshot 8: Confirmed Partners Only)
         ========================================================= */}
      <section className="section-padding bg-light stacked-section" id="partners" data-tone="light" data-reveal>
        <div className="container" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="eyebrow-rule" style={{ margin: '0 auto 0.6rem' }} />
          <span className="eyebrow">Institutional Relationships</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3vw, 2.5rem)' }}>
            Authorised Partners & Providers
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
            Operating through confirmed agency and authorised person agreements.
          </p>
        </div>

        {/* Row 1 Marquee (Moving Left) */}
        <div className="marquee-row-wrapper">
          <div className="marquee-track-left">
            {confirmedPartners.concat(confirmedPartners).map((partner, idx) => (
              <div key={`row1-${partner.id}-${idx}`} className="partner-logo-tile">
                <img
                  src={getPartnerLogo(partner)}
                  alt={partner.name}
                  className="partner-logo-img"
                  onError={(e) => {
                    // Fallback to text wordmark
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy-900)', textAlign: 'center' }}>
                  {partner.name}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)', textAlign: 'center', marginTop: '4px' }}>
                  {partner.relationshipLabel}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 Marquee (Moving Right) */}
        <div className="marquee-row-wrapper" style={{ marginTop: '1rem' }}>
          <div className="marquee-track-right">
            {confirmedPartners.concat(confirmedPartners).reverse().map((partner, idx) => (
              <div key={`row2-${partner.id}-${idx}`} className="partner-logo-tile">
                <img
                  src={getPartnerLogo(partner)}
                  alt={partner.name}
                  className="partner-logo-img"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy-900)', textAlign: 'center' }}>
                  {partner.name}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)', textAlign: 'center', marginTop: '4px' }}>
                  {partner.relationshipLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          9. HOW WE WORK (B2: PinnedStage Horizontal Timeline Scroll Graph)
         ========================================================= */}
      <HomeHowWeWork />

      {/* =========================================================
          10. LEARN BEFORE YOU INVEST (B3 & C5: 3 Equal Cards in 1 Row)
         ========================================================= */}
      <section
        className="section-padding stacked-section"
        id="learn"
        data-tone="light"
        data-reveal
        style={{ backgroundColor: 'var(--canvas-grey, #EEF1F4)' }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            <span className="eyebrow-rule" style={{ margin: '0 auto 0.6rem' }} />
            <span className="eyebrow">Investor Education</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3vw, 2.5rem)', color: 'var(--navy-900)' }}>
              Learn Before You Invest
            </h2>
            <p style={{ color: 'var(--muted, #5B6770)', fontSize: '0.95rem' }}>
              Straightforward guides to help you make informed decisions about your family's future.
            </p>
          </div>

          <div
            className="learn-cards-row"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {/* Card 1: Risk Gauge */}
            <Link to="/insights" className="learn-card">
              {/* Top Bar: Tinted category badge top-left + numeral top-right */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--navy-700, #123D67)',
                    backgroundColor: 'var(--silver-100, #F3F5F7)',
                    border: '1px solid var(--silver-300, #D7D9DC)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.25rem 0.65rem',
                  }}
                >
                  RISK AWARENESS
                </span>
                <span
                  data-numeral="true"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: 'var(--silver-300, #D7D9DC)',
                    whiteSpace: 'nowrap',
                    writingMode: 'horizontal-tb',
                    fontVariantNumeric: 'tabular-nums',
                    flexShrink: 0,
                    minWidth: 'max-content',
                  }}
                >
                  01
                </span>
              </div>

              {/* 96px tall clean SVG illustration */}
              <div className="learn-svg-illustration" style={{ height: '96px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="120" height="72" viewBox="0 0 120 72" aria-hidden="true">
                  <path d="M 12 66 A 48 48 0 0 1 108 66" fill="none" stroke="var(--silver-300, #D7D9DC)" strokeWidth="7" strokeLinecap="round" />
                  <path d="M 12 66 A 48 48 0 0 1 60 18" fill="none" stroke="var(--navy-700, #123D67)" strokeWidth="7" strokeLinecap="round" />
                  <path d="M 60 18 A 48 48 0 0 1 92 32" fill="none" stroke="var(--steel-accent, #5B8DB8)" strokeWidth="7" strokeLinecap="round" />
                  <line x1="60" y1="66" x2="78" y2="36" stroke="var(--navy-900, #0A2540)" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="60" cy="66" r="4.5" fill="var(--lotus-red, #E92332)" />
                </svg>
              </div>

              {/* Playfair Display H3 + 2-line clamped description */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--navy-900)', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                  Risk vs Return Profile
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--muted, #5B6770)',
                    lineHeight: 1.5,
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  Assess risk capacity before selecting mutual fund or equity allocations. Capital protection requires disciplined asset matching.
                </p>
              </div>

              {/* Footer: Shared arrow link with contrast >= 4.5:1 */}
              <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span className="arrow-link" style={{ color: 'var(--lotus-red-fill, #C81B29)', fontWeight: 600, fontSize: '0.9rem' }}>
                  <span>Read guide</span>
                  <span className="arrow-icon">&rarr;</span>
                </span>
              </div>
            </Link>

            {/* Card 2: Compounding Hourglass */}
            <Link to="/insights" className="learn-card">
              {/* Top Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--navy-700, #123D67)',
                    backgroundColor: 'var(--silver-100, #F3F5F7)',
                    border: '1px solid var(--silver-300, #D7D9DC)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.25rem 0.65rem',
                  }}
                >
                  INVESTMENT PRINCIPLES
                </span>
                <span
                  data-numeral="true"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: 'var(--silver-300, #D7D9DC)',
                    whiteSpace: 'nowrap',
                    writingMode: 'horizontal-tb',
                    fontVariantNumeric: 'tabular-nums',
                    flexShrink: 0,
                    minWidth: 'max-content',
                  }}
                >
                  02
                </span>
              </div>

              {/* 96px tall clean SVG illustration */}
              <div className="learn-svg-illustration" style={{ height: '96px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="68" height="90" viewBox="0 0 68 90" aria-hidden="true">
                  <path d="M 14 12 L 54 12 L 38 45 L 54 78 L 14 78 L 30 45 Z" fill="none" stroke="var(--navy-700, #123D67)" strokeWidth="2.5" strokeLinejoin="round" />
                  <line x1="8" y1="12" x2="60" y2="12" stroke="var(--navy-900, #0A2540)" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="8" y1="78" x2="60" y2="78" stroke="var(--navy-900, #0A2540)" strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx="34" cy="52" r="2" fill="var(--lotus-red, #E92332)" />
                  <circle cx="34" cy="62" r="2.5" fill="var(--lotus-red, #E92332)" />
                  <path d="M 24 74 Q 34 68 44 74 Z" fill="var(--lotus-red, #E92332)" />
                </svg>
              </div>

              {/* Playfair Display H3 + 2-line clamped description */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--navy-900)', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                  Compounding Over Time
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--muted, #5B6770)',
                    lineHeight: 1.5,
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  Why time in the market matters more than timing. Understand how consistent monthly SIPs smooth unpredictable cycles.
                </p>
              </div>

              {/* Footer: Shared arrow link */}
              <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span className="arrow-link" style={{ color: 'var(--lotus-red-fill, #C81B29)', fontWeight: 600, fontSize: '0.9rem' }}>
                  <span>Read guide</span>
                  <span className="arrow-icon">&rarr;</span>
                </span>
              </div>
            </Link>

            {/* Card 3: Asset Allocation Pie */}
            <Link to="/insights" className="learn-card">
              {/* Top Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--navy-700, #123D67)',
                    backgroundColor: 'var(--silver-100, #F3F5F7)',
                    border: '1px solid var(--silver-300, #D7D9DC)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.25rem 0.65rem',
                  }}
                >
                  PORTFOLIO DISCIPLINE
                </span>
                <span
                  data-numeral="true"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: 'var(--silver-300, #D7D9DC)',
                    whiteSpace: 'nowrap',
                    writingMode: 'horizontal-tb',
                    fontVariantNumeric: 'tabular-nums',
                    flexShrink: 0,
                    minWidth: 'max-content',
                  }}
                >
                  03
                </span>
              </div>

              {/* 96px tall clean SVG illustration */}
              <div className="learn-svg-illustration" style={{ height: '96px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="86" height="86" viewBox="0 0 86 86" aria-hidden="true">
                  <circle cx="43" cy="43" r="32" fill="none" stroke="var(--navy-800, #0E3154)" strokeWidth="13" strokeDasharray="110 95" strokeDashoffset="0" />
                  <circle cx="43" cy="43" r="32" fill="none" stroke="var(--steel-accent, #5B8DB8)" strokeWidth="13" strokeDasharray="50 155" strokeDashoffset="-110" />
                  <circle cx="43" cy="43" r="32" fill="none" stroke="var(--lotus-red, #E92332)" strokeWidth="13" strokeDasharray="45 160" strokeDashoffset="-160" />
                </svg>
              </div>

              {/* Playfair Display H3 + 2-line clamped description */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--navy-900)', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                  Disciplined Diversification
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--muted, #5B6770)',
                    lineHeight: 1.5,
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  Spreading exposure across equity, debt, and insurance buffers volatility and aligns with long-term family milestones.
                </p>
              </div>

              {/* Footer: Shared arrow link */}
              <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span className="arrow-link" style={{ color: 'var(--lotus-red-fill, #C81B29)', fontWeight: 600, fontSize: '0.9rem' }}>
                  <span>Read guide</span>
                  <span className="arrow-icon">&rarr;</span>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          11. FAQ ACCORDION (Screenshot 9: Two-Column Layout)
         ========================================================= */}
      <section className="section-padding stacked-section" id="faq" data-tone="light" data-reveal style={{ backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div className="grid grid-cols-1 grid-cols-md-12" style={{ gap: '3.5rem' }}>
            {/* Left Column (5 Cols): Intro + Help Card */}
            <div className="col-span-12 col-span-md-5">
              <span className="eyebrow-rule" />
              <span className="eyebrow">Clear Answers</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3vw, 2.5rem)', marginBottom: '1rem' }}>
                Frequently Asked Questions
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                Transparent guidance on insurance, investments, and our consultative approach in Godhra.
              </p>

              {/* Help Card */}
              <div
                className="card"
                style={{
                  backgroundColor: 'var(--silver-100)',
                  border: '1px solid var(--silver-300)',
                  borderRadius: '24px',
                  padding: '1.75rem',
                  boxShadow: 'var(--shadow-soft)',
                }}
              >
                <h4 style={{ color: 'var(--navy-900)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                  Still have a question?
                </h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                  Speak directly with our team in Godhra. No sales pressure, just straightforward, factual answers.
                </p>
                <button
                  type="button"
                  onClick={(e) => openContactDrawer(undefined, e.currentTarget)}
                  className="btn btn-primary"
                  style={{ borderRadius: 'var(--radius-btn)', padding: '0.6rem 1.4rem', border: 'none', cursor: 'pointer' }}
                >
                  Talk to an Advisor &rarr;
                </button>
              </div>
            </div>

            {/* Right Column (7 Cols): Smooth Accordion (Radius 20px, soft shadow, + rotates 45 deg) */}
            <div className="col-span-12 col-span-md-7">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {homeFaqs.map((faq, index) => {
                  const isOpen = openFaq === faq.id;
                  const itemNumber = (index + 1).toString().padStart(2, '0');

                  return (
                    <div
                      key={faq.id}
                      className="card"
                      style={{
                        padding: 0,
                        borderRadius: '20px',
                        border: isOpen ? '1px solid var(--navy-700)' : '1px solid var(--silver-300)',
                        boxShadow: 'var(--shadow-soft)',
                        overflow: 'hidden',
                        transition: 'all 0.24s ease',
                      }}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${faq.id}`}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1.25rem 1.5rem',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <span
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: isOpen ? 'var(--navy-900)' : 'var(--navy-100)',
                              color: isOpen ? 'var(--white)' : 'var(--navy-700)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              flexShrink: 0,
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {itemNumber}
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontWeight: 600,
                              fontSize: '1rem',
                              color: 'var(--navy-900)',
                            }}
                          >
                            {faq.question}
                          </span>
                        </div>

                        <span
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: isOpen ? 'var(--red-500)' : 'var(--silver-100)',
                            color: isOpen ? 'var(--white)' : 'var(--navy-700)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                            transition: 'transform 0.24s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.2s ease',
                            flexShrink: 0,
                            marginLeft: '1rem',
                          }}
                        >
                          +
                        </span>
                      </button>

                      {/* Smooth Height Animation via grid-template-rows */}
                      <div
                        id={`faq-answer-${faq.id}`}
                        style={{
                          display: 'grid',
                          gridTemplateRows: isOpen ? '1fr' : '0fr',
                          transition: 'grid-template-rows 0.28s ease',
                        }}
                      >
                        <div style={{ overflow: 'hidden' }}>
                          <div
                            style={{
                              padding: '0 1.5rem 1.25rem 4.1rem',
                              color: 'var(--muted)',
                              fontSize: '0.92rem',
                              lineHeight: '1.65',
                              borderTop: '1px solid var(--silver-200)',
                              marginTop: '0.25rem',
                              paddingTop: '0.85rem',
                            }}
                          >
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          12. ENQUIRY FORM (Screenshot 10: One Viewport Split Layout)
         ========================================================= */}
      <section className="section-padding bg-light stacked-section" id="enquiry" data-tone="light" data-reveal>
        <div className="container" style={{ maxWidth: '1060px' }}>
          <div className="grid grid-cols-1 grid-cols-md-12" style={{ gap: '2rem', alignItems: 'stretch' }}>
            {/* Left (5 Cols): Dark Navy Contact Panel */}
            <div
              className="col-span-12 col-span-md-5"
              style={{
                backgroundColor: 'var(--navy-900)',
                borderRadius: '24px',
                padding: '2.5rem',
                color: 'var(--white)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              <div>
                <span className="eyebrow" style={{ color: 'var(--silver-300)' }}>CONNECT WITH US</span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--white)',
                    fontSize: 'clamp(1.6rem, 2.2vw, 2.1rem)',
                    margin: '0.35rem 0 1rem',
                  }}
                >
                  Let's Discuss Your Goals
                </h3>
                <p style={{ color: 'var(--silver-300)', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '2rem' }}>
                  Visit our Godhra branch or send an online enquiry. Our advisors are available Monday to Saturday for
                  structured, confidential consultations.
                </p>

                {/* Office Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.1rem' }}>📍</span>
                    <div>
                      <strong>Godhra Office:</strong>
                      <div style={{ color: 'var(--silver-300)', marginTop: '2px' }}>
                        {contactData.address.line1}, {contactData.address.city}, {contactData.address.state} - {contactData.address.pincode}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem' }}>📞</span>
                    <div>
                      <strong>Phone:</strong>{' '}
                      <a href={`tel:${contactData.phone}`} style={{ color: 'var(--silver-300)', textDecoration: 'none' }}>
                        {contactData.phoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem' }}>✉️</span>
                    <div>
                      <strong>Email:</strong>{' '}
                      <a href={`mailto:${contactData.email}`} style={{ color: 'var(--silver-300)', textDecoration: 'none' }}>
                        {contactData.email}
                      </a>
                    </div>
                  </div>

                  {'officeHours' in contactData && (contactData as any).officeHours ? (
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.1rem' }}>⏰</span>
                      <div>
                        <strong>Hours:</strong> {(contactData as any).officeHours}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div
                style={{
                  marginTop: '2rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.76rem',
                  color: 'var(--silver-300)',
                }}
              >
                AMFI Registered Mutual Fund Distributor • ARN-160174
              </div>
            </div>

            {/* Right (7 Cols): Compact White Form Card (Max ~560px) */}
            <div className="col-span-12 col-span-md-7">
              <EnquiryForm
                compact={true}
                defaultService="mutual-funds"
                title="Send an Enquiry"
                subtitle="Share a few details and our Godhra team will follow up during business hours."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
