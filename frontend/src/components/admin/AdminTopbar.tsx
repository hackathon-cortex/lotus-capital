import React from 'react';
import { Link } from 'react-router-dom';
import { AdminIcon } from './AdminIcons';
import { useAuth } from '../../context/MockAuthContext';

export interface AdminTopbarProps {
  onOpenMobileDrawer: () => void;
  isMobile: boolean;
  statusLabel?: string;
  onSearchChange?: (query: string) => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  onOpenMobileDrawer,
  isMobile,
  statusLabel = 'FastAPI Connected',
  onSearchChange,
}) => {
  const { user } = useAuth();

  const cleanName = user?.name ? user.name.replace(/\s*\(mock\s*admin\)/i, '').trim() : 'Abhilash Chudasama';
  const initials = cleanName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AC';

  return (
    <header className={`admin-topbar ${isMobile ? 'admin-topbar--mobile' : ''}`}>
      <div className="admin-topbar__left">
        {/* Mobile Hamburger Drawer Toggle */}
        <button
          type="button"
          onClick={onOpenMobileDrawer}
          aria-label="Open admin navigation menu"
          className="admin-topbar__hamburger"
        >
          <AdminIcon name="menu" size={20} />
        </button>

        {/* Glass Search Field */}
        <div className="admin-topbar__search-box">
          <span className="admin-topbar__search-icon" aria-hidden="true">
            <AdminIcon name="search" size={16} />
          </span>
          <input
            type="text"
            placeholder="Search leads..."
            aria-label="Search leads"
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="admin-topbar__search-input"
          />
          <kbd className="admin-topbar__search-hint" aria-hidden="true">
            Ctrl+K
          </kbd>
        </div>
      </div>

      <div className="admin-topbar__right">
        {/* System Status Dot with Tooltip */}
        <div
          className="admin-topbar__status"
          title={`Operational status: ${statusLabel}`}
          aria-label={`Operational status: ${statusLabel}`}
        >
          <span className="admin-topbar__status-dot" aria-hidden="true" />
          <span className="admin-topbar__status-text">{statusLabel}</span>
        </div>

        {/* Public Site Outlined Pill */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-topbar__public-btn"
          title="Open Public Site in new tab"
        >
          <span>Public Site</span>
          <AdminIcon name="external-link" size={13} />
        </Link>

        {/* Avatar */}
        <div
          className="admin-topbar__avatar"
          title={`${cleanName} (${user?.role?.toUpperCase() || 'ADMIN'})`}
          aria-label={`${cleanName} profile avatar`}
        >
          {initials}
        </div>
      </div>
    </header>
  );
};
