import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import insightsData from '@content/pages/insights.json';
import seoData from '@content/data/seo.json';

export const Insights: React.FC = () => {
  const seo = seoData['/insights'];
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 6;

  const allArticles = insightsData.articles || [];
  const totalPages = Math.ceil(allArticles.length / pageSize) || 1;
  const displayedArticles = allArticles.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Hero */}
      <section className="section-padding bg-navy">
        <div className="container">
          <div style={{ maxWidth: '800px' }}>
            <span className="eyebrow" style={{ color: 'var(--red-300)' }}>Educational Guides</span>
            <h1 style={{ color: 'var(--white)', marginBottom: '1.25rem' }}>
              {insightsData.headline}
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--silver-300)' }}>
              {insightsData.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Articles Listing */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-3">
            {displayedArticles.map((art) => (
              <div key={art.slug} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge badge-info">{art.category}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--silver-500)' }}>{art.readTime}</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>
                    <Link to={`/insights/${art.slug}`} style={{ color: 'var(--navy-900)' }}>
                      {art.title}
                    </Link>
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                    {art.summary}
                  </p>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--silver-500)', marginBottom: '0.5rem' }}>
                    Published: {art.publishedDate}
                  </div>
                  <Link to={`/insights/${art.slug}`} className="btn btn-secondary" style={{ width: '100%', padding: '0.5rem' }}>
                    Read Guide &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <Link
                  key={idx}
                  to={`/insights?page=${idx + 1}`}
                  className={`btn ${page === idx + 1 ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  {idx + 1}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

