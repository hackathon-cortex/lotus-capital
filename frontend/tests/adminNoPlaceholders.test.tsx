import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/api/queryClient';
import { AppRoutes } from '../src/routes/AppRoutes';
import { MockAuthProvider } from '../src/context/MockAuthContext';

const ADMIN_ROUTES = [
  '/admin/dashboard',
  '/admin/leads',
  '/admin/leads/1',
  '/admin/followups',
  '/admin/reports',
  '/admin/content/pages',
  '/admin/content/pages/home',
  '/admin/content/faqs',
  '/admin/content/team',
  '/admin/content/partners',
  '/admin/content/achievements',
  '/admin/content/testimonials',
  '/admin/content/contact',
  '/admin/content/insights',
  '/admin/content/insights/new',
  '/admin/statistics',
  '/admin/media',
  '/admin/users',
  '/admin/audit-logs',
  '/admin/account',
];

const BANNED_PLACEHOLDER_PHRASES = [
  'SCHEDULED SPRINT',
  'Sprint Module',
  'operational roadmap',
  'IMPLEMENTATION REQUIREMENTS',
  'Coworker TODO',
  'Structure.md Section',
  'Plan screen',
  'placeholder screen',
];

const FORBIDDEN_EMOJIS = ['📊', '📥', '⏰', '📈', '📄', '❓', '👥', '🏆', '💬', '✍️', '🖼️', '🛡️', '📋', '⚙️', '🚪', '🔍'];

function renderAdminRoute(route: string) {
  return render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MockAuthProvider>
          <MemoryRouter initialEntries={[route]}>
            <AppRoutes />
          </MemoryRouter>
        </MockAuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

describe('Admin Screens Placeholder Elimination & Quality Assurance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  ADMIN_ROUTES.forEach((route) => {
    it(`guarantees route "${route}" renders real content with ZERO placeholder roadmap text`, () => {
      const { container } = renderAdminRoute(route);
      const textContent = container.textContent || '';
      const htmlContent = container.innerHTML;

      // 1. None of the banned placeholder phrases may appear
      BANNED_PLACEHOLDER_PHRASES.forEach((phrase) => {
        expect(
          textContent.toLowerCase().includes(phrase.toLowerCase()),
          `Route "${route}" contains leftover placeholder phrase "${phrase}"!`
        ).toBe(false);
      });

      // 2. ZERO emojis anywhere in rendered markup
      FORBIDDEN_EMOJIS.forEach((emoji) => {
        expect(
          htmlContent.includes(emoji),
          `Route "${route}" contains forbidden emoji "${emoji}"!`
        ).toBe(false);
      });
    });
  });
});

