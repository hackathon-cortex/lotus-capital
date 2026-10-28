import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatBlock } from '../src/components/stats/StatBlock';
import { RenderableStat } from '../src/hooks/useStatistics';

describe('StatBlock Component', () => {
  it('returns null and does not render when stats array is empty (grid collapses)', () => {
    const { container } = render(<StatBlock stats={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders unverified badge when stat isUnverified is true', () => {
    const stats: RenderableStat[] = [
      {
        id: 'stat_1',
        label: 'Clients Serviced',
        value: '2500+',
        displayText: '2,500+ clients',
        tier: 'A',
        asOfText: 'As of [date to be confirmed]',
        isUnverified: true,
      },
    ];

    render(<StatBlock stats={stats} />);
    expect(screen.getByText('2500+')).toBeInTheDocument();
    expect(screen.getByText('Clients Serviced')).toBeInTheDocument();
    expect(screen.getByTestId('badge-unverified')).toBeInTheDocument();
    expect(screen.getByText('As of [date to be confirmed]')).toBeInTheDocument();
  });

  it('renders verified stat with definition note caption', () => {
    const stats: RenderableStat[] = [
      {
        id: 'stat_2',
        label: 'AUM Total',
        value: '₹50 crore+',
        displayText: '₹50 crore+ assets',
        tier: 'B',
        asOfText: 'As of 31 March 2026',
        definitionNote: 'Combined across segments',
        isUnverified: false,
      },
    ];

    render(<StatBlock stats={stats} />);
    expect(screen.getByText('₹50 crore+')).toBeInTheDocument();
    expect(screen.queryByTestId('badge-unverified')).not.toBeInTheDocument();
    expect(screen.getByText('As of 31 March 2026')).toBeInTheDocument();
    expect(screen.getByText(/Combined across segments/)).toBeInTheDocument();
  });
});

