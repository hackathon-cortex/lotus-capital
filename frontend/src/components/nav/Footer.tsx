import React from 'react';
import { Link } from 'react-router-dom';
import disclaimersData from '@content/data/disclaimers.json';
import contactData from '@content/data/contact.json';

export const Footer: React.FC = () => {
  return (
    <footer className="footer" role="contentinfo" data-testid="global-footer">
      <div className="container">
        <div className="grid grid-cols-4">
          {/* Column 1: Lotus Capital Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <img
                src="/assets/lotus_capital_logo_traced.svg"
                alt="Lotus Capital"
                style={{ height: '36px', filter: 'brightness(0) invert(1)' }}
              />
              <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--white)' }}>
                Lotus Capital
              </span>
            </div>
            <p style={{ fontSize: '0.875rem' }}>
              Partnering Wealth Creation. Guiding individuals and families with insurance,
              mutual funds, and equity solutions in Godhra, Gujarat.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--silver-500)' }}>
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
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4>Contact Godhra Office</h4>
            <p style={{ fontSize: '0.85rem' }}>
              {contactData.address.full}
            </p>
            <p style={{ fontSize: '0.85rem' }}>
              Phone: <a href={`tel:${contactData.phone}`}>{contactData.phoneDisplay}</a>
            </p>
            <p style={{ fontSize: '0.85rem' }}>
              Email: <a href={`mailto:${contactData.email}`}>{contactData.email}</a>
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--silver-500)' }}>
              Hours: {contactData.officeHours}
            </p>
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

