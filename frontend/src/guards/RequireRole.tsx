import React from 'react';
import { useAuth, UserRole } from '../context/MockAuthContext';

interface RequireRoleProps {
  role: UserRole;
  children: React.ReactElement;
}

export const RequireRole: React.FC<RequireRoleProps> = ({ role, children }) => {
  const { hasRole } = useAuth();

  if (!hasRole(role)) {
    return (
      <div className="container section-padding">
        <div className="card" style={{ borderColor: 'var(--danger)', padding: '2rem' }}>
          <h2>Access Denied (HTTP 403)</h2>
          <p>
            Your current mock account role does not have permission to view this administrative screen.
            Required role: <strong>{role}</strong>.
          </p>
          <p>You can switch roles in the mock authentication context for testing.</p>
        </div>
      </div>
    );
  }

  return children;
};

