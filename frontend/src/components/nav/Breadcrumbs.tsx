import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  // Don't render global breadcrumbs on homepage or pages embedding their breadcrumb in hero
  if (
    path === '/' ||
    path === '/services' ||
    path === '/services/general-insurance' ||
    path === '/services/life-insurance' ||
    path === '/services/health-insurance' ||
    path === '/investments/mutual-funds' ||
    path === '/investments/equity' ||
    path === '/investments/other-solutions' ||
    path === '/insights' ||
    path.startsWith('/insights/') ||
    path === '/privacy-policy' ||
    path === '/terms-and-conditions' ||
    path === '/disclosures' ||
    path === '/complaints' ||
    path.startsWith('/enquiry/') ||
    path.startsWith('/admin')
  ) {
    return null;
  }

  const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const crumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];

    switch (pathname) {
      case '/about-us':
        crumbs.push({ label: 'About Us' });
        break;
      case '/services':
        crumbs.push({ label: 'Services' });
        break;
      case '/services/general-insurance':
        crumbs.push({ label: 'Services', path: '/services' });
        crumbs.push({ label: 'General Insurance' });
        break;
      case '/services/life-insurance':
        crumbs.push({ label: 'Services', path: '/services' });
        crumbs.push({ label: 'Life Insurance' });
        break;
      case '/services/health-insurance':
        crumbs.push({ label: 'Services', path: '/services' });
        crumbs.push({ label: 'Health Insurance' });
        break;
      case '/investments/mutual-funds':
        crumbs.push({ label: 'Mutual Funds' });
        break;
      case '/investments/equity':
        crumbs.push({ label: 'Equity & Investments' });
        break;
      case '/investments/other-solutions':
        crumbs.push({ label: 'Services', path: '/services' });
        crumbs.push({ label: 'More Solutions' });
        break;
      case '/insights':
        crumbs.push({ label: 'Insights' });
        break;
            case '/privacy-policy':
        crumbs.push({ label: 'Privacy Policy' });
        break;
      case '/terms-and-conditions':
        crumbs.push({ label: 'Terms & Conditions' });
        break;
      case '/disclosures':
        crumbs.push({ label: 'Disclosures' });
        break;
      case '/complaints':
        crumbs.push({ label: 'Complaints' });
        break;
      case '/enquiry/thank-you':
        crumbs.push({ label: 'Thank You' });
        break;
      default:
        if (pathname.startsWith('/insights/')) {
          crumbs.push({ label: 'Insights', path: '/insights' });
          crumbs.push({ label: 'Article' });
        } else {
          crumbs.push({ label: 'Page' });
        }
        break;
    }
    return crumbs;
  };

  const crumbs = getBreadcrumbs(path);

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <div className="container">
        <ol>
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li key={index} aria-current={isLast ? 'page' : undefined}>
                {!isLast && crumb.path ? (
                  <Link to={crumb.path}>{crumb.label}</Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

