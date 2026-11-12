import { useState, useEffect, useCallback } from 'react';
import { BREAKPOINTS, BreakpointKey } from '../config/responsive';

export interface BreakpointState {
  breakpoint: BreakpointKey;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  width: number;
  isAtLeast: (key: BreakpointKey) => boolean;
  isBelow: (key: BreakpointKey) => boolean;
}

function getBreakpoint(width: number): BreakpointKey {
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

/**
 * useBreakpoint hook
 * Provides reactive breakpoint classification and responsive flags based on
 * the single source of truth in src/config/responsive.ts.
 */
export function useBreakpoint(): BreakpointState {
  const [width, setWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1440;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: number | null = null;
    const handleResize = () => {
      // Debounce slightly to prevent thrashing
      if (timeoutId !== null) {
        window.cancelAnimationFrame(timeoutId);
      }
      timeoutId = window.requestAnimationFrame(() => {
        setWidth(window.innerWidth);
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId !== null) {
        window.cancelAnimationFrame(timeoutId);
      }
    };
  }, []);

  const currentBreakpoint = getBreakpoint(width);

  const isAtLeast = useCallback(
    (key: BreakpointKey) => {
      return width >= BREAKPOINTS[key];
    },
    [width]
  );

  const isBelow = useCallback(
    (key: BreakpointKey) => {
      return width < BREAKPOINTS[key];
    },
    [width]
  );

  return {
    breakpoint: currentBreakpoint,
    isMobile: width < BREAKPOINTS.md, // < 768px
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg, // 768px - 1023px
    isDesktop: width >= BREAKPOINTS.lg, // >= 1024px
    isWide: width >= BREAKPOINTS['2xl'], // >= 1536px
    width,
    isAtLeast,
    isBelow,
  };
}

