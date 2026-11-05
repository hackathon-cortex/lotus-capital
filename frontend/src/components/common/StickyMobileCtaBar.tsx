import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useContactDrawer } from '../../context/ContactDrawerContext';

export interface StickyMobileCtaBarProps {
  isMenuOpen?: boolean;
}

/**
 * StickyMobileCtaBar
 * 56px tall red "Talk to an Advisor" CTA bar pinned to the bottom on mobile (< 768px).
 * - Appears after the hero section scrolls out of view.
 * - Hides when the footer is in view.
 * - Hides while the ContactDrawer or mobile menu is open.
 * - Respects safe area insets (env(safe-area-inset-bottom)).
 */
export const StickyMobileCtaBar: React.FC<StickyMobileCtaBarProps> = ({ isMenuOpen = false }) => {
  const { isOpen: isDrawerOpen, openContactDrawer } = useContactDrawer();
  const [isPastHero, setIsPastHero] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const location = useLocation();

  // Determine current service slug from path
  const getServiceSlug = (pathname: string): string | undefined => {
    if (pathname.includes('general-insurance')) return 'general-insurance';
    if (pathname.includes('life-insurance')) return 'life-insurance';
    if (pathname.includes('health-insurance')) return 'health-insurance';
    if (pathname.includes('mutual-funds')) return 'mutual-funds';
    if (pathname.includes('equity')) return 'equity';
    if (pathname.includes('other-solutions')) return 'other-solutions';
    return undefined;
  };

  const currentService = getServiceSlug(location.pathname);

  // Monitor scroll to reveal after hero scrolls out (~380px)
  useEffect(() => {
    const handleScroll = () => {
      setIsPastHero(window.scrollY > 360);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Monitor footer visibility via IntersectionObserver
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          setIsFooterVisible(entry.isIntersecting);
        },
        { threshold: 0.05 }
      );
      observer.observe(footer);
      return () => observer.disconnect();
    } else {
      const checkFooter = () => {
        const rect = footer.getBoundingClientRect();
        setIsFooterVisible(rect.top < window.innerHeight);
      };
      window.addEventListener('scroll', checkFooter, { passive: true });
      checkFooter();
      return () => window.removeEventListener('scroll', checkFooter);
    }
  }, [location.pathname]);

  // Do not render on non-public routes (e.g. /admin)
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const isVisible = isPastHero && !isFooterVisible && !isDrawerOpen && !isMenuOpen;

  return (
    <div
      className={`sticky-mobile-cta-wrapper ${isVisible ? 'is-visible' : ''}`}
      aria-hidden={!isVisible}
      data-testid="sticky-mobile-cta-bar"
    >
      <div className="sticky-mobile-cta-container">
        <button
          type="button"
          onClick={(e) => openContactDrawer(currentService, e.currentTarget)}
          className="btn btn-primary sticky-mobile-cta-btn"
          aria-label="Talk to an Advisor"
        >
          <span>Talk to an Advisor</span>
          <span style={{ fontSize: '1.1rem', marginLeft: '0.35rem' }}>&rarr;</span>
        </button>
      </div>
    </div>
  );
};
