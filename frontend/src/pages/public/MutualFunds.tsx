import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import seoData from '@content/data/seo.json';
import disclaimersData from '@content/data/disclaimers.json';
import registrationsData from '@content/data/registrations.json';
import { useStatistics } from '../../hooks/useStatistics';
import { ServiceHero } from '../../components/insurance/ServiceHero';
import { MfHeroSchemeCard } from '../../components/investments/MfHeroSchemeCard';
import { SipIllustrationBoard } from '../../components/investments/SipIllustrationBoard';
import { WaysToInvestGrid } from '../../components/investments/WaysToInvestGrid';
import { FundCategoryExplorer } from '../../components/investments/FundCategoryExplorer';
import { MfCompareSection } from '../../components/investments/MfCompareSection';
import { FaqAccordion } from '../../components/insurance/FaqAccordion';
import { EnquiryPanel, ServiceDetailOption } from '../../components/enquiry/EnquiryPanel';
import { ScrollProgressBar } from '../../components/common/ScrollProgressBar';

const MF_ENQUIRY_OPTIONS: ServiceDetailOption[] = [
  { id: 'sip', label: 'SIP' },
  { id: 'lump-sum', label: 'Lump sum' },
  { id: 'elss', label: 'ELSS' },
  { id: 'equity-funds', label: 'Equity funds' },
  { id: 'debt-funds', label: 'Debt funds' },
  { id: 'hybrid-funds', label: 'Hybrid funds' },
  { id: 'index-funds-etfs', label: 'Index funds and ETFs' },
  { id: 'review-investments', label: 'Review my existing investments' },
];

export const MutualFunds: React.FC = () => {
  const seo = seoData['/investments/mutual-funds'];
  const { stats } = useStatistics(['mf_folios']);
  const [searchParams] = useSearchParams();
  const sectionQuery = searchParams.get('section');

  const amfiReg = registrationsData.find((r) => r.id === 'amfi_mfd');

  // Preselected categories for Enquiry
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['sip']);

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

  const handleActionScroll = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategoryFromExplorer = (categorySlug: string) => {
    const mappedId =
      categorySlug === 'Equity funds'
        ? 'equity-funds'
        : categorySlug === 'Debt funds'
        ? 'debt-funds'
        : categorySlug === 'Hybrid funds'
        ? 'hybrid-funds'
        : categorySlug === 'Index funds and ETFs'
        ? 'index-funds-etfs'
        : categorySlug === 'ELSS'
        ? 'elss'
        : 'sip';

    setSelectedCategories((prev) =>
      prev.includes(mappedId) ? prev : [mappedId, ...prev]
    );
    handleActionScroll('enquiry');
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
      <div className="mutual-funds-page-wrapper" style={{ overflowX: 'hidden' }}>
        {/* 1. Page Hero with Groww-style Scheme Card */}
        <div id="hero">
          <ServiceHero
            breadcrumb={[
              { label: 'Home', path: '/' },
              { label: 'Services', path: '/services' },
              { label: 'Mutual Funds' },
            ]}
            eyebrow="DISCIPLINED INVESTING • GODHRA, GUJARAT"
            headlinePlain="Invest with a Goal."
            headlineItalic="Review with a Plan."
            leadCopy="Mutual funds pool money from investors and invest according to a scheme's stated objective. Lotus Capital can explain the distribution process and help with investing through mutual funds."
            primaryButtonText="Try the SIP illustration"
            primaryButtonHref="#sip-calculator"
            secondaryButtonText="Discuss Your Investment Goals"
            secondaryButtonHref="#enquiry"
            backgroundGradient="radial-gradient(ellipse at 85% 25%, rgba(47, 111, 176, 0.45) 0%, rgba(10, 37, 64, 0) 70%), linear-gradient(135deg, #051329 0%, #0a2540 50%, #123D67 100%)"
            customRightBoard={<MfHeroSchemeCard />}
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
                  <strong>{stats[0]?.displayText || '1,200+'}</strong> mutual fund folios serviced
                </span>
                <span style={{ fontSize: '0.75rem', color: '#5B8DB8' }}>
                  &bull; Figures as of October 2026
                </span>
              </div>
            }
            onEnquiryClick={() => handleActionScroll('enquiry')}
          />
        </div>

        {/* AMFI Registration Line directly under hero */}
        <section
          style={{
            backgroundColor: 'var(--silver-100, #f8f9fa)',
            borderBottom: '1px solid var(--silver-300, #d7d9dc)',
            padding: '0.85rem 1.5rem',
            position: 'relative',
            zIndex: 11,
          }}
        >
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                fontSize: '0.875rem',
                color: 'var(--ink, #1f2933)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--navy-700, #0d2b4a)', fontWeight: 700 }}>
                  AMFI Registered Distributor:
                </span>
                <span>
                  {amfiReg?.recommendedWording ||
                    'Abhilash Chudasama is an AMFI-registered Mutual Fund Distributor (ARN-160174).'}
                </span>
              </div>

              {/* Show EUIN and validity date ONLY if explicitly verified: true in registrations.json */}
              {(amfiReg as any)?.verified === true && (amfiReg as any)?.euin && (
                <div style={{ color: 'var(--silver-500, #8a949d)', fontSize: '0.8rem' }}>
                  EUIN: {(amfiReg as any).euin} &bull; Valid till: {(amfiReg as any).validityDate}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 2. ONE SIP Illustration Board (Replaces duplicate calculator) */}
        <SipIllustrationBoard
          id="sip-calculator"
          defaultMonthly={5000}
          defaultYears={10}
          defaultRate={10}
        />

        {/* 3. Three Ways to Invest */}
        <WaysToInvestGrid
          id="ways-to-invest"
          onSelectAction={handleActionScroll}
        />

        {/* 4. Fund Category Explorer */}
        <FundCategoryExplorer
          id="categories"
          onSelectCategoryForEnquiry={handleSelectCategoryFromExplorer}
        />

        {/* 5. Compare Section (SIP vs Lump Sum & Regular vs Direct) */}
        <MfCompareSection id="compare" />

        {/* 6. Frequently Asked Questions & Mandatory Disclosure */}
        <div style={{ position: 'relative', zIndex: 16 }}>
          <FaqAccordion
            page="mutual-funds"
            title="Questions, answered."
            subtitle="Clear, educational answers on NAV, expense ratios, direct vs regular plans, taxation, and redemption."
            onEnquiryClick={() => handleActionScroll('enquiry')}
          />

          {/* Mandatory Mutual Fund Disclosure Notice directly below accordion */}
          <div
            style={{
              backgroundColor: 'var(--silver-100, #f8f9fa)',
              padding: '0 1.5rem 3.5rem',
              marginTop: '-1.5rem',
            }}
          >
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid var(--silver-300, #d7d9dc)',
                  borderRadius: '24px',
                  padding: '1.75rem 2rem',
                  boxShadow: '0 8px 24px rgba(10, 37, 64, 0.04)',
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(47, 111, 176, 0.12)',
                      color: '#2F6FB0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      flexShrink: 0,
                      fontSize: '1rem',
                    }}
                  >
                    ℹ
                  </div>
                  <div>
                    <h4
                      style={{
                        margin: '0 0 0.5rem',
                        fontSize: '0.96rem',
                        fontWeight: 700,
                        color: 'var(--navy-950, #051329)',
                      }}
                    >
                      Mandatory Mutual Fund Disclosure
                    </h4>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--ink, #1f2933)',
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {disclaimersData.mutual_fund_risk}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Enquiry Panel */}
        <div id="enquiry" style={{ position: 'relative', zIndex: 17 }}>
          <EnquiryPanel
            defaultService="mutual-funds"
            serviceDetailOptions={MF_ENQUIRY_OPTIONS}
            selectedServiceDetails={selectedCategories}
            onServiceDetailChange={(details) => setSelectedCategories(details)}
            title="Discuss your investment goals"
            subtitle="Connect with our licensed team in Godhra to evaluate scheme options and plan your timeline."
            reassuranceLines={[
              'AMFI-registered mutual fund distributor (ARN-160174)',
              'Objective guidance aligned with your risk tolerance and horizon',
              'No robo-calls, spam, or return guarantees',
            ]}
          />
        </div>
      </div>
    </>
  );
};
