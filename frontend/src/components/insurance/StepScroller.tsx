import React, { useState, useEffect, useRef } from 'react';

export interface StepItem {
  number: string; // e.g. "01", "02", "03", "04"
  title: string;
  description: string;
  mockup: React.ReactNode;
}

export interface StepScrollerProps {
  id?: string;
  heading?: string;
  subtitle?: string;
  steps?: StepItem[];
  onEnquiryClick?: () => void;
}

export const DEFAULT_GI_STEPS: StepItem[] = [
  {
    number: '01',
    title: 'Share Registration & Existing Policy Schedule',
    description:
      'Provide your vehicle registration number, RC copy, or commercial asset details. Our team in Godhra pulls official manufacturing parameters and historical risk ratings.',
    mockup: (
      <div style={{ color: '#ffffff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--silver-400)' }}>Document Intake</span>
          <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(217,35,45,0.2)', color: 'var(--red-400)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>Step 01 / 04</span>
        </div>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--silver-400)', marginBottom: '0.25rem' }}>Vehicle RC / Policy Copy</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>GJ-17-XX-XXXX (Panchmahals RTO)</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--silver-300)', marginTop: '0.35rem' }}>Private Four-Wheeler &bull; 2022 Registration</div>
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--silver-400)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#4ade80' }}>✓</span>
          <span>Verified against VAHAN & insurance repository records</span>
        </div>
      </div>
    ),
  },
  {
    number: '02',
    title: 'Evaluate Insurer Terms & Zero-Dep Options',
    description:
      'We compare policy wording, IDV calculations, and zero-depreciation endorsements across partner insurers including ICICI Lombard and HDFC ERGO.',
    mockup: (
      <div style={{ color: '#ffffff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--silver-400)' }}>Coverage Appraisal</span>
          <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(217,35,45,0.2)', color: 'var(--red-400)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>Step 02 / 04</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--silver-400)' }}>ICICI Lombard</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginTop: '0.2rem' }}>Zero-Dep + Engine</div>
            <div style={{ fontSize: '0.75rem', color: '#4ade80', marginTop: '0.25rem' }}>Cashless Garages</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--silver-400)' }}>HDFC ERGO</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginTop: '0.2rem' }}>Consumables + RTI</div>
            <div style={{ fontSize: '0.75rem', color: '#4ade80', marginTop: '0.25rem' }}>Standard IDV Grid</div>
          </div>
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--silver-400)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#4ade80' }}>✓</span>
          <span>Transparent comparison of out-of-pocket clauses</span>
        </div>
      </div>
    ),
  },
  {
    number: '03',
    title: 'Verify No Claim Bonus (NCB) Discount',
    description:
      'We authenticate your accumulated claim-free discount (up to 50%) with your prior insurer, guaranteeing the highest eligible premium savings on your Own Damage premium.',
    mockup: (
      <div style={{ color: '#ffffff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--silver-400)' }}>NCB Validation</span>
          <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(217,35,45,0.2)', color: 'var(--red-400)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>Step 03 / 04</span>
        </div>
        <div style={{ backgroundColor: 'rgba(217,35,45,0.15)', borderRadius: '14px', padding: '1.1rem', border: '1px solid rgba(217,35,45,0.35)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--silver-300)' }}>Verified NCB Discount</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: '#ffffff', margin: '0.25rem 0' }}>50% SAVING</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--silver-300)' }}>Transferred to your new renewal quote</div>
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--silver-400)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#4ade80' }}>✓</span>
          <span>Zero-loss transfer across insurance underwriters</span>
        </div>
      </div>
    ),
  },
  {
    number: '04',
    title: 'Digital Policy Issuance & Immediate Cover Note',
    description:
      'Upon confirmation and payment directly to the insurer, receive your official policy schedule and digital cover note with instantaneous validity and repository sync.',
    mockup: (
      <div style={{ color: '#ffffff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--silver-400)' }}>Policy Schedule</span>
          <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(74,222,128,0.2)', color: '#4ade80', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>Active &bull; Verified</span>
        </div>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--silver-400)' }}>Policy Bond Document</span>
            <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>Instant PDF Issued</span>
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>Official Cover Note & Schedule</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--silver-300)', marginTop: '0.25rem' }}>Direct underwriter digital signature & tax invoice</div>
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--silver-400)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#4ade80' }}>✓</span>
          <span>Digital policy copy sent via email and WhatsApp</span>
        </div>
      </div>
    ),
  },
];

export const StepScroller: React.FC<StepScrollerProps> = ({
  id = 'process',
  heading = 'How a General Insurance enquiry works',
  subtitle = 'Four simple steps from enquiry to decision.',
  steps = DEFAULT_GI_STEPS,
  onEnquiryClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const progressParam = params.get('stepProgress');
    if (progressParam !== null) {
      setScrollProgress(Math.min(Math.max(parseFloat(progressParam), 0), 1));
      return;
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;
      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalScrollable, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Map progress (0 to 1) to step index (0 to 3)
  const stepCount = steps.length;
  const rawStepIndex = Math.floor(scrollProgress * stepCount);
  const currentStepIndex = Math.min(Math.max(rawStepIndex, 0), stepCount - 1);
  const currentStep = steps[currentStepIndex];

  // Clicking a node smoothly scrolls to that step
  const scrollToStep = (index: number) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
    const targetScroll = containerTop + (index / (stepCount - 1)) * totalScrollable;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  return (
    <section
      id={id}
      className="step-scroller-wrapper gi-stacked-section"
      ref={containerRef}
      style={{
        position: 'relative',
        zIndex: 12,
        marginTop: '-36px',
        borderTopLeftRadius: '36px',
        borderTopRightRadius: '36px',
        overflow: 'hidden',
      }}
    >
      {/* Pinned Sticky Window on Desktop */}
      <div className="step-scroller-sticky">
        <div className="container" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Section Heading */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span
              style={{
                color: 'var(--red-400)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Clear Process
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                color: 'var(--white)',
                marginBottom: '0.5rem',
              }}
            >
              {heading}
            </h2>
            <p style={{ color: 'var(--silver-300)', fontSize: '1rem', margin: 0 }}>
              {subtitle}
            </p>
          </div>

          {/* 2-Column Pinned Stage */}
          <div
            className="grid grid-cols-12"
            style={{ gap: '3.5rem', alignItems: 'center' }}
          >
            {/* Left Column: Vertical Progress Rail + Step text */}
            <div className="col-span-12 col-span-md-6" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              {/* Vertical Progress Rail */}
              <div
                style={{
                  position: 'relative',
                  width: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingTop: '8px',
                }}
              >
                {/* Background track line */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    bottom: '16px',
                    width: '3px',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    zIndex: 0,
                  }}
                />
                {/* Red filling line */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    width: '3px',
                    height: `${scrollProgress * 85}%`,
                    backgroundColor: 'var(--red-500)',
                    zIndex: 1,
                    transition: 'height 120ms ease-out',
                  }}
                />

                {/* 4 Interactive Step Nodes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', zIndex: 2 }}>
                  {steps.map((s, idx) => {
                    const isReached = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <button
                        key={s.number}
                        onClick={() => scrollToStep(idx)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: isCurrent
                            ? 'var(--red-500)'
                            : isReached
                            ? 'var(--navy-700)'
                            : 'var(--navy-950)',
                          border: isCurrent
                            ? '3px solid var(--white)'
                            : isReached
                            ? '2px solid var(--red-400)'
                            : '2px solid rgba(255, 255, 255, 0.25)',
                          boxShadow: isCurrent ? '0 0 0 6px rgba(233, 35, 50, 0.35)' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--white)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          transition: 'all 0.25s ease',
                          padding: 0,
                        }}
                        aria-label={`Go to step ${s.number}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step Numeral + Title + Description */}
              <div style={{ flex: 1, minHeight: '260px' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(3.5rem, 6vw, 5.5rem)',
                    fontWeight: 700,
                    lineHeight: 1,
                    color: 'rgba(233, 35, 50, 0.3)',
                    marginBottom: '0.5rem',
                    transition: 'all 0.36s ease',
                  }}
                >
                  {currentStep.number}
                </div>

                <h3
                  style={{
                    fontSize: 'clamp(1.4rem, 2.2vw, 1.85rem)',
                    fontWeight: 700,
                    color: 'var(--white)',
                    marginBottom: '1rem',
                    lineHeight: 1.25,
                    transition: 'all 0.36s ease',
                  }}
                >
                  {currentStep.title}
                </h3>

                <p
                  style={{
                    fontSize: '1.05rem',
                    color: 'var(--silver-300)',
                    lineHeight: 1.68,
                    margin: 0,
                    transition: 'all 0.36s ease',
                  }}
                >
                  {currentStep.description}
                </p>

                <div style={{ marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--silver-400)' }}>
                  Step {currentStepIndex + 1} of {stepCount} &bull; Scroll to continue
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <a
                    href="#enquiry"
                    onClick={(e) => {
                      if (onEnquiryClick) {
                        e.preventDefault();
                        onEnquiryClick();
                      }
                    }}
                    className="btn btn-primary"
                    style={{
                      padding: '0.65rem 1.4rem',
                      fontSize: '0.9rem',
                      borderRadius: '12px',
                    }}
                  >
                    Start Quote Enquiry &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Device-Card Mockup with Slide/Fade Transition */}
            <div className="col-span-12 col-span-md-6">
              <div
                className="step-device-card"
                style={{
                  background: 'linear-gradient(145deg, rgba(18, 61, 103, 0.6) 0%, rgba(10, 37, 64, 0.9) 100%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: '28px',
                  border: '1.5px solid rgba(215, 217, 220, 0.18)',
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
                  padding: '2.25rem',
                  minHeight: '360px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Render active step's custom mockup */}
                <div
                  key={currentStep.number}
                  style={{
                    animation: 'stepCardFadeIn 360ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
                  }}
                >
                  {currentStep.mockup}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Stacked Fallback (< 768px or reduced-motion) */}
      <div className="step-scroller-mobile">
        <div className="container section-padding">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="eyebrow" style={{ color: 'var(--red-400)' }}>
              Clear Process
            </span>
            <h2 style={{ color: 'var(--white)', fontFamily: 'var(--font-display)' }}>
              {heading}
            </h2>
            <p style={{ color: 'var(--silver-300)' }}>{subtitle}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {steps.map((s, idx) => (
              <div
                key={s.number}
                style={{
                  background: 'rgba(18, 61, 103, 0.4)',
                  border: '1px solid rgba(215, 217, 220, 0.18)',
                  borderRadius: '24px',
                  padding: '1.75rem',
                  color: 'var(--white)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--red-500)',
                      color: 'var(--white)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    {idx + 1}
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--white)' }}>
                    {s.title}
                  </h3>
                </div>
                <p style={{ color: 'var(--silver-300)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                  {s.description}
                </p>
                <div style={{ opacity: 0.9 }}>
                  {s.mockup}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
