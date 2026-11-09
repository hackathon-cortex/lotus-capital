import React from 'react';
import {
  ReferenceTimelinePipeline,
  TimelinePhase,
  TimelineStepItem,
} from '../common/ReferenceTimelinePipeline';
import milestonesData from '@content/data/milestones.json';

interface MilestoneItem {
  id: string;
  year: number;
  milestone: string;
  status: string;
}

const MILESTONE_DESCRIPTIONS: Record<number, string> = {
  2006: 'Lotus Capital established in Godhra; commenced mutual fund distribution.',
  2008: 'Business partnership with Religare Broking Limited began, providing clients with equity execution and demat facilities.',
  2012: 'Association with Care Health Insurance began, expanding protection offerings for families and senior citizens.',
  2016: 'Real estate services began in Vadodara and Ahmedabad.',
};

const JOURNEY_PHASES: TimelinePhase[] = [
  { label: 'FOUNDATION', span: 1 },
  { label: 'BROKING ALLIANCE', span: 1 },
  { label: 'HEALTH PROTECTION', span: 1 },
  { label: 'REGIONAL EXPANSION', span: 1 },
];

export const OurJourneyTimeline: React.FC = () => {
  const milestones: MilestoneItem[] = milestonesData;

  const steps: TimelineStepItem[] = milestones.map((m) => ({
    number: String(m.year),
    title: m.milestone,
    description: MILESTONE_DESCRIPTIONS[m.year] || m.milestone,
  }));

  return (
    <ReferenceTimelinePipeline
      id="journey"
      ariaLabel="Our Journey — Two Decades of Steadfast Growth"
      eyebrow="Our Journey"
      heading="Two Decades of Steadfast Growth"
      lead="A disciplined history of institutional partnerships and investor trust in Godhra, Gujarat."
      phases={JOURNEY_PHASES}
      steps={steps}
      dataTone="dark"
    />
  );
};
