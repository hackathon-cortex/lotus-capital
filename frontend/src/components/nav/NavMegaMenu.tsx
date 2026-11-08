import React, { useEffect, useRef, useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES_MENU_ITEMS, ServiceMenuItem } from '../../config/navigation';
import { ServiceNavIcon } from './ServiceNavIcon';

export interface NavMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
  currentPath: string;
}

export const NavMegaMenu: React.FC<NavMegaMenuProps> = ({
  isOpen,
  onClose,
  triggerRef,
  currentPath,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const viewAllRef = useRef<HTMLAnchorElement>(null);
  const [notchLeft, setNotchLeft] = useState<number>(180);
  const menuId = useId();

  // Position the pointer notch aligned to the center of the Services trigger
  useEffect(() => {
    if (!isOpen || !triggerRef.current || !menuRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const centerOffset = triggerRect.left + triggerRect.width / 2 - menuRect.left;
    setNotchLeft(Math.max(24, Math.min(centerOffset, menuRect.width - 24)));
  }, [isOpen, triggerRef]);

  // Handle outside clicks
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      onClose();
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen, onClose, triggerRef]);

  // Handle scroll > 80px closing
  useEffect(() => {
    if (!isOpen) return;
    const startScrollY = window.scrollY;

    const handleScroll = () => {
      if (Math.abs(window.scrollY - startScrollY) > 80) {
        onClose();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen, onClose]);

  // Keyboard navigation inside panel
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      triggerRef.current?.focus();
      return;
    }

    const allFocusable = [
      viewAllRef.current,
      ...itemsRef.current.filter(Boolean),
    ].filter(Boolean) as HTMLAnchorElement[];

    if (allFocusable.length === 0) return;

    const currentIndex = allFocusable.indexOf(document.activeElement as HTMLAnchorElement);

    if (e.key === 'Home') {
      e.preventDefault();
      allFocusable[0]?.focus();
      return;
    }
    if (e.key === 'End') {
      e.preventDefault();
      allFocusable[allFocusable.length - 1]?.focus();
      return;
    }

    // Arrow key navigation (Left column has viewAll (idx 0), Right column has insurance items: indices 1..N)
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (currentIndex === 0 && allFocusable.length > 1) {
        allFocusable[1]?.focus();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (currentIndex > 0) {
        allFocusable[0]?.focus();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentIndex === -1) {
        allFocusable[0]?.focus();
      } else if (currentIndex < allFocusable.length - 1) {
        allFocusable[currentIndex + 1]?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex > 0) {
        allFocusable[currentIndex - 1]?.focus();
      }
    } else if (e.key === 'Tab') {
      // If tabbing off the last item or shift-tabbing off the first, close menu
      if (!e.shiftKey && currentIndex === allFocusable.length - 1) {
        onClose();
      } else if (e.shiftKey && currentIndex === 0) {
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      id={menuId}
      role="region"
      aria-label="Insurance Menu"
      className="nav-megamenu-panel"
      onKeyDown={handleKeyDown}
      style={{
        position: 'absolute',
        top: 'calc(100% + 12px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(calc(100vw - 32px), 740px)',
        zIndex: 1001,
      }}
    >
      {/* Invisible Hover Bridge spanning the gap between trigger and panel */}
      <div
        className="nav-megamenu-hover-bridge"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-16px',
          left: 0,
          right: 0,
          height: '16px',
          background: 'transparent',
        }}
      />

      {/* Pointer Notch aligned to trigger center */}
      <div
        className="nav-megamenu-notch"
        aria-hidden="true"
        style={{
          left: `${notchLeft}px`,
        }}
      />

      {/* Main Glass Content Box (2-part layout) */}
      <div className="nav-megamenu-inner">
        {/* Left Column (~32%): Intro & View All link */}
        <div className="nav-megamenu-left">
          <div className="nav-megamenu-eyebrow">INSURANCE SOLUTIONS</div>
          <p className="nav-megamenu-desc">
            Protection planning across general, life, and health insurance for individuals, families, and businesses in Godhra.
          </p>
          <Link
            ref={viewAllRef}
            to="/services"
            onClick={onClose}
            className="nav-megamenu-all-link"
          >
            <span>Explore insurance options</span>
            <span className="nav-megamenu-arrow" aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* Right Column (Single column list): Three Insurance Practices */}
        <div className="nav-megamenu-grid">
          {SERVICES_MENU_ITEMS.map((service: ServiceMenuItem, idx: number) => {
            const isServiceActive =
              currentPath === service.path || currentPath.startsWith(service.path + '/');

            return (
              <Link
                key={service.slug}
                ref={(el) => (itemsRef.current[idx] = el)}
                to={service.path}
                onClick={onClose}
                className={`nav-megamenu-item ${isServiceActive ? 'is-active' : ''}`}
                aria-current={isServiceActive ? 'page' : undefined}
              >
                {/* Thin red line active/hover indicator */}
                <div className="nav-megamenu-item-line" aria-hidden="true" />

                {/* Navy/Silver Line Icon */}
                <div className="nav-megamenu-item-icon">
                  <ServiceNavIcon slug={service.slug} size={18} />
                </div>

                {/* Service Details */}
                <div className="nav-megamenu-item-text">
                  <div className="nav-megamenu-item-title">
                    <span>{service.title}</span>
                    {isServiceActive && (
                      <span className="nav-megamenu-dot" aria-hidden="true" />
                    )}
                  </div>
                  <div className="nav-megamenu-item-summary">
                    {service.shortDescription}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

