import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import homeContent from '@content/pages/home.json';
import seoData from '@content/data/seo.json';
import servicesData from '@content/data/services.json';
import partnersData from '@content/data/partners.json';
import faqsData from '@content/data/faqs.json';
import { useStatistics } from '../../hooks/useStatistics';
import { StatBlock } from '../../components/stats/StatBlock';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';

export const Home: React.FC = () => {
  const seo = seoData['/'];
  const { stats: mainStats } = useStatistics(['clients_serviced', 'aum_total', 'mf_folios', 'demat_accounts']);
  const { stats: secondaryStats } = useStatistics(['insurance_policies_total']);
  const homeFaqs = faqsData.filter((f) => f.page === 'home');

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* 1. Hero */}
      <section className="section-padding bg-navy" aria-labelledby="home-hero-title">
        <div className="container">
          <div style={{ maxWidth: '800px' }}>
            <span className="eyebrow" style={{ color: 'var(--red-300)' }}>
              {homeContent.eyebrow}
            </span>
            <h1 id="home-hero-title" style={{ color: 'var(--white)', fontSize: '2.5rem', marginBottom: '1.25rem' }}>
              {homeContent.headline}
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--silver-300)', marginBottom: '2rem' }}>
              {homeContent.intro}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/services" className="btn btn-primary">
                Explore Our Services
              </Link>
              <Link to="/contact-us" className="btn btn-secondary" style={{ color: 'var(--white)', borderColor: 'var(--silver-300)' }}>
                Talk to an Advisor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Strip */}
      <section className="section-padding-sm bg-light" aria-label="Key Statistics">
        <div className="container">
          <StatBlock stats={mainStats} columns={4} />

          {secondaryStats.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <StatBlock stats={secondaryStats} columns={2} />
            </div>
          )}

          <p style={{ fontSize: '0.8rem', color: 'var(--silver-500)', marginTop: '1rem', textAlign: 'center' }}>
            Source: Lotus Capital records. Figures subject to client date verification.
          </p>
        </div>
      </section>

      {/* 3. About Preview */}
      <section className="section-padding">
        <div className="container">
          <div className="card" style={{ padding: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>
            <span className="eyebrow">About Lotus Capital</span>
            <h2>Grounding Financial Clarity in Godhra</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--ink)', marginBottom: '1.5rem' }}>
              Lotus Capital is a financial services business based in Godhra, Gujarat. We help clients understand and access insurance, mutual funds, equity and related services, and we stay in touch after the first conversation.
            </p>
            <Link to="/about-us" className="btn btn-secondary">
              Learn more about our background and leadership &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Service Cards */}
      <section className="section-padding bg-light" id="services" aria-labelledby="services-heading">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
            <span className="eyebrow">Solutions Tailored to You</span>
            <h2 id="services-heading">Our Financial Services</h2>
            <p style={{ color: 'var(--muted)' }}>
              Protection, investments and long-term planning with distinct terms and transparent risks.
            </p>
          </div>

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
                      Verified scale: {s.statDisplayText}
                    </div>
                  )}
                </div>
                <Link to={s.path} className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%' }}>
                  Learn Details &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How We Work */}
      <section className="section-padding" aria-labelledby="process-heading">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
            <span className="eyebrow">Structured Process</span>
            <h2 id="process-heading">How We Work with Clients</h2>
          </div>

          <div className="grid grid-cols-4">
            {[
              { step: '1', title: 'We Listen', desc: 'Understanding your family commitments, horizon and financial goals.' },
              { step: '2', title: 'We Explain', desc: 'Presenting available options with costs, exclusions and risks in plain language.' },
              { step: '3', title: 'We Facilitate', desc: 'Assisting through paperwork and onboarding with verified product providers.' },
              { step: '4', title: 'We Stay Available', desc: 'Ongoing servicing, portfolio reviews, renewals and claims assistance.' }
            ].map((p) => (
              <div key={p.step} className="card" style={{ borderTop: '4px solid var(--navy-700)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--red-500)', marginBottom: '0.5rem' }}>
                  {p.step}
                </div>
                <h4>{p.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Partners */}
      <section className="section-padding bg-light" aria-labelledby="partners-heading">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem' }}>
            <span className="eyebrow">Institutional Relationships</span>
            <h2 id="partners-heading">Confirmed Partners & Affiliations</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
              Relationships under respective regulatory authorisations and agreements.
            </p>
          </div>

          <div className="grid grid-cols-3">
            {partnersData.slice(0, 6).map((partner) => (
              <div key={partner.id} className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.25rem' }}>{partner.name}</h4>
                <span className="badge badge-info">{partner.relationshipLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Learn Before You Invest (Insights) */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem' }}>
            <span className="eyebrow">Investor Education</span>
            <h2>Learn Before You Invest</h2>
            <p style={{ color: 'var(--muted)' }}>
              Clear fundamentals to help you make responsible financial decisions.
            </p>
          </div>

          <div className="grid grid-cols-3">
            <div className="card">
              <h4>Understanding Risk</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                Risk is not just volatility; understanding capital risk and inflation risk.
              </p>
              <Link to="/insights" className="nav-link">Read Guide &rarr;</Link>
            </div>
            <div className="card">
              <h4>Time Horizon</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                Matching investment horizon to equity, debt or liquid assets.
              </p>
              <Link to="/insights" className="nav-link">Read Guide &rarr;</Link>
            </div>
            <div className="card">
              <h4>Diversification</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                Why allocating across distinct asset classes protects against single-event loss.
              </p>
              <Link to="/insights" className="nav-link">Read Guide &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQs */}
      <section className="section-padding bg-light" id="faqs" aria-labelledby="faqs-heading">
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="eyebrow">Common Questions</span>
            <h2 id="faqs-heading">Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {homeFaqs.map((faq) => (
              <div key={faq.id} className="card" style={{ padding: '1.25rem' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--navy-900)' }}>
                  {faq.question}
                </h4>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--muted)' }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Enquiry CTA */}
      <section className="section-padding" id="enquiry" aria-labelledby="enquiry-heading">
        <div className="container" style={{ maxWidth: '750px' }}>
          <EnquiryForm
            title="Talk to an Advisor"
            subtitle="Send your enquiry and our Godhra team will follow up during business hours."
          />
        </div>
      </section>
    </>
  );
};

