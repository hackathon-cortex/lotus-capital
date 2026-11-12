import React from 'react';
import { AdminIcon } from './AdminIcons';

export interface AdminPageHeaderProps {
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: string;
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: string;
    disabled?: boolean;
  };
  children?: React.ReactNode;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap',
      }}
    >
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
        {description && (
          <p
            style={{
              color: '#8A949D',
              margin: 0,
              fontSize: '13.5px',
              maxWidth: '680px',
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {children}
        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            disabled={secondaryAction.disabled}
            className="admin-btn-secondary"
            style={{ opacity: secondaryAction.disabled ? 0.5 : 1 }}
          >
            {secondaryAction.icon && <AdminIcon name={secondaryAction.icon} size={14} />}
            <span>{secondaryAction.label}</span>
          </button>
        )}
        {primaryAction && (
          <button
            type="button"
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled}
            className="admin-btn-primary"
            style={{ opacity: primaryAction.disabled ? 0.5 : 1 }}
          >
            {primaryAction.icon && <AdminIcon name={primaryAction.icon} size={14} />}
            <span>{primaryAction.label}</span>
          </button>
        )}
      </div>
    </div>
  );
};

