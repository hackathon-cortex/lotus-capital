import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import servicesContent from '@content/pages/services.json';
import servicesData from '@content/data/services.json';
import seoData from '@content/data/seo.json';
import { useStatistics } from '../../hooks/useStatistics';
import { StatBlock } from '../../components/stats/StatBlock';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';
import lotusWatermark from '../../assets/lotus_capital_logo_traced.svg';

export const Services: React.FC = () => {
  const seo = seoData['/services'];
  const { stats } = useStatistics(['clients_serviced', 'insurance_policies_total', 'mf_folios', 'demat_accounts']);

  const getServiceIcon = (slug: string) => {
    switch (slug) {
      case 'general-insurance':
        return '🚗';
      case 'life-insurance':
        return '🛡️';
      case 'health-insurance':
        return '🏥';
      case 'mutual-funds':
        return '📈';
      case 'equity':
        return '📊';
      default:
        return '🏛️';
    }
  };

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Hero */}
      <section
        className="hero"
        style={{
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          backgroundColor: 'var(--navy-950)',
          overflow: 'hidden',
          paddingTop: '120px',
          paddingBottom: '60px',
        }}
      >
        <div
          className="hero-scrim"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(10,37,64,0.95) 0%, rgba(18,61,103,0.85) 100%)',
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '-50px',
            bottom: '-40px',
            width: '400px',
            height: '400px',
            opacity: 0.05,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <img src={lotusWatermark} alt="" style={{ width: '100%', height: '100%', filter: 'brightness(0) invert(1)' }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px' }}>
            <span
              className="eyebrow"
              style={{
                color: 'var(--silver-300)',
                letterSpacing: '0.12em',
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '0.75rem',
              }}
            >
              FINANCIAL ARCHITECTURE • GODHRA, GUJARAT
            </span>
            <h1
              style={{
                color: 'var(--white)',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                lineHeight: 1.15,
                marginBottom: '1rem',
              }}
            >
              {servicesContent.headline}
            </h1>
            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--silver-300)',
                lineHeight: 1.6,
                maxWidth: '720px',
                margin: 0,
              }}
            >
              {servicesContent.intro || 'Explore our full suite of insurance, mutual funds, equity broking, and fixed income solutions tailored to protect and compound your family wealth.'}
            </p>
          </div>
        </div>
      </section>

      {/* Stat Strip */}
      <section className="section-padding-sm bg-light" data-reveal>
        <div className="container">
          <StatBlock stats={stats} columns={4} />
        </div>
      </section>

      {/* Reference 2: 6-Card Services Grid */}
      <section className="section-padding" id="services-list" data-reveal>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span className="eyebrow">Disciplined Structure</span>
            <h2>Our Core Practice Areas</h2>
            <p style={{ color: 'var(--muted)' }}>
              Clear product scopes, verified credentials, and client-centric guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 grid-cols-md-3" style={{ gap: '2rem' }}>
            {servicesData.map((s) => (
              <div
                key={s.slug}
                className="card service-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2rem',
                  position: 'relative',
                  transition: 'transform var(--dur-base) var(--ease-standard), border-color var(--dur-base) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div
                    className="service-icon-circle"
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--silver-100)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {getServiceIcon(s.slug)}
                  </div>
                  {s.statDisplayText && (
                    <span
                      style={{
                        padding: '0.25rem 0.65rem',
                        backgroundColor: 'var(--navy-100)',
                        color: 'var(--navy-700)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {s.statDisplayText}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--navy-900)' }}>
                  {s.title}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>
                  {s.shortDescription}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                  <Link
                    to={s.path}
                    className="btn btn-secondary"
                    style={{ width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <span>View Service Guide</span>
                    <span style={{ transition: 'transform 0.2s ease' }}>→</span>
                  </Link>
                  <Link
                    to={`/contact-us?service=${s.slug}`}
                    className="btn btn-primary"
                    style={{ width: '100%', textAlign: 'center', fontSize: '0.88rem', padding: '0.5rem 1rem' }}
                  >
                    Request Consultation
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultative advisory banner */}
      <section className="section-padding bg-light" data-reveal>
        <div className="container" style={{ maxWidth: '850px', textAlign: 'center' }}>
          <span className="eyebrow">Our Philosophy</span>
          <h2>How to Choose the Right Solution</h2>
          <p style={{ color: 'var(--ink)', fontSize: '1.05rem', lineHeight: '1.7', margin: '1rem 0 2rem' }}>
            We invite visitors and families in Gujarat to discuss their specific objectives, investment time horizons,
            comfort with risk, household cash flows, and existing policies. We present products clearly
            without high-pressure sales pitches or speculative promises.
          </p>
          <a href="#enquiry" className="btn btn-primary btn-lg">
            Schedule a Personal Discussion →
          </a>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="section-padding" id="enquiry" data-reveal>
        <div className="container" style={{ maxWidth: '780px' }}>
          <EnquiryForm
            title="Discuss Your Financial Roadmap"
            subtitle="Tell us which solutions you would like to explore. Our team in Godhra will arrange a comprehensive discussion."
          />
        </div>
      </section>
    </>
  );
};
