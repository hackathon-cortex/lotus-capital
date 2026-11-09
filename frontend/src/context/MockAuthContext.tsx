import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'staff';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

interface AuthContextType {
  user: MockUser | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  hasRole: (requiredRole: UserRole) => boolean;
}

const defaultAdminUser: MockUser = {
  id: 'usr_mock_001',
  name: 'Abhilash Chudasama (Mock Admin)',
  email: 'admin@lotuscapital.com',
  role: 'admin',
  permissions: ['all'],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const MockAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Mock authentication state (defaults to signed in for development convenience, can toggle)
  const [user, setUser] = useState<MockUser | null>(defaultAdminUser);

  const login = (email: string, role: UserRole = 'admin') => {
    setUser({
      id: 'usr_mock_session',
      name: email.split('@')[0],
      email,
      role,
      permissions: role === 'admin' ? ['all'] : ['view_leads', 'edit_content'],
    });
  };

  const logout = () => {
    setUser(null);
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has access to all roles
    return user.role === requiredRole;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a MockAuthProvider');
  }
  return context;
};

