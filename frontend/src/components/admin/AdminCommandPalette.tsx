import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminIcon } from './AdminIcons';

export interface CommandItem {
  id: string;
  title: string;
  category: string;
  path: string;
  icon: string;
}

const COMMANDS: CommandItem[] = [
  { id: 'add-enquiry', title: 'Add enquiry (Manual Entry)', category: 'Actions', path: '/admin/leads?action=add', icon: 'plus' },
  { id: 'dashboard', title: 'Dashboard & Metrics', category: 'Overview', path: '/admin/dashboard', icon: 'dashboard' },
  { id: 'leads', title: 'Enquiries & Leads', category: 'Leads', path: '/admin/leads', icon: 'leads' },
  { id: 'followups', title: 'Scheduled Follow-ups', category: 'Leads', path: '/admin/followups', icon: 'followups' },
  { id: 'reports', title: 'Performance & Reports', category: 'Leads', path: '/admin/reports', icon: 'reports' },
  { id: 'pages', title: 'Page Content (CMS)', category: 'Content', path: '/admin/content/pages', icon: 'pages' },
  { id: 'faqs', title: 'FAQs & Answers', category: 'Content', path: '/admin/content/faqs', icon: 'faqs' },
  { id: 'team', title: 'Team Profiles', category: 'Content', path: '/admin/content/team', icon: 'team' },
  { id: 'partners', title: 'Partners & Empanelled Insurers', category: 'Content', path: '/admin/content/partners', icon: 'partners' },
  { id: 'testimonials', title: 'Client Testimonials', category: 'Content', path: '/admin/content/testimonials', icon: 'testimonials' },
  { id: 'insights', title: 'Educational Insights', category: 'Content', path: '/admin/content/insights', icon: 'insights' },
  { id: 'media', title: 'Media Library Assets', category: 'Content', path: '/admin/media', icon: 'media' },
  { id: 'statistics', title: 'Statistics & Gating Tiers', category: 'Compliance', path: '/admin/statistics', icon: 'chart' },
  { id: 'users', title: 'Users & Permissions', category: 'Administration', path: '/admin/users', icon: 'roles' },
  { id: 'audit', title: 'System Audit Trail', category: 'Administration', path: '/admin/audit-logs', icon: 'audit' },
  { id: 'account', title: 'My Account & Security', category: 'Administration', path: '/admin/account', icon: 'account' },
];

export interface AdminCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminCommandPalette: React.FC<AdminCommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = COMMANDS.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      cmd.path.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          navigate(filteredCommands[selectedIndex].path);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 19, 41, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#071B30',
          border: '1px solid #1B4F82',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Search header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <AdminIcon name="search" size={18} color="#8A949D" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a screen name or jump destination..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FFFFFF',
              fontSize: '15px',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          <kbd
            style={{
              fontSize: '11px',
              padding: '3px 6px',
              borderRadius: '4px',
              backgroundColor: '#051329',
              border: '1px solid #1B4F82',
              color: '#8A949D',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          style={{
            maxHeight: '340px',
            overflowY: 'auto',
            padding: '8px',
          }}
        >
          {filteredCommands.length === 0 ? (
            <div
              style={{
                padding: '28px',
                textAlign: 'center',
                color: '#8A949D',
                fontSize: '13px',
              }}
            >
              No matching administrative screens found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    navigate(cmd.path);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    borderLeft: isSelected ? '3px solid #E92332' : '3px solid transparent',
                    transition: 'background-color 120ms ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: '#051329',
                        border: '1px solid #1B4F82',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSelected ? '#FFFFFF' : '#8A949D',
                      }}
                    >
                      <AdminIcon name={cmd.icon} size={15} />
                    </div>
                    <div>
                      <div style={{ color: '#FFFFFF', fontSize: '13.5px', fontWeight: 500 }}>
                        {cmd.title}
                      </div>
                      <div style={{ color: '#8A949D', fontSize: '11px' }}>
                        {cmd.category}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      color: '#8A949D',
                      fontFamily: 'monospace',
                    }}
                  >
                    {cmd.path}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            backgroundColor: '#051329',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '11px',
            color: '#8A949D',
          }}
        >
          <span>Use arrows to navigate, Enter to open</span>
          <span>Lotus Admin Navigation</span>
        </div>
      </div>
    </div>
  );
};

