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

export const HEALTH_TIMELINE_STEPS: TimelineStep[] = [
  {
    number: '01',
    title: 'Send an Enquiry',
    description: 'Share who needs cover and their ages via our online form or by contacting our Godhra office.',
    actionNote: 'Straightforward initial intake with no advance payment required.',
  },
  {
    number: '02',
    title: 'Review Household Health Needs',
    description: 'We evaluate your family age profile, past medical conditions, and appropriate sum insured levels.',
    actionNote: 'Objective consultation focused on protection requirements, not sales quotas.',
  },
  {
    number: '03',
    title: 'Compare Options from Partner Insurers',
    description: 'Receive side-by-side plan comparisons with transparent disclosure of waiting periods, room-rent limits, and network hospitals.',
    actionNote: 'Evaluating options from Care Health Insurance and confirmed general partners.',
  },
  {
    number: '04',
    title: 'Review Policy Documents & Disclosures',
    description: 'Read the insurer’s official policy wording, exclusions list, and proposal declarations before making any decision.',
    actionNote: 'Accurate disclosure of pre-existing conditions protects future claim validity.',
  },
  {
    number: '05',
    title: 'Direct Issuance with the Insurer',
    description: 'Complete the proposal with payment directly to the underwriting insurer and receive your digital policy bond and health cards.',
    actionNote: 'Official IRDAI-regulated policy schedule issued directly by the insurer.',
  },
  {
    number: '06',
    title: 'Local Claim & Renewal Support',
    description: 'Lotus Capital assists with hospital cashless guidance, reimbursement file collation, and timely annual renewals in Godhra.',
    actionNote: 'Dedicated local guidance; claim settlement remains the prerogative of the insurer.',
  },
];

const HEALTH_PHASES: TimelinePhase[] = [
  { label: 'ENQUIRY & PROFILE', span: 2 },
  { label: 'OPTIONS & DISCLOSURES', span: 2 },
  { label: 'ISSUANCE & LOCAL SUPPORT', span: 2 },
];

export interface HealthProcessTimelineProps {
  id?: string;
  onEnquiryClick?: () => void;
}

export const HealthProcessTimeline: React.FC<HealthProcessTimelineProps> = ({
  id = 'process',
  onEnquiryClick,
}) => {
  const steps: TimelineStepItem[] = HEALTH_TIMELINE_STEPS.map((st) => ({
    number: st.number,
    title: st.title,
    description: st.description,
    actionNote: st.actionNote,
  }));

  return (
    <ReferenceTimelinePipeline
      id={id}
      ariaLabel="How a Health Insurance Enquiry Works"
      eyebrow="Structured Process"
      heading="How a Health Insurance Enquiry Works"
      lead="Six transparent steps from initial family health intake to ongoing local claim and renewal guidance in Godhra."
      phases={HEALTH_PHASES}
      steps={steps}
      dataTone="light"
      accentColor="var(--teal-accent, #1F6F8B)"
      onStepSelect={() => {
        if (onEnquiryClick) onEnquiryClick();
      }}
    />
  );
};
