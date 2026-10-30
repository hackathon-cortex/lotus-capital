import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCountUp } from '../../hooks/useCountUp';
import { LotusLogo } from '../common/LotusLogo';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface RingSegment {
  id: string;
  label: string;
  value: number;
  displayText: string;
  color: string;
  link: string;
}

export interface CoverageChip {
  id: string;
  label: string;
  stat?: string;
}

export interface CoverageBoardConfig {
  headlineValue: number;
  headlineSuffix?: string;
  headlineLabel: string;
  headlineCaption: string;
  ringSegments: RingSegment[];
  coverageChips: CoverageChip[];
}

export interface ServiceHeroProps {
  breadcrumb?: BreadcrumbItem[];
  eyebrow?: string;
  headlinePlain?: string;
  headlineItalic?: string;
  leadCopy?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  coverageBoard?: CoverageBoardConfig;
  customRightBoard?: React.ReactNode;
  backgroundGradient?: string;
  heroPhotoPath?: string;
  onEnquiryClick?: () => void;
}

export const DEFAULT_GI_HERO_CONFIG = {
  breadcrumb: [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'General Insurance' },
  ],
  eyebrow: 'ASSET & LIABILITY PROTECTION • GODHRA, GUJARAT',
  headlinePlain: 'Protection for the',
  headlineItalic: 'things that matter.',
  leadCopy:
    'Comprehensive insurance solutions for private vehicles, commercial properties, transit cargo, and enterprise liabilities underwritten by India’s leading general insurers.',
  primaryButtonText: 'Request a General Quote',
  primaryButtonHref: '#enquiry',
  secondaryButtonText: 'See what to compare',
  secondaryButtonHref: '#compare',
  coverageBoard: {
    headlineValue: 570,
    headlineSuffix: '+',
    headlineLabel: 'Insurance Policies Serviced',
    headlineCaption: 'Personal, commercial, and enterprise policies advised across Gujarat.',
    ringSegments: [
      {
        id: 'health',
        label: 'Health Insurance',
        value: 250,
        displayText: '250+',
        color: '#1F6F8B',
        link: '/services/health-insurance',
      },
      {
        id: 'life',
        label: 'Life Insurance',
        value: 180,
        displayText: '180+',
        color: 'var(--navy-700, #0d2b4a)',
        link: '/services/life-insurance',
      },
      {
        id: 'motor',
        label: 'Motor Insurance',
        value: 140,
        displayText: '140+',
        color: 'var(--red-500, #d9232d)',
        link: '/services/general-insurance',
      },
    ],
    coverageChips: [
      { id: 'vehicle', label: 'Vehicle Protection', stat: '140+ Serviced' },
      { id: 'property', label: 'Property & Fire' },
      { id: 'marine', label: 'Marine & Cargo Transit' },
      { id: 'liability', label: 'Public & Corporate Liability' },
      { id: 'business', label: 'Commercial & SME' },
      { id: 'travel', label: 'Domestic & Overseas Travel' },
    ],
  },
};

export const ServiceHero: React.FC<ServiceHeroProps> = ({
  breadcrumb = DEFAULT_GI_HERO_CONFIG.breadcrumb,
  eyebrow = DEFAULT_GI_HERO_CONFIG.eyebrow,
  headlinePlain = DEFAULT_GI_HERO_CONFIG.headlinePlain,
  headlineItalic = DEFAULT_GI_HERO_CONFIG.headlineItalic,
  leadCopy = DEFAULT_GI_HERO_CONFIG.leadCopy,
  primaryButtonText = DEFAULT_GI_HERO_CONFIG.primaryButtonText,
  primaryButtonHref = DEFAULT_GI_HERO_CONFIG.primaryButtonHref,
  secondaryButtonText = DEFAULT_GI_HERO_CONFIG.secondaryButtonText,
  secondaryButtonHref = DEFAULT_GI_HERO_CONFIG.secondaryButtonHref,
  coverageBoard = DEFAULT_GI_HERO_CONFIG.coverageBoard,
  customRightBoard,
  backgroundGradient,
  heroPhotoPath,
  onEnquiryClick,
}) => {
  const animatedMainNumber = useCountUp(coverageBoard.headlineValue, 1600);
  const [ringDrawn, setRingDrawn] = useState(false);
  const [underlineDrawn, setUnderlineDrawn] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setRingDrawn(true), 150);
    const timer2 = setTimeout(() => setUnderlineDrawn(true), 250);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Compute ring circumference and segment offsets
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12
  const totalValue = coverageBoard.ringSegments.reduce((sum, s) => sum + s.value, 0) || 1;

  let cumulativeOffset = 0;
  const segmentsWithDash = coverageBoard.ringSegments.map((seg) => {
    const ratio = seg.value / totalValue;
    const segmentLength = ratio * circumference;
    const dasharray = `${ringDrawn ? segmentLength : 0} ${circumference - (ringDrawn ? segmentLength : 0)}`;
    const dashoffset = -cumulativeOffset;
    cumulativeOffset += segmentLength;
    return {
      ...seg,
      dasharray,
      dashoffset,
      ratioPercent: Math.round(ratio * 100),
    };
  });

  return (
    <section
      className="service-hero-section"
      style={{
        position: 'relative',
        minHeight: '660px',
        backgroundColor: 'var(--navy-950)',
        backgroundImage: backgroundGradient || `
          radial-gradient(ellipse at 80% 20%, rgba(18, 61, 103, 0.45) 0%, rgba(10, 37, 64, 0) 70%),
          linear-gradient(135deg, var(--navy-950) 0%, var(--navy-900) 60%, #0d2847 100%)
        `,
        color: 'var(--white)',
        overflow: 'hidden',
        paddingTop: 'calc(var(--header-h) + 24px)',
        paddingBottom: '4.5rem',
      }}
    >
      {/* Background Hero Photo (if available) with navy scrim */}
      {heroPhotoPath && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${heroPhotoPath})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
            mixBlendMode: 'luminosity',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Faint grid texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(215, 217, 220, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(215, 217, 220, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Lotus Watermark (6% opacity, slow drift) */}
      <div
        style={{
          position: 'absolute',
          right: '-50px',
          bottom: '-60px',
          width: '520px',
          height: '520px',
          opacity: 0.06,
          zIndex: 1,
          pointerEvents: 'none',
          animation: 'lotusDrift 40s linear infinite alternate',
        }}
      >
        <LotusLogo variant="watermark" width="100%" height="100%" />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
        {/* Breadcrumb INSIDE the hero under the header */}
        <nav
          aria-label="Breadcrumb inside hero"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.82rem',
            color: 'var(--silver-300)',
            marginBottom: '1.5rem',
          }}
        >
          {breadcrumb.map((crumb, idx) => {
            const isLast = idx === breadcrumb.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <span style={{ color: 'var(--silver-500)', fontSize: '0.75rem' }}>›</span>}
                {crumb.path && !isLast ? (
                  <Link
                    to={crumb.path}
                    style={{
                      color: 'var(--silver-300)',
                      textDecoration: 'none',
                      transition: 'color var(--dur-base) ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--white)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--silver-300)')}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span style={{ color: 'var(--white)', fontWeight: 600 }}>{crumb.label}</span>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Hero 2-Column Split: Text Left, Coverage Board Right */}
        <div
          className="grid grid-cols-12"
          style={{ gap: '3rem', alignItems: 'center' }}
        >
          {/* Left Column (7 cols on desktop) */}
          <div className="col-span-12 col-span-lg-7">
            {/* Spaced-caps Eyebrow with red dot */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--silver-300)',
                marginBottom: '1.25rem',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--red-500)',
                }}
              />
              {eyebrow}
            </div>

            {/* Headline with Playfair Display italic + drawing underline */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 4.4vw, 3.8rem)',
                lineHeight: 1.15,
                fontWeight: 700,
                color: 'var(--white)',
                marginBottom: '1.5rem',
              }}
            >
              {headlinePlain}{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <span
                  style={{
                    fontStyle: 'italic',
                    fontWeight: 600,
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #D7D9DC 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {headlineItalic}
                </span>
                {/* 3px Lotus Red animated underline stroke */}
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: '-4px',
                    height: '3px',
                    width: '100%',
                    backgroundColor: 'var(--red-500)',
                    borderRadius: '2px',
                    transformOrigin: 'left center',
                    transform: underlineDrawn ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                />
              </span>
            </h1>

            {/* Lead Copy */}
            <p
              style={{
                fontSize: '1.12rem',
                color: 'var(--silver-300)',
                lineHeight: 1.68,
                marginBottom: '2.25rem',
                maxWidth: '640px',
              }}
            >
              {leadCopy}
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <a
                href={primaryButtonHref}
                onClick={(e) => {
                  if (onEnquiryClick) {
                    e.preventDefault();
                    onEnquiryClick();
                  }
                }}
                className="btn btn-primary btn-lg"
                style={{
                  padding: '0.85rem 1.85rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                {primaryButtonText} &rarr;
              </a>

              {/* Clear, highly readable outlined secondary button */}
              <a
                href={secondaryButtonHref}
                className="btn btn-lg"
                style={{
                  padding: '0.85rem 1.75rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--white)',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1.5px solid rgba(215, 217, 220, 0.45)',
                  borderRadius: 'var(--radius-btn)',
                  backdropFilter: 'blur(8px)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all var(--dur-base) ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
                  e.currentTarget.style.borderColor = 'var(--white)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(215, 217, 220, 0.45)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>{secondaryButtonText}</span>
                <span style={{ fontSize: '0.85rem' }}>↓</span>
              </a>
            </div>
          </div>

          {/* Right Column: Board (5 cols on desktop) */}
          <div className="col-span-12 col-span-lg-5">
            {customRightBoard ? (
              customRightBoard
            ) : (
              <div
                className="coverage-board-card"
              style={{
                background: 'rgba(10, 37, 64, 0.75)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: 'var(--radius-panel)',
                border: '1px solid rgba(215, 217, 220, 0.16)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.06)',
                padding: '2.25rem 2rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Subtle shimmer sweep on load */}
              <div
                style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'linear-gradient(60deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
                  transform: 'rotate(25deg)',
                  pointerEvents: 'none',
                  animation: 'shimmerSweep 3s ease forwards',
                }}
              />

              {/* TOP: Large count-up figure + label + caption */}
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.75rem, 4vw, 3.5rem)',
                    fontWeight: 700,
                    lineHeight: 1,
                    color: 'var(--white)',
                    marginBottom: '0.35rem',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {animatedMainNumber.toLocaleString('en-IN')}
                  {coverageBoard.headlineSuffix || '+'}
                </div>
                <div
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--silver-200)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {coverageBoard.headlineLabel}
                </div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--silver-400)',
                    marginTop: '0.25rem',
                  }}
                >
                  {coverageBoard.headlineCaption}
                </div>
              </div>

              {/* MIDDLE: Animated Segmented Ring (proportional to real data: 250, 180, 140) */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '1.75rem',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                  <svg
                    width="160"
                    height="160"
                    viewBox="0 0 160 160"
                    style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
                  >
                    {/* Background ring rail */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="14"
                    />
                    {/* Data segments */}
                    {segmentsWithDash.map((seg) => (
                      <circle
                        key={seg.id}
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="14"
                        strokeDasharray={seg.dasharray}
                        strokeDashoffset={seg.dashoffset}
                        strokeLinecap="round"
                        style={{
                          transition: 'stroke-dasharray 900ms cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                      />
                    ))}
                  </svg>
                  {/* Inner ring content */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>🛡️</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--silver-300)', fontWeight: 600 }}>
                      All Lines
                    </span>
                  </div>
                </div>

                {/* Ring Legend Chips linking to their respective pages */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '0.65rem',
                    marginTop: '1rem',
                  }}
                >
                  {coverageBoard.ringSegments.map((seg) => (
                    <Link
                      key={seg.id}
                      to={seg.link}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(215, 217, 220, 0.15)',
                        color: 'var(--silver-200)',
                        fontSize: '0.78rem',
                        textDecoration: 'none',
                        transition: 'all var(--dur-base) ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.borderColor = seg.color;
                        e.currentTarget.style.color = 'var(--white)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.borderColor = 'rgba(215, 217, 220, 0.15)';
                        e.currentTarget.style.color = 'var(--silver-200)';
                      }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: seg.color,
                        }}
                      />
                      <span>{seg.label}:</span>
                      <strong style={{ color: 'var(--white)' }}>{seg.displayText}</strong>
                    </Link>
                  ))}
                </div>
              </div>

              {/* BOTTOM: Floating row of 6 coverage chips (only Vehicle shows 140+ stat) */}
              <div
                style={{
                  borderTop: '1px solid rgba(215, 217, 220, 0.12)',
                  paddingTop: '1.25rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--silver-400)',
                    textAlign: 'center',
                    marginBottom: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  General Protection Capabilities
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {coverageBoard.coverageChips.map((chip, i) => (
                    <div
                      key={chip.id}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-pill)',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(215, 217, 220, 0.14)',
                        fontSize: '0.8rem',
                        color: 'var(--silver-200)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        animation: `chipFloat 4s ease-in-out infinite alternate ${i * 0.3}s`,
                      }}
                    >
                      <span>{chip.label}</span>
                      {chip.stat && (
                        <span
                          style={{
                            background: 'var(--red-600)',
                            color: 'var(--white)',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-pill)',
                          }}
                        >
                          {chip.stat}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
