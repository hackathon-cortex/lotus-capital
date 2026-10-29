import React from 'react';
import { Link } from 'react-router-dom';
import disclaimersData from '@content/data/disclaimers.json';
import contactData from '@content/data/contact.json';
import { LotusLogo } from '../common/LotusLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="footer" role="contentinfo" data-testid="global-footer" style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          right: '-60px',
          bottom: '-60px',
          width: '400px',
          height: '400px',
          opacity: 0.05,
          pointerEvents: 'none',
        }}
      >
        <LotusLogo variant="watermark" width="100%" height="100%" />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="grid grid-cols-4">
          {/* Column 1: Lotus Capital Info */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <LotusLogo variant="light" height={42} />
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--silver-300)' }}>
              Partnering Wealth Creation. Guiding individuals and families with insurance,
              mutual funds, and equity solutions in Godhra, Gujarat.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--silver-500)', marginTop: '0.75rem' }}>
              AMFI-registered Mutual Fund Distributor (ARN-160174) & Authorised Person of Religare Broking Limited.
            </p>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4>Services</h4>
            <ul>
              <li><Link to="/services/general-insurance">General Insurance</Link></li>
              <li><Link to="/services/life-insurance">Life Insurance</Link></li>
              <li><Link to="/services/health-insurance">Health Insurance</Link></li>
              <li><Link to="/investments/mutual-funds">Mutual Funds</Link></li>
              <li><Link to="/investments/equity">Equity & Investments</Link></li>
              <li><Link to="/investments/other-solutions">More Solutions</Link></li>
            </ul>
          </div>

          {/* Column 3: Company & Legal */}
          <div>
            <h4>Company & Legal</h4>
            <ul>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/insights">Insights</Link></li>
              <li><Link to="/contact-us">Contact Us</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
              <li><Link to="/disclosures">Disclosures</Link></li>
              <li><Link to="/complaints">Complaints</Link></li>
              {import.meta.env.DEV && (
                <li>
                  <Link to="/dev/data-register" style={{ color: 'var(--warning)', fontWeight: 600 }}>
                    🛠 Data Register (Dev)
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4>Contact Godhra Office</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--silver-300)' }}>
              {contactData.address.full}
            </p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Phone: <a href={`tel:${contactData.phone}`} style={{ color: 'var(--white)' }}>{contactData.phoneDisplay}</a>
            </p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Email: <a href={`mailto:${contactData.email}`} style={{ color: 'var(--white)' }}>{contactData.email}</a>
            </p>
            {'officeHours' in contactData && (contactData as any).officeHours ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--silver-500)', marginTop: '0.5rem' }}>
                Hours: {(contactData as any).officeHours}
              </p>
            ) : null}
          </div>
        </div>

        {/* Global Footer Disclaimer from disclaimers.json */}
        <div
          className="footer__disclaimer"
          data-testid="footer-disclaimer"
          aria-label="Regulatory and risk disclosure"
        >
          <p style={{ margin: 0 }}>
            <strong>Regulatory Disclosure:</strong> {disclaimersData.footer_disclaimer}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
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
