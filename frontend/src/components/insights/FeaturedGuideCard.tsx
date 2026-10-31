import React from 'react';
import { Link } from 'react-router-dom';

export interface InsightArticleSummary {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags?: string[];
  readMinutes: number;
  featured?: boolean;
  relatedService?: string;
  illustration?: string;
  takeaways?: string[];
}

export interface FeaturedGuideCardProps {
  article: InsightArticleSummary;
}

export const FeaturedGuideCard: React.FC<FeaturedGuideCardProps> = ({ article }) => {
  return (
    <section id="featured" className="section-padding" style={{ paddingBottom: '2.5rem' }}>
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--red-500, #D9232D)',
              }}
            />
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--navy-700, #123D67)',
              }}
            >
              Featured Master Guide
            </span>
          </div>

          <span style={{ fontSize: '0.85rem', color: 'var(--silver-600, #64748b)' }}>
            Essential Foundation
          </span>
        </div>

        <div
          className="featured-guide-card"
          style={{
            position: 'relative',
            borderRadius: '32px',
            background: 'linear-gradient(135deg, #0A2540 0%, #123D67 55%, #1d4d7c 100%)',
            color: '#ffffff',
            boxShadow: '0 20px 48px rgba(10, 37, 64, 0.16), 0 4px 12px rgba(10, 37, 64, 0.08)',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow =
              '0 28px 60px rgba(10, 37, 64, 0.22), 0 8px 20px rgba(10, 37, 64, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow =
              '0 20px 48px rgba(10, 37, 64, 0.16), 0 4px 12px rgba(10, 37, 64, 0.08)';
          }}
        >
          {/* Subtle grid and decorative background elements */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                radial-gradient(circle at 85% 30%, rgba(91, 141, 184, 0.25) 0%, transparent 60%),
                linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 36px 36px, 36px 36px',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              padding: 'clamp(2rem, 4vw, 3.5rem)',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 1fr)',
              gap: '2.5rem',
              alignItems: 'center',
            }}
            className="featured-guide-inner"
          >
            {/* Left Content */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    backgroundColor: 'rgba(91, 141, 184, 0.25)',
                    color: '#c2dbf2',
                    border: '1px solid rgba(91, 141, 184, 0.45)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
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
                    color: 'var(--silver-300, #d7d9dc)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {article.readMinutes} min read
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                  fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
                  fontWeight: 600,
                  lineHeight: 1.22,
                  color: '#ffffff',
                  marginBottom: '1rem',
                  letterSpacing: '-0.01em',
                }}
              >
                {article.title}
              </h2>

              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.65,
                  color: 'var(--silver-200, #e2e8f0)',
                  marginBottom: '1.75rem',
                  maxWidth: '640px',
                }}
              >
                {article.summary}
              </p>

              {/* Highlights pills */}
              {article.takeaways && article.takeaways.length > 0 && (
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '1rem 1.25rem',
                    marginBottom: '2rem',
                    maxWidth: '640px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#8fa3c8',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Core Takeaway
                  </div>
                  <div style={{ fontSize: '0.92rem', color: '#f1f5f9', lineHeight: 1.5 }}>
                    {article.takeaways[0]}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to={`/insights/${article.slug}`}
                  className="btn btn-primary"
                  style={{
                    backgroundColor: 'var(--red-500, #D9232D)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.85rem 1.75rem',
                    borderRadius: '28px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    boxShadow: '0 4px 14px rgba(217, 35, 45, 0.35)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#B81D25';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--red-500, #D9232D)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>Read the Complete Guide</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>

                <span style={{ fontSize: '0.85rem', color: 'var(--silver-400, #94a3b8)' }}>
                  Unbiased breakdown • No product promotion
                </span>
              </div>
            </div>

            {/* Right Illustration: Scales of Comparison */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '340px',
                  aspectRatio: '1 / 1',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '28px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 0 24px rgba(0, 0, 0, 0.2)',
                }}
              >
                <svg
                  viewBox="0 0 200 200"
                  width="100%"
                  height="100%"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ overflow: 'visible' }}
                >
                  {/* Central Pedestal */}
                  <rect x="96" y="50" width="8" height="110" rx="4" fill="#5B8DB8" opacity="0.8" />
                  <ellipse cx="100" cy="164" rx="36" ry="10" fill="#204E78" />
                  <ellipse cx="100" cy="162" rx="28" ry="7" fill="#5B8DB8" opacity="0.6" />

                  {/* Pivot Point */}
                  <circle cx="100" cy="50" r="10" fill="#D9232D" />
                  <circle cx="100" cy="50" r="4" fill="#FFFFFF" />

                  {/* Fulcrum Beam (subtle balanced angle) */}
                  <line
                    x1="30"
                    y1="64"
                    x2="170"
                    y2="64"
                    stroke="#D7D9DC"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                  {/* Left Pan (Direct Plan) */}
                  <line x1="42" y1="66" x2="26" y2="108" stroke="#8FA3C8" strokeWidth="2" />
                  <line x1="42" y1="66" x2="58" y2="108" stroke="#8FA3C8" strokeWidth="2" />
                  <path
                    d="M 22 108 C 22 124 62 124 62 108 Z"
                    fill="rgba(91, 141, 184, 0.3)"
                    stroke="#5B8DB8"
                    strokeWidth="2.5"
                  />
                  <text x="42" y="100" fill="#C2DBF2" fontSize="9" fontWeight="700" textAnchor="middle">
                    DIRECT
                  </text>
                  <text x="42" y="136" fill="#8FA3C8" fontSize="8" textAnchor="middle">
                    Lower TER
                  </text>

                  {/* Right Pan (Regular Plan) */}
                  <line x1="158" y1="66" x2="142" y2="108" stroke="#8FA3C8" strokeWidth="2" />
                  <line x1="158" y1="66" x2="174" y2="108" stroke="#8FA3C8" strokeWidth="2" />
                  <path
                    d="M 138 108 C 138 124 178 124 178 108 Z"
                    fill="rgba(91, 141, 184, 0.3)"
                    stroke="#5B8DB8"
                    strokeWidth="2.5"
                  />
                  <text x="158" y="100" fill="#C2DBF2" fontSize="9" fontWeight="700" textAnchor="middle">
                    REGULAR
                  </text>
                  <text x="158" y="136" fill="#8FA3C8" fontSize="8" textAnchor="middle">
                    Advisor Support
                  </text>

                  {/* Center Lotus Accent */}
                  <circle cx="100" cy="110" r="16" fill="rgba(217, 35, 45, 0.15)" />
                  <path
                    d="M 100 98 C 105 106 109 113 100 120 C 91 113 95 106 100 98 Z"
                    fill="#D9232D"
                    opacity="0.8"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

