import React from 'react';
import { Link } from 'react-router-dom';
import { InsightArticleSummary } from './FeaturedGuideCard';

export interface InsightsLibraryBentoProps {
  articles: InsightArticleSummary[];
  onResetFilters?: () => void;
}

export const renderArticleIllustration = (key?: string) => {
  switch (key) {
    case 'scales':
      return (
        <svg viewBox="0 0 120 80" width="100%" height="80" fill="none">
          <line x1="60" y1="20" x2="60" y2="68" stroke="#123D67" strokeWidth="3" />
          <line x1="24" y1="28" x2="96" y2="28" stroke="#5B8DB8" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="60" cy="20" r="4" fill="#D9232D" />
          {/* Left Pan */}
          <line x1="30" y1="29" x2="20" y2="48" stroke="#8FA3C8" strokeWidth="1.5" />
          <line x1="30" y1="29" x2="40" y2="48" stroke="#8FA3C8" strokeWidth="1.5" />
          <path d="M 18 48 C 18 56 42 56 42 48 Z" fill="rgba(91, 141, 184, 0.2)" stroke="#123D67" strokeWidth="1.5" />
          {/* Right Pan */}
          <line x1="90" y1="29" x2="80" y2="48" stroke="#8FA3C8" strokeWidth="1.5" />
          <line x1="90" y1="29" x2="100" y2="48" stroke="#8FA3C8" strokeWidth="1.5" />
          <path d="M 78 48 C 78 56 102 56 102 48 Z" fill="rgba(91, 141, 184, 0.2)" stroke="#123D67" strokeWidth="1.5" />
          <ellipse cx="60" cy="68" rx="20" ry="4" fill="#123D67" opacity="0.6" />
        </svg>
      );

    case 'gauge':
      return (
        <svg viewBox="0 0 120 80" width="100%" height="80" fill="none">
          {/* Gauge Arc */}
          <path
            d="M 25 60 A 40 40 0 0 1 95 60"
            stroke="#EEF1F4"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 25 60 A 40 40 0 0 1 80 30"
            stroke="url(#gaugeGrad)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Needle */}
          <line x1="60" y1="60" x2="74" y2="34" stroke="#123D67" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="60" cy="60" r="5" fill="#D9232D" />
          <circle cx="60" cy="60" r="2" fill="#FFFFFF" />
          <text x="60" y="74" textAnchor="middle" fill="#5B8DB8" fontSize="9" fontWeight="700">
            NAV METER
          </text>
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#123D67" />
              <stop offset="100%" stopColor="#5B8DB8" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'calendar-coins':
      return (
        <svg viewBox="0 0 120 80" width="100%" height="80" fill="none">
          {/* Calendar background */}
          <rect x="22" y="16" width="44" height="48" rx="6" fill="#F8FAFC" stroke="#5B8DB8" strokeWidth="1.5" />
          <rect x="22" y="16" width="44" height="14" rx="6" fill="#123D67" />
          <circle cx="34" cy="14" r="2" fill="#D9232D" />
          <circle cx="54" cy="14" r="2" fill="#D9232D" />
          {/* Grid lines */}
          <line x1="32" y1="36" x2="32" y2="58" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="44" y1="36" x2="44" y2="58" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="56" y1="36" x2="56" y2="58" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="24" y1="42" x2="64" y2="42" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="24" y1="52" x2="64" y2="52" stroke="#E2E8F0" strokeWidth="1" />
          {/* Coins stacking */}
          <ellipse cx="84" cy="60" rx="14" ry="4" fill="#8FA3C8" />
          <rect x="70" y="56" width="28" height="4" fill="#5B8DB8" />
          <ellipse cx="84" cy="56" rx="14" ry="4" fill="#C2DBF2" />
          <rect x="70" y="50" width="28" height="6" fill="#5B8DB8" />
          <ellipse cx="84" cy="50" rx="14" ry="4" fill="#C2DBF2" />
          <rect x="70" y="44" width="28" height="6" fill="#5B8DB8" />
          <ellipse cx="84" cy="44" rx="14" ry="4" fill="#D9232D" />
          <text x="84" y="47" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold">
            ₹
          </text>
        </svg>
      );

    case 'shield-heart':
      return (
        <svg viewBox="0 0 120 80" width="100%" height="80" fill="none">
          {/* Shield */}
          <path
            d="M 60 14 Q 78 20 88 28 C 88 52 74 66 60 72 C 46 66 32 52 32 28 Q 42 20 60 14 Z"
            fill="rgba(91, 141, 184, 0.12)"
            stroke="#123D67"
            strokeWidth="2"
          />
          {/* Medical Cross */}
          <rect x="56" y="28" width="8" height="24" rx="2" fill="#D9232D" />
          <rect x="48" y="36" width="24" height="8" rx="2" fill="#D9232D" />
          {/* ECG Line accent */}
          <path
            d="M 38 48 L 46 48 L 50 42 L 54 52 L 58 48 L 82 48"
            stroke="#5B8DB8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'risk-waves':
      return (
        <svg viewBox="0 0 120 80" width="100%" height="80" fill="none">
          {/* Wave cycle */}
          <path
            d="M 18 50 Q 32 24 46 50 T 74 50 T 102 50"
            stroke="#5B8DB8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 18 56 Q 32 36 46 56 T 74 56 T 102 56"
            stroke="#8FA3C8"
            strokeWidth="1.5"
            strokeDasharray="2 3"
          />
          {/* Horizon steady line */}
          <line x1="16" y1="62" x2="104" y2="62" stroke="#123D67" strokeWidth="2" strokeLinecap="round" />
          {/* Central Anchor / Keel */}
          <circle cx="60" cy="30" r="4" fill="#D9232D" />
          <line x1="60" y1="34" x2="60" y2="62" stroke="#123D67" strokeWidth="2" />
          <text x="60" y="74" textAnchor="middle" fill="#123D67" fontSize="8" fontWeight="600">
            VOLATILITY VS TIME
          </text>
        </svg>
      );

    case 'document-lens':
      return (
        <svg viewBox="0 0 120 80" width="100%" height="80" fill="none">
          {/* Document */}
          <rect x="28" y="16" width="46" height="52" rx="4" fill="#FFFFFF" stroke="#8FA3C8" strokeWidth="1.5" />
          <line x1="36" y1="26" x2="64" y2="26" stroke="#123D67" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="34" x2="58" y2="34" stroke="#5B8DB8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="36" y1="42" x2="62" y2="42" stroke="#D7D9DC" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="36" y1="50" x2="54" y2="50" stroke="#D7D9DC" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="36" y1="58" x2="48" y2="58" stroke="#D7D9DC" strokeWidth="1.5" strokeLinecap="round" />
          {/* Magnifying Glass */}
          <circle cx="76" cy="42" r="16" fill="rgba(91, 141, 184, 0.15)" stroke="#123D67" strokeWidth="2.5" />
          <line x1="88" y1="53" x2="102" y2="67" stroke="#D9232D" strokeWidth="3.5" strokeLinecap="round" />
          {/* Checkmark inside lens */}
          <path d="M 70 42 L 74 46 L 82 38" stroke="#123D67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 120 80" width="100%" height="80" fill="none">
          <circle cx="60" cy="40" r="26" fill="rgba(91, 141, 184, 0.15)" stroke="#123D67" strokeWidth="2" />
          <circle cx="60" cy="40" r="6" fill="#D9232D" />
        </svg>
      );
  }
};

export const InsightsLibraryBento: React.FC<InsightsLibraryBentoProps> = ({
  articles,
  onResetFilters,
}) => {
  return (
    <section id="library" className="section-padding" style={{ paddingTop: '1.5rem', paddingBottom: '3.5rem' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--navy-700, #123D67)',
              marginBottom: '0.5rem',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--red-500, #D9232D)',
              }}
            />
            Complete Knowledge Base
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
              fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)',
              color: 'var(--navy-900, #0A2540)',
              marginBottom: '0.5rem',
            }}
          >
            Explore All Guides
          </h2>

          <p style={{ color: 'var(--silver-700, #475569)', fontSize: '1rem', maxWidth: '680px' }}>
            Structured, fact-checked educational articles explaining key terminology, practical checklists,
            and regulatory framework protections.
          </p>
        </div>

        {/* Empty State */}
        {articles.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              padding: '4rem 2rem',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(18, 61, 103, 0.06)',
              border: '1px solid rgba(215, 217, 220, 0.6)',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#EEF1F4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: '#5B8DB8',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                fontSize: '1.4rem',
                color: 'var(--navy-900, #0A2540)',
                marginBottom: '0.75rem',
              }}
            >
              No matching guides found
            </h3>

            <p style={{ color: 'var(--silver-600, #64748b)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
              We could not find any articles matching your search query or selected category.
            </p>

            {onResetFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="btn btn-primary"
                style={{
                  backgroundColor: 'var(--red-500, #D9232D)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '0.65rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          /* Grid of White Bento Cards */
          <div
            className="grid grid-cols-3"
            style={{
              gap: '1.75rem',
            }}
          >
            {articles.map((art) => (
              <article
                key={art.slug}
                className="insight-bento-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '28px',
                  boxShadow: '0 8px 24px rgba(18, 61, 103, 0.06), 0 2px 6px rgba(18, 61, 103, 0.04)',
                  border: '1px solid rgba(215, 217, 220, 0.65)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  transition: 'transform 0.28s ease, box-shadow 0.28s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow =
                    '0 18px 36px rgba(18, 61, 103, 0.12), 0 4px 10px rgba(18, 61, 103, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 24px rgba(18, 61, 103, 0.06), 0 2px 6px rgba(18, 61, 103, 0.04)';
                }}
              >
                {/* Visual Header with unique illustration */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderBottom: '1px solid #EEF1F4',
                    padding: '1.25rem 1rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {renderArticleIllustration(art.illustration)}
                </div>

                {/* Card Body */}
                <div
                  style={{
                    padding: '1.5rem 1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                  }}
                >
                  {/* Category & Read Time */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.85rem',
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: 'rgba(91, 141, 184, 0.12)',
                        color: 'var(--navy-800, #0c2b4c)',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '16px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {art.category}
                    </span>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.78rem',
                        color: 'var(--silver-600, #64748b)',
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {art.readMinutes} min
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                      fontSize: '1.24rem',
                      lineHeight: 1.35,
                      fontWeight: 600,
                      color: 'var(--navy-900, #0A2540)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <Link
                      to={`/insights/${art.slug}`}
                      style={{
                        color: 'inherit',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#5B8DB8')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--navy-900, #0A2540)')}
                    >
                      {art.title}
                    </Link>
                  </h3>

                  {/* Summary */}
                  <p
                    style={{
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      color: 'var(--silver-700, #475569)',
                      marginBottom: '1.5rem',
                      flex: 1,
                    }}
                  >
                    {art.summary}
                  </p>

                  {/* Footer Link */}
                  <div
                    style={{
                      borderTop: '1px solid #EEF1F4',
                      paddingTop: '1rem',
                      marginTop: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Link
                      to={`/insights/${art.slug}`}
                      style={{
                        color: 'var(--navy-800, #0c2b4c)',
                        textDecoration: 'none',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        transition: 'color 0.2s ease, gap 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--red-500, #D9232D)';
                        e.currentTarget.style.gap = '0.7rem';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--navy-800, #0c2b4c)';
                        e.currentTarget.style.gap = '0.45rem';
                      }}
                    >
                      <span>Read guide</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>

                    {art.featured && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--red-600, #b81d25)',
                          fontWeight: 600,
                          backgroundColor: 'rgba(217, 35, 45, 0.08)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '10px',
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
