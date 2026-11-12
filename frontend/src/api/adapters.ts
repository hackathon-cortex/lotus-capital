import { BackendEnquiry, EnquiryRow } from './types';

/**
 * Status Mapping between Backend enums and Frontend UI representations
 */
export const backendToFrontendStatus = (
  status: BackendEnquiry['status'] | string
): EnquiryRow['status'] => {
  switch (status?.toLowerCase()) {
    case 'new':
      return 'New';
    case 'contacted':
      return 'Contacted';
    case 'in_progress':
    case 'in-progress':
      return 'In Progress';
    case 'qualified':
      return 'Qualified';
    case 'resolved':
    case 'converted':
      return 'Converted';
    case 'closed':
      return 'Closed';
    default:
      return 'New';
  }
};

export const frontendToBackendStatus = (
  status: EnquiryRow['status'] | string
): BackendEnquiry['status'] => {
  switch (status) {
    case 'New':
      return 'new';
    case 'Contacted':
      return 'contacted';
    case 'Qualified':
    case 'In Progress':
      return 'in_progress';
    case 'Converted':
      return 'resolved';
    case 'Closed':
      return 'closed';
    default:
      return 'new';
  }
};

/**
 * Maps a backend enquiry record to a frontend EnquiryRow for table display
 */
export const mapBackendEnquiryToRow = (item: BackendEnquiry): EnquiryRow => {
  const serviceSlug = item.services?.[0]?.service_slug || '';
  const serviceLabel = serviceSlug
    ? serviceSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Financial Consultation';

  const d = new Date(item.created_at);
  const followUpDate = !isNaN(d.getTime())
    ? d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
    : 'Recent';

  return {
    id: item.reference_id || `ENQ-${item.id}`,
    name: item.name,
    phone: item.mobile,
    service: serviceLabel,
    status: backendToFrontendStatus(item.status),
    assignee: item.assigned_to ? `Advisor #${item.assigned_to}` : 'Abhilash C.',
    followUpDate,
  };
};

