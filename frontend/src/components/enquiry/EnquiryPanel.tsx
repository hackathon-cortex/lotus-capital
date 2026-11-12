/**
 * Unified Enquiry Form Component Export.
 *
 * All pages and drawers now utilize the single, canonical EnquiryForm component
 * to ensure consistent layout, fields, labels, validation, progress ring,
 * and drawing lotus confirmation.
 */
import {
  EnquiryForm,
  ALL_SERVICES_CONFIG,
  enquirySchema,
} from './EnquiryForm';
import type {
  SupportedService,
  ServiceDetailOption,
  EnquiryFormData,
  EnquiryFormProps,
} from './EnquiryForm';

export type EnquiryPanelProps = EnquiryFormProps;

export const EnquiryPanel = EnquiryForm;

export {
  EnquiryForm,
  ALL_SERVICES_CONFIG,
  enquirySchema,
};

export type {
  SupportedService,
  ServiceDetailOption,
  EnquiryFormData,
};

export default EnquiryPanel;
