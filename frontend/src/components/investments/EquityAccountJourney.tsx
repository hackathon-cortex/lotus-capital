import React, { useState, useEffect, useRef } from 'react';
import { LotusLogo } from '../common/LotusLogo';

export interface JourneyStep {
  step: number;
  threshold: number;
  title: string;
  subtitle: string;
  desc: string;
  x: number;
  y: number;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    step: 1,
    threshold: 0.1,
    title: 'Enquire',
    subtitle: 'Initial Contact',
    desc: 'Reach out through our online form or Godhra office to initiate a demat and trading account enquiry.',
    x: 100,
    y: 280,
  },
  {
    step: 2,
    threshold: 0.32,
    title: 'Discuss the service, costs and risks',
    subtitle: 'Full Transparency',
    desc: 'We discuss Authorised Person facilities, explain securities market volatility, and clarify broking charges.',
    x: 300,
    y: 220,
  },
  {
    step: 3,
    threshold: 0.55,
    title: 'Complete KYC and required documents',
    subtitle: 'Compliance & Verification',
    desc: 'Submit identity, address, and bank documents as required by our broking partner and regulatory norms.',
    x: 500,
    y: 160,
  },
  {
    step: 4,
    threshold: 0.78,
    title: 'Account opened through our broking partner',
    subtitle: 'Account Activation',
    desc: 'Religare Broking Limited reviews submitted documents, completes verification, and activates your account.',
    x: 700,
    y: 100,
  },
  {
    step: 5,
    threshold: 0.95,
    title: 'Begin, with the risks understood',
    subtitle: 'Disciplined Execution',
    desc: 'Access secondary markets through our broking partner with clear awareness of risk and settlement terms.',
    x: 900,
    y: 40,
  },
];

const SVG_PATH_D =
  'M 40,310 C 70,300 85,280 100,280 C 160,280 240,220 300,220 C 360,220 440,160 500,160 C 560,160 640,100 700,100 C 760,100 840,40 900,40 C 930,40 960,35 980,30';

export const EquityAccountJourney: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [markerPos, setMarkerPos] = useState<{ x: number; y: number }>({ x: 40, y: 310 });
  const [pathLength, setPathLength] = useState<number>(1050);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Check screen size (< 1024px active only on lg+) & reduced motion
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024);
      setPrefersReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Measure SVG path length
  useEffect(() => {
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        if (len > 0) {
          setPathLength(len);
        }
      } catch {
        // Fallback
      }
    }
  }, []);

  // Native scroll progress calculation (400vh container, sticky 100vh stage)
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;

      if (scrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / scrollableDistance));
      setScrollProgress(progress);

      // Compute marker position on SVG path
      if (pathRef.current) {
        try {
          const len = pathRef.current.getTotalLength();
          const targetLen = progress * len;
          const point = pathRef.current.getPointAtLength(targetLen);
          setMarkerPos({ x: point.x, y: point.y });
        } catch {
          // Fallback coordinate approximation
          const approxX = 40 + progress * (980 - 40);
          const approxY = 310 - progress * (310 - 30);
          setMarkerPos({ x: approxX, y: approxY });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, prefersReducedMotion]);

  // Handle clicking a node to jump to that step's scroll position
  const scrollToStep = (threshold: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const containerTop = rect.top + scrollTop;
    const scrollableDistance = rect.height - window.innerHeight;
    const targetScroll = containerTop + threshold * scrollableDistance;

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  // Determine active step index for desktop card display
  const activeStepIndex = JOURNEY_STEPS.reduce(
    (acc, step, idx) => (scrollProgress >= step.threshold ? idx : acc),
    0
  );

  return (
    <section
      id="journey"
      ref={containerRef}
      className="equity-journey-container"
      style={{
        position: 'relative',
        backgroundColor: '#07182C',
        color: '#FFFFFF',
        height: isMobile || prefersReducedMotion ? 'auto' : '400vh',
      }}
    >
      {/* Sticky Inner Stage for Desktop Viewport (100vh) */}
      <div
        className="equity-journey-stage"
        style={{
          position: isMobile || prefersReducedMotion ? 'relative' : 'sticky',
          top: 0,
          height: isMobile || prefersReducedMotion ? 'auto' : '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: isMobile ? '4rem 1.25rem' : '3.5rem 2rem 2.5rem',
          overflow: 'hidden',
          backgroundColor: '#07182C',
          backgroundImage:
            'radial-gradient(ellipse at 80% 80%, rgba(79, 95, 176, 0.22) 0%, rgba(7, 24, 44, 0) 70%), linear-gradient(180deg, #051329 0%, #07182C 100%)',
        }}
      >
        <div className="container" style={{ maxWidth: '1240px', width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 1.5rem' }}>
            <span
              className="eyebrow"
              style={{
                color: '#8FA3C8',
                letterSpacing: '0.14em',
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              ONBOARDING PATHWAY
            </span>
            <h2
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: 'clamp(1.85rem, 3.2vw, 2.75rem)',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: '0.35rem 0 0.75rem',
              }}
            >
              How an account opening enquiry works
            </h2>
            <p style={{ color: '#D7D9DC', fontSize: '0.98rem', margin: 0 }}>
              Transparent, step-by-step facilitation through our broking partner with clear disclosures at every stage.
            </p>
          </div>

          {/* Desktop Graph Stage with SVG Rising Step Line */}
          {!isMobile && !prefersReducedMotion ? (
            <div
              className="journey-desktop-canvas"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '1080px',
                margin: '0 auto',
                height: '380px',
                backgroundColor: 'rgba(10, 37, 64, 0.55)',
                borderRadius: '24px',
                border: '1px solid rgba(143, 163, 200, 0.2)',
                padding: '1rem',
                boxShadow: '0 20px 48px rgba(0, 0, 0, 0.35)',
              }}
            >
              {/* SVG Graphic with Graph Step Line */}
              <svg
                viewBox="0 0 1020 340"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
              >
                <defs>
                  {/* Soft Indigo Gradient under rising line */}
                  <linearGradient id="journeyFillGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F5FB0" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#4F5FB0" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Node Glow Filter */}
                  <filter id="nodeGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Horizontal reference lines */}
                <line x1="40" y1="280" x2="980" y2="280" stroke="rgba(143, 163, 200, 0.1)" strokeDasharray="4 4" />
                <line x1="40" y1="220" x2="980" y2="220" stroke="rgba(143, 163, 200, 0.1)" strokeDasharray="4 4" />
                <line x1="40" y1="160" x2="980" y2="160" stroke="rgba(143, 163, 200, 0.1)" strokeDasharray="4 4" />
                <line x1="40" y1="100" x2="980" y2="100" stroke="rgba(143, 163, 200, 0.1)" strokeDasharray="4 4" />
                <line x1="40" y1="40" x2="980" y2="40" stroke="rgba(143, 163, 200, 0.1)" strokeDasharray="4 4" />

                {/* Background Full Inactive Path */}
                <path
                  d={SVG_PATH_D}
                  stroke="rgba(143, 163, 200, 0.2)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Animated Rising Stepped Line */}
                <path
                  ref={pathRef}
                  d={SVG_PATH_D}
                  stroke="#4F5FB0"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  style={{
                    strokeDasharray: pathLength,
                    strokeDashoffset: pathLength * (1 - scrollProgress),
                    transition: 'stroke-dashoffset 0.12s linear',
                  }}
                />

                {/* Area Fill Under Current Progress Line */}
                <path
                  d={`${SVG_PATH_D} L 980 330 L 40 330 Z`}
                  fill="url(#journeyFillGrad)"
                  opacity={scrollProgress > 0.05 ? Math.min(scrollProgress * 1.2, 0.85) : 0}
                  style={{ transition: 'opacity 0.2s ease' }}
                />

                {/* Five Interactive Step Nodes */}
                {JOURNEY_STEPS.map((st, idx) => {
                  const isReached = scrollProgress >= st.threshold;
                  const isActive = idx === activeStepIndex;

                  return (
                    <g
                      key={st.step}
                      onClick={() => scrollToStep(st.threshold)}
                      style={{ cursor: 'pointer' }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Step ${st.step}: ${st.title}`}
                    >
                      {/* Outer pulse when reached */}
                      {isReached && (
                        <circle
                          cx={st.x}
                          cy={st.y}
                          r="18"
                          fill="none"
                          stroke="#4F5FB0"
                          strokeWidth="1.5"
                          opacity="0.6"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={st.x}
                        cy={st.y}
                        r={isActive ? 12 : 9}
                        fill={isReached ? '#FFFFFF' : '#0A2540'}
                        stroke={isReached ? '#4F5FB0' : 'rgba(143, 163, 200, 0.4)'}
                        strokeWidth="3"
                        style={{
                          transformOrigin: `${st.x}px ${st.y}px`,
                          transform: isReached ? 'scale(1)' : 'scale(0.7)',
                          transition: 'all 0.36s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />

                      {/* Step Number label */}
                      <text
                        x={st.x}
                        y={st.y + 30}
                        textAnchor="middle"
                        fill={isReached ? '#FFFFFF' : '#8FA3C8'}
                        fontSize="11"
                        fontWeight="700"
                        letterSpacing="0.06em"
                      >
                        STEP 0{st.step}
                      </text>
                    </g>
                  );
                })}

                {/* Traveling Lotus Marker along the Step Line */}
                <g
                  transform={`translate(${markerPos.x - 14}, ${markerPos.y - 14})`}
                  style={{
                    opacity: scrollProgress > 0.02 ? 1 : 0,
                    transition: 'opacity 0.24s ease',
                  }}
                >
                  <circle cx="14" cy="14" r="14" fill="#D9232D" style={{ filter: 'drop-shadow(0 0 8px rgba(217, 35, 45, 0.8))' }} />
                  <g transform="translate(4, 4) scale(0.42)">
                    <LotusLogo variant="light" width="48" height="48" />
                  </g>
                </g>
              </svg>

              {/* Active Step Floating Card beside Node (360ms slide+fade) */}
              <div
                className="journey-floating-card"
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '16px',
                  transform: 'translateX(-50%)',
                  width: '90%',
                  maxWidth: '680px',
                  backgroundColor: 'rgba(5, 19, 41, 0.92)',
                  border: '1.5px solid rgba(79, 95, 176, 0.55)',
                  borderRadius: '16px',
                  padding: '1.25rem 1.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  boxShadow: '0 14px 36px rgba(0, 0, 0, 0.45)',
                  backdropFilter: 'blur(16px)',
                  transition: 'opacity 360ms ease, transform 360ms ease',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(79, 95, 176, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                  }}
                >
                  0{JOURNEY_STEPS[activeStepIndex]?.step}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.2rem' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#8FA3C8',
                        fontWeight: 600,
                      }}
                    >
                      {JOURNEY_STEPS[activeStepIndex]?.subtitle}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(143, 163, 200, 0.5)' }}>• Step {activeStepIndex + 1} of 5</span>
                  </div>

                  <h4
                    style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      margin: '0 0 0.35rem',
                    }}
                  >
                    {JOURNEY_STEPS[activeStepIndex]?.title}
                  </h4>

                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: '#D7D9DC',
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {JOURNEY_STEPS[activeStepIndex]?.desc}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Mobile / Reduced Motion Fallback: Stacked Vertical Steps */
            <div
              className="journey-mobile-stack"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                maxWidth: '600px',
                margin: '0 auto',
                position: 'relative',
              }}
            >
              {/* Vertical connecting line */}
              <div
                style={{
                  position: 'absolute',
                  left: '23px',
                  top: '20px',
                  bottom: '20px',
                  width: '2px',
                  backgroundColor: 'rgba(79, 95, 176, 0.4)',
                }}
              />

              {JOURNEY_STEPS.map((st) => (
                <div
                  key={st.step}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.25rem',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: '#0A2540',
                      border: '2px solid #4F5FB0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: '#FFFFFF',
                    }}
                  >
                    0{st.step}
                  </div>

                  <div
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(10, 37, 64, 0.75)',
                      borderRadius: '16px',
                      border: '1px solid rgba(143, 163, 200, 0.25)',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', color: '#8FA3C8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
                      {st.subtitle}
                    </div>
                    <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF', margin: '0 0 0.4rem', fontFamily: 'Playfair Display, serif' }}>
                      {st.title}
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: '#D7D9DC', margin: 0, lineHeight: 1.55 }}>
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footnote under the stage */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              fontSize: '0.8rem',
              color: '#8FA3C8',
            }}
          >
            Process and document requirements are set by our broking partner and applicable regulations.
          </div>
        </div>
      </div>
    </section>
  );
};
