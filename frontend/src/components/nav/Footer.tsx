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
      className="footer site-footer"
      role="contentinfo"
      data-testid="global-footer"
    >
      {/* Background Watermark (bottom-right, white 5%) */}
      <div
        className="site-footer__watermark"
        aria-hidden="true"
      >
        <LotusLogo variant="watermark" width="100%" height="100%" />
      </div>

      <div className="container site-footer__container">
        {/* Four-column desktop grid */}
        <div className="site-footer__grid footer-columns-grid">
          {/* Column 1: Brand */}
          <div className="site-footer__col site-footer__col--brand" data-testid="footer-col-brand">
            <div style={{ marginBottom: '20px', maxHeight: '56px' }}>
              <LotusLogo variant="light" height={42} />
            </div>
            <p className="site-footer__tagline">
              Partnering Wealth Creation. Guiding individuals and families with insurance,
              mutual funds, and equity solutions in Godhra, Gujarat.
            </p>
            <p className="site-footer__reg-text">
              AMFI-registered Mutual Fund Distributor (ARN-160174) &amp; Authorised Person of Religare Broking Limited.
            </p>
          </div>

          {/* Column 2: Services */}
          <div className="site-footer__col site-footer__col--services" data-testid="footer-col-services">
            <h4 className="site-footer__heading">Services</h4>
            <ul className="site-footer__list">
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
          <div className="site-footer__col site-footer__col--company" data-testid="footer-col-company">
            <h4 className="site-footer__heading">Company &amp; Legal</h4>
            <ul className="site-footer__list">
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

          {/* Column 4: Contact Godhra Office */}
          <div className="site-footer__col site-footer__col--contact" data-testid="footer-col-contact">
            <h4 className="site-footer__heading">Contact Godhra Office</h4>
            <div className="site-footer__contact-info">
              <div style={{ color: '#C9CED4', lineHeight: 1.4 }}>
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
              {'officeHours' in contactData && (contactData as any).officeHours ? (
                <div style={{ fontSize: '13px', color: 'var(--silver-400, #94a3b8)', marginTop: '4px' }}>
                  Hours: {(contactData as any).officeHours}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* 1px divider */}
        <hr className="site-footer__divider" />

        {/* Bottom Bar: Copyright on left, registrations on right */}
        <div className="site-footer__bottom-row footer__bottom">
          <div>
            &copy; {new Date().getFullYear()} Lotus Capital. All rights reserved.
          </div>
          <div>
            <span>AMFI ARN-160174 | NSE AP007909931 | BSE AP0130040172963</span>
          </div>
        </div>

        {/* Global Footer Disclaimer from disclaimers.json */}
        <div
          className="site-footer__disclaimer footer__disclaimer"
          data-testid="footer-disclaimer"
          aria-label="Regulatory and risk disclosure"
        >
          <p style={{ margin: 0 }}>
            <strong>Regulatory Disclosure:</strong> {disclaimersData.footer_disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
};
