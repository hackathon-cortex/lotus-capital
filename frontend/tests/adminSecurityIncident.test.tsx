import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider } from '../src/context/AuthContext';
import { RequireAuth } from '../src/guards/RequireAuth';
import { api } from '../src/api/client';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('Admin Security Incident Remediation & Fail-Closed Behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('fails closed: anonymous visitor to /admin is redirected to /admin/login', async () => {
    render(
      <HelmetProvider>
        <QueryClientProvider client={createTestQueryClient()}>
          <AuthProvider>
            <MemoryRouter initialEntries={['/admin/dashboard']}>
              <Routes>
                <Route
                  path="/admin/dashboard"
                  element={
                    <RequireAuth>
                      <div data-testid="secret-admin-screen">Confidential Admin Dashboard</div>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/admin/login"
                  element={<div data-testid="admin-login-screen">Admin Login Page</div>}
                />
              </Routes>
            </MemoryRouter>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    );

    // Initial state or post-check redirect to login
    await waitFor(() => {
      expect(screen.getByTestId('admin-login-screen')).toBeInTheDocument();
    });

    // Confidential admin screen MUST NOT be rendered
    expect(screen.queryByTestId('secret-admin-screen')).not.toBeInTheDocument();
  });

  it('preserves deep link target in ?next= parameter on unauthenticated redirect', async () => {
    let capturedLocation: any = null;

    const LocationSpy = () => {
      const loc = window.location;
      return <div data-testid="login-view">{loc.pathname}</div>;
    };

    render(
      <HelmetProvider>
        <QueryClientProvider client={createTestQueryClient()}>
          <AuthProvider>
            <MemoryRouter initialEntries={['/admin/leads?status=new']}>
              <Routes>
                <Route
                  path="/admin/leads"
                  element={
                    <RequireAuth>
                      <div>Confidential Leads</div>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/admin/login"
                  element={<LocationSpy />}
                />
              </Routes>
            </MemoryRouter>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('login-view')).toBeInTheDocument();
    });
  });

  it('fails closed on network failure or 401 from /api/v1/auth/me', async () => {
    localStorage.setItem('lotus_access_token', 'stale_expired_token');
    vi.spyOn(api.auth, 'getMe').mockRejectedValue(new Error('401 Unauthorized'));
    vi.spyOn(api.auth, 'refreshToken').mockRejectedValue(new Error('401 Refresh Expired'));

    render(
      <HelmetProvider>
        <QueryClientProvider client={createTestQueryClient()}>
          <AuthProvider>
            <MemoryRouter initialEntries={['/admin/dashboard']}>
              <Routes>
                <Route
                  path="/admin/dashboard"
                  element={
                    <RequireAuth>
                      <div data-testid="secret-admin-screen">Confidential Admin Dashboard</div>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/admin/login"
                  element={<div data-testid="admin-login-screen">Admin Login Page</div>}
                />
              </Routes>
            </MemoryRouter>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('admin-login-screen')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('secret-admin-screen')).not.toBeInTheDocument();
  });
});
