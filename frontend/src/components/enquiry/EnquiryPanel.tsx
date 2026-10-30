import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { enquirySchema, EnquiryFormData } from './EnquiryForm';
import contactData from '@content/data/contact.json';
import { LotusLogo } from '../common/LotusLogo';

export interface ServiceDetailOption {
  id: string;
  label: string;
}

export interface EnquiryPanelProps {
  defaultService?: 'general-insurance' | 'life-insurance' | 'health-insurance' | 'mutual-funds' | 'equity' | 'other-solutions';
  serviceDetailOptions?: ServiceDetailOption[];
  selectedServiceDetails?: string[];
  onServiceDetailChange?: (details: string[]) => void;
  title?: string;
  subtitle?: string;
  reassuranceLines?: string[];
  className?: string;
}

const DEFAULT_OPTIONS: ServiceDetailOption[] = [
  { id: 'vehicle', label: 'Vehicle' },
  { id: 'property', label: 'Property' },
  { id: 'marine', label: 'Marine' },
  { id: 'liability', label: 'Liability' },
  { id: 'business', label: 'Business' },
  { id: 'travel', label: 'Travel' },
];

export const EnquiryPanel: React.FC<EnquiryPanelProps> = ({
  defaultService = 'general-insurance',
  serviceDetailOptions = DEFAULT_OPTIONS,
  selectedServiceDetails: externalSelectedDetails,
  onServiceDetailChange,
  title = 'Request a General Insurance quotation',
  subtitle = 'Share your vehicle or asset details for a transparent quote.',
  reassuranceLines = [
    'Direct consultation with our licensed advisor in Godhra',
    'No automated robo-calls or spam',
    'Personalised coverage & IDV evaluation',
  ],
  className = '',
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Internal chip selection state if not controlled externally
  const [internalDetails, setInternalDetails] = useState<string[]>(
    externalSelectedDetails || (serviceDetailOptions.length > 0 ? [serviceDetailOptions[0].id] : [])
  );

  const selectedDetails = externalSelectedDetails !== undefined ? externalSelectedDetails : internalDetails;

  const toggleDetail = (id: string) => {
    let next: string[];
    if (selectedDetails.includes(id)) {
      next = selectedDetails.filter((d) => d !== id);
    } else {
      next = [...selectedDetails, id];
    }
    setInternalDetails(next);
    if (onServiceDetailChange) {
      onServiceDetailChange(next);
    }
  };

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      full_name: '',
      mobile: '',
      email: '',
      service: defaultService,
      service_detail: selectedDetails,
      message: '',
      contact_method: 'phone',
      consent: false as any,
    },
    mode: 'onChange',
  });

  // Watch required fields for progress ring calculation
  const watchName = watch('full_name') || '';
  const watchMobile = watch('mobile') || '';
  const watchConsent = watch('consent');
  const watchContactMethod = watch('contact_method') || 'phone';

  // Keep form service_detail in sync with selected chips
  useEffect(() => {
    setValue('service_detail', selectedDetails);
  }, [selectedDetails, setValue]);

  // Calculate completeness score (0 to 3)
  const isNameValid = watchName.trim().length >= 2;
  const isMobileValid = /^[6-9]\d{9}$/.test(watchMobile.trim());
  const isConsentValid = watchConsent === true;

  const validScore = (isNameValid ? 1 : 0) + (isMobileValid ? 1 : 0) + (isConsentValid ? 1 : 0);
  const progressPercent = Math.round((validScore / 3) * 100);

  // SVG ring constants
  const ringRadius = 18;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = ringCircumference - (progressPercent / 100) * ringCircumference;

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    const payload = {
      ...data,
      service_detail: selectedDetails,
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
            'Failed to submit enquiry. Please call our office directly.'
        );
      }

      const res = await response.json();
      setSubmittedRef(res.enquiry_id);

      // Delay navigation slightly so user sees the drawing lotus confirmation
      setTimeout(() => {
        navigate(`/enquiry/thank-you?ref=${encodeURIComponent(res.enquiry_id)}`);
      }, 1600);
    } catch (err: any) {
      setServerError(err.message || 'An error occurred. Please call our office at +91 93288 52555.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`enquiry-panel-section section-padding ${className}`} id="enquiry" style={{ padding: '4rem 1.5rem' }}>
      <div
        className="container"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div
          className="enquiry-split-card"
          style={{
            position: 'relative',
            borderRadius: '32px',
            backgroundColor: 'var(--white, #ffffff)',
            boxShadow: '0 20px 50px rgba(10,37,64,0.12), 0 2px 8px rgba(10,37,64,0.06)',
            border: '1px solid var(--silver-300, #d7d9dc)',
            overflow: 'hidden',
            minHeight: '520px',
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 4fr) minmax(420px, 6fr)',
          }}
        >
          {/* Submission Confirmation Overlay (Flip / Crossfade) */}
          {submittedRef && (
            <div
              className="enquiry-success-overlay"
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'var(--navy-950, #051329)',
                color: 'var(--white, #ffffff)',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2.5rem',
                animation: 'fadeIn 0.4s ease-out forwards',
              }}
            >
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Drawing Lotus Bloom SVG */}
                <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="46" stroke="#d9232d" strokeWidth="2.5" strokeDasharray="300" strokeDashoffset="0" opacity="0.4" />
                  <path
                    d="M50 18 C56 34 68 46 82 50 C68 54 56 66 50 82 C44 66 32 54 18 50 C32 46 44 34 50 18 Z"
                    fill="rgba(217, 35, 45, 0.2)"
                    stroke="#d9232d"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: 260,
                      strokeDashoffset: 0,
                      animation: 'dash 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    }}
                  />
                  <path
                    d="M40 50 L47 57 L62 42"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span
                style={{
                  fontSize: '0.8rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--silver-300, #d7d9dc)',
                  marginBottom: '0.5rem',
                }}
              >
                ENQUIRY RECEIVED
              </span>

              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '2rem',
                  marginBottom: '0.75rem',
                  color: 'var(--white, #ffffff)',
                }}
              >
                Thank You!
              </h3>

              <p style={{ color: 'var(--silver-300, #d7d9dc)', maxWidth: '440px', lineHeight: 1.6, fontSize: '0.96rem', marginBottom: '1.25rem' }}>
                Your enquiry reference is <strong style={{ color: '#ffffff', letterSpacing: '0.04em' }}>{submittedRef}</strong>. Our licensed advisor will contact you during business hours.
              </p>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.82rem',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                <span className="spinner-border spinner-border-sm" style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span>Redirecting to confirmation page...</span>
              </div>
            </div>
          )}

          {/* Left 40% Navy Brand & Reassurance Panel */}
          <div
            className="enquiry-navy-pane"
            style={{
              backgroundColor: 'var(--navy-950, #051329)',
              padding: '2.5rem 2.25rem',
              color: 'var(--white, #ffffff)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Watermark Lotus */}
            <div
              style={{
                position: 'absolute',
                right: '-40px',
                bottom: '-40px',
                width: '300px',
                height: '300px',
                opacity: 0.06,
                pointerEvents: 'none',
              }}
            >
              <LotusLogo variant="watermark" />
            </div>

            <div>
              <span
                style={{
                  display: 'inline-block',
                  color: 'var(--silver-300, #d7d9dc)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                DIRECT ADVISORY • GODHRA
              </span>

              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(1.5rem, 2.2vw, 1.95rem)',
                  lineHeight: 1.25,
                  fontWeight: 700,
                  color: 'var(--white, #ffffff)',
                  marginBottom: '1rem',
                }}
              >
                {title}
              </h3>

              <p
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--silver-300, #d7d9dc)',
                  lineHeight: 1.55,
                  marginBottom: '1.75rem',
                }}
              >
                {subtitle}
              </p>

              {/* Reassurance List */}
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 2rem 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                {reassuranceLines.map((line, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.65rem',
                      fontSize: '0.86rem',
                      lineHeight: 1.45,
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(217, 35, 45, 0.25)',
                        color: 'var(--red-400, #f87171)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: '1px',
                      }}
                    >
                      ✓
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct Contact Footer */}
            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,0.12)',
                paddingTop: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
                fontSize: '0.84rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--silver-300, #d7d9dc)' }}>Call Office:</span>
                <a
                  href={`tel:${contactData.phone}`}
                  style={{ color: 'var(--white, #ffffff)', fontWeight: 600, textDecoration: 'none' }}
                >
                  {contactData.phoneDisplay}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--silver-300, #d7d9dc)' }}>Email:</span>
                <a
                  href={`mailto:${contactData.email}`}
                  style={{ color: 'var(--silver-300, #d7d9dc)', textDecoration: 'none', wordBreak: 'break-all' }}
                >
                  {contactData.email}
                </a>
              </div>
            </div>
          </div>

          {/* Right 60% Compact Form */}
          <div
            className="enquiry-form-pane"
            style={{
              padding: '2rem 2.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {serverError && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(217, 35, 45, 0.1)',
                  color: 'var(--red-500, #d9232d)',
                  fontSize: '0.84rem',
                  marginBottom: '1rem',
                  border: '1px solid rgba(217, 35, 45, 0.25)',
                }}
              >
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {/* Row 1: Name + Mobile */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label htmlFor="panel_full_name" style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--navy-900, #0a2540)', marginBottom: '0.25rem' }}>
                    Full Name <span style={{ color: 'var(--red-500, #d9232d)' }}>*</span>
                  </label>
                  <input
                    id="panel_full_name"
                    type="text"
                    placeholder="e.g. Ramesh Patel"
                    {...register('full_name')}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      borderRadius: '12px',
                      border: `1px solid ${errors.full_name ? 'var(--red-500, #d9232d)' : 'var(--silver-300, #d7d9dc)'}`,
                      fontSize: '0.88rem',
                      outline: 'none',
                      backgroundColor: '#fbfcfd',
                    }}
                  />
                  {errors.full_name && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--red-500, #d9232d)', marginTop: '0.2rem', display: 'block' }}>
                      {errors.full_name.message}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="panel_mobile" style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--navy-900, #0a2540)', marginBottom: '0.25rem' }}>
                    Mobile Number <span style={{ color: 'var(--red-500, #d9232d)' }}>*</span>
                  </label>
                  <input
                    id="panel_mobile"
                    type="tel"
                    placeholder="10-digit mobile"
                    maxLength={10}
                    {...register('mobile')}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      borderRadius: '12px',
                      border: `1px solid ${errors.mobile ? 'var(--red-500, #d9232d)' : 'var(--silver-300, #d7d9dc)'}`,
                      fontSize: '0.88rem',
                      outline: 'none',
                      backgroundColor: '#fbfcfd',
                    }}
                  />
                  {errors.mobile && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--red-500, #d9232d)', marginTop: '0.2rem', display: 'block' }}>
                      {errors.mobile.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 2: Email + Preferred Contact Method */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '0.85rem', alignItems: 'start' }}>
                <div>
                  <label htmlFor="panel_email" style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--navy-900, #0a2540)', marginBottom: '0.25rem' }}>
                    Email Address <span style={{ color: 'var(--muted, #556270)', fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <input
                    id="panel_email"
                    type="email"
                    placeholder="ramesh@example.com"
                    {...register('email')}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      borderRadius: '12px',
                      border: `1px solid ${errors.email ? 'var(--red-500, #d9232d)' : 'var(--silver-300, #d7d9dc)'}`,
                      fontSize: '0.88rem',
                      outline: 'none',
                      backgroundColor: '#fbfcfd',
                    }}
                  />
                  {errors.email && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--red-500, #d9232d)', marginTop: '0.2rem', display: 'block' }}>
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--navy-900, #0a2540)', marginBottom: '0.25rem' }}>
                    Preferred Contact
                  </label>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {(['phone', 'whatsapp', 'email'] as const).map((method) => {
                      const isChecked = watchContactMethod === method;
                      const labelText = method === 'phone' ? 'Phone' : method === 'whatsapp' ? 'WhatsApp' : 'Email';
                      return (
                        <label
                          key={method}
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            cursor: 'pointer',
                            padding: '0.55rem 0.35rem',
                            borderRadius: '10px',
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            backgroundColor: isChecked ? 'var(--navy-900, #0a2540)' : 'var(--silver-100, #f8f9fa)',
                            color: isChecked ? '#ffffff' : 'var(--navy-700, #0d2b4a)',
                            border: `1px solid ${isChecked ? 'var(--navy-900, #0a2540)' : 'var(--silver-300, #d7d9dc)'}`,
                            userSelect: 'none',
                            transition: 'all 0.16s ease',
                          }}
                        >
                          <input
                            type="radio"
                            value={method}
                            {...register('contact_method')}
                            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                          />
                          {labelText}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Row 3: Insurance-Type Chips (Multi-Select) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--navy-900, #0a2540)', marginBottom: '0.35rem' }}>
                  Coverage Needs <span style={{ color: 'var(--muted, #556270)', fontWeight: 400 }}>(Select all applicable)</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {serviceDetailOptions.map((opt) => {
                    const isSelected = selectedDetails.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleDetail(opt.id)}
                        style={{
                          border: 'none',
                          outline: 'none',
                          cursor: 'pointer',
                          padding: '0.38rem 0.85rem',
                          borderRadius: '9999px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          backgroundColor: isSelected ? 'rgba(217, 35, 45, 0.1)' : 'var(--silver-100, #f8f9fa)',
                          color: isSelected ? 'var(--red-600, #b91c1c)' : 'var(--navy-800, #0a2540)',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                          borderColor: isSelected ? 'var(--red-500, #d9232d)' : 'var(--silver-300, #d7d9dc)',
                          transition: 'all 0.18s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <span style={{ fontSize: '0.8rem', lineHeight: 1 }}>{isSelected ? '✓' : '+'}</span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Message (2 rows) */}
              <div>
                <label htmlFor="panel_message" style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--navy-900, #0a2540)', marginBottom: '0.25rem' }}>
                  Message or Asset Notes <span style={{ color: 'var(--muted, #556270)', fontWeight: 400 }}>(Optional)</span>
                </label>
                <textarea
                  id="panel_message"
                  rows={2}
                  placeholder="e.g. 2022 Honda City renew due next month, looking for zero-dep cover"
                  {...register('message')}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '12px',
                    border: '1px solid var(--silver-300, #d7d9dc)',
                    fontSize: '0.86rem',
                    outline: 'none',
                    resize: 'none',
                    backgroundColor: '#fbfcfd',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Row 5: Consent + Submit with circular progress ring */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '0.25rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                    <input
                      type="checkbox"
                      {...register('consent')}
                      style={{ marginTop: '2px', accentColor: 'var(--navy-900, #0a2540)' }}
                    />
                    <span style={{ fontSize: '0.74rem', color: 'var(--muted, #556270)', lineHeight: 1.35 }}>
                      I agree to be contacted by Lotus Capital advisors regarding this quotation enquiry.
                    </span>
                  </label>
                  {errors.consent && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--red-500, #d9232d)', marginTop: '0.2rem', display: 'block' }}>
                      {errors.consent.message}
                    </span>
                  )}
                </div>

                {/* Submit button with circular progress ring */}
                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                  {/* Circular progress SVG */}
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    style={{
                      position: 'absolute',
                      right: '-6px',
                      transform: 'rotate(-90deg)',
                      pointerEvents: 'none',
                    }}
                  >
                    <circle
                      cx="22"
                      cy="22"
                      r={ringRadius}
                      stroke="rgba(215, 217, 220, 0.4)"
                      strokeWidth="3"
                      fill="none"
                    />
                    <circle
                      cx="22"
                      cy="22"
                      r={ringRadius}
                      stroke="var(--red-500, #d9232d)"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      style={{
                        transition: 'stroke-dashoffset 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  </svg>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{
                      padding: '0.65rem 1.65rem 0.65rem 1.4rem',
                      borderRadius: '14px',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      border: 'none',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" style={{ width: '14px', height: '14px' }} />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Quote Request</span>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '9999px',
                            backgroundColor: progressPercent === 100 ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)',
                            fontWeight: 700,
                          }}
                        >
                          {validScore}/3
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

