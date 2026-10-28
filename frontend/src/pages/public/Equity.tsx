import React from 'react';
import { Helmet } from 'react-helmet-async';
import pageContent from '@content/pages/equity.json';
import seoData from '@content/data/seo.json';
import faqsData from '@content/data/faqs.json';
import registrationsData from '@content/data/registrations.json';
import { useStatistics } from '../../hooks/useStatistics';
import { StatBlock } from '../../components/stats/StatBlock';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';

export const Equity: React.FC = () => {
  const seo = seoData['/investments/equity'];
  const { stats } = useStatistics(['demat_accounts']);
  const pageFaqs = faqsData.filter((f) => f.page === 'equity');

  const nseReg = registrationsData.find((r) => r.id === 'religare_ap_nse');
  const bseReg = registrationsData.find((r) => r.id === 'religare_ap_bse');

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
            <span className="eyebrow" style={{ color: 'var(--red-300)' }}>Equity & Investments</span>
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

      {/* Broking Relationship Callout */}
      <section className="container" style={{ margin: '1.5rem auto' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--navy-700)', backgroundColor: 'var(--navy-100)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--navy-900)' }}>
            Broking Partner & Authorised Person Details
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--navy-900)', margin: 0, fontWeight: 500 }}>
            {nseReg?.recommendedWording}
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--navy-900)', margin: '0.25rem 0 0', fontWeight: 500 }}>
            {bseReg?.recommendedWording}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--silver-500)', marginTop: '0.5rem' }}>
            Religare Broking Limited SEBI broker registration details available upon request.
          </p>
        </div>
      </section>

      {/* Services Available */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-2" style={{ gap: '3rem', alignItems: 'start' }}>
            <div>
              <span className="eyebrow">Market Solutions</span>
              <h2>Services Available</h2>
              <ul style={{ paddingLeft: '1.25rem', lineHeight: '2.2', marginTop: '1rem' }}>
                <li>Demat and Trading account opening with Religare Broking Limited</li>
                <li>Access to NSE, BSE equity segments and digital trading terminals</li>
                <li>Initial Public Offering (IPO) facilitation and applications</li>
                <li>Portfolio holding statements and ledger reconciliations</li>
                <li>Educational guidance on order types, settlement cycles (T+1), and margin rules</li>
              </ul>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--silver-100)' }}>
              <h3>Onboarding Steps</h3>
              <ol style={{ paddingLeft: '1.25rem', lineHeight: '2', marginTop: '1rem', fontSize: '0.95rem' }}>
                <li>Complete paperless Demat KYC verification.</li>
                <li>Link your bank account for UPI/net banking pay-in and payouts.</li>
                <li>Receive trading terminal credentials, mobile app, and TPIN.</li>
                <li>Review statutory exchange levies and brokerage rate schedule.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-light" id="faqs">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2>Equity Services FAQs</h2>
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
        <div className="card" style={{ borderLeft: '4px solid var(--danger)', backgroundColor: '#fff5f5' }}>
          <strong style={{ color: 'var(--danger)' }}>Securities Market Risk Disclosure:</strong>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink)', margin: '0.5rem 0 0', lineHeight: '1.6' }}>
            Investments in securities market are subject to market risks. Read all related documents carefully before investing. Lotus Capital operates as an Authorised Person and does not promise fixed returns, market tips, or capital guarantees.
          </p>
        </div>
      </section>

      {/* Enquiry */}
      <section className="section-padding" id="enquiry">
        <div className="container" style={{ maxWidth: '750px' }}>
          <EnquiryForm
            defaultService="equity"
            title="Enquire About Equity Services"
            subtitle="Connect with our team to open a demat account or explore market trading facilities."
          />
        </div>
      </section>
    </>
  );
};

