import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { BREAKPOINTS, responsiveConfig } from '../src/config/responsive';
import { useBreakpoint } from '../src/hooks/useBreakpoint';
import { useMediaQuery } from '../src/hooks/useMediaQuery';
import layoutData from '../../content/data/layout.json';

describe('Responsive Configuration & Breakpoint Tokens', () => {
  it('defines single-source-of-truth breakpoint tokens matching specifications', () => {
    expect(BREAKPOINTS.xs).toBe(0);
    expect(BREAKPOINTS.sm).toBe(480);
    expect(BREAKPOINTS.md).toBe(768);
    expect(BREAKPOINTS.lg).toBe(1024);
    expect(BREAKPOINTS.xl).toBe(1280);
    expect(BREAKPOINTS['2xl']).toBe(1536);
  });

  it('matches layout.json content data with responsive tokens', () => {
    expect(layoutData.breakpoints.xs).toBe(BREAKPOINTS.xs);
    expect(layoutData.breakpoints.sm).toBe(BREAKPOINTS.sm);
    expect(layoutData.breakpoints.md).toBe(BREAKPOINTS.md);
    expect(layoutData.breakpoints.lg).toBe(BREAKPOINTS.lg);
    expect(layoutData.breakpoints.xl).toBe(BREAKPOINTS.xl);
    expect(layoutData.breakpoints['2xl']).toBe(BREAKPOINTS['2xl']);

    expect(layoutData.container.maxWidth).toBe(1240);
    expect(layoutData.container.paddingInline.xs).toBe(20);
    expect(layoutData.container.paddingInline.sm).toBe(24);
    expect(layoutData.container.paddingInline.md).toBe(32);
    expect(layoutData.container.paddingInline.lg).toBe(48);

    expect(layoutData.behavior.minTouchTargetSize).toBe(44);
    expect(layoutData.behavior.minFormFieldHeight).toBe(52);
    expect(layoutData.behavior.pinnedTimelinesMinWidth).toBe(1024);
  });

  it('provides responsiveConfig with fluid typography and layout rules', () => {
    expect(responsiveConfig.containerMaxWidth).toBe(1240);
    expect(responsiveConfig.minTouchTargetSize).toBeGreaterThanOrEqual(44);
    expect(responsiveConfig.minFormFieldHeight).toBeGreaterThanOrEqual(52);
    expect(responsiveConfig.pinnedTimelinesMinWidth).toBe(1024);
    expect(responsiveConfig.typography.display).toContain('clamp');
    expect(responsiveConfig.typography.h1).toContain('clamp');
    expect(responsiveConfig.typography.h2).toContain('clamp');
  });
});

describe('useBreakpoint Hook', () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  it('identifies mobile viewports (< 768px)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isBelow('md')).toBe(true);
    expect(result.current.isAtLeast('sm')).toBe(false);
  });

  it('identifies tablet viewports (768px - 1023px)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 834,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isAtLeast('md')).toBe(true);
    expect(result.current.isBelow('lg')).toBe(true);
  });

  it('identifies desktop viewports (>= 1024px)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1280,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isAtLeast('lg')).toBe(true);
  });

  it('identifies wide 2xl desktop viewports (>= 1536px)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isWide).toBe(true);
    expect(result.current.breakpoint).toBe('2xl');
    expect(result.current.isAtLeast('2xl')).toBe(true);
  });
});

describe('useMediaQuery Hook', () => {
  it('correctly reports matchMedia state', () => {
    const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('min-width: 1024px'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    window.matchMedia = matchMediaMock;

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(result.current).toBe(true);

    const { result: mobileResult } = renderHook(() => useMediaQuery('(max-width: 600px)'));
    expect(mobileResult.current).toBe(false);
  });
});
