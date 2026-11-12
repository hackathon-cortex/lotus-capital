import { useState, useEffect } from 'react';

/**
 * useCountUp Hook (Animation A12)
 * Smoothly animates a numeric value from 0 to the target number once when mounted.
 * Uses ease-out cubic deceleration over 1600ms per Design.md section 12.
 * Instantly renders final value if prefers-reduced-motion is active.
 */
export function useCountUp(targetNumber: number, duration: number = 1600): number {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const isReduced =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
    if (isReduced || !targetNumber || targetNumber <= 0) {
      setCount(targetNumber);
      return;
    }

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Soft cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(targetNumber * eased));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(targetNumber);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetNumber, duration]);

  return count;
}
