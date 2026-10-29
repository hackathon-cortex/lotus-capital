import React from 'react';
import { RenderableStat } from '../../hooks/useStatistics';
import { useCountUp } from '../../hooks/useCountUp';
import siteData from '@content/data/site.json';

interface StatBlockProps {
  stats: RenderableStat[];
  columns?: 2 | 3 | 4;
  className?: string;
  theme?: 'light' | 'dark';
  showCaption?: boolean;
  caption?: string;
}

const AnimatedStatValue: React.FC<{ value: string; isDark?: boolean }> = ({ value, isDark }) => {
  // If in test environment, return value directly for deterministic assertion
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
    return <div className={`stat-card__value ${isDark ? 'text-white' : ''}`}>{value}</div>;
  }

  // Extract leading non-digits, the number, and trailing non-digits (e.g., "₹", "50", " crore+" or "", "2500", "+")
  const match = value.match(/^([^\d]*)(\d+)(.*)$/);
  if (!match) {
    return <div className={`stat-card__value ${isDark ? 'text-white' : ''}`}>{value}</div>;
  }

  const prefix = match[1];
  const num = parseInt(match[2], 10);
  const suffix = match[3];

  const animatedVal = useCountUp(num, 1600);

  return (
    <div
      className={`stat-card__value ${isDark ? 'text-white' : ''}`}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {prefix}
      {animatedVal.toLocaleString('en-IN')}
      {suffix}
    </div>
  );
};

export const StatBlock: React.FC<StatBlockProps> = ({
  stats,
  columns = 4,
  className = '',
  theme = 'light',
  showCaption = true,
  caption,
}) => {
  // Collapses cleanly when no statistics are eligible to display
  if (!stats || stats.length === 0) {
    return null;
  }

  const gridClass =
    columns === 2
      ? 'grid-cols-2'
      : columns === 3
        ? 'grid-cols-3'
        : 'grid-cols-4';

  const isDark = theme === 'dark';

  return (
    <div className={`stat-block-container ${className}`} data-testid="stat-block-container">
      <div className={`grid ${gridClass}`}>
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`stat-card ${isDark ? 'stat-card--dark' : ''}`}
            data-testid={`stat-card-${stat.id}`}
          >
            <AnimatedStatValue value={stat.value} isDark={isDark} />
            <div className={`stat-card__label ${isDark ? 'text-silver' : ''}`}>{stat.label}</div>

            {stat.isUnverified && (
              <div>
                <span className="stat-badge-unverified" data-testid="badge-unverified">
                  UNVERIFIED — pending client approval
                </span>
              </div>
            )}

            {stat.asOfText && (
              <div className={`stat-card__meta ${isDark ? 'text-silver-muted' : ''}`} data-testid="stat-as-of">
                {stat.asOfText}
              </div>
            )}

            {stat.definitionNote && (
              <div
                className={`stat-card__meta ${isDark ? 'text-silver-muted' : ''}`}
                style={{ fontStyle: 'italic', marginTop: '0.25rem' }}
                title={stat.definitionNote}
              >
                Note: {stat.definitionNote}
              </div>
            )}
          </div>
        ))}
      </div>

      {showCaption && (
        <p
          className={`stat-group-caption ${isDark ? 'text-silver-muted' : ''}`}
          style={{
            textAlign: 'center',
            fontSize: '0.85rem',
            color: isDark ? 'var(--silver-400)' : 'var(--muted)',
            marginTop: '1.25rem',
            marginBottom: 0,
          }}
          data-testid="stat-group-caption"
        >
          {caption || `Figures as of ${siteData.statsAsOf || 'October 2026'}`}
        </p>
      )}
    </div>
  );
};
