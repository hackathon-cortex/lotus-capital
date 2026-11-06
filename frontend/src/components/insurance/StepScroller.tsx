import React from 'react';
import {
  ReferenceTimelinePipeline,
  TimelinePhase,
  TimelineStepItem,
} from '../common/ReferenceTimelinePipeline';

export interface StepItem {
  number: string;
  title: string;
  description: string;
  categoryTag: string;
  mockup?: React.ReactNode;
}

export const GI_STEPS_CONTENT: StepItem[] = [
  {
    number: '01',
    title: 'Send an enquiry or call us',
    description:
      'Reach out to our Godhra office online or by phone. Our team notes your insurance needs and initiates the intake.',
    categoryTag: 'Initial Contact',
  },
  {
    number: '02',
    title: 'Tell us what you want to insure',
    description:
      'Share details about your vehicle, property, cargo, or commercial operations so we understand the exact scope of cover needed.',
    categoryTag: 'Asset Details',
  },
  {
    number: '03',
    title: 'We share the options from our insurer partners',
    description:
      'We present comparative options, coverage limits, deductibles, and exclusions from confirmed partners including ICICI Lombard and HDFC ERGO.',
    categoryTag: 'Options Review',
  },
  {
    number: '04',
    title: 'You review the policy documents and decide',
    description:
      'Review official policy wordings, premium schedules, and coverage terms thoroughly. The decision to proceed is completely yours.',
    categoryTag: 'Policy Decision',
  },
];

const GI_PHASES: TimelinePhase[] = [
  { label: 'INTAKE', span: 1 },
  { label: 'SCOPE OF COVER', span: 1 },
  { label: 'PARTNER OPTIONS', span: 1 },
  { label: 'POLICY DECISION', span: 1 },
];

export interface StepScrollerProps {
  id?: string;
  heading?: string;
  subtitle?: string;
  onEnquiryClick?: () => void;
}

export const StepScroller: React.FC<StepScrollerProps> = ({
  id = 'process',
  heading = 'How a General Insurance enquiry works',
  subtitle = 'Four straightforward steps from enquiry to policy decision.',
}) => {
  const steps: TimelineStepItem[] = GI_STEPS_CONTENT.map((s) => ({
    number: s.number,
    title: s.title,
    description: s.description,
    tag: s.categoryTag,
  }));

  return (
    <ReferenceTimelinePipeline
      id={id}
      ariaLabel="How a General Insurance enquiry works"
      eyebrow="Clear Process"
      heading={heading}
      lead={subtitle}
      phases={GI_PHASES}
      steps={steps}
      dataTone="dark"
    />
  );
};
