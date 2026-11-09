import React from 'react';
import {
  ReferenceTimelinePipeline,
  TimelinePhase,
  TimelineStepItem,
} from '../common/ReferenceTimelinePipeline';

export interface JourneyStep {
  step: number;
  title: string;
  subtitle: string;
  desc: string;
}

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    step: 1,
    title: 'Enquire',
    subtitle: 'Initial Contact',
    desc: 'Reach out through our online form or Godhra office to initiate a demat and trading account enquiry.',
  },
  {
    step: 2,
    title: 'Discuss the service, costs and risks',
    subtitle: 'Full Transparency',
    desc: 'We discuss Authorised Person facilities, explain securities market volatility, and clarify broking charges.',
  },
  {
    step: 3,
    title: 'Complete KYC and required documents',
    subtitle: 'Compliance & Verification',
    desc: 'Submit identity, address, and bank documents as required by our broking partner and regulatory norms.',
  },
  {
    step: 4,
    title: 'Account opened through our broking partner',
    subtitle: 'Account Activation',
    desc: 'Religare Broking Limited reviews submitted documents, completes verification, and activates your account.',
  },
  {
    step: 5,
    title: 'Begin, with the risks understood',
    subtitle: 'Disciplined Execution',
    desc: 'Access secondary markets through our broking partner with clear awareness of risk and settlement terms.',
  },
];

const EQUITY_PHASES: TimelinePhase[] = [
  { label: 'ENQUIRY & DISCLOSURE', span: 2 },
  { label: 'KYC & VERIFICATION', span: 1 },
  { label: 'ACTIVATION & ACCESS', span: 2 },
];

export const EquityAccountJourney: React.FC = () => {
  const steps: TimelineStepItem[] = JOURNEY_STEPS.map((st) => ({
    number: `0${st.step}`,
    title: st.title,
    description: st.desc,
    tag: st.subtitle,
  }));

  return (
    <div>
      <ReferenceTimelinePipeline
        id="journey"
        ariaLabel="How an account opening enquiry works"
        eyebrow="Onboarding Pathway"
        heading="How an account opening enquiry works"
        lead="Transparent, step-by-step facilitation through our broking partner with clear disclosures at every stage."
        phases={EQUITY_PHASES}
        steps={steps}
        dataTone="dark"
        accentColor="#4F5FB0"
      />
      <div
        style={{
          textAlign: 'center',
          paddingBottom: '2.5rem',
          fontSize: '0.82rem',
          color: 'var(--silver-400, #8A949D)',
          backgroundColor: 'var(--navy-950, #071B30)',
        }}
      >
        Process and document requirements are set by our broking partner and applicable regulations.
      </div>
    </div>
  );
};
