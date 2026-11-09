import React, { useEffect, useRef } from 'react';
import { useContactDrawer } from '../../context/ContactDrawerContext';
import { EnquiryPanel, SupportedService } from '../enquiry/EnquiryPanel';

export const ContactDrawer: React.FC = () => {
  const { isOpen, preselectedService, closeContactDrawer } = useContactDrawer();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll and set up Esc / focus trap
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 80);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeContactDrawer();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(focusTimer);
    };
  }, [isOpen, closeContactDrawer]);

  if (!isOpen) return null;

  const validService: SupportedService =
    preselectedService &&
    ['general-insurance', 'life-insurance', 'health-insurance', 'mutual-funds', 'equity', 'other-solutions'].includes(
      preselectedService
    )
      ? (preselectedService as SupportedService)
      : 'general-insurance';

  const showServiceSelector = !preselectedService;

  return (
    <div
      className="contact-drawer-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeContactDrawer();
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 37, 64, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'backdropFadeIn 320ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      {/* Sliding Sheet */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-drawer-title"
        className="contact-drawer-sheet"
        style={{
          width: 'min(480px, 100vw)',
          height: '100%',
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: '32px',
          borderBottomLeftRadius: '32px',
          boxShadow: '-12px 0 48px rgba(10, 37, 64, 0.22)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflowY: 'auto',
          animation: 'sheetSlideIn 320ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Mobile Drag Handle */}
        <div
          className="contact-drawer-drag-handle"
          style={{
            display: 'none',
            justifyContent: 'center',
            paddingTop: '0.75rem',
            paddingBottom: '0.25rem',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '5px',
              borderRadius: '3px',
              backgroundColor: 'var(--silver-400, #94a3b8)',
            }}
          />
        </div>

        {/* Top Header Row with Close Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem 0.75rem',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--navy-700, #123D67)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--red-500, #D9232D)',
              }}
            />
            DIRECT ADVISORY • GODHRA
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeContactDrawer}
            aria-label="Close contact drawer"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--navy-900, #0a2540)',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Drawer Body */}
        <div
          style={{
            padding: '1.5rem 1.75rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            flex: 1,
          }}
        >
          {/* Headline & Lead from 12-contact-us.md */}
          <div>
            <h2
              id="contact-drawer-title"
              style={{
                fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                fontSize: '1.65rem',
                lineHeight: 1.25,
                fontWeight: 600,
                color: 'var(--navy-900, #0A2540)',
                marginBottom: '0.45rem',
              }}
            >
              Tell us what you would like to <em style={{ fontStyle: 'italic', color: 'var(--navy-800, #123D67)' }}>explore.</em>
            </h2>

            <p style={{ fontSize: '0.86rem', color: 'var(--silver-700, #475569)', lineHeight: 1.5, margin: 0 }}>
              Share a few details and the Lotus Capital team will follow up to clarify the service you need and explain the next steps.
            </p>
          </div>

          {/* Compact Single-Viewport Enquiry Panel */}
          <div style={{ marginTop: '0.25rem' }}>
            <EnquiryPanel
              variant="compact"
              defaultService={validService}
              showServiceSelector={showServiceSelector}
            />
          </div>

          {/* Security Footer Line */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '0.85rem',
              borderTop: '1px solid #f1f5f9',
              textAlign: 'center',
              fontSize: '0.75rem',
              color: 'var(--silver-500, #94a3b8)',
            }}
          >
            Please do not share passwords, OTPs or account details.
          </div>
        </div>
      </div>
    </div>
  );
};

