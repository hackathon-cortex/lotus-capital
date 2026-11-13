import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS, SERVICES_MENU_ITEMS, ServiceMenuItem, getActiveNavItem } from '../../config/navigation';
import { LotusLogo } from '../common/LotusLogo';
import { BrandLogo } from '../common/BrandLogo';
import { ServiceNavIcon } from './ServiceNavIcon';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  triggerButtonRef?: React.RefObject<HTMLButtonElement>;
  onOpenContactDrawer: (service?: string) => void;
  currentService?: string;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  triggerButtonRef,
  onOpenContactDrawer,
  currentService,
}) => {
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const scrollYRef = useRef<number>(0);

  const activeItem = getActiveNavItem(location.pathname);
  const activeKey = activeItem ? activeItem.id : null;

  // Auto-expand services/insurance accordion if current path is an insurance/service page
  useEffect(() => {
    if (activeKey === 'insurance' || activeKey === 'services') {
      setServicesExpanded(true);
    }
  }, [activeKey]);

  // Close drawer on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Lock body scroll and manage focus trap
  useEffect(() => {
    if (!isOpen) return;

    // Save scroll position and lock body scroll without page jump
    scrollYRef.current = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    // Move initial focus to close button
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 60);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        triggerButtonRef?.current?.focus();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const triggerBtn = triggerButtonRef?.current;

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Restore body scroll position seamlessly
      const savedY = scrollYRef.current;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (typeof window.scrollTo === 'function') {
        window.scrollTo(0, savedY);
      }
      triggerBtn?.focus();
      clearTimeout(timer);
    };
  }, [isOpen, onClose, triggerButtonRef]);

  if (!isOpen) return null;

  const drawerContent = (
    <div className="mobile-drawer-portal">
      {/* Backdrop */}
      <div
        className="mobile-drawer-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Sheet */}
      <div
        ref={drawerRef}
        id="mobile-navigation-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className="mobile-drawer-sheet"
      >
        {/* Faint Lotus Watermark at bottom-right */}
        <div className="mobile-drawer-watermark" aria-hidden="true">
          <LotusLogo variant="watermark" width="100%" height="100%" />
        </div>

        {/* Top Header Row */}
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-brand">
            <BrandLogo variant="light" height={36} width={150} />
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="mobile-drawer-close-btn"
            aria-label="Close navigation menu"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="mobile-drawer-nav" aria-label="Mobile Navigation">
          {NAV_ITEMS.map((item, index) => {
            const isActive = activeKey === item.id;
            const staggerDelay = `${index * 60}ms`;

            if (item.isTrigger) {
              return (
                <div
                  key={item.id}
                  className="mobile-drawer-item-group"
                  style={{ animationDelay: staggerDelay }}
                >
                  <button
                    type="button"
                    onClick={() => setServicesExpanded(!servicesExpanded)}
                    className={`mobile-drawer-link mobile-drawer-accordion-trigger ${
                      isActive ? 'is-active' : ''
                    }`}
                    aria-expanded={servicesExpanded}
                  >
                    <span className="mobile-drawer-label">
                      <span>{item.label}</span>
                      {isActive && <span className="mobile-drawer-dot" aria-hidden="true" />}
                    </span>
                    <span
                      className="mobile-drawer-chevron"
                      aria-hidden="true"
                      style={{
                        transform: servicesExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    >
                      ▾
                    </span>
                  </button>

                  {/* Accordion Content */}
                  {servicesExpanded && (
                    <div className="mobile-drawer-accordion-panel">
                      <Link
                        to="/services"
                        onClick={onClose}
                        className={`mobile-drawer-sublink ${location.pathname === '/services' ? 'is-active' : ''}`}
                      >
                        <div className="mobile-drawer-sublink-icon">
                          <span style={{ fontSize: '14px', lineHeight: 1 }}>&bull;</span>
                        </div>
                        <div className="mobile-drawer-sublink-text">
                          <span className="mobile-drawer-sublink-title">Overview (Insurance)</span>
                        </div>
                      </Link>

                      {SERVICES_MENU_ITEMS.map((service: ServiceMenuItem) => {
                        const isServiceActive =
                          location.pathname === service.path ||
                          location.pathname.startsWith(service.path + '/');

                        return (
                          <Link
                            key={service.slug}
                            to={service.path}
                            onClick={onClose}
                            className={`mobile-drawer-sublink ${isServiceActive ? 'is-active' : ''}`}
                            aria-current={isServiceActive ? 'page' : undefined}
                          >
                            <div className="mobile-drawer-sublink-icon">
                              <ServiceNavIcon slug={service.slug} size={16} />
                            </div>
                            <div className="mobile-drawer-sublink-text">
                              <span className="mobile-drawer-sublink-title">{service.title}</span>
                              <span className="mobile-drawer-sublink-desc">
                                {service.shortDescription}
                              </span>
                            </div>
                            {isServiceActive && (
                              <span className="mobile-drawer-subdot" aria-hidden="true" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            if (item.isDrawerTrigger) {
              return (
                <div
                  key={item.id}
                  className="mobile-drawer-item-group"
                  style={{ animationDelay: staggerDelay }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenContactDrawer();
                    }}
                    className={`mobile-drawer-link ${isActive ? 'is-active' : ''}`}
                  >
                    <span className="mobile-drawer-label">
                      <span>{item.label}</span>
                      {isActive && <span className="mobile-drawer-dot" aria-hidden="true" />}
                    </span>
                    <span className="mobile-drawer-arrow" aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className="mobile-drawer-item-group"
                style={{ animationDelay: staggerDelay }}
              >
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`mobile-drawer-link ${isActive ? 'is-active' : ''}`}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  <span className="mobile-drawer-label">
                    <span>{item.label}</span>
                    {isActive && <span className="mobile-drawer-dot" aria-hidden="true" />}
                  </span>
                  <span className="mobile-drawer-arrow" aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Pinned Bottom Action Zone */}
        <div className="mobile-drawer-footer">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenContactDrawer(currentService);
            }}
            className="mobile-drawer-cta-btn"
          >
            <span>Talk to an Advisor</span>
            <span className="mobile-drawer-cta-arrow" aria-hidden="true">&rarr;</span>
          </button>
          <div className="mobile-drawer-city-tag">
            <span>Godhra, Gujarat</span>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(drawerContent, document.body)
    : drawerContent;
};
