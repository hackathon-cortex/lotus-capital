import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/MockAuthContext';

interface RequireAuthProps {
  children: React.ReactElement;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const nextPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/admin/login?next=${nextPath}`} replace />;
  }

  return children;
};

