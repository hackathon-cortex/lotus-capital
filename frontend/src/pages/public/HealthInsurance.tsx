import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import seoData from '@content/data/seo.json';
import partnersData from '@content/data/partners.json';
import { ServiceHero } from '../../components/insurance/ServiceHero';
import { HealthCareBoard } from '../../components/insurance/HealthCareBoard';
import { HealthOverview } from '../../components/insurance/HealthOverview';
import { HealthCategoriesStack } from '../../components/insurance/HealthCategoriesStack';
import { HealthCompareInspector } from '../../components/insurance/HealthCompareInspector';
import { HealthProcessTimeline } from '../../components/insurance/HealthProcessTimeline';
import { PartnerMarquee, PartnerItem } from '../../components/insurance/PartnerMarquee';
import { FaqAccordion } from '../../components/insurance/FaqAccordion';
import { EnquiryPanel, ServiceDetailOption } from '../../components/enquiry/EnquiryPanel';
import { ScrollProgressBar } from '../../components/common/ScrollProgressBar';
import { DotNavigator, NavSection } from '../../components/common/DotNavigator';

const HEALTH_NAV_SECTIONS: NavSection[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'overview', label: 'Overview' },
  { id: 'types', label: 'Types' },
  { id: 'compare', label: 'Compare' },
  { id: 'process', label: 'Process' },
  { id: 'partners', label: 'Partners' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'enquiry', label: 'Enquiry' },
];

const HEALTH_SERVICE_OPTIONS: ServiceDetailOption[] = [
  { id: 'individual', label: 'Individual' },
  { id: 'family', label: 'Family floater' },
  { id: 'senior', label: 'Senior citizen' },
  { id: 'critical', label: 'Critical illness' },
  { id: 'group', label: 'Group health' },
];

export const HealthInsurance: React.FC = () => {
  const seo = seoData['/services/health-insurance'];
  const [searchParams] = useSearchParams();
  const sectionQuery = searchParams.get('section');

  // Selected categories for Enquiry preselection
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['family']);

  // Confirmed Health Insurance Partners (Care Health Insurance, HDFC ERGO, ICICI Lombard)
  const confirmedHealthPartners: PartnerItem[] = (partnersData as PartnerItem[]).filter(
    (p) =>
      p.status === 'confirmed' &&
      (p.id === 'care_health' || p.id === 'hdfc_ergo' || p.id === 'icici_lombard')
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
      <DotNavigator sections={HEALTH_NAV_SECTIONS} />

      {/* Page Content Layout with Stacked Overlaps */}
      <div className="health-page-wrapper" style={{ overflowX: 'hidden' }}>
        {/* 1. Page Hero with Health Care Board */}
        <div id="hero">
          <ServiceHero
            breadcrumb={[
              { label: 'Home', path: '/' },
              { label: 'Services', path: '/services' },
              { label: 'Health Insurance' },
            ]}
            eyebrow="HEALTHCARE PROTECTION • GODHRA, GUJARAT"
            headlinePlain="Healthcare Decisions Shouldn't"
            headlineItalic="Become Financial Burdens."
            leadCopy="Choose health cover with the details in view. Health insurance policies differ in cover, exclusions, waiting periods, room-rent limits, co-payments, network hospitals, renewal terms and claim process. Ask the Lotus Capital team about the options available and read the insurer's policy documents before you decide."
            primaryButtonText="Request a Health Quote"
            primaryButtonHref="#enquiry"
            secondaryButtonText="See what to compare"
            secondaryButtonHref="#compare"
            backgroundGradient="radial-gradient(ellipse at 85% 25%, rgba(18, 61, 103, 0.45) 0%, rgba(10, 37, 64, 0) 70%), linear-gradient(135deg, #051329 0%, #0a2540 50%, #123D67 100%)"
            customRightBoard={<HealthCareBoard onActionClick={handleActionScroll} />}
            onEnquiryClick={() => handleActionScroll('enquiry')}
          />
        </div>

        {/* 2. Overview (Compact 2-Column with 4 Highlight Tiles) */}
        <HealthOverview id="overview" />

        {/* 3. Policy Categories (Sticky Card Stack) */}
        <HealthCategoriesStack id="types" onSelectType={handleTypeSelect} />

        {/* 4. Compare (Interactive Deep-Dive Inspector) */}
        <HealthCompareInspector
          id="compare"
          onEnquiryClick={() => handleActionScroll('enquiry')}
        />

        {/* 5. Process Timeline (Animated 6 Steps with Traveling Lotus Marker) */}
        <HealthProcessTimeline
          id="process"
          onEnquiryClick={() => handleActionScroll('enquiry')}
        />

        {/* 6. Underwriting Partners Marquee */}
        <PartnerMarquee
          id="partners"
          eyebrow="TRUSTED HEALTH UNDERWRITERS"
          title="Underwriting & Partner Network"
          subtitle="Associated with Care Health Insurance (since 2012) and established health underwriting institutions."
          partners={confirmedHealthPartners}
        />

        {/* 7. FAQ Accordion (Sticky Left 2-Column, Health-Themed) */}
        <FaqAccordion
          page="health-insurance"
          title="Questions, answered."
          subtitle="Clear explanations on waiting periods, cashless vs reimbursement, room-rent caps, and claims."
          onEnquiryClick={() => handleActionScroll('enquiry')}
        />

        {/* 8. Statutory Insurance Notice */}
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
              className="hi-statutory-notice"
              style={{
                backgroundColor: 'var(--white, #ffffff)',
                border: '1px solid var(--silver-300, #d7d9dc)',
                borderLeft: '4px solid var(--navy-900, #123D67)',
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
                  backgroundColor: 'rgba(18, 61, 103, 0.12)',
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
                    fontSize: '0.94rem',
                    display: 'block',
                    marginBottom: '0.35rem',
                  }}
                >
                  Insurance notice (IRDAI)
                </strong>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.86rem',
                    color: 'var(--ink, #1f2937)',
                    lineHeight: 1.6,
                  }}
                >
                  Insurance is the subject matter of solicitation. Policy coverage, waiting periods, room-rent sub-limits,
                  co-payments, and exclusions are subject to the specific policy terms and conditions issued by the underwriting insurer.
                  No policy is presented as a guaranteed settlement; claim admissibility and reimbursement remain the sole prerogative of the insurer.
                  Lotus Capital acts as a licensed corporate agent and facilitator; all policies are underwritten and issued directly by our IRDAI-registered insurance partners.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Enquiry Panel */}
        <section
          style={{
            position: 'relative',
            zIndex: 16,
            backgroundColor: 'var(--silver-100, #f8f9fa)',
            paddingBottom: '5rem',
          }}
        >
          <EnquiryPanel
            defaultService="health-insurance"
            serviceDetailOptions={HEALTH_SERVICE_OPTIONS}
            selectedServiceDetails={selectedCategories}
            onServiceDetailChange={setSelectedCategories}
            title="Find Health Coverage for Your Needs"
            subtitle="Tell us who needs cover and their ages for an objective plan comparison from our Godhra team."
            reassuranceLines={[
              'Direct consultation with our licensed advisor in Godhra',
              'Objective comparison of waiting periods & exclusions',
              'Local claim intimation and file collation assistance',
            ]}
          />
        </section>
      </div>
    </>
  );
};
