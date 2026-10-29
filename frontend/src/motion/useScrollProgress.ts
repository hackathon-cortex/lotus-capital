import { useState, useEffect, RefObject } from 'react';

/**
 * useScrollProgress Hook
 * Measures scroll progress (0.0 to 1.0) of a target element across viewport.
 * Disabled on viewports < 768px or when prefers-reduced-motion is true.
 */
export function useScrollProgress(ref: RefObject<HTMLElement>): number {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isReduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isMobile = window.innerWidth < 768;

    if (isReduced || isMobile) {
      setProgress(1);
      return;
    }

    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start when element top hits bottom of window
      // Finish when element top reaches top 20% of window
      const start = windowHeight;
      const end = windowHeight * 0.2;

      const current = rect.top;
      if (current >= start) {
        setProgress(0);
      } else if (current <= end) {
        setProgress(1);
      } else {
        const p = (start - current) / (start - end);
        setProgress(Math.max(0, Math.min(1, p)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref]);

  return progress;
}

