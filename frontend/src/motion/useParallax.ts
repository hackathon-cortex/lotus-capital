import { useState, useEffect } from 'react';

/**
 * useParallax Hook (Animation A3)
 * Subtle parallax translation on desktop only.
 * Returns pixel translateY offset.
 */
export function useParallax(speed: number = 0.2): number {
  const [offsetY, setOffsetY] = useState<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isReduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isMobile = window.innerWidth < 768;

    if (isReduced || isMobile) {
      setOffsetY(0);
      return;
    }

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setOffsetY(window.scrollY * speed);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offsetY;
}

