import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoutes } from '../src/routes/AppRoutes';
import fs from 'fs';
import path from 'path';

const renderApp = (initialRoute = '/') => {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <AppRoutes />
      </MemoryRouter>
    </HelmetProvider>
  );
};

describe('ContactDrawer & Routing Refactoring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('opens drawer via ?contact=open deep link', () => {
    renderApp('/?contact=open');
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText(/Tell us what you would like to/i)).toBeInTheDocument();
  });

  it('preselects service when ?contact=open&service=mutual-funds is passed', () => {
    renderApp('/?contact=open&service=mutual-funds');
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    // Check for Mutual Funds specific chip inside dialog
    expect(within(dialog).getByText(/Start new SIP/i)).toBeInTheDocument();
  });

  it('opens drawer when clicking Header "Contact Us" button', async () => {
    renderApp('/');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const contactButtons = screen.getAllByRole('button', { name: /contact us/i });
    fireEvent.click(contactButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    expect(screen.getByText(/Tell us what you would like to/i)).toBeInTheDocument();
  });

  it('opens drawer when clicking "Talk to an Advisor" CTA', async () => {
    renderApp('/');
    const advisorButtons = screen.getAllByRole('button', { name: /talk to an advisor/i });
    fireEvent.click(advisorButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('closes drawer on Esc key press and unlocks body scroll', async () => {
    renderApp('/?contact=open');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(window, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(document.body.style.overflow).toBe('');
  });

  it('closes drawer on close button click', async () => {
    renderApp('/?contact=open');
    const closeBtn = screen.getByRole('button', { name: /close contact drawer/i });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('redirects legacy /contact-us to /?contact=open preserving query parameters', () => {
    renderApp('/contact-us?service=equity&utm_source=google');
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    // Demat account chip is specific to equity service inside dialog
    expect(within(dialog).getByText(/Demat account/i)).toBeInTheDocument();
  });

  it('renders required security warning and ensures contact info section is removed from drawer', () => {
    renderApp('/?contact=open');
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/Please do not share passwords, OTPs or account details/i)).toBeInTheDocument();
    // Contact details section is removed from drawer
    expect(within(dialog).queryByText('+91 93288 52555')).not.toBeInTheDocument();
    expect(within(dialog).queryByText('lotuscapitalinfo@gmail.com')).not.toBeInTheDocument();
    expect(within(dialog).queryByText(/Shri Chudasama Bhuvan/i)).not.toBeInTheDocument();
  });

  it('confirms NO active links to /contact-us exist in frontend/src', () => {
    const srcDir = path.resolve(__dirname, '../src');
    const scanDir = (dir: string): string[] => {
      let results: string[] = [];
      const list = fs.readdirSync(dir);
      list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
          results = results.concat(scanDir(fullPath));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          // Disallow to="/contact-us" or href="/contact-us" (except redirects in AppRoutes.tsx)
          if (!fullPath.includes('AppRoutes.tsx')) {
            if (content.includes('to="/contact-us"') || content.includes('href="/contact-us"')) {
              results.push(fullPath);
            }
          }
        }
      });
      return results;
    };

    const offendingFiles = scanDir(srcDir);
    expect(offendingFiles).toEqual([]);
  });
});
