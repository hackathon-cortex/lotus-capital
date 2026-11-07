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
  const [isEnquiryVisible, setIsEnquiryVisible] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
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

  // Keyboard open detection via visualViewport
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const handleViewportResize = () => {
      const vv = window.visualViewport;
      if (!vv) return;
      setIsKeyboardOpen(vv.height < window.innerHeight * 0.75);
    };
    window.visualViewport.addEventListener('resize', handleViewportResize);
    return () => window.visualViewport?.removeEventListener('resize', handleViewportResize);
  }, []);

  // Monitor scroll to reveal after hero scrolls out (~380px)
  useEffect(() => {
    const handleScroll = () => {
      setIsPastHero(window.scrollY > 360);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Monitor footer and enquiry visibility via IntersectionObserver
  useEffect(() => {
    const footer = document.querySelector('footer');
    const enquiry = document.querySelector('#enquiry, .enquiry-panel-section');

    if (typeof IntersectionObserver !== 'undefined') {
      const observers: IntersectionObserver[] = [];

      if (footer) {
        const footerObs = new IntersectionObserver(
          (entries) => {
            setIsFooterVisible(entries[0].isIntersecting);
          },
          { threshold: 0.05 }
        );
        footerObs.observe(footer);
        observers.push(footerObs);
      }

      if (enquiry) {
        const enquiryObs = new IntersectionObserver(
          (entries) => {
            setIsEnquiryVisible(entries[0].isIntersecting);
          },
          { threshold: 0.1 }
        );
        enquiryObs.observe(enquiry);
        observers.push(enquiryObs);
      }

      return () => observers.forEach((obs) => obs.disconnect());
    }
  }, [location.pathname]);

  // Do not render on non-public routes (e.g. /admin)
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const isVisible =
    isPastHero &&
    !isFooterVisible &&
    !isEnquiryVisible &&
    !isDrawerOpen &&
    !isMenuOpen &&
    !isKeyboardOpen;

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
