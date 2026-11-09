import React from 'react';
import { useLocation } from 'react-router-dom';
import { LegalLayout } from '../../layouts/LegalLayout';
import privacyData from '@content/pages/privacy-policy.json';
import termsData from '@content/pages/terms-and-conditions.json';
import disclosuresData from '@content/pages/disclosures.json';
import complaintsData from '@content/pages/complaints.json';

export const LegalPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  let pageData: any;
  let title = 'Legal | Lotus Capital';
  let breadcrumbLabel = 'Legal';

  if (path === '/privacy-policy') {
    pageData = privacyData;
    title = 'Privacy Policy | Lotus Capital';
    breadcrumbLabel = 'Privacy Policy';
  } else if (path === '/terms-and-conditions') {
    pageData = termsData;
    title = 'Terms & Conditions | Lotus Capital';
    breadcrumbLabel = 'Terms & Conditions';
  } else if (path === '/disclosures') {
    pageData = disclosuresData;
    title = 'Regulatory & Risk Disclosures | Lotus Capital';
    breadcrumbLabel = 'Regulatory & Risk Disclosures';
  } else if (path === '/complaints') {
    pageData = complaintsData;
    title = 'Complaints & Grievance Information | Lotus Capital';
    breadcrumbLabel = 'Complaints & Grievance';
  } else {
    pageData = privacyData;
    breadcrumbLabel = 'Privacy Policy';
  }

  return (
    <LegalLayout
      title={title}
      pageTitle={pageData.headline}
      breadcrumbLabel={breadcrumbLabel}
      summary={pageData.summary || pageData.intro || ''}
      lastUpdated={pageData.lastUpdated}
      sections={pageData.sections || []}
    />
  );
};
