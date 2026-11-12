import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useSubmitEnquiry } from '../../data/enquiries';
import contactData from '@content/data/contact.json';
import { LotusLogo } from '../common/LotusLogo';

export interface ServiceDetailOption {
  id: string;
  label: string;
}

export type SupportedService =
  | 'general-insurance'
  | 'life-insurance'
  | 'health-insurance'
  | 'rohini-cashless-empanelment'
  | 'mutual-funds'
  | 'equity'
  | 'other-solutions';

export const ALL_SERVICES_CONFIG: Record<
  SupportedService,
  { label: string; details: ServiceDetailOption[] }
> = {
  'general-insurance': {
    label: 'General Insurance',
    details: [
      { id: 'vehicle', label: 'Vehicle' },
      { id: 'travel', label: 'Travel' },
      { id: 'property', label: 'Property' },
      { id: 'marine', label: 'Marine' },
      { id: 'liability', label: 'Liability' },
      { id: 'business', label: 'Business' },
    ],
  },
  'life-insurance': {
    label: 'Life Insurance',
    details: [
      { id: 'term', label: 'Term Life' },
      { id: 'savings', label: 'Guaranteed Savings' },
      { id: 'retirement', label: 'Annuity & Pension' },
      { id: 'child', label: 'Child Education' },
      { id: 'ulip', label: 'Unit-Linked Protection' },
    ],
  },
  'health-insurance': {
    label: 'Health Insurance',
    details: [
      { id: 'individual', label: 'Individual Plan' },
      { id: 'family-floater', label: 'Family Floater' },
      { id: 'senior-citizen', label: 'Senior Citizen' },
      { id: 'critical-illness', label: 'Critical Illness Rider' },
      { id: 'super-topup', label: 'Super Top-Up' },
    ],
  },
  'rohini-cashless-empanelment': {
    label: 'ROHINI and cashless empanelment',
    details: [
      { id: 'rohini-registration', label: 'New ROHINI Registration' },
      { id: 'rohini-renewal', label: 'ROHINI Renewal' },
      { id: 'cashless-empanelment', label: 'Cashless Empanelment' },
      { id: 'tpa-coordination', label: 'TPA Network Coordination' },
      { id: 'document-review', label: 'Document Checklist Review' },
    ],
  },
  'mutual-funds': {
    label: 'Mutual Funds',
    details: [
      { id: 'sip-start', label: 'Start new SIP' },
      { id: 'portfolio-review', label: 'Review existing portfolio' },
      { id: 'tax-saving', label: 'Tax-saving (ELSS)' },
      { id: 'lumpsum-plan', label: 'Lump-sum deployment' },
      { id: 'stp-swp', label: 'STP / SWP setup' },
    ],
  },
  'equity': {
    label: 'Equity & Demat',
    details: [
      { id: 'demat', label: 'Demat account' },
      { id: 'trading', label: 'Trading account' },
      { id: 'equity', label: 'Equity trading' },
      { id: 'commodity', label: 'Commodity trading' },
      { id: 'ipo', label: 'IPO applications' },
      { id: 'education', label: 'Market education' },
    ],
  },
  'other-solutions': {
    label: 'More Solutions',
    details: [
      { id: 'corporate-fd', label: 'Corporate Fixed Deposits' },
      { id: 'bonds', label: 'Capital Gain & Tax-Free Bonds' },
      { id: 'nps', label: 'National Pension System (NPS)' },
      { id: 'secondary-bonds', label: 'Secondary Market Debt' },
    ],
  },
};

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
  service: z.string({ required_error: 'Please select a service' }),
  organisation_name: z
    .string()
    .max(150, 'Organisation name cannot exceed 150 characters')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .max(100, 'City cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),
  existing_rohini_id: z
    .string()
    .regex(/^\d{13}$/, 'ROHINI ID must be exactly 13 digits')
    .optional()
    .or(z.literal('')),
  service_detail: z.array(z.string()).optional(),
  message: z.string().max(1000, 'Message cannot exceed 1000 characters').optional().or(z.literal('')),
  contact_method: z.enum(['phone', 'whatsapp', 'email']).default('phone'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the privacy notice to proceed' }),
  }),
  honeypot: z.string().optional(),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;

export interface EnquiryFormProps {
  heading?: string;
  title?: string;
  subtitle?: string;
  defaultService?: string;
  preselectedService?: string;
  serviceDetailOptions?: ServiceDetailOption[];
  selectedServiceDetails?: string[];
  onServiceDetailChange?: (details: string[]) => void;
  reassuranceLines?: string[];
  className?: string;
  compact?: boolean;
  variant?: 'default' | 'compact';
  showServiceSelector?: boolean;
}

function normalizeService(service?: string): SupportedService {
  if (!service) return 'mutual-funds';
  if (service === 'rohini' || service === 'rohini-cashless-empanelment') {
    return 'rohini-cashless-empanelment';
  }
  if (service === 'travel' || service === 'travel-insurance') {
    return 'general-insurance';
  }
  if (Object.keys(ALL_SERVICES_CONFIG).includes(service)) {
    return service as SupportedService;
  }
  return 'mutual-funds';
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  heading,
  title,
  subtitle = 'Share a few details and our Godhra team will follow up during business hours.',
  defaultService,
  preselectedService,
  serviceDetailOptions: externalDetailOptions,
  selectedServiceDetails: externalSelectedDetails,
  onServiceDetailChange,
  reassuranceLines = [
    'Direct consultation with our licensed advisor in Godhra',
    'No automated robo-calls or spam',
    'Personalised coverage & goal evaluation',
  ],
  className = '',
  compact = false,
  variant,
  showServiceSelector = true,
}) => {
  const isCompact = compact || variant === 'compact';
  const effectiveTitle = heading || title || 'Send an Enquiry';
  void showServiceSelector;

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryService = searchParams.get('service');
  const initialService = normalizeService(queryService || preselectedService || defaultService);

  const [currentService, setCurrentService] = useState<SupportedService>(initialService);

  useEffect(() => {
    const updated = normalizeService(preselectedService || defaultService);
    setCurrentService(updated);
  }, [preselectedService, defaultService]);

  const isHospitalService = currentService === 'rohini-cashless-empanelment';

  const activeDetailOptions =
    externalDetailOptions || ALL_SERVICES_CONFIG[currentService]?.details || [];

  const [internalDetails, setInternalDetails] = useState<string[]>(
    externalSelectedDetails || (activeDetailOptions.length > 0 ? [activeDetailOptions[0].id] : [])
  );

  const selectedDetails =
    externalSelectedDetails !== undefined ? externalSelectedDetails : internalDetails;

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
      service: currentService,
      organisation_name: '',
      city: '',
      existing_rohini_id: '',
      service_detail: selectedDetails,
      message: '',
      contact_method: 'phone',
      consent: false as any,
      honeypot: '',
    },
    mode: 'onChange',
  });

  const watchName = watch('full_name') || '';
  const watchMobile = watch('mobile') || '';
  const watchConsent = watch('consent');
  const watchContactMethod = watch('contact_method') || 'phone';

  useEffect(() => {
    setValue('service', currentService);
  }, [currentService, setValue]);

  useEffect(() => {
    setValue('service_detail', selectedDetails);
  }, [selectedDetails, setValue]);

  const handleServiceChange = (svc: SupportedService) => {
    setCurrentService(svc);
    setValue('service', svc);
    const newDetails = ALL_SERVICES_CONFIG[svc]?.details || [];
    const firstId = newDetails.length > 0 ? [newDetails[0].id] : [];
    setInternalDetails(firstId);
    if (onServiceDetailChange) {
      onServiceDetailChange(firstId);
    }
  };

  const isNameValid = watchName.trim().length >= 2;
  const isMobileValid = indianMobileRegex.test(watchMobile.trim());
  const isConsentValid = watchConsent === true;

  const validScore = (isNameValid ? 1 : 0) + (isMobileValid ? 1 : 0) + (isConsentValid ? 1 : 0);
  const progressPercent = Math.round((validScore / 3) * 100);

  const ringRadius = 18;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = ringCircumference - (progressPercent / 100) * ringCircumference;

  const submitMutation = useSubmitEnquiry();

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await submitMutation.mutateAsync({
        full_name: data.full_name,
        mobile: data.mobile,
        email: data.email || null,
        service: currentService,
        service_detail: selectedDetails,
        organisation_name: isHospitalService ? data.organisation_name || null : null,
        city: isHospitalService ? data.city || null : null,
        existing_rohini_id: isHospitalService ? data.existing_rohini_id || null : null,
        contact_method: data.contact_method,
        message: data.message || null,
        consent: data.consent,
        source_path: location.pathname,
        utm_source: searchParams.get('utm_source') || null,
        utm_medium: searchParams.get('utm_medium') || null,
        utm_campaign: searchParams.get('utm_campaign') || null,
        honeypot: data.honeypot,
      });

      const refId = res.enquiry_id || res.reference_id || 'LC-SUBMITTED';
      setSubmittedRef(refId);

      setTimeout(() => {
        navigate(`/enquiry/thank-you?ref=${encodeURIComponent(refId)}`);
      }, 1600);
    } catch (err: any) {
      if (err.status === 429) {
        setServerError('Too many enquiries received recently. Please wait a minute or call our office.');
      } else if (err.status === 422 && err.fieldErrors) {
        const first = Object.keys(err.fieldErrors)[0];
        setServerError(`${err.fieldErrors[first]}`);
      } else {
        setServerError(err.message || 'An error occurred. Please call our Godhra office at +91 93288 52555.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSuccessOverlay = () => (
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
        borderRadius: isCompact ? '20px' : '32px',
        animation: 'fadeIn 0.35s ease-out forwards',
      }}
    >
      <div
        style={{
          width: '76px',
          height: '76px',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="74" height="74" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" stroke="#d9232d" strokeWidth="2.5" strokeDasharray="300" strokeDashoffset="0" opacity="0.4" />
          <path
            d="M50 18 C56 34 68 46 82 50 C68 54 56 66 50 82 C44 66 32 54 18 50 C32 46 44 34 50 18 Z"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M50 30 C53 40 60 47 70 50 C60 53 53 60 50 70 C47 60 40 53 30 50 C40 47 47 40 50 30 Z"
            fill="#d9232d"
            opacity="0.85"
          />
        </svg>
      </div>

      <h3
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '1.55rem',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '0.45rem',
        }}
      >
        Enquiry Received
      </h3>

      <p style={{ color: 'var(--silver-300, #d7d9dc)', fontSize: '0.88rem', maxWidth: '320px', lineHeight: 1.5, margin: 0 }}>
        Reference: <strong style={{ color: '#ffffff' }}>{submittedRef}</strong>. Our team in Godhra will contact you shortly.
      </p>
    </div>
  );

  const renderFormFields = () => (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
    >
      {/* Honeypot field (hidden) */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        style={{ display: 'none' }}
        {...register('honeypot')}
      />

      {/* Row 1: Full Name & Mobile */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isCompact ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
        }}
      >
        <div>
          <label
            htmlFor="enquiry_full_name"
            style={{
              display: 'block',
              fontSize: '0.76rem',
              fontWeight: 600,
              color: 'var(--navy-900, #0a2540)',
              marginBottom: '0.25rem',
            }}
          >
            Full Name <span style={{ color: 'var(--red-500, #d9232d)' }}>*</span>
          </label>
          <input
            id="enquiry_full_name"
            type="text"
            placeholder="e.g. Ramesh Patel"
            {...register('full_name')}
            style={{
              width: '100%',
              padding: '0.55rem 0.8rem',
              borderRadius: '12px',
              border: `1px solid ${errors.full_name ? 'var(--red-500, #d9232d)' : 'var(--silver-300, #d7d9dc)'}`,
              fontSize: '0.86rem',
              outline: 'none',
              backgroundColor: '#fbfcfd',
            }}
          />
          {errors.full_name && (
            <span style={{ fontSize: '0.72rem', color: 'var(--red-500, #d9232d)', marginTop: '0.15rem', display: 'block' }}>
              {errors.full_name.message}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry_mobile"
            style={{
              display: 'block',
              fontSize: '0.76rem',
              fontWeight: 600,
              color: 'var(--navy-900, #0a2540)',
              marginBottom: '0.25rem',
            }}
          >
            Mobile Number <span style={{ color: 'var(--red-500, #d9232d)' }}>*</span>
          </label>
          <input
            id="enquiry_mobile"
            type="tel"
            placeholder="10-digit Indian mobile"
            maxLength={10}
            {...register('mobile')}
            style={{
              width: '100%',
              padding: '0.55rem 0.8rem',
              borderRadius: '12px',
              border: `1px solid ${errors.mobile ? 'var(--red-500, #d9232d)' : 'var(--silver-300, #d7d9dc)'}`,
              fontSize: '0.86rem',
              outline: 'none',
              backgroundColor: '#fbfcfd',
            }}
          />
          {errors.mobile && (
            <span style={{ fontSize: '0.72rem', color: 'var(--red-500, #d9232d)', marginTop: '0.15rem', display: 'block' }}>
              {errors.mobile.message}
            </span>
          )}
        </div>
      </div>

      {/* Row 2: Email & Service Selector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isCompact ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
        }}
      >
        <div>
          <label
            htmlFor="enquiry_email"
            style={{
              display: 'block',
              fontSize: '0.76rem',
              fontWeight: 600,
              color: 'var(--navy-900, #0a2540)',
              marginBottom: '0.25rem',
            }}
          >
            Email Address <span style={{ color: 'var(--muted, #556270)', fontWeight: 400 }}>(Optional)</span>
          </label>
          <input
            id="enquiry_email"
            type="email"
            placeholder="e.g. ramesh@example.com"
            {...register('email')}
            style={{
              width: '100%',
              padding: '0.55rem 0.8rem',
              borderRadius: '12px',
              border: `1px solid ${errors.email ? 'var(--red-500, #d9232d)' : 'var(--silver-300, #d7d9dc)'}`,
              fontSize: '0.86rem',
              outline: 'none',
              backgroundColor: '#fbfcfd',
            }}
          />
          {errors.email && (
            <span style={{ fontSize: '0.72rem', color: 'var(--red-500, #d9232d)', marginTop: '0.15rem', display: 'block' }}>
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry_service"
            style={{
              display: 'block',
              fontSize: '0.76rem',
              fontWeight: 600,
              color: 'var(--navy-900, #0a2540)',
              marginBottom: '0.25rem',
            }}
          >
            Service Category <span style={{ color: 'var(--red-500, #d9232d)' }}>*</span>
          </label>
          <select
            id="enquiry_service"
            value={currentService}
            onChange={(e) => handleServiceChange(e.target.value as SupportedService)}
            style={{
              width: '100%',
              padding: '0.55rem 0.8rem',
              borderRadius: '12px',
              border: '1px solid var(--silver-300, #d7d9dc)',
              fontSize: '0.86rem',
              outline: 'none',
              backgroundColor: '#fbfcfd',
              color: 'var(--navy-900, #0a2540)',
              cursor: 'pointer',
            }}
          >
            {(Object.keys(ALL_SERVICES_CONFIG) as SupportedService[]).map((svcKey) => (
              <option key={svcKey} value={svcKey}>
                {ALL_SERVICES_CONFIG[svcKey].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hospitals Variant: Revealed when ROHINI service is selected */}
      {isHospitalService && (
        <div
          style={{
            padding: '0.9rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(217, 35, 45, 0.04)',
            border: '1px solid rgba(217, 35, 45, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--red-600, #b91c1c)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Hospital / Healthcare Facility Details
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isCompact ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
            }}
          >
            <div>
              <label
                htmlFor="enquiry_org_name"
                style={{
                  display: 'block',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: 'var(--navy-900, #0a2540)',
                  marginBottom: '0.2rem',
                }}
              >
                Hospital / Organisation Name <span style={{ color: 'var(--muted, #556270)', fontWeight: 400 }}>(Optional)</span>
              </label>
              <input
                id="enquiry_org_name"
                type="text"
                placeholder="e.g. Life Care Hospital"
                {...register('organisation_name')}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '10px',
                  border: `1px solid ${errors.organisation_name ? 'var(--red-500, #d9232d)' : 'var(--silver-300, #d7d9dc)'}`,
                  fontSize: '0.84rem',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                }}
              />
              {errors.organisation_name && (
                <span style={{ fontSize: '0.7rem', color: 'var(--red-500, #d9232d)', marginTop: '0.15rem', display: 'block' }}>
                  {errors.organisation_name.message}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="enquiry_city"
                style={{
                  display: 'block',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: 'var(--navy-900, #0a2540)',
                  marginBottom: '0.2rem',
                }}
              >
                City <span style={{ color: 'var(--muted, #556270)', fontWeight: 400 }}>(Optional)</span>
              </label>
              <input
                id="enquiry_city"
                type="text"
                placeholder="e.g. Godhra / Vadodara"
                {...register('city')}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '10px',
                  border: `1px solid ${errors.city ? 'var(--red-500, #d9232d)' : 'var(--silver-300, #d7d9dc)'}`,
                  fontSize: '0.84rem',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                }}
              />
              {errors.city && (
                <span style={{ fontSize: '0.7rem', color: 'var(--red-500, #d9232d)', marginTop: '0.15rem', display: 'block' }}>
                  {errors.city.message}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="enquiry_rohini_id"
                style={{
                  display: 'block',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: 'var(--navy-900, #0a2540)',
                  marginBottom: '0.2rem',
                }}
              >
                Existing ROHINI ID <span style={{ color: 'var(--muted, #556270)', fontWeight: 400 }}>(Optional, 13 digits)</span>
              </label>
              <input
                id="enquiry_rohini_id"
                type="text"
                maxLength={13}
                placeholder="13-digit ID (if already allotted)"
                {...register('existing_rohini_id')}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '10px',
                  border: `1px solid ${errors.existing_rohini_id ? 'var(--red-500, #d9232d)' : 'var(--silver-300, #d7d9dc)'}`,
                  fontSize: '0.84rem',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                }}
              />
              {errors.existing_rohini_id && (
                <span style={{ fontSize: '0.7rem', color: 'var(--red-500, #d9232d)', marginTop: '0.15rem', display: 'block' }}>
                  {errors.existing_rohini_id.message}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Row 3: Service Detail Chips */}
      {activeDetailOptions.length > 0 && (
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.76rem',
              fontWeight: 600,
              color: 'var(--navy-900, #0a2540)',
              marginBottom: '0.35rem',
            }}
          >
            Specific Topics / Requirements <span style={{ color: 'var(--muted, #556270)', fontWeight: 400 }}>(Select all applicable)</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {activeDetailOptions.map((opt) => {
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
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    backgroundColor: isSelected ? 'rgba(217, 35, 45, 0.1)' : 'var(--silver-100, #f8f9fa)',
                    color: isSelected ? 'var(--red-600, #b91c1c)' : 'var(--navy-800, #0a2540)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: isSelected ? 'var(--red-500, #d9232d)' : 'var(--silver-300, #d7d9dc)',
                    transition: 'all 0.16s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span style={{ fontSize: '0.78rem', lineHeight: 1 }}>{isSelected ? '✓' : '+'}</span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Row 4: Message */}
      <div>
        <label
          htmlFor="enquiry_message"
          style={{
            display: 'block',
            fontSize: '0.76rem',
            fontWeight: 600,
            color: 'var(--navy-900, #0a2540)',
            marginBottom: '0.25rem',
          }}
        >
          Message or Goal Notes <span style={{ color: 'var(--muted, #556270)', fontWeight: 400 }}>(Optional)</span>
        </label>
        <textarea
          id="enquiry_message"
          rows={2}
          placeholder="Tell us what you would like to explore..."
          {...register('message')}
          style={{
            width: '100%',
            padding: '0.5rem 0.8rem',
            borderRadius: '12px',
            border: '1px solid var(--silver-300, #d7d9dc)',
            fontSize: '0.85rem',
            outline: 'none',
            resize: 'none',
            backgroundColor: '#fbfcfd',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Row 5: Preferred Contact Method */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '0.76rem',
            fontWeight: 600,
            color: 'var(--navy-900, #0a2540)',
            marginBottom: '0.25rem',
          }}
        >
          Preferred Contact Method
        </label>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
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
                  padding: '0.5rem 0.35rem',
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

      {/* Row 6: Consent Checkbox */}
      <div className="enquiry-consent-row" style={{ marginTop: '0.3rem', marginBottom: '0.4rem' }}>
        <label
          style={{
            display: 'grid',
            gridTemplateColumns: '24px minmax(0, 1fr)',
            gap: '10px',
            alignItems: 'start',
            cursor: 'pointer',
            margin: 0,
          }}
        >
          <input
            type="checkbox"
            {...register('consent')}
            style={{ marginTop: '3px', accentColor: 'var(--navy-900, #0a2540)', width: '16px', height: '16px' }}
          />
          <span style={{ fontSize: '0.76rem', color: 'var(--muted, #556270)', lineHeight: 1.45 }}>
            I agree to be contacted by Lotus Capital advisors regarding this enquiry.
          </span>
        </label>
        {errors.consent && (
          <span style={{ fontSize: '0.72rem', color: 'var(--red-500, #d9232d)', marginTop: '0.15rem', display: 'block', paddingLeft: '32px' }}>
            {errors.consent.message}
          </span>
        )}
      </div>

      {/* Row 7: Submit Button with Circular Progress Ring */}
      <div className="enquiry-submit-row" style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        <svg
          width="42"
          height="42"
          viewBox="0 0 44 44"
          style={{
            position: 'absolute',
            right: '12px',
            transform: 'rotate(-90deg)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <circle cx="22" cy="22" r={ringRadius} stroke="rgba(215, 217, 220, 0.4)" strokeWidth="3" fill="none" />
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
            style={{ transition: 'stroke-dashoffset 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </svg>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary enquiry-submit-btn"
          style={{
            width: '100%',
            minHeight: '52px',
            padding: '0.7rem 3.5rem 0.7rem 1.25rem',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '0.92rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            border: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {isSubmitting ? (
            <span>Sending...</span>
          ) : (
            <>
              <span>Submit Enquiry</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '0.12rem 0.4rem',
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
    </form>
  );

  // Compact Variant (used inside ContactDrawer, modals, or compact embeds)
  if (isCompact) {
    return (
      <div className={`enquiry-compact-pane ${className}`} style={{ position: 'relative' }}>
        {submittedRef && renderSuccessOverlay()}

        {serverError && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(217, 35, 45, 0.1)',
              color: 'var(--red-500, #d9232d)',
              fontSize: '0.82rem',
              marginBottom: '0.85rem',
              border: '1px solid rgba(217, 35, 45, 0.25)',
            }}
          >
            {serverError}
          </div>
        )}

        {renderFormFields()}
      </div>
    );
  }

  // Default Variant (Split-card full section)
  return (
    <section className={`enquiry-panel-section section-padding ${className}`} id="enquiry" style={{ padding: '4rem 0' }}>
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
            minHeight: 'auto',
          }}
        >
          {submittedRef && renderSuccessOverlay()}

          {/* Left Advisory Reassurance Pane */}
          <div
            className="enquiry-reassurance-pane"
            style={{
              position: 'relative',
              background: 'linear-gradient(135deg, var(--navy-950, #051329) 0%, var(--navy-900, #0a2540) 100%)',
              color: 'var(--white, #ffffff)',
              padding: '2.5rem 2.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
            }}
          >
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
                {effectiveTitle}
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
                  className="break-anywhere"
                  style={{ color: 'var(--silver-300, #d7d9dc)', textDecoration: 'none' }}
                >
                  {contactData.email}
                </a>
              </div>
            </div>
          </div>

          {/* Right Form Pane */}
          <div
            className="enquiry-form-pane"
            style={{
              padding: '2.25rem 2.25rem',
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

            {renderFormFields()}
          </div>
        </div>
      </div>
    </section>
  );
};
