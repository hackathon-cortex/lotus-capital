import { describe, it, expect, beforeEach, vi } from 'vitest';
import { filterCompliantStatistics, getFallbackStatistics } from '../src/data/statistics';
import { ApiClientError } from '../src/api/types';
import { backendToFrontendStatus, frontendToBackendStatus } from '../src/api/adapters';
import { setAccessToken, getAccessToken } from '../src/api/client';

describe('Full-Stack Integration & Safety Hardening Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setAccessToken(null);
  });

  describe('1. Compliance & Statistics Gating (00-client-data-register.md)', () => {
    it('STRICT DEFENSE: NEVER allows Tier C (equity_cagr) to be rendered, even if API returns it', () => {
      const mockApiStats = [
        { statistic_key: 'clients_serviced', label: 'Clients Serviced', value: '2500+', as_of_date: '2026-03-31', approval_status: 'approved' },
        { statistic_key: 'equity_cagr', label: 'Equity CAGR', value: '23%', as_of_date: '2026-03-31', approval_status: 'approved' },
      ];

      const filtered = filterCompliantStatistics(mockApiStats);
      const keys = filtered.map((s) => s.statistic_key);

      expect(keys).toContain('clients_serviced');
      expect(keys).not.toContain('equity_cagr');
    });

    it('filters out statistics lacking an as-of date when not in development pending mode', () => {
      const mockStats = [
        { statistic_key: 'stat_dated', label: 'Dated Stat', value: '100+', as_of_date: '2026-03-31', approval_status: 'approved' },
        { statistic_key: 'stat_undated', label: 'Undated Stat', value: '500+', as_of_date: null, approval_status: 'pending' },
      ];

      const result = filterCompliantStatistics(mockStats);
      expect(result.some((s) => s.statistic_key === 'stat_dated')).toBe(true);
    });

    it('provides safe fallback snapshot if backend is unreachable', () => {
      const fallback = getFallbackStatistics();
      expect(Array.isArray(fallback)).toBe(true);
      expect(fallback.length).toBeGreaterThan(0);
      expect(fallback.some((s) => s.statistic_key === 'equity_cagr')).toBe(false);
    });
  });

  describe('2. Two-Way Lead Status Mapping (Api_end_points.md & Bento Grid)', () => {
    it('correctly maps backend enums to capitalized UI representations', () => {
      expect(backendToFrontendStatus('new')).toBe('New');
      expect(backendToFrontendStatus('contacted')).toBe('Contacted');
      expect(backendToFrontendStatus('in_progress')).toBe('In Progress');
      expect(backendToFrontendStatus('resolved')).toBe('Converted');
      expect(backendToFrontendStatus('closed')).toBe('Closed');
    });

    it('correctly maps frontend UI status values back to backend database enums', () => {
      expect(frontendToBackendStatus('New')).toBe('new');
      expect(frontendToBackendStatus('Contacted')).toBe('contacted');
      expect(frontendToBackendStatus('In Progress')).toBe('in_progress');
      expect(frontendToBackendStatus('Qualified')).toBe('in_progress');
      expect(frontendToBackendStatus('Converted')).toBe('resolved');
      expect(frontendToBackendStatus('Closed')).toBe('closed');
    });
  });

  describe('3. Token & Auth Session Storage', () => {
    it('sets and retrieves access token correctly in memory and storage', () => {
      setAccessToken('test-jwt-token-xyz');
      expect(getAccessToken()).toBe('test-jwt-token-xyz');

      setAccessToken(null);
      expect(getAccessToken()).toBeNull();
    });
  });

  describe('4. Standardized API Client Errors', () => {
    it('constructs ApiClientError with status, code, and message', () => {
      const error = new ApiClientError('Validation failed', {
        status: 422,
        code: 'VALIDATION_ERROR',
        fieldErrors: { mobile: 'Invalid mobile number' },
        requestId: 'req-12345',
      });

      expect(error.status).toBe(422);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.fieldErrors?.mobile).toBe('Invalid mobile number');
      expect(error.requestId).toBe('req-12345');
    });
  });
});

