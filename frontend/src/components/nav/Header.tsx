import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LotusLogo } from '../common/LotusLogo';
import { useContactDrawer } from '../../context/ContactDrawerContext';
import { NavLinkButton } from './NavLinkButton';

export interface HeaderProps {
  onMenuToggle?: (isOpen: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const location = useLocation();
  const { openContactDrawer } = useContactDrawer();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Monitor scroll state (24px threshold)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesExpanded(false);
    if (onMenuToggle) onMenuToggle(false);
  }, [location.pathname, onMenuToggle]);

  // Handle ESC key and focus trap for mobile menu
  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Focus close button initially
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        if (onMenuToggle) onMenuToggle(false);
        return;
      }

      // Simple focus trap
      if (e.key === 'Tab' && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, onMenuToggle]);

  // Determine current service slug for CTA button
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

  const isServicesActive =
    location.pathname.startsWith('/services') ||
    location.pathname.startsWith('/investments');

  // Hero pages where header sits over photo initially
  const isHeroPage =
    location.pathname === '/' ||
    location.pathname.startsWith('/services') ||
    location.pathname.startsWith('/investments') ||
    location.pathname.startsWith('/insights') ||
    location.pathname === '/about-us';

  const headerClass = scrolled
    ? 'header--scrolled'
    : isHeroPage
      ? 'header--over-photo'
      : 'header--solid';

  const toggleMobileMenu = () => {
    const nextState = !mobileMenuOpen;
    setMobileMenuOpen(nextState);
    if (onMenuToggle) onMenuToggle(nextState);
  };

  return (
    <header className={`header ${headerClass}`} role="banner">
      <div className="container header__inner">
        {/* Brand Logo Link */}
        <Link to="/" className="header__logo-link" aria-label="Lotus Capital Home">
          <div className="header__logo-container">
            <LotusLogo variant="light" height={scrolled ? 44 : 54} width="auto" />
          </div>
        </Link>

        {/* Desktop Navigation - Visible at >= 1100px, equal 32px gap, single line never wraps */}
        <nav className="header__nav" aria-label="Main Navigation" style={{ gap: '32px' }}>
          <NavLinkButton to="/" variant="header" isActive={location.pathname === '/'}>
            Home
          </NavLinkButton>
          <NavLinkButton to="/about-us" variant="header" isActive={location.pathname === '/about-us'}>
            About Us
          </NavLinkButton>

          {/* Services Dropdown */}
          <div className="dropdown">
            <span
              className={`nav-link-item nav-link-item--header ${isServicesActive ? 'is-active' : ''}`}
              style={{ cursor: 'pointer' }}
              aria-current={isServicesActive ? 'page' : undefined}
              role="button"
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded="false"
            >
              Services ▾
            </span>
            <div className="dropdown-menu" role="menu">
              <Link
                to="/services/general-insurance"
                className="dropdown-item"
                role="menuitem"
                aria-current={location.pathname === '/services/general-insurance' ? 'page' : undefined}
              >
                General Insurance
              </Link>
              <Link
                to="/services/life-insurance"
                className="dropdown-item"
                role="menuitem"
                aria-current={location.pathname === '/services/life-insurance' ? 'page' : undefined}
              >
                Life Insurance
              </Link>
              <Link
                to="/services/health-insurance"
                className="dropdown-item"
                role="menuitem"
                aria-current={location.pathname === '/services/health-insurance' ? 'page' : undefined}
              >
                Health Insurance
              </Link>
              <Link
                to="/investments/other-solutions"
                className="dropdown-item"
                role="menuitem"
                aria-current={location.pathname === '/investments/other-solutions' ? 'page' : undefined}
              >
                More Solutions
              </Link>
              <div style={{ borderTop: '1px solid var(--silver-300)', margin: '0.25rem 0' }} />
              <Link
                to="/services"
                className="dropdown-item"
                role="menuitem"
                aria-current={location.pathname === '/services' ? 'page' : undefined}
              >
                All Services
              </Link>
            </div>
          </div>

          <NavLinkButton
            to="/investments/mutual-funds"
            variant="header"
            isActive={location.pathname === '/investments/mutual-funds'}
          >
            Mutual Funds
          </NavLinkButton>
          <NavLinkButton
            to="/investments/equity"
            variant="header"
            isActive={location.pathname === '/investments/equity'}
          >
            Equity
          </NavLinkButton>
          <NavLinkButton
            to="/insights"
            variant="header"
            isActive={location.pathname.startsWith('/insights')}
          >
            Insights
          </NavLinkButton>
          <NavLinkButton onClick={(e) => openContactDrawer(undefined, e.currentTarget)} variant="header">
            Contact Us
          </NavLinkButton>

          <button
            type="button"
            onClick={(e) => openContactDrawer(currentService || undefined, e.currentTarget)}
            className="btn btn-primary header__desktop-cta"
            style={{ padding: '0.5rem 1.15rem', whiteSpace: 'nowrap' }}
          >
            Talk to an Advisor
          </button>
        </nav>

        {/* Right Controls Container for Tablet & Mobile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Tablet CTA Button (768px - 1099px): Logo + CTA + Menu Button */}
          <button
            type="button"
            onClick={(e) => openContactDrawer(currentService || undefined, e.currentTarget)}
            className="btn btn-primary header__tablet-cta"
            style={{ padding: '0.45rem 1rem', fontSize: '0.88rem', whiteSpace: 'nowrap' }}
          >
            Talk to an Advisor
          </button>

          {/* Menu button (Visible below 1100px) */}
          <button
            className="mobile-toggle"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-sheet"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Full-Screen Sheet Mobile Menu (Right slide 320ms, items 56px tall) */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-sheet"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="mobile-nav-sheet"
        >
          {/* Top header row of drawer */}
          <div className="mobile-nav-sheet__header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LotusLogo variant="light" height={36} />
              <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.02em' }}>
                Lotus Capital
              </span>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={toggleMobileMenu}
              className="mobile-nav-sheet__close"
              aria-label="Close navigation menu"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links list with 56px items */}
          <div className="mobile-nav-sheet__body">
            <Link to="/" className="mobile-nav-item" onClick={toggleMobileMenu}>
              <span>Home</span>
              <span className="mobile-nav-arrow">&rarr;</span>
            </Link>

            <Link to="/about-us" className="mobile-nav-item" onClick={toggleMobileMenu}>
              <span>About Us</span>
              <span className="mobile-nav-arrow">&rarr;</span>
            </Link>

            {/* Services accordion item */}
            <div className="mobile-nav-accordion">
              <button
                type="button"
                onClick={() => setServicesExpanded(!servicesExpanded)}
                className="mobile-nav-item mobile-nav-accordion__trigger"
                aria-expanded={servicesExpanded}
              >
                <span>Services</span>
                <span style={{ transform: servicesExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}>
                  ▾
                </span>
              </button>

              {servicesExpanded && (
                <div className="mobile-nav-accordion__content">
                  <Link to="/services" className="mobile-subnav-item" onClick={toggleMobileMenu}>
                    Overview (All Services)
                  </Link>
                  <Link to="/services/general-insurance" className="mobile-subnav-item" onClick={toggleMobileMenu}>
                    General Insurance
                  </Link>
                  <Link to="/services/life-insurance" className="mobile-subnav-item" onClick={toggleMobileMenu}>
                    Life Insurance
                  </Link>
                  <Link to="/services/health-insurance" className="mobile-subnav-item" onClick={toggleMobileMenu}>
                    Health Insurance
                  </Link>
                  <Link to="/investments/other-solutions" className="mobile-subnav-item" onClick={toggleMobileMenu}>
                    More Solutions
                  </Link>
                </div>
              )}
            </div>

            <Link to="/investments/mutual-funds" className="mobile-nav-item" onClick={toggleMobileMenu}>
              <span>Mutual Funds</span>
              <span className="mobile-nav-arrow">&rarr;</span>
            </Link>

            <Link to="/investments/equity" className="mobile-nav-item" onClick={toggleMobileMenu}>
              <span>Equity &amp; Derivatives</span>
              <span className="mobile-nav-arrow">&rarr;</span>
            </Link>

            <Link to="/insights" className="mobile-nav-item" onClick={toggleMobileMenu}>
              <span>Insights &amp; Learning</span>
              <span className="mobile-nav-arrow">&rarr;</span>
            </Link>

            <button
              type="button"
              onClick={(e) => {
                toggleMobileMenu();
                openContactDrawer(undefined, e.currentTarget);
              }}
              className="mobile-nav-item mobile-nav-contact-btn"
            >
              <span>Contact Us</span>
              <span className="mobile-nav-arrow">&rarr;</span>
            </button>
          </div>

          {/* Footer action button inside menu */}
          <div className="mobile-nav-sheet__footer">
            <button
              type="button"
              onClick={(e) => {
                toggleMobileMenu();
                openContactDrawer(currentService || undefined, e.currentTarget);
              }}
              className="btn btn-primary mobile-nav-cta-btn"
            >
              <span>Talk to an Advisor</span>
              <span style={{ fontSize: '1.1rem' }}>&rarr;</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
