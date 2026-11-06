
import React, { useState, useEffect, useRef } from 'react';
import { LotusLogo } from './LotusLogo';

export interface TimelinePhase {
  label: string;
  span: number;
}

export interface TimelineStepItem {
  number: string;
  title: string;
  description: string;
  tag?: string;
  actionNote?: string;
}

export interface ReferenceTimelinePipelineProps {
  id?: string;
  className?: string;
  ariaLabel: string;
  heading?: string;
  eyebrow?: string;
  lead?: string;
  phases?: TimelinePhase[];
  steps: TimelineStepItem[];
  dataTone?: 'light' | 'dark';
  accentColor?: string;
  onStepSelect?: (index: number) => void;
}

export const ReferenceTimelinePipeline: React.FC<ReferenceTimelinePipelineProps> = ({
  id,
  className = '',
  ariaLabel,
  heading,
  eyebrow,
  lead,
  phases,
  steps,
  dataTone = 'light',
  accentColor = 'var(--lotus-red, #E92332)',
  onStepSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0.35);
  const [manualActiveIndex, setManualActiveIndex] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Check for query parameters (?progress=0.5, ?timelineProgress=0.5, ?stepProgress=0.5)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const forcedProgress =
        params.get('progress') ||
        params.get('timelineProgress') ||
        params.get('stepProgress');
      if (forcedProgress !== null) {
        setScrollProgress(Math.min(Math.max(parseFloat(forcedProgress), 0), 1));
        return;
      }
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Starts when section top reaches 85% of window height (enters view naturally)
      // Completes when section top reaches 25% of window height (natural reading range)
      // ZERO extra blank spaces, NO sticky trapping!
      const startTrigger = windowH * 0.85;
      const endTrigger = windowH * 0.25;
      const totalRange = startTrigger - endTrigger;

      if (totalRange <= 0) return;

      const currentProgress = (startTrigger - rect.top) / totalRange;
      const clamped = Math.max(0, Math.min(1, currentProgress));
      setScrollProgress(clamped);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stepsCount = steps.length;
  const computedActiveIndex = Math.min(
    Math.floor(scrollProgress * stepsCount),
    stepsCount - 1
  );
  const activeIndex =
    manualActiveIndex !== null ? manualActiveIndex : Math.max(0, computedActiveIndex);

  const handleStepClick = (idx: number) => {
    setManualActiveIndex(idx);
    if (onStepSelect) {
      onStepSelect(idx);
    }
  };

  const isDark = dataTone === 'dark';
  const cardBg = isDark ? 'var(--navy-800, #0E3154)' : 'var(--white, #FFFFFF)';
  const cardBorderNormal = isDark
    ? '1px solid rgba(215, 217, 220, 0.12)'
    : '1px solid var(--silver-300, #D7D9DC)';
  const textColor = isDark ? 'var(--white, #FFFFFF)' : 'var(--navy-900, #0A2540)';
  const textMuted = isDark ? 'var(--silver-300, #D7D9DC)' : 'var(--muted, #5B6770)';
  const trackInactive = isDark ? 'rgba(215, 217, 220, 0.2)' : 'var(--silver-300, #D7D9DC)';

  // Calculate percentage span for the horizontal progress line
  // The line spans between the midpoint of column 1 (100% / 2N) and column N (100% - 100% / 2N)
  const colHalfPercent = 100 / (stepsCount * 2);
  const trackSpanPercent = 100 - colHalfPercent * 2;
  const activeLineWidthPercent = (activeIndex / Math.max(1, stepsCount - 1)) * trackSpanPercent;

  return (
    <section
      id={id}
      ref={containerRef}
      aria-label={ariaLabel}
      data-tone={dataTone}
      className={`reference-timeline-section ${className}`}
      style={{
        position: 'relative',
        padding: '3.75rem 0 4.25rem',
        overflow: 'clip',
        backgroundColor: isDark
          ? 'var(--navy-950, #071B30)'
          : 'var(--canvas-grey, #EEF1F4)',
      }}
    >
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header Block */}
        {(heading || eyebrow || lead) && (
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem' }}>
            {eyebrow && (
              <>
                <div className="eyebrow-rule" style={{ margin: '0 auto 0.5rem' }} />
                <span
                  className="eyebrow"
                  style={{ color: accentColor }}
                >
                  {eyebrow}
                </span>
              </>
            )}
            {heading && (
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
                  color: textColor,
                  margin: '0.4rem 0 0.6rem',
                }}
              >
                {heading}
              </h2>
            )}
            {lead && (
              <p style={{ color: textMuted, fontSize: '0.98rem', margin: 0, lineHeight: 1.55 }}>
                {lead}
              </p>
            )}
          </div>
        )}

        {/* Phase Capsules Header Bar (Reference: [ DISCOVER ] [ DESIGN ] [ BUILD ] [ LAUNCH ]) */}
        {phases && phases.length > 0 && isDesktop && (
          <div
            className="timeline-phases-bar"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${stepsCount}, 1fr)`,
              gap: '1rem',
              marginBottom: '1.75rem',
            }}
          >
            {phases.map((ph, pIdx) => (
              <div
                key={`phase-${pIdx}`}
                style={{
                  gridColumn: `span ${ph.span}`,
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.04)'
                    : 'rgba(0, 0, 0, 0.035)',
                  border: isDark
                    ? '1px solid rgba(255, 255, 255, 0.08)'
                    : '1px solid rgba(0, 0, 0, 0.06)',
                  borderRadius: '10px',
                  padding: '0.55rem 0.75rem',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: accentColor,
                  }}
                >
                  [ {ph.label} ]
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Desktop Pipeline: Alternating Snake Grid with Central Baseline (Reference Exact Match) */}
        {isDesktop ? (
          <div
            className="timeline-desktop-pipeline"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${stepsCount}, 1fr)`,
              gap: '1rem',
              position: 'relative',
              alignItems: 'center',
            }}
          >
            {/* -----------------------------------------------------------
                ROW 1: TOP CARDS (Odd Steps: 01, 03, 05, 07...)
               ----------------------------------------------------------- */}
            {steps.map((st, idx) => {
              const isTop = idx % 2 === 0;
              const isPassed = idx < activeIndex;
              const isActive = idx === activeIndex;
              const isUpcoming = idx > activeIndex;

              return (
                <div
                  key={`top-slot-${st.number}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    minHeight: '170px',
                  }}
                >
                  {isTop ? (
                    <div
                      onClick={() => handleStepClick(idx)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Step ${st.number}: ${st.title}`}
                      style={{
                        width: '100%',
                        backgroundColor: cardBg,
                        border: isActive
                          ? `1.5px solid ${accentColor}`
                          : cardBorderNormal,
                        borderRadius: '20px',
                        padding: '1.25rem 1.15rem',
                        boxShadow: isActive
                          ? `0 12px 32px rgba(233, 35, 50, 0.18)`
                          : '0 4px 14px rgba(0, 0, 0, 0.04)',
                        transform: isActive ? 'scale(1.02)' : 'scale(1.0)',
                        opacity: isUpcoming ? 0.65 : 1,
                        cursor: 'pointer',
                        transition:
                          'transform 240ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 240ms ease, border-color 240ms ease, opacity 240ms ease',
                        position: 'relative',
                      }}
                    >
                      {/* Top Row: Numeral Left + Status Indicator Right */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <span
                          data-numeral="true"
                          style={{
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-heading)',
                            color: isActive ? accentColor : textColor,
                            whiteSpace: 'nowrap',
                            writingMode: 'horizontal-tb',
                            fontVariantNumeric: 'tabular-nums',
                            flexShrink: 0,
                            minWidth: 'max-content',
                          }}
                        >
                          {st.number}
                        </span>

                        {/* Status Icon */}
                        {isPassed ? (
                          /* Completed: Red checkmark in circle */
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: `1.5px solid ${accentColor}`,
                              color: accentColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 800,
                            }}
                            title="Completed"
                          >
                            ✓
                          </div>
                        ) : isActive ? (
                          /* Active: Glowing pulsating red dot */
                          <div
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: accentColor,
                              boxShadow: `0 0 12px ${accentColor}`,
                            }}
                            title="In Progress"
                          />
                        ) : (
                          /* Upcoming: Subtle muted dot */
                          <div
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: isDark
                                ? 'rgba(215, 217, 220, 0.3)'
                                : 'var(--silver-400, #8A949D)',
                            }}
                            title="Upcoming"
                          />
                        )}
                      </div>

                      <h4
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: textColor,
                          margin: '0 0 0.35rem',
                          lineHeight: 1.3,
                        }}
                      >
                        {st.title}
                      </h4>
                      <p
                        style={{
                          fontSize: '0.82rem',
                          lineHeight: 1.5,
                          color: textMuted,
                          margin: 0,
                        }}
                      >
                        {st.description}
                      </p>
                    </div>
                  ) : (
                    /* Spacer for bottom slot */
                    <div style={{ height: '100%', width: '100%' }} />
                  )}
                </div>
              );
            })}

            {/* -----------------------------------------------------------
                ROW 2: CONTINUOUS HORIZONTAL BASELINE & CONNECTORS
               ----------------------------------------------------------- */}
            <div
              className="timeline-baseline-track"
              style={{
                gridColumn: `1 / span ${stepsCount}`,
                position: 'relative',
                height: '68px',
                display: 'flex',
                alignItems: 'center',
                margin: '0.4rem 0',
              }}
            >
              {/* Inactive Background Line (spans across all column midpoints) */}
              <div
                style={{
                  position: 'absolute',
                  left: `${colHalfPercent}%`,
                  right: `${colHalfPercent}%`,
                  height: '2px',
                  backgroundColor: trackInactive,
                  zIndex: 1,
                }}
              />

              {/* Active Drawn Red Progress Line */}
              <div
                style={{
                  position: 'absolute',
                  left: `${colHalfPercent}%`,
                  width: `${activeLineWidthPercent}%`,
                  height: '2.5px',
                  backgroundColor: accentColor,
                  boxShadow: `0 0 10px rgba(233, 35, 50, 0.7)`,
                  transition: 'width 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 2,
                }}
              />

              {/* Traveling Lotus Bead / Glow on the Baseline */}
              <div
                style={{
                  position: 'absolute',
                  left: `calc(${colHalfPercent}% + ${activeLineWidthPercent}%)`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? 'var(--navy-900, #0A2540)' : '#FFFFFF',
                  border: `2px solid ${accentColor}`,
                  boxShadow: `0 0 16px rgba(233, 35, 50, 0.75)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 5,
                  transition: 'left 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                aria-hidden="true"
              >
                <div style={{ width: '16px', height: '16px' }}>
                  <LotusLogo variant={isDark ? 'light' : 'dark'} width="100%" height="100%" />
                </div>
              </div>

              {/* Step Connectors & Concentric Nodes for every column */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${stepsCount}, 1fr)`,
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  zIndex: 3,
                }}
              >
                {steps.map((st, idx) => {
                  const isTop = idx % 2 === 0;
                  const isPassed = idx < activeIndex;
                  const isActive = idx === activeIndex;
                  const isLit = idx <= activeIndex;

                  return (
                    <div
                      key={`connector-${st.number}`}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                      }}
                    >
                      {/* Vertical Stem from Top Card to Baseline */}
                      {isTop && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            bottom: '50%',
                            width: '2px',
                            backgroundColor: isLit ? accentColor : trackInactive,
                            transition: 'background-color 240ms ease',
                          }}
                        />
                      )}

                      {/* Concentric Node Circle on Baseline */}
                      <div
                        onClick={() => handleStepClick(idx)}
                        style={{
                          width: isActive ? '22px' : isPassed ? '18px' : '14px',
                          height: isActive ? '22px' : isPassed ? '18px' : '14px',
                          borderRadius: '50%',
                          backgroundColor: isLit ? accentColor : cardBg,
                          border: isActive
                            ? `3px solid ${isDark ? '#FFFFFF' : '#FFFFFF'}`
                            : isPassed
                            ? `2px solid ${accentColor}`
                            : `2px solid ${trackInactive}`,
                          boxShadow: isActive
                            ? `0 0 16px rgba(233, 35, 50, 0.85)`
                            : 'none',
                          cursor: 'pointer',
                          transition: 'all 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                          zIndex: 4,
                          position: 'relative',
                        }}
                      >
                        {/* Inner dot for concentric ring effect */}
                        {isPassed && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: '#FFFFFF',
                            }}
                          />
                        )}
                      </div>

                      {/* Vertical Stem from Baseline down to Bottom Card */}
                      {!isTop && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            bottom: 0,
                            width: '2px',
                            backgroundColor: isLit ? accentColor : trackInactive,
                            transition: 'background-color 240ms ease',
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* -----------------------------------------------------------
                ROW 3: BOTTOM CARDS (Even Steps: 02, 04, 06, 08...)
               ----------------------------------------------------------- */}
            {steps.map((st, idx) => {
              const isTop = idx % 2 === 0;
              const isPassed = idx < activeIndex;
              const isActive = idx === activeIndex;
              const isUpcoming = idx > activeIndex;

              return (
                <div
                  key={`bottom-slot-${st.number}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    minHeight: '170px',
                  }}
                >
                  {!isTop ? (
                    <div
                      onClick={() => handleStepClick(idx)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Step ${st.number}: ${st.title}`}
                      style={{
                        width: '100%',
                        backgroundColor: cardBg,
                        border: isActive
                          ? `1.5px solid ${accentColor}`
                          : cardBorderNormal,
                        borderRadius: '20px',
                        padding: '1.25rem 1.15rem',
                        boxShadow: isActive
                          ? `0 12px 32px rgba(233, 35, 50, 0.18)`
                          : '0 4px 14px rgba(0, 0, 0, 0.04)',
                        transform: isActive ? 'scale(1.02)' : 'scale(1.0)',
                        opacity: isUpcoming ? 0.65 : 1,
                        cursor: 'pointer',
                        transition:
                          'transform 240ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 240ms ease, border-color 240ms ease, opacity 240ms ease',
                        position: 'relative',
                      }}
                    >
                      {/* Top Row: Numeral Left + Status Indicator Right */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <span
                          data-numeral="true"
                          style={{
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-heading)',
                            color: isActive ? accentColor : textColor,
                            whiteSpace: 'nowrap',
                            writingMode: 'horizontal-tb',
                            fontVariantNumeric: 'tabular-nums',
                            flexShrink: 0,
                            minWidth: 'max-content',
                          }}
                        >
                          {st.number}
                        </span>

                        {/* Status Icon */}
                        {isPassed ? (
                          /* Completed: Red checkmark in circle */
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: `1.5px solid ${accentColor}`,
                              color: accentColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 800,
                            }}
                            title="Completed"
                          >
                            ✓
                          </div>
                        ) : isActive ? (
                          /* Active: Glowing pulsating red dot */
                          <div
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: accentColor,
                              boxShadow: `0 0 12px ${accentColor}`,
                            }}
                            title="In Progress"
                          />
                        ) : (
                          /* Upcoming: Subtle muted dot */
                          <div
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: isDark
                                ? 'rgba(215, 217, 220, 0.3)'
                                : 'var(--silver-400, #8A949D)',
                            }}
                            title="Upcoming"
                          />
                        )}
                      </div>

                      <h4
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: textColor,
                          margin: '0 0 0.35rem',
                          lineHeight: 1.3,
                        }}
                      >
                        {st.title}
                      </h4>
                      <p
                        style={{
                          fontSize: '0.82rem',
                          lineHeight: 1.5,
                          color: textMuted,
                          margin: 0,
                        }}
                      >
                        {st.description}
                      </p>
                    </div>
                  ) : (
                    /* Spacer for top slot */
                    <div style={{ height: '100%', width: '100%' }} />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* -----------------------------------------------------------
             MOBILE / TABLET (< 1024px): VERTICAL PIPELINE WITH DRAWN RAIL
             (Smooth, compact, zero extra spaces, reference-styled)
             ----------------------------------------------------------- */
          <div
            className="timeline-mobile-pipeline"
            style={{
              position: 'relative',
              paddingLeft: '2.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            {/* Background Vertical Line */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                bottom: '20px',
                left: '17px',
                width: '2px',
                backgroundColor: trackInactive,
              }}
            />

            {/* Drawn Active Vertical Line */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                height: `${(activeIndex / Math.max(1, stepsCount - 1)) * 92}%`,
                left: '17px',
                width: '2px',
                backgroundColor: accentColor,
                boxShadow: `0 0 8px ${accentColor}`,
                transition: 'height 240ms ease',
              }}
            />

            {steps.map((st, idx) => {
              const isPassed = idx < activeIndex;
              const isActive = idx === activeIndex;
              const isLit = idx <= activeIndex;

              return (
                <div
                  key={`mobile-${st.number}`}
                  onClick={() => handleStepClick(idx)}
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  {/* Concentric Node Circle on Vertical Rail */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-2.75rem',
                      top: '1.25rem',
                      transform: 'translateX(2px)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isLit ? accentColor : cardBg,
                      border: isActive
                        ? '3px solid #FFFFFF'
                        : isPassed
                        ? `2px solid ${accentColor}`
                        : `2px solid ${trackInactive}`,
                      boxShadow: isActive
                        ? `0 0 14px rgba(233, 35, 50, 0.7)`
                        : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 3,
                    }}
                  >
                    <span
                      data-numeral="true"
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: isLit ? '#FFFFFF' : textMuted,
                        whiteSpace: 'nowrap',
                        writingMode: 'horizontal-tb',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {st.number}
                    </span>
                  </div>

                  {/* Card */}
                  <div
                    style={{
                      backgroundColor: cardBg,
                      border: isActive
                        ? `1.5px solid ${accentColor}`
                        : cardBorderNormal,
                      borderRadius: '18px',
                      padding: '1.15rem 1.25rem',
                      boxShadow: isActive
                        ? `0 8px 24px rgba(233, 35, 50, 0.16)`
                        : '0 2px 8px rgba(0, 0, 0, 0.04)',
                      transform: isActive ? 'scale(1.01)' : 'scale(1)',
                      transition: 'all 240ms ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.4rem',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: textColor,
                          margin: 0,
                        }}
                      >
                        {st.title}
                      </h4>
                      {isPassed ? (
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: `1.5px solid ${accentColor}`,
                            color: accentColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 800,
                          }}
                        >
                          ✓
                        </div>
                      ) : isActive ? (
                        <div
                          style={{
                            width: '9px',
                            height: '9px',
                            borderRadius: '50%',
                            backgroundColor: accentColor,
                            boxShadow: `0 0 10px ${accentColor}`,
                          }}
                        />
                      ) : null}
                    </div>
                    <p
                      style={{
                        fontSize: '0.86rem',
                        lineHeight: 1.55,
                        color: textMuted,
                        margin: 0,
                      }}
                    >
                      {st.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
