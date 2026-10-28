import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle scroll state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    location.pathname === '/investments/other-solutions';

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`} role="banner">
      <div className="container header__inner">
        <Link to="/" className="header__logo-link" aria-label="Lotus Capital Home">
          <img
            src="/assets/lotus_capital_logo_traced.svg"
            alt="Lotus Capital Logo"
            className="header__logo"
          />
          <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--navy-900)' }}>
            Lotus Capital
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header__nav" aria-label="Main Navigation" style={{ display: 'flex' }}>
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

          {import.meta.env.DEV && (
            <Link
              to="/dev/data-register"
              className="badge badge-warning"
              style={{ textDecoration: 'none' }}
              title="Dev View: All statistics, registrations and data discrepancies"
            >
              Dev Register
            </Link>
          )}

          <Link to={advisorCtaLink} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
            Talk to an Advisor
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="btn btn-secondary mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          style={{ display: 'none' }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer"
          style={{
            position: 'fixed',
            top: 'var(--header-h)',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--white)',
            padding: '1.5rem',
            overflowY: 'auto',
            borderTop: '1px solid var(--silver-300)',
            zIndex: 999,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about-us" className="nav-link">About Us</Link>
            <div>
              <strong style={{ color: 'var(--navy-900)' }}>Services</strong>
              <div style={{ paddingLeft: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/services/general-insurance">General Insurance</Link>
                <Link to="/services/life-insurance">Life Insurance</Link>
                <Link to="/services/health-insurance">Health Insurance</Link>
                <Link to="/investments/other-solutions">More Solutions</Link>
                <Link to="/services">All Services</Link>
              </div>
            </div>
            <Link to="/investments/mutual-funds" className="nav-link">Mutual Funds</Link>
            <Link to="/investments/equity" className="nav-link">Equity</Link>
            <Link to="/insights" className="nav-link">Insights</Link>
            <Link to="/contact-us" className="nav-link">Contact Us</Link>

            {import.meta.env.DEV && (
              <Link to="/dev/data-register" className="badge badge-warning">
                Dev Register
              </Link>
            )}

            <div style={{ marginTop: '1.5rem' }}>
              <Link to={advisorCtaLink} className="btn btn-primary" style={{ width: '100%' }}>
                Talk to an Advisor
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

