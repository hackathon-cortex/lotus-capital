import React from 'react';
import {
  ReferenceTimelinePipeline,
  TimelinePhase,
  TimelineStepItem,
} from '../common/ReferenceTimelinePipeline';

export interface ProcessNode {
  step: string;
  title: string;
  desc: string;
}

export const HOW_WE_WORK_STEPS: ProcessNode[] = [
  {
    step: '01',
    title: 'We Listen',
    desc: 'We listen to your goals and circumstances.',
  },
  {
    step: '02',
    title: 'We Explain',
    desc: 'We explain the options available and their risks.',
  },
  {
    step: '03',
    title: 'We Help with the Process',
    desc: 'We help with the application or transaction process through the relevant provider.',
  },
  {
    step: '04',
    title: 'We Stay in Touch',
    desc: 'We stay available for follow-up and servicing.',
  },
];

const HOW_WE_WORK_PHASES: TimelinePhase[] = [
  { label: 'DISCOVER & CONSULT', span: 2 },
  { label: 'FACILITATE', span: 1 },
  { label: 'LONG-TERM SUPPORT', span: 1 },
];

export const HomeHowWeWork: React.FC = () => {
  const timelineSteps: TimelineStepItem[] = HOW_WE_WORK_STEPS.map((s) => ({
    number: s.step,
    title: s.title,
    description: s.desc,
  }));

  return (
    <ReferenceTimelinePipeline
      id="process"
      ariaLabel="How We Work with Clients"
      eyebrow="Structured Process"
      heading="How We Work with Clients"
      lead="A disciplined, four-stage consultative approach ensuring transparency before any commitment."
      phases={HOW_WE_WORK_PHASES}
      steps={timelineSteps}
      dataTone="light"
    />
  );
};
