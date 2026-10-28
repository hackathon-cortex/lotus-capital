import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, Navigate } from 'react-router-dom';
import insightsData from '@content/pages/insights.json';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';

export const InsightArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = insightsData.articles?.find((a) => a.slug === slug);

  if (!article) {
    return <Navigate to="/insights" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{article.title} | Lotus Capital Insights</title>
        <meta name="description" content={article.summary} />
      </Helmet>

      <article className="section-padding">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <Link to="/insights" style={{ fontSize: '0.875rem', color: 'var(--red-600)', fontWeight: 600 }}>
              &larr; Back to Insights
            </Link>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '1rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-info">{article.category}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--silver-500)' }}>{article.readTime}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--silver-500)' }}>• {article.publishedDate}</span>
            </div>
            <h1>{article.title}</h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--muted)', lineHeight: '1.6' }}>
              {article.summary}
            </p>
          </div>

          <div
            className="card"
            style={{
              padding: '2rem',
              lineHeight: '1.8',
              fontSize: '1.05rem',
              color: 'var(--ink)',
              marginBottom: '3rem',
            }}
          >
            <p>{article.content}</p>

            <div
              style={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: 'var(--silver-100)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                color: 'var(--muted)',
              }}
            >
              <strong>Disclaimer:</strong> This article is published for educational and general information purposes only and does not constitute personalised financial advice or a recommendation to buy or sell securities.
            </div>
          </div>

          {/* Related Service CTA */}
          {article.relatedService && (
            <div style={{ marginBottom: '3rem' }}>
              <EnquiryForm
                defaultService={article.relatedService}
                title="Have Questions on This Topic?"
                subtitle="Speak with an advisor to discuss how these principles apply to your personal situation."
              />
            </div>
          )}
        </div>
      </article>
    </>
  );
};

