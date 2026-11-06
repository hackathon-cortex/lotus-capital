import React, { useState, useEffect, useRef } from 'react';
import { PINNED_CONFIG, getPinnedOuterHeight, mapAcceleratedProgress } from '../../config/pinned';

export interface PinnedStageProps {
  id?: string;
  ariaLabel: string;
  stepsCount?: number;
  totalHeight?: string; // override if needed
  className?: string;
  style?: React.CSSProperties;
  stageClassName?: string;
  stageStyle?: React.CSSProperties;
  dataTone?: 'dark' | 'light';
  children: (progress: number, isPinned: boolean) => React.ReactNode;
}

export const PinnedStage: React.FC<PinnedStageProps> = ({
  id,
  ariaLabel,
  stepsCount = 4,
  totalHeight,
  className = '',
  style = {},
  stageClassName = '',
  stageStyle = {},
  dataTone,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= PINNED_CONFIG.desktopBreakpointPx : true
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkMotion = () => {
      if (typeof window !== 'undefined' && window.matchMedia) {
        setPrefersReducedMotion(
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
        );
      }
    };
    checkMotion();

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= PINNED_CONFIG.desktopBreakpointPx);
      checkMotion();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isPinned = isDesktop && !prefersReducedMotion;
  const computedOuterHeight = totalHeight || getPinnedOuterHeight(stepsCount);

  useEffect(() => {
    // Support testing/CDP query parameters (?progress=0.5, ?timelineProgress=0.5, ?stepProgress=0.5)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const forcedProgress =
        params.get('progress') ||
        params.get('timelineProgress') ||
        params.get('stepProgress');
      if (forcedProgress !== null) {
        setProgress(Math.min(Math.max(parseFloat(forcedProgress), 0), 1));
        return;
      }
    }

    if (!isPinned) {
      setProgress(1);
      return;
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) {
        setProgress(0);
        return;
      }
      const currentScroll = -rect.top;
      const rawP = Math.min(Math.max(currentScroll / totalScrollable, 0), 1);
      const accelerated = mapAcceleratedProgress(rawP);
      setProgress(accelerated);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPinned]);

  return (
    <section
      id={id}
      ref={containerRef}
      className={`pinned-stage-wrapper ${className}`}
      aria-label={ariaLabel}
      data-tone={dataTone}
      style={{
        position: 'relative',
        minHeight: isPinned ? computedOuterHeight : 'auto',
        overflow: 'clip', // clip ensures no horizontal bleeding without breaking position: sticky!
        scrollMarginTop: PINNED_CONFIG.scrollMarginTop,
        zIndex: PINNED_CONFIG.stageZIndex,
        ...style,
      }}
    >
      <div
        className={`pinned-stage-inner ${stageClassName}`}
        style={{
          position: isPinned ? 'sticky' : 'relative',
          top: isPinned ? PINNED_CONFIG.stageTopOffset : 'auto',
          height: isPinned ? PINNED_CONFIG.stageHeightCalc : 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          overflow: 'clip',
          zIndex: PINNED_CONFIG.stageZIndex,
          ...stageStyle,
        }}
      >
        {children(progress, isPinned)}
      </div>
    </section>
  );
};
