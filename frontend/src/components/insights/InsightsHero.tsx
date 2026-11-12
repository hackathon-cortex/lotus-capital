import React from 'react';
import { Link } from 'react-router-dom';
import { LotusLogo } from '../common/LotusLogo';

export interface InsightsHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  categories: string[];
  categoryCounts: Record<string, number>;
  totalCount: number;
  filteredCount: number;
}

export const InsightsHero: React.FC<InsightsHeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  categories,
  categoryCounts,
  totalCount,
  filteredCount,
}) => {
  return (
    <section
      id="hero"
      className="insights-hero-section"
      style={{
        position: 'relative',
        minHeight: '480px',
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

      {/* Lotus Watermark */}
      <div
        style={{
          position: 'absolute',
          right: '-40px',
          bottom: '-50px',
          width: '460px',
          height: '460px',
          opacity: 0.05,
          zIndex: 1,
          pointerEvents: 'none',
          animation: 'lotusDrift 40s linear infinite alternate',
        }}
      >
        <LotusLogo variant="watermark" width="100%" height="100%" />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
        {/* Breadcrumb INSIDE the hero under the header */}
        <nav
          aria-label="Breadcrumb inside hero"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.82rem',
            color: 'var(--silver-300)',
            marginBottom: '1.25rem',
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
          <span style={{ color: '#ffffff', fontWeight: 500 }}>Insights</span>
        </nav>

        <div style={{ maxWidth: '820px', marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              backgroundColor: 'rgba(91, 141, 184, 0.15)',
              border: '1px solid rgba(91, 141, 184, 0.35)',
              padding: '0.35rem 0.9rem',
              borderRadius: '24px',
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#8fa3c8',
              marginBottom: '1rem',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--red-500, #D9232D)',
              }}
            />
            FINANCIAL ARCHITECTURE • GODHRA, GUJARAT
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
              fontSize: 'clamp(2.2rem, 4.2vw, 3.4rem)',
              lineHeight: 1.15,
              fontWeight: 600,
              color: '#ffffff',
              marginBottom: '1rem',
              letterSpacing: '-0.015em',
            }}
          >
            Learn before you decide.
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.3vw, 1.18rem)',
              lineHeight: 1.65,
              color: 'var(--silver-300, #d7d9dc)',
              maxWidth: '720px',
              margin: 0,
            }}
          >
            Plain-language guides on insurance, mutual funds, equity and financial planning.
            Written for education only — transparent, unbiased principles to help you make informed decisions.
          </p>
        </div>

        {/* Search & Category Filter Control Hub */}
        <div
          style={{
            backgroundColor: 'rgba(10, 37, 64, 0.65)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(215, 217, 220, 0.12)',
            borderRadius: '24px',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Search bar */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8FA3C8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }}
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search guides by title, category, or topic (e.g., NAV, SIP, Exclusions, Health)..."
              aria-label="Search guides"
              style={{
                width: '100%',
                padding: '0.85rem 2.8rem 0.85rem 3rem',
                borderRadius: '28px',
                border: '1px solid rgba(215, 217, 220, 0.22)',
                backgroundColor: 'rgba(6, 24, 44, 0.75)',
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#5B8DB8';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(91, 141, 184, 0.25)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(215, 217, 220, 0.22)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: '14px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--silver-400, #a0aec0)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Chips with Counts */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = cat === 'All' ? totalCount : categoryCounts[cat] || 0;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onCategorySelect(cat)}
                  style={{
                    backgroundColor: isSelected ? '#5B8DB8' : 'rgba(255, 255, 255, 0.08)',
                    color: isSelected ? '#ffffff' : 'var(--silver-300, #d7d9dc)',
                    border: isSelected ? '1px solid #5B8DB8' : '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '20px',
                    padding: '0.4rem 0.9rem',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.color = 'var(--silver-300, #d7d9dc)';
                    }
                  }}
                >
                  <span>{cat}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      opacity: 0.8,
                      backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            {searchQuery && (
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--silver-400)',
                  marginLeft: 'auto',
                }}
              >
                Showing {filteredCount} of {totalCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

