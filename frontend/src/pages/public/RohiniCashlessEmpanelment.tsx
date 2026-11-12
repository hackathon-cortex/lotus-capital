import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import rohiniData from '@content/data/rohini.json';
import seoData from '@content/data/seo.json';
import { ServiceHero } from '../../components/insurance/ServiceHero';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';
import { ScrollProgressBar } from '../../components/common/ScrollProgressBar';
import { FaqAccordion } from '../../components/insurance/FaqAccordion';

export const RohiniCashlessEmpanelment: React.FC = () => {
  const seo = (seoData as any)['/services/rohini-cashless-empanelment'] || {
    title: 'ROHINI Registration & Cashless Empanelment for Hospitals | Lotus Capital',
    description: 'Guidance for hospitals, clinics and day-care centres in Gujarat to register on ROHINI (IIB/IRDAI) and navigate cashless network empanelment.',
  };

  // Interactive Document Checklist state (client-side interactive checkboxes, not stored)
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const toggleDoc = (id: string) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleActionScroll = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Client-side PDF print trigger for documents checklist
  const handleDownloadChecklist = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Thin Red Scroll Progress Bar */}
      <ScrollProgressBar />

      <div className="rohini-page-wrapper" style={{ overflowX: 'hidden' }}>
        {/* 1. HERO SECTION */}
        <div id="hero">
          <ServiceHero
            breadcrumb={[
              { label: 'Home', path: '/' },
              { label: 'Services', path: '/services' },
              { label: 'Health Insurance', path: '/services/health-insurance' },
              { label: 'ROHINI & Cashless Empanelment' },
            ]}
            eyebrow={rohiniData.eyebrow}
            headlinePlain="Hospitals:"
            headlineItalic="Get registered and empanelled."
            leadCopy={rohiniData.leadCopy}
            primaryButtonText="Talk to us about empanelment"
            primaryButtonHref="#enquiry"
            secondaryButtonText="View Document Checklist"
            secondaryButtonHref="#checklist"
            backgroundGradient="radial-gradient(ellipse at 85% 25%, rgba(18, 61, 103, 0.45) 0%, rgba(10, 37, 64, 0) 70%), linear-gradient(135deg, #051329 0%, #0a2540 50%, #123D67 100%)"
            customRightBoard={
              <div
                style={{
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '24px',
                  padding: '2rem 1.75rem',
                  color: '#ffffff',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(217, 35, 45, 0.2)',
                      border: '1px solid rgba(217, 35, 45, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                    }}
                  >
                    🏥
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem', color: '#ffffff' }}>
                      Official IIB Registry
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--silver-300, #d7d9dc)' }}>
                      13-Digit Unique Identifier
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.84rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ color: 'var(--silver-400, #94a3b8)' }}>Governing Authority</span>
                    <span style={{ fontWeight: 600 }}>IIB / IRDAI</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ color: 'var(--silver-400, #94a3b8)' }}>Identifier Format</span>
                    <span style={{ fontWeight: 600 }}>13-Digit GS1</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ color: 'var(--silver-400, #94a3b8)' }}>Applicability</span>
                    <span style={{ fontWeight: 600 }}>Hospitals & Day-Care</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--silver-400, #94a3b8)' }}>Official Portal</span>
                    <a
                      href="https://rohini.iib.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--red-400, #f87171)', fontWeight: 600, textDecoration: 'none' }}
                    >
                      rohini.iib.gov.in &nearr;
                    </a>
                  </div>
                </div>
              </div>
            }
            onEnquiryClick={() => handleActionScroll('enquiry')}
          />
        </div>

        {/* 2. WHAT IS ROHINI & WHO NEEDS IT */}
        <section
          id="about-rohini"
          data-tone="light"
          className="section-padding bg-light stacked-section"
          style={{ padding: '4.5rem 0', backgroundColor: '#ffffff' }}
        >
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 3rem' }}>
              <span className="eyebrow-rule" style={{ margin: '0 auto 0.75rem' }} />
              <span className="eyebrow">REGULATORY FRAMEWORK</span>
              <h2
                style={{
                  fontFamily: 'var(--font-display, Playfair Display, serif)',
                  fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
                  color: 'var(--navy-900, #0a2540)',
                  marginBottom: '1rem',
                }}
              >
                What is ROHINI and Who Needs It?
              </h2>
              <p style={{ color: 'var(--muted, #556270)', fontSize: '1rem', lineHeight: 1.65 }}>
                {rohiniData.whatIsRohini.description}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2rem',
              }}
            >
              {/* Card 1: Who Needs It */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--silver-300, #d7d9dc)',
                  borderRadius: '24px',
                  padding: '2.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>🏥</div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900, #0a2540)', marginBottom: '0.75rem' }}>
                    {rohiniData.whoNeedsIt.title}
                  </h3>
                  <p style={{ color: 'var(--ink, #1f2933)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                    {rohiniData.whoNeedsIt.description}
                  </p>
                </div>
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)', fontSize: '0.78rem', color: 'var(--muted, #556270)' }}>
                  Source: Insurance Regulatory and Development Authority of India (IRDAI) / IIB directives.
                </div>
              </div>

              {/* Card 2: Cashless Empanelment Context */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--silver-300, #d7d9dc)',
                  borderRadius: '24px',
                  padding: '2.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>📋</div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900, #0a2540)', marginBottom: '0.75rem' }}>
                    {rohiniData.cashlessEmpanelment.title}
                  </h3>
                  <p style={{ color: 'var(--ink, #1f2933)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                    {rohiniData.cashlessEmpanelment.description}
                  </p>
                </div>
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)', fontSize: '0.78rem', color: 'var(--red-600, #b91c1c)', fontWeight: 600 }}>
                  {rohiniData.cashlessEmpanelment.note}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. REGISTRATION STEPS (1-5) */}
        <section
          id="steps"
          data-tone="light"
          className="section-padding bg-light stacked-section"
          style={{ padding: '4.5rem 0', backgroundColor: '#f8fafc', borderTop: '1px solid var(--silver-300, #d7d9dc)' }}
        >
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
              <span className="eyebrow">REGISTRATION WORKFLOW</span>
              <h2
                style={{
                  fontFamily: 'var(--font-display, Playfair Display, serif)',
                  fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
                  color: 'var(--navy-900, #0a2540)',
                  marginBottom: '1rem',
                }}
              >
                ROHINI Registration Steps
              </h2>
              <p style={{ color: 'var(--muted, #556270)', fontSize: '0.98rem' }}>
                Conducted through the official Insurance Information Bureau of India portal.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {rohiniData.registrationSteps.map((s) => (
                <div
                  key={s.step}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '18px',
                    padding: '1.5rem',
                    border: '1px solid var(--silver-300, #d7d9dc)',
                    boxShadow: '0 2px 8px rgba(10,37,64,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(217, 35, 45, 0.1)',
                      color: 'var(--red-600, #b91c1c)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      marginBottom: '1rem',
                    }}
                  >
                    0{s.step}
                  </div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--navy-900, #0a2540)', marginBottom: '0.5rem' }}>
                    {s.title}
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--muted, #556270)', lineHeight: 1.5, margin: 0 }}>
                    {s.description}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <a
                href="https://rohini.iib.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  padding: '0.65rem 1.5rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                }}
              >
                <span>Visit Official ROHINI Portal (IIB)</span>
                <span>&nearr;</span>
              </a>
            </div>
          </div>
        </section>

        {/* 4. DOCUMENTS CHECKLIST (Interactive Checkboxes + Download Button) */}
        <section
          id="checklist"
          data-tone="light"
          className="section-padding bg-light stacked-section"
          style={{ padding: '4.5rem 0', backgroundColor: '#ffffff', borderTop: '1px solid var(--silver-300, #d7d9dc)' }}
        >
          <div className="container" style={{ maxWidth: '980px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
              <span className="eyebrow">DOCUMENTATION DOSSIER</span>
              <h2
                style={{
                  fontFamily: 'var(--font-display, Playfair Display, serif)',
                  fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
                  color: 'var(--navy-900, #0a2540)',
                  marginBottom: '1rem',
                }}
              >
                Typical Empanelment Documents Checklist
              </h2>
              <p style={{ color: 'var(--muted, #556270)', fontSize: '0.96rem', lineHeight: 1.6 }}>
                Requirements vary by insurer and TPA. Use this interactive checklist to review your
                hospital&apos;s documentation readiness before initiating proposals.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#fbfcfd',
                borderRadius: '24px',
                border: '1px solid var(--silver-300, #d7d9dc)',
                padding: '2rem',
                boxShadow: '0 4px 16px rgba(10,37,64,0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--silver-300, #d7d9dc)',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy-900, #0a2540)' }}>
                  Standard Dossier Requirements ({Object.values(checkedDocs).filter(Boolean).length} / {rohiniData.documentsChecklist.length} Checked)
                </div>

                <button
                  type="button"
                  onClick={handleDownloadChecklist}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span>🖨️ Print / Save Checklist (PDF)</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {rohiniData.documentsChecklist.map((doc) => {
                  const isChecked = !!checkedDocs[doc.id];
                  return (
                    <label
                      key={doc.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '24px 1fr',
                        gap: '12px',
                        alignItems: 'start',
                        cursor: 'pointer',
                        padding: '0.85rem 1rem',
                        borderRadius: '14px',
                        backgroundColor: isChecked ? 'rgba(217, 35, 45, 0.04)' : '#ffffff',
                        border: `1px solid ${isChecked ? 'rgba(217, 35, 45, 0.3)' : 'var(--silver-300, #d7d9dc)'}`,
                        transition: 'all 0.16s ease',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleDoc(doc.id)}
                        style={{ marginTop: '3px', accentColor: 'var(--red-600, #b91c1c)', width: '18px', height: '18px' }}
                      />
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--navy-900, #0a2540)' }}>
                          {doc.label}
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--muted, #556270)' }}>
                          {doc.hint}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', borderRadius: '12px', backgroundColor: '#f1f5f9', fontSize: '0.8rem', color: 'var(--muted, #556270)' }}>
                <strong>Note:</strong> Empanelment criteria and required formats differ among general insurers, standalone health underwriters, and TPAs. Lotus Capital assists with preparing and formatting these dossiers.
              </div>
            </div>
          </div>
        </section>

        {/* 5. HOW LOTUS CAPITAL CAN HELP & BENEFITS */}
        <section
          id="benefits"
          data-tone="light"
          className="section-padding bg-light stacked-section"
          style={{ padding: '4.5rem 0', backgroundColor: '#f8fafc', borderTop: '1px solid var(--silver-300, #d7d9dc)' }}
        >
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2.5rem',
              }}
            >
              {/* Left: How Lotus Capital Can Help */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  border: '1px solid var(--silver-300, #d7d9dc)',
                  padding: '2.5rem',
                  boxShadow: '0 4px 16px rgba(10,37,64,0.04)',
                }}
              >
                <span className="eyebrow">CONSULTING SCOPE</span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display, Playfair Display, serif)',
                    fontSize: '1.65rem',
                    color: 'var(--navy-900, #0a2540)',
                    marginBottom: '1rem',
                  }}
                >
                  How Lotus Capital Can Help
                </h3>
                <p style={{ color: 'var(--ink, #1f2933)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Lotus Capital assists hospital management teams with procedural guidance and end-to-end documentation coordination:
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {rohiniData.howLotusCapitalHelps.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--navy-900, #0a2540)' }}>
                      <span style={{ color: 'var(--red-600, #b91c1c)', fontWeight: 700 }}>✓</span>
                      <div>
                        <strong style={{ display: 'block', color: 'var(--navy-900, #0a2540)' }}>{item.title}</strong>
                        <span style={{ color: 'var(--muted, #556270)', fontSize: '0.84rem' }}>{item.description}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Benefits for Hospitals and Patients */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  border: '1px solid var(--silver-300, #d7d9dc)',
                  padding: '2.5rem',
                  boxShadow: '0 4px 16px rgba(10,37,64,0.04)',
                }}
              >
                <span className="eyebrow">STRATEGIC VALUE</span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display, Playfair Display, serif)',
                    fontSize: '1.65rem',
                    color: 'var(--navy-900, #0a2540)',
                    marginBottom: '1rem',
                  }}
                >
                  Network Benefits
                </h3>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--navy-900, #0a2540)', marginBottom: '0.5rem' }}>
                    For Healthcare Facilities:
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {rohiniData.benefits.forHospitals.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--muted, #556270)' }}>
                        <span style={{ color: 'var(--navy-700, #0d2b4a)', fontWeight: 700 }}>&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--navy-900, #0a2540)', marginBottom: '0.5rem' }}>
                    For Patients & Policyholders:
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {rohiniData.benefits.forPatients.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--muted, #556270)' }}>
                        <span style={{ color: 'var(--navy-700, #0d2b4a)', fontWeight: 700 }}>&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. PROCESS TIMELINE (Steps 1 to 6) */}
        <section
          id="process"
          data-tone="light"
          className="section-padding bg-light stacked-section"
          style={{ padding: '4.5rem 0', backgroundColor: '#ffffff', borderTop: '1px solid var(--silver-300, #d7d9dc)' }}
        >
          <div className="container" style={{ maxWidth: '840px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="eyebrow">STEP-BY-STEP ADVISORY</span>
              <h2
                style={{
                  fontFamily: 'var(--font-display, Playfair Display, serif)',
                  fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
                  color: 'var(--navy-900, #0a2540)',
                  marginBottom: '1rem',
                }}
              >
                Our 6-Step Empanelment Coordination
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
              {rohiniData.processTimeline.map((step) => (
                <div
                  key={step.step}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 1fr',
                    gap: '1.25rem',
                    alignItems: 'start',
                    padding: '1.25rem 1.5rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    border: '1px solid var(--silver-300, #d7d9dc)',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--navy-900, #0a2540)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                    }}
                  >
                    {step.step}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--navy-900, #0a2540)', marginBottom: '0.35rem' }}>
                      {step.title}
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--muted, #556270)', lineHeight: 1.5, margin: 0 }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. FAQS (8 Sourced Items) */}
        <FaqAccordion
          page="health-insurance"
          title="Frequently Asked Questions"
          subtitle="Sourced information on ROHINI registration, IIB mandates, and cashless empanelment."
          items={rohiniData.faqs.map((f) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
          }))}
          onEnquiryClick={() => handleActionScroll('enquiry')}
        />

        {/* 8. DISCLOSURES BOX */}
        <section
          style={{
            padding: '2.5rem 1.5rem',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid var(--silver-300, #d7d9dc)',
          }}
        >
          <div className="container" style={{ maxWidth: '980px', margin: '0 auto' }}>
            <div
              style={{
                backgroundColor: 'rgba(217, 35, 45, 0.04)',
                border: '1.5px solid rgba(217, 35, 45, 0.25)',
                borderRadius: '16px',
                padding: '1.5rem 1.75rem',
                fontSize: '0.86rem',
                color: 'var(--navy-900, #0a2540)',
                lineHeight: 1.6,
              }}
            >
              <strong style={{ display: 'block', color: 'var(--red-600, #b91c1c)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.78rem' }}>
                Regulatory Disclosures & Institutional Scope
              </strong>
              {rohiniData.disclosures.boxText}
            </div>
          </div>
        </section>

        {/* 9. ENQUIRY SECTION (Common EnquiryForm Hospitals Variant) */}
        <div id="enquiry" style={{ position: 'relative', zIndex: 16 }}>
          <EnquiryForm
            preselectedService="rohini-cashless-empanelment"
            title="Hospital Empanelment Advisory"
            subtitle="Share your facility details and registration status for independent guidance on ROHINI and cashless networks."
            reassuranceLines={[
              'Dedicated institutional advisory for Gujarat hospitals and day-care centres',
              'Assistance with Clinical Establishment Act and tariff schedule dossiers',
              'Timely renewal tracking and network query follow-up',
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default RohiniCashlessEmpanelment;
