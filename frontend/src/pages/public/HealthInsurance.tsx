import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import pageContent from '@content/pages/health-insurance.json';
import seoData from '@content/data/seo.json';
import faqsData from '@content/data/faqs.json';
import partnersData from '@content/data/partners.json';
import registrationsData from '@content/data/registrations.json';
import { useStatistics } from '../../hooks/useStatistics';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';
import { LotusLogo } from '../../components/common/LotusLogo';

export const HealthInsurance: React.FC = () => {
  const seo = seoData['/services/health-insurance'];
  const { stats } = useStatistics(['health_policies']);
  const pageFaqs = faqsData.filter((f) => f.page === 'health-insurance');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const careReg = registrationsData.find((r) => r.id === 'care_health_agency');
  const healthPartners = partnersData.filter(
    (p) => p.id === 'care_health' || p.id === 'hdfc_ergo' || p.id === 'icici_lombard'
  );

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Reference 4: Page Hero (480px band with scrim and CTA) */}
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
              HEALTHCARE PROTECTION • GODHRA & GUJARAT
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
              Healthcare Decisions Shouldn&apos;t Become Financial Burdens.
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
                Request a Health Quote
              </a>
              <a href="#compare" className="btn btn-secondary-dark btn-lg">
                View Comparison Checklist
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
                  <span><strong>{stats[0].value}</strong> Health Policies Managed</span>
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
              <span className="eyebrow">Consultative Guidance</span>
              <h2>Navigating Health Cover with Transparency</h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
                Health insurance is your financial defense against escalating medical costs and unexpected hospitalisations.
                At Lotus Capital, we do not simply sell policies off the shelf; we evaluate your family age profiles, pre-existing conditions,
                preferred local hospitals in Godhra and Vadodara, and suitable sum insured levels.
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
                We guide you through the fine print — identifying mandatory waiting periods, co-payment clauses, and room-rent caps
                before you submit a proposal form. During medical emergencies, our Godhra office assists directly with cashless intimation
                and reimbursement document collation.
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
                  Key Coverage Highlights
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem' }}>
                    <span style={{ color: 'var(--navy-700)', fontWeight: 700 }}>✓</span>
                    <span><strong>Cashless Network:</strong> Thousands of empanelled hospitals across Gujarat and pan-India.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem' }}>
                    <span style={{ color: 'var(--navy-700)', fontWeight: 700 }}>✓</span>
                    <span><strong>Pre & Post Hospitalisation:</strong> Diagnostic, medicine, and consultation reimbursement.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem' }}>
                    <span style={{ color: 'var(--navy-700)', fontWeight: 700 }}>✓</span>
                    <span><strong>Day Care Procedures:</strong> Coverage for modern treatments not requiring 24-hr hospital stay.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem' }}>
                    <span style={{ color: 'var(--navy-700)', fontWeight: 700 }}>✓</span>
                    <span><strong>Sum Insured Restoration:</strong> Automatic refill upon exhaustion within the same policy year.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem' }}>
                    <span style={{ color: 'var(--navy-700)', fontWeight: 700 }}>✓</span>
                    <span><strong>Tax Deduction:</strong> Benefits up to ₹75,000 under Section 80D of the Income Tax Act.</span>
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
            <span className="eyebrow">Tailored Solutions</span>
            <h2>Health Insurance Policy Categories</h2>
            <p style={{ color: 'var(--muted)' }}>
              Choose the structure that matches your family composition and medical requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 grid-cols-md-4" style={{ gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                01
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Individual Health Cover</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Dedicated sum insured exclusively for a single policyholder, ensuring independent coverage without sharing limits.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                02
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Family Floater Plans</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Single umbrella cover protecting spouse, dependent children, and parents under a cost-effective combined sum insured.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                03
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Senior Citizen Plans</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Specialised healthcare coverage tailored for elderly parents, accommodating higher entry ages and chronic ailments.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                04
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Critical Illness & Top-up</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Lump sum payouts on major diagnosed illnesses or high-deductible super top-ups that boost coverage at minimal extra cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reference 4: What to Compare (#compare anchor required) */}
      <section className="section-padding" id="compare" data-reveal>
        <div className="container" style={{ maxWidth: '920px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="eyebrow">Diligent Due Diligence</span>
            <h2>What to Compare Before Buying Health Insurance</h2>
            <p style={{ color: 'var(--muted)' }}>
              Check these essential parameters before enrolling in any medical policy.
            </p>
          </div>

          <div className="grid grid-cols-1 grid-cols-md-2" style={{ gap: '1.25rem' }}>
            {[
              {
                title: 'Pre-existing Disease Waiting Periods',
                desc: 'Assess whether pre-existing ailments are covered after 1, 2, 3, or 4 years. Shorter waiting periods offer faster protection.',
              },
              {
                title: 'Room Rent Limits & Proportionate Deductions',
                desc: 'Ensure no restrictive daily room rent capping, which can trigger proportionate deductions on your entire hospital bill.',
              },
              {
                title: 'Co-payment Clauses & Deductibles',
                desc: 'Check if you are required to bear a mandatory percentage (e.g. 10% or 20%) of each claim out of your own pocket.',
              },
              {
                title: 'Empanelled Cashless Hospitals in Gujarat',
                desc: 'Verify that reputed multi-speciality hospitals in Godhra, Vadodara, and Ahmedabad are in the cashless network.',
              },
              {
                title: 'Day Care & Modern Treatment Covers',
                desc: 'Confirm coverage for advanced medical technologies, robotic surgeries, and procedures completed without overnight stay.',
              },
              {
                title: 'No Claim Bonus (NCB) & Restoration',
                desc: 'Evaluate how much your sum insured increases for claim-free years and whether limits recharge automatically after a claim.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--navy-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--navy-700)',
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  ✓
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.35rem', fontSize: '1.02rem', color: 'var(--navy-900)' }}>
                    {item.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--muted)', lineHeight: '1.5' }}>
                    {item.desc}
                  </p>
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
              Trusted Insurance Partners & Relationships
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '3rem' }}>
            {healthPartners.map((partner) => (
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
                  {partner.relationshipLabel}
                </span>
                {partner.id === 'care_health' && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                    {careReg?.recommendedWording || 'Agency Code: RLH20126535'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reference 4: How to Get a Quote (4 Steps) */}
      <section className="section-padding" data-reveal>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="eyebrow">Clear Workflow</span>
            <h2>How to Get Your Customised Health Quote</h2>
            <p style={{ color: 'var(--muted)' }}>Our 4-step consultative process to secure appropriate medical cover.</p>
          </div>

          <div className="grid grid-cols-1 grid-cols-md-4" style={{ gap: '1.5rem' }}>
            {[
              { step: '01', title: 'Share Family Details', desc: 'Provide ages, family structure, and any known pre-existing conditions.' },
              { step: '02', title: 'Compare Suitable Plans', desc: 'Examine sum insured options, network hospitals, and waiting period trade-offs.' },
              { step: '03', title: 'Review Policy Wording', desc: 'Verify exclusions, room rent clauses, and proposal declarations thoroughly.' },
              { step: '04', title: 'Direct Issuance', desc: 'Receive your policy bond, digital health card, and cashless intimation numbers.' },
            ].map((s) => (
              <div key={s.step} className="card" style={{ padding: '1.75rem', position: 'relative' }}>
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

      {/* Reference 4: FAQs (Accordion with Rotating Plus A9) */}
      <section className="section-padding bg-light" id="faqs" data-reveal>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="eyebrow">Clarity First</span>
            <h2>Health Insurance FAQs</h2>
            <p style={{ color: 'var(--muted)' }}>Answers to common questions regarding coverage, claims, and policies.</p>
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

      {/* Reference 4: Statutory Solicitation Risk Note (Design.md 10.9) */}
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
                Lotus Capital acts as a facilitator and advisor; all claims and underwriting decisions remain the sole prerogative of the insurer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reference 4: Enquiry Form preselected */}
      <section className="section-padding bg-light" id="enquiry" data-reveal>
        <div className="container" style={{ maxWidth: '780px' }}>
          <EnquiryForm
            defaultService="health-insurance"
            title="Request a Customised Health Insurance Quote"
            subtitle="Let our team evaluate suitable sum insured options, network hospitals, and waiting period terms for your family."
          />
        </div>
      </section>
    </>
  );
};
