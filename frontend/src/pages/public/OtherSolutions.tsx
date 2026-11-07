import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import seoData from '@content/data/seo.json';
import { useStatistics } from '../../hooks/useStatistics';
import { ServiceHero } from '../../components/insurance/ServiceHero';
import { OtherSolutionsOptionsBoard } from '../../components/solutions/OtherSolutionsOptionsBoard';
import { SolutionsCategoriesStack } from '../../components/solutions/SolutionsCategoriesStack';
import { FaqAccordion } from '../../components/insurance/FaqAccordion';
import { EnquiryPanel, ServiceDetailOption } from '../../components/enquiry/EnquiryPanel';
import { ScrollProgressBar } from '../../components/common/ScrollProgressBar';

const OTHER_SOLUTIONS_OPTIONS: ServiceDetailOption[] = [
  { id: 'corporate-fd', label: 'Corporate fixed deposits' },
  { id: 'bonds', label: 'Bonds & debentures' },
  { id: 'nps', label: 'NPS / pension' },
  { id: 'mlds', label: 'Market-linked debentures' },
];

export const OtherSolutions: React.FC = () => {
  const seo = seoData['/investments/other-solutions'];
  const { stats } = useStatistics(['fd_aum']);
  const [searchParams] = useSearchParams();
  const sectionQuery = searchParams.get('section');

  // Preselected category for Enquiry
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['corporate-fd']);

  // Smooth scroll handler for URL section param
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

  const handleSolutionSelect = (serviceDetail: string) => {
    setSelectedCategories((prev) =>
      prev.includes(serviceDetail) ? prev : [...prev, serviceDetail]
    );
    const enquiryEl = document.getElementById('enquiry');
    if (enquiryEl) {
      enquiryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleActionScroll = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreFixedIncome = () => {
    setSelectedCategories((prev) =>
      prev.includes('corporate-fd') ? prev : ['corporate-fd', ...prev]
    );
    handleActionScroll('enquiry');
  };

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Thin Red Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Page Content Layout with Stacked Overlaps */}
      <div className="other-solutions-page-wrapper" style={{ overflowX: 'hidden' }}>
        {/* 1. Page Hero with Options Board */}
        <div id="hero">
          <ServiceHero
            breadcrumb={[
              { label: 'Home', path: '/' },
              { label: 'Services', path: '/services' },
              { label: 'More Solutions' },
            ]}
            eyebrow="FIXED INCOME & RETIREMENT • GODHRA, GUJARAT"
            headlinePlain="More Ways to Build and"
            headlineItalic="Protect Your Wealth."
            leadCopy="Explore these options with their terms and trade-offs in view. Fixed deposits, bonds, pension planning, and structured solutions have distinct credit risks, liquidity terms, and tax treatments."
            primaryButtonText="Explore Fixed Income"
            primaryButtonHref="#enquiry"
            secondaryButtonText="See the options"
            secondaryButtonHref="#types"
            backgroundGradient="radial-gradient(ellipse at 85% 25%, rgba(18, 61, 103, 0.45) 0%, rgba(10, 37, 64, 0) 70%), linear-gradient(135deg, #051329 0%, #0a2540 50%, #123D67 100%)"
            customRightBoard={
              <OtherSolutionsOptionsBoard
                onActionClick={handleActionScroll}
                fdAumDisplayText={stats[0]?.displayText}
              />
            }
            onEnquiryClick={handleExploreFixedIncome}
          />
        </div>

        {/* 2. Solutions (Compact Sticky Card Stack) */}
        <SolutionsCategoriesStack id="types" onSelectSolution={handleSolutionSelect} />

        {/* 3. FAQ + Notice (Notice directly inside FAQ section) */}
        <div style={{ position: 'relative', zIndex: 14 }}>
          <FaqAccordion
            page="other-solutions"
            title="Questions, answered."
            subtitle="Clear explanations on corporate fixed deposits, bonds, NPS rules, credit risks, and taxation."
            onEnquiryClick={() => handleActionScroll('enquiry')}
          />

          {/* Important Notice directly below accordion in the same section flow */}
          <div
            style={{
              backgroundColor: 'var(--silver-100, #f8f9fa)',
              padding: '0 1.5rem 3.5rem',
              marginTop: '-1.5rem',
            }}
          >
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div
                className="solutions-important-notice"
                style={{
                  backgroundColor: 'var(--white, #ffffff)',
                  border: '1.5px solid var(--silver-300, #d7d9dc)',
                  borderRadius: '24px',
                  padding: '1.75rem 2rem',
                  boxShadow: '0 6px 20px rgba(10,37,64,0.04)',
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--navy-100, #eaf1f8)',
                    color: 'var(--navy-900, #123D67)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  ⓘ
                </div>
                <div>
                  <strong
                    style={{
                      color: 'var(--navy-950, #051329)',
                      fontSize: '0.96rem',
                      display: 'block',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Important notice
                  </strong>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.88rem',
                      color: 'var(--ink, #1f2933)',
                      lineHeight: 1.6,
                    }}
                  >
                    All investment products involve risk. Terms, payout frequency and taxation are set
                    by the issuer and applicable rules. Read the offer documents before you decide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Enquiry Panel (Single Viewport <= 560px Desktop Height) */}
        <section
          id="enquiry"
          style={{
            position: 'relative',
            zIndex: 15,
            backgroundColor: 'var(--silver-100, #f8f9fa)',
            paddingBottom: '5rem',
          }}
        >
          <EnquiryPanel
            defaultService="other-solutions"
            serviceDetailOptions={OTHER_SOLUTIONS_OPTIONS}
            selectedServiceDetails={selectedCategories}
            onServiceDetailChange={setSelectedCategories}
            title="Request a consultation on fixed income & other solutions"
            subtitle="Share your preferences for an objective discussion on terms, credit risks, and liquidity with our Godhra team."
            reassuranceLines={[
              'Direct consultation with our licensed advisor in Godhra',
              'Objective review of credit terms and lock-in conditions',
              'No unsolicited cold calls or aggressive sales pressure',
            ]}
          />
        </section>
      </div>
    </>
  );
};
