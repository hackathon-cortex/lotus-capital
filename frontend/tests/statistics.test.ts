import { describe, it, expect } from 'vitest';
import { filterPublicStats } from '../src/hooks/useStatistics';
import { StatisticItem } from '@content/data/types';

describe('Statistics Visibility Rules', () => {
  const sampleStats: StatisticItem[] = [
    {
      id: 'clients_serviced',
      label: 'Total clients serviced',
      value: '2500+',
      displayText: '2,500+ clients serviced',
      tier: 'A',
      asOfDate: null,
      sourceDocument: 'Required_Data.docx',
      approvalStatus: 'pending',
      pages: ['home'],
    },
    {
      id: 'approved_with_date',
      label: 'Verified Metric',
      value: '100+',
      displayText: '100+ verified',
      tier: 'A',
      asOfDate: '31 March 2026',
      sourceDocument: 'Doc.docx',
      approvalStatus: 'approved',
      pages: ['home'],
    },
    {
      id: 'approved_no_date',
      label: 'Approved but missing date',
      value: '50+',
      displayText: '50+ items',
      tier: 'A',
      asOfDate: null,
      sourceDocument: 'Doc.docx',
      approvalStatus: 'approved',
      pages: ['home'],
    },
    {
      id: 'equity_cagr',
      label: 'Advisory Returns',
      value: 'approx. 23% CAGR',
      displayText: 'Approx. 23% CAGR',
      tier: 'C',
      asOfDate: '31 March 2026',
      sourceDocument: 'Required_Data.docx',
      approvalStatus: 'withheld',
      pages: ['equity'],
    },
  ];

  it('filters out pending stats on public site when dev flag is false', () => {
    const result = filterPublicStats(sampleStats, false);
    const ids = result.map((r) => r.id);

    expect(ids).toContain('approved_with_date');
    expect(ids).not.toContain('clients_serviced'); // pending, no date
    expect(ids).not.toContain('approved_no_date'); // approved but missing asOfDate
    expect(ids).not.toContain('equity_cagr'); // Tier C
  });

  it('shows pending stats with unverified flag when dev flag is true', () => {
    const result = filterPublicStats(sampleStats, true);
    const pendingItem = result.find((r) => r.id === 'clients_serviced');

    expect(pendingItem).toBeDefined();
    expect(pendingItem?.isUnverified).toBe(true);
    expect(pendingItem?.asOfText).toBe('As of [date to be confirmed]');
  });

  it('NEVER renders Tier C / withheld stats even when dev flag is true', () => {
    const result = filterPublicStats(sampleStats, true);
    const tierC = result.find((r) => r.id === 'equity_cagr');

    expect(tierC).toBeUndefined();
  });

  it('collapses / skips stats that do not meet approval criteria', () => {
    const onlyPending: StatisticItem[] = [
      {
        id: 'p1',
        label: 'Pending',
        value: '10',
        displayText: '10',
        tier: 'A',
        asOfDate: null,
        sourceDocument: 'Doc',
        approvalStatus: 'pending',
        pages: ['home'],
      },
    ];

    const result = filterPublicStats(onlyPending, false);
    expect(result).toHaveLength(0);
  });
});

