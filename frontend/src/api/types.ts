import { z } from 'zod';

// ============================================================
// 1. Zod Boundary Validation Schemas
// ============================================================

export const ApiErrorResponseSchema = z.object({
  success: z.literal(false).optional(),
  error_code: z.string().optional(),
  message: z.string().optional(),
  detail: z.union([z.string(), z.array(z.any())]).optional(),
  details: z.record(z.any()).optional(),
  request_id: z.string().optional(),
});

export const StatisticPublicItemSchema = z.object({
  statistic_key: z.string(),
  label: z.string(),
  value: z.string(),
  definition: z.string().nullable().optional(),
  as_of_date: z.string().nullable().optional(),
});

export const PublicStatisticsResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  data: z.array(StatisticPublicItemSchema),
});

export const EnquirySubmitResponseSchema = z.object({
  success: z.boolean().optional(),
  enquiry_id: z.string().optional(),
  reference_id: z.string().optional(),
  message: z.string().optional(),
  status: z.string().optional(),
});

export const UserProfileSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  email: z.string().email(),
  role: z.enum(['super_admin', 'admin', 'editor']),
  is_active: z.boolean(),
  is_superuser: z.boolean().optional(),
  created_at: z.string().optional(),
  last_login_at: z.string().nullable().optional(),
});

export const TokenResponseSchema = z.object({
  access_token: z.string().optional().default(''),
  refresh_token: z.string().optional().default(''),
  token_type: z.string().default('bearer'),
  mfa_required: z.boolean().optional().default(false),
  mfa_token: z.string().optional(),
  user: UserProfileSchema.optional(),
});

export const BackendEnquirySchema = z.object({
  id: z.number(),
  reference_id: z.string(),
  name: z.string(),
  full_name: z.string().optional(),
  mobile: z.string(),
  email: z.string().nullable().optional(),
  contact_method: z.string().default('phone'),
  message: z.string().nullable().optional(),
  consent: z.boolean(),
  status: z.enum(['new', 'contacted', 'in_progress', 'resolved', 'closed']),
  assigned_to: z.number().nullable().optional(),
  admin_notes: z.string().nullable().optional(),
  is_demo: z.boolean().default(false).optional(),
  created_via: z.string().default('public_form').optional(),
  source: z.string().nullable().optional(),
  deleted_at: z.string().nullable().optional(),
  deleted_by: z.number().nullable().optional(),
  delete_reason: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  services: z.array(
    z.object({
      service_slug: z.string(),
      service_detail: z.string().nullable().optional(),
    })
  ).default([]),
});

export const SummaryMetricsSchema = z.object({
  new_this_month: z.number(),
  new_today: z.number(),
  converted_this_month: z.number(),
  in_progress_total: z.number(),
  avg_first_response_hours: z.number().nullable().optional(),
  change_pct: z.number().nullable().optional(),
  previous_period_count: z.number(),
  current_period_count: z.number(),
  total_leads: z.number(),
});

export const ServiceConversionMetricSchema = z.object({
  service_slug: z.string(),
  name: z.string(),
  count: z.number(),
  converted_count: z.number(),
  conversion_rate: z.number().nullable().optional(),
});

export const MonthlyDataPointSchema = z.object({
  month_key: z.string(),
  month_label: z.string(),
  enquiries: z.number(),
  conversions: z.number(),
});

export const SourceMetricSchema = z.object({
  source: z.string(),
  label: z.string(),
  count: z.number(),
});

export const DueFollowupItemSchema = z.object({
  id: z.number(),
  enquiry_id: z.number(),
  reference_id: z.string(),
  client_name: z.string(),
  phone: z.string(),
  service_slug: z.string().nullable().optional(),
  service_name: z.string().nullable().optional(),
  due_at: z.string(),
  assignee_id: z.number().nullable().optional(),
  assignee_name: z.string().nullable().optional(),
  topic: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  is_overdue: z.boolean().default(false),
});

export const FollowupsCountResponseSchema = z.object({
  count: z.number(),
  due_today: z.number(),
  overdue: z.number(),
  upcoming: z.number(),
});

export const DashboardMetricsSchema = z.object({
  total_enquiries: z.number(),
  new_enquiries: z.number(),
  in_progress_enquiries: z.number(),
  resolved_enquiries: z.number(),
  service_breakdown: z.array(
    z.object({
      service_slug: z.string(),
      count: z.number(),
    })
  ),
  monthly_trends: z.array(
    z.object({
      month: z.string(),
      count: z.number(),
    })
  ),
  recent_enquiries: z.array(BackendEnquirySchema),

  summary: SummaryMetricsSchema.optional(),
  by_status: z.record(z.string(), z.number()).optional(),
  by_service: z.array(ServiceConversionMetricSchema).optional(),
  by_month: z.array(MonthlyDataPointSchema).optional(),
  by_source: z.array(SourceMetricSchema).optional(),
  latest_enquiries: z.array(BackendEnquirySchema).optional(),
  follow_ups_due: z.array(DueFollowupItemSchema).optional(),
  generated_at: z.string().optional(),
});

// ============================================================
// 2. TypeScript Types Inferred from Zod
// ============================================================

export type StatisticPublicItem = z.infer<typeof StatisticPublicItemSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type TokenResponse = z.infer<typeof TokenResponseSchema>;
export type BackendEnquiry = z.infer<typeof BackendEnquirySchema>;
export type SummaryMetrics = z.infer<typeof SummaryMetricsSchema>;
export type ServiceConversionMetric = z.infer<typeof ServiceConversionMetricSchema>;
export type MonthlyDataPoint = z.infer<typeof MonthlyDataPointSchema>;
export type SourceMetric = z.infer<typeof SourceMetricSchema>;
export type DueFollowupItem = z.infer<typeof DueFollowupItemSchema>;
export type FollowupsCountResponse = z.infer<typeof FollowupsCountResponseSchema>;
export type DashboardMetrics = z.infer<typeof DashboardMetricsSchema>;
export type EnquirySubmitResponse = z.infer<typeof EnquirySubmitResponseSchema>;

// Frontend Lead UI Representation
export interface EnquiryRow {
  id: string;
  name: string;
  phone: string;
  service: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'In Progress' | 'Converted' | 'Closed';
  assignee: string;
  followUpDate: string;
  updated?: boolean;
}

// Custom Standardized API Client Error
export class ApiClientError extends Error {
  public status: number;
  public code: string;
  public fieldErrors?: Record<string, string>;
  public requestId?: string;
  public details?: any;

  constructor(
    message: string,
    options: {
      status?: number;
      code?: string;
      fieldErrors?: Record<string, string>;
      requestId?: string;
      details?: any;
    } = {}
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = options.status || 500;
    this.code = options.code || (this.status === 404 ? 'NOT_FOUND' : this.status === 422 ? 'VALIDATION_ERROR' : this.status === 429 ? 'RATE_LIMITED' : this.status === 401 ? 'UNAUTHORIZED' : this.status === 403 ? 'FORBIDDEN' : 'API_ERROR');
    this.fieldErrors = options.fieldErrors;
    this.requestId = options.requestId;
    this.details = options.details;
  }
}

