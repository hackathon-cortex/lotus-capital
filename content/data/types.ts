export type StatisticTier = 'A' | 'B' | 'C';
export type ApprovalStatus = 'pending' | 'approved' | 'withheld';

export interface StatisticItem {
  id: string;
  label: string;
  value: string;
  displayText: string;
  unit?: string;
  tier: StatisticTier;
  asOfDate: string | null;
  definitionNote?: string;
  sourceDocument: string;
  approvalStatus: ApprovalStatus;
  pages: string[];
}

export interface RegistrationItem {
  id: string;
  clientEntry: string;
  number: string;
  holder: string;
  role: string;
  recommendedWording: string;
  verifyBeforePublishing: string;
  validityDate?: string | null;
  status: 'active' | 'under_process' | 'to_confirm';
}

export interface AwardItem {
  id: string;
  year: number;
  award: string;
  issuedBy: string;
  status: 'certificate_needed' | 'confirmed';
}

export interface MilestoneItem {
  id: string;
  year: number;
  milestone: string;
  status: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  category: 'insurance' | 'broking' | 'depository' | 'amc';
  relationshipLabel: string;
  logoPlaceholder: string;
  status: 'confirmed' | 'pending_permission';
}

export interface ServiceItem {
  slug: string;
  title: string;
  shortDescription: string;
  category: 'insurance' | 'investment';
  statId?: string;
  statDisplayText?: string;
  path: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  page: string;
}

export interface TeamMemberItem {
  id: string;
  name: string;
  designation: string;
  credentials: string;
  bio: string;
  photoPath: string;
  approvalStatus: 'pending' | 'approved';
}

export interface ContactInfo {
  phone: string;
  phoneDisplay: string;
  email: string;
  address: {
    line1: string;
    line2: string;
    landmark: string;
    city: string;
    pincode: string;
    district: string;
    state: string;
    full: string;
  };
  social: {
    handle: string;
    platformPendingConfirmation: boolean;
  };
  whatsapp: {
    enabled: boolean;
    number: string;
    statusNote: string;
  };
  officeHours: string;
}

export interface DisclaimersData {
  footer_disclaimer: string;
  mutual_fund_risk: string;
  equity_market_risk: string;
  insurance_solicitation: string;
  fixed_deposit_risk: string;
  bonds_mld_risk: string;
  calculator_illustration_only: string;
  real_estate_status: string;
}

export interface SeoItem {
  title: string;
  description: string;
  noindex?: boolean;
}

export interface PageSection {
  id: string;
  type: string;
  title?: string;
  subtitle?: string;
  content?: string | string[];
  ctaText?: string;
  ctaLink?: string;
  items?: any[];
  [key: string]: any;
}

export interface PageData {
  route: string;
  title: string;
  headline: string;
  eyebrow?: string;
  intro?: string;
  sections: PageSection[];
}

