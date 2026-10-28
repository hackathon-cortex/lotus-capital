import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import servicesContent from '@content/pages/services.json';
import servicesData from '@content/data/services.json';
import seoData from '@content/data/seo.json';
import { useStatistics } from '../../hooks/useStatistics';
import { StatBlock } from '../../components/stats/StatBlock';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';

export const Services: React.FC = () => {
  const seo = seoData['/services'];
  const { stats } = useStatistics(['clients_serviced', 'insurance_policies_total', 'mf_folios', 'demat_accounts']);

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Hero */}
      <section className="section-padding bg-navy">
        <div className="container">
          <div style={{ maxWidth: '800px' }}>
            <span className="eyebrow" style={{ color: 'var(--red-300)' }}>
              Lotus Capital Services
            </span>
            <h1 style={{ color: 'var(--white)', marginBottom: '1.25rem' }}>
              {servicesContent.headline}
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--silver-300)' }}>
              {servicesContent.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Stat Strip */}
      <section className="section-padding-sm bg-light">
        <div className="container">
          <StatBlock stats={stats} columns={4} />
        </div>
      </section>

      {/* Service Cards */}
      <section className="section-padding" id="services-list">
        <div className="container">
          <div className="grid grid-cols-3">
            {servicesData.map((s) => (
              <div key={s.slug} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>
                    {s.category.toUpperCase()}
                  </span>
                  <h3>{s.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                    {s.shortDescription}
                  </p>
                  {s.statDisplayText && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--navy-700)', fontWeight: 600, marginBottom: '1rem' }}>
                      Verified: {s.statDisplayText}
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                  <Link to={s.path} className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
                    View Service Details &rarr;
                  </Link>
                  <Link
                    to={`/contact-us?service=${s.slug}`}
                    className="btn btn-primary"
                    style={{ width: '100%', textAlign: 'center', fontSize: '0.85rem', padding: '0.5rem' }}
                  >
                    Request Quote / Information
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to choose */}
      <section className="section-padding bg-light">
        <div className="container" style={{ maxWidth: '850px', textAlign: 'center' }}>
          <h2>How to Choose the Right Solution</h2>
          <p style={{ color: 'var(--ink)', fontSize: '1.05rem', margin: '1rem 0 1.5rem' }}>
            We invite visitors to discuss their specific objectives, investment time horizon,
            comfort with risk, household cash flows, and existing policies. We present products clearly
            without high-pressure sales pitches.
          </p>
          <a href="#enquiry" className="btn btn-navy">
            Send an Enquiry to Discuss &rarr;
          </a>
        </div>
      </section>

      {/* Enquiry */}
      <section className="section-padding" id="enquiry">
        <div className="container" style={{ maxWidth: '750px' }}>
          <EnquiryForm
            title="Not sure where to start? Send an enquiry."
            subtitle="Tell us your goals and we will help direct you to the appropriate solution."
          />
        </div>
      </section>
    </>
  );
};

