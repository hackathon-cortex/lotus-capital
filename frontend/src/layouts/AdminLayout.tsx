import React from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AdminShell } from '../components/admin/AdminShell';

export const AdminLayout: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Admin Portal | Lotus Capital</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Modern Config-Driven Admin Shell with Glass Panel & Backdrop */}
      <AdminShell dueFollowupsCount={6}>
        <Outlet />
      </AdminShell>
    </>
  );
};
