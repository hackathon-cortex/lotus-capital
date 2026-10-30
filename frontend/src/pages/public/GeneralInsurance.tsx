import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import seoData from '@content/data/seo.json';
import partnersData from '@content/data/partners.json';
import { ServiceHero } from '../../components/insurance/ServiceHero';
import { CategoryBento } from '../../components/insurance/CategoryBento';
import { PolicyAnatomy } from '../../components/insurance/PolicyAnatomy';
import { StepScroller } from '../../components/insurance/StepScroller';
import { FaqAccordion } from '../../components/insurance/FaqAccordion';
import { EnquiryPanel } from '../../components/enquiry/EnquiryPanel';
import { ScrollProgressBar } from '../../components/common/ScrollProgressBar';
import { DotNavigator, NavSection } from '../../components/common/DotNavigator';

const GI_NAV_SECTIONS: NavSection[] = [
  { id: 'hero', label: 'Overview' },
  { id: 'categories', label: 'Categories' },
  { id: 'compare', label: 'Compare' },
  { id: 'process', label: 'Process' },
  { id: 'partners', label: 'Partners' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'enquiry', label: 'Enquiry' },
];

export const GeneralInsurance: React.FC = () => {
  const seo = seoData['/services/general-insurance'];
  const [searchParams] = useSearchParams();
  const sectionQuery = searchParams.get('section');

  // Selected categories for Enquiry preselection
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['vehicle']);

  // Confirmed GI partners (ICICI Lombard, HDFC ERGO, Religare Broking)
  const confirmedPartners = partnersData.filter(
    (p) => p.id === 'icici_lombard' || p.id === 'hdfc_ergo' || p.id === 'religare_broking'
  );

  // Scroll handler for URL section param
  useEffect(() => {
    if (sectionQuery) {
      const scrollTarget = () => {
        const el = document.getElementById(sectionQuery);
        if (el) {
          el.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
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

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev : [...prev, categoryId]
    );
    const enquiryEl = document.getElementById('enquiry');
    if (enquiryEl) {
      enquiryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEnquiryScroll = () => {
    const enquiryEl = document.getElementById('enquiry');
    if (enquiryEl) {
      enquiryEl.scrollIntoView({ behavior: 'smooth' });
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
      <DotNavigator sections={GI_NAV_SECTIONS} />

      {/* Main Content Layout with Stacked Overlaps */}
      <div className="gi-page-wrapper" style={{ overflowX: 'hidden' }}>
        
        {/* 1. Page Hero + Coverage Board */}
        <div id="hero">
          <ServiceHero onEnquiryClick={handleEnquiryScroll} />
        </div>

        {/* 2. Categories Bento Grid */}
        <CategoryBento id="categories" onCategorySelect={handleCategorySelect} />

        {/* 3. Policy Anatomy (What to Compare) */}
        <PolicyAnatomy id="compare" onEnquiryClick={handleEnquiryScroll} />

        {/* 4. Pinned Step-by-Step Workflow Scroller */}
        <StepScroller id="process" onEnquiryClick={handleEnquiryScroll} />

        {/* 5. Underwriting Partners */}
        <section
          id="partners"
          className="gi-stacked-section section-padding"
          style={{
            position: 'relative',
            zIndex: 13,
            marginTop: '-36px',
            borderTopLeftRadius: '36px',
            borderTopRightRadius: '36px',
            backgroundColor: 'var(--white, #ffffff)',
            boxShadow: '0 -10px 40px rgba(10,37,64,0.06)',
            paddingTop: '4.5rem',
            paddingBottom: '4.5rem',
          }}
        >
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
              <span
                className="eyebrow"
                style={{
                  display: 'inline-block',
                  color: 'var(--navy-700, #0d2b4a)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                TRUSTED NETWORK
              </span>
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  color: 'var(--navy-950, #051329)',
                  marginBottom: '1rem',
                }}
              >
                Underwriting & Execution <span style={{ fontStyle: 'italic', color: 'var(--navy-700, #0d2b4a)' }}>Partners</span>
              </h2>
              <p style={{ color: 'var(--muted, #556270)', fontSize: '1.02rem', lineHeight: 1.6 }}>
                Underwriting and execution partners for general insurance policies in Godhra.
              </p>
            </div>

            {/* Partner Tiles (>= 280x160 with subtle lift & glow) */}
            <div
              className="gi-partners-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem',
                justifyContent: 'center',
                maxWidth: '980px',
                margin: '0 auto',
              }}
            >
              {confirmedPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="gi-partner-card"
                  style={{
                    minWidth: '280px',
                    minHeight: '160px',
                    padding: '2rem 1.75rem',
                    borderRadius: '24px',
                    backgroundColor: 'var(--white, #ffffff)',
                    border: '1px solid var(--silver-300, #d7d9dc)',
                    boxShadow: '0 10px 30px rgba(10,37,64,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div
                    style={{
                      height: '56px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    <img
                      src={partner.logoPlaceholder}
                      alt={partner.name}
                      style={{
                        maxHeight: '48px',
                        maxWidth: '180px',
                        objectFit: 'contain',
                        filter: 'grayscale(15%)',
                        transition: 'filter 0.25s ease',
                      }}
                      className="gi-partner-img"
                    />
                  </div>
                  <h4 style={{ margin: '0 0 0.35rem', fontSize: '0.98rem', color: 'var(--navy-900, #0a2540)', fontWeight: 600 }}>
                    {partner.name}
                  </h4>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--muted, #556270)',
                      backgroundColor: 'var(--silver-100, #f8f9fa)',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '9999px',
                      display: 'inline-block',
                    }}
                  >
                    {partner.relationshipLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. FAQ Accordion (Sticky Left 2-Column) */}
        <FaqAccordion onEnquiryClick={handleEnquiryScroll} />

        {/* 7. Risk / Solicitation Notice */}
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
                borderLeft: '4px solid var(--navy-700, #0d2b4a)',
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
                  backgroundColor: 'rgba(18, 61, 103, 0.1)',
                  color: 'var(--navy-700, #0d2b4a)',
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
                  Insurance is the subject matter of solicitation. Policy coverage, terms, waiting periods, sub-limits,
                  and exclusions are subject to the specific policy terms and conditions issued by the underwriting insurer.
                  Lotus Capital acts as a facilitator and advisor; all policies are underwritten and issued directly by our
                  IRDAI-registered insurance partners.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Enquiry Panel (<= 560px Desktop Height, Compact Split Card) */}
        <section
          style={{
            position: 'relative',
            zIndex: 16,
            backgroundColor: 'var(--silver-100, #f8f9fa)',
            paddingBottom: '5rem',
          }}
        >
          <EnquiryPanel
            defaultService="general-insurance"
            selectedServiceDetails={selectedCategories}
            onServiceDetailChange={setSelectedCategories}
            title="Request a General Insurance quotation"
            subtitle="Share your vehicle registration or asset notes for a personalised quotation."
            reassuranceLines={[
              'Direct consultation with our licensed advisor in Godhra',
              'No automated robo-calls or spam',
              'Personalised coverage & IDV evaluation',
            ]}
          />
        </section>

      </div>
    </>
  );
};
