import React, { useState } from 'react';

export interface InspectorParam {
  id: string;
  name: string;
  shortSummary: string;
  whatItMeans: string;
  whatToCheck: string;
  servicingTip: string;
}

export const COMPARE_PARAMETERS: InspectorParam[] = [
  {
    id: 'sum_insured',
    name: 'Sum Insured & Restoration',
    shortSummary: 'Maximum annual medical expense limit and refill benefits.',
    whatItMeans:
      'The highest financial boundary the insurer agrees to disburse for admissible hospitalisation and medical treatment within a 12-month policy tenure.',
    whatToCheck:
      'Verify if the restoration benefit triggers automatically for related illnesses or only unrelated conditions, and whether single-claim limits apply.',
    servicingTip:
      'Evaluate local medical inflation and your household size to ensure the baseline sum insured remains protective across multiple years.',
  },
  {
    id: 'waiting_periods',
    name: 'Waiting Periods',
    shortSummary: 'Initial non-coverage durations for specified conditions.',
    whatItMeans:
      'Mandatory waiting durations stipulated by the insurer before coverage takes effect for initial claims, specific surgical treatments, or pre-existing diseases.',
    whatToCheck:
      'Inspect the initial 30-day waiting clause, 1 or 2-year specific ailment lists (such as cataract, hernia, or joint replacements), and any waiting period waiver options.',
    servicingTip:
      'Continuous renewal preserves accrued waiting period credits. Never let a health insurance policy lapse even for a week.',
  },
  {
    id: 'pre_existing',
    name: 'Pre-existing Conditions',
    shortSummary: 'Medical history disclosures and applicable waiting terms.',
    whatItMeans:
      'Any diagnosed ailment, chronic symptom, or medical condition pre-dating the inception date of your health insurance policy.',
    whatToCheck:
      'Review the pre-existing disease (PED) definition in policy wording and the waiting duration required (typically 1 to 3 years) before full cover begins.',
    servicingTip:
      'Declare all medical history, past prescriptions, and prior hospitalisations transparently on the proposal form to safeguard claim validity.',
  },
  {
    id: 'room_rent',
    name: 'Room-Rent Limits & Sub-limits',
    shortSummary: 'Room tier caps and associated proportionate deductions.',
    whatItMeans:
      'Daily financial caps imposed by the insurer on hospital room accommodation tiers (e.g. standard private, semi-private, or single room).',
    whatToCheck:
      'Check if the policy has a room-rent cap (e.g. 1% of sum insured) or "no room rent cap". Understand that exceeding the room cap triggers proportionate deductions on doctor fees and nursing charges.',
    servicingTip:
      'Opting for a policy with no room-rent capping prevents major out-of-pocket deductions on surgeon and ICU fees during hospital stays.',
  },
  {
    id: 'copay_deductibles',
    name: 'Co-payments & Deductibles',
    shortSummary: 'Out-of-pocket cost-sharing percentages or thresholds.',
    whatItMeans:
      'A co-payment is a predefined percentage of the claim bill you agree to bear out of pocket. A deductible is a fixed amount you pay before insurance activates.',
    whatToCheck:
      'Inspect whether co-payments are mandatory (common in senior citizen plans or non-network hospitals) or voluntary (which reduces premium).',
    servicingTip:
      'Verify whether zone-based co-payments apply when seeking treatment in Tier 1 metropolitan hospital networks.',
  },
  {
    id: 'network_hospitals',
    name: 'Network & Cashless Hospitals',
    shortSummary: 'Empanelled facilities for seamless direct settlement.',
    whatItMeans:
      'Inpatient healthcare facilities and multi-speciality hospitals holding direct settlement agreements with the insurer or Third Party Administrator (TPA).',
    whatToCheck:
      'Confirm cashless hospitalisation procedures, planned admission pre-authorisation notice periods, and emergency intimation deadlines.',
    servicingTip:
      'Check the insurer’s current hospital directory for reputable hospitals across Gujarat and pan-India prior to planned medical procedures.',
  },
  {
    id: 'exclusions',
    name: 'Policy Exclusions',
    shortSummary: 'Conditions, treatments, and procedures excluded from cover.',
    whatItMeans:
      'Specific medical treatments, conditions, or consumable expenses that the insurer explicitly does not cover under any circumstances.',
    whatToCheck:
      'Read the standard list of non-medical items (admission fees, toiletries, administrative charges) and unproven or experimental treatments.',
    servicingTip:
      'Keep abreast of updated IRDAI standardised guidelines that govern modern treatments and day-care procedure inclusions.',
  },
  {
    id: 'renewability',
    name: 'Renewability & Claim Procedure',
    shortSummary: 'Lifetime renewal guarantee and claim filing documentation.',
    whatItMeans:
      'Regulatory guarantee of lifetime renewal without arbitrary non-renewal based on adverse claim history, alongside clear intimation protocols.',
    whatToCheck:
      'Verify that the policy specifies guaranteed lifelong renewability and check whether claim intimation is digital or physical.',
    servicingTip:
      'Lotus Capital assists Godhra families with claim documentation collation, hospital coordination, and reimbursement file submission.',
  },
];

export interface HealthCompareInspectorProps {
  id?: string;
  onEnquiryClick?: () => void;
}

export const HealthCompareInspector: React.FC<HealthCompareInspectorProps> = ({
  id = 'compare',
  onEnquiryClick,
}) => {
  const [activeParamId, setActiveParamId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('compareParam');
      if (p && COMPARE_PARAMETERS.some((item) => item.id === p)) return p;
    }
    return COMPARE_PARAMETERS[0].id;
  });
  const [reviewedParams, setReviewedParams] = useState<string[]>([COMPARE_PARAMETERS[0].id]);

  const activeParam =
    COMPARE_PARAMETERS.find((p) => p.id === activeParamId) || COMPARE_PARAMETERS[0];

  const isReviewed = reviewedParams.includes(activeParam.id);

  const toggleReviewed = (paramId: string) => {
    setReviewedParams((prev) =>
      prev.includes(paramId) ? prev.filter((id) => id !== paramId) : [...prev, paramId]
    );
  };

  const handleEnquiry = (e: React.MouseEvent) => {
    if (onEnquiryClick) {
      e.preventDefault();
      onEnquiryClick();
    } else {
      const el = document.getElementById('enquiry');
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const reviewPercentage = Math.round((reviewedParams.length / COMPARE_PARAMETERS.length) * 100);

  return (
    <section
      id={id}
      className="health-compare-inspector gi-stacked-section"
      style={{
        position: 'relative',
        zIndex: 13,
        marginTop: '-36px',
        borderTopLeftRadius: '36px',
        borderTopRightRadius: '36px',
        backgroundColor: '#ffffff',
        boxShadow: '0 -10px 40px rgba(10,37,64,0.06)',
        padding: '5rem 0',
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 3.5rem' }}>
          <span
            className="eyebrow"
            style={{
              display: 'inline-block',
              color: 'var(--navy-700, #0d2b4a)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            OBJECTIVE EVALUATION CHECKLIST
          </span>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.1rem, 3.4vw, 3rem)',
              fontWeight: 700,
              color: 'var(--navy-950, #051329)',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}
          >
            What to Compare <span style={{ fontStyle: 'italic', color: 'var(--navy-900, #123D67)' }}>Before Enrolling.</span>
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--ink, #1f2933)',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Policy wording dictates how your claim is settled during an emergency. Inspect these 8 essential parameters before signing a health proposal.
          </p>
        </div>

        {/* 2-Column Interactive Inspector Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 1fr) minmax(340px, 1.4fr)',
            gap: '2.5rem',
            alignItems: 'start',
          }}
          className="health-inspector-grid"
        >
          {/* Left Column: Parameter List & Progress Bar */}
          <div>
            {/* Progress Bar Widget */}
            <div
              style={{
                backgroundColor: 'var(--silver-100, #f8f9fa)',
                borderRadius: '16px',
                padding: '1rem 1.25rem',
                border: '1px solid var(--silver-300, #e2e8f0)',
                marginBottom: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--navy-700, #0d2b4a)', fontWeight: 700, display: 'block' }}>
                  Checklist Progress
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--navy-900, #0a2540)' }}>
                  {reviewedParams.length} of {COMPARE_PARAMETERS.length} Parameters Reviewed
                </span>
              </div>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--navy-100, #eaf1f8)',
                  border: '2px solid var(--navy-900, #123D67)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--navy-900, #123D67)',
                }}
              >
                {reviewPercentage}%
              </div>
            </div>

            {/* Parameter Buttons List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {COMPARE_PARAMETERS.map((param, idx) => {
                const isActive = param.id === activeParamId;
                const checked = reviewedParams.includes(param.id);
                return (
                  <button
                    key={param.id}
                    type="button"
                    onClick={() => setActiveParamId(param.id)}
                    style={{
                      outline: 'none',
                      cursor: 'pointer',
                      padding: '0.85rem 1.15rem',
                      borderRadius: '16px',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isActive ? 'var(--navy-100, #eaf1f8)' : 'var(--white, #ffffff)',
                      border: isActive
                        ? '1.5px solid var(--navy-900, #123D67)'
                        : '1px solid var(--silver-300, #e2e8f0)',
                      boxShadow: isActive ? '0 4px 14px rgba(10, 37, 64, 0.08)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span
                        style={{
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          color: isActive ? 'var(--navy-900, #123D67)' : 'var(--muted, #94a3b8)',
                          width: '18px',
                        }}
                      >
                        0{idx + 1}
                      </span>
                      <div>
                        <div
                          style={{
                            fontSize: '0.94rem',
                            fontWeight: isActive ? 700 : 600,
                            color: isActive ? '#051329' : 'var(--navy-900, #0a2540)',
                          }}
                        >
                          {param.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--ink, #1f2933)' }}>
                          {param.shortSummary}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: checked ? 'var(--navy-900, #123D67)' : 'transparent',
                        border: checked ? 'none' : '1.5px solid var(--silver-300, #cbd5e1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        flexShrink: 0,
                      }}
                    >
                      {checked && '✓'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Parameter Inspector Panel */}
          <div
            style={{
              backgroundColor: 'var(--silver-100, #f8f9fa)',
              borderRadius: '24px',
              border: '1px solid var(--silver-300, #e2e8f0)',
              padding: '2.25rem 2rem',
              boxShadow: '0 12px 32px rgba(10,37,64,0.05)',
              position: 'sticky',
              top: '110px',
            }}
          >
            <div className="inspector-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.74rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--navy-700, #0d2b4a)',
                    fontWeight: 700,
                    display: 'block',
                    marginBottom: '0.35rem',
                  }}
                >
                  DEEP-DIVE INSPECTOR
                </span>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(1.25rem, 2.4vw, 1.6rem)',
                    fontWeight: 700,
                    color: 'var(--navy-950, #051329)',
                    margin: 0,
                    textWrap: 'balance',
                    hyphens: 'manual',
                  }}
                >
                  {activeParam.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => toggleReviewed(activeParam.id)}
                style={{
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '10px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  minHeight: '44px',
                  width: 'auto',
                  whiteSpace: 'nowrap',
                  backgroundColor: isReviewed ? 'var(--navy-900, #123D67)' : 'var(--white, #ffffff)',
                  color: isReviewed ? '#ffffff' : 'var(--navy-900, #0a2540)',
                  border: isReviewed ? '1.5px solid var(--navy-900, #123D67)' : '1.5px solid var(--silver-300, #cbd5e1)',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  flexShrink: 0,
                }}
              >
                <span>{isReviewed ? '✓ Reviewed' : 'Mark as reviewed'}</span>
              </button>
            </div>

            {/* Block 1: What it means */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4
                style={{
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--navy-900, #0a2540)',
                  fontWeight: 700,
                  marginBottom: '0.4rem',
                }}
              >
                What It Means
              </h4>
              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--ink, #1f2933)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {activeParam.whatItMeans}
              </p>
            </div>

            {/* Block 2: What to check in policy wording */}
            <div
              style={{
                backgroundColor: 'var(--white, #ffffff)',
                borderRadius: '16px',
                padding: '1.15rem 1.25rem',
                borderLeft: '4px solid var(--navy-900, #123D67)',
                border: '1px solid var(--silver-300, #e2e8f0)',
                borderLeftWidth: '4px',
                marginBottom: '1.25rem',
              }}
            >
              <h4
                style={{
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--navy-900, #123D67)',
                  fontWeight: 700,
                  marginBottom: '0.35rem',
                }}
              >
                What to Check in Policy Wording
              </h4>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--navy-950, #051329)',
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {activeParam.whatToCheck}
              </p>
            </div>

            {/* Block 3: Servicing tip */}
            <div
              style={{
                backgroundColor: 'var(--navy-100, #eaf1f8)',
                borderRadius: '16px',
                padding: '1rem 1.25rem',
                border: '1px solid rgba(18, 61, 103, 0.15)',
                marginBottom: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--navy-900, #123D67)', fontSize: '1rem', lineHeight: 1, marginTop: '2px' }}>
                  ★
                </span>
                <p
                  style={{
                    fontSize: '0.84rem',
                    color: 'var(--navy-950, #051329)',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  <strong>Lotus Capital Servicing Note: </strong>
                  {activeParam.servicingTip}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleEnquiry}
              style={{
                width: '100%',
                padding: '0.9rem 1.25rem',
                borderRadius: '14px',
                fontSize: '0.92rem',
                fontWeight: 700,
                backgroundColor: 'var(--red-500, #d9232d)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(217, 35, 45, 0.3)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--red-600, #b91c1c)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--red-500, #d9232d)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <span>Discuss This Checklist with our Godhra Team</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
