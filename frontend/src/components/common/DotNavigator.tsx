import React, { useState, useEffect } from 'react';

export interface NavSection {
  id: string;
  label: string;
}

const DEFAULT_SECTIONS: NavSection[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'overview-strip', label: 'Overview' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'mutual-funds', label: 'Mutual Funds' },
  { id: 'equity', label: 'Equity' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'trust', label: 'Trust' },
  { id: 'partners', label: 'Partners' },
  { id: 'process', label: 'Process' },
  { id: 'learn', label: 'Learn' },
  { id: 'faq', label: 'FAQ' },
  { id: 'enquiry', label: 'Enquiry' },
];

interface DotNavigatorProps {
  sections?: NavSection[];
}

export const DotNavigator: React.FC<DotNavigatorProps> = ({ sections = DEFAULT_SECTIONS }) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || 'hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = document.getElementById(sections[i].id);
        if (sec) {
          const top = sec.offsetTop;
          if (scrollPos >= top) {
            setActiveId(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="dot-navigator"
      aria-label="Section navigation"
      style={{
        position: 'fixed',
        right: '24px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 990,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {sections.map((sec) => {
        const isActive = activeId === sec.id;
        return (
          <button
            key={sec.id}
            className={`dot-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => scrollTo(sec.id)}
            aria-label={`Scroll to ${sec.label}`}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <span
              className="dot-nav-label"
              style={{
                position: 'absolute',
                right: '24px',
                backgroundColor: 'var(--navy-900)',
                color: 'var(--white)',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                opacity: 0,
                transform: 'translateX(6px)',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(10, 37, 64, 0.25)',
              }}
            >
              {sec.label}
            </span>
            <span
              className="dot-nav-circle"
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: isActive ? 'var(--red-500)' : 'rgba(18, 61, 103, 0.4)',
                border: isActive ? '2px solid var(--white)' : '2px solid rgba(255, 255, 255, 0.8)',
                boxShadow: isActive
                  ? '0 0 0 4px rgba(233, 35, 50, 0.25)'
                  : '0 2px 6px rgba(0, 0, 0, 0.15)',
                transform: isActive ? 'scale(1.3)' : 'scale(1)',
                transition: 'all 0.24s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          </button>
        );
      })}
    </nav>
  );
};
