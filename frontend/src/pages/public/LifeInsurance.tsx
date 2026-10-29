import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import pageContent from '@content/pages/life-insurance.json';
import seoData from '@content/data/seo.json';
import faqsData from '@content/data/faqs.json';
import partnersData from '@content/data/partners.json';
import registrationsData from '@content/data/registrations.json';
import { useStatistics } from '../../hooks/useStatistics';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';
import { LotusLogo } from '../../components/common/LotusLogo';

export const LifeInsurance: React.FC = () => {
  const seo = seoData['/services/life-insurance'];
  const { stats } = useStatistics(['life_policies']);
  const pageFaqs = faqsData.filter((f) => f.page === 'life-insurance');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const licReg = registrationsData.find((r) => r.id === 'lic_agency');
  const hdfcReg = registrationsData.find((r) => r.id === 'hdfc_life_agency');

  const lifePartners = partnersData.filter(
    (p) => p.id === 'lic' || p.id === 'hdfc_life' || p.id === 'icici_prudential'
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
              FINANCIAL CONTINUITY • GODHRA, GUJARAT
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
                Request a Life Quote
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
                  <span><strong>{stats[0].value}</strong> Life Policies Guided</span>
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
              <span className="eyebrow">Structured Protection</span>
              <h2>Securing What Matters Most to Your Family</h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
                Life insurance is the bedrock of family financial security. It guarantees that dependent family members can maintain their
                standard of living, service liabilities, and achieve vital educational milestones even in the untimely absence of the primary earner.
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
                Lotus Capital helps you calculate your true Human Life Value (HLV) rather than settling for under-insured endowment products.
                We evaluate term plans, whole-life options, and pension contracts across India&apos;s most reliable institutions like LIC and HDFC Life.
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
                  Core Plan Dimensions
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem' }}>
                    <span style={{ color: 'var(--navy-700)', fontWeight: 700 }}>✓</span>
                    <span><strong>Pure Term Cover:</strong> High sum assured at affordable annual premiums to replace income.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem' }}>
                    <span style={{ color: 'var(--navy-700)', fontWeight: 700 }}>✓</span>
                    <span><strong>Guaranteed Endowment:</strong> Capital preservation coupled with guaranteed maturity bonus.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem' }}>
                    <span style={{ color: 'var(--navy-700)', fontWeight: 700 }}>✓</span>
                    <span><strong>Retirement Annuities:</strong> Lifelong post-retirement monthly cash flows for financial independence.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem' }}>
                    <span style={{ color: 'var(--navy-700)', fontWeight: 700 }}>✓</span>
                    <span><strong>Tax Exemptions:</strong> Deductions under 80C and tax-free proceeds under Section 10(10D).</span>
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
            <span className="eyebrow">Product Classification</span>
            <h2>Life Insurance Policy Categories</h2>
            <p style={{ color: 'var(--muted)' }}>
              Different structures addressing income replacement, savings discipline, and retirement.
            </p>
          </div>

          <div className="grid grid-cols-1 grid-cols-md-4" style={{ gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                01
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Pure Term Insurance</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                High sum assured financial replacement protection during productive earning years with zero savings component.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                02
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Savings & Endowment</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Disciplined contractual savings plans combining life risk coverage with guaranteed lumpsum maturity returns.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                03
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Pension & Annuities</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Guaranteed lifelong monthly or annual annuity payouts protecting retirees against outliving their accumulated wealth.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                04
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Child Future Plans</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Milestone-based payouts tied to college admission ages, incorporating a premium waiver benefit in case of unforeseen demise.
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
            <h2>What to Compare in Life Insurance</h2>
            <p style={{ color: 'var(--muted)' }}>Essential evaluation factors before finalizing policy terms.</p>
          </div>

          <div className="grid grid-cols-1 grid-cols-md-2" style={{ gap: '1.25rem' }}>
            {[
              {
                title: 'Claim Settlement Ratio (CSR) & History',
                desc: 'Review 5-year consistent claim settlement percentage and total claims processed by the insurer.',
              },
              {
                title: 'Human Life Value (HLV) Calculation',
                desc: 'Ensure total cover is at least 10–15 times annual income plus outstanding debts (home loans, mortgages).',
              },
              {
                title: 'Critical Illness & Accidental Riders',
                desc: 'Attach cost-effective riders that disburse upfront payouts on disability or diagnosed major illnesses.',
              },
              {
                title: 'Waiver of Premium (WoP) Benefit',
                desc: 'Ensure all future premiums are waived while policy benefits continue if the proposer becomes critically disabled.',
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
              Life Insurance Institutional Partners
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '3rem' }}>
            {lifePartners.map((partner) => (
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
                  {partner.id === 'lic'
                    ? licReg?.recommendedWording || 'Agency Code: LIC03693848'
                    : partner.id === 'hdfc_life'
                    ? hdfcReg?.recommendedWording || 'Agency Code: HDF01032560'
                    : partner.relationshipLabel}
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
            <h2>Simple Steps to Evaluate Life Protection</h2>
            <p style={{ color: 'var(--muted)' }}>Our 4-step consultative advisory process.</p>
          </div>

          <div className="grid grid-cols-1 grid-cols-md-4" style={{ gap: '1.5rem' }}>
            {[
              { step: '01', title: 'Calculate HLV', desc: 'Assess annual earnings, dependents, liabilities, and required sum assured.' },
              { step: '02', title: 'Compare Product Quotes', desc: 'Examine term length, premium payment terms, and CSR metrics across insurers.' },
              { step: '03', title: 'Medical Declaration', desc: 'Accurate disclosure of medical history and habits for guaranteed claim validity.' },
              { step: '04', title: 'Underwriting & Bond', desc: 'Swift processing, tele-medical completion, and policy bond handover.' },
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
            <h2>Life Insurance FAQs</h2>
            <p style={{ color: 'var(--muted)' }}>Answers to common questions regarding term, savings, and claim settlement.</p>
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
            defaultService="life-insurance"
            title="Request a Life Insurance Consultation"
            subtitle="Connect with our advisors to compute your Human Life Value and assess term or endowment policies."
          />
        </div>
      </section>
    </>
  );
};
