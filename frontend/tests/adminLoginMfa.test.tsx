import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { TokenResponseSchema, UserProfileSchema } from '../src/api/types';
import { cleanAuthErrorMessage, AuthProvider } from '../src/context/AuthContext';
import { AdminLogin } from '../src/pages/admin/AdminAuthPages';
import { api, setAccessToken } from '../src/api/client';

describe('Admin Authentication & MFA Validation Flow Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    setAccessToken(null);
  });

  describe('1. Zod Boundary Schema Validation (TokenResponseSchema)', () => {
    it('successfully parses MFA-disabled login response where mfa_token is null', () => {
      const payloadFromBackend = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_access',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_refresh',
        token_type: 'bearer',
        user: {
          id: 1,
          full_name: 'Abhilash Chudasama',
          email: 'admin@lotuscapital.in',
          role: 'admin',
          is_active: true,
          is_superuser: true,
          mfa_enabled: false,
          created_at: '2026-01-01T00:00:00Z',
          last_login_at: null,
        },
        mfa_required: false,
        mfa_token: null, // previously caused Zod invalid_type error
      };

      const parsed = TokenResponseSchema.parse(payloadFromBackend);
      expect(parsed.mfa_required).toBe(false);
      expect(parsed.mfa_token).toBeNull();
      expect(parsed.access_token).toBe(payloadFromBackend.access_token);
      expect(parsed.user?.email).toBe('admin@lotuscapital.in');
    });

    it('successfully parses MFA challenge response where access_token and user are null', () => {
      const challengePayloadFromBackend = {
        access_token: null,
        refresh_token: null,
        token_type: 'bearer',
        user: null,
        mfa_required: true,
        mfa_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mfa_challenge_jwt',
      };

      const parsed = TokenResponseSchema.parse(challengePayloadFromBackend);
      expect(parsed.mfa_required).toBe(true);
      expect(parsed.mfa_token).toBe(challengePayloadFromBackend.mfa_token);
      expect(parsed.access_token).toBeNull();
      expect(parsed.user).toBeNull();
    });

    it('successfully parses MFA completed validation response', () => {
      const completedPayloadFromBackend = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.completed_access',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.completed_refresh',
        token_type: 'bearer',
        user: {
          id: 1,
          full_name: 'Abhilash Chudasama',
          email: 'admin@lotuscapital.in',
          role: 'admin',
          is_active: true,
          is_superuser: true,
          mfa_enabled: true,
          created_at: '2026-01-01T00:00:00Z',
          last_login_at: '2026-11-16T12:00:00Z',
        },
        mfa_required: false,
        mfa_token: null,
      };

      const parsed = TokenResponseSchema.parse(completedPayloadFromBackend);
      expect(parsed.mfa_required).toBe(false);
      expect(parsed.access_token).toBe(completedPayloadFromBackend.access_token);
      expect(parsed.user?.mfa_enabled).toBe(true);
    });
  });

  describe('2. Error Sanitization & Clean User-Facing Messaging', () => {
    it('converts raw Zod error JSON into a clean message instead of exposing JSON in UI', () => {
      const rawZodErrorString = JSON.stringify([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'null',
          path: ['mfa_token'],
          message: 'Expected string, received null',
        },
      ]);

      const cleaned = cleanAuthErrorMessage(new Error(rawZodErrorString));
      expect(cleaned).toBe('MFA verification required.');
      expect(cleaned).not.toContain('invalid_type');
      expect(cleaned).not.toContain('null');
    });

    it('sanitizes invalid password errors into clean messages', () => {
      expect(cleanAuthErrorMessage(new Error('Invalid email or password.'))).toBe('Invalid email or password.');
      expect(cleanAuthErrorMessage(new Error('Unauthorized: wrong password'))).toBe('Invalid email or password.');
    });

    it('sanitizes MFA code errors cleanly', () => {
      expect(cleanAuthErrorMessage(new Error('Invalid two-factor authentication code.'))).toBe('Invalid MFA verification code.');
      expect(cleanAuthErrorMessage(new Error('Invalid TOTP code'))).toBe('Invalid MFA verification code.');
    });

    it('hides internal Python tracebacks from user-facing UI', () => {
      const rawTraceback = 'Traceback (most recent call last):\n  File "/app/main.py", line 123 in route\nInternalCrashError';
      const cleaned = cleanAuthErrorMessage(new Error(rawTraceback));
      expect(cleaned).toBe('Authentication failed.');
      expect(cleaned).not.toContain('Traceback');
    });
  });

  describe('3. Admin Login & MFA Authentication Flow (UI & API Integration)', () => {
    const renderAdminLogin = () => {
      return render(
        <HelmetProvider>
          <MemoryRouter initialEntries={['/admin/login']}>
            <AuthProvider>
              <Routes>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<div data-testid="admin-dashboard">Dashboard Loaded</div>} />
              </Routes>
            </AuthProvider>
          </MemoryRouter>
        </HelmetProvider>
      );
    };

    it('allows an admin without MFA to sign in successfully', async () => {
      vi.spyOn(api.public, 'checkHealth').mockResolvedValue({
        status: 'healthy',
        environment: 'test',
        database: 'connected',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      });

      vi.spyOn(api.auth, 'login').mockResolvedValue({
        access_token: 'valid_access_token_123',
        refresh_token: 'valid_refresh_token_456',
        token_type: 'bearer',
        mfa_required: false,
        mfa_token: null,
        user: {
          id: 1,
          full_name: 'Abhilash Chudasama',
          email: 'admin@lotuscapital.in',
          role: 'admin',
          is_active: true,
          is_superuser: true,
          mfa_enabled: false,
        },
      });

      const { container } = renderAdminLogin();

      // Submit login form via submit button
      const submitBtn = container.querySelector('button[type="submit"]') as HTMLButtonElement;
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
      });
    });

    it('prompts for MFA when MFA is enabled and rejects invalid code', async () => {
      vi.spyOn(api.public, 'checkHealth').mockResolvedValue({
        status: 'healthy',
        environment: 'test',
        database: 'connected',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      });

      // 1. First login attempt returns challenge token
      vi.spyOn(api.auth, 'login').mockResolvedValue({
        access_token: null,
        refresh_token: null,
        token_type: 'bearer',
        mfa_required: true,
        mfa_token: 'mfa_challenge_pending_jwt',
        user: null,
      });

      // 2. MFA validation mock throws on bad code
      vi.spyOn(api.auth, 'validateMfaLogin').mockRejectedValue(
        new Error('Invalid two-factor authentication code.')
      );

      const { container } = renderAdminLogin();

      // Submit email & password
      const submitBtn = container.querySelector('button[type="submit"]') as HTMLButtonElement;
      fireEvent.click(submitBtn);

      // Verify MFA screen is presented
      await waitFor(() => {
        expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
        expect(screen.getByLabelText(/authentication code/i)).toBeInTheDocument();
      });

      // Enter invalid MFA code
      const codeInput = screen.getByLabelText(/authentication code/i);
      fireEvent.change(codeInput, { target: { value: '000000' } });

      const verifyBtn = screen.getByRole('button', { name: /verify & continue/i });
      fireEvent.click(verifyBtn);

      // Verify clean error displayed
      await waitFor(() => {
        expect(screen.getByText('Invalid MFA verification code.')).toBeInTheDocument();
      });
    });

    it('completes login when valid MFA code is provided', async () => {
      vi.spyOn(api.public, 'checkHealth').mockResolvedValue({
        status: 'healthy',
        environment: 'test',
        database: 'connected',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      });

      vi.spyOn(api.auth, 'login').mockResolvedValue({
        access_token: null,
        refresh_token: null,
        token_type: 'bearer',
        mfa_required: true,
        mfa_token: 'mfa_challenge_pending_jwt',
        user: null,
      });

      vi.spyOn(api.auth, 'validateMfaLogin').mockResolvedValue({
        access_token: 'valid_access_token_after_mfa',
        refresh_token: 'valid_refresh_token_after_mfa',
        token_type: 'bearer',
        mfa_required: false,
        mfa_token: null,
        user: {
          id: 1,
          full_name: 'Abhilash Chudasama',
          email: 'admin@lotuscapital.in',
          role: 'admin',
          is_active: true,
          is_superuser: true,
          mfa_enabled: true,
        },
      });

      const { container } = renderAdminLogin();

      const submitBtn = container.querySelector('button[type="submit"]') as HTMLButtonElement;
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
      });

      const codeInput = screen.getByLabelText(/authentication code/i);
      fireEvent.change(codeInput, { target: { value: '123456' } });

      const verifyBtn = screen.getByRole('button', { name: /verify & continue/i });
      fireEvent.click(verifyBtn);

      await waitFor(() => {
        expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
      });
    });

    it('displays clean error when login credentials are invalid', async () => {
      vi.spyOn(api.public, 'checkHealth').mockResolvedValue({
        status: 'healthy',
        environment: 'test',
        database: 'connected',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      });

      vi.spyOn(api.auth, 'login').mockRejectedValue(
        new Error('Invalid email or password.')
      );

      const { container } = renderAdminLogin();

      const submitBtn = container.querySelector('button[type="submit"]') as HTMLButtonElement;
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password.')).toBeInTheDocument();
      });
    });
  });
});
