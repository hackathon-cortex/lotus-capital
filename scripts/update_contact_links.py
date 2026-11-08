import os

# 1. Update Header.tsx
header_path = 'frontend/src/components/nav/Header.tsx'
with open(header_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Normalize CRLF for replacement
is_crlf = '\r\n' in text
text_normalized = text.replace('\r\n', '\n')

old_desktop = """          <Link
            to="/contact-us"
            className="nav-link"
            aria-current={location.pathname === '/contact-us' ? 'page' : undefined}
          >
            Contact Us
          </Link>

          <Link
            to={advisorCtaLink}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1.15rem', whiteSpace: 'nowrap' }}
          >
            Talk to an Advisor
          </Link>"""

new_desktop = """          <button
            type="button"
            onClick={(e) => openContactDrawer(undefined, e.currentTarget)}
            className="nav-link"
          >
            Contact Us
          </button>

          <button
            type="button"
            onClick={(e) => openContactDrawer(currentService || undefined, e.currentTarget)}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1.15rem', whiteSpace: 'nowrap' }}
          >
            Talk to an Advisor
          </button>"""

text_normalized = text_normalized.replace(old_desktop, new_desktop)

old_mobile = """            <Link to="/contact-us" className="nav-link" style={{ fontSize: '1.1rem' }}>
              Contact Us
            </Link>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Link to={advisorCtaLink} className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                Talk to an Advisor
              </Link>
            </div>"""

new_mobile = """            <button
              type="button"
              onClick={(e) => {
                setMobileMenuOpen(false);
                openContactDrawer(undefined, e.currentTarget);
              }}
              className="nav-link"
              style={{ fontSize: '1.1rem', textAlign: 'left', width: '100%', paddingLeft: 0 }}
            >
              Contact Us
            </button>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <button
                type="button"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  openContactDrawer(currentService || undefined, e.currentTarget);
                }}
                className="btn btn-primary"
                style={{ width: '100%', textAlign: 'center' }}
              >
                Talk to an Advisor
              </button>
            </div>"""

text_normalized = text_normalized.replace(old_mobile, new_mobile)

if is_crlf:
    text_normalized = text_normalized.replace('\n', '\r\n')

with open(header_path, 'w', encoding='utf-8') as f:
    f.write(text_normalized)

print('Updated Header.tsx!')

