import React from 'react';

export interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  style,
}) => {
  return (
    <div
      className={`admin-glass-panel ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

