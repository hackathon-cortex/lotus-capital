import React from 'react';
import {
  ReferenceTimelinePipeline,
  TimelinePhase,
  TimelineStepItem,
} from '../common/ReferenceTimelinePipeline';

export interface TimelineStep {
  number: string;
  title: string;
  description: string;
  actionNote?: string;
}

export const LIFE_TIMELINE_STEPS: TimelineStep[] = [
  {
    number: '01',
    title: 'Send an Enquiry',
    description: 'Share your protection priorities and basic requirements via our online form or by calling our Godhra office.',
    actionNote: 'No OTP, Aadhaar upload, or intrusive financial data requested.',
  },
  {
    number: '02',
    title: 'Discuss Your Needs',
    description: 'We listen to your family responsibilities and explain how policy structures differ without commercial sales pressure.',
    actionNote: 'Objective review of term duration, dependants, and family cash-flow.',
  },
  {
    number: '03',
    title: 'Review Options from Partner Insurers',
    description: 'Evaluate term options, underwriting guidelines, and policy wording across established life insurers.',
    actionNote: 'Comparing policy schedules from Bharti AXA Life, HDFC Life, ICICI Prudential, and LIC.',
  },
  {
    number: '04',
    title: 'Apply',
    description: 'Complete basic identity documentation, address proof, and any necessary health disclosures under our guidance.',
    actionNote: 'Assistance with accurate declaration forms and KYC verification.',
  },
  {
    number: '05',
    title: 'Policy Issue',
    description: 'The underwriting insurer reviews the proposal, confirms underwriting acceptance, and issues your digital policy bond.',
    actionNote: 'Official policy contract with direct insurer signature and schedule.',
  },
  {
    number: '06',
    title: 'Servicing & Renewals',
    description: 'Lotus Capital provides ongoing local support in Godhra for renewal schedules, nomination changes, and claim facilitation.',
    actionNote: 'Dedicated local point-of-contact throughout the policy lifetime.',
  },
];

const LIFE_PHASES: TimelinePhase[] = [
  { label: 'CONSULTATION', span: 2 },
  { label: 'UNDERWRITING REVIEW', span: 2 },
  { label: 'POLICY & SERVICING', span: 2 },
];

export interface LifeProcessTimelineProps {
  id?: string;
  onEnquiryClick?: () => void;
}

export const LifeProcessTimeline: React.FC<LifeProcessTimelineProps> = ({
  id = 'process',
  onEnquiryClick,
}) => {
  const steps: TimelineStepItem[] = LIFE_TIMELINE_STEPS.map((st) => ({
    number: st.number,
    title: st.title,
    description: st.description,
    actionNote: st.actionNote,
  }));

  return (
    <ReferenceTimelinePipeline
      id={id}
      ariaLabel="How a Life Insurance Enquiry Works"
      eyebrow="Transparent Workflow"
      heading="How a Life Insurance Enquiry Works"
      lead="Six structured steps from initial conversation to long-term policy servicing in Godhra."
      phases={LIFE_PHASES}
      steps={steps}
      dataTone="dark"
      onStepSelect={() => {
        if (onEnquiryClick) onEnquiryClick();
      }}
    />
  );
};
