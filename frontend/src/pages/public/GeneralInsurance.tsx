import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import pageContent from '@content/pages/general-insurance.json';
import seoData from '@content/data/seo.json';
import faqsData from '@content/data/faqs.json';
import partnersData from '@content/data/partners.json';
import { useStatistics } from '../../hooks/useStatistics';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';
import { LotusLogo } from '../../components/common/LotusLogo';

export const GeneralInsurance: React.FC = () => {
  const seo = seoData['/services/general-insurance'];
  const { stats } = useStatistics(['motor_policies']);
  const pageFaqs = faqsData.filter((f) => f.page === 'general-insurance');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const generalPartners = partnersData.filter(
    (p) => p.id === 'icici_lombard' || p.id === 'hdfc_ergo' || p.id === 'bajaj_allianz'
  );

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Reference 4: Page Hero */}
      <section
        className="hero"
        style={{
          minHeight: '480px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          backgroundColor: 'var(--navy-950)',
          overflow: 'hidden',
          paddingTop: '120px',
          paddingBottom: '80px',
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
            width: '420px',
            height: '420px',
            opacity: 0.05,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <LotusLogo variant="watermark" width="100%" height="100%" />
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
              ASSET & LIABILITY PROTECTION • GODHRA, GUJARAT
            </span>
            <h1
              style={{
                color: 'var(--white)',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
              }}
            >
              {pageContent.headline}
            </h1>
            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--silver-300)',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '720px',
              }}
            >
              {pageContent.sections.find((s) => s.id === 'hero')?.copy}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <a href="#enquiry" className="btn btn-primary btn-lg">
                Request a General Quote
              </a>
              <a href="#compare" className="btn btn-secondary-dark btn-lg">
                View Policy Checklist
              </a>
              {stats[0] && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(215,217,220,0.2)',
                    color: 'var(--silver-300)',
                    fontSize: '0.85rem',
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--red-500)' }} />
                  <span><strong>{stats[0].value}</strong> Motor Policies Serviced</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reference 4: Overview (2 Columns: Text Left 7, Key Facts Right 5) */}
      <section className="section-padding" data-reveal>
        <div className="container">
          <div className="grid grid-cols-12" style={{ gap: '3rem', alignItems: 'start' }}>
            <div className="col-span-12 col-span-md-7">
              <span className="eyebrow">Comprehensive Indemnity</span>
              <h2>Shielding Commercial and Personal Property</h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
                General insurance safeguards your physical possessions, vehicular investments, business premises, and enterprise liabilities
                against unforeseen perils including road accidents, fire damage, natural calamities, theft, and third-party litigations.
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
                At Lotus Capital in Godhra, we assist vehicle owners, commercial fleet operators, retail merchants, and manufacturing units
                in evaluating adequate Insured Declared Value (IDV), zero depreciation add-ons, and public liability coverage to guarantee financial continuity.
              </p>
            </div>

            <div className="col-span-12 col-span-md-5">
              <div
                className="card"
                style={{
                  backgroundColor: 'var(--silver-100)',
                  borderColor: 'var(--silver-300)',
                  padding: '2rem',
                }}
              >
                <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-900)', marginBottom: '1.25rem' }}>
                  Coverage Highlights & Add-ons
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem' }}>
                    <span style={{ color: 'var(--navy-700)', fontWeight: 700 }}>✓</span>
                    <span><strong>Zero Depreciation:</strong> 100% reimbursement on replaced vehicle parts without age depreciation.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem' }}>
                    <span style={{ color: 'var(--navy-700)', fontWeight: 700 }}>✓</span>
                    <span><strong>Engine & Gearbox Protector:</strong> Water ingression and lubricating oil leakage protection.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem' }}>
                    <span style={{ color: 'var(--navy-700)', fontWeight: 700 }}>✓</span>
                    <span><strong>Standard Fire & Special Perils:</strong> Factory, warehouse, and inventory protection.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem' }}>
                    <span style={{ color: 'var(--navy-700)', fontWeight: 700 }}>✓</span>
                    <span><strong>Marine Transit / Cargo:</strong> Multi-modal transit insurance against damage or loss in transit.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reference 4: Categories Grid */}
      <section className="section-padding bg-light" data-reveal>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span className="eyebrow">Product Taxonomy</span>
            <h2>General Insurance Solutions</h2>
            <p style={{ color: 'var(--muted)' }}>
              Protecting personal mobility, enterprise facilities, and commercial risks.
            </p>
          </div>

          <div className="grid grid-cols-1 grid-cols-md-3" style={{ gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                01
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Motor Insurance</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Comprehensive and third-party covers for private cars, two-wheelers, and commercial transport fleets with instant renewal.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                02
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Property & Fire Cover</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Indemnity against fire, earthquakes, storms, riots, and structural damages for homes, shops, warehouses, and factories.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                03
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Marine & Transit</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Protection for cargo and raw materials against transit risks across road, rail, air, and coastal sea shipments.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                04
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Business Liabilities</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Public liability, product liability, and directors & officers (D&O) protection shielding against legal claims.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                05
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Shopkeeper & SME Packages</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Bundled protection for retail establishments combining burglary, fire, cash-in-transit, and neon sign insurance.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                06
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Travel Insurance</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Domestic and international emergency travel insurance covering trip cancellations, baggage loss, and overseas medical care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reference 4: What to Compare */}
      <section className="section-padding" id="compare" data-reveal>
        <div className="container" style={{ maxWidth: '920px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="eyebrow">Checklist</span>
            <h2>What to Compare in General Insurance</h2>
            <p style={{ color: 'var(--muted)' }}>Key aspects to inspect prior to issuing or renewing policies.</p>
          </div>

          <div className="grid grid-cols-1 grid-cols-md-2" style={{ gap: '1.25rem' }}>
            {[
              {
                title: 'Accurate Insured Declared Value (IDV)',
                desc: 'Ensure your vehicle IDV is calibrated correctly to avoid under-insurance penalties during total loss or theft.',
              },
              {
                title: 'Cashless Network Garages',
                desc: 'Verify authorisations for local authorised workshops and body-shops in Godhra, Halol, and Vadodara.',
              },
              {
                title: 'Deductibles and Voluntary Excess',
                desc: 'Review compulsory deductibles versus voluntary excess to strike an optimal balance between premium and claim payout.',
              },
              {
                title: 'Consumables & Tyre Protection Add-ons',
                desc: 'Check if nuts, bolts, engine oil, coolant, and tyre damage are included or excluded from repair claim costs.',
              },
            ].map((item, idx) => (
              <div key={idx} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--navy-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>
                  ✓
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.35rem', fontSize: '1.02rem', color: 'var(--navy-900)' }}>{item.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--muted)', lineHeight: '1.5' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reference 4: Insurer Partners Logo Strip */}
      <section style={{ backgroundColor: 'var(--silver-100)', padding: '3rem 0', borderTop: '1px solid var(--silver-300)', borderBottom: '1px solid var(--silver-300)' }} data-reveal>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              Underwritten by Leading General Insurers
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '3rem' }}>
            {generalPartners.map((partner) => (
              <div
                key={partner.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '1rem 1.5rem',
                  backgroundColor: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--silver-300)',
                  minWidth: '220px',
                }}
              >
                <img
                  src={partner.logoPlaceholder}
                  alt={partner.name}
                  style={{ height: '36px', maxWidth: '160px', objectFit: 'contain', marginBottom: '0.5rem' }}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--navy-700)', fontWeight: 600 }}>
                  {partner.name}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                  {partner.relationshipLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reference 4: How to Get a Quote */}
      <section className="section-padding" data-reveal>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="eyebrow">Clear Workflow</span>
            <h2>Simple Steps to Request a General Insurance Quote</h2>
            <p style={{ color: 'var(--muted)' }}>Fast and verified quotation turnaround from leading insurers.</p>
          </div>

          <div className="grid grid-cols-1 grid-cols-md-4" style={{ gap: '1.5rem' }}>
            {[
              { step: '01', title: 'Share Registration / RC', desc: 'Provide vehicle registration copy or asset property details.' },
              { step: '02', title: 'Compare Insurer Rates', desc: 'Evaluate IDVs, zero-dep add-ons, and pricing across insurers.' },
              { step: '03', title: 'Verify No Claim Bonus', desc: 'Confirm previous NCB percentage for maximum premium savings.' },
              { step: '04', title: 'Instant Policy Bond', desc: 'Instant digital policy issuance with immediate cover note.' },
            ].map((s) => (
              <div key={s.step} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--red-500)', fontFamily: 'Poppins, sans-serif', marginBottom: '0.5rem' }}>
                  {s.step}
                </div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>{s.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.6', margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reference 4: FAQs */}
      <section className="section-padding bg-light" id="faqs" data-reveal>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="eyebrow">Clarity First</span>
            <h2>General Insurance FAQs</h2>
            <p style={{ color: 'var(--muted)' }}>Answers to common questions regarding motor and asset policies.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pageFaqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderColor: isOpen ? 'var(--navy-600)' : 'var(--silver-300)',
                  }}
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--navy-900)' }}>{faq.question}</h4>
                    <span
                      style={{
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 0.24s cubic-bezier(0.22, 1, 0.36, 1)',
                        fontSize: '1.5rem',
                        lineHeight: 1,
                        color: 'var(--navy-700)',
                        fontWeight: 300,
                        marginLeft: '1rem',
                      }}
                    >
                      +
                    </span>
                  </div>
                  {isOpen && (
                    <p style={{ margin: '1rem 0 0', color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6', borderTop: '1px solid var(--silver-300)', paddingTop: '0.75rem' }}>
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reference 4: Risk Note */}
      <section className="container" style={{ margin: '2rem auto' }} data-reveal>
        <div
          className="risk-note"
          style={{
            backgroundColor: 'var(--silver-100)',
            borderLeft: '4px solid var(--navy-700)',
            padding: '1.5rem 2rem',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--navy-700)', fontSize: '1.25rem', lineHeight: 1, marginTop: '2px' }}>
              ⓘ
            </div>
            <div>
              <strong style={{ color: 'var(--navy-900)', fontSize: '0.95rem' }}>
                Statutory Insurance Notice:
              </strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink)', margin: '0.5rem 0 0', lineHeight: '1.6' }}>
                Insurance is the subject matter of solicitation. Policy coverage, terms, waiting periods, sub-limits,
                and exclusions are subject to the specific policy terms and conditions issued by the underwriting insurer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reference 4: Enquiry */}
      <section className="section-padding bg-light" id="enquiry" data-reveal>
        <div className="container" style={{ maxWidth: '780px' }}>
          <EnquiryForm
            defaultService="general-insurance"
            title="Request a General Insurance Quotation"
            subtitle="Share your vehicle registration or asset details for a fast comparative quotation."
          />
        </div>
      </section>
    </>
  );
};
