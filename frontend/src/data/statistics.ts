import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { queryKeys } from '../api/queryKeys';
import { queryClient } from '../api/queryClient';
import rawStatsSnapshot from '@content/data/statistics.json';

export interface PublicStatistic {
  statistic_key: string;
  label: string;
  value: string;
  definition?: string | null;
  as_of_date?: string | null;
}

/**
 * Compliance Filter (SEBI & IRDAI Guidelines):
 * 1. Must be approved
 * 2. Must have an as-of date
 * 3. NEVER render 'equity_cagr' (Tier C) under any circumstances
 */
export const filterCompliantStatistics = (items: any[]): PublicStatistic[] => {
  if (!Array.isArray(items)) return [];

  return items
    .filter((item) => {
      // Hard defense-in-depth: Never expose equity_cagr publicly
      const key = item.statistic_key || item.id || item.key;
      if (key === 'equity_cagr') return false;

      // In production, must have an as_of_date
      const asOf = item.as_of_date || item.asOfDate;
      const isDev = import.meta.env.DEV || import.meta.env.VITE_APP_ENV === 'development';
      const showPending = import.meta.env.VITE_SHOW_PENDING_STATS === 'true';

      if (!isDev && !asOf) {
        return false;
      }

      // If approval_status is present, only allow 'approved' (unless dev mode allows pending)
      if (item.approval_status && item.approval_status !== 'approved' && !showPending) {
        return false;
      }

      return true;
    })
    .map((item) => ({
      statistic_key: item.statistic_key || item.id || item.key,
      label: item.label || item.display_text || '',
      value: item.value || item.client_figure || '',
      definition: item.definition || item.definition_note || null,
      as_of_date: item.as_of_date || item.asOfDate || null,
    }));
};

/**
 * Formats statistics array into key-value map for direct lookup by key
 */
export const mapStatisticsByKey = (stats: PublicStatistic[]): Record<string, PublicStatistic> => {
  const map: Record<string, PublicStatistic> = {};
  stats.forEach((s) => {
    map[s.statistic_key] = s;
  });
  return map;
};

/**
 * Static JSON snapshot fallback (used if backend is unreachable or offline)
 */
export const getFallbackStatistics = (): PublicStatistic[] => {
  const rawList = Array.isArray(rawStatsSnapshot)
    ? rawStatsSnapshot
    : (rawStatsSnapshot as any)?.statistics || [];
  return filterCompliantStatistics(rawList);
};

/**
 * TanStack Query Hook for Public Statistics
 */
export const usePublicStatistics = () => {
  return useQuery(
    {
      queryKey: queryKeys.statistics.public,
      queryFn: async () => {
        try {
          const backendStats = await api.public.getStatistics();
          const compliant = filterCompliantStatistics(backendStats);
          if (compliant.length > 0) {
            return compliant;
          }
          return getFallbackStatistics();
        } catch {
          // Fallback snapshot
          return getFallbackStatistics();
        }
      },
      initialData: getFallbackStatistics,
      staleTime: 1000 * 60 * 10, // 10 minutes cache
    },
    queryClient
  );
};
