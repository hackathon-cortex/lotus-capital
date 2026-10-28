import React from 'react';
import { Helmet } from 'react-helmet-async';
import pageContent from '@content/pages/other-solutions.json';
import seoData from '@content/data/seo.json';
import { useStatistics } from '../../hooks/useStatistics';
import { StatBlock } from '../../components/stats/StatBlock';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';

export const OtherSolutions: React.FC = () => {
  const seo = seoData['/investments/other-solutions'];
  const { stats } = useStatistics(['fd_aum']);
  const { stats: realEstateStats } = useStatistics(['real_estate_properties', 'real_estate_rent']);

  // Feature flag check per prompt instruction: "Hide the real-estate block on /investments/other-solutions behind a feature flag SHOW_REAL_ESTATE=false."
  const showRealEstate = import.meta.env.VITE_SHOW_REAL_ESTATE === 'true';

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Hero */}
      <section className="section-padding bg-navy">
        <div className="container">
          <div style={{ maxWidth: '850px' }}>
            <span className="eyebrow" style={{ color: 'var(--red-300)' }}>More Solutions</span>
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

      {/* Solution Blocks */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
            {/* Fixed Deposits */}
            <div className="card">
              <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Fixed Income</span>
              <h3>Corporate Fixed Deposits</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                Fixed deposits with corporate issuers offer fixed interest rates for defined tenures. Corporate FDs carry credit and issuer default risk; credit ratings from rating agencies (CRISIL, ICRA, CARE) reflect creditworthiness at the time of rating.
              </p>
            </div>

            {/* Bonds */}
            <div className="card">
              <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Debt Instruments</span>
              <h3>Bonds & Debentures</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                Government and corporate bonds providing regular coupon income streams. Subject to credit risk, interest rate cycles, and secondary market liquidity.
              </p>
            </div>

            {/* NPS */}
            <div className="card">
              <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Retirement Planning</span>
              <h3>National Pension System (NPS)</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                NPS services are offered through Religare Broking Limited (registration 4199). Features Tier I accounts with tax deductions under Section 80CCD and long-term retirement lock-in.
              </p>
            </div>

            {/* MLDs */}
            <div className="card">
              <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Structured Solutions</span>
              <h3>Market-Linked Debentures (MLDs)</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                Debt securities whose final yield is linked to an underlying index benchmark. Subject to market volatility and issuer credit risk; capital is not guaranteed.
              </p>
            </div>

            {/* Loan Assistance */}
            <div className="card">
              <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Financing Support</span>
              <h3>Loan Assistance</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                Assisting clients with documentation and loan sourcing through partner banks and NBFCs, subject to lender underwriting criteria.
              </p>
            </div>

            {/* Real Estate Block - HIDDEN behind SHOW_REAL_ESTATE flag */}
            {showRealEstate && (
              <div className="card" data-testid="real-estate-block" style={{ borderLeft: '4px solid var(--warning)' }}>
                <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>
                  Property (RERA Gujarat Under Process)
                </span>
                <h3>Real Estate Advisory</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                  Facilitation of commercial and residential property transactions in Vadodara and Ahmedabad.
                </p>
                {realEstateStats.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <StatBlock stats={realEstateStats} columns={2} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Risk note */}
      <section className="container" style={{ margin: '2rem auto' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--warning)', backgroundColor: '#fffbe6' }}>
          <strong>Notice:</strong> All fixed income and structured financial instruments carry issuer default, liquidity, and counterparty risks. Terms and conditions are governed by respective issuers and regulatory bodies.
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="section-padding bg-light" id="enquiry">
        <div className="container" style={{ maxWidth: '750px' }}>
          <EnquiryForm
            defaultService="other-solutions"
            title="Explore Your Options"
            subtitle="Let our team clarify product terms, credit ratings, and application requirements."
          />
        </div>
      </section>
    </>
  );
};

