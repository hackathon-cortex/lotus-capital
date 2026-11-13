import React from 'react';

export interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'mark';
  height?: number | string;
  width?: number | string;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}

/**
 * BrandLogo: Enterprise cross-browser and iOS Safari resilient logo component.
 * - Renders dedicated, un-recolored SVG/PNG assets with explicit dimensions.
 * - Prevents Safari flex collapse and intrinsic canvas blowouts.
 * - Employs container layout isolation (contain: layout paint).
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  height = 54,
  width = 190,
  className = '',
  priority = true,
  style = {},
}) => {
  const isMark = variant === 'mark';
  const logoSrc = `/images/logo/${variant}.svg`;
  const logoAlt = isMark
    ? 'Lotus Capital Emblem'
    : 'Lotus Capital — Partnering Wealth Creation';

  // Proportional aspect ratio calculations
  const intrinsicW = isMark ? 250 : 725;
  const intrinsicH = isMark ? 250 : 405;
  const renderWidth = typeof width === 'number' ? width : isMark ? 54 : 190;
  const renderHeight = typeof height === 'number' ? height : 54;

  return (
    <div
      className={`brand-logo-container brand-logo--${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '0 0 auto',
        minWidth: 0,
        overflow: 'hidden',
        contain: 'layout paint',
        ...style,
      }}
    >
      <picture style={{ display: 'block', flex: '0 0 auto', lineHeight: 0 }}>
        {/* Modern Vector Asset with explicit layout sizing */}
        <source type="image/svg+xml" srcSet={logoSrc} />
        <img
          src={logoSrc}
          alt={logoAlt}
          width={renderWidth}
          height={renderHeight}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          style={{
            display: 'block',
            width: 'auto',
            height: typeof height === 'number' ? `${height}px` : height,
            maxWidth: 'min(190px, 46vw)',
            maxHeight: '100%',
            aspectRatio: `${intrinsicW} / ${intrinsicH}`,
            objectFit: 'contain',
            flex: '0 0 auto',
          }}
          onError={(e) => {
            // Graceful fallback to root svg if subpath failed
            const target = e.currentTarget;
            if (!target.dataset.fallbackApplied) {
              target.dataset.fallbackApplied = 'true';
              target.src = '/assets/lotus_capital_logo_traced.svg';
            }
          }}
        />
      </picture>
    </div>
  );
};

export default BrandLogo;
