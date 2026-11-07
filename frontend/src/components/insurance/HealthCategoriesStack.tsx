import React, { useState, useEffect, useRef } from 'react';

export interface HealthCategoryCard {
  id: string;
  serviceDetail: string;
  name: string;
  tag: string;
  subtitle: string;
  description: string;
  checklistNote: string;
  icon: React.ReactNode;
}

export const HEALTH_CATEGORIES: HealthCategoryCard[] = [
  {
    id: 'individual',
    serviceDetail: 'individual',
    name: 'Individual Health Plans',
    tag: 'Independent Cover',
    subtitle: 'Dedicated sum insured exclusively for a single policyholder.',
    description:
      'Ideal for working individuals or family members with independent coverage needs. The entire sum insured is reserved solely for the designated individual, ensuring limits remain unaffected by others.',
    checklistNote: 'Inspect dedicated sum insured, personal waiting periods, and room-rent sub-limits.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--navy-900, #123D67)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: 'family',
    serviceDetail: 'family',
    name: 'Family Floater Plans',
    tag: 'Umbrella Protection',
    subtitle: 'Single combined sum insured covering spouse, children, and dependants.',
    description:
      'Cost-effective healthcare protection where any enrolled family member can draw from the shared sum insured during a medical event. Most plans feature automatic restoration if limits are exhausted in a policy year.',
    checklistNote: 'Inspect restoration triggers, oldest member entry age, and maternity waiting periods.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--navy-900, #123D67)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'senior',
    serviceDetail: 'senior',
    name: 'Senior Citizen Health Coverage',
    tag: 'Specialised Care',
    subtitle: 'Tailored healthcare protection adapted for elderly parents.',
    description:
      'Designed to address the distinct healthcare needs of elderly family members, accommodating higher entry ages, chronic lifestyle conditions, and regular diagnostic investigations.',
    checklistNote: 'Inspect mandatory co-payment percentage, pre-existing disease waiting, and empanelled hospitals.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--navy-900, #123D67)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'critical',
    serviceDetail: 'critical',
    name: 'Critical Illness & Top-up Covers',
    tag: 'Supplemental Security',
    subtitle: 'Lump-sum payouts on major illness diagnosis or high-deductible super top-ups.',
    description:
      'Critical illness provides an immediate lump-sum benefit upon confirmed diagnosis of specified life-threatening illnesses to support treatment and recuperation. Super top-ups boost base cover above a deductible threshold.',
    checklistNote: 'Inspect specific covered illnesses list, survival period criteria, and deductible threshold.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--navy-900, #123D67)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    id: 'group',
    serviceDetail: 'group',
    name: 'Group Health Schemes',
    tag: 'Corporate / Institutional',
    subtitle: 'Institutional healthcare policies for employees and affiliated members.',
    description:
      'Customised health insurance programs arranged for commercial enterprises, trusts, and member groups. Offers day-one coverage advantages for pre-existing ailments and family dependents based on group size.',
    checklistNote: 'Inspect group buffer provisions, employee co-payment rules, and individual porting rights.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--navy-900, #123D67)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
];

export interface HealthCategoriesStackProps {
  id?: string;
  onSelectType?: (serviceDetail: string) => void;
}

export const HealthCategoriesStack: React.FC<HealthCategoriesStackProps> = ({
  id = 'types',
  onSelectType,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const c = new URLSearchParams(window.location.search).get('catIndex');
      if (c !== null) return parseInt(c, 10);
    }
    return 0;
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const topOffset = rect.top;
      const totalHeight = rect.height - window.innerHeight;
      if (totalHeight <= 0) return;

      const progress = Math.min(Math.max(-topOffset / totalHeight, 0), 1);
      const index = Math.min(
        Math.floor(progress * HEALTH_CATEGORIES.length),
        HEALTH_CATEGORIES.length - 1
      );
      setActiveCardIndex(index);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelect = (serviceDetail: string) => {
    if (onSelectType) {
      onSelectType(serviceDetail);
    } else {
      const el = document.getElementById('enquiry');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id={id}
      className="health-categories-section gi-stacked-section"
      style={{
        position: 'relative',
        zIndex: 12,
        marginTop: '-36px',
        borderTopLeftRadius: '36px',
        borderTopRightRadius: '36px',
        backgroundColor: 'var(--silver-100, #f8f9fa)',
        boxShadow: '0 -10px 40px rgba(10,37,64,0.06)',
        padding: '5rem 0',
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem' }}>
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
            TAILORED PROTECTION STRUCTURES
          </span>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.1rem, 3.4vw, 3rem)',
              fontWeight: 700,
              color: 'var(--navy-950, #051329)',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}
          >
            Health Insurance <span style={{ fontStyle: 'italic', color: 'var(--navy-900, #123D67)' }}>Policy Types.</span>
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--ink, #1f2933)',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Select the health cover structure aligned with your household composition and long-term medical safeguards.
          </p>

          {/* Category Tabs / Switcher Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1.75rem',
            }}
          >
            {HEALTH_CATEGORIES.map((cat, idx) => {
              const isActive = idx === activeCardIndex;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCardIndex(idx)}
                  style={{
                    outline: 'none',
                    cursor: 'pointer',
                    padding: '0.45rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? 'var(--navy-900, #0a2540)' : 'var(--white, #ffffff)',
                    color: isActive ? '#ffffff' : 'var(--navy-900, #0a2540)',
                    border: isActive ? '1px solid var(--navy-900, #0a2540)' : '1px solid var(--silver-300, #d7d9dc)',
                    boxShadow: isActive ? '0 4px 12px rgba(10, 37, 64, 0.2)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat.name.replace(' Health Plans', '').replace(' Health Coverage', '').replace(' Schemes', '')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Grid */}
        <div
          ref={containerRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '1.5rem',
          }}
          className="health-categories-grid"
        >
          {HEALTH_CATEGORIES.map((category, index) => {
            const isFeatured = index === activeCardIndex;
            return (
              <div
                key={category.id}
                className="health-category-card"
                style={{
                  backgroundColor: 'var(--white, #ffffff)',
                  borderRadius: '24px',
                  border: isFeatured
                    ? '2px solid var(--navy-900, #123D67)'
                    : '1px solid var(--silver-300, #e2e8f0)',
                  padding: '2rem 1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isFeatured
                    ? '0 16px 36px rgba(10, 37, 64, 0.08), 0 4px 12px rgba(10, 37, 64, 0.04)'
                    : '0 4px 16px rgba(10, 37, 64, 0.04)',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '16px',
                        backgroundColor: 'var(--navy-100, #eaf1f8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {category.icon}
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '9999px',
                        backgroundColor: isFeatured ? 'var(--navy-100, #eaf1f8)' : 'var(--silver-100, #f1f5f9)',
                        color: isFeatured ? 'var(--navy-900, #123D67)' : 'var(--muted, #5b6770)',
                        border: '1px solid',
                        borderColor: isFeatured ? 'rgba(18, 61, 103, 0.25)' : 'var(--silver-300, #e2e8f0)',
                      }}
                    >
                      {category.tag}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '1.28rem',
                      fontWeight: 700,
                      color: 'var(--navy-950, #051329)',
                      marginBottom: '0.4rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {category.name}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: 'var(--navy-800, #123D67)',
                      marginBottom: '0.85rem',
                      lineHeight: 1.45,
                    }}
                  >
                    {category.subtitle}
                  </p>

                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--ink, #1f2933)',
                      lineHeight: 1.6,
                      marginBottom: '1.25rem',
                    }}
                  >
                    {category.description}
                  </p>

                  <div
                    style={{
                      backgroundColor: 'var(--silver-100, #f8f9fa)',
                      borderRadius: '12px',
                      padding: '0.75rem 0.9rem',
                      borderLeft: '3px solid var(--navy-900, #123D67)',
                      fontSize: '0.82rem',
                      color: 'var(--ink, #1f2933)',
                      lineHeight: 1.45,
                      marginBottom: '1.5rem',
                    }}
                  >
                    <strong style={{ color: 'var(--navy-900, #0a2540)' }}>What to evaluate: </strong>
                    {category.checklistNote}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelect(category.serviceDetail)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '14px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    backgroundColor: isFeatured ? 'var(--navy-900, #0a2540)' : 'var(--silver-100, #f8f9fa)',
                    color: isFeatured ? '#ffffff' : 'var(--navy-900, #0a2540)',
                    border: isFeatured ? '1px solid var(--navy-900, #0a2540)' : '1px solid var(--silver-300, #cbd5e1)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--red-500, #d9232d)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = 'var(--red-500, #d9232d)';
                  }}
                  onMouseLeave={(e) => {
                    if (isFeatured) {
                      e.currentTarget.style.backgroundColor = 'var(--navy-900, #0a2540)';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = 'var(--navy-900, #0a2540)';
                    } else {
                      e.currentTarget.style.backgroundColor = 'var(--silver-100, #f8f9fa)';
                      e.currentTarget.style.color = 'var(--navy-900, #0a2540)';
                      e.currentTarget.style.borderColor = 'var(--silver-300, #cbd5e1)';
                    }
                  }}
                >
                  <span>Select for Consultation</span>
                  <span>&rarr;</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
