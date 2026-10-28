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
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>{title}</h2>
        <p style={{ color: 'var(--muted)' }}>{description}</p>
        {Object.keys(params).length > 0 && (
          <div style={{ fontSize: '0.85rem', color: 'var(--navy-700)', marginTop: '0.25rem' }}>
            Route Params: <code>{JSON.stringify(params)}</code>
          </div>
        )}
      </div>

      <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--navy-700)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span className="badge badge-warning">PLACEHOLDER SCREEN</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>MOCK WORKSPACE</span>
        </div>

        <p style={{ fontSize: '0.95rem', color: 'var(--ink)' }}>
          This administrative view has been routed and role-protected per <code>Structure.md section 6</code>.
          The complete UI implementation is scheduled for the next development sprint.
        </p>

        <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Coworker TODO List:</h4>
        <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.8', fontSize: '0.9rem', color: 'var(--ink)' }}>
          {todos.map((todo, idx) => (
            <li key={idx}>{todo}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

