import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';

export const EnquiryThankYou: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref');

  return (
    <>
      <Helmet>
        <title>Thank You | Lotus Capital</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container section-padding" style={{ maxWidth: '700px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem 2rem', borderTop: '4px solid var(--success)' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#d4edda',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              margin: '0 auto 1.5rem',
            }}
          >
            ✓
          </div>

          <h1>Thank you for contacting Lotus Capital.</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--muted)', margin: '1rem 0 1.5rem' }}>
            Your enquiry has been received. Our team will review the details and contact you by your chosen method, during business hours.
          </p>

          {ref && (
            <div
              style={{
                backgroundColor: 'var(--silver-100)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '2rem',
                display: 'inline-block',
              }}
              data-testid="enquiry-ref"
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Enquiry Reference: </span>
              <strong style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: 'var(--navy-900)' }}>
                {ref}
              </strong>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary">
              Return to Home
            </Link>
            <Link to="/services" className="btn btn-secondary">
              Explore Our Services
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

