import React from 'react';

export interface HorizontalRailProps {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
  ariaLabel?: string;
  gap?: number | string;
  minItemWidth?: number | string;
  maxItemWidth?: number | string;
  snapAlign?: 'start' | 'center' | 'end';
  style?: React.CSSProperties;
}

/**
 * Shared HorizontalRail Component (Root Cause B)
 * Guarantees mobile cards are NEVER squeezed below 240px.
 * Features:
 * - Touch-friendly horizontal scroll snap (x mandatory)
 * - Safe flex child sizing (flex: 0 0 min(82vw, 320px); min-width: 240px; flex-shrink: 0)
 * - Containment of horizontal overscroll (overscroll-behavior-x: contain)
 * - Preserves symmetric container gutters
 */
export const HorizontalRail: React.FC<HorizontalRailProps> = ({
  children,
  className = '',
  itemClassName = '',
  ariaLabel,
  gap = '16px',
  minItemWidth = '240px',
  maxItemWidth = '320px',
  snapAlign = 'start',
  style = {},
}) => {
  return (
    <div
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      className={`horizontal-rail ${className}`}
      style={{
        display: 'flex',
        gap: typeof gap === 'number' ? `${gap}px` : gap,
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        overscrollBehaviorX: 'contain',
        paddingInline: 'var(--container-pad, clamp(16px, 5vw, 24px))',
        paddingBlock: '0.75rem',
        marginInline: 'calc(-1 * var(--container-pad, clamp(16px, 5vw, 24px)))',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        ...style,
      }}
    >
      {React.Children.map(children, (child, index) => {
        if (!child) return null;
        return (
          <div
            key={index}
            className={`horizontal-rail-item ${itemClassName}`}
            style={{
              flex: `0 0 min(82vw, ${maxItemWidth})`,
              minWidth: typeof minItemWidth === 'number' ? `${minItemWidth}px` : minItemWidth,
              flexShrink: 0,
              scrollSnapAlign: snapAlign,
              minInlineSize: typeof minItemWidth === 'number' ? `${minItemWidth}px` : minItemWidth,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default HorizontalRail;

