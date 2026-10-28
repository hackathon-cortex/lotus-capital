import React from 'react';
import { Helmet } from 'react-helmet-async';
import pageContent from '@content/pages/health-insurance.json';
import seoData from '@content/data/seo.json';
import faqsData from '@content/data/faqs.json';
import { useStatistics } from '../../hooks/useStatistics';
import { StatBlock } from '../../components/stats/StatBlock';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';

export const HealthInsurance: React.FC = () => {
  const seo = seoData['/services/health-insurance'];
  const { stats } = useStatistics(['health_policies']);
  const pageFaqs = faqsData.filter((f) => f.page === 'health-insurance');

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
            <span className="eyebrow" style={{ color: 'var(--red-300)' }}>Health Insurance</span>
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

      {/* Overview & Policy Types */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-2" style={{ gap: '3rem', alignItems: 'start' }}>
            <div>
              <span className="eyebrow">Medical Protection</span>
              <h2>Healthcare Policy Categories</h2>
              <ul style={{ paddingLeft: '1.25rem', lineHeight: '2.2', marginTop: '1rem' }}>
                <li><strong>Individual Health Insurance:</strong> Dedicated sum insured for a single individual.</li>
                <li><strong>Family Floater Plans:</strong> Shared sum insured across spouse, children and parents.</li>
                <li><strong>Senior Citizen Health Cover:</strong> Tailored for older adults with specialised coverage options.</li>
                <li><strong>Critical Illness & Super Top-up:</strong> Additional cost-effective coverage above base policy deductibles.</li>
              </ul>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--silver-100)' }}>
              <h3>Partner Insurers & Network Support</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                Associated with <strong>Care Health Insurance</strong> (since 2012) and other confirmed insurers.
              </p>
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--silver-300)' }}>
                <strong>Claim Support Assistance</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                  We assist clients with hospital intimation, document collation, and queries during cashless hospitalisation and reimbursement requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to compare */}
      <section className="section-padding bg-light" id="compare">
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="eyebrow">Detailed Checklist</span>
            <h2>Comparison Checklist</h2>
            <p style={{ color: 'var(--muted)' }}>What to examine before enrolling in a healthcare plan.</p>
          </div>

          <div className="grid grid-cols-2">
            {[
              'Pre-existing disease waiting periods (typically 1 to 3 years)',
              'Room rent capping and proportionate internal deductions',
              'Co-payment clauses and mandatory deductibles',
              'Empanelled cashless hospital networks in Godhra and Gujarat',
              'Day-care procedures and modern treatment robotic coverage',
              'Restoration / recharge of sum insured upon exhaustion'
            ].map((item, idx) => (
              <div key={idx} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: '0.95rem' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to request a quote */}
      <section className="section-padding">
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="eyebrow">Simple Steps</span>
            <h2>How to Request a Quotation</h2>
          </div>

          <div className="grid grid-cols-4">
            {[
              { step: '1', title: 'Share Details', desc: 'Family members, ages and any medical history.' },
              { step: '2', title: 'Compare Plans', desc: 'Examine sum insured options and waiting periods.' },
              { step: '3', title: 'Review Wording', desc: 'Verify policy exclusions before signing proposal.' },
              { step: '4', title: 'Instant Issue', desc: 'Receive policy bond with digital card and network list.' }
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
            <h2>Health Insurance FAQs</h2>
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
          <strong>Notice:</strong> Insurance is the subject matter of solicitation. Cover is subject to insurer acceptance, medical underwriting declarations, waiting periods, and specific policy exclusions.
        </div>
      </section>

      {/* Enquiry */}
      <section className="section-padding" id="enquiry">
        <div className="container" style={{ maxWidth: '750px' }}>
          <EnquiryForm
            defaultService="health-insurance"
            title="Find Health Coverage for Your Needs"
            subtitle="Tell us about your family size and medical coverage requirements."
          />
        </div>
      </section>
    </>
  );
};

