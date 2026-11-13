import React from 'react';
import { useAuth, UserRole } from '../context/AuthContext';

interface RequireRoleProps {
  role: UserRole;
  children: React.ReactElement;
}

export const RequireRole: React.FC<RequireRoleProps> = ({ role, children }) => {
  const { hasRole } = useAuth();

  if (!hasRole(role)) {
    return (
      <div className="container section-padding" style={{ padding: '3rem 1.5rem' }}>
        <div
          className="card"
          style={{
            borderColor: 'var(--red-600, #B91C1C)',
            padding: '2rem',
            backgroundColor: '#0A2540',
            color: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          <h2 style={{ color: '#E92332', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Access Denied (HTTP 403)
          </h2>
          <p style={{ color: '#D7D9DC', lineHeight: 1.6 }}>
            Your account does not have sufficient administrative privileges to view this section.
            Required role: <strong style={{ color: '#FFFFFF' }}>{role}</strong>.
          </p>
        </div>
      </div>
    );
  }

  return children;
};
