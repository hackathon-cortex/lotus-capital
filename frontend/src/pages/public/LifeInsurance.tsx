import React from 'react';
import { Helmet } from 'react-helmet-async';
import pageContent from '@content/pages/life-insurance.json';
import seoData from '@content/data/seo.json';
import faqsData from '@content/data/faqs.json';
import partnersData from '@content/data/partners.json';
import { useStatistics } from '../../hooks/useStatistics';
import { StatBlock } from '../../components/stats/StatBlock';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';

export const LifeInsurance: React.FC = () => {
  const seo = seoData['/services/life-insurance'];
  const { stats } = useStatistics(['life_policies']);
  const pageFaqs = faqsData.filter((f) => f.page === 'life-insurance');
  const lifePartners = partnersData.filter(
    (p) => p.name.includes('Life') || p.name.includes('LIC')
  );

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
            <span className="eyebrow" style={{ color: 'var(--red-300)' }}>Life Insurance</span>
            <h1 style={{ color: 'var(--white)', marginBottom: '1.25rem' }}>
              {pageContent.headline}
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--silver-300)' }}>
              {pageContent.sections.find((s) => s.id === 'hero')?.copy}
            </p>
          </div>
        </div>
      </section>

      {/* Stat Block */}
      <section className="section-padding-sm bg-light">
        <div className="container">
          <StatBlock stats={stats} columns={2} />
        </div>
      </section>

      {/* Product Categories & Partners */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-2" style={{ gap: '3rem', alignItems: 'start' }}>
            <div>
              <span className="eyebrow">Financial Security</span>
              <h2>Product Categories</h2>
              <ul style={{ paddingLeft: '1.25rem', lineHeight: '2.2', marginTop: '1rem' }}>
                <li><strong>Pure Term Insurance:</strong> High sum assured coverage to replace income during productive earning years.</li>
                <li><strong>Savings & Endowment:</strong> Guaranteed protection with systematic maturity payouts.</li>
                <li><strong>Retirement & Pension:</strong> Long-term annuity solutions for post-retirement income.</li>
                <li><strong>Participating Plans:</strong> Annual bonus participation linked to insurer performance.</li>
              </ul>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--silver-100)' }}>
              <h3>Partner Insurers</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                We arrange products through confirmed partner life insurance institutions:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                {lifePartners.map((p) => (
                  <div key={p.id} style={{ padding: '0.5rem', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--silver-300)' }}>
                    <strong>{p.name}</strong> <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>({p.relationshipLabel})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key considerations checklist */}
      <section className="section-padding bg-light" id="compare">
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="eyebrow">Prudent Decision Making</span>
            <h2>Key Considerations</h2>
          </div>

          <div className="grid grid-cols-2">
            {[
              'Sum assured adequacy (10-15x annual household expenditure)',
              'Policy duration vs expected dependency timeline',
              'Premium affordability across multi-year commitments',
              'Critical illness and accidental permanent disability riders',
              'Claim settlement ratio and speed of partner insurer',
              'Exclusions and nominee declaration verification'
            ].map((item, idx) => (
              <div key={idx} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: '0.95rem' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide */}
      <section className="section-padding">
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="eyebrow">Onboarding Journey</span>
            <h2>Purchase and Servicing Guide</h2>
          </div>

          <div className="grid grid-cols-4">
            {[
              { step: '1', title: 'Consultation', desc: 'Identify liabilities, dependants and family goals.' },
              { step: '2', title: 'Plan Selection', desc: 'Compare term and savings plans with clear disclosures.' },
              { step: '3', title: 'Underwriting', desc: 'Submit medical history and proposal documentation.' },
              { step: '4', title: 'Servicing', desc: 'Receive policy bond, track renewals, and register nominees.' }
            ].map((s) => (
              <div key={s.step} className="card">
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--red-500)', marginBottom: '0.25rem' }}>
                  {s.step}
                </div>
                <h4>{s.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-light" id="faqs">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2>Life Insurance FAQs</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pageFaqs.map((faq) => (
              <div key={faq.id} className="card">
                <h4>{faq.question}</h4>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.95rem' }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk note */}
      <section className="container" style={{ margin: '2rem auto' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--warning)', backgroundColor: '#fffbe6' }}>
          <strong>Notice:</strong> Insurance is the subject matter of solicitation. Do not treat life insurance as a guaranteed investment return unless guaranteed under the terms of the specific policy bond.
        </div>
      </section>

      {/* Enquiry */}
      <section className="section-padding" id="enquiry">
        <div className="container" style={{ maxWidth: '750px' }}>
          <EnquiryForm
            defaultService="life-insurance"
            title="Discuss Your Life Insurance Needs"
            subtitle="Let our advisors help you calculate adequate coverage and compare partner policies."
          />
        </div>
      </section>
    </>
  );
};

