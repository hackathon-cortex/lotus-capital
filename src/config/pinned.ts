/**
 * Pinned Stage & Timeline Scroll Configuration (R1)
 * Single source of truth for pinned stages across Home, About, and Service pages.
 */
export const PINNED_CONFIG = {
  headerZIndex: 50,
  stageZIndex: 15, // Stacking strictly below header (z-index <= 20)
  stageMinHeightPx: 480,
  stageMaxHeightPx: 620,
  stageHeightCalc: 'clamp(480px, calc(100svh - var(--header-h, 88px) - 32px), 620px)',
  stageTopOffset: 'calc(var(--header-h, 88px) + 16px)',
  scrollMarginTop: 'calc(var(--header-h, 88px) + 24px)',
  scrollPerStepVh: 45, // 45svh per step
  minExtraScrollVh: 120, // Clamped minimum extra scroll
  maxExtraScrollVh: 260, // Clamped maximum extra scroll
  progressCompleteAtRatio: 0.85, // Progress reaches 1.0 at 85% of scroll range
  finalDwellRatio: 0.15, // Final state dwells for the last 15%
  stepActivationOffset: 0.35, // Step activates earlier at (i + 0.35) / steps
  animationDurationMs: 280, // 240-320ms ease-out
  desktopBreakpointPx: 1024,
};

/**
 * Calculates outer pinned wrapper height in CSS value based on step count.
 */
export function getPinnedOuterHeight(stepsCount: number): string {
  const extraVh = Math.min(
    Math.max(stepsCount * PINNED_CONFIG.scrollPerStepVh, PINNED_CONFIG.minExtraScrollVh),
    PINNED_CONFIG.maxExtraScrollVh
  );
  return `calc(${PINNED_CONFIG.stageHeightCalc} + ${extraVh}svh)`;
}

/**
 * Maps raw scroll progress (0..1) to accelerated progress (0..1)
 * that reaches 1 at 85% and dwells for the last 15%.
 */
export function mapAcceleratedProgress(rawProgress: number): number {
  if (rawProgress <= 0) return 0;
  if (rawProgress >= PINNED_CONFIG.progressCompleteAtRatio) return 1;
  return Math.min(rawProgress / PINNED_CONFIG.progressCompleteAtRatio, 1);
}

/**
 * Computes active step index given progress and total step count,
 * switching each step at (i + 0.35) / steps.
 */
export function getActiveStepIndex(progress: number, stepsCount: number): number {
  if (stepsCount <= 1) return 0;
  let active = 0;
  for (let i = 0; i < stepsCount; i++) {
    const threshold = i === 0 ? 0 : (i - 1 + PINNED_CONFIG.stepActivationOffset) / stepsCount;
    if (progress >= threshold) {
      active = i;
    }
  }
  return Math.min(active, stepsCount - 1);
}

