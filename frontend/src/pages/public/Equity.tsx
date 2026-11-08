import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import seoData from '@content/data/seo.json';
import disclaimersData from '@content/data/disclaimers.json';
import { useStatistics } from '../../hooks/useStatistics';
import { ServiceHero } from '../../components/insurance/ServiceHero';
import { EquityMarketBoard } from '../../components/investments/EquityMarketBoard';
import { BrokingPartnerFrame } from '../../components/investments/BrokingPartnerFrame';
import { EquityServicesStage } from '../../components/investments/EquityServicesStage';
import { EquityAccountJourney } from '../../components/investments/EquityAccountJourney';
import { FaqAccordion } from '../../components/insurance/FaqAccordion';
import { EnquiryPanel, ServiceDetailOption } from '../../components/enquiry/EnquiryPanel';
import { ScrollProgressBar } from '../../components/common/ScrollProgressBar';

const EQUITY_ENQUIRY_OPTIONS: ServiceDetailOption[] = [
  { id: 'demat-account', label: 'Demat account' },
  { id: 'trading-account', label: 'Trading account' },
  { id: 'equity-trading', label: 'Equity trading' },
  { id: 'commodity-trading', label: 'Commodity trading' },
  { id: 'ipo-applications', label: 'IPO applications' },
  { id: 'market-education', label: 'Market education' },
];

export const Equity: React.FC = () => {
  const seo = seoData['/investments/equity'];
  const { stats } = useStatistics(['demat_accounts']);
  const [searchParams] = useSearchParams();
  const sectionQuery = searchParams.get('section');

  // Preselected categories for Enquiry
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['demat-account']);

  // Handle URL section anchor
  useEffect(() => {
    if (sectionQuery) {
      const scrollTarget = () => {
        const el = document.getElementById(sectionQuery);
        if (el) {
          window.scrollTo({
            top: Math.max(0, el.offsetTop - 70),
            behavior: 'instant' as ScrollBehavior,
          });
        }
      };
      scrollTarget();
      const t1 = setTimeout(scrollTarget, 80);
      const t2 = setTimeout(scrollTarget, 250);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [sectionQuery]);

  const handleActionScroll = (targetId: string, chipId?: string) => {
    if (chipId) {
      setSelectedCategories((prev) =>
        prev.includes(chipId) ? prev : [chipId, ...prev]
      );
    }
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleServiceSelectFromStage = (chipId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(chipId) ? prev : [chipId, ...prev]
    );
    const el = document.getElementById('enquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Thin Brand Red Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Page Content Layout */}
      <div className="equity-page-wrapper" style={{ overflow: 'clip' }}>
        {/* 1. Page Hero with Market Board */}
        <div id="hero">
          <ServiceHero
            breadcrumb={[
              { label: 'Home', path: '/' },
              { label: 'Equity & Investments' },
            ]}
            eyebrow="EQUITY & TRADING • GODHRA, GUJARAT"
            headlinePlain="Understand the Markets."
            headlineItalic="Make Informed Decisions."
            leadCopy="Investments in securities market are subject to market risks. Read all related documents carefully before investing. Lotus Capital operates as an Authorised Person of Religare Broking Limited (NSE AP007909931, BSE AP0130040172963). Speak with the team to confirm the service, the process, the costs and the disclosures before you begin."
            primaryButtonText="Open a Demat Account"
            primaryButtonHref="#enquiry"
            secondaryButtonText="See broking credentials"
            secondaryButtonHref="#broking"
            backgroundGradient="radial-gradient(ellipse at 85% 25%, rgba(79, 95, 176, 0.18) 0%, rgba(10, 37, 64, 0) 70%), linear-gradient(135deg, var(--navy-950, #071B30) 0%, var(--navy-900, #0A2540) 100%)"
            customRightBoard={<EquityMarketBoard onActionClick={handleActionScroll} />}
            statChip={
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.45rem 1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '9999px',
                  border: '1px solid rgba(215, 217, 220, 0.22)',
                  fontSize: '0.85rem',
                  color: 'rgba(235, 240, 245, 0.95)',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--red-500, #d9232d)',
                  }}
                />
                <span>
                  <strong>{stats[0]?.displayText || '800+ demat accounts'}</strong> serviced
                </span>
                <span style={{ fontSize: '0.75rem', color: '#8FA3C8' }}>
                  &bull; Figures as of October 2026
                </span>
              </div>
            }
            onEnquiryClick={() => handleActionScroll('enquiry', 'demat-account')}
          />
        </div>

        {/* 2. Broking Partner Frame (Single Viewport, min-height 100vh) */}
        <BrokingPartnerFrame />

        {/* 3. Services Stage (Market Floor Layout in ONE Frame) */}
        <EquityServicesStage onServiceSelect={handleServiceSelectFromStage} />

        {/* 4. Account Journey (Scroll Graph Timeline) */}
        <EquityAccountJourney />

        {/* 5. FAQs with Filter Categories */}
        <FaqAccordion
          page="equity"
          title="Questions, answered."
          subtitle="Direct guidance on demat accounts, trading access, and broking terms."
          onEnquiryClick={() => handleActionScroll('enquiry')}
        />

        {/* 6. Mandatory Securities Market Risk Disclosure Notice */}
        <section
          data-tone="light"
          style={{
            backgroundColor: '#F8F9FA',
            padding: '0 0 4rem',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div
              className="risk-disclosure-note"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid var(--silver-300, #d7d9dc)',
                borderLeft: '5px solid var(--navy-700, #0d2b4a)',
                borderRadius: '20px',
                padding: '1.75rem 2rem',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(13, 43, 74, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--navy-700, #0d2b4a)',
                    fontSize: '1.1rem',
                    flexShrink: 0,
                    fontWeight: 700,
                  }}
                >
                  ⓘ
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--navy-900, #0a2540)',
                      margin: '0 0 0.4rem',
                    }}
                  >
                    Securities Market Risk Disclosure
                  </h4>
                  <p
                    style={{
                      fontSize: '0.92rem',
                      color: '#475569',
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {disclaimersData.equity_market_risk} Share prices can rise and fall, and investors may lose part or all of their invested capital. Lotus Capital operates as an Authorised Person of Religare Broking Limited (NSE AP007909931, BSE AP0130040172963) and does not promise or guarantee returns, price targets, or trading profits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Enquiry Section */}
        <section
          id="enquiry"
          data-tone="dark"
          className="stacked-section"
          style={{
            backgroundColor: 'var(--navy-950, #051329)',
            padding: '4rem 0 5rem',
            position: 'relative',
            zIndex: 11,
          }}
        >
          <EnquiryPanel
            defaultService="equity"
            serviceDetailOptions={EQUITY_ENQUIRY_OPTIONS}
            selectedServiceDetails={selectedCategories}
            onServiceDetailChange={setSelectedCategories}
            title="Talk to us about opening an account"
            subtitle="Share your requirements to explore demat and secondary market facilities through Religare Broking Limited."
            reassuranceLines={[
              'Our Godhra team will follow up',
              'Please do not share passwords, OTPs or demat credentials',
            ]}
          />
        </section>
      </div>
    </>
  );
};
