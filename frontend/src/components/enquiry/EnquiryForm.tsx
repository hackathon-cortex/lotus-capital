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
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  defaultService,
  title = 'Send an Enquiry',
  subtitle = 'Share a few details and our Godhra team will follow up during business hours.',
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
    <div className="card enquiry-card" id="enquiry" data-testid="enquiry-form-container">
      {title && <h3 style={{ marginBottom: '0.25rem' }}>{title}</h3>}
      {subtitle && <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>{subtitle}</p>}

      {serverError && (
        <div className="badge badge-danger" style={{ display: 'block', padding: '0.75rem', marginBottom: '1rem' }}>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate data-testid="enquiry-form">
        <div className="form-group">
          <label htmlFor="full_name" className="form-label">
            Full Name <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <input
            id="full_name"
            type="text"
            className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
            placeholder="e.g. Ramesh Patel"
            {...register('full_name')}
          />
          {errors.full_name && (
            <div className="form-error" role="alert">
              {errors.full_name.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="mobile" className="form-label">
            10-digit Indian Mobile Number <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <input
            id="mobile"
            type="tel"
            maxLength={10}
            className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
            placeholder="e.g. 9825012345"
            {...register('mobile')}
          />
          {errors.mobile && (
            <div className="form-error" role="alert">
              {errors.mobile.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address (optional)
          </label>
          <input
            id="email"
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            placeholder="name@example.com"
            {...register('email')}
          />
          {errors.email && (
            <div className="form-error" role="alert">
              {errors.email.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="service" className="form-label">
            Service of Interest <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <select
            id="service"
            className={`form-control ${errors.service ? 'is-invalid' : ''}`}
            {...register('service')}
          >
            <option value="general-insurance">General Insurance (Motor, Property, Business)</option>
            <option value="life-insurance">Life Insurance (Term, Savings)</option>
            <option value="health-insurance">Health Insurance (Family, Senior, Top-up)</option>
            <option value="mutual-funds">Mutual Funds (SIP, Lump sum)</option>
            <option value="equity">Equity & Investments (Religare AP)</option>
            <option value="other-solutions">More Solutions (Fixed Deposits, Bonds, NPS)</option>
          </select>
          {errors.service && (
            <div className="form-error" role="alert">
              {errors.service.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="message" className="form-label">
            Message (optional)
          </label>
          <textarea
            id="message"
            rows={3}
            className={`form-control ${errors.message ? 'is-invalid' : ''}`}
            placeholder="Tell us what you would like to explore..."
            {...register('message')}
          />
          {errors.message && (
            <div className="form-error" role="alert">
              {errors.message.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Preferred Contact Method</label>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
              <input type="radio" value="phone" {...register('contact_method')} />
              Phone Call
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
              <input type="radio" value="whatsapp" {...register('contact_method')} />
              WhatsApp
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
              <input type="radio" value="email" {...register('contact_method')} />
              Email
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-checkbox">
            <input type="checkbox" {...register('consent')} />
            <span>
              I consent to Lotus Capital contacting me regarding this enquiry in accordance with the{' '}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {errors.consent && (
            <div className="form-error" role="alert">
              {errors.consent.message}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.5rem' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}
        </button>
      </form>
    </div>
  );
};

