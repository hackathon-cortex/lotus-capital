import React, { useState, useEffect, useRef } from 'react';
import { LotusLogo } from '../common/LotusLogo';

export interface TimelineStep {
  number: string;
  title: string;
  description: string;
  actionNote?: string;
}

export const LIFE_TIMELINE_STEPS: TimelineStep[] = [
  {
    number: '01',
    title: 'Send an Enquiry',
    description: 'Share your protection priorities and basic requirements via our online form or by calling our Godhra office.',
    actionNote: 'No OTP, Aadhaar upload, or intrusive financial data requested.',
  },
  {
    number: '02',
    title: 'Discuss Your Needs',
    description: 'We listen to your family responsibilities and explain how policy structures differ without commercial sales pressure.',
    actionNote: 'Objective review of term duration, dependants, and family cash-flow.',
  },
  {
    number: '03',
    title: 'Review Options from Partner Insurers',
    description: 'Evaluate term options, underwriting guidelines, and policy wording across established life insurers.',
    actionNote: 'Comparing policy schedules from Bharti AXA Life, HDFC Life, ICICI Prudential, and LIC.',
  },
  {
    number: '04',
    title: 'Apply',
    description: 'Complete basic identity documentation, address proof, and any necessary health disclosures under our guidance.',
    actionNote: 'Assistance with accurate declaration forms and KYC verification.',
  },
  {
    number: '05',
    title: 'Policy Issue',
    description: 'The underwriting insurer reviews the proposal, confirms underwriting acceptance, and issues your digital policy bond.',
    actionNote: 'Official policy contract with direct insurer signature and schedule.',
  },
  {
    number: '06',
    title: 'Servicing & Renewals',
    description: 'Lotus Capital provides ongoing local support in Godhra for renewal schedules, nomination changes, and claim facilitation.',
    actionNote: 'Dedicated local point-of-contact throughout the policy lifetime.',
  },
];

export interface LifeProcessTimelineProps {
  id?: string;
  onEnquiryClick?: () => void;
}

export const LifeProcessTimeline: React.FC<LifeProcessTimelineProps> = ({
  id = 'process',
  onEnquiryClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0.2);

  useEffect(() => {
    // Check for query param for screenshot capture
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

  const activeIndex = Math.min(
    Math.floor(scrollProgress * LIFE_TIMELINE_STEPS.length),
    LIFE_TIMELINE_STEPS.length - 1
  );

  return (
    <section
      id={id}
      className="life-timeline-section section-padding gi-stacked-section"
      style={{
        position: 'relative',
        zIndex: 12,
        marginTop: '-36px',
        borderTopLeftRadius: '36px',
        borderTopRightRadius: '36px',
        backgroundColor: 'var(--navy-950, #051329)',
        color: '#ffffff',
        paddingTop: '5rem',
        paddingBottom: '5.5rem',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
        overflow: 'hidden',
      }}
    >
      <div className="container" ref={containerRef} style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4.5rem' }}>
          <span
            className="eyebrow"
            style={{
              display: 'inline-block',
              color: 'var(--silver-400, #adb5bd)',
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
              fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#ffffff',
              marginBottom: '1rem',
            }}
          >
            How a life insurance <span style={{ fontStyle: 'italic', color: '#1F6F8B' }}>enquiry works</span>
          </h2>

          <p style={{ color: 'var(--silver-300, #d7d9dc)', fontSize: '1.02rem', lineHeight: 1.65 }}>
            Six structured steps from initial conversation to long-term policy servicing in Godhra.
          </p>
        </div>

        {/* Desktop Central Timeline with Traveling Lotus Marker */}
        <div className="life-timeline-desktop" style={{ position: 'relative', margin: '0 auto' }}>
          
          {/* Central Vertical Rail Line */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '20px',
              bottom: '20px',
              width: '3px',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              zIndex: 1,
            }}
          >
            {/* Animated Red-to-Teal Filling Line */}
            <div
              style={{
                width: '100%',
                height: `${scrollProgress * 100}%`,
                background: 'linear-gradient(180deg, var(--red-500, #d9232d) 0%, #1F6F8B 100%)',
                transition: 'height 100ms ease-out',
                boxShadow: '0 0 12px rgba(217, 35, 45, 0.6)',
              }}
            />

            {/* Traveling Lotus Marker */}
            <div
              style={{
                position: 'absolute',
                top: `${scrollProgress * 100}%`,
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: 'var(--navy-950, #051329)',
                border: '2px solid var(--red-500, #d9232d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(217, 35, 45, 0.8)',
                zIndex: 4,
                transition: 'top 100ms ease-out',
              }}
            >
              <div style={{ width: '16px', height: '16px', opacity: 0.9 }}>
                <LotusLogo variant="light" />
              </div>
            </div>
          </div>

          {/* Alternating Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', position: 'relative', zIndex: 2 }}>
            {LIFE_TIMELINE_STEPS.map((step, idx) => {
              const isEven = idx % 2 === 0; // Even left, Odd right
              const isPassed = idx <= activeIndex;

              return (
                <div
                  key={step.number}
                  className={`life-timeline-row ${isPassed ? 'is-active' : ''}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 60px 1fr',
                    alignItems: 'center',
                  }}
                >
                  {/* Left Column */}
                  <div
                    style={{
                      textAlign: isEven ? 'right' : 'left',
                      paddingRight: isEven ? '2.5rem' : '0',
                      paddingLeft: isEven ? '0' : '2.5rem',
                      gridColumn: isEven ? 1 : 3,
                    }}
                  >
                    <div
                      className="timeline-card"
                      style={{
                        backgroundColor: isPassed ? 'rgba(18, 61, 103, 0.55)' : 'rgba(10, 37, 64, 0.45)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '24px',
                        border: isPassed ? '1.5px solid rgba(31, 111, 139, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '1.75rem',
                        boxShadow: isPassed ? '0 16px 40px rgba(0, 0, 0, 0.35)' : 'none',
                        transform: isPassed ? 'translateY(0)' : 'translateY(16px)',
                        opacity: isPassed ? 1 : 0.65,
                        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                        <span
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: '1.4rem',
                            fontWeight: 700,
                            color: isPassed ? 'var(--red-400, #f87171)' : 'var(--silver-400, #adb5bd)',
                          }}
                        >
                          Step {step.number}
                        </span>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '9999px',
                            backgroundColor: isPassed ? 'rgba(31, 111, 139, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                            color: isPassed ? '#7dd3fc' : 'var(--silver-300, #d7d9dc)',
                          }}
                        >
                          Stage {idx + 1} of 6
                        </span>
                      </div>

                      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.18rem', color: '#ffffff', fontWeight: 600 }}>
                        {step.title}
                      </h3>

                      <p style={{ margin: '0 0 0.85rem', fontSize: '0.92rem', color: 'var(--silver-300, #d7d9dc)', lineHeight: 1.6 }}>
                        {step.description}
                      </p>

                      {step.actionNote && (
                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: 'rgba(215, 217, 220, 0.8)',
                            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                            paddingTop: '0.65rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                          }}
                        >
                          <span style={{ color: isPassed ? '#4ade80' : 'var(--silver-400)' }}>✓</span>
                          <span>{step.actionNote}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Central Node Anchor */}
                  <div
                    style={{
                      gridColumn: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: isPassed ? '#1F6F8B' : 'var(--navy-950, #051329)',
                        border: isPassed ? '3px solid #ffffff' : '2px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: isPassed ? '0 0 12px rgba(31, 111, 139, 0.8)' : 'none',
                        transform: isPassed ? 'scale(1)' : 'scale(0.75)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  </div>

                  {/* Empty placeholder opposite side */}
                  <div style={{ gridColumn: isEven ? 3 : 1 }} />
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom CTA bar */}
        <div style={{ textAlign: 'center', marginTop: '4.5rem' }}>
          <a
            href="#enquiry"
            onClick={handleEnquiry}
            className="btn btn-primary btn-lg"
            style={{
              padding: '0.85rem 2.25rem',
              borderRadius: '14px',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
            }}
          >
            Start Your Life Insurance Consultation &rarr;
          </a>
        </div>

      </div>
    </section>
  );
};
