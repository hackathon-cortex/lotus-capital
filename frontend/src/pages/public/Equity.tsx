import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import pageContent from '@content/pages/equity.json';
import seoData from '@content/data/seo.json';
import faqsData from '@content/data/faqs.json';
import registrationsData from '@content/data/registrations.json';
import { useStatistics } from '../../hooks/useStatistics';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';
import { LotusLogo } from '../../components/common/LotusLogo';
import religareLogo from '../../assets/RELIGARE.NS_BIG.svg';

export const Equity: React.FC = () => {
  const seo = seoData['/investments/equity'];
  const { stats } = useStatistics(['demat_accounts']);
  const pageFaqs = faqsData.filter((f) => f.page === 'equity');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const nseReg = registrationsData.find((r) => r.id === 'religare_ap_nse');
  const bseReg = registrationsData.find((r) => r.id === 'religare_ap_bse');

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
              EQUITY & TRADING • GODHRA, GUJARAT
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
              Understand the Markets. Make Informed Decisions.
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
                Open a Demat Account
              </a>
              <a href="#broking-details" className="btn btn-secondary-dark btn-lg">
                Broking Credentials
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
                  <span><strong>{stats[0].value}</strong> Demat Accounts Serviced</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Religare Broking AP Relationship Card (Design.md 9.3) */}
      <section className="section-padding" id="broking-details" data-reveal>
        <div className="container">
          <div
            className="card"
            style={{
              backgroundColor: 'var(--silver-100)',
              borderColor: 'var(--silver-300)',
              borderLeft: '4px solid var(--navy-700)',
              padding: '2.5rem',
            }}
          >
            <div className="grid grid-cols-12" style={{ gap: '2rem', alignItems: 'center' }}>
              <div className="col-span-12 col-span-md-4" style={{ textAlign: 'center' }}>
                <img
                  src={religareLogo}
                  alt="Religare Broking"
                  style={{ height: '56px', maxWidth: '220px', objectFit: 'contain', margin: '0 auto 1rem' }}
                />
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600 }}>
                  Institutional Broking Partner
                </div>
              </div>

              <div className="col-span-12 col-span-md-8">
                <span className="eyebrow" style={{ color: 'var(--navy-700)' }}>SEBI Registered Authorised Person</span>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--navy-900)', margin: '0.25rem 0 1rem' }}>
                  Lotus Capital — Religare Broking Limited
                </h3>
                <p style={{ color: 'var(--ink)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                  Lotus Capital operates as a duly appointed Authorised Person (AP) of Religare Broking Limited,
                  enabling local investors in Godhra and surrounding districts to open Demat and trading accounts,
                  execute transactions across Indian stock exchanges, and access modern trading platforms.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div style={{ backgroundColor: 'var(--white)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--silver-300)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NSE Authorised Person Code</div>
                    <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '1rem', marginTop: '0.2rem' }}>
                      {nseReg?.number || 'AP007909931'}
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'var(--white)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--silver-300)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>BSE Authorised Person Code</div>
                    <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '1rem', marginTop: '0.2rem' }}>
                      {bseReg?.number || 'AP0130040172963'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equity Services Available */}
      <section className="section-padding bg-light" data-reveal>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span className="eyebrow">Service Scope</span>
            <h2>Equity & Trading Services</h2>
            <p style={{ color: 'var(--muted)' }}>
              Comprehensive infrastructure for secondary market investment and portfolio execution.
            </p>
          </div>

          <div className="grid grid-cols-1 grid-cols-md-3" style={{ gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                01
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Demat & Trading Account</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Seamless onboarding with paperless KYC to hold equities, government securities, and ETFs securely in electronic form.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                02
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Cash & Delivery Equities</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Direct ownership of shares across NSE and BSE for long-term compounding, corporate dividends, and voting rights.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                03
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Initial Public Offerings (IPOs)</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Assistance with ASBA UPI-linked applications for mainline and SME IPOs with timely issue alerts and allocation tracking.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                04
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Physical Share Dematerialisation</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Conversion of old physical share certificates into modern electronic demat credits, signature mismatch assistance, and probate filings.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                05
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Digital Trading Platforms</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Access to Religare&apos;s mobile and desktop trading apps with biometric authentication, live streaming quotes, and technical charts.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                06
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Investor Education</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Regular orientation on T+1 settlement cycles, circuit filters, stop-loss mechanisms, and risk management principles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding Steps */}
      <section className="section-padding" data-reveal>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="eyebrow">Getting Started</span>
            <h2>How Demat Account Opening Works</h2>
            <p style={{ color: 'var(--muted)' }}>Fast digital onboarding to commence your investment journey.</p>
          </div>

          <div className="grid grid-cols-1 grid-cols-md-4" style={{ gap: '1.5rem' }}>
            {[
              { step: '01', title: 'KYC Collation', desc: 'Aadhaar-linked mobile verification, PAN card, and bank account proof.' },
              { step: '02', title: 'Video In-Person Verification', desc: 'Secure digital IPV completion required by SEBI regulations.' },
              { step: '03', title: 'Account Activation', desc: 'Receive trading account ID, Demat Client ID, and temporary credentials.' },
              { step: '04', title: 'Fund Link & Trade', desc: 'Link UPI / NetBanking mandate and begin structured equity investing.' },
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

      {/* FAQs */}
      <section className="section-padding bg-light" id="faqs" data-reveal>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="eyebrow">Clarity First</span>
            <h2>Equity & Demat FAQs</h2>
            <p style={{ color: 'var(--muted)' }}>Direct guidance on trading accounts, broker charges, and risks.</p>
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

      {/* Mandatory Securities Risk Note (Design.md 9.3 & 10.9) */}
      <section className="container" style={{ margin: '2rem auto' }} data-reveal>
        <div
          className="risk-note"
          style={{
            backgroundColor: 'var(--navy-100)',
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
                Securities Market Risk Disclosure:
              </strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--navy-900)', margin: '0.5rem 0 0', lineHeight: '1.6' }}>
                Investments in securities market are subject to market risks. Read all related documents carefully before investing.
                Share prices can rise and fall, and investors may lose part or all of their invested capital.
                Lotus Capital operates strictly as an Authorised Person of Religare Broking Limited and does not guarantee returns, price targets, or trading profits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section className="section-padding bg-light" id="enquiry" data-reveal>
        <div className="container" style={{ maxWidth: '780px' }}>
          <EnquiryForm
            defaultService="equity"
            title="Open Your Demat & Trading Account"
            subtitle="Connect with our Godhra branch to initiate KYC documentation through Religare Broking Limited."
          />
        </div>
      </section>
    </>
  );
};
