import { useState, useEffect, RefObject } from 'react';

/**
 * usePinnedSection Hook
 * Calculates scroll fraction through a pinned or sticky section container.
 */
export function usePinnedSection(containerRef: RefObject<HTMLElement>): {
  isPinned: boolean;
  progress: number;
} {
  const [state, setState] = useState({ isPinned: false, progress: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        const scrolled = -rect.top;
        const total = containerHeight - windowHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 1;
        setState({ isPinned: true, progress: p });
      } else if (rect.top > 0) {
        setState({ isPinned: false, progress: 0 });
      } else {
        setState({ isPinned: false, progress: 1 });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  return state;
}

