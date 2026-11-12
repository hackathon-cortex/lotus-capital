import { useMutation } from '@tanstack/react-query';
import { api } from '../api/client';
import { ApiClientError } from '../api/types';
import { queryClient } from '../api/queryClient';

export interface SubmitEnquiryInput {
  full_name: string;
  mobile: string;
  email?: string | null;
  service: string;
  service_detail?: string[];
  organisation_name?: string | null;
  city?: string | null;
  existing_rohini_id?: string | null;
  contact_method?: string;
  message?: string | null;
  consent: boolean;
  source_path?: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  // Honeypot field (hidden from human users, bots fill it out)
  honeypot?: string;
}

// Client-side anti-double-submit cache (stores recent submitted hashes for 15s)
const recentSubmissions = new Set<string>();

const FORBIDDEN_CREDENTIALS_REGEX = /\b(pan|aadhaar|otp|password|netbanking|cvv)\b/i;

export const useSubmitEnquiry = () => {
  return useMutation(
    {
      mutationFn: async (input: SubmitEnquiryInput) => {
      // 1. Honeypot check: bots fill hidden fields
      if (input.honeypot && input.honeypot.trim().length > 0) {
        // Silently simulate success to deceive the spam bot
        return {
          success: true,
          enquiry_id: `LC-SPAM-${Date.now()}`,
          reference_id: `LC-SPAM-${Date.now()}`,
          message: 'Enquiry received.',
          status: 'received',
        };
      }

      // 2. Sensitive Credential Defense
      if (input.message && FORBIDDEN_CREDENTIALS_REGEX.test(input.message)) {
        throw new ApiClientError(
          'For your security, please do not include sensitive credentials (PAN, Aadhaar, password, OTP) in the message.',
          { status: 422, code: 'FORBIDDEN_KEYWORDS' }
        );
      }

      // 3. Client-side Double Submit Protection
      const cleanedMobile = input.mobile.replace(/\D/g, '').slice(-10);
      const submissionKey = `${input.full_name.trim().toLowerCase()}_${cleanedMobile}_${input.service}`;

      if (recentSubmissions.has(submissionKey)) {
        throw new ApiClientError(
          'An enquiry with these details was just submitted. Please wait a moment before sending another request.',
          { status: 429, code: 'DOUBLE_SUBMIT' }
        );
      }

      // Mark submission in progress
      recentSubmissions.add(submissionKey);
      setTimeout(() => recentSubmissions.delete(submissionKey), 15000);

      const payload = {
        name: input.full_name.trim(),
        full_name: input.full_name.trim(),
        mobile: cleanedMobile,
        email: input.email?.trim() || null,
        service: input.service,
        service_detail: input.service_detail || [],
        organisation_name: input.organisation_name?.trim() || null,
        city: input.city?.trim() || null,
        existing_rohini_id: input.existing_rohini_id?.trim() || null,
        contact_method: input.contact_method || 'phone',
        message: input.message?.trim() || null,
        consent: input.consent === true,
        source_path: input.source_path || (typeof window !== 'undefined' ? window.location.pathname : '/'),
        utm_source: input.utm_source || null,
        utm_medium: input.utm_medium || null,
        utm_campaign: input.utm_campaign || null,
      };

      return api.public.submitEnquiry(payload);
    },
  },
  queryClient
  );
};
