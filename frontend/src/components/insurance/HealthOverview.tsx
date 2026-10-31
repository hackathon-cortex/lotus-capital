import React from 'react';

export interface HealthOverviewProps {
  id?: string;
}

const HIGHLIGHT_TILES = [
  {
    title: 'Cashless Network',
    desc: 'Empanelled network hospitals across Gujarat and pan-India for direct hospitalisation claims.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--navy-900, #123D67)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: 'Pre & Post Care',
    desc: 'Reimbursement for diagnostic investigations, specialist consults, and post-discharge medicines.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--navy-900, #123D67)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: 'Day Care Treatments',
    desc: 'Cover for advanced surgeries and procedures that do not require an overnight 24-hour hospital stay.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--navy-900, #123D67)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: 'Restoration Benefits',
    desc: 'Replenishment features that restore your sum insured if exhausted during the policy year.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--navy-900, #123D67)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
      </svg>
    ),
  },
];

export const HealthOverview: React.FC<HealthOverviewProps> = ({ id = 'overview' }) => {
  return (
    <section
      id={id}
      className="health-overview-section gi-stacked-section"
      style={{
        position: 'relative',
        zIndex: 11,
        marginTop: '-36px',
        borderTopLeftRadius: '36px',
        borderTopRightRadius: '36px',
        backgroundColor: '#ffffff',
        boxShadow: '0 -10px 40px rgba(10,37,64,0.06)',
        padding: '4.5rem 1.5rem 4rem',
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(320px, 1fr)',
            gap: '3.5rem',
            alignItems: 'center',
          }}
          className="health-overview-grid"
        >
          {/* Left Column: Context & Overview */}
          <div>
            <span
              className="eyebrow"
              style={{
                display: 'inline-block',
                color: 'var(--navy-700, #0d2b4a)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}
            >
              CONSULTATIVE GUIDANCE &bull; OBJECTIVE REVIEW
            </span>

            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
                fontWeight: 700,
                color: 'var(--navy-950, #051329)',
                lineHeight: 1.2,
                marginBottom: '1.25rem',
              }}
            >
              Navigating Health Cover with <span style={{ fontStyle: 'italic', color: 'var(--navy-900, #123D67)' }}>Transparency.</span>
            </h2>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--ink, #1f2933)',
                lineHeight: 1.7,
                marginBottom: '1.25rem',
              }}
            >
              Health insurance policies differ in cover, exclusions, waiting periods, room-rent limits, co-payments, network hospitals, renewal terms and claim process. Ask the Lotus Capital team about the options available and read the insurer&apos;s policy documents before you decide.
            </p>

            <p
              style={{
                fontSize: '0.94rem',
                color: 'var(--ink, #1f2933)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Comprehensive health insurance covers hospitalisation, inpatient treatments, and specified day care procedures, shielding family savings from unexpected medical expenses.
            </p>
          </div>

          {/* Right Column: 4 Highlight Cards (2x2 Grid) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
            }}
          >
            {HIGHLIGHT_TILES.map((tile, idx) => (
              <div
                key={idx}
                className="health-tile-card"
                style={{
                  backgroundColor: 'var(--silver-100, #f8f9fa)',
                  borderRadius: '20px',
                  padding: '1.5rem 1.25rem',
                  border: '1px solid var(--silver-300, #d7d9dc)',
                  transition: 'all 0.24s cubic-bezier(0.22, 1, 0.36, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--navy-100, #eaf1f8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {tile.icon}
                </div>
                <div>
                  <h4
                    style={{
                      margin: '0 0 0.35rem',
                      fontSize: '0.98rem',
                      fontWeight: 700,
                      color: 'var(--navy-900, #0a2540)',
                    }}
                  >
                    {tile.title}
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.84rem',
                      color: 'var(--ink, #1f2933)',
                      lineHeight: 1.5,
                    }}
                  >
                    {tile.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
