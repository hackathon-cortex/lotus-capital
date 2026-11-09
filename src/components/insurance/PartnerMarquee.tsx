import React from 'react';

export interface PartnerItem {
  id: string;
  name: string;
  relationshipLabel: string;
  logoPlaceholder: string;
  category?: string;
  status?: string;
}

export interface PartnerMarqueeProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  partners: PartnerItem[];
}

export const PartnerMarquee: React.FC<PartnerMarqueeProps> = ({
  id = 'partners',
  eyebrow = 'UNDERWRITING NETWORK',
  title = 'Underwriting & Execution Partners',
  subtitle = 'Official life insurance underwriting institutions serving clients in Godhra.',
  partners,
}) => {
  // Multiply list for continuous looping
  const row1 = [...partners, ...partners, ...partners];
  const row2 = [...partners.slice().reverse(), ...partners.slice().reverse(), ...partners.slice().reverse()];

  return (
    <section
      id={id}
      className="partner-marquee-section section-padding gi-stacked-section"
      style={{
        position: 'relative',
        zIndex: 13,
        marginTop: '-36px',
        borderTopLeftRadius: '36px',
        borderTopRightRadius: '36px',
        backgroundColor: 'var(--white, #ffffff)',
        boxShadow: '0 -10px 40px rgba(10,37,64,0.06)',
        paddingTop: '4.5rem',
        paddingBottom: '5rem',
        overflow: 'hidden',
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto 3rem', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
          <span
            className="eyebrow"
            style={{
              display: 'inline-block',
              color: 'var(--navy-700, #0d2b4a)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            {eyebrow}
          </span>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: 'var(--navy-950, #051329)',
              marginBottom: '1rem',
            }}
          >
            {title}
          </h2>

          <p style={{ color: 'var(--muted, #556270)', fontSize: '1.02rem', lineHeight: 1.65 }}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Row 1: Scrolling Left */}
      <div className="marquee-outer" style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div
          className="marquee-track-left"
          style={{
            display: 'flex',
            gap: '2rem',
            width: 'max-content',
            animation: 'marqueeScrollLeft 32s linear infinite',
          }}
        >
          {row1.map((p, idx) => (
            <div
              key={`row1-${p.id}-${idx}`}
              className="partner-logo-tile"
              style={{
                width: '300px',
                minHeight: '160px',
                padding: '1.75rem 1.5rem',
                borderRadius: '24px',
                backgroundColor: 'var(--white, #ffffff)',
                border: '1px solid var(--silver-300, #d7d9dc)',
                boxShadow: '0 8px 24px rgba(10,37,64,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                flexShrink: 0,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem', width: '100%' }}>
                <img
                  src={p.logoPlaceholder}
                  alt={p.name}
                  style={{
                    maxHeight: '52px',
                    maxWidth: '190px',
                    objectFit: 'contain',
                    filter: 'grayscale(20%)',
                    transition: 'filter 0.25s ease',
                  }}
                  className="partner-logo-img"
                />
              </div>
              <strong style={{ fontSize: '0.96rem', color: 'var(--navy-900, #0a2540)', display: 'block', marginBottom: '0.35rem' }}>
                {p.name}
              </strong>
              <span style={{ fontSize: '0.76rem', color: 'var(--muted, #556270)', backgroundColor: 'var(--silver-100, #f8f9fa)', padding: '0.2rem 0.65rem', borderRadius: '9999px' }}>
                {p.relationshipLabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Scrolling Right */}
      <div className="marquee-outer" style={{ overflow: 'hidden' }}>
        <div
          className="marquee-track-right"
          style={{
            display: 'flex',
            gap: '2rem',
            width: 'max-content',
            animation: 'marqueeScrollRight 34s linear infinite',
          }}
        >
          {row2.map((p, idx) => (
            <div
              key={`row2-${p.id}-${idx}`}
              className="partner-logo-tile"
              style={{
                width: '300px',
                minHeight: '160px',
                padding: '1.75rem 1.5rem',
                borderRadius: '24px',
                backgroundColor: 'var(--white, #ffffff)',
                border: '1px solid var(--silver-300, #d7d9dc)',
                boxShadow: '0 8px 24px rgba(10,37,64,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                flexShrink: 0,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem', width: '100%' }}>
                <img
                  src={p.logoPlaceholder}
                  alt={p.name}
                  style={{
                    maxHeight: '52px',
                    maxWidth: '190px',
                    objectFit: 'contain',
                    filter: 'grayscale(20%)',
                    transition: 'filter 0.25s ease',
                  }}
                  className="partner-logo-img"
                />
              </div>
              <strong style={{ fontSize: '0.96rem', color: 'var(--navy-900, #0a2540)', display: 'block', marginBottom: '0.35rem' }}>
                {p.name}
              </strong>
              <span style={{ fontSize: '0.76rem', color: 'var(--muted, #556270)', backgroundColor: 'var(--silver-100, #f8f9fa)', padding: '0.2rem 0.65rem', borderRadius: '9999px' }}>
                {p.relationshipLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

