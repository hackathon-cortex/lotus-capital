import servicesData from '@content/data/services.json';

export interface NavItemConfig {
  id: string;
  label: string;
  path: string;
  exactMatchOnly?: boolean;
  isTrigger?: boolean;
  isDrawerTrigger?: boolean;
  matches: string[];
}

export interface ServiceMenuItem {
  slug: string;
  title: string;
  shortDescription: string;
  path: string;
  category: string;
}

/**
 * Primary navigation item definitions.
 * Sourced strictly from requirements:
 * Home, About Us, Services, Mutual Funds, Equity, Insights, Contact Us, Talk to an Advisor.
 */
export const NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    exactMatchOnly: true,
    matches: ['/'],
  },
  {
    id: 'about',
    label: 'About Us',
    path: '/about-us',
    matches: ['/about-us', '/about'],
  },
  {
    id: 'insurance',
    label: 'Insurance',
    path: '/services',
    isTrigger: true,
    matches: [
      '/services',
      '/services/general-insurance',
      '/services/life-insurance',
      '/services/health-insurance',
      '/investments/other-solutions',
    ],
  },
  {
    id: 'mutual-funds',
    label: 'Mutual Funds',
    path: '/investments/mutual-funds',
    matches: ['/investments/mutual-funds'],
  },
  {
    id: 'equity',
    label: 'Equity',
    path: '/investments/equity',
    matches: ['/investments/equity'],
  },
  {
    id: 'insights',
    label: 'Insights',
    path: '/insights',
    matches: ['/insights'],
  },
  {
    id: 'contact',
    label: 'Contact Us',
    path: '/contact',
    isDrawerTrigger: true,
    matches: ['/contact', '/contact-us'],
  },
];

/**
 * Exactly the 3 insurance solutions for the Insurance MegaMenu and Mobile Drawer accordion,
 * driven directly by content/data/services.json:
 * General Insurance, Life Insurance, Health Insurance.
 */
const INSURANCE_SLUGS = [
  'general-insurance',
  'life-insurance',
  'health-insurance',
];

export const INSURANCE_MENU_ITEMS: ServiceMenuItem[] = (servicesData as any[])
  .filter((s) => INSURANCE_SLUGS.includes(s.slug))
  .map((s) => ({
    slug: s.slug,
    title: s.title,
    shortDescription: s.shortDescription,
    path: s.path,
    category: s.category,
  }));

export const SERVICES_MENU_ITEMS: ServiceMenuItem[] = INSURANCE_MENU_ITEMS;

/**
 * Route Tone mapping:
 * 'dark-hero': header begins in transparent navy glass over hero
 * 'solid': header begins in solid navy glass for high AAA contrast on light pages
 * Defaults to 'solid' for any unlisted route.
 */
export const ROUTE_HEADER_TONES: Record<string, 'dark-hero' | 'solid'> = {
  '/': 'dark-hero',
  '/services': 'dark-hero',
  '/services/general-insurance': 'dark-hero',
  '/services/life-insurance': 'dark-hero',
  '/services/health-insurance': 'dark-hero',
  '/investments/mutual-funds': 'dark-hero',
  '/investments/equity': 'dark-hero',
  '/investments/other-solutions': 'dark-hero',
  '/about-us': 'solid',
  '/insights': 'solid',
};

export function getHeaderTone(pathname: string): 'dark-hero' | 'solid' {
  if (ROUTE_HEADER_TONES[pathname]) {
    return ROUTE_HEADER_TONES[pathname];
  }
  if (pathname.startsWith('/insights')) {
    return 'solid';
  }
  if (
    pathname.startsWith('/services/') ||
    pathname.startsWith('/investments/')
  ) {
    return 'dark-hero';
  }
  return 'solid';
}

/**
 * Prefix-based active route detection.
 * Home is active ONLY on exact "/".
 * Hash changes (#enquiry, #process) do not affect pathname matching.
 * Specific investment routes (Mutual Funds, Equity) take precedence over general services.
 */
export function getActiveNavItem(pathname: string): NavItemConfig | null {
  if (pathname === '/') {
    return NAV_ITEMS[0];
  }

  // Mutual Funds takes priority over general investments
  const mfItem = NAV_ITEMS.find((item) => item.id === 'mutual-funds');
  if (mfItem && mfItem.matches.some((m) => pathname === m || pathname.startsWith(m + '/'))) {
    return mfItem;
  }

  // Equity takes priority over general investments
  const equityItem = NAV_ITEMS.find((item) => item.id === 'equity');
  if (equityItem && equityItem.matches.some((m) => pathname === m || pathname.startsWith(m + '/'))) {
    return equityItem;
  }

  // Check remaining items
  for (const item of NAV_ITEMS) {
    if (item.id === 'home' || item.id === 'mutual-funds' || item.id === 'equity') continue;
    if (item.matches.some((m) => pathname === m || pathname.startsWith(m + '/'))) {
      return item;
    }
  }

  return null;
}
