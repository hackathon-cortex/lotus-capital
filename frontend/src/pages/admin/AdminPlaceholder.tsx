import React from 'react';

export interface AdminPlaceholderProps {
  title?: string;
  description?: string;
  todos?: string[];
}

export const AdminPlaceholder: React.FC<AdminPlaceholderProps> = ({
  title = 'Administrative Module',
  description = 'Lotus Capital secure management console.',
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1
          style={{
            fontSize: '24px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            color: '#FFFFFF',
            margin: '0 0 4px',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>
        <p style={{ color: '#8A949D', margin: 0, fontSize: '13.5px' }}>
          {description}
        </p>
      </div>

      <div
        className="admin-bento-tile"
        style={{
          padding: '24px',
          borderTop: '3px solid #1B4F82',
        }}
      >
        <p style={{ fontSize: '14px', color: '#D7D9DC', lineHeight: 1.6, margin: 0 }}>
          Module loaded. Authenticated with FastAPI backend.
        </p>
      </div>
    </div>
  );
};
