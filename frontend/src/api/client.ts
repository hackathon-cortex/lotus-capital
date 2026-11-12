/**
 * Lotus Capital Centralized & Resilient API Client
 * - Base URL from VITE_API_BASE_URL (defaults to '' using Vite dev proxy in development)
 * - Timeout handling via AbortController
 * - Exponential backoff retry for idempotent GET requests
 * - Traceable Request-IDs on all outgoing calls
 * - Single-flight token refresh queue on 401 Unauthorized
 * - Zod boundary validation for critical responses
 * - Standardized ApiClientError with fieldErrors parsing
 */

import {
  ApiClientError,
  UserProfile,
  TokenResponse,
  DashboardMetrics,
  BackendEnquiry,
  FollowupsCountResponse,
  EnquirySubmitResponse,
  PublicStatisticsResponseSchema,
  DashboardMetricsSchema,
  TokenResponseSchema,
  UserProfileSchema,
  EnquirySubmitResponseSchema,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_PREFIX = '/api/v1';
const TOKEN_KEY = 'lotus_access_token';
const DEFAULT_TIMEOUT_MS = 10000;

// In-memory token storage (with localStorage fallback for page refreshes)
let inMemoryAccessToken: string | null = null;

try {
  inMemoryAccessToken = localStorage.getItem(TOKEN_KEY);
} catch {
  // Ignore in environments without localStorage
}

export const getAccessToken = (): string | null => inMemoryAccessToken;

export const setAccessToken = (token: string | null): void => {
  inMemoryAccessToken = token;
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore localStorage write failures
  }
};

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (cleanEndpoint.startsWith(API_PREFIX)) {
    return `${API_BASE_URL}${cleanEndpoint}`;
  }
  return `${API_BASE_URL}${API_PREFIX}${cleanEndpoint}`;
};

// Queue to handle multiple concurrent 401s during refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(undefined);
    }
  });
  failedQueue = [];
};

/**
 * Robust HTTP Fetcher with Timeout, Retries, Request IDs, and 401 Refresh
 */
export async function request<T>(
  endpoint: string,
  options: RequestInit & { timeoutMs?: number; skipAuthRefresh?: boolean } = {}
): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const url = getApiUrl(endpoint);
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const isGet = method === 'GET';

  // Exponential backoff retry loop for idempotent GET requests
  const maxAttempts = isGet ? 3 : 1;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Generate/Attach Request ID
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'X-Request-ID': requestId,
      ...((options.headers as Record<string, string>) || {}),
    };

    if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const token = getAccessToken();
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        credentials: 'include', // Includes HttpOnly cookies for refresh token rotation
      });

      clearTimeout(timeoutId);

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      // Parse Response Body
      let data: any;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Handle 401 Unauthorized with Single-Flight Silent Refresh
      if (response.status === 401 && !options.skipAuthRefresh && getAccessToken()) {
        if (isRefreshing) {
          // Wait in queue while refresh is in progress
          await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          // Re-try original request once refreshed
          return request<T>(endpoint, { ...options, skipAuthRefresh: true });
        }

        isRefreshing = true;

        try {
          const refreshUrl = getApiUrl('/auth/refresh');
          const refreshRes = await fetch(refreshUrl, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
            credentials: 'include',
          });

          if (!refreshRes.ok) {
            throw new Error('Refresh token invalid or expired');
          }

          const refreshData = await refreshRes.json();
          const newToken = refreshData.access_token;
          setAccessToken(newToken);
          processQueue(null);

          // Retry initial request with new token
          return request<T>(endpoint, { ...options, skipAuthRefresh: true });
        } catch (refreshErr) {
          setAccessToken(null);
          processQueue(refreshErr as Error);
          throw new ApiClientError('Session expired. Please sign in again.', {
            status: 401,
            code: 'SESSION_EXPIRED',
            requestId,
          });
        } finally {
          isRefreshing = false;
        }
      }

      // Handle HTTP Errors
      if (!response.ok) {
        let fieldErrors: Record<string, string> | undefined;

        // Extract Pydantic 422 validation errors into friendly key-value map
        if (response.status === 422 && Array.isArray(data?.detail)) {
          fieldErrors = {};
          data.detail.forEach((err: any) => {
            const field = err.loc?.[err.loc.length - 1];
            if (field) {
              fieldErrors![String(field)] = err.msg || 'Invalid field value';
            }
          });
        }

        const message =
          data?.message ||
          (typeof data?.detail === 'string' ? data.detail : null) ||
          `Request failed with status ${response.status}`;

        throw new ApiClientError(message, {
          status: response.status,
          code: data?.error_code,
          fieldErrors,
          requestId,
          details: data,
        });
      }

      return data as T;
    } catch (err: any) {
      clearTimeout(timeoutId);

      // Handle Abort / Timeout Error
      if (err.name === 'AbortError') {
        lastError = new ApiClientError(`Request timeout after ${timeoutMs}ms`, {
          status: 408,
          code: 'TIMEOUT',
          requestId,
        });
      } else if (err instanceof ApiClientError) {
        // Do not retry client 4xx errors
        throw err;
      } else {
        lastError = new ApiClientError(err.message || 'Network connectivity error', {
          status: 0,
          code: 'NETWORK_ERROR',
          requestId,
        });
      }

      // Retry with exponential delay (300ms, 600ms) on GET
      if (attempt < maxAttempts) {
        await new Promise((res) => setTimeout(res, attempt * 300));
      }
    }
  }

  throw lastError;
}

/**
 * Type-Safe Domain Client
 */
export const api = {
  // 1. Authentication
  auth: {
    register: async (payload: { full_name: string; email: string; password: string; role?: string }): Promise<any> => {
      const data = await request<unknown>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
        skipAuthRefresh: true,
      });
      return data;
    },

    login: async (email: string, password: string): Promise<TokenResponse> => {
      const data = await request<unknown>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        skipAuthRefresh: true,
      });
      const parsed = TokenResponseSchema.parse(data);
      setAccessToken(parsed.access_token);
      return parsed;
    },

    getMe: async (): Promise<UserProfile> => {
      const data = await request<unknown>('/auth/me', {
        method: 'GET',
      });
      return UserProfileSchema.parse(data);
    },

    refreshToken: async (token?: string): Promise<TokenResponse> => {
      const data = await request<unknown>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify(token ? { refresh_token: token } : {}),
        skipAuthRefresh: true,
      });
      const parsed = TokenResponseSchema.parse(data);
      setAccessToken(parsed.access_token);
      return parsed;
    },

    logout: async (): Promise<void> => {
      try {
        await request('/auth/logout', { method: 'POST', skipAuthRefresh: true });
      } catch {
        // Ignore logout errors
      } finally {
        setAccessToken(null);
      }
    },

    changePassword: async (old_password: string, new_password: string): Promise<void> => {
      await request('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ old_password, new_password }),
      });
    },

    setupMfa: async (): Promise<{ secret: string; otpauth_url: string; qr_svg: string; recovery_codes: string[] }> => {
      const res = await request<any>('/auth/mfa/setup', { method: 'POST' });
      return res?.data || res;
    },

    verifyMfa: async (code: string): Promise<{ success: boolean; recovery_codes: string[] }> => {
      const res = await request<any>('/auth/mfa/verify', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      return res?.data || res;
    },

    validateMfaLogin: async (mfa_token: string, code: string): Promise<TokenResponse> => {
      const res = await request<unknown>('/auth/mfa/validate', {
        method: 'POST',
        body: JSON.stringify({ mfa_token, code }),
        skipAuthRefresh: true,
      });
      const parsed = TokenResponseSchema.parse(res);
      setAccessToken(parsed.access_token);
      return parsed;
    },

    forgotPassword: async (email: string): Promise<void> => {
      await request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        skipAuthRefresh: true,
      });
    },

    resetPassword: async (token: string, new_password: string): Promise<void> => {
      await request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, new_password }),
        skipAuthRefresh: true,
      });
    },
  },

  // 2. Public Endpoints
  public: {
    checkHealth: async () => {
      return request<{
        status: string;
        environment: string;
        database: string;
        version: string;
        timestamp: string;
      }>('/health');
    },

    getStatistics: async () => {
      const res = await request<any>('/statistics');
      const parsed = PublicStatisticsResponseSchema.safeParse(res);
      if (parsed.success) {
        return parsed.data.data;
      }
      return (res?.data || []) as any[];
    },

    getServices: async () => {
      const res = await request<any>('/services');
      return res?.data || [];
    },

    getPageContent: async (slug: string) => {
      const res = await request<any>(`/content/pages/${slug}`);
      return res?.data;
    },

    getPreviewContent: async (token: string) => {
      const res = await request<any>(`/content/preview/${token}`);
      return res?.data;
    },

    getInsights: async () => {
      const res = await request<any>('/content/insights');
      return res?.data || [];
    },

    getInsightBySlug: async (slug: string) => {
      const res = await request<any>(`/content/insights/${slug}`);
      return res?.data;
    },

    getContactInfo: async () => {
      const res = await request<any>('/contact');
      return res?.data;
    },

    getFaqs: async () => {
      const res = await request<any>('/faqs');
      return res?.data || [];
    },

    getSeo: async (slug: string) => {
      const res = await request<any>(`/seo/${slug}`);
      return res?.data;
    },

    submitEnquiry: async (payload: {
      name?: string;
      full_name?: string;
      mobile: string;
      email?: string | null;
      service: string;
      service_detail?: string[];
      organisation_name?: string | null;
      city?: string | null;
      existing_rohini_id?: string | null;
      contact_method?: string;
      message?: string | null;
      consent: boolean;
      source_path?: string;
      utm_source?: string | null;
      utm_medium?: string | null;
      utm_campaign?: string | null;
    }): Promise<EnquirySubmitResponse> => {
      const res = await request<unknown>('/enquiries', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return EnquirySubmitResponseSchema.parse(res);
    },

    verifyEnquiryRef: async (ref: string) => {
      return request<{
        success: boolean;
        valid: boolean;
        enquiry_id: string;
        reference_id: string;
        status: string;
      }>(`/enquiries/verify-ref/${ref}`);
    },
  },

  // 3. Admin Endpoints
  admin: {
    getDashboard: async (params?: {
      range?: string;
      from?: string;
      to?: string;
      service?: string;
      assignee?: string;
      include_demo?: boolean;
    }): Promise<DashboardMetrics> => {
      const qs = new URLSearchParams();
      if (params?.range) qs.set('range', params.range);
      if (params?.from) qs.set('from', params.from);
      if (params?.to) qs.set('to', params.to);
      if (params?.service) qs.set('service', params.service);
      if (params?.assignee) qs.set('assignee', params.assignee);
      if (params?.include_demo !== undefined) qs.set('include_demo', String(params.include_demo));
      const queryStr = qs.toString();
      const res = await request<any>(`/admin/dashboard${queryStr ? `?${queryStr}` : ''}`);
      if (res?.data) {
        const parsed = DashboardMetricsSchema.safeParse(res.data);
        if (parsed.success) return parsed.data;
        return res.data as DashboardMetrics;
      }
      return res as DashboardMetrics;
    },

    getFollowupsCount: async (): Promise<FollowupsCountResponse> => {
      const res = await request<any>('/admin/followups/count');
      return res?.data || res;
    },

    scheduleFollowup: async (payload: {
      enquiry_id: number;
      due_at: string;
      topic?: string;
      notes?: string;
      assignee_id?: number | null;
    }) => {
      const res = await request<any>('/admin/followups', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return res?.data || res;
    },

    markFollowupDone: async (id: number | string) => {
      const res = await request<any>(`/admin/followups/${id}/done`, {
        method: 'PATCH',
      });
      return res?.data || res;
    },

    getEnquiries: async (params?: {
      page?: number;
      page_size?: number;
      search?: string;
      status?: string;
      service_slug?: string;
      is_deleted?: boolean;
    }): Promise<{
      items: BackendEnquiry[];
      total: number;
      page: number;
      page_size: number;
      total_pages: number;
    }> => {
      const qs = new URLSearchParams();
      if (params?.page) qs.set('page', String(params.page));
      if (params?.page_size) qs.set('page_size', String(params.page_size));
      if (params?.search) qs.set('search', params.search);
      if (params?.status) qs.set('status', params.status);
      if (params?.service_slug) qs.set('service_slug', params.service_slug);
      if (params?.is_deleted !== undefined) qs.set('is_deleted', String(params.is_deleted));
      const queryStr = qs.toString();
      return request(`/admin/enquiries${queryStr ? `?${queryStr}` : ''}`);
    },

    createEnquiry: async (payload: {
      full_name?: string;
      name?: string;
      mobile: string;
      email?: string;
      service?: string;
      service_detail?: string[];
      message?: string;
      source?: string;
      contact_method?: string;
      assigned_to?: number;
      status?: string;
      first_followup_at?: string;
      consent: boolean;
      allow_duplicate?: boolean;
    }): Promise<BackendEnquiry> => {
      const res = await request<any>('/admin/enquiries', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return res?.data || res;
    },

    checkMobile: async (mobile: string): Promise<BackendEnquiry | null> => {
      const res = await request<any>(`/admin/enquiries/check-mobile?mobile=${encodeURIComponent(mobile)}`);
      return res?.data || null;
    },

    deleteEnquiry: async (id: number | string, reason?: string): Promise<BackendEnquiry> => {
      const res = await request<any>(`/admin/enquiries/${id}${reason ? `?reason=${encodeURIComponent(reason)}` : ''}`, {
        method: 'DELETE',
      });
      return res?.data || res;
    },

    restoreEnquiry: async (id: number | string): Promise<BackendEnquiry> => {
      const res = await request<any>(`/admin/enquiries/${id}/restore`, {
        method: 'POST',
      });
      return res?.data || res;
    },

    permanentDeleteEnquiry: async (id: number | string): Promise<void> => {
      await request<any>(`/admin/enquiries/${id}/permanent?confirm=true`, {
        method: 'DELETE',
      });
    },

    getEnquiry: async (id: number | string): Promise<BackendEnquiry> => {
      const res = await request<any>(`/admin/enquiries/${id}`);
      return res?.data || res;
    },

    updateEnquiry: async (
      id: number | string,
      data: {
        status?: 'new' | 'contacted' | 'in_progress' | 'resolved' | 'closed';
        assigned_to?: number | null;
        admin_notes?: string | null;
      }
    ): Promise<BackendEnquiry> => {
      const res = await request<any>(`/admin/enquiries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return res?.data || res;
    },

    getStatistics: async () => {
      const res = await request<any>('/admin/statistics');
      return res?.data || [];
    },

    updateStatistic: async (id: number, data: any) => {
      const res = await request<any>(`/admin/statistics/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return res?.data || res;
    },

    getContent: async (params?: {
      page?: number;
      page_size?: number;
      content_type?: string;
      status?: string;
    }) => {
      const qs = new URLSearchParams();
      if (params?.page) qs.set('page', String(params.page));
      if (params?.page_size) qs.set('page_size', String(params.page_size));
      if (params?.content_type) qs.set('content_type', params.content_type);
      if (params?.status) qs.set('status', params.status);
      const queryStr = qs.toString();
      return request(`/admin/content${queryStr ? `?${queryStr}` : ''}`);
    },

    createContent: async (data: any) => {
      const res = await request<any>('/admin/content', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res?.data || res;
    },

    updateContent: async (id: number, data: any) => {
      const res = await request<any>(`/admin/content/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return res?.data || res;
    },

    createPreviewToken: async (id: number) => {
      const res = await request<any>(`/admin/content/${id}/preview-token`, {
        method: 'POST',
      });
      return res?.data || res;
    },

    archiveContent: async (id: number) => {
      return request(`/admin/content/${id}`, {
        method: 'DELETE',
      });
    },

    getUsers: async () => {
      const res = await request<any>('/admin/users');
      return res?.data || [];
    },

    createUser: async (data: any) => {
      const res = await request<any>('/admin/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res?.data || res;
    },

    updateUser: async (id: number, data: any) => {
      const res = await request<any>(`/admin/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return res?.data || res;
    },

    getAuditLogs: async (params?: { page?: number; page_size?: number }) => {
      const qs = new URLSearchParams();
      if (params?.page) qs.set('page', String(params.page));
      if (params?.page_size) qs.set('page_size', String(params.page_size));
      const queryStr = qs.toString();
      return request(`/admin/audit-logs${queryStr ? `?${queryStr}` : ''}`);
    },

    getMedia: async (params?: { page?: number; page_size?: number }) => {
      const qs = new URLSearchParams();
      if (params?.page) qs.set('page', String(params.page));
      if (params?.page_size) qs.set('page_size', String(params.page_size));
      const queryStr = qs.toString();
      return request(`/admin/media${queryStr ? `?${queryStr}` : ''}`);
    },

    uploadMedia: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await request<any>('/admin/media/upload', {
        method: 'POST',
        body: formData,
      });
      return res?.data || res;
    },

    deleteMedia: async (id: number) => {
      return request(`/admin/media/${id}`, {
        method: 'DELETE',
      });
    },
  },
};
