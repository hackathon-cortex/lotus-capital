import React, { useState, useEffect } from 'react';
import '../../styles/admin.css';
import { AdminBackdrop } from './AdminBackdrop';
import { GlassPanel } from './GlassPanel';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export interface AdminShellProps {
  children?: React.ReactNode;
  dueFollowupsCount?: number;
}

const STORAGE_KEY = 'lotus_admin_sidebar_collapsed';

export const AdminShell: React.FC<AdminShellProps> = ({
  children,
  dueFollowupsCount = 6,
}) => {
  const { isMobile, isTablet } = useBreakpoint();

  // Remember collapse state in localStorage with try/catch
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
    } catch {
      // Ignore localStorage exceptions (e.g. security sandboxes)
    }
    return false;
  });

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Auto-collapse sidebar on tablet (1024-1279px) and expand on large desktop
  useEffect(() => {
    if (isTablet) {
      setIsCollapsed(true);
    } else if (!isMobile) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          setIsCollapsed(saved === 'true');
        } else {
          setIsCollapsed(false);
        }
      } catch {
        setIsCollapsed(false);
      }
    }
  }, [isTablet, isMobile]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobile && mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, mobileDrawerOpen]);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore storage error
      }
      return next;
    });
  };

  return (
    <div className="admin-shell-root">
      {/* 1. Full-Viewport Fixed Layer Behind Everything */}
      <AdminBackdrop />

      {/* 2. Glass Panel Floating Above Backdrop */}
      <GlassPanel>
        {/* 3. Compact Glass Sidebar Rail / Off-canvas Drawer */}
        <AdminSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          isMobileDrawerOpen={mobileDrawerOpen}
          onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
          isMobile={isMobile}
          dueFollowupsCount={dueFollowupsCount}
        />

        {/* 4. Main Content Area */}
        <div className="admin-main-wrap">
          {/* Top Bar */}
          <AdminTopbar
            isMobile={isMobile}
            onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
            statusLabel="FastAPI Connected"
          />

          {/* Scrollable Page Content Container */}
          <main className="admin-content-scroll" role="main">
            {children}
          </main>
        </div>
      </GlassPanel>
    </div>
  );
};

