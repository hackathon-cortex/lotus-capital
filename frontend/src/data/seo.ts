import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { queryKeys } from '../api/queryKeys';
import { queryClient } from '../api/queryClient';
import rawSeoSnapshot from '@content/data/seo.json';

export interface SeoMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical_url?: string;
  og_image?: string;
  robots?: string;
}

export const getFallbackSeo = (slug: string): SeoMetadata => {
  const snapshot = rawSeoSnapshot as Record<string, any>;
  const cleanSlug = slug.replace(/^\/+/, '');
  const data = snapshot[cleanSlug] || snapshot['default'] || {};
  return {
    title: data.title || 'Lotus Capital | Trusted Financial Advisory & Investment Services',
    description: data.description || 'AMFI-registered mutual fund distributor and financial consultant in Godhra, Gujarat.',
    keywords: data.keywords || [],
    canonical_url: data.canonical_url,
    og_image: data.og_image || '/assets/lotus_capital_logo_traced.svg',
    robots: data.robots || 'index, follow',
  };
};

export const useSeoMetadata = (slug: string) => {
  return useQuery(
    {
      queryKey: queryKeys.content.seo(slug),
      queryFn: async () => {
        try {
          const data = await api.public.getSeo(slug);
          if (data && Object.keys(data).length > 0) {
            return { ...getFallbackSeo(slug), ...data };
          }
          return getFallbackSeo(slug);
        } catch {
          return getFallbackSeo(slug);
        }
      },
      initialData: () => getFallbackSeo(slug),
      staleTime: 1000 * 60 * 30,
    },
    queryClient
  );
};
