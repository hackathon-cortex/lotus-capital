import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { queryKeys } from '../api/queryKeys';
import { queryClient } from '../api/queryClient';
import rawContactSnapshot from '@content/data/contact.json';

export interface CompanyInfo {
  firm_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  operating_hours?: string;
  amfi_arn?: string;
  nse_ap?: string;
  bse_ap?: string;
  [key: string]: any;
}

export const getFallbackContact = (): CompanyInfo => {
  return (rawContactSnapshot as unknown) as CompanyInfo;
};

export const useContactInfo = () => {
  return useQuery(
    {
      queryKey: queryKeys.content.contact,
      queryFn: async () => {
        try {
          const data = await api.public.getContactInfo();
          if (data && Object.keys(data).length > 0) {
            return { ...getFallbackContact(), ...data };
          }
          return getFallbackContact();
        } catch {
          return getFallbackContact();
        }
      },
      initialData: getFallbackContact,
      staleTime: 1000 * 60 * 30, // 30 mins
    },
    queryClient
  );
};
