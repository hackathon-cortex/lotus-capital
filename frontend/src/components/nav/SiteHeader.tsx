import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandLogo } from '../common/BrandLogo';
import { useContactDrawer } from '../../context/ContactDrawerContext';
import { getHeaderTone } from '../../config/navigation';
import { NavTrack } from './NavTrack';
import { NavMegaMenu } from './NavMegaMenu';
import { MobileDrawer } from './MobileDrawer';

export interface SiteHeaderProps {
  onMenuToggle?: (isOpen: boolean) => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ onMenuToggle }) => {
  const location = useLocation();
  const { openContactDrawer } = useContactDrawer();

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const servicesTriggerRef = useRef<HTMLButtonElement>(null);
  const lastScrollYRef = useRef(0);
  const openTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const headerTone = getHeaderTone(location.pathname);

  // Determine current service slug for CTA pre-selection
  const getServiceSlug = (pathname: string): string => {
    if (pathname.includes('general-insurance')) return 'general-insurance';
    if (pathname.includes('life-insurance')) return 'life-insurance';
    if (pathname.includes('health-insurance')) return 'health-insurance';
    if (pathname.includes('mutual-funds')) return 'mutual-funds';
    if (pathname.includes('equity')) return 'equity';
    if (pathname.includes('other-solutions')) return 'other-solutions';
    return '';
  };

  const currentService = getServiceSlug(location.pathname);

  // Sync --header-h variable to documentElement for sticky offsets and hero positioning
  const updateHeaderHeightVar = useCallback(() => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    // Height including the 16px top offset on floating desktop or standard mobile height
    const isDesktop = window.innerWidth >= 1024;
    const totalHeight = isDesktop ? Math.round(rect.height + 32) : Math.round(rect.height + 16);
    document.documentElement.style.setProperty('--header-h', `${totalHeight}px`);
  }, []);

  // Update height on mount, resize, and scroll transitions via ResizeObserver and window resize
  useEffect(() => {
    updateHeaderHeightVar();
    window.addEventListener('resize', updateHeaderHeightVar, { passive: true });
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && barRef.current) {
      ro = new ResizeObserver(() => {
        updateHeaderHeightVar();
      });
      ro.observe(barRef.current);
    }
    return () => {
      window.removeEventListener('resize', updateHeaderHeightVar);
      ro?.disconnect();
    };
  }, [updateHeaderHeightVar]);

  // Red progress bar and scroll hysteresis / hide-on-scroll logic
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(currentY / docHeight, 0), 1) : 0;
      setScrollProgress(progress);

      // Hysteresis for condense/expand (condense at 24px, expand below 8px)
      setScrolled((prev) => {
        if (!prev && currentY > 24) return true;
        if (prev && currentY < 8) return false;
        return prev;
      });

      // Hide-on-scroll logic
      const delta = currentY - lastScrollYRef.current;
      const isHeaderFocused = headerRef.current?.contains(document.activeElement);

      if (
        isMegaMenuOpen ||
        isMobileDrawerOpen ||
        isHeaderFocused
      ) {
        // Never hide while interaction is underway
        setHidden(false);
      } else if (currentY > 120 && delta > 8) {
        // Fast scroll down
        setHidden(true);
      } else if (delta < -4 || currentY <= 30) {
        // Scroll up or near top
        setHidden(false);
      }

      lastScrollYRef.current = currentY;
      updateHeaderHeightVar();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMegaMenuOpen, isMobileDrawerOpen, updateHeaderHeightVar]);

  // Route change: close mega menu & mobile drawer
  useEffect(() => {
    setIsMegaMenuOpen(false);
    setIsMobileDrawerOpen(false);
    setHidden(false);
    if (onMenuToggle) onMenuToggle(false);
  }, [location.pathname, onMenuToggle]);

  // MegaMenu hover-intent (120ms open, 220ms close)
  const handleServicesTriggerHover = (hovering: boolean) => {
    if (hovering) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      if (!isMegaMenuOpen && !openTimerRef.current) {
        openTimerRef.current = setTimeout(() => {
          setIsMegaMenuOpen(true);
          openTimerRef.current = null;
        }, 120);
      }
    } else {
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }
      if (isMegaMenuOpen && !closeTimerRef.current) {
        closeTimerRef.current = setTimeout(() => {
          setIsMegaMenuOpen(false);
          closeTimerRef.current = null;
        }, 220);
      }
    }
  };

  const handleServicesTriggerClick = () => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsMegaMenuOpen((prev) => !prev);
  };

  const handleCloseMegaMenu = () => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsMegaMenuOpen(false);
  };

  const toggleMobileDrawer = () => {
    const next = !isMobileDrawerOpen;
    setIsMobileDrawerOpen(next);
    if (onMenuToggle) onMenuToggle(next);
  };

  // Tone and condense classes
  const isSolidTone = headerTone === 'solid';
  const headerContainerClass = [
    'site-header',
    scrolled ? 'site-header--condensed' : '',
    hidden ? 'site-header--hidden' : '',
    isSolidTone ? 'site-header--tone-solid' : 'site-header--tone-hero',
    isMegaMenuOpen ? 'site-header--menu-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {/* 1. Global Red Page Progress Bar (Always visible at the top: 0, z-index 1050) */}
      <div
        className="site-header-progress-track"
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          zIndex: 1050,
          pointerEvents: 'none',
        }}
      >
        <div
          className="site-header-progress-bar"
          style={{
            height: '100%',
            width: `${scrollProgress * 100}%`,
            background: 'var(--red-500, #D9232D)',
            transition: 'width 80ms linear',
          }}
        />
      </div>

      {/* 2. Full-Width Solid / Glass Header Backdrop Layer (A2) */}
      <div
        className={`site-header-backdrop ${scrolled ? 'site-header-backdrop--scrolled' : ''} ${
          isSolidTone ? 'site-header-backdrop--solid' : ''
        } ${hidden ? 'site-header-backdrop--hidden' : ''}`}
        aria-hidden="true"
      />

      {/* 3. Floating Site Header */}
      <header
        ref={headerRef}
        className={headerContainerClass}
        role="banner"
        aria-label="Site Header"
      >
        <div ref={barRef} className="site-header__bar">
          {/* ZONE 1: Brand Logo (Left) */}
          <Link
            to="/"
            className="site-header__logo-link"
            aria-label="Lotus Capital Home"
          >
            <div className="site-header__logo-wrapper">
              <BrandLogo
                variant="light"
                height={scrolled ? 48 : 54}
                width={190}
                className="site-header__logo-img"
              />
            </div>
          </Link>

          {/* ZONE 2: Nav Track with sliding pill & 7 links (Center) */}
          <div className="site-header__track-zone">
            <NavTrack
              onServicesTriggerHover={handleServicesTriggerHover}
              onServicesTriggerClick={handleServicesTriggerClick}
              isMegaMenuOpen={isMegaMenuOpen}
              onOpenContactDrawer={(e) => openContactDrawer(undefined, e.currentTarget)}
              servicesTriggerRef={servicesTriggerRef}
            />

            {/* Services Mega Menu Panel */}
            <div
              onMouseEnter={() => handleServicesTriggerHover(true)}
              onMouseLeave={() => handleServicesTriggerHover(false)}
            >
              <NavMegaMenu
                isOpen={isMegaMenuOpen}
                onClose={handleCloseMegaMenu}
                triggerRef={servicesTriggerRef}
                currentPath={location.pathname}
              />
            </div>
          </div>

          {/* ZONE 3: CTA Button (Right - Desktop) */}
          <div className="site-header__cta-zone">
            <button
              type="button"
              onClick={(e) => openContactDrawer(currentService || undefined, e.currentTarget)}
              className="site-header__cta-btn btn-primary"
            >
              <span className="site-header__cta-text">Talk to an Advisor</span>
              <span className="site-header__cta-arrow" aria-hidden="true">&rarr;</span>
              <span className="site-header__cta-shimmer" aria-hidden="true" />
            </button>
          </div>

          {/* Tablet & Mobile Controls (< 1024px) */}
          <div className="site-header__mobile-controls">
            {/* Compact Red Talk Button */}
            <button
              type="button"
              onClick={(e) => openContactDrawer(currentService || undefined, e.currentTarget)}
              className="site-header__mobile-cta-btn btn-primary"
              aria-label="Talk to an Advisor"
            >
              <span className="site-header__mobile-cta-label-tablet">Talk to an Advisor</span>
              <span className="site-header__mobile-cta-label-mobile">Talk</span>
              <span className="site-header__mobile-cta-arrow" aria-hidden="true">&rarr;</span>
            </button>

            {/* Hamburger / Morphing Close Toggle (44x44 tap target) */}
            <button
              type="button"
              onClick={toggleMobileDrawer}
              className={`site-header__hamburger ${isMobileDrawerOpen ? 'is-open' : ''}`}
              aria-label={isMobileDrawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileDrawerOpen}
              aria-controls="mobile-navigation-sheet"
            >
              <span className="site-header__hamburger-bar" />
              <span className="site-header__hamburger-bar" />
              <span className="site-header__hamburger-bar" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. Mobile Navigation Drawer (Right Sheet) */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => {
          setIsMobileDrawerOpen(false);
          if (onMenuToggle) onMenuToggle(false);
        }}
        onOpenContactDrawer={(svc) => openContactDrawer(svc, undefined)}
        currentService={currentService}
      />
    </>
  );
};

// Backward-compatibility export
export const Header = SiteHeader;
export default SiteHeader;
