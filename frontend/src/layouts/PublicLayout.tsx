import React, { useState, useEffect } from 'react';
import { Outlet, useSearchParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/nav/Header';
import { Breadcrumbs } from '../components/nav/Breadcrumbs';
import { Footer } from '../components/nav/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ContactDrawerProvider } from '../context/ContactDrawerContext';
import { ContactDrawer } from '../components/common/ContactDrawer';
import { DevDataRegisterPill } from '../components/common/DevDataRegisterPill';
import { StickyMobileCtaBar } from '../components/common/StickyMobileCtaBar';
import contactData from '@content/data/contact.json';

export const PublicLayout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const previewToken = searchParams.get('preview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Activate scroll-reveal animations across all public routes
  useScrollReveal();

  // Scroll to hash anchor on route or hash change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView();
      } else {
        const timer = setTimeout(() => {
          const delayedEl = document.getElementById(id);
          if (delayedEl) delayedEl.scrollIntoView();
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, location.hash]);

  const isHeroPage =
    location.pathname === '/' ||
    location.pathname.startsWith('/services') ||
    location.pathname.startsWith('/investments') ||
    location.pathname === '/about-us';

  return (
    <ContactDrawerProvider>
      <div className="public-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        {previewToken && (
          <>
            <Helmet>
              <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div
              style={{
                backgroundColor: '#fffae6',
                borderBottom: '2px solid var(--warning)',
                padding: '0.6rem 1rem',
                textAlign: 'center',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#875a00',
                zIndex: 1100,
              }}
              data-testid="preview-banner"
            >
              ⚠️ Preview Mode Active (Token: {previewToken.slice(0, 10)}...). This is draft CMS content, not published to the public.
            </div>
          </>
        )}

        <Header onMenuToggle={setIsMobileMenuOpen} />
        <Breadcrumbs />

        <main style={{ flex: 1, paddingTop: isHeroPage ? 0 : 'var(--header-h)' }} id="main-content" tabIndex={-1}>
          <Outlet />
        </main>

        {/* Verified Floating WhatsApp Action Button - only shown when whatsappConfirmed is true */}
        {(contactData as Record<string, any>).whatsappConfirmed === true && (
          <a
            href={`https://wa.me/${contactData.whatsapp.number.replace(/\+/g, '')}?text=Hello%20Lotus%20Capital,%20I%20would%20like%20to%20enquire%20about%20your%20services.`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-floating"
            aria-label="Chat with Lotus Capital on WhatsApp"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.08l-.29-.17-3.12.82.83-3.04-.19-.3a8.217 8.217 0 0 1-1.26-4.46c0-4.54 3.7-8.24 8.24-8.24m4.52 11.5c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.71 4.31 3.8.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31" />
            </svg>
            <span>Chat on WhatsApp</span>
          </a>
        )}

        <Footer />

        {/* Sticky Mobile CTA Bar (< 768px, appears after hero scrolls out) */}
        <StickyMobileCtaBar isMenuOpen={isMobileMenuOpen} />

        {/* Global Contact Drawer mounted once */}
        <ContactDrawer />
        <DevDataRegisterPill />
      </div>
    </ContactDrawerProvider>
  );
};
