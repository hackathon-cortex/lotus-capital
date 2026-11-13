import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RequireAuthProps {
  children: React.ReactElement;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        data-testid="auth-loading-spinner"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#071B30',
          color: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              border: '3px solid rgba(255, 255, 255, 0.15)',
              borderTopColor: '#D9232D',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <span
            style={{
              fontSize: '12px',
              letterSpacing: '0.12em',
              color: '#8A949D',
              textTransform: 'uppercase',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Verifying Credentials...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    const nextPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/admin/login?next=${nextPath}`} replace />;
  }

  return children;
};
