import React from 'react';
import { Helmet } from 'react-helmet-async';
import pageContent from '@content/pages/mutual-funds.json';
import seoData from '@content/data/seo.json';
import faqsData from '@content/data/faqs.json';
import disclaimersData from '@content/data/disclaimers.json';
import { useStatistics } from '../../hooks/useStatistics';
import { StatBlock } from '../../components/stats/StatBlock';
import { SipCalculator } from '../../components/calculators/SipCalculator';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';

export const MutualFunds: React.FC = () => {
  const seo = seoData['/investments/mutual-funds'];
  const { stats } = useStatistics(['mf_folios']);
  const pageFaqs = faqsData.filter((f) => f.page === 'mutual-funds');

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
            <span className="eyebrow" style={{ color: 'var(--red-300)' }}>Mutual Funds</span>
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

      {/* Registration Callout */}
      <section className="container" style={{ margin: '1.5rem auto' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--navy-700)', backgroundColor: 'var(--navy-100)' }}>
          <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--navy-900)' }}>
            AMFI Registered Distributor
          </h3>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: 'var(--navy-800)' }}>
            Abhilash Chudasama is an AMFI-registered Mutual Fund Distributor (ARN-160174).
          </p>
        </div>
      </section>

      {/* Fund Categories & Education */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-2" style={{ gap: '3rem', alignItems: 'start' }}>
            <div>
              <span className="eyebrow">Disciplined Investing</span>
              <h2>Fund Categories Supported</h2>
              <ul style={{ paddingLeft: '1.25rem', lineHeight: '2.2', marginTop: '1rem' }}>
                <li><strong>Equity Funds:</strong> Long-term capital growth across Large, Mid, Small and Multi-Cap strategies.</li>
                <li><strong>Debt Funds:</strong> Shorter duration stability via corporate bonds, liquid and gilt securities.</li>
                <li><strong>Hybrid Funds:</strong> Dynamic asset allocation balancing equity upside and debt cushion.</li>
                <li><strong>Index Funds & ETFs:</strong> Low-cost passive replication of broader market indices.</li>
                <li><strong>Tax-Saving ELSS:</strong> Equity exposure with tax deduction benefits under Section 80C (3-year lock-in).</li>
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card">
                <h3>Regular Plans vs Direct Plans</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: 0 }}>
                  In Regular Plans, investments are processed through registered distributors like Lotus Capital. The AMC pays the distributor a distribution fee out of the scheme&apos;s Total Expense Ratio (TER), covering advisory guidance, ongoing paperwork, and annual portfolio rebalancing reviews. Direct Plans do not pay distribution fees.
                </p>
              </div>

              <div className="card">
                <h3>SIP vs Lump Sum</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: 0 }}>
                  Systematic Investment Plans (SIPs) allow investing pre-set sums periodically, smoothing market volatility through rupee cost averaging. Lump sum investments deploy investable surplus at once and generally suit long-term horizons.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIP Calculator */}
      <section className="section-padding bg-light" id="sip-calculator">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="eyebrow">Interactive Tool</span>
            <h2>SIP Growth Calculator</h2>
            <p style={{ color: 'var(--muted)' }}>
              Explore how disciplined periodic investing compounds over varied investment horizons.
            </p>
          </div>

          <SipCalculator />
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding" id="faqs">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2>Mutual Fund FAQs</h2>
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

      {/* Mandatory Disclaimer */}
      <section className="container" style={{ margin: '2rem auto' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--danger)', backgroundColor: '#fff5f5' }}>
          <strong style={{ color: 'var(--danger)' }}>Mandatory Mutual Fund Disclosure:</strong>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink)', margin: '0.5rem 0 0', lineHeight: '1.6' }}>
            {disclaimersData.mutual_fund_risk}
          </p>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="section-padding bg-light" id="enquiry">
        <div className="container" style={{ maxWidth: '750px' }}>
          <EnquiryForm
            defaultService="mutual-funds"
            title="Discuss Your Investment Goals"
            subtitle="Let our team guide you through goal planning, scheme categories, and KYC onboarding."
          />
        </div>
      </section>
    </>
  );
};

