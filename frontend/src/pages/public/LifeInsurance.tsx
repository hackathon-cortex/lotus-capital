import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import seoData from '@content/data/seo.json';
import partnersData from '@content/data/partners.json';
import { ServiceHero } from '../../components/insurance/ServiceHero';
import { LifeProtectionBoard } from '../../components/insurance/LifeProtectionBoard';
import { PolicyTypesStack } from '../../components/insurance/PolicyTypesStack';
import { LifeCompare } from '../../components/insurance/LifeCompare';
import { LifeProcessTimeline } from '../../components/insurance/LifeProcessTimeline';
import { PartnerMarquee, PartnerItem } from '../../components/insurance/PartnerMarquee';
import { FaqAccordion } from '../../components/insurance/FaqAccordion';
import { EnquiryPanel, ServiceDetailOption } from '../../components/enquiry/EnquiryPanel';
import { ScrollProgressBar } from '../../components/common/ScrollProgressBar';
import { DotNavigator, NavSection } from '../../components/common/DotNavigator';

const LIFE_NAV_SECTIONS: NavSection[] = [
  { id: 'hero', label: 'Overview' },
  { id: 'types', label: 'Types' },
  { id: 'compare', label: 'Compare' },
  { id: 'process', label: 'Process' },
  { id: 'partners', label: 'Partners' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'enquiry', label: 'Enquiry' },
];

const LIFE_SERVICE_OPTIONS: ServiceDetailOption[] = [
  { id: 'term', label: 'Term Life' },
  { id: 'savings', label: 'Savings-oriented' },
  { id: 'par-non-par', label: 'Participating' },
  { id: 'ulip', label: 'Unit-linked' },
  { id: 'pension', label: 'Retirement' },
];

export const LifeInsurance: React.FC = () => {
  const seo = seoData['/services/life-insurance'];
  const [searchParams] = useSearchParams();
  const sectionQuery = searchParams.get('section');

  // Selected categories for Enquiry preselection
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['term']);

  // Confirmed Life Insurance Partners (Bharti AXA Life as priority partner, HDFC Life, ICICI Prudential, LIC)
  const confirmedLifePartners: PartnerItem[] = (partnersData as PartnerItem[]).filter(
    (p) => p.status === 'confirmed' && (
      p.id === 'bharti_axa' ||
      p.id === 'hdfc_life' ||
      p.id === 'icici_prudential' ||
      p.id === 'lic'
    )
  );

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

  const handleTypeSelect = (serviceDetail: string) => {
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

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Thin Red Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Dot Navigator */}
      <DotNavigator sections={LIFE_NAV_SECTIONS} />

      {/* Page Content Layout with Stacked Overlaps */}
      <div className="life-page-wrapper" style={{ overflowX: 'hidden' }}>
        
        {/* 1. Page Hero with Life Protection Board */}
        <div id="hero">
          <ServiceHero
            breadcrumb={[
              { label: 'Home', path: '/' },
              { label: 'Services', path: '/services' },
              { label: 'Life Insurance' },
            ]}
            eyebrow="FINANCIAL CONTINUITY • GODHRA, GUJARAT"
            headlinePlain="Protect Your Family."
            headlineItalic="Plan for Tomorrow."
            leadCopy="Protection planning starts with understanding your responsibilities. Life insurance products differ in purpose, cover, duration, premium, benefits and exclusions. Contact Lotus Capital to understand the options we can arrange and the information needed to begin."
            primaryButtonText="Request a Life Quote"
            primaryButtonHref="#enquiry"
            secondaryButtonText="See how it works"
            secondaryButtonHref="#process"
            backgroundGradient="radial-gradient(ellipse at 85% 25%, rgba(31, 111, 139, 0.4) 0%, rgba(10, 37, 64, 0) 70%), linear-gradient(135deg, #051329 0%, #0a2540 50%, #123D67 80%, #1F6F8B 100%)"
            customRightBoard={<LifeProtectionBoard onActionClick={handleActionScroll} />}
            onEnquiryClick={() => handleActionScroll('enquiry')}
          />
        </div>

        {/* 2. Policy Types (Compact Sticky Card Stack) */}
        <PolicyTypesStack id="types" onSelectType={handleTypeSelect} />

        {/* 3. Compare (Interactive Term vs. Savings) */}
        <LifeCompare id="compare" onEnquiryClick={() => handleActionScroll('enquiry')} />

        {/* 4. Process Timeline (Animated Alternating 6 Steps) */}
        <LifeProcessTimeline id="process" onEnquiryClick={() => handleActionScroll('enquiry')} />

        {/* 5. Underwriting Partners Marquee */}
        <PartnerMarquee
          id="partners"
          eyebrow="TRUSTED LIFE UNDERWRITERS"
          title="Underwriting & Execution Partners"
          subtitle="Partnering with India’s leading life insurance institutions to provide tailored protection for families in Godhra."
          partners={confirmedLifePartners}
        />

        {/* 6. FAQ Accordion (Sticky Left 2-Column, Life-themed) */}
        <FaqAccordion
          page="life-insurance"
          title="Questions, answered."
          subtitle="Clear, objective explanations on policy types, nominations, sum assured, and servicing."
          onEnquiryClick={() => handleActionScroll('enquiry')}
        />

        {/* 7. Statutory Solicitation Notice */}
        <section
          style={{
            position: 'relative',
            zIndex: 15,
            backgroundColor: 'var(--silver-100, #f8f9fa)',
            padding: '1.5rem 1.5rem 2.5rem',
          }}
        >
          <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div
              className="gi-statutory-notice"
              style={{
                backgroundColor: 'var(--white, #ffffff)',
                border: '1px solid var(--silver-300, #d7d9dc)',
                borderLeft: '4px solid #1F6F8B',
                borderRadius: '24px',
                padding: '1.5rem 2rem',
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
                  backgroundColor: 'rgba(31, 111, 139, 0.12)',
                  color: '#1F6F8B',
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
                <strong style={{ color: 'var(--navy-950, #051329)', fontSize: '0.94rem', display: 'block', marginBottom: '0.35rem' }}>
                  Statutory Insurance Notice (IRDAI)
                </strong>
                <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--ink, #1f2937)', lineHeight: 1.6 }}>
                  Insurance is the subject matter of solicitation. Policy coverage, terms, waiting periods, and exclusions are subject to the specific policy terms and conditions issued by the underwriting insurer.
                  No policy is presented as a guaranteed investment return unless the policy terms establish an explicit guarantee. Lotus Capital acts as a licensed corporate agent and facilitator; all policies are underwritten and issued directly by our IRDAI-registered insurance partners.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Enquiry Panel (Single Viewport <= 560px Desktop Height) */}
        <section
          style={{
            position: 'relative',
            zIndex: 16,
            backgroundColor: 'var(--silver-100, #f8f9fa)',
            paddingBottom: '5rem',
          }}
        >
          <EnquiryPanel
            defaultService="life-insurance"
            serviceDetailOptions={LIFE_SERVICE_OPTIONS}
            selectedServiceDetails={selectedCategories}
            onServiceDetailChange={setSelectedCategories}
            title="Request a Life Insurance consultation"
            subtitle="Share your protection priorities for an objective consultation with our Godhra team."
            reassuranceLines={[
              'Direct consultation with our licensed advisor in Godhra',
              'No automated robo-calls, spam, or sales pressure',
              'Personalised term and sum assured assessment',
            ]}
          />
        </section>

      </div>
    </>
  );
};
