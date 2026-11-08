with open('frontend/src/pages/public/Home.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

is_crlf = '\r\n' in text
text_norm = text.replace('\r\n', '\n')

old_link = """            <Link
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
              Talk to an Advisor &rarr;
            </Link>"""

new_btn = """            <button
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
              Talk to an Advisor &rarr;
            </button>"""

text_norm = text_norm.replace(old_link, new_btn)

if is_crlf:
    text_norm = text_norm.replace('\n', '\r\n')

with open('frontend/src/pages/public/Home.tsx', 'w', encoding='utf-8') as f:
    f.write(text_norm)

print("Updated Home.tsx link to button!")

