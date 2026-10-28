import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/MockAuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Enquiries & Leads', path: '/admin/leads' },
    { label: 'Follow-ups', path: '/admin/followups' },
    { label: 'Reports', path: '/admin/reports', role: 'admin' },
    { label: 'Page Content', path: '/admin/content/pages' },
    { label: 'FAQs', path: '/admin/content/faqs' },
    { label: 'Team', path: '/admin/content/team' },
    { label: 'Partners & Awards', path: '/admin/content/partners', role: 'admin' },
    { label: 'Testimonials', path: '/admin/content/testimonials', role: 'admin' },
    { label: 'Insights', path: '/admin/content/insights' },
    { label: 'Media Library', path: '/admin/media' },
    { label: 'Users & Roles', path: '/admin/users', role: 'admin' },
    { label: 'Audit Log', path: '/admin/audit-logs', role: 'admin' },
    { label: 'My Account', path: '/admin/account' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--silver-100)' }}>
      <Helmet>
        <title>Admin Panel | Lotus Capital</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Sidebar */}
      <aside
        style={{
          width: 'var(--sidebar-w)',
          backgroundColor: 'var(--navy-950)',
          color: 'var(--silver-300)',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Link to="/" style={{ color: 'var(--white)', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>
            Lotus Capital Admin
          </Link>
          <div style={{ fontSize: '0.75rem', color: 'var(--silver-500)', marginTop: '0.25rem' }}>
            CMS & Lead Operations
          </div>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
          {navItems.map((item) => {
            if (item.role === 'admin' && user?.role !== 'admin') {
              return null;
            }
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'block',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.9rem',
                  color: isActive ? 'var(--white)' : 'var(--silver-300)',
                  backgroundColor: isActive ? 'var(--navy-700)' : 'transparent',
                  borderLeft: isActive ? '4px solid var(--red-500)' : '4px solid transparent',
                  textDecoration: 'none',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
          <div style={{ color: 'var(--white)', fontWeight: 600 }}>{user?.name || 'Mock User'}</div>
          <div style={{ color: 'var(--silver-500)' }}>Role: {user?.role?.toUpperCase()}</div>
          <button
            onClick={logout}
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.4rem', fontSize: '0.8rem', color: 'var(--white)', borderColor: 'var(--silver-500)' }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            height: 'var(--topbar-h)',
            backgroundColor: 'var(--white)',
            borderBottom: '1px solid var(--silver-300)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>
            Lotus Capital Backoffice
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge badge-info">MOCK AUTH ACTIVE</span>
            <Link to="/" target="_blank" className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
              View Public Site ↗
            </Link>
          </div>
        </header>

        <main style={{ flex: 1, padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

