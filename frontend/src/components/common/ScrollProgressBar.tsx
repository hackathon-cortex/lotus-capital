import React, { useState, useEffect } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const percent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        setScrollWidth(percent);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="scroll-progress-bar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${scrollWidth}%`,
        height: '3px',
        backgroundColor: 'var(--red-500)',
        zIndex: 1005,
        transition: 'width 0.1s linear',
        pointerEvents: 'none',
      }}
      role="progressbar"
      aria-valuenow={Math.round(scrollWidth)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page reading progress"
    />
  );
};
