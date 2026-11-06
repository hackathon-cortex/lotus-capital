import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS, NavItemConfig, getActiveNavItem } from '../../config/navigation';

export interface NavTrackProps {
  onServicesTriggerHover: (hovering: boolean) => void;
  onServicesTriggerClick: () => void;
  isMegaMenuOpen: boolean;
  onOpenContactDrawer: (e: React.MouseEvent<HTMLButtonElement>) => void;
  servicesTriggerRef: React.RefObject<HTMLButtonElement>;
}

interface PillGeometry {
  left: number;
  top: number;
  width: number;
  height: number;
  visible: boolean;
}

export const NavTrack: React.FC<NavTrackProps> = ({
  onServicesTriggerHover,
  onServicesTriggerClick,
  isMegaMenuOpen,
  onOpenContactDrawer,
  servicesTriggerRef,
}) => {
  const location = useLocation();
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Determine active item from location.pathname (hash changes do NOT affect active item)
  const activeItem = getActiveNavItem(location.pathname);
  const activeKey = activeItem ? activeItem.id : null;

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [pillStyle, setPillStyle] = useState<PillGeometry>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    visible: false,
  });

  const isFirstPaint = useRef(true);
  const activeTargetKey = hoveredKey || activeKey;

  // Measure an element's bounding rect relative to track
  const measureTarget = useCallback((key: string | null): PillGeometry | null => {
    if (!key || !trackRef.current) return null;
    const targetEl = itemRefs.current.get(key);
    if (!targetEl) return null;

    const trackRect = trackRef.current.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    return {
      left: targetRect.left - trackRect.left,
      top: targetRect.top - trackRect.top,
      width: targetRect.width,
      height: targetRect.height,
      visible: true,
    };
  }, []);

  // Update pill position
  const syncPill = useCallback(
    (key: string | null, immediate = false) => {
      const geo = measureTarget(key);
      if (geo) {
        if (immediate) {
          isFirstPaint.current = true;
        }
        setPillStyle(geo);
        if (immediate) {
          requestAnimationFrame(() => {
            isFirstPaint.current = false;
          });
        }
      } else {
        setPillStyle((prev) => ({ ...prev, visible: false }));
      }
    },
    [measureTarget]
  );

  // Sync on mount and route change
  useEffect(() => {
    syncPill(activeTargetKey, isFirstPaint.current);
  }, [activeTargetKey, location.pathname, syncPill]);

  // Re-measure on window resize and track size changes (ResizeObserver)
  useEffect(() => {
    if (!trackRef.current || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      // Keep pill glued to current target without sweeping
      syncPill(hoveredKey || activeKey, true);
    });

    observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, [hoveredKey, activeKey, syncPill]);

  // Re-measure after document.fonts.ready
  useEffect(() => {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        syncPill(hoveredKey || activeKey, true);
      });
    }
  }, [hoveredKey, activeKey, syncPill]);

  // Pointer enter / leave track handlers
  const handleItemPointerEnter = (item: NavItemConfig) => {
    // Only apply hover pill on devices supporting hover & fine pointer
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setHoveredKey(item.id);
      if (item.id === 'services') {
        onServicesTriggerHover(true);
      } else {
        onServicesTriggerHover(false);
      }
    }
  };

  const handleTrackPointerLeave = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setHoveredKey(null);
      onServicesTriggerHover(false);
    }
  };

  const registerRef = (id: string, el: HTMLElement | null) => {
    if (el) {
      itemRefs.current.set(id, el);
    } else {
      itemRefs.current.delete(id);
    }
  };

  return (
    <nav
      className="header__nav nav-track-container"
      aria-label="Main Navigation"
      style={{ gap: '32px' }}
    >
      <div
        ref={trackRef}
        className="nav-track"
        onPointerLeave={handleTrackPointerLeave}
      >
        {/* Sliding Pill Indicator */}
        <div
          className="nav-track__pill"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: `${pillStyle.top}px`,
            left: 0,
            transform: `translateX(${pillStyle.left}px)`,
            width: `${pillStyle.width}px`,
            height: `${pillStyle.height}px`,
            opacity: pillStyle.visible ? 1 : 0,
            transition: isFirstPaint.current
              ? 'none'
              : 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1), width 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease',
            pointerEvents: 'none',
          }}
        />

        {/* 7 Nav Items */}
        {NAV_ITEMS.map((item) => {
          const isActive = activeKey === item.id;
          const isExact = location.pathname === item.path;

          // Services Trigger Button
          if (item.isTrigger) {
            return (
              <div
                key={item.id}
                ref={(el) => registerRef(item.id, el)}
                className="nav-track__item-wrapper dropdown"
                onPointerEnter={() => handleItemPointerEnter(item)}
              >
                <button
                  ref={servicesTriggerRef}
                  type="button"
                  onClick={onServicesTriggerClick}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onServicesTriggerClick();
                    }
                  }}
                  className={`nav-link-item nav-link-item--header nav-track__link ${
                    isActive ? 'is-active' : ''
                  }`}
                  aria-haspopup="true"
                  aria-expanded={isMegaMenuOpen}
                  aria-current={isActive ? 'page' : undefined}
                  data-active={isActive ? 'true' : undefined}
                >
                  <span className="nav-link__label">
                    <span>{item.label}</span>
                    <span
                      className="nav-link__chevron"
                      aria-hidden="true"
                      style={{
                        display: 'inline-block',
                        marginLeft: '4px',
                        transform: isMegaMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 200ms ease',
                      }}
                    >
                      ▾
                    </span>
                    {isActive && <span className="nav-link__active-dot" aria-hidden="true" />}
                  </span>
                </button>
              </div>
            );
          }

          // Contact Us Drawer Trigger Button
          if (item.isDrawerTrigger) {
            return (
              <div
                key={item.id}
                ref={(el) => registerRef(item.id, el)}
                className="nav-track__item-wrapper"
                onPointerEnter={() => handleItemPointerEnter(item)}
              >
                <button
                  type="button"
                  onClick={onOpenContactDrawer}
                  className={`nav-link-item nav-link-item--header nav-track__link ${
                    isActive ? 'is-active' : ''
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  data-active={isActive ? 'true' : undefined}
                >
                  <span className="nav-link__label">
                    <span>{item.label}</span>
                    {isActive && <span className="nav-link__active-dot" aria-hidden="true" />}
                  </span>
                </button>
              </div>
            );
          }

          // Standard Route Link
          return (
            <div
              key={item.id}
              ref={(el) => registerRef(item.id, el)}
              className="nav-track__item-wrapper"
              onPointerEnter={() => handleItemPointerEnter(item)}
            >
              <Link
                to={item.path}
                className={`nav-link-item nav-link-item--header nav-track__link ${
                  isActive ? 'is-active' : ''
                }`}
                aria-current={isExact ? 'page' : undefined}
                data-active={isActive ? 'true' : undefined}
              >
                <span className="nav-link__label">
                  <span>{item.label}</span>
                  {isActive && <span className="nav-link__active-dot" aria-hidden="true" />}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
