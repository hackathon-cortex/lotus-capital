/**
 * Central Query Key Factory for TanStack Query
 * Enables precise cache invalidation and scoping
 */

export const queryKeys = {
  health: ['health'] as const,
  statistics: {
    public: ['statistics', 'public'] as const,
    admin: ['statistics', 'admin'] as const,
  },
  services: ['services'] as const,
  content: {
    page: (slug: string) => ['content', 'page', slug] as const,
    preview: (token: string) => ['content', 'preview', token] as const,
    insights: ['content', 'insights'] as const,
    insight: (slug: string) => ['content', 'insight', slug] as const,
    faqs: ['content', 'faqs'] as const,
    contact: ['content', 'contact'] as const,
    seo: (slug: string) => ['seo', slug] as const,
  },
  auth: {
    me: ['auth', 'me'] as const,
  },
  admin: {
    dashboard: ['admin', 'dashboard'] as const,
    enquiries: (params?: any) => ['admin', 'enquiries', params] as const,
    enquiry: (id: string | number) => ['admin', 'enquiry', id] as const,
    content: (params?: any) => ['admin', 'content', params] as const,
    users: ['admin', 'users'] as const,
    auditLogs: (params?: any) => ['admin', 'audit-logs', params] as const,
    media: (params?: any) => ['admin', 'media', params] as const,
  },
};

