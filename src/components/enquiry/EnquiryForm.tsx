import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const indianMobileRegex = /^[6-9]\d{9}$/;

export const enquirySchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  mobile: z
    .string()
    .regex(indianMobileRegex, 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  service: z.enum(
    [
      'general-insurance',
      'life-insurance',
      'health-insurance',
      'mutual-funds',
      'equity',
      'other-solutions',
    ],
    { required_error: 'Please select a service' }
  ),
  service_detail: z.array(z.string()).optional(),
  message: z.string().max(1000, 'Message cannot exceed 1000 characters').optional(),
  contact_method: z.enum(['phone', 'whatsapp', 'email']).default('phone'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the privacy notice to proceed' }),
  }),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;

interface EnquiryFormProps {
  defaultService?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  defaultService,
  title = 'Send an Enquiry',
  subtitle = 'Share a few details and our Godhra team will follow up during business hours.',
  compact = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // If query param ?service= is present, it overrides defaultService
  const serviceParam = searchParams.get('service') || defaultService || 'mutual-funds';
  const initialService = [
    'general-insurance',
    'life-insurance',
    'health-insurance',
    'mutual-funds',
    'equity',
    'other-solutions',
  ].includes(serviceParam)
    ? (serviceParam as any)
    : 'mutual-funds';

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      service: initialService,
      contact_method: 'phone',
      consent: false as any,
    },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    const payload = {
      ...data,
      source_path: location.pathname,
      utm_source: searchParams.get('utm_source') || null,
      utm_medium: searchParams.get('utm_medium') || null,
      utm_campaign: searchParams.get('utm_campaign') || null,
    };

    try {
      const response = await fetch('/api/v1/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            errorData.detail ||
            'Failed to submit enquiry. Please try again.'
        );
      }

      const res = await response.json();
      navigate(`/enquiry/thank-you?ref=${encodeURIComponent(res.enquiry_id)}`);
    } catch (err: any) {
      setServerError(err.message || 'An error occurred while submitting. Please call our office.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="card enquiry-card"
      id="enquiry"
      data-testid="enquiry-form-container"
      style={{
        borderRadius: 'var(--radius-card)',
        padding: compact ? '1.75rem' : '2rem',
        boxShadow: 'var(--shadow-soft)',
        backgroundColor: 'var(--white)',
        border: '1px solid var(--silver-300)',
      }}
    >
      {title && (
        <h3 style={{ marginBottom: '0.25rem', fontSize: compact ? '1.25rem' : '1.5rem', color: 'var(--navy-900)' }}>
          {title}
        </h3>
      )}
      {subtitle && (
        <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: compact ? '1rem' : '1.5rem' }}>
          {subtitle}
        </p>
      )}

      {serverError && (
        <div className="badge badge-danger" style={{ display: 'block', padding: '0.75rem', marginBottom: '1rem' }}>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate data-testid="enquiry-form">
        {/* Row 1: Name + Mobile (Split when compact) */}
        <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr 1fr' : '1fr', gap: '0.85rem' }}>
          <div className="form-group" style={{ marginBottom: compact ? '0.75rem' : '1rem' }}>
            <label htmlFor="full_name" className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              Full Name <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              id="full_name"
              type="text"
              className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
              placeholder="e.g. Ramesh Patel"
              style={{ borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
              {...register('full_name')}
            />
            {errors.full_name && (
              <div className="form-error" role="alert" style={{ fontSize: '0.75rem' }}>
                {errors.full_name.message}
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: compact ? '0.75rem' : '1rem' }}>
            <label htmlFor="mobile" className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              Mobile (10 digits) <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              id="mobile"
              type="tel"
              maxLength={10}
              className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
              placeholder="e.g. 9825012345"
              style={{ borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
              {...register('mobile')}
            />
            {errors.mobile && (
              <div className="form-error" role="alert" style={{ fontSize: '0.75rem' }}>
                {errors.mobile.message}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Email + Service (Split when compact) */}
        <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr 1fr' : '1fr', gap: '0.85rem' }}>
          <div className="form-group" style={{ marginBottom: compact ? '0.75rem' : '1rem' }}>
            <label htmlFor="email" className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              Email Address (optional)
            </label>
            <input
              id="email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="name@example.com"
              style={{ borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
              {...register('email')}
            />
            {errors.email && (
              <div className="form-error" role="alert" style={{ fontSize: '0.75rem' }}>
                {errors.email.message}
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: compact ? '0.75rem' : '1rem' }}>
            <label htmlFor="service" className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              Service <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <select
              id="service"
              className={`form-control ${errors.service ? 'is-invalid' : ''}`}
              style={{ borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem', fontSize: '0.88rem' }}
              {...register('service')}
            >
              <option value="general-insurance">General Insurance</option>
              <option value="life-insurance">Life Insurance</option>
              <option value="health-insurance">Health Insurance</option>
              <option value="mutual-funds">Mutual Funds</option>
              <option value="equity">Equity (Religare AP)</option>
              <option value="other-solutions">More Solutions</option>
            </select>
            {errors.service && (
              <div className="form-error" role="alert" style={{ fontSize: '0.75rem' }}>
                {errors.service.message}
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Short Message (2 rows when compact) */}
        <div className="form-group" style={{ marginBottom: compact ? '0.75rem' : '1rem' }}>
          <label htmlFor="message" className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
            Message (optional)
          </label>
          <textarea
            id="message"
            rows={compact ? 2 : 3}
            className={`form-control ${errors.message ? 'is-invalid' : ''}`}
            placeholder="Tell us what you would like to explore..."
            style={{ borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem', fontSize: '0.88rem', resize: 'none' }}
            {...register('message')}
          />
          {errors.message && (
            <div className="form-error" role="alert" style={{ fontSize: '0.75rem' }}>
              {errors.message.message}
            </div>
          )}
        </div>

        {/* Row 4: Preferred Contact Method (Pill Radios) */}
        <div className="form-group" style={{ marginBottom: compact ? '0.75rem' : '1rem' }}>
          <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            Preferred Contact Method
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--silver-300)',
                backgroundColor: 'var(--silver-100)',
                cursor: 'pointer',
              }}
            >
              <input type="radio" value="phone" {...register('contact_method')} />
              Phone Call
            </label>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--silver-300)',
                backgroundColor: 'var(--silver-100)',
                cursor: 'pointer',
              }}
            >
              <input type="radio" value="whatsapp" {...register('contact_method')} />
              WhatsApp
            </label>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--silver-300)',
                backgroundColor: 'var(--silver-100)',
                cursor: 'pointer',
              }}
            >
              <input type="radio" value="email" {...register('contact_method')} />
              Email
            </label>
          </div>
        </div>

        {/* Row 5: Consent Checkbox */}
        <div className="form-group" style={{ marginBottom: compact ? '0.85rem' : '1rem' }}>
          <label className="form-checkbox" style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'grid', gridTemplateColumns: '24px minmax(0, 1fr)', gap: '10px', alignItems: 'flex-start' }}>
            <input type="checkbox" style={{ marginTop: '3px', width: '16px', height: '16px' }} {...register('consent')} />
            <span>
              I consent to Lotus Capital contacting me regarding this enquiry in accordance with the{' '}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {errors.consent && (
            <div className="form-error" role="alert" style={{ fontSize: '0.75rem', paddingLeft: '34px' }}>
              {errors.consent.message}
            </div>
          )}
        </div>

        {/* Row 6: Submit Button */}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', borderRadius: 'var(--radius-btn)', padding: '0.75rem 1.5rem', fontSize: '0.95rem', fontWeight: 600 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}
        </button>
      </form>
    </div>
  );
};

