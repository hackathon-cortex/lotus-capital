import { useState, useEffect } from 'react';

/**
 * useCountUp Hook (Animation A12)
 * Animates a numeric value from 0 to target over duration ms with ease-out cubic deceleration.
 * Renders immediately if reduced motion or test environment.
 */
export function useCountUp(targetNumber: number, duration: number = 1600): number {
  const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
  const [count, setCount] = useState<number>(isTest ? targetNumber : 0);

  useEffect(() => {
    if (isTest || !targetNumber || targetNumber <= 0) {
      setCount(targetNumber);
      return;
    }

    const isReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReduced) {
      setCount(targetNumber);
      return;
    }

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Soft cubic ease-out: 1 - (1 - p)^3
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
  }, [targetNumber, duration, isTest]);

  return count;
}

