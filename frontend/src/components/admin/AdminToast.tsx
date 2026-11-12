import React from 'react';
import { AdminIcon } from './AdminIcons';

export interface AdminToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
}

export const AdminToast: React.FC<AdminToastProps> = ({ type, message, onClose }) => {
  const isError = type === 'error';
  const isSuccess = type === 'success';

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '16px',
        backgroundColor: isError
          ? 'rgba(233, 35, 50, 0.12)'
          : isSuccess
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(27, 79, 130, 0.15)',
        border: `1px solid ${isError ? '#E92332' : isSuccess ? '#D7D9DC' : '#1B4F82'}`,
        color: '#FFFFFF',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AdminIcon
          name={isError ? 'close' : isSuccess ? 'check' : 'help'}
          size={16}
          color={isError ? '#E92332' : '#FFFFFF'}
        />
        <span>{message}</span>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#8A949D',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <AdminIcon name="close" size={14} />
        </button>
      )}
    </div>
  );
};

