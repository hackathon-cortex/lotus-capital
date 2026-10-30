import React from 'react';

export interface CategoryItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  icon: React.ReactNode;
  featured?: boolean;
  spanCols?: number; // 1 or 2
  illustration?: React.ReactNode;
  serviceDetail: string; // value to pass to enquiry form
}

export interface CategoryBentoProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  categories?: CategoryItem[];
  onSelectCategory?: (detail: string) => void;
  onCategorySelect?: (categoryId: string) => void;
}

export const DEFAULT_GI_CATEGORIES: CategoryItem[] = [
  {
    id: 'motor',
    serviceDetail: 'vehicle',
    title: 'Vehicle Insurance',
    featured: true,
    spanCols: 2,
    badge: '140+ Serviced',
    description:
      'Comprehensive and bumper-to-bumper zero-depreciation coverage for private four-wheelers, two-wheelers, and commercial logistics fleets with seamless renewal assistance.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    ),
    illustration: (
      <svg width="180" height="90" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 70 L35 70 M65 70 L135 70 M165 70 L180 70" stroke="#0a2540" strokeWidth="2.5" />
        <circle cx="50" cy="70" r="14" stroke="#d9232d" strokeWidth="2.5" />
        <circle cx="150" cy="70" r="14" stroke="#d9232d" strokeWidth="2.5" />
        <path d="M35 65 L45 42 Q50 35 65 35 L125 35 Q140 35 155 52 L172 58 Q180 60 180 68 L180 70" stroke="#0a2540" strokeWidth="2" fill="rgba(10,37,64,0.03)" />
        <path d="M70 35 L70 55 L120 55 L135 35" stroke="rgba(10,37,64,0.3)" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'property',
    serviceDetail: 'property',
    title: 'Property & Fire Cover',
    description:
      'Protection against fire, explosion, storm, flood, and earthquake for homes, commercial establishments, warehouses, and industrial units.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'marine',
    serviceDetail: 'marine',
    title: 'Marine & Cargo Transit',
    description:
      'Inland and multi-modal transit insurance safeguarding raw materials and finished goods against transit loss, collision, or water damage.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
        <path d="M12 2v8" />
        <path d="M8 6h8" />
      </svg>
    ),
  },
  {
    id: 'liability',
    serviceDetail: 'liability',
    title: 'Business Liabilities',
    description:
      'Shield enterprise operations against third-party bodily injury, property damage, and directors & officers litigation risks.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'business',
    serviceDetail: 'business',
    title: 'Shopkeeper & SME Packages',
    description:
      'Convenient multi-peril package policies combining burglary, cash-in-transit, plate glass, and tenant liability into one plan.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    id: 'travel',
    serviceDetail: 'travel',
    title: 'Travel Insurance',
    description:
      'Comprehensive emergency protection for domestic business trips and international travel covering medical emergencies and baggage loss.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    ),
  },
];

export const CategoryBento: React.FC<CategoryBentoProps> = ({
  id = 'categories',
  eyebrow = 'PRODUCT TAXONOMY',
  title = 'General Insurance Solutions',
  subtitle = 'Protecting personal mobility, enterprise facilities, and commercial risks in Godhra.',
  categories = DEFAULT_GI_CATEGORIES,
  onSelectCategory,
  onCategorySelect,
}) => {
  const handleTileClick = (detail: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelectCategory) {
      onSelectCategory(detail);
    }
    if (onCategorySelect) {
      onCategorySelect(detail);
    }
    const el = document.getElementById('enquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id={id}
      className="section-padding bg-light stacked-section gi-stacked-section"
      style={{
        position: 'relative',
        zIndex: 10,
        marginTop: '-36px',
        borderTopLeftRadius: '36px',
        borderTopRightRadius: '36px',
        boxShadow: '0 -10px 40px rgba(10,37,64,0.06)',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
          <div className="eyebrow-rule" style={{ margin: '0 auto 1rem' }} />
          <span className="eyebrow">{eyebrow}</span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              color: 'var(--navy-900)',
              marginBottom: '1rem',
            }}
          >
            {title}
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.6 }}>
            {subtitle}
          </p>
        </div>

        {/* 4-Column Bento Grid */}
        <div
          className="category-bento-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
          }}
        >
          {categories.map((cat) => {
            const isFeatured = cat.featured;
            const span = cat.spanCols || (isFeatured ? 2 : 1);
            const gridColumn = span === 2 ? 'span 2' : 'span 1';
            const gridRow = isFeatured ? 'span 2' : 'span 1';

            return (
              <div
                key={cat.id}
                className={`category-bento-card ${isFeatured ? 'category-bento-card--featured' : ''}`}
                style={{
                  gridColumn,
                  gridRow,
                  borderRadius: '28px',
                  background: isFeatured
                    ? 'linear-gradient(135deg, #F0F4F8 0%, #FFFFFF 100%)'
                    : 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)',
                  border: isFeatured
                    ? '1.5px solid rgba(18, 61, 103, 0.22)'
                    : '1px solid rgba(215, 217, 220, 0.6)',
                  boxShadow: 'var(--shadow-soft)',
                  padding: isFeatured ? '2.5rem' : '1.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease',
                  cursor: 'pointer',
                }}
                onClick={(e) => handleTileClick(cat.serviceDetail, e)}
              >
                {/* Top header within card */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {/* Icon circle */}
                    <div
                      className="category-icon-circle"
                      style={{
                        width: isFeatured ? '58px' : '48px',
                        height: isFeatured ? '58px' : '48px',
                        borderRadius: '50%',
                        backgroundColor: isFeatured ? 'var(--navy-900)' : 'var(--silver-100)',
                        color: isFeatured ? 'var(--white)' : 'var(--navy-700)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isFeatured ? '0 6px 18px rgba(10,37,64,0.18)' : 'none',
                        border: isFeatured ? '2px solid rgba(255,255,255,0.2)' : '1px solid var(--silver-300)',
                      }}
                    >
                      {cat.icon}
                    </div>

                    {/* Stat / Feature Badge */}
                    {cat.badge && (
                      <span
                        className="category-stat-badge"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          backgroundColor: 'rgba(217, 35, 45, 0.1)',
                          color: 'var(--red-600)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid rgba(217, 35, 45, 0.25)',
                          letterSpacing: '0.02em',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--red-500)',
                          }}
                        />
                        {cat.badge}
                      </span>
                    )}
                  </div>

                  <h3
                    style={{
                      fontSize: isFeatured ? '1.5rem' : '1.18rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      color: 'var(--navy-900)',
                      marginBottom: '0.65rem',
                      lineHeight: 1.25,
                    }}
                  >
                    {cat.title}
                  </h3>

                  <p
                    style={{
                      fontSize: isFeatured ? '0.98rem' : '0.9rem',
                      color: 'var(--muted)',
                      lineHeight: 1.62,
                      margin: 0,
                    }}
                  >
                    {cat.description}
                  </p>

                  {/* Featured Card Illustration */}
                  {isFeatured && cat.illustration && (
                    <div
                      className="category-illustration-slot"
                      style={{
                        marginTop: '2rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: 0.85,
                      }}
                    >
                      {cat.illustration}
                    </div>
                  )}
                </div>

                {/* Bottom Link: "Ask us ->" */}
                <div
                  style={{
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(215, 217, 220, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--red-600)',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <span>Ask us</span>
                    <span style={{ transition: 'transform 0.2s ease' }}>&rarr;</span>
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--silver-500)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Enquire now
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
