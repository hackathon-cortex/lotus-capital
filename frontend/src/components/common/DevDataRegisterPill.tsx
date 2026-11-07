import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContactDrawer } from '../../context/ContactDrawerContext';

/**
 * DevDataRegisterPill
 * Fixed bottom-left floating pill linking to /dev/data-register.
 * Strictly renders only in local development mode (import.meta.env.DEV).
 * Excluded/tree-shaken in production builds.
 * 16px safe offset from bottom-left; height 28px; opacity 70%;
 * hides when drawer/modal is open or when site footer is in view.
 */
export const DevDataRegisterPill: React.FC = () => {
  const { isOpen: isDrawerOpen } = useContactDrawer();
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          setIsFooterVisible(entry.isIntersecting);
        },
        { threshold: 0.02 }
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
  }, []);

  const isHidden = isFooterVisible || isDrawerOpen;

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <aside
      aria-label="Development Navigation"
      className="dev-floating-pill-container"
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        zIndex: 9999,
        opacity: isHidden ? 0 : isHovered ? 1 : 0.7,
        pointerEvents: isHidden ? 'none' : 'auto',
        transition: 'opacity 200ms ease, transform 200ms ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to="/dev/data-register"
        className="dev-floating-pill"
        data-testid="dev-data-register-pill"
        style={{
          backgroundColor: '#0A2540',
          color: '#F8FAFC',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          borderRadius: '9999px',
          height: '28px',
          padding: '0 10px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono, monospace)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(10, 37, 64, 0.35)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.15s ease',
        }}
        title="Development Data Register (/dev/data-register)"
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            boxShadow: '0 0 6px rgba(16, 185, 129, 0.7)',
          }}
        />
        <span>DEV</span>
      </Link>
    </aside>
  );
};
