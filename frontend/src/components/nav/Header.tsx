import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LotusLogo } from '../common/LotusLogo';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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
  }, [location.pathname]);

  // Handle ESC key for mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

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
  const advisorCtaLink = currentService
    ? `/contact-us?service=${currentService}`
    : '/contact-us';

  const isServicesActive =
    location.pathname.startsWith('/services') ||
    location.pathname.startsWith('/investments');

  // Hero pages where header sits over photo initially
  const isHeroPage =
    location.pathname === '/' ||
    location.pathname.startsWith('/services') ||
    location.pathname.startsWith('/investments') ||
    location.pathname === '/about-us';

  const headerClass = scrolled
    ? 'header--scrolled'
    : isHeroPage
      ? 'header--over-photo'
      : 'header--solid';

  return (
    <header className={`header ${headerClass}`} role="banner">
      <div className="container header__inner">
        <Link to="/" className="header__logo-link" aria-label="Lotus Capital Home">
          <div className="header__logo-container">
            <LotusLogo variant="light" height={scrolled ? 50 : 58} width="auto" />
          </div>
        </Link>

        {/* Desktop Navigation - nowrap, collapsed under 1100px */}
        <nav className="header__nav" aria-label="Main Navigation">
          <Link
            to="/"
            className="nav-link"
            aria-current={location.pathname === '/' ? 'page' : undefined}
          >
            Home
          </Link>
          <Link
            to="/about-us"
            className="nav-link"
            aria-current={location.pathname === '/about-us' ? 'page' : undefined}
          >
            About Us
          </Link>

          {/* Services Dropdown */}
          <div className="dropdown">
            <span
              className="nav-link"
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
                aria-current={
                  location.pathname === '/services/general-insurance' ? 'page' : undefined
                }
              >
                General Insurance
              </Link>
              <Link
                to="/services/life-insurance"
                className="dropdown-item"
                role="menuitem"
                aria-current={
                  location.pathname === '/services/life-insurance' ? 'page' : undefined
                }
              >
                Life Insurance
              </Link>
              <Link
                to="/services/health-insurance"
                className="dropdown-item"
                role="menuitem"
                aria-current={
                  location.pathname === '/services/health-insurance' ? 'page' : undefined
                }
              >
                Health Insurance
              </Link>
              <Link
                to="/investments/other-solutions"
                className="dropdown-item"
                role="menuitem"
                aria-current={
                  location.pathname === '/investments/other-solutions' ? 'page' : undefined
                }
              >
                More Solutions
              </Link>
              <div style={{ borderTop: '1px solid var(--silver-300)', margin: '0.25rem 0' }}></div>
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

          <Link
            to="/investments/mutual-funds"
            className="nav-link"
            aria-current={
              location.pathname === '/investments/mutual-funds' ? 'page' : undefined
            }
          >
            Mutual Funds
          </Link>
          <Link
            to="/investments/equity"
            className="nav-link"
            aria-current={location.pathname === '/investments/equity' ? 'page' : undefined}
          >
            Equity
          </Link>
          <Link
            to="/insights"
            className="nav-link"
            aria-current={location.pathname.startsWith('/insights') ? 'page' : undefined}
          >
            Insights
          </Link>
          <Link
            to="/contact-us"
            className="nav-link"
            aria-current={location.pathname === '/contact-us' ? 'page' : undefined}
          >
            Contact Us
          </Link>

          <Link
            to={advisorCtaLink}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1.15rem', whiteSpace: 'nowrap' }}
          >
            Talk to an Advisor
          </Link>
        </nav>

        {/* Mobile menu toggle (Visible below 1100px) */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer"
          style={{
            position: 'fixed',
            top: scrolled ? 'var(--header-h-scrolled)' : 'var(--header-h)',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--navy-950)',
            padding: '2rem 1.5rem',
            overflowY: 'auto',
            borderTop: '1px solid rgba(215, 217, 220, 0.15)',
            zIndex: 999,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Link to="/" className="nav-link" style={{ fontSize: '1.1rem' }}>
              Home
            </Link>
            <Link to="/about-us" className="nav-link" style={{ fontSize: '1.1rem' }}>
              About Us
            </Link>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem' }}>
              <span style={{ color: 'var(--silver-500)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Services
              </span>
              <div style={{ paddingLeft: '0.5rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <Link to="/services/general-insurance" className="nav-link" style={{ fontSize: '0.95rem', color: 'var(--silver-300)' }}>
                  General Insurance
                </Link>
                <Link to="/services/life-insurance" className="nav-link" style={{ fontSize: '0.95rem', color: 'var(--silver-300)' }}>
                  Life Insurance
                </Link>
                <Link to="/services/health-insurance" className="nav-link" style={{ fontSize: '0.95rem', color: 'var(--silver-300)' }}>
                  Health Insurance
                </Link>
                <Link to="/investments/other-solutions" className="nav-link" style={{ fontSize: '0.95rem', color: 'var(--silver-300)' }}>
                  More Solutions
                </Link>
                <Link to="/services" className="nav-link" style={{ fontSize: '0.95rem', color: 'var(--silver-300)' }}>
                  All Services
                </Link>
              </div>
            </div>

            <Link to="/investments/mutual-funds" className="nav-link" style={{ fontSize: '1.1rem' }}>
              Mutual Funds
            </Link>
            <Link to="/investments/equity" className="nav-link" style={{ fontSize: '1.1rem' }}>
              Equity
            </Link>
            <Link to="/insights" className="nav-link" style={{ fontSize: '1.1rem' }}>
              Insights
            </Link>
            <Link to="/contact-us" className="nav-link" style={{ fontSize: '1.1rem' }}>
              Contact Us
            </Link>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Link to={advisorCtaLink} className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                Talk to an Advisor
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
