import React from 'react';
import { Link } from 'react-router-dom';

interface PathStep {
  title: string;
  slug: string;
  readMinutes: number;
}

interface LearningPath {
  id: string;
  title: string;
  category: string;
  description: string;
  totalMinutes: number;
  steps: PathStep[];
}

const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'insurance-path',
    title: 'Insurance Protection Track',
    category: 'Insurance Fundamentals',
    description:
      'Learn how to thoroughly inspect policy exclusions, waiting moratoriums, and room-rent clauses before buying.',
    totalMinutes: 10,
    steps: [
      {
        title: 'Review Policy Exclusions & Waiting Periods',
        slug: 'how-to-review-policy-exclusions-and-waiting-periods',
        readMinutes: 5,
      },
      {
        title: 'Questions to Ask Before Choosing Health Insurance',
        slug: 'questions-before-choosing-health-insurance',
        readMinutes: 5,
      },
    ],
  },
  {
    id: 'mf-path',
    title: 'Mutual Fund Literacy Track',
    category: 'Mutual Funds',
    description:
      'Master plan structures, distributor expenses, true meaning of NAV, and disciplined systematic investing.',
    totalMinutes: 15,
    steps: [
      {
        title: 'Direct Plan vs Regular Plan Comparison',
        slug: 'mutual-funds-direct-vs-regular-plan',
        readMinutes: 5,
      },
      {
        title: 'What Net Asset Value (NAV) Really Means',
        slug: 'what-is-nav',
        readMinutes: 4,
      },
      {
        title: 'SIPs: Mechanics & What They Do Not Guarantee',
        slug: 'sips-how-they-work',
        readMinutes: 6,
      },
    ],
  },
  {
    id: 'risk-path',
    title: 'Market Risk & Horizon Track',
    category: 'Equities & Risk',
    description:
      'Understand market volatility, business cycle risks, and why equity capital requires patient horizons.',
    totalMinutes: 11,
    steps: [
      {
        title: 'Understanding Equity-Market Risk',
        slug: 'understanding-equity-risk',
        readMinutes: 5,
      },
      {
        title: 'Systematic Investing (SIP) Discipline',
        slug: 'sips-how-they-work',
        readMinutes: 6,
      },
    ],
  },
];

export const LearningPathsSection: React.FC = () => {
  return (
    <section id="paths" className="section-padding" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
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
            Step-by-Step Sequences
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
              fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)',
              color: 'var(--navy-900, #0A2540)',
              marginBottom: '0.5rem',
            }}
          >
            Curated Learning Paths
          </h2>

          <p style={{ color: 'var(--silver-700, #475569)', fontSize: '1rem', maxWidth: '680px' }}>
            Structured reading tracks designed to guide your learning from foundational definitions to advanced evaluation.
          </p>
        </div>

        {/* 3 Pathway Cards */}
        <div className="grid grid-cols-3" style={{ gap: '1.75rem' }}>
          {LEARNING_PATHS.map((path) => (
            <div
              key={path.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '28px',
                boxShadow: '0 8px 24px rgba(18, 61, 103, 0.06), 0 2px 6px rgba(18, 61, 103, 0.04)',
                border: '1px solid rgba(215, 217, 220, 0.65)',
                padding: '2rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow =
                  '0 16px 32px rgba(18, 61, 103, 0.1), 0 4px 8px rgba(18, 61, 103, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 8px 24px rgba(18, 61, 103, 0.06), 0 2px 6px rgba(18, 61, 103, 0.04)';
              }}
            >
              {/* Top metadata */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    backgroundColor: 'rgba(18, 61, 103, 0.08)',
                    color: 'var(--navy-800, #123D67)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '14px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                  }}
                >
                  {path.category}
                </span>

                <span
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--silver-600, #64748b)',
                    fontWeight: 500,
                  }}
                >
                  ⏱ {path.totalMinutes} min track
                </span>
              </div>

              {/* Pathway Title & Description */}
              <h3
                style={{
                  fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                  fontSize: '1.25rem',
                  lineHeight: 1.3,
                  color: 'var(--navy-900, #0A2540)',
                  marginBottom: '0.65rem',
                }}
              >
                {path.title}
              </h3>

              <p
                style={{
                  fontSize: '0.88rem',
                  lineHeight: 1.55,
                  color: 'var(--silver-700, #475569)',
                  marginBottom: '1.75rem',
                }}
              >
                {path.description}
              </p>

              {/* Connected Steps */}
              <div
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  position: 'relative',
                }}
              >
                {path.steps.map((step, idx) => (
                  <Link
                    key={step.slug}
                    to={`/insights/${step.slug}`}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                      textDecoration: 'none',
                      color: 'inherit',
                      padding: '0.65rem 0.75rem',
                      borderRadius: '14px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #EEF1F4',
                      transition: 'background-color 0.2s ease, border-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#EEF1F4';
                      e.currentTarget.style.borderColor = '#5B8DB8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                      e.currentTarget.style.borderColor = '#EEF1F4';
                    }}
                  >
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: idx === 0 ? 'var(--navy-700, #123D67)' : '#5B8DB8',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      {idx + 1}
                    </span>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '0.86rem',
                          fontWeight: 600,
                          color: 'var(--navy-900, #0A2540)',
                          lineHeight: 1.35,
                          marginBottom: '0.2rem',
                        }}
                      >
                        {step.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--silver-500, #94a3b8)' }}>
                        {step.readMinutes} min read
                      </div>
                    </div>

                    <span style={{ color: 'var(--silver-400)', fontSize: '0.9rem', alignSelf: 'center' }}>
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

