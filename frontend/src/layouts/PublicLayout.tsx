import React from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/nav/Header';
import { Breadcrumbs } from '../components/nav/Breadcrumbs';
import { Footer } from '../components/nav/Footer';

export const PublicLayout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const previewToken = searchParams.get('preview');

  return (
    <div className="public-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {previewToken && (
        <>
          <Helmet>
            <meta name="robots" content="noindex, nofollow" />
          </Helmet>
          <div
            style={{
              backgroundColor: '#fffae6',
              borderBottom: '2px solid var(--warning)',
              padding: '0.6rem 1rem',
              textAlign: 'center',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#875a00',
              zIndex: 1100,
            }}
            data-testid="preview-banner"
          >
            ⚠️ Preview Mode Active (Token: {previewToken.slice(0, 10)}...). This is draft CMS content, not published to the public.
          </div>
        </>
      )}

      <Header />
      <Breadcrumbs />

      <main style={{ flex: 1 }} id="main-content" tabIndex={-1}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

