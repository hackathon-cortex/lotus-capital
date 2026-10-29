import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import pageContent from '@content/pages/other-solutions.json';
import seoData from '@content/data/seo.json';
import faqsData from '@content/data/faqs.json';
import { useStatistics } from '../../hooks/useStatistics';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';
import { LotusLogo } from '../../components/common/LotusLogo';

export const OtherSolutions: React.FC = () => {
  const seo = seoData['/investments/other-solutions'];
  const { stats } = useStatistics(['fd_aum']);
  const { stats: realEstateStats } = useStatistics(['real_estate_properties', 'real_estate_rent']);
  const pageFaqs = faqsData.filter((f) => f.page === 'other-solutions');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Mandatory feature flag check: Hide real-estate block behind SHOW_REAL_ESTATE=false until Gujarat RERA registration completes
  const showRealEstate = import.meta.env.VITE_SHOW_REAL_ESTATE === 'true';

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
              FIXED INCOME & RETIREMENT • GODHRA, GUJARAT
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
              More Ways to Build and Protect Your Wealth.
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
                Explore Fixed Income
              </a>
              <a href="#solutions-grid" className="btn btn-secondary-dark btn-lg">
                View Solutions
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
                  <span><strong>{stats[0].value}</strong> in Corporate Fixed Deposits</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="section-padding" id="solutions-grid" data-reveal>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span className="eyebrow">Diversified Products</span>
            <h2>Complementary Financial Solutions</h2>
            <p style={{ color: 'var(--muted)' }}>
              Explore options designed for predictable yields, tax optimization, and long-term retirement security.
            </p>
          </div>

          <div className="grid grid-cols-1 grid-cols-md-2" style={{ gap: '2rem' }}>
            {/* Corporate Fixed Deposits */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700 }}>
                  FD
                </div>
                <span className="badge badge-info">Fixed Income</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Corporate Fixed Deposits</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Fixed deposits issued by highly rated manufacturing corporations, housing finance companies, and NBFCs
                offering attractive contractual coupon rates across tenures ranging from 12 to 60 months.
              </p>
              <div style={{ marginTop: 'auto', backgroundColor: 'var(--silver-100)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--ink)' }}>
                <strong>Risk & Governance:</strong> Corporate FDs carry credit and counterparty default risk. We evaluate CRISIL, ICRA, and CARE ratings before presenting options.
              </div>
            </div>

            {/* Government & Corporate Bonds */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700 }}>
                  BD
                </div>
                <span className="badge badge-info">Debt Capital</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Bonds & Debentures</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Access to Sovereign Gold Bonds (SGBs), 54EC Capital Gains Tax-Exemption Bonds (REC, PFC, NHAI),
                and listed Non-Convertible Debentures (NCDs) offering periodic interest coupons.
              </p>
              <div style={{ marginTop: 'auto', backgroundColor: 'var(--silver-100)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--ink)' }}>
                <strong>Risk & Governance:</strong> Secondary market bond prices fluctuate inversely with interest rates; credit ratings reflect default safety at issue date.
              </div>
            </div>

            {/* National Pension System (NPS) */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700 }}>
                  NP
                </div>
                <span className="badge badge-info">PFRDA Regulated</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>National Pension System (NPS)</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Voluntary, cost-effective retirement account regulated by PFRDA and facilitated through Religare Broking Limited (Reg: 4199).
                Features market-linked pension asset choices and an exclusive additional tax deduction of ₹50,000 under Section 80CCD(1B).
              </p>
              <div style={{ marginTop: 'auto', backgroundColor: 'var(--silver-100)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--ink)' }}>
                <strong>Tier Structure:</strong> Tier I offers mandatory retirement lock-in with tax deductions; Tier II functions as an unrestricted withdrawable savings facility.
              </div>
            </div>

            {/* Loans & Mortgage Sourcing */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700 }}>
                  LN
                </div>
                <span className="badge badge-info">Credit Sourcing</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Loan & Mortgage Assistance</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Liaison and paperwork assistance for residential home loans, Loan Against Property (LAP),
                commercial real estate financing, and business working capital through partner commercial banks and NBFCs.
              </p>
              <div style={{ marginTop: 'auto', backgroundColor: 'var(--silver-100)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--ink)' }}>
                <strong>Underwriting:</strong> Loan approval, processing charges, interest rates, and loan sanctions remain strictly subject to lender credit verification.
              </div>
            </div>
          </div>

          {/* Conditional Real Estate Block: Hidden behind SHOW_REAL_ESTATE feature flag */}
          {showRealEstate && (
            <div
              className="card"
              style={{
                marginTop: '2rem',
                padding: '2rem',
                borderLeft: '4px solid var(--warning)',
                backgroundColor: 'var(--white)',
              }}
            >
              <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>
                RERA Gujarat Registration Under Process
              </span>
              <h3>Real Estate Advisory (Vadodara & Ahmedabad)</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                Facilitation of commercial and residential property transactions across Vadodara and Ahmedabad regions.
                Official Gujarat RERA registration is currently under process. Real estate brokerage is not promoted as a guaranteed yield product.
              </p>
              {realEstateStats.length > 0 && (
                <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                  {realEstateStats.map((s) => (
                    <div key={s.id}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-900)' }}>{s.value}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-light" id="faqs" data-reveal>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="eyebrow">Clarity First</span>
            <h2>Fixed Income & Alternative FAQs</h2>
            <p style={{ color: 'var(--muted)' }}>Answers to common questions regarding FDs, bonds, and NPS accounts.</p>
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

      {/* Statutory Risk Note */}
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
                Fixed Income & Structured Products Disclosure:
              </strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink)', margin: '0.5rem 0 0', lineHeight: '1.6' }}>
                All investment products involve financial and counterparty risks. Corporate deposits and debentures are not bank deposits
                and do not carry DICGC insurance protection. Terms, payout frequency, credit ratings, and taxation are governed
                by the respective product issuers and statutory regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="section-padding bg-light" id="enquiry" data-reveal>
        <div className="container" style={{ maxWidth: '780px' }}>
          <EnquiryForm
            defaultService="other-solutions"
            title="Explore Fixed Income & Alternative Solutions"
            subtitle="Connect with our advisors to discuss high-rated corporate FDs, government bonds, and NPS accounts."
          />
        </div>
      </section>
    </>
  );
};
