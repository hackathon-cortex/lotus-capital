import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminIcon } from './AdminIcons';
import { AdminCommandPalette } from './AdminCommandPalette';
import { useAuth } from '../../context/MockAuthContext';
import { api } from '../../api/client';

export interface AdminTopbarProps {
  onOpenMobileDrawer: () => void;
  isMobile: boolean;
  statusLabel?: string;
  onSearchChange?: (query: string) => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  onOpenMobileDrawer,
  isMobile,
  statusLabel,
  onSearchChange,
}) => {
  const { user } = useAuth();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'connected' | 'slow' | 'offline'>('connected');
  const [measuredLatency, setMeasuredLatency] = useState<number | null>(null);

  // Live 30s health check
  useEffect(() => {
    let isMounted = true;

    const checkHealth = async () => {
      const start = performance.now();
      try {
        await api.public.checkHealth();
        const elapsed = performance.now() - start;
        if (isMounted) {
          setMeasuredLatency(elapsed);
          setHealthStatus(elapsed > 1500 ? 'slow' : 'connected');
        }
      } catch {
        if (isMounted) {
          setHealthStatus('offline');
        }
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const cleanName = user?.name ? user.name.replace(/\s*\(mock\s*admin\)/i, '').trim() : 'Abhilash Chudasama';
  const initials = cleanName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AC';

  const displayStatus = statusLabel
    ? statusLabel
    : healthStatus === 'connected'
    ? 'FastAPI Connected'
    : healthStatus === 'slow'
    ? 'FastAPI Slow'
    : 'FastAPI Offline';

  return (
    <>
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
          <div
            className="admin-topbar__search-box"
            onClick={() => setIsPaletteOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsPaletteOpen(true);
            }}
          >
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
            title={`Operational status: ${displayStatus}${measuredLatency !== null ? ` (${Math.round(measuredLatency)}ms)` : ''}`}
            aria-label={`Operational status: ${displayStatus}`}
          >
            <span
              className={`admin-topbar__status-dot admin-topbar__status-dot--${healthStatus}`}
              aria-hidden="true"
            />
            <span className="admin-topbar__status-text">{displayStatus}</span>
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

      {/* Global Command Palette */}
      <AdminCommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </>
  );
};
