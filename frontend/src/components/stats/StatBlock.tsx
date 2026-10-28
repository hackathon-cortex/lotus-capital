import React from 'react';
import { RenderableStat } from '../../hooks/useStatistics';

interface StatBlockProps {
  stats: RenderableStat[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const StatBlock: React.FC<StatBlockProps> = ({
  stats,
  columns = 4,
  className = '',
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

  return (
    <div className={`stat-block-container ${className}`} data-testid="stat-block-container">
      <div className={`grid ${gridClass}`}>
        {stats.map((stat) => (
          <div key={stat.id} className="stat-card" data-testid={`stat-card-${stat.id}`}>
            <div className="stat-card__value">{stat.value}</div>
            <div className="stat-card__label">{stat.label}</div>

            {stat.isUnverified && (
              <div>
                <span className="stat-badge-unverified" data-testid="badge-unverified">
                  UNVERIFIED — pending client approval
                </span>
              </div>
            )}

            <div className="stat-card__meta" data-testid="stat-as-of">
              {stat.asOfText}
            </div>

            {stat.definitionNote && (
              <div
                className="stat-card__meta"
                style={{ fontStyle: 'italic', marginTop: '0.25rem' }}
                title={stat.definitionNote}
              >
                Note: {stat.definitionNote}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

