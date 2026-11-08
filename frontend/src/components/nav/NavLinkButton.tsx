import React from 'react';
import { Link } from 'react-router-dom';

export interface NavLinkButtonProps {
  to?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'header' | 'footer';
  isActive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  ariaLabel?: string;
  role?: string;
  target?: string;
  rel?: string;
}

/**
 * Shared NavLinkButton / FooterLink component
 * Ensures routes (rendered as <a>/<Link>) and drawer triggers (rendered as <button>)
 * have 100% identical typography, reset button styles, colors, and 2px red hover underline animation.
 */
export const NavLinkButton: React.FC<NavLinkButtonProps> = ({
  to,
  href,
  onClick,
  variant = 'header',
  isActive = false,
  className = '',
  style,
  children,
  ariaLabel,
  role,
  target,
  rel,
}) => {
  const combinedClassName = [
    'nav-link-item',
    variant === 'header' ? 'nav-link-item--header' : 'nav-link-item--footer',
    isActive ? 'is-active' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link
        to={to}
        className={combinedClassName}
        style={style}
        aria-current={isActive ? 'page' : undefined}
        aria-label={ariaLabel}
        role={role}
      >
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={combinedClassName}
        style={style}
        aria-label={ariaLabel}
        target={target}
        rel={rel}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={combinedClassName}
      style={style}
      aria-label={ariaLabel}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </button>
  );
};

// Convenient FooterLink alias
export const FooterLink: React.FC<Omit<NavLinkButtonProps, 'variant'>> = (props) => (
  <NavLinkButton variant="footer" {...props} />
);

