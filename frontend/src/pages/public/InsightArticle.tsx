import { useContactDrawer } from '../../context/ContactDrawerContext';
import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, Navigate } from 'react-router-dom';
import rawInsightsData from '@content/data/insights.json';
import { ArticleReadingProgressBar } from '../../components/insights/ArticleReadingProgressBar';
import { ArticleTableOfContents, TocHeading } from '../../components/insights/ArticleTableOfContents';
import { ArticleBlockRenderer } from '../../components/insights/ArticleBlockRenderer';
import { LotusLogo } from '../../components/common/LotusLogo';

interface FullArticle {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags?: string[];
  readMinutes: number;
  lastUpdated?: string | null;
  featured?: boolean;
  relatedService?: string;
  illustration?: string;
  takeaways?: string[];
  blocks: any[];
  questionsToAsk?: string[];
  faqs?: { question?: string; answer?: string; q?: string; a?: string }[];
  sources?: { title: string; url?: string }[];
}

export const InsightArticle: React.FC = () => {
  const { openContactDrawer } = useContactDrawer();
  const { slug } = useParams<{ slug: string }>();
  const allArticles: FullArticle[] = rawInsightsData as unknown as FullArticle[];

  const currentIndex = allArticles.findIndex((a) => a.slug === slug);
  const article = currentIndex !== -1 ? allArticles[currentIndex] : null;

  // Extract headings for Table of Contents
  const headings: TocHeading[] = useMemo(() => {
    if (!article) return [];
    const list: TocHeading[] = [];
    article.blocks.forEach((b) => {
      if (b.type === 'heading' && b.text) {
        const id = b.text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        list.push({
          id,
          text: b.text,
          level: b.level || 2,
        });
      }
    });
    if (article.questionsToAsk && article.questionsToAsk.length > 0) {
      list.push({
        id: 'questions-to-ask',
        text: 'Questions to Ask',
        level: 2,
      });
    }
    if (article.faqs && article.faqs.length > 0) {
      list.push({
        id: 'faqs',
        text: 'Common Queries',
        level: 2,
      });
    }
    return list;
  }, [article]);

  if (!article) {
    return <Navigate to="/insights" replace />;
  }

  // Previous and Next articles
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  const isInsurance =
    article.category.toLowerCase().includes('insurance') ||
    article.relatedService === 'health-insurance' ||
    article.relatedService === 'general-insurance' ||
    article.relatedService === 'life-insurance';

  // Service label and destination link
  const getServiceInfo = (serviceKey?: string) => {
    switch (serviceKey) {
      case 'mutual-funds':
        return { label: 'Mutual Funds Advisory', path: '/investments/mutual-funds' };
      case 'health-insurance':
        return { label: 'Health Insurance Solutions', path: '/services/health-insurance' };
      case 'general-insurance':
        return { label: 'General Insurance Protection', path: '/services/general-insurance' };
      case 'life-insurance':
        return { label: 'Life Insurance Guidance', path: '/services/life-insurance' };
      case 'equity':
        return { label: 'Equity & Demat Services', path: '/investments/equity' };
      case 'other-solutions':
        return { label: 'Fixed Deposits & Bonds', path: '/investments/other-solutions' };
      default:
        return { label: 'Financial Services', path: '/services' };
    }
  };

  const serviceInfo = getServiceInfo(article.relatedService);

  return (
    <>
      <Helmet>
        <title>{article.title} | Lotus Capital Insights</title>
        <meta name="description" content={article.summary} />
      </Helmet>

      {/* Thin Red Reading Progress Bar */}
      <ArticleReadingProgressBar />

      {/* Article Hero */}
      <section
        className="insight-article-hero"
        style={{
          position: 'relative',
          minHeight: '440px',
          backgroundColor: 'var(--navy-950, #06182c)',
          backgroundImage: `
            radial-gradient(ellipse at 80% 20%, rgba(91, 141, 184, 0.22) 0%, rgba(10, 37, 64, 0) 70%),
            linear-gradient(135deg, #07192d 0%, #0c2b4c 60%, #153c65 100%)
          `,
          color: 'var(--white)',
          overflow: 'hidden',
          paddingTop: 'calc(var(--header-h, 76px) + 24px)',
          paddingBottom: '3.5rem',
        }}
      >
        {/* Faint grid texture overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(to right, rgba(215, 217, 220, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(215, 217, 220, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Floating Lotus Watermark */}
        <div
          style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            width: '420px',
            height: '420px',
            opacity: 0.05,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <LotusLogo variant="watermark" width="100%" height="100%" />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 3, maxWidth: '1100px' }}>
          {/* Breadcrumb INSIDE the hero */}
          <nav
            aria-label="Breadcrumb inside hero"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              color: 'var(--silver-300)',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/"
              style={{
                color: 'var(--silver-300)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--silver-300)')}
            >
              Home
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>
            <Link
              to="/insights"
              style={{
                color: 'var(--silver-300)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--silver-300)')}
            >
              Insights
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>
            <span style={{ color: '#8fa3c8' }}>{article.category}</span>
          </nav>

          {/* Eyebrow & Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                backgroundColor: 'rgba(91, 141, 184, 0.2)',
                color: '#c2dbf2',
                border: '1px solid rgba(91, 141, 184, 0.4)',
                padding: '0.3rem 0.8rem',
                borderRadius: '16px',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              {article.category}
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                color: 'var(--silver-300)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {article.readMinutes} min read
            </span>

            {/* Date rendered ONLY when lastUpdated is non-null */}
            {article.lastUpdated && (
              <span
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--silver-400)',
                }}
              >
                • Updated {article.lastUpdated}
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
              fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
              lineHeight: 1.2,
              fontWeight: 600,
              color: '#ffffff',
              marginBottom: '1.25rem',
              letterSpacing: '-0.015em',
              maxWidth: '920px',
            }}
          >
            {article.title}
          </h1>

          {/* Lead Summary */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 1.4vw, 1.2rem)',
              lineHeight: 1.65,
              color: 'var(--silver-200, #e2e8f0)',
              maxWidth: '820px',
              margin: 0,
            }}
          >
            {article.summary}
          </p>
        </div>
      </section>

      {/* Main Body with Sidebar Table of Contents */}
      <div
        className="insights-canvas-bg"
        style={{
          backgroundColor: '#EEF1F4',
          minHeight: '80vh',
          backgroundImage: `
            radial-gradient(#CBD5E1 1px, transparent 1px),
            linear-gradient(to bottom, #EEF1F4 0%, #E6EAF0 100%)
          `,
          backgroundSize: '24px 24px, 100% 100%',
          paddingTop: '2.5rem',
          paddingBottom: '4.5rem',
        }}
      >
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div
            className="article-layout-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 260px) minmax(0, 1fr)',
              gap: '2.5rem',
              alignItems: 'flex-start',
            }}
          >
            {/* Left Sticky Table of Contents */}
            <ArticleTableOfContents headings={headings} />

            {/* Right Main Article Content Card */}
            <main>
              <div
                className="article-card-main"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '32px',
                  padding: 'clamp(2rem, 4vw, 3.25rem)',
                  boxShadow: '0 12px 36px rgba(18, 61, 103, 0.06), 0 2px 8px rgba(18, 61, 103, 0.04)',
                  border: '1px solid rgba(215, 217, 220, 0.7)',
                  marginBottom: '2.5rem',
                }}
              >
                <ArticleBlockRenderer
                  takeaways={article.takeaways}
                  blocks={article.blocks}
                  questionsToAsk={article.questionsToAsk}
                  faqs={article.faqs}
                  sources={article.sources}
                  isInsurance={isInsurance}
                />
              </div>

              {/* Related Service Consultation CTA Card */}
              {article.relatedService && (
                <div
                  style={{
                    backgroundColor: 'linear-gradient(135deg, #0A2540 0%, #123D67 100%)',
                    background: '#0A2540',
                    color: '#ffffff',
                    borderRadius: '28px',
                    padding: '2.25rem 2.5rem',
                    boxShadow: '0 12px 28px rgba(10, 37, 64, 0.15)',
                    marginBottom: '2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '2rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ maxWidth: '520px' }}>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#5B8DB8',
                        marginBottom: '0.4rem',
                      }}
                    >
                      LOCAL ADVISORY SUPPORT
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                        fontSize: '1.45rem',
                        color: '#ffffff',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Applying These Principles to Your Goals
                    </h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--silver-300)', lineHeight: 1.55, margin: 0 }}>
                      Lotus Capital provides transparent, zero-pressure consultations in Godhra to evaluate your
                      specific portfolio allocations or policy clauses.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                    <Link
                      to={serviceInfo.path}
                      className="btn"
                      style={{
                        backgroundColor: 'var(--red-500, #D9232D)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '24px',
                        padding: '0.75rem 1.4rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        boxShadow: '0 4px 12px rgba(217, 35, 45, 0.35)',
                      }}
                    >
                      Explore {serviceInfo.label} →
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => openContactDrawer(article.relatedService, e.currentTarget)}
                      className="btn"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        borderRadius: '24px',
                        padding: '0.75rem 1.4rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Talk to an Advisor
                    </button>
                  </div>
                </div>
              )}

              {/* Previous / Next Article Navigation Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: prevArticle && nextArticle ? '1fr 1fr' : '1fr',
                  gap: '1.5rem',
                }}
              >
                {prevArticle && (
                  <Link
                    to={`/insights/${prevArticle.slug}`}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '24px',
                      padding: '1.5rem 1.75rem',
                      border: '1px solid rgba(215, 217, 220, 0.7)',
                      boxShadow: '0 6px 18px rgba(18, 61, 103, 0.04)',
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(18, 61, 103, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 6px 18px rgba(18, 61, 103, 0.04)';
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: 'var(--silver-500)', fontWeight: 600, marginBottom: '0.4rem' }}>
                      ← PREVIOUS GUIDE
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: 'var(--navy-900, #0A2540)',
                        lineHeight: 1.35,
                      }}
                    >
                      {prevArticle.title}
                    </span>
                  </Link>
                )}

                {nextArticle && (
                  <Link
                    to={`/insights/${nextArticle.slug}`}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '24px',
                      padding: '1.5rem 1.75rem',
                      border: '1px solid rgba(215, 217, 220, 0.7)',
                      boxShadow: '0 6px 18px rgba(18, 61, 103, 0.04)',
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: prevArticle ? 'right' : 'left',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(18, 61, 103, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 6px 18px rgba(18, 61, 103, 0.04)';
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: 'var(--silver-500)', fontWeight: 600, marginBottom: '0.4rem' }}>
                      NEXT GUIDE →
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: 'var(--navy-900, #0A2540)',
                        lineHeight: 1.35,
                      }}
                    >
                      {nextArticle.title}
                    </span>
                  </Link>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};
