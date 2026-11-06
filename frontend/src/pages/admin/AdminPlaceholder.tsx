import React from 'react';
import { useParams } from 'react-router-dom';

interface AdminPlaceholderProps {
  title: string;
  description: string;
  todos: string[];
}

export const AdminPlaceholder: React.FC<AdminPlaceholderProps> = ({
  title,
  description,
  todos,
}) => {
  const params = useParams();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1
          style={{
            fontSize: '26px',
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

        {Object.keys(params).length > 0 && (
          <div style={{ fontSize: '12px', color: '#D7D9DC', marginTop: '6px' }}>
            Route Params: <code style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{JSON.stringify(params)}</code>
          </div>
        )}
      </div>

      <div
        className="admin-bento-tile"
        style={{
          padding: '24px',
          borderTop: '3px solid #1B4F82',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span className="admin-status-badge admin-status-badge--qualified">
            SCHEDULED SPRINT MODULE
          </span>
          <span style={{ fontSize: '12px', color: '#8A949D' }}>
            Structure.md Section 6 Spec
          </span>
        </div>

        <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6, margin: '0 0 16px' }}>
          This administrative view is routed, authenticated, and role-guarded. Real-time API integration with the FastAPI backend endpoint is scheduled in the operational roadmap.
        </p>

        <h4
          style={{
            margin: '16px 0 8px',
            fontSize: '13px',
            fontFamily: 'Poppins, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#D7D9DC',
          }}
        >
          Implementation Requirements:
        </h4>

        <ul style={{ paddingLeft: '20px', lineHeight: '1.9', fontSize: '13.5px', color: '#D7D9DC', margin: 0 }}>
          {todos.map((todo, idx) => (
            <li key={idx}>{todo}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
