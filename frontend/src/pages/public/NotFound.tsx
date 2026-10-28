import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Not Found | Lotus Capital</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container section-padding" style={{ textAlign: 'center', maxWidth: '650px' }}>
        <div className="card" style={{ padding: '3.5rem 2rem' }}>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--red-600)', marginBottom: '1rem' }}>
            404
          </div>
          <h1>We couldn&apos;t find that page.</h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', margin: '1rem 0 2rem' }}>
            The link may be outdated or the address may have been entered incorrectly. You can return to the homepage or browse our services.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary">
              Go Home
            </Link>
            <Link to="/services" className="btn btn-secondary">
              Explore Services
            </Link>
            <Link to="/contact-us" className="btn btn-navy">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

