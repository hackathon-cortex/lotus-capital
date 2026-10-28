import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import privacyData from '@content/pages/privacy-policy.json';
import termsData from '@content/pages/terms-and-conditions.json';
import disclosuresData from '@content/pages/disclosures.json';
import complaintsData from '@content/pages/complaints.json';
import registrationsData from '@content/data/registrations.json';
import contactData from '@content/data/contact.json';

export const LegalPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  let pageData: any;
  let title = 'Legal';

  if (path === '/privacy-policy') {
    pageData = privacyData;
    title = 'Privacy Policy | Lotus Capital';
  } else if (path === '/terms-and-conditions') {
    pageData = termsData;
    title = 'Terms & Conditions | Lotus Capital';
  } else if (path === '/disclosures') {
    pageData = disclosuresData;
    title = 'Regulatory & Risk Disclosures | Lotus Capital';
  } else if (path === '/complaints') {
    pageData = complaintsData;
    title = 'Complaints & Grievance Information | Lotus Capital';
  } else {
    pageData = privacyData;
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <section className="section-padding bg-navy">
        <div className="container">
          <div style={{ maxWidth: '800px' }}>
            <span className="eyebrow" style={{ color: 'var(--red-300)' }}>Legal & Regulatory</span>
            <h1 style={{ color: 'var(--white)', marginBottom: '0.5rem' }}>{pageData.headline}</h1>
            {pageData.lastUpdated && (
              <p style={{ fontSize: '0.875rem', color: 'var(--silver-500)', margin: 0 }}>
                Last reviewed: {pageData.lastUpdated}
              </p>
            )}
            {pageData.intro && (
              <p style={{ fontSize: '1.05rem', color: 'var(--silver-300)', marginTop: '1rem' }}>
                {pageData.intro}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="container section-padding" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {pageData.sections?.map((section: any) => {
            if (section.type === 'registrationsTable') {
              return (
                <div key={section.id} className="card">
                  <h3>{section.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{section.copy}</p>
                  <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Registration</th>
                          <th>Number</th>
                          <th>Holder</th>
                          <th>Wording</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrationsData.map((r) => (
                          <tr key={r.id}>
                            <td><strong>{r.clientEntry}</strong></td>
                            <td><code>{r.number}</code></td>
                            <td>{r.holder}</td>
                            <td style={{ fontSize: '0.85rem' }}>{r.recommendedWording}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }

            if (section.type === 'complaintContact') {
              return (
                <div key={section.id} className="card" style={{ borderLeft: '4px solid var(--navy-700)' }}>
                  <h3>{section.title}</h3>
                  <div style={{ marginTop: '1rem', lineHeight: '1.8' }}>
                    <p><strong>Phone:</strong> {section.phone}</p>
                    <p><strong>Email:</strong> {section.email}</p>
                    <p><strong>Office:</strong> {section.address}</p>
                    <p><strong>Grievance Officer:</strong> {section.grievanceOfficer}</p>
                  </div>
                </div>
              );
            }

            if (section.type === 'escalationGuide') {
              return (
                <div key={section.id} className="card" style={{ backgroundColor: 'var(--silver-100)' }}>
                  <h3>{section.title}</h3>
                  <ul style={{ paddingLeft: '1.25rem', marginTop: '1rem', lineHeight: '1.8' }}>
                    {section.points?.map((pt: string, idx: number) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              );
            }

            return (
              <div key={section.id} className="card">
                <h3>{section.title}</h3>
                <p style={{ margin: 0, color: 'var(--ink)', lineHeight: '1.7' }}>
                  {section.copy}
                </p>
              </div>
            );
          })}
        </div>

        {path === '/complaints' && (
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)' }}>
              For general assistance before lodging a grievance, you can contact our Godhra office: {contactData.phoneDisplay}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

