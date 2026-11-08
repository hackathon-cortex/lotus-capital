import React, { useState, useEffect } from 'react';

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export interface ArticleTableOfContentsProps {
  headings: TocHeading[];
}

export const ArticleTableOfContents: React.FC<ArticleTableOfContentsProps> = ({ headings }) => {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id || '');
  const [mobileExpanded, setMobileExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -65% 0px',
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveId(id);
      setMobileExpanded(false);
    }
  };

  if (headings.length === 0) return null;

  return (
    <aside
      className="article-toc-aside"
      style={{
        position: 'sticky',
        top: 'calc(var(--header-h, 76px) + 24px)',
        alignSelf: 'flex-start',
        width: '100%',
        maxWidth: '280px',
      }}
    >
      {/* Mobile Toggle Bar */}
      <div
        className="article-toc-mobile-toggle"
        style={{
          display: 'none',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '0.75rem 1rem',
          border: '1px solid rgba(215, 217, 220, 0.7)',
          marginBottom: '1.25rem',
          boxShadow: '0 4px 12px rgba(18, 61, 103, 0.05)',
        }}
      >
        <button
          type="button"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'none',
            border: 'none',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: 'var(--navy-900, #0A2540)',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            Table of Contents
          </span>
          <span style={{ fontSize: '0.8rem', color: '#5B8DB8' }}>{mobileExpanded ? '▲ Hide' : '▼ View'}</span>
        </button>
      </div>

      {/* Desktop / Expanded Box */}
      <div
        className={`article-toc-body ${mobileExpanded ? 'article-toc-body--expanded' : ''}`}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '1.5rem',
          border: '1px solid rgba(215, 217, 220, 0.7)',
          boxShadow: '0 8px 24px rgba(18, 61, 103, 0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.74rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--navy-700, #123D67)',
            marginBottom: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #EEF1F4',
          }}
        >
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: 'var(--red-500, #D9232D)',
            }}
          />
          ON THIS PAGE
        </div>

        <nav aria-label="Table of Contents">
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}
          >
            {headings.map((heading) => {
              const isActive = activeId === heading.id;
              const isSubheading = heading.level === 3;

              return (
                <li key={heading.id} style={{ marginLeft: isSubheading ? '1rem' : 0 }}>
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => scrollToHeading(heading.id, e)}
                    style={{
                      display: 'block',
                      fontSize: isSubheading ? '0.8rem' : '0.85rem',
                      lineHeight: 1.4,
                      color: isActive ? 'var(--navy-900, #0A2540)' : 'var(--silver-700, #64748b)',
                      fontWeight: isActive ? 600 : 400,
                      textDecoration: 'none',
                      padding: '0.35rem 0.6rem',
                      borderRadius: '8px',
                      backgroundColor: isActive ? 'rgba(91, 141, 184, 0.12)' : 'transparent',
                      borderLeft: isActive ? '3px solid var(--red-500, #D9232D)' : '3px solid transparent',
                      transition: 'all 0.18s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = 'var(--navy-900, #0A2540)';
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = 'var(--silver-700, #64748b)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {heading.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

