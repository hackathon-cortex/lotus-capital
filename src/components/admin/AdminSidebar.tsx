import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LotusLogo } from '../common/LotusLogo';
import { AdminIcon } from './AdminIcons';
import { useAuth } from '../../context/MockAuthContext';

export interface AdminNavSection {
  title?: string;
  items: {
    label: string;
    path: string;
    icon: string;
    role?: 'admin' | 'staff';
    badgeKey?: 'followups';
  }[];
}

export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    ],
  },
  {
    title: 'Leads',
    items: [
      { label: 'Enquiries & Leads', path: '/admin/leads', icon: 'leads' },
      { label: 'Follow-ups', path: '/admin/followups', icon: 'followups', badgeKey: 'followups' },
      { label: 'Reports', path: '/admin/reports', icon: 'reports', role: 'admin' },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Page Content', path: '/admin/content/pages', icon: 'pages' },
      { label: 'FAQs', path: '/admin/content/faqs', icon: 'faqs' },
      { label: 'Team', path: '/admin/content/team', icon: 'team' },
      { label: 'Partners & Awards', path: '/admin/content/partners', icon: 'partners', role: 'admin' },
      { label: 'Testimonials', path: '/admin/content/testimonials', icon: 'testimonials', role: 'admin' },
      { label: 'Insights', path: '/admin/content/insights', icon: 'insights' },
      { label: 'Media Library', path: '/admin/media', icon: 'media' },
    ],
  },
  {
    title: 'Admin',
    items: [
      { label: 'Users & Roles', path: '/admin/users', icon: 'roles', role: 'admin' },
      { label: 'Audit Log', path: '/admin/audit-logs', icon: 'audit', role: 'admin' },
      { label: 'My Account', path: '/admin/account', icon: 'account' },
    ],
  },
];

export interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileDrawerOpen: boolean;
  onCloseMobileDrawer: () => void;
  isMobile: boolean;
  dueFollowupsCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileDrawerOpen,
  onCloseMobileDrawer,
  isMobile,
  dueFollowupsCount = 6,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const sidebarRef = useRef<HTMLElement>(null);

  // Close drawer on route change
  useEffect(() => {
    if (isMobileDrawerOpen) {
      onCloseMobileDrawer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Handle escape key and focus trap when mobile drawer is open
  useEffect(() => {
    if (!isMobile || !isMobileDrawerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseMobileDrawer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, isMobileDrawerOpen, onCloseMobileDrawer]);

  // Get clean user name without "(Mock Admin)"
  const cleanName = user?.name ? user.name.replace(/\s*\(mock\s*admin\)/i, '').trim() : 'Abhilash Chudasama';
  const roleDisplay = user?.role ? user.role.toUpperCase() : 'ADMIN';
  const initials = cleanName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AC';

  const isRail = !isMobile && isCollapsed;

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobile && isMobileDrawerOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={onCloseMobileDrawer}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        aria-label="Admin Navigation"
        className={`admin-sidebar ${
          isRail ? 'admin-sidebar--collapsed' : 'admin-sidebar--expanded'
        } ${isMobile && isMobileDrawerOpen ? 'is-drawer-open' : ''}`}
      >
        {/* Brand header */}
        <div className="admin-sidebar__header">
          <Link
            to="/admin/dashboard"
            className="admin-sidebar__brand-link"
            title="Lotus Admin Dashboard"
          >
            <LotusLogo variant="light" height={36} width="auto" />
            {(!isRail || isMobile) && (
              <span className="admin-sidebar__brand-text">Lotus Admin</span>
            )}
          </Link>

          {isMobile ? (
            <button
              type="button"
              onClick={onCloseMobileDrawer}
              aria-label="Close navigation"
              className="admin-sidebar__toggle-btn"
            >
              <AdminIcon name="close" size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="admin-sidebar__toggle-btn"
            >
              <AdminIcon
                name={isCollapsed ? 'chevron-right' : 'chevron-left'}
                size={16}
              />
            </button>
          )}
        </div>

        {/* Navigation grouped sections */}
        <nav className="admin-sidebar__nav">
          {ADMIN_NAV_SECTIONS.map((section, sIdx) => {
            const accessibleItems = section.items.filter(
              (item) => !item.role || user?.role === item.role || user?.role === 'admin'
            );

            if (accessibleItems.length === 0) return null;

            return (
              <div key={sIdx} style={{ marginBottom: '12px' }}>
                {(!isRail || isMobile) && section.title && (
                  <div className="admin-sidebar__section-label">
                    {section.title}
                  </div>
                )}

                {accessibleItems.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    (item.path !== '/admin/dashboard' &&
                      location.pathname.startsWith(`${item.path}/`));

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={item.label}
                      className={`admin-sidebar__item ${isActive ? 'is-active' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {isActive && (
                        <span className="admin-sidebar__item-indicator" aria-hidden="true" />
                      )}

                      <span className="admin-sidebar__icon-wrap">
                        <AdminIcon name={item.icon} size={18} />
                      </span>

                      {(!isRail || isMobile) && (
                        <>
                          <span className="admin-sidebar__label">{item.label}</span>
                          {item.badgeKey === 'followups' &&
                            typeof dueFollowupsCount === 'number' &&
                            dueFollowupsCount > 0 && (
                              <span
                                className="admin-sidebar__badge"
                                aria-label={`${dueFollowupsCount} follow-ups due`}
                              >
                                {dueFollowupsCount}
                              </span>
                            )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer: Compact user chip + signout icon button */}
        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user-chip">
            <div className="admin-sidebar__avatar" aria-hidden="true">
              {initials}
            </div>

            {(!isRail || isMobile) && (
              <div className="admin-sidebar__user-info">
                <span className="admin-sidebar__user-name" title={cleanName}>
                  {cleanName}
                </span>
                <span className="admin-sidebar__user-role">{roleDisplay}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={logout}
            title="Sign out"
            aria-label="Sign out"
            className="admin-sidebar__signout-btn"
          >
            <AdminIcon name="signout" size={16} />
          </button>
        </div>
      </aside>
    </>
  );
};

