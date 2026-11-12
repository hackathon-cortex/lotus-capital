import { useEffect } from 'react';

/**
 * useScrollReveal Hook (Animation A8)
 * Automatically observes all elements with [data-reveal] attribute using IntersectionObserver.
 * When an element enters the viewport (threshold 0.15), it adds the 'is-visible' class once.
 * Respects prefers-reduced-motion by making all elements visible immediately.
 */
export function useScrollReveal() {
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');

    if (isReduced) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });
}
