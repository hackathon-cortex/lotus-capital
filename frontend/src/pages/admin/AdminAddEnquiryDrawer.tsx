import React, { useState, useEffect, useRef } from 'react';
import { AdminIcon } from '../../components/admin/AdminIcons';
import { api } from '../../api/client';
import { BackendEnquiry } from '../../api/types';

export interface AdminAddEnquiryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onEnquiryCreated?: (newEnquiry: BackendEnquiry) => void;
  onSelectExistingLead?: (lead: BackendEnquiry) => void;
}

const PRIMARY_SERVICES = [
  { slug: 'mutual-funds', label: 'Mutual Funds', subServices: ['SIP', 'Lumpsum', 'ELSS Tax Saver', 'STP'] },
  { slug: 'life-insurance', label: 'Life Insurance', subServices: ['Term Plan', 'Guaranteed Savings', 'Retirement Annuity'] },
  { slug: 'health-insurance', label: 'Health Insurance', subServices: ['Family Floater', 'Critical Illness', 'Senior Citizen'] },
  { slug: 'general-insurance', label: 'General Insurance', subServices: ['Vehicle / Motor', 'Commercial Property', 'Marine'] },
  { slug: 'equity', label: 'Equity & Demat', subServices: ['Demat Opening', 'Portfolio Review', 'Advisory'] },
  { slug: 'other-solutions', label: 'Other Solutions', subServices: ['Corporate FD', 'Tax Planning', 'Will / Succession'] },
];

const SOURCE_CHANNELS = [
  { value: 'phone_inbound', label: 'Phone Inbound' },
  { value: 'walk_in', label: 'Walk-in (Godhra Office)' },
  { value: 'referral', label: 'Existing Client Referral' },
  { value: 'whatsapp', label: 'WhatsApp Enquiry' },
  { value: 'campaign', label: 'Marketing Campaign' },
  { value: 'event', label: 'Investor Awareness Event' },
  { value: 'other', label: 'Other Source' },
];

const FORBIDDEN_KEYWORDS = ['pan', 'aadhaar', 'otp', 'password', 'netbanking', 'cvv'];

export const AdminAddEnquiryDrawer: React.FC<AdminAddEnquiryDrawerProps> = ({
  isOpen,
  onClose,
  onEnquiryCreated,
  onSelectExistingLead,
}) => {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [primaryService, setPrimaryService] = useState('mutual-funds');
  const [selectedChips, setSelectedChips] = useState<string[]>(['SIP']);
  const [notes, setNotes] = useState('');
  const [source, setSource] = useState('phone_inbound');
  const [contactMethod, setContactMethod] = useState<'phone' | 'email' | 'whatsapp'>('phone');
  const [statusVal, setStatusVal] = useState<'new' | 'contacted' | 'in_progress'>('new');
  const [followupDate, setFollowupDate] = useState('');
  const [consent, setConsent] = useState(true);
  const [allowDuplicate, setAllowDuplicate] = useState(false);

  // Duplicate mobile check state
  const [duplicateLead, setDuplicateLead] = useState<BackendEnquiry | null>(null);
  const [isCheckingMobile, setIsCheckingMobile] = useState(false);

  // Submission & validation state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const debounceTimerRef = useRef<any>(null);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setFullName('');
      setMobile('');
      setEmail('');
      setPrimaryService('mutual-funds');
      setSelectedChips(['SIP']);
      setNotes('');
      setSource('phone_inbound');
      setContactMethod('phone');
      setStatusVal('new');
      setFollowupDate('');
      setConsent(true);
      setAllowDuplicate(false);
      setDuplicateLead(null);
      setErrorMsg(null);
      setFieldErrors({});
    }
  }, [isOpen]);

  // Debounced duplicate check when mobile is 10 digits
  useEffect(() => {
    const cleaned = mobile.replace(/\D/g, '');
    const valid10 = cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!valid10) {
      setDuplicateLead(null);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsCheckingMobile(true);
      try {
        const found = await api.admin.checkMobile(cleaned);
        setDuplicateLead(found);
      } catch {
        setDuplicateLead(null);
      } finally {
        setIsCheckingMobile(false);
      }
    }, 400);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [mobile]);

  if (!isOpen) return null;

  const handleChipToggle = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handlePrimaryServiceChange = (slug: string) => {
    setPrimaryService(slug);
    const found = PRIMARY_SERVICES.find((s) => s.slug === slug);
    if (found && found.subServices.length > 0) {
      setSelectedChips([found.subServices[0]]);
    } else {
      setSelectedChips([]);
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters.';
    }

    const cleanedMobile = mobile.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanedMobile)) {
      errors.mobile = 'Enter a valid 10-digit Indian mobile starting with 6, 7, 8, or 9.';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Enter a valid email address.';
    }

    if (!consent) {
      errors.consent = 'Consent disclaimer is required for staff enquiry entry.';
    }

    if (notes) {
      const lower = notes.toLowerCase();
      for (const kw of FORBIDDEN_KEYWORDS) {
        if (new RegExp(`\\b${kw}\\b`).test(lower)) {
          errors.notes = `Notes contain sensitive financial credential term (${kw}). Please remove it.`;
          break;
        }
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validate()) return;

    if (duplicateLead && !allowDuplicate) {
      setErrorMsg('An active lead with this mobile already exists. Enable "Add anyway" to proceed.');
      return;
    }

    setSubmitting(true);
    try {
      const cleanedMobile = mobile.replace(/\D/g, '');
      const created = await api.admin.createEnquiry({
        full_name: fullName.trim(),
        mobile: cleanedMobile,
        email: email.trim() || undefined,
        service: primaryService,
        service_detail: selectedChips.length > 0 ? selectedChips : [primaryService],
        message: notes.trim() || undefined,
        source,
        contact_method: contactMethod,
        status: statusVal,
        first_followup_at: followupDate ? new Date(followupDate).toISOString() : undefined,
        consent,
        allow_duplicate: allowDuplicate,
      });

      onEnquiryCreated?.(created);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create enquiry. Please check the details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentServiceObj = PRIMARY_SERVICES.find((s) => s.slug === primaryService);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'flex-end',
        background: 'rgba(5, 19, 41, 0.75)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-label="Add New Enquiry"
        style={{
          width: '100%',
          maxWidth: '560px',
          height: '100%',
          background: '#071B30',
          borderLeft: '1px solid rgba(215, 217, 220, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.6)',
          overflowY: 'auto',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(215, 217, 220, 0.12)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#0A2540',
          }}
        >
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
              Add New Enquiry
            </h2>
            <p style={{ fontSize: '12px', color: '#8A949D', margin: '4px 0 0 0' }}>
              Manual client intake by Lotus Capital staff
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#8A949D',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <AdminIcon name="close" size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {errorMsg && (
            <div
              style={{
                padding: '12px 14px',
                background: 'rgba(233, 35, 50, 0.12)',
                border: '1px solid #E92332',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '13px',
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Client Details Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#D7D9DC', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Client Information
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="drawer-fullName" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#FFFFFF', marginBottom: '6px' }}>
                Full Name <span style={{ color: '#E92332' }}>*</span>
              </label>
              <input
                id="drawer-fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Bhaveshbhai Patel"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0D2847',
                  border: fieldErrors.fullName ? '1px solid #E92332' : '1px solid rgba(215, 217, 220, 0.2)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                }}
              />
              {fieldErrors.fullName && (
                <div style={{ fontSize: '11.5px', color: '#E92332', marginTop: '4px' }}>
                  {fieldErrors.fullName}
                </div>
              )}
            </div>

            {/* Mobile & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label htmlFor="drawer-mobile" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#FFFFFF', marginBottom: '6px' }}>
                  Mobile (10-Digit) <span style={{ color: '#E92332' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="drawer-mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="98250 12345"
                    maxLength={14}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#0D2847',
                      border: fieldErrors.mobile ? '1px solid #E92332' : '1px solid rgba(215, 217, 220, 0.2)',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                    }}
                  />
                  {isCheckingMobile && (
                    <span style={{ position: 'absolute', right: '10px', top: '12px', fontSize: '11px', color: '#8A949D' }}>
                      Checking...
                    </span>
                  )}
                </div>
                {fieldErrors.mobile && (
                  <div style={{ fontSize: '11.5px', color: '#E92332', marginTop: '4px' }}>
                    {fieldErrors.mobile}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="drawer-email" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#FFFFFF', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  id="drawer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@example.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#0D2847',
                    border: fieldErrors.email ? '1px solid #E92332' : '1px solid rgba(215, 217, 220, 0.2)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                  }}
                />
                {fieldErrors.email && (
                  <div style={{ fontSize: '11.5px', color: '#E92332', marginTop: '4px' }}>
                    {fieldErrors.email}
                  </div>
                )}
              </div>
            </div>

            {/* Duplicate Warning Banner */}
            {duplicateLead && (
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(233, 35, 50, 0.08)',
                  border: '1px solid rgba(233, 35, 50, 0.4)',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12.5px', color: '#FFFFFF', fontWeight: 600 }}>
                    Duplicate mobile detected
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectExistingLead?.(duplicateLead)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#FFFFFF',
                      textDecoration: 'underline',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    View existing lead ({duplicateLead.reference_id})
                  </button>
                </div>
                <div style={{ fontSize: '12px', color: '#D7D9DC' }}>
                  Active lead: <strong>{duplicateLead.name}</strong> ({duplicateLead.status.toUpperCase()})
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#FFFFFF', cursor: 'pointer', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    checked={allowDuplicate}
                    onChange={(e) => setAllowDuplicate(e.target.checked)}
                  />
                  <span>Add anyway as a new separate enquiry</span>
                </label>
              </div>
            )}
          </div>

          {/* Service & Chips Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#D7D9DC', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Service Interest
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#FFFFFF', marginBottom: '6px' }}>
                Primary Service Segment
              </label>
              <select
                value={primaryService}
                onChange={(e) => handlePrimaryServiceChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0D2847',
                  border: '1px solid rgba(215, 217, 220, 0.2)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                }}
              >
                {PRIMARY_SERVICES.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-service Chips */}
            {currentServiceObj && currentServiceObj.subServices.length > 0 && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#8A949D', marginBottom: '8px' }}>
                  Sub-services / Product Tags
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {currentServiceObj.subServices.map((chip) => {
                    const active = selectedChips.includes(chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleChipToggle(chip)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          background: active ? '#123D67' : '#0D2847',
                          color: '#FFFFFF',
                          border: active ? '1px solid #FFFFFF' : '1px solid rgba(215, 217, 220, 0.2)',
                        }}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Intake Channel & Scheduling */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#D7D9DC', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Intake Channel & Follow-up
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#FFFFFF', marginBottom: '6px' }}>
                  Source Channel
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#0D2847',
                    border: '1px solid rgba(215, 217, 220, 0.2)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                  }}
                >
                  {SOURCE_CHANNELS.map((ch) => (
                    <option key={ch.value} value={ch.value}>
                      {ch.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#FFFFFF', marginBottom: '6px' }}>
                  Preferred Contact
                </label>
                <select
                  value={contactMethod}
                  onChange={(e) => setContactMethod(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#0D2847',
                    border: '1px solid rgba(215, 217, 220, 0.2)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                  }}
                >
                  <option value="phone">Phone Call</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#FFFFFF', marginBottom: '6px' }}>
                  Initial Status
                </label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#0D2847',
                    border: '1px solid rgba(215, 217, 220, 0.2)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                  }}
                >
                  <option value="new">New (Needs Outreach)</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Progress</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#FFFFFF', marginBottom: '6px' }}>
                  Scheduled Follow-up
                </label>
                <input
                  type="datetime-local"
                  value={followupDate}
                  onChange={(e) => setFollowupDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#0D2847',
                    border: '1px solid rgba(215, 217, 220, 0.2)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                  }}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#FFFFFF', marginBottom: '6px' }}>
                Client Discussion Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Key requirements, client horizon, financial objectives..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0D2847',
                  border: fieldErrors.notes ? '1px solid #E92332' : '1px solid rgba(215, 217, 220, 0.2)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  resize: 'vertical',
                }}
              />
              {fieldErrors.notes && (
                <div style={{ fontSize: '11.5px', color: '#E92332', marginTop: '4px' }}>
                  {fieldErrors.notes}
                </div>
              )}
            </div>
          </div>

          {/* Consent Checkbox */}
          <div
            style={{
              padding: '12px 14px',
              background: '#0A2540',
              borderRadius: '6px',
              border: fieldErrors.consent ? '1px solid #E92332' : '1px solid rgba(215, 217, 220, 0.15)',
            }}
          >
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12.5px', color: '#FFFFFF', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{ marginTop: '2px' }}
              />
              <span>
                I confirm the client gave verbal or written consent to be contacted by Lotus Capital regarding financial advisory services.
              </span>
            </label>
            {fieldErrors.consent && (
              <div style={{ fontSize: '11.5px', color: '#E92332', marginTop: '6px' }}>
                {fieldErrors.consent}
              </div>
            )}
          </div>

          {/* Drawer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid rgba(215, 217, 220, 0.12)' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{
                padding: '10px 18px',
                background: 'transparent',
                border: '1px solid rgba(215, 217, 220, 0.3)',
                borderRadius: '6px',
                color: '#D7D9DC',
                fontSize: '13.5px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '10px 22px',
                background: submitting ? '#0D2847' : '#123D67',
                border: '1px solid #FFFFFF',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {submitting && <AdminIcon name="clock" size={14} />}
              <span>{submitting ? 'Creating...' : 'Create Enquiry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
