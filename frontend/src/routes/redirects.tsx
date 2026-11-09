import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const TrailingSlashRedirect: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const location = useLocation();

  // If path is e.g. '/about-us/', redirect to '/about-us'
  if (location.pathname.length > 1 && location.pathname.endsWith('/')) {
    const cleanPath = location.pathname.slice(0, -1);
    return <Navigate to={`${cleanPath}${location.search}${location.hash}`} replace />;
  }

  return children;
};

