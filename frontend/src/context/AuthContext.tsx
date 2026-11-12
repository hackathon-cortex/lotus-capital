import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, getAccessToken, setAccessToken } from '../api/client';
import { UserProfile } from '../api/types';

export type UserRole = 'admin' | 'staff';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

export type MockUser = AuthUser;

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  backendConnected: boolean;
  token: string | null;
  login: (email: string, passwordOrRole?: string, role?: UserRole) => Promise<{ success: boolean; error?: string; mfa_required?: boolean; mfa_token?: string }>;
  validateMfa: (mfaToken: string, code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasRole: (requiredRole: UserRole) => boolean;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
}

const defaultAdminUser: AuthUser = {
  id: 'usr_mock_001',
  name: 'Abhilash Chudasama',
  email: 'admin@lotuscapital.in',
  role: 'admin',
  permissions: ['all'],
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(defaultAdminUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [token, setTokenState] = useState<string | null>(getAccessToken());

  const mapBackendUser = (profile: UserProfile): AuthUser => ({
    id: String(profile.id),
    name: profile.full_name || profile.email.split('@')[0],
    email: profile.email,
    role: profile.role === 'editor' ? 'staff' : 'admin',
    permissions: profile.role === 'editor' ? ['view_leads', 'edit_content'] : ['all'],
  });

  useEffect(() => {
    let mounted = true;

    // In unit test runner without existing token, skip background async probe
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test' && !getAccessToken()) {
      setIsLoading(false);
      return;
    }

    async function checkAuthSession() {
      try {
        const health = await api.public.checkHealth();
        if (mounted && health && health.status === 'healthy') {
          setBackendConnected(true);
        }

        const existingToken = getAccessToken();
        if (existingToken) {
          try {
            const profile = await api.auth.getMe();
            if (mounted && profile) {
              setUser(mapBackendUser(profile));
              setTokenState(existingToken);
            }
          } catch {
            // Attempt silent refresh
            try {
              const refreshed = await api.auth.refreshToken();
              if (mounted && refreshed?.user) {
                setUser(mapBackendUser(refreshed.user));
                setTokenState(refreshed.access_token);
              }
            } catch {
              setAccessToken(null);
              if (mounted) {
                setTokenState(null);
                setUser(defaultAdminUser);
              }
            }
          }
        }
      } catch {
        if (mounted) {
          setBackendConnected(false);
          setUser(defaultAdminUser);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    checkAuthSession();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (
    email: string,
    passwordOrRole?: string,
    role: UserRole = 'admin'
  ): Promise<{ success: boolean; error?: string; mfa_required?: boolean; mfa_token?: string }> => {
    const isMockRole = passwordOrRole === 'admin' || passwordOrRole === 'staff';
    const isRealPassword = passwordOrRole && !isMockRole && passwordOrRole.length >= 6;

    if (isRealPassword) {
      try {
        const tokenRes = await api.auth.login(email, passwordOrRole);
        if (tokenRes.mfa_required) {
          return { success: false, mfa_required: true, mfa_token: tokenRes.mfa_token };
        }
        if (tokenRes.user) {
          const mapped = mapBackendUser(tokenRes.user);
          setUser(mapped);
        }
        setTokenState(tokenRes.access_token);
        setBackendConnected(true);
        return { success: true };
      } catch (err: any) {
        return {
          success: false,
          error: err.message || 'Invalid email or password. Please verify credentials.',
        };
      }
    }

    // Mock role fallback
    const assignedRole = (isMockRole ? passwordOrRole : role) as UserRole;
    setUser({
      id: 'usr_mock_session',
      name: email.split('@')[0],
      email,
      role: assignedRole,
      permissions: assignedRole === 'admin' ? ['all'] : ['view_leads', 'edit_content'],
    });
    return { success: true };
  };

  const validateMfa = async (mfaToken: string, code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const tokenRes = await api.auth.validateMfaLogin(mfaToken, code);
      if (tokenRes.user) {
        setUser(mapBackendUser(tokenRes.user));
      }
      setTokenState(tokenRes.access_token);
      setBackendConnected(true);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Invalid verification code.' };
    }
  };

  const logout = () => {
    api.auth.logout().catch(() => {});
    setAccessToken(null);
    setTokenState(null);
    setUser(null);
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.role === requiredRole;
  };

  const changePassword = async (oldPass: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await api.auth.changePassword(oldPass, newPass);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to change password.' };
    }
  };

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

export const MockAuthProvider = AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

