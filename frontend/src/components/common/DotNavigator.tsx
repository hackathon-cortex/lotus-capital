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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  // Track active section on scroll
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

  // Hide dot navigator whenever footer enters viewport (fade out 200ms)
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          setIsFooterVisible(entry.isIntersecting);
        },
        { threshold: 0.02 }
      );
      observer.observe(footer);
      return () => observer.disconnect();
    } else {
      const checkFooter = () => {
        const rect = footer.getBoundingClientRect();
        setIsFooterVisible(rect.top < window.innerHeight);
      };
      window.addEventListener('scroll', checkFooter, { passive: true });
      checkFooter();
      return () => window.removeEventListener('scroll', checkFooter);
    }
  }, []);

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
      data-testid="dot-navigator"
      style={{
        position: 'fixed',
        right: '24px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 990,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        opacity: isFooterVisible ? 0 : 1,
        pointerEvents: isFooterVisible ? 'none' : 'auto',
        transition: 'opacity 200ms ease',
      }}
    >
      {sections.map((sec) => {
        const isActive = activeId === sec.id;
        const showTooltip = hoveredId === sec.id || focusedId === sec.id;

        return (
          <button
            key={sec.id}
            className={`dot-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => scrollTo(sec.id)}
            onMouseEnter={() => setHoveredId(sec.id)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setFocusedId(sec.id)}
            onBlur={() => setFocusedId(null)}
            aria-label={`Scroll to ${sec.label}`}
            data-testid={`dot-nav-${sec.id}`}
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
            {/* Tooltip with section name on hover / focus */}
            <span
              className="dot-nav-label"
              data-testid={`dot-nav-label-${sec.id}`}
              style={{
                position: 'absolute',
                right: '24px',
                backgroundColor: 'var(--navy-900, #123D67)',
                color: 'var(--white, #FFFFFF)',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                opacity: showTooltip ? 1 : 0,
                transform: showTooltip ? 'translateX(0)' : 'translateX(6px)',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(10, 37, 64, 0.25)',
              }}
            >
              {sec.label}
            </span>

            {/* Circular dot */}
            <span
              className="dot-nav-circle"
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: isActive ? 'var(--red-500, #D9232D)' : 'rgba(18, 61, 103, 0.4)',
                border: isActive ? '2px solid var(--white, #FFFFFF)' : '2px solid rgba(255, 255, 255, 0.8)',
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
