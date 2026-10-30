import { useMemo } from 'react';
import statisticsData from '@content/data/statistics.json';
import siteData from '@content/data/site.json';
import { StatisticItem } from '@content/data/types';

export interface RenderableStat {
  id: string;
  label: string;
  value: string;
  displayText: string;
  unit?: string;
  tier: string;
  asOfText: string;
  definitionNote?: string;
  isUnverified: boolean;
}

export function filterPublicStats(
  stats: StatisticItem[],
  showPendingDev = false
): RenderableStat[] {
  return stats
    .filter((item) => {
      // RULE: Tier C or withheld stats NEVER render on any public page, even in dev
      if (item.tier === 'C' || item.approvalStatus === 'withheld') {
        return false;
      }

      // Approved with valid asOfDate renders
      if (item.approvalStatus === 'approved' && item.asOfDate) {
        return true;
      }

      // Pending stats only render if the dev flag is enabled
      if (item.approvalStatus === 'pending' && showPendingDev) {
        return true;
      }

      return false;
    })
    .map((item) => {
      const isUnverified = item.approvalStatus === 'pending';
      // For approved stats, public pages use the group caption from site.json
      const asOfText = isUnverified
        ? 'As of [date to be confirmed]'
        : '';

      return {
        id: item.id,
        label: item.label,
        value: item.value,
        displayText: item.displayText,
        unit: item.unit,
        tier: item.tier,
        asOfText,
        definitionNote: isUnverified ? item.definitionNote : undefined,
        isUnverified,
      };
    });
}

export function useStatistics(pageIdOrIds?: string | string[]) {
  const showPending = import.meta.env.VITE_SHOW_PENDING_STATS === 'true';

  const stats = useMemo(() => {
    const rawList = statisticsData as StatisticItem[];

    let relevantList: StatisticItem[];
    if (!pageIdOrIds) {
      relevantList = rawList;
    } else if (Array.isArray(pageIdOrIds)) {
      relevantList = rawList.filter((item) => pageIdOrIds.includes(item.id));
    } else {
      relevantList = rawList.filter((item) => item.pages.includes(pageIdOrIds));
    }

    return filterPublicStats(relevantList, showPending);
  }, [pageIdOrIds, showPending]);

  return { stats, allRawStats: statisticsData as StatisticItem[], statsAsOf: siteData.statsAsOf };
}

