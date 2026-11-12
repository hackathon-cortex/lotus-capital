import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { queryKeys } from '../api/queryKeys';
import { queryClient } from '../api/queryClient';
import rawFaqsSnapshot from '@content/data/faqs.json';

export interface FAQItem {
  id?: number | string;
  question: string;
  answer: string;
  category?: string;
  sort_order?: number;
}

export const getFallbackFaqs = (category?: string): FAQItem[] => {
  const list: FAQItem[] = Array.isArray(rawFaqsSnapshot)
    ? rawFaqsSnapshot
    : (rawFaqsSnapshot as any)?.faqs || [];

  if (category) {
    return list.filter((f) => f.category?.toLowerCase() === category.toLowerCase());
  }
  return list;
};

export const useFaqs = (category?: string) => {
  return useQuery(
    {
      queryKey: [...queryKeys.content.faqs, category || 'all'],
      queryFn: async () => {
        try {
          const backendFaqs = await api.public.getFaqs();
          if (Array.isArray(backendFaqs) && backendFaqs.length > 0) {
            if (category) {
              return backendFaqs.filter((f: any) => f.category?.toLowerCase() === category.toLowerCase());
            }
            return backendFaqs;
          }
          return getFallbackFaqs(category);
        } catch {
          return getFallbackFaqs(category);
        }
      },
      initialData: () => getFallbackFaqs(category),
      staleTime: 1000 * 60 * 15, // 15 minutes
    },
    queryClient
  );
};
