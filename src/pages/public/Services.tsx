import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import seoData from '@content/data/seo.json';
import { useStatistics } from '../../hooks/useStatistics';
import { ServiceHero } from '../../components/insurance/ServiceHero';
import { ServicesLineupBoard } from '../../components/services/ServicesLineupBoard';
import { ServicesStackedDeck } from '../../components/services/ServicesStackedDeck';
import { EnquiryPanel, ServiceDetailOption } from '../../components/enquiry/EnquiryPanel';
import { ScrollProgressBar } from '../../components/common/ScrollProgressBar';

const SERVICES_HUB_ENQUIRY_OPTIONS: ServiceDetailOption[] = [
  { id: 'general-insurance', label: 'General Insurance' },
  { id: 'life-insurance', label: 'Life Insurance' },
  { id: 'health-insurance', label: 'Health Insurance' },
  { id: 'mutual-funds', label: 'Mutual Funds' },
  { id: 'equity', label: 'Equity & Demat' },
  { id: 'other-solutions', label: 'More Solutions' },
];

type ServiceCategorySlug =
  | 'general-insurance'
  | 'life-insurance'
  | 'health-insurance'
  | 'mutual-funds'
  | 'equity'
  | 'other-solutions';

export const Services: React.FC = () => {
  const seo = seoData['/services'];
  const { stats } = useStatistics([
    'insurance_policies_total',
    'mf_folios',
    'demat_accounts',
    'clients_serviced',
  ]);
  const [searchParams] = useSearchParams();
  const sectionQuery = searchParams.get('section');
  const serviceQuery = searchParams.get('service');

  // Preselected category for Enquiry
  const [selectedService, setSelectedService] = useState<ServiceCategorySlug>(() => {
    if (
      serviceQuery &&
      SERVICES_HUB_ENQUIRY_OPTIONS.some((opt) => opt.id === serviceQuery)
    ) {
      return serviceQuery as ServiceCategorySlug;
    }
    return 'general-insurance';
  });

  const [selectedServiceDetails, setSelectedServiceDetails] = useState<string[]>(() => [
    selectedService,
  ]);

  // Handle URL section anchor or service query
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

  const handleSelectServiceFromDeck = (serviceSlug: string) => {
    const validSlug = serviceSlug as ServiceCategorySlug;
    setSelectedService(validSlug);
    setSelectedServiceDetails((prev) =>
      prev.includes(serviceSlug) ? prev : [serviceSlug, ...prev]
    );
    handleActionScroll('enquiry');
  };

  const handleServiceDetailChange = (details: string[]) => {
    setSelectedServiceDetails(details);
    if (details.length > 0) {
      const first = details[0] as ServiceCategorySlug;
      if (SERVICES_HUB_ENQUIRY_OPTIONS.some((opt) => opt.id === first)) {
        setSelectedService(first);
      }
    }
  };

  // Compile verified stat chips from data layer
  const verifiedStats = [
    {
      id: 'insurance_total',
      value: stats.find((s) => s.id === 'insurance_policies_total')?.displayText || '570+',
      label: stats.find((s) => s.id === 'insurance_policies_total')?.label || 'Insurance policies',
    },
    {
      id: 'mf_folios',
      value: stats.find((s) => s.id === 'mf_folios')?.displayText || '1,200+',
      label: stats.find((s) => s.id === 'mf_folios')?.label || 'MF folios',
    },
    {
      id: 'demat',
      value: stats.find((s) => s.id === 'demat_accounts')?.displayText || '800+',
      label: stats.find((s) => s.id === 'demat_accounts')?.label || 'Demat accounts',
    },
    {
      id: 'clients',
      value: stats.find((s) => s.id === 'clients_serviced')?.displayText || '2,500+',
      label: stats.find((s) => s.id === 'clients_serviced')?.label || 'Clients serviced',
    },
  ];

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Thin Brand Red Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Page Content Layout */}
      <div className="services-hub-page-wrapper" style={{ overflowX: 'hidden' }}>
        {/* 1. Page Hero with Lineup Board */}
        <div id="hero">
          <ServiceHero
            breadcrumb={[
              { label: 'Home', path: '/' },
              { label: 'Services' },
            ]}
            eyebrow="LICENSED FINANCIAL DISTRIBUTION • GODHRA, GUJARAT"
            headlinePlain="Solutions for protection,"
            headlineItalic="investing and long-term planning."
            leadCopy="Lotus Capital brings together six core practice areas—covering motor, life and health insurance, alongside mutual funds, equities and fixed-income products. Every solution is delivered with verified terms, transparent costs and direct local guidance in Godhra."
            primaryButtonText="Explore our services"
            primaryButtonHref="#services"
            secondaryButtonText="Talk to an Advisor"
            secondaryButtonHref="#enquiry"
            backgroundGradient="radial-gradient(ellipse at 85% 25%, rgba(18, 61, 103, 0.45) 0%, rgba(10, 37, 64, 0) 70%), linear-gradient(135deg, #051329 0%, #0a2540 50%, #123D67 100%)"
            customRightBoard={
              <ServicesLineupBoard
                onActionClick={handleActionScroll}
                verifiedStats={verifiedStats}
              />
            }
            onEnquiryClick={() => handleActionScroll('enquiry')}
          />
        </div>

        {/* 2. Services Deck (Sticky card stack with progress ring) */}
        <ServicesStackedDeck
          id="services"
          onSelectService={handleSelectServiceFromDeck}
        />

        {/* 3. Enquiry Panel */}
        <div id="enquiry" style={{ position: 'relative', zIndex: 16 }}>
          <EnquiryPanel
            defaultService={selectedService}
            serviceDetailOptions={SERVICES_HUB_ENQUIRY_OPTIONS}
            selectedServiceDetails={selectedServiceDetails}
            onServiceDetailChange={handleServiceDetailChange}
            title="Discuss your financial roadmap"
            subtitle="Select one or more services to discuss with our licensed team in Godhra."
            reassuranceLines={[
              'Direct consultation with our licensed team in Godhra',
              'Personalised evaluation across insurance & investment portfolios',
              'No spam, commissions bias or robo-calls',
            ]}
          />
        </div>
      </div>
    </>
  );
};
