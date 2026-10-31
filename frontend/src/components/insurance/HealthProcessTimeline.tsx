import React, { useState, useEffect, useRef } from 'react';
import { LotusLogo } from '../common/LotusLogo';

export interface TimelineStep {
  number: string;
  title: string;
  description: string;
  actionNote?: string;
}

export const HEALTH_TIMELINE_STEPS: TimelineStep[] = [
  {
    number: '01',
    title: 'Send an Enquiry',
    description: 'Share who needs cover and their ages via our online form or by contacting our Godhra office.',
    actionNote: 'No invasive financial paperwork or advance payment requested.',
  },
  {
    number: '02',
    title: 'Review Household Health Needs',
    description: 'We evaluate your family age profile, past medical conditions, and appropriate sum insured levels.',
    actionNote: 'Objective consultation focused on protection requirements, not sales quotas.',
  },
  {
    number: '03',
    title: 'Compare Options from Partner Insurers',
    description: 'Receive side-by-side plan comparisons with transparent disclosure of waiting periods and room-rent terms.',
    actionNote: 'Evaluating options from Care Health Insurance and confirmed general partners.',
  },
  {
    number: '04',
    title: 'Review Policy Documents & Disclosures',
    description: 'Read the insurer’s official policy wording, exclusions list, and proposal form declarations before you decide.',
    actionNote: 'Accurate disclosure of pre-existing conditions protects future claim validity.',
  },
  {
    number: '05',
    title: 'Direct Issuance with the Insurer',
    description: 'Complete the proposal with direct payment to the underwriting insurance company and receive your policy bond and health cards.',
    actionNote: 'Official IRDAI-regulated policy schedule issued directly by the insurer.',
  },
  {
    number: '06',
    title: 'Local Claim & Renewal Support',
    description: 'Lotus Capital assists with hospital cashless guidance, reimbursement file collation, and timely annual renewals.',
    actionNote: 'Dedicated local guidance in Godhra; claim settlement remains the prerogative of the insurer.',
  },
];

export interface HealthProcessTimelineProps {
  id?: string;
  onEnquiryClick?: () => void;
}

export const HealthProcessTimeline: React.FC<HealthProcessTimelineProps> = ({
  id = 'process',
  onEnquiryClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0.2);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const progressParam = params.get('timelineProgress');
    if (progressParam !== null) {
      setScrollProgress(Math.min(Math.max(parseFloat(progressParam), 0), 1));
      return;
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalH = rect.height;
      const current = windowH * 0.5 - rect.top;
      const progress = Math.min(Math.max(current / totalH, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEnquiry = (e: React.MouseEvent) => {
    if (onEnquiryClick) {
      e.preventDefault();
      onEnquiryClick();
    } else {
      const el = document.getElementById('enquiry');
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id={id}
      className="health-process-section gi-stacked-section"
      style={{
        position: 'relative',
        zIndex: 14,
        marginTop: '-36px',
        borderTopLeftRadius: '36px',
        borderTopRightRadius: '36px',
        backgroundColor: 'var(--silver-100, #f8f9fa)',
        boxShadow: '0 -10px 40px rgba(10,37,64,0.06)',
        padding: '5rem 1.5rem',
      }}
    >
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4rem' }}>
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
            TRANSPARENT WORKFLOW
          </span>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.1rem, 3.4vw, 3rem)',
              fontWeight: 700,
              color: 'var(--navy-950, #051329)',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}
          >
            From Enquiry to Active <span style={{ fontStyle: 'italic', color: 'var(--navy-900, #123D67)' }}>Protection.</span>
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--ink, #1f2933)',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            A 6-step consultative process designed to ensure you understand policy wording and exclusions before making any commitment.
          </p>
        </div>

        {/* Timeline Container with Center Connecting Line */}
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            padding: '2rem 0',
          }}
          className="health-timeline-container"
        >
          {/* Base Inactive Track */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '3px',
              backgroundColor: 'var(--silver-300, #e2e8f0)',
              borderRadius: '2px',
            }}
            className="timeline-center-line"
          />

          {/* Active Navy Progress Track */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '3px',
              height: `calc(${scrollProgress * 100}% - 40px)`,
              maxHeight: 'calc(100% - 80px)',
              backgroundColor: 'var(--navy-900, #123D67)',
              borderRadius: '2px',
              transition: 'height 0.15s ease-out',
            }}
            className="timeline-progress-line"
          />

          {/* Traveling Lotus Marker */}
          <div
            style={{
              position: 'absolute',
              top: `calc(40px + ${scrollProgress * 85}%)`,
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--navy-900, #123D67)',
              boxShadow: '0 0 16px rgba(18, 61, 103, 0.45), 0 0 0 4px #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3,
              transition: 'top 0.15s ease-out',
            }}
            className="timeline-lotus-marker"
          >
            <div style={{ width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LotusLogo variant="light" height={16} width="auto" />
            </div>
          </div>

          {/* Steps List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {HEALTH_TIMELINE_STEPS.map((step, idx) => {
              const isEven = idx % 2 === 1;
              const stepThreshold = (idx + 0.5) / HEALTH_TIMELINE_STEPS.length;
              const isStepPassed = scrollProgress >= stepThreshold;

              return (
                <div
                  key={step.number}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 60px 1fr',
                    alignItems: 'center',
                  }}
                  className={`timeline-step-row ${isEven ? 'step-even' : 'step-odd'}`}
                >
                  {/* Left Column */}
                  <div
                    style={{
                      textAlign: isEven ? 'right' : 'right',
                      paddingRight: isEven ? '0' : '2rem',
                      display: isEven ? 'none' : 'block',
                    }}
                    className="timeline-card-col-left"
                  >
                    {!isEven && (
                      <div
                        className="timeline-card"
                        style={{
                          backgroundColor: 'var(--white, #ffffff)',
                          borderRadius: '22px',
                          border: isStepPassed
                            ? '1.5px solid var(--navy-900, #123D67)'
                            : '1px solid var(--silver-300, #e2e8f0)',
                          padding: '1.75rem',
                          textAlign: 'left',
                          boxShadow: isStepPassed
                            ? '0 12px 28px rgba(10, 37, 64, 0.08)'
                            : '0 4px 16px rgba(10, 37, 64, 0.04)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                          <span
                            style={{
                              fontSize: '1.15rem',
                              fontWeight: 800,
                              color: isStepPassed ? 'var(--navy-900, #123D67)' : 'var(--muted, #94a3b8)',
                              fontFamily: 'Poppins, sans-serif',
                            }}
                          >
                            {step.number}
                          </span>
                          <h3
                            style={{
                              fontSize: '1.15rem',
                              fontWeight: 700,
                              color: 'var(--navy-950, #051329)',
                              margin: 0,
                            }}
                          >
                            {step.title}
                          </h3>
                        </div>
                        <p
                          style={{
                            fontSize: '0.9rem',
                            color: 'var(--ink, #1f2933)',
                            lineHeight: 1.6,
                            marginBottom: '0.85rem',
                          }}
                        >
                          {step.description}
                        </p>
                        {step.actionNote && (
                          <div
                            style={{
                              fontSize: '0.78rem',
                              color: 'var(--navy-900, #123D67)',
                              backgroundColor: 'var(--navy-100, #eaf1f8)',
                              padding: '0.45rem 0.75rem',
                              borderRadius: '8px',
                              fontWeight: 600,
                            }}
                          >
                            &bull; {step.actionNote}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Center Node / Number Badge */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: isStepPassed ? 'var(--navy-900, #123D67)' : 'var(--white, #ffffff)',
                        border: isStepPassed
                          ? '2px solid var(--navy-900, #123D67)'
                          : '2px solid var(--silver-300, #cbd5e1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isStepPassed ? '#ffffff' : 'var(--navy-900, #0a2540)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {step.number}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div
                    style={{
                      paddingLeft: isEven ? '2rem' : '0',
                      display: isEven ? 'block' : 'none',
                    }}
                    className="timeline-card-col-right"
                  >
                    {isEven && (
                      <div
                        className="timeline-card"
                        style={{
                          backgroundColor: 'var(--white, #ffffff)',
                          borderRadius: '22px',
                          border: isStepPassed
                            ? '1.5px solid var(--navy-900, #123D67)'
                            : '1px solid var(--silver-300, #e2e8f0)',
                          padding: '1.75rem',
                          textAlign: 'left',
                          boxShadow: isStepPassed
                            ? '0 12px 28px rgba(10, 37, 64, 0.08)'
                            : '0 4px 16px rgba(10, 37, 64, 0.04)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                          <span
                            style={{
                              fontSize: '1.15rem',
                              fontWeight: 800,
                              color: isStepPassed ? 'var(--navy-900, #123D67)' : 'var(--muted, #94a3b8)',
                              fontFamily: 'Poppins, sans-serif',
                            }}
                          >
                            {step.number}
                          </span>
                          <h3
                            style={{
                              fontSize: '1.15rem',
                              fontWeight: 700,
                              color: 'var(--navy-950, #051329)',
                              margin: 0,
                            }}
                          >
                            {step.title}
                          </h3>
                        </div>
                        <p
                          style={{
                            fontSize: '0.9rem',
                            color: 'var(--ink, #1f2933)',
                            lineHeight: 1.6,
                            marginBottom: '0.85rem',
                          }}
                        >
                          {step.description}
                        </p>
                        {step.actionNote && (
                          <div
                            style={{
                              fontSize: '0.78rem',
                              color: 'var(--navy-900, #123D67)',
                              backgroundColor: 'var(--navy-100, #eaf1f8)',
                              padding: '0.45rem 0.75rem',
                              borderRadius: '8px',
                              fontWeight: 600,
                            }}
                          >
                            &bull; {step.actionNote}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <button
            type="button"
            onClick={handleEnquiry}
            className="btn btn-primary"
            style={{
              padding: '0.85rem 2rem',
              borderRadius: '14px',
              fontSize: '0.96rem',
              fontWeight: 600,
              backgroundColor: 'var(--red-500, #d9232d)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(217, 35, 45, 0.25)',
            }}
          >
            Start Your Health Consultation &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};
