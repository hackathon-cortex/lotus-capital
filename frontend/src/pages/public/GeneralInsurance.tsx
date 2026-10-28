import React from 'react';
import { Helmet } from 'react-helmet-async';
import pageContent from '@content/pages/general-insurance.json';
import seoData from '@content/data/seo.json';
import faqsData from '@content/data/faqs.json';
import partnersData from '@content/data/partners.json';
import { useStatistics } from '../../hooks/useStatistics';
import { StatBlock } from '../../components/stats/StatBlock';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';

export const GeneralInsurance: React.FC = () => {
  const seo = seoData['/services/general-insurance'];
  const { stats } = useStatistics(['motor_policies']);
  const pageFaqs = faqsData.filter((f) => f.page === 'general-insurance');
  const insurancePartners = partnersData.filter((p) => p.category === 'insurance');

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
            <span className="eyebrow" style={{ color: 'var(--red-300)' }}>General Insurance</span>
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

      {/* Overview & Categories */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-2" style={{ gap: '3rem', alignItems: 'start' }}>
            <div>
              <span className="eyebrow">Cover Options</span>
              <h2>Product Categories</h2>
              <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
                We assist individuals and commercial enterprises with general non-life covers:
              </p>
              <ul style={{ paddingLeft: '1.25rem', lineHeight: '2' }}>
                <li>Vehicle Insurance (Cars, two-wheelers, and commercial fleets)</li>
                <li>Commercial property, fire, and special perils insurance</li>
                <li>Marine transit and cargo policies</li>
                <li>Professional indemnity and business liabilities</li>
                <li>Shopkeeper and enterprise package policies</li>
                <li>Travel insurance (domestic and overseas)</li>
              </ul>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--silver-100)' }}>
              <h3>Insurer Partners</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                General insurance contracts are underwritten by our partner insurers including ICICI Lombard, HDFC ERGO, and Bajaj Allianz General Insurance.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                {insurancePartners.slice(0, 4).map((p) => (
                  <div key={p.id} style={{ padding: '0.5rem', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--silver-300)' }}>
                    <strong>{p.name}</strong> <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>({p.relationshipLabel})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to compare checklist */}
      <section className="section-padding bg-light" id="compare">
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="eyebrow">Careful Selection</span>
            <h2>What to Compare Before You Buy</h2>
          </div>

          <div className="grid grid-cols-2">
            {[
              'Cover scope vs specific exclusions',
              'Insured Declared Value (IDV) adequacy',
              'Compulsory and voluntary deductibles',
              'No-Claim Bonus (NCB) retention and transfer',
              'Cashless garage empanelment in Godhra & Gujarat',
              'Add-on bundles: Zero Depreciation, Engine Protect, Roadside Assistance'
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
            <span className="eyebrow">Clear Process</span>
            <h2>How to Request a Quotation</h2>
          </div>

          <div className="grid grid-cols-4">
            {[
              { step: '1', title: 'Contact Us', desc: 'Send an enquiry or call our Godhra office.' },
              { step: '2', title: 'Share Details', desc: 'Provide vehicle registration (RC) or property specifics.' },
              { step: '3', title: 'Compare Quotes', desc: 'Receive side-by-side rates and term sheets from partner insurers.' },
              { step: '4', title: 'Review & Decide', desc: 'Examine policy wording before payment.' }
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
            <h2>General Insurance FAQs</h2>
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
          <strong>Notice:</strong> Insurance is the subject matter of solicitation. Policy issuance and claim settlement are subject to underwriter approval, policy terms, conditions, and declared exclusions.
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="section-padding" id="enquiry">
        <div className="container" style={{ maxWidth: '750px' }}>
          <EnquiryForm
            defaultService="general-insurance"
            title="Request a General Insurance Quote"
            subtitle="Share your requirement and vehicle or property details for a quick quote comparison."
          />
        </div>
      </section>
    </>
  );
};

