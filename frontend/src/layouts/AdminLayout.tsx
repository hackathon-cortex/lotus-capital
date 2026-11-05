import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/MockAuthContext';
import { LotusLogo } from '../components/common/LotusLogo';
import { useBreakpoint } from '../hooks/useBreakpoint';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { isMobile, isTablet } = useBreakpoint();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Auto-collapse sidebar to icon rail on tablet; close mobile drawer on route change
  useEffect(() => {
    if (isTablet) {
      setIsCollapsed(true);
    } else if (!isMobile) {
      setIsCollapsed(false);
    }
  }, [isTablet, isMobile]);

  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { label: 'Enquiries & Leads', icon: '📥', path: '/admin/leads' },
    { label: 'Follow-ups', icon: '⏰', path: '/admin/followups' },
    { label: 'Reports', icon: '📈', path: '/admin/reports', role: 'admin' },
    { label: 'Page Content', icon: '📄', path: '/admin/content/pages' },
    { label: 'FAQs', icon: '❓', path: '/admin/content/faqs' },
    { label: 'Team', icon: '👥', path: '/admin/content/team' },
    { label: 'Partners & Awards', icon: '🏆', path: '/admin/content/partners', role: 'admin' },
    { label: 'Testimonials', icon: '💬', path: '/admin/content/testimonials', role: 'admin' },
    { label: 'Insights', icon: '✍️', path: '/admin/content/insights' },
    { label: 'Media Library', icon: '🖼️', path: '/admin/media' },
    { label: 'Users & Roles', icon: '🛡️', path: '/admin/users', role: 'admin' },
    { label: 'Audit Log', icon: '📋', path: '/admin/audit-logs', role: 'admin' },
    { label: 'My Account', icon: '⚙️', path: '/admin/account' },
  ];

  const sidebarWidth = isMobile ? '280px' : isCollapsed ? '72px' : '248px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--silver-100)', position: 'relative' }}>
      <Helmet>
        <title>Admin Portal | Lotus Capital</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Mobile Drawer Backdrop */}
      {isMobile && mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 24, 44, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 1090,
          }}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: Desktop 248px / Tablet 72px rail / Mobile Off-Canvas Drawer */}
      <aside
        style={{
          width: sidebarWidth,
          transition: 'width var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)',
          backgroundColor: 'var(--navy-950)',
          color: 'var(--silver-300)',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          bottom: isMobile ? 0 : 'auto',
          height: '100vh',
          zIndex: isMobile ? 1100 : 50,
          transform: isMobile ? (mobileDrawerOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
          boxShadow: isMobile && mobileDrawerOpen ? '0 0 32px rgba(0, 0, 0, 0.5)' : 'none',
        }}
      >
        {/* Brand header */}
        <div
          style={{
            height: '64px',
            padding: !isMobile && isCollapsed ? '0.75rem' : '1rem 1.25rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: !isMobile && isCollapsed ? 'center' : 'space-between',
          }}
        >
          <Link
            to="/admin/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: 'var(--white)',
              textDecoration: 'none',
              overflow: 'hidden',
            }}
          >
            <LotusLogo variant="light" width={28} height={28} />
            {(isMobile || !isCollapsed) && (
              <span style={{ fontWeight: 700, fontSize: '1rem', whiteSpace: 'nowrap' }}>
                Lotus Admin
              </span>
            )}
          </Link>

          {isMobile ? (
            <button
              onClick={() => setMobileDrawerOpen(false)}
              aria-label="Close admin menu"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--silver-300)',
                fontSize: '1.25rem',
                cursor: 'pointer',
                padding: '0.25rem',
              }}
            >
              ✕
            </button>
          ) : (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--silver-500)',
                cursor: 'pointer',
                padding: '0.25rem',
                display: isCollapsed ? 'none' : 'block',
              }}
            >
              ◀
            </button>
          )}
        </div>

        {!isMobile && isCollapsed && (
          <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
            <button
              onClick={() => setIsCollapsed(false)}
              style={{ background: 'none', border: 'none', color: 'var(--silver-500)', cursor: 'pointer' }}
            >
              ▶
            </button>
          </div>
        )}

        {/* Navigation list */}
        <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
          {navItems.map((item) => {
            if (item.role === 'admin' && user?.role !== 'admin') {
              return null;
            }
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: !isMobile && isCollapsed ? '0.75rem 0' : '0.65rem 1.25rem',
                  justifyContent: !isMobile && isCollapsed ? 'center' : 'flex-start',
                  fontSize: '0.88rem',
                  color: isActive ? 'var(--white)' : 'var(--silver-300)',
                  backgroundColor: isActive ? 'var(--navy-700)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--red-500)' : '3px solid transparent',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'background var(--dur-fast) ease',
                }}
              >
                <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{item.icon}</span>
                {(isMobile || !isCollapsed) && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
          {isMobile || !isCollapsed ? (
            <>
              <div style={{ color: 'var(--white)', fontWeight: 600 }}>{user?.name || 'Administrator'}</div>
              <div style={{ color: 'var(--silver-500)', fontSize: '0.75rem' }}>Role: {user?.role?.toUpperCase()}</div>
              <button
                onClick={logout}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  marginTop: '0.75rem',
                  padding: '0.35rem',
                  fontSize: '0.78rem',
                  color: 'var(--white)',
                  borderColor: 'var(--silver-500)',
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={logout}
              title="Sign Out"
              style={{ background: 'none', border: 'none', color: 'var(--silver-300)', width: '100%', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              🚪
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar (Sticky 64px tall) */}
        <header
          style={{
            height: '64px',
            backgroundColor: 'var(--white)',
            borderBottom: '1px solid var(--silver-300)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '0 1rem' : '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '540px' }}>
            {/* Mobile Sidebar Hamburger Toggle */}
            {isMobile && (
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                aria-label="Open admin navigation menu"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--silver-300)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.4rem 0.6rem',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '40px',
                  minWidth: '40px',
                }}
              >
                ☰
              </button>
            )}

            <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
              <input
                type="text"
                placeholder="Search leads..."
                style={{
                  width: '100%',
                  height: '40px',
                  minHeight: '40px',
                  padding: '0 1rem 0 2.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--silver-300)',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--silver-500)',
                }}
              >
                🔍
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {!isMobile && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.82rem',
                  color: 'var(--muted)',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
                <span>FastAPI Connected</span>
              </div>
            )}

            <Link
              to="/"
              target="_blank"
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
            >
              Public Site ↗
            </Link>

            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--navy-700)',
                color: 'var(--white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                flexShrink: 0,
              }}
            >
              AC
            </div>
          </div>
        </header>

        {/* Dashboard Main View with responsive padding */}
        <main
          style={{
            flex: 1,
            padding: isMobile ? '1.25rem 1rem' : '2rem',
            maxWidth: '1440px',
            width: '100%',
            margin: '0 auto',
            minWidth: 0,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
