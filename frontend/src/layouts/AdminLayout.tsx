import React from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { AdminShell } from '../components/admin/AdminShell';
import { api } from '../api/client';

export const AdminLayout: React.FC = () => {
  const { data: followupsData } = useQuery({
    queryKey: ['admin', 'followups-count'],
    queryFn: () => api.admin.getFollowupsCount(),
    refetchInterval: 60000,
    staleTime: 15000,
  });

  const dueFollowupsCount = followupsData?.count ?? 0;

  return (
    <>
      <Helmet>
        <title>Admin Portal | Lotus Capital</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Modern Config-Driven Admin Shell with Glass Panel & Backdrop */}
      <AdminShell dueFollowupsCount={dueFollowupsCount}>
        <Outlet />
      </AdminShell>
    </>
  );
};
