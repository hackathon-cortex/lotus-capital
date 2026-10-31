import React from 'react';
import { Link } from 'react-router-dom';

/**
 * DevDataRegisterPill
 * Fixed bottom-left floating pill linking to /dev/data-register.
 * Strictly renders only in local development mode (import.meta.env.DEV).
 * Excluded/tree-shaken in production builds.
 */
export const DevDataRegisterPill: React.FC = () => {
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <aside aria-label="Development Navigation">
      <Link
        to="/dev/data-register"
        className="dev-floating-pill"
        data-testid="dev-data-register-pill"
        style={{
          position: 'fixed',
          bottom: '18px',
          left: '18px',
          zIndex: 9999,
          backgroundColor: '#0A2540',
          color: '#F8FAFC',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          borderRadius: '9999px',
          padding: '5px 11px',
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

