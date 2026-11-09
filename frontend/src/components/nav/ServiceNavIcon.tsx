import React from 'react';

interface ServiceNavIconProps {
  slug: string;
  size?: number;
  className?: string;
  color?: string;
}

/**
 * Clean line icons for the 6 services.
 * Consistent 1.5px stroke, navy/silver styling.
 * Zero emoji, zero multi-color illustration fills.
 */
export const ServiceNavIcon: React.FC<ServiceNavIconProps> = ({
  slug,
  size = 20,
  className = '',
  color = 'currentColor',
}) => {
  const strokeWidth = 1.6;

  switch (slug) {
    case 'general-insurance':
      // Car and Shield / Property protection line icon
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12h6" />
          <path d="M9 16h6" />
        </svg>
      );

    case 'life-insurance':
      // Umbrella / Protection line icon
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7" />
        </svg>
      );

    case 'health-insurance':
      // Healthcare cross inside shield
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      );

    case 'mutual-funds':
      // Compounding SIP growth chart / trendline
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      );

    case 'equity':
      // Candlestick / Market trading bars
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <line x1="6" y1="3" x2="6" y2="7" />
          <rect x="4" y="7" width="4" height="10" rx="1" />
          <line x1="6" y1="17" x2="6" y2="21" />
          <line x1="18" y1="3" x2="18" y2="5" />
          <rect x="16" y="5" width="4" height="8" rx="1" />
          <line x1="18" y1="13" x2="18" y2="21" />
        </svg>
      );

    case 'other-solutions':
    default:
      // Fixed deposits / Bonds safe deposit box
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <circle cx="12" cy="15" r="1.5" />
        </svg>
      );
  }
};

