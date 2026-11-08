import os
import re

# 1. Update content/pages/*.json
for path, old_s, new_s in [
    ('content/pages/about-us.json', '"buttonLink": "/contact-us"', '"buttonLink": "/?contact=open"'),
    ('content/pages/home.json', '"link": "/contact-us"', '"link": "/?contact=open"'),
    ('content/pages/not-found.json', '{"path": "/contact-us", "text": "Contact Us"}', '{"path": "/?contact=open", "text": "Contact Us"}'),
    ('content/pages/not-found.json', '{"text": "Contact Us", "path": "/contact-us"}', '{"text": "Contact Us", "path": "/?contact=open"}'),
]:
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            c = f.read()
        c = c.replace(old_s, new_s)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(c)
        print(f"Updated {path}")

# 2. Update frontend/src/components/nav/Footer.tsx
footer_path = 'frontend/src/components/nav/Footer.tsx'
if os.path.exists(footer_path):
    with open(footer_path, 'r', encoding='utf-8') as f:
        c = f.read()
    # add import of useContactDrawer
    if 'useContactDrawer' not in c:
        c = "import { useContactDrawer } from '../../context/ContactDrawerContext';\n" + c
        # add hook call in Footer
        c = re.sub(r'export const Footer: React.FC = \(\) => \{', 'export const Footer: React.FC = () => {\n  const { openContactDrawer } = useContactDrawer();', c)
    # replace Contact Us link with button
    old_link = '<li><Link to="/contact-us">Contact Us</Link></li>'
    new_btn = '<li><button type="button" onClick={() => openContactDrawer()} className="footer-link-button">Contact Us</button></li>'
    c = c.replace(old_link, new_btn)
    with open(footer_path, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated Footer.tsx")

# 3. Update frontend/src/components/nav/Breadcrumbs.tsx
bc_path = 'frontend/src/components/nav/Breadcrumbs.tsx'
if os.path.exists(bc_path):
    with open(bc_path, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace("case '/contact-us':\n        crumbs.push({ label: 'Contact Us' });\n        break;\n", "")
    c = c.replace("case '/contact-us':\r\n        crumbs.push({ label: 'Contact Us' });\r\n        break;\r\n", "")
    with open(bc_path, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated Breadcrumbs.tsx")

# 4. Update frontend/src/pages/public/NotFound.tsx
nf_path = 'frontend/src/pages/public/NotFound.tsx'
if os.path.exists(nf_path):
    with open(nf_path, 'r', encoding='utf-8') as f:
        c = f.read()
    if 'useContactDrawer' not in c:
        c = "import { useContactDrawer } from '../../context/ContactDrawerContext';\n" + c
        c = re.sub(r'export const NotFound: React.FC = \(\) => \{', 'export const NotFound: React.FC = () => {\n  const { openContactDrawer } = useContactDrawer();', c)
    c = c.replace('<Link to="/contact-us" className="btn btn-navy">\n              Contact Us\n            </Link>',
                  '<button type="button" onClick={(e) => openContactDrawer(undefined, e.currentTarget)} className="btn btn-navy" style={{ cursor: "pointer" }}>\n              Contact Us\n            </button>')
    c = c.replace('<Link to="/contact-us" className="btn btn-navy">\r\n              Contact Us\r\n            </Link>',
                  '<button type="button" onClick={(e) => openContactDrawer(undefined, e.currentTarget)} className="btn btn-navy" style={{ cursor: "pointer" }}>\n              Contact Us\n            </button>')
    with open(nf_path, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated NotFound.tsx")

# 5. Update frontend/src/pages/public/InsightArticle.tsx
ia_path = 'frontend/src/pages/public/InsightArticle.tsx'
if os.path.exists(ia_path):
    with open(ia_path, 'r', encoding='utf-8') as f:
        c = f.read()
    if 'useContactDrawer' not in c:
        c = "import { useContactDrawer } from '../../context/ContactDrawerContext';\n" + c
        c = re.sub(r'export const InsightArticle: React.FC = \(\) => \{', 'export const InsightArticle: React.FC = () => {\n  const { openContactDrawer } = useContactDrawer();', c)
    old_cta = """<Link
                      to="/contact-us"
                      className="btn"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        borderRadius: '24px',
                        padding: '0.75rem 1.4rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      Talk to an Advisor
                    </Link>"""
    new_cta = """<button
                      type="button"
                      onClick={(e) => openContactDrawer(article.relatedService, e.currentTarget)}
                      className="btn"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        borderRadius: '24px',
                        padding: '0.75rem 1.4rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Talk to an Advisor
                    </button>"""
    c = c.replace(old_cta.replace('\n', '\r\n'), new_cta.replace('\n', '\r\n'))
    c = c.replace(old_cta, new_cta)
    with open(ia_path, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated InsightArticle.tsx")

# 6. Update frontend/src/pages/public/AboutUs.tsx
about_path = 'frontend/src/pages/public/AboutUs.tsx'
if os.path.exists(about_path):
    with open(about_path, 'r', encoding='utf-8') as f:
        c = f.read()
    if 'useContactDrawer' not in c:
        c = "import { useContactDrawer } from '../../context/ContactDrawerContext';\n" + c
        c = re.sub(r'export const AboutUs: React.FC = \(\) => \{', 'export const AboutUs: React.FC = () => {\n  const { openContactDrawer } = useContactDrawer();', c)
    c = c.replace('<Link to="/contact-us" className="btn btn-primary btn-lg">',
                  '<button type="button" onClick={(e) => openContactDrawer(undefined, e.currentTarget)} className="btn btn-primary btn-lg" style={{ border: "none", cursor: "pointer" }}>')
    # replace closing </Link> for those buttons
    c = c.replace('Discuss Your Goals &rarr;\n                </Link>',
                  'Discuss Your Goals &rarr;\n                </button>')
    c = c.replace('Discuss Your Goals &rarr;\r\n                </Link>',
                  'Discuss Your Goals &rarr;\r\n                </button>')
    with open(about_path, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated AboutUs.tsx")

# 7. Update frontend/src/pages/public/Home.tsx
home_path = 'frontend/src/pages/public/Home.tsx'
if os.path.exists(home_path):
    with open(home_path, 'r', encoding='utf-8') as f:
        c = f.read()
    if 'useContactDrawer' not in c:
        c = "import { useContactDrawer } from '../../context/ContactDrawerContext';\n" + c
        c = re.sub(r'export const Home: React.FC = \(\) => \{', 'export const Home: React.FC = () => {\n  const { openContactDrawer } = useContactDrawer();', c)
    
    # 1. Hero Talk to an Advisor
    old_hero_talk = """              <Link
                to="/contact-us"
                className="btn btn-secondary-light btn-lg"
                style={{ borderRadius: 'var(--radius-btn)' }}
              >
                Talk to an Advisor
              </Link>"""
    new_hero_talk = """              <button
                type="button"
                onClick={(e) => openContactDrawer(undefined, e.currentTarget)}
                className="btn btn-secondary-light btn-lg"
                style={{ borderRadius: 'var(--radius-btn)', cursor: 'pointer' }}
              >
                Talk to an Advisor
              </button>"""
    c = c.replace(old_hero_talk.replace('\n', '\r\n'), new_hero_talk.replace('\n', '\r\n'))
    c = c.replace(old_hero_talk, new_hero_talk)

    # 2. Schedule Consultation
    old_sched = """            <Link
              to="/contact-us"
              className="btn btn-primary"
              style={{
                backgroundColor: 'var(--red-600)',
                borderRadius: 'var(--radius-btn)',
                padding: '0.75rem 1.75rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              Talk to an Advisor
            </Link>"""
    new_sched = """            <button
              type="button"
              onClick={(e) => openContactDrawer(undefined, e.currentTarget)}
              className="btn btn-primary"
              style={{
                backgroundColor: 'var(--red-600)',
                borderRadius: 'var(--radius-btn)',
                padding: '0.75rem 1.75rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Talk to an Advisor
            </button>"""
    c = c.replace(old_sched.replace('\n', '\r\n'), new_sched.replace('\n', '\r\n'))
    c = c.replace(old_sched, new_sched)

    # 3. FAQ Talk to an advisor
    old_faq_talk = """                <Link
                  to="/contact-us"
                  className="btn btn-primary"
                  style={{ borderRadius: 'var(--radius-btn)', padding: '0.6rem 1.4rem' }}
                >
                  Talk to an Advisor &rarr;
                </Link>"""
    new_faq_talk = """                <button
                  type="button"
                  onClick={(e) => openContactDrawer(undefined, e.currentTarget)}
                  className="btn btn-primary"
                  style={{ borderRadius: 'var(--radius-btn)', padding: '0.6rem 1.4rem', border: 'none', cursor: 'pointer' }}
                >
                  Talk to an Advisor &rarr;
                </button>"""
    c = c.replace(old_faq_talk.replace('\n', '\r\n'), new_faq_talk.replace('\n', '\r\n'))
    c = c.replace(old_faq_talk, new_faq_talk)

    # Add JSON-LD block inside Helmet
    json_ld = """        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['FinancialService', 'LocalBusiness'],
            name: 'Lotus Capital',
            image: 'https://lotuscapital.org/images/hero.jpg',
            telephone: '+919328852555',
            email: 'lotuscapitalinfo@gmail.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Shri Chudasama Bhuvan, M.G. Road, Near Police Chowki No. 1',
              addressLocality: 'Godhra',
              postalCode: '389001',
              addressRegion: 'Gujarat',
              addressCountry: 'IN'
            },
            areaServed: 'Godhra, Panchmahals, Gujarat, India',
            url: 'https://lotuscapital.org'
          })}
        </script>"""

    if 'application/ld+json' not in c:
        c = c.replace('      </Helmet>', f"{json_ld}\n      </Helmet>")

    with open(home_path, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated Home.tsx")

# 8. Update frontend/src/routes/AppRoutes.tsx
routes_path = 'frontend/src/routes/AppRoutes.tsx'
if os.path.exists(routes_path):
    with open(routes_path, 'r', encoding='utf-8') as f:
        c = f.read()

    # remove ContactUs import
    c = re.sub(r"import\s*\{\s*ContactUs\s*\}\s*from\s*'../pages/public/ContactUs';\s*", "", c)

    # Add ContactRedirect component if not present
    if 'ContactRedirect' not in c:
        redirect_comp = """import { useSearchParams } from 'react-router-dom';

const ContactRedirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const nextParams = new URLSearchParams(searchParams);
  nextParams.set('contact', 'open');
  return <Navigate to={`/?${nextParams.toString()}`} replace />;
};
"""
        c = c.replace("export const AppRoutes: React.FC = () => {", f"{redirect_comp}\nexport const AppRoutes: React.FC = () => {{")

    # replace /contact and /contact-us routes
    c = c.replace('<Route path="/contact" element={<Navigate to="/contact-us" replace />} />',
                  '<Route path="/contact" element={<ContactRedirect />} />')
    c = c.replace('<Route path="/contact-us" element={<ContactUs />} />',
                  '<Route path="/contact-us" element={<ContactRedirect />} />')

    with open(routes_path, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated AppRoutes.tsx")

# 9. Update backend/tests/test_enquiries.py
be_test_path = 'backend/tests/test_enquiries.py'
if os.path.exists(be_test_path):
    with open(be_test_path, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('source_path="/contact-us"', 'source_path="/?contact=open"')
    with open(be_test_path, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated backend/tests/test_enquiries.py")

# 10. Update frontend/tests/footerDisclaimer.test.tsx
footer_test_path = 'frontend/tests/footerDisclaimer.test.tsx'
if os.path.exists(footer_test_path):
    with open(footer_test_path, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace("    '/contact-us',\n", "")
    c = c.replace("    '/contact-us',\r\n", "")
    with open(footer_test_path, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated footerDisclaimer.test.tsx")

# 11. Delete ContactUs.tsx and contact-us.json
if os.path.exists('frontend/src/pages/public/ContactUs.tsx'):
    os.remove('frontend/src/pages/public/ContactUs.tsx')
    print("Deleted ContactUs.tsx")

if os.path.exists('content/pages/contact-us.json'):
    os.remove('content/pages/contact-us.json')
    print("Deleted contact-us.json")

print("All refactoring applied successfully!")

