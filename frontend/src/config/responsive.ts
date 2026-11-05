/**
 * Lotus Capital — Responsive Breakpoint & Layout Configuration
 * Single source of truth for breakpoints, fluid typography, container widths,
 * header heights, and component responsive behavior.
 */

export const BREAKPOINTS = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

export interface LayoutConfig {
  pinnedTimelinesMinWidth: number;
  dotNavigatorMinWidth: number;
  marqueeRowsMobile: number;
  marqueeRowsDesktop: number;
  bentoColumns: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  headerHeights: {
    desktop: { initial: number; scrolled: number };
    tablet: { initial: number; scrolled: number };
    mobile: { initial: number; scrolled: number };
  };
  containerMaxWidth: number;
  containerPadding: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };
  typography: {
    display: string;
    display2xl: string;
    h1: string;
    h2: string;
    bodyMobile: string;
    bodyDesktop: string;
    legal: string;
  };
  minTouchTargetSize: number;
  minFormFieldHeight: number;
}

export const responsiveConfig: LayoutConfig = {
  pinnedTimelinesMinWidth: BREAKPOINTS.lg, // 1024px: below this, timelines stack vertically without sticky 300-400vh
  dotNavigatorMinWidth: BREAKPOINTS.lg, // 1024px: dot navigator only on desktop
  marqueeRowsMobile: 1,
  marqueeRowsDesktop: 2,
  bentoColumns: {
    xs: 1,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 3,
  },
  headerHeights: {
    desktop: { initial: 96, scrolled: 76 },
    tablet: { initial: 72, scrolled: 64 },
    mobile: { initial: 64, scrolled: 56 },
  },
  containerMaxWidth: 1240,
  containerPadding: {
    xs: 20,
    sm: 24,
    md: 32,
    lg: 48,
  },
  typography: {
    display: 'clamp(2.25rem, 6vw + 1rem, 4.5rem)',
    display2xl: 'clamp(2.5rem, 6vw + 1rem, 5rem)',
    h1: 'clamp(2rem, 4vw + 0.75rem, 3.25rem)',
    h2: 'clamp(1.625rem, 2.5vw + 0.75rem, 2.5rem)',
    bodyMobile: '16px',
    bodyDesktop: '17px',
    legal: '13px',
  },
  minTouchTargetSize: 44, // 44x44px minimum touch targets
  minFormFieldHeight: 52, // 52px tall form fields
};

