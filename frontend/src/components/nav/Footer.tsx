import { useContactDrawer } from '../../context/ContactDrawerContext';
import React from 'react';
import disclaimersData from '@content/data/disclaimers.json';
import contactData from '@content/data/contact.json';
import { LotusLogo } from '../common/LotusLogo';
import { FooterLink } from './NavLinkButton';

export const Footer: React.FC = () => {
  const { openContactDrawer } = useContactDrawer();

  return (
    <footer
      className="footer"
      role="contentinfo"
      data-testid="global-footer"
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--navy-950, #06182c)',
        color: '#C9CED4',
        paddingTop: '4rem',
        paddingBottom: '2.5rem',
        borderTop: '3px solid var(--red-600, #D9232D)',
      }}
    >
      {/* Background Watermark */}
      <div
        style={{
          position: 'absolute',
          right: '-60px',
          bottom: '-60px',
          width: '400px',
          height: '400px',
          opacity: 0.04,
          pointerEvents: 'none',
        }}
      >
        <LotusLogo variant="watermark" width="100%" height="100%" />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          className="grid grid-cols-1 grid-cols-md-4 footer-columns-grid"
          style={{
            gap: '2.5rem',
            alignItems: 'start',
            marginBottom: '3rem',
          }}
        >
          {/* Column 1: Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <LotusLogo variant="light" height={42} />
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '15px',
                lineHeight: '1.65',
                color: '#C9CED4',
                margin: 0,
                marginBottom: '1rem',
              }}
            >
              Partnering Wealth Creation. Guiding individuals and families with insurance,
              mutual funds, and equity solutions in Godhra, Gujarat.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '13px',
                lineHeight: '1.5',
                color: 'var(--silver-400, #94a3b8)',
                margin: 0,
              }}
            >
              AMFI-registered Mutual Fund Distributor (ARN-160174) &amp; Authorised Person of Religare Broking Limited.
            </p>
          </div>

          {/* Column 2: Services */}
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <h4
              style={{
                fontFamily: 'var(--font-primary, Poppins, sans-serif)',
                fontSize: '18px',
                fontWeight: 600,
                color: '#FFFFFF',
                margin: 0,
                marginBottom: '1.25rem',
              }}
            >
              Services
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <li>
                <FooterLink to="/services/general-insurance">General Insurance</FooterLink>
              </li>
              <li>
                <FooterLink to="/services/life-insurance">Life Insurance</FooterLink>
              </li>
              <li>
                <FooterLink to="/services/health-insurance">Health Insurance</FooterLink>
              </li>
              <li>
                <FooterLink to="/investments/mutual-funds">Mutual Funds</FooterLink>
              </li>
              <li>
                <FooterLink to="/investments/equity">Equity &amp; Investments</FooterLink>
              </li>
              <li>
                <FooterLink to="/investments/other-solutions">More Solutions</FooterLink>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Legal */}
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <h4
              style={{
                fontFamily: 'var(--font-primary, Poppins, sans-serif)',
                fontSize: '18px',
                fontWeight: 600,
                color: '#FFFFFF',
                margin: 0,
                marginBottom: '1.25rem',
              }}
            >
              Company &amp; Legal
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <li>
                <FooterLink to="/about-us">About Us</FooterLink>
              </li>
              <li>
                <FooterLink to="/insights">Insights</FooterLink>
              </li>
              <li>
                <FooterLink onClick={() => openContactDrawer()}>Contact Us</FooterLink>
              </li>
              <li>
                <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
              </li>
              <li>
                <FooterLink to="/terms-and-conditions">Terms &amp; Conditions</FooterLink>
              </li>
              <li>
                <FooterLink to="/disclosures">Disclosures</FooterLink>
              </li>
              <li>
                <FooterLink to="/complaints">Complaints</FooterLink>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact (contact.json only) */}
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <h4
              style={{
                fontFamily: 'var(--font-primary, Poppins, sans-serif)',
                fontSize: '18px',
                fontWeight: 600,
                color: '#FFFFFF',
                margin: 0,
                marginBottom: '1.25rem',
              }}
            >
              Contact
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '15px',
                lineHeight: '1.5',
              }}
            >
              <div style={{ color: '#C9CED4' }}>
                {contactData.address.full}
              </div>
              <div>
                <FooterLink href={`tel:${contactData.phone}`}>
                  {contactData.phoneDisplay}
                </FooterLink>
              </div>
              <div>
                <FooterLink href={`mailto:${contactData.email}`}>
                  {contactData.email}
                </FooterLink>
              </div>
            </div>
          </div>
        </div>

        {/* Global Footer Disclaimer from disclaimers.json */}
        <div
          className="footer__disclaimer"
          data-testid="footer-disclaimer"
          aria-label="Regulatory and risk disclosure"
          style={{
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            fontSize: '13px',
            color: '#C9CED4',
            lineHeight: '1.65',
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            textAlign: 'left',
          }}
        >
          <p style={{ margin: 0 }}>
            <strong style={{ color: '#FFFFFF' }}>Regulatory Disclosure:</strong> {disclaimersData.footer_disclaimer}
          </p>
        </div>

        {/* Bottom Bar */}
        <div
          className="footer__bottom"
          style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '13px',
            color: 'var(--silver-400, #94a3b8)',
            fontFamily: 'var(--font-body, Inter, sans-serif)',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} Lotus Capital. All rights reserved.
          </div>
          <div>
            <span>AMFI ARN-160174 | NSE AP007909931 | BSE AP0130040172963</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
