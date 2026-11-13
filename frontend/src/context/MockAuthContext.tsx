import React, { useState, ReactNode } from 'react';
import { AuthContext, AuthUser, UserRole } from './AuthContext';

export * from './AuthContext';

export const defaultMockAdminUser: AuthUser = {
  id: 'usr_mock_001',
  name: 'Abhilash Chudasama',
  email: 'admin@lotuscapital.in',
  role: 'admin',
  permissions: ['all'],
};

export interface MockAuthProviderProps {
  children: ReactNode;
  initialUser?: AuthUser | null;
  initialLoading?: boolean;
}

/**
 * MockAuthProvider is strictly for test runner environments (Vitest / testing-library).
 * Production uses AuthProvider from './AuthContext' which fails closed.
 */
export const MockAuthProvider: React.FC<MockAuthProviderProps> = ({
  children,
  initialUser = defaultMockAdminUser,
  initialLoading = false,
}) => {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoading] = useState<boolean>(initialLoading);
  const [backendConnected] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(initialUser ? 'mock_jwt_test_token' : null);

  const login = async (
    email: string,
    passwordOrRole?: string,
    role: UserRole = 'admin'
  ): Promise<{ success: boolean; error?: string }> => {
    const isMockRole = passwordOrRole === 'admin' || passwordOrRole === 'staff';
    const assignedRole = (isMockRole ? passwordOrRole : role) as UserRole;
    const testUser: AuthUser = {
      id: 'usr_mock_session',
      name: email.split('@')[0],
      email,
      role: assignedRole,
      permissions: assignedRole === 'admin' ? ['all'] : ['view_leads', 'edit_content'],
    };
    setUser(testUser);
    setToken('mock_jwt_test_token');
    return { success: true };
  };

  const validateMfa = async (_mfaToken: string, _code: string) => ({ success: true });

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.role === requiredRole;
  };

  const changePassword = async () => ({ success: true });

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        backendConnected,
        token,
        login,
        validateMfa,
        logout,
        hasRole,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
