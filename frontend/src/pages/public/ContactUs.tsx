import React from 'react';
import { Helmet } from 'react-helmet-async';
import contactContent from '@content/pages/contact-us.json';
import seoData from '@content/data/seo.json';
import contactData from '@content/data/contact.json';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';
import { LotusLogo } from '../../components/common/LotusLogo';

export const ContactUs: React.FC = () => {
  const seo = seoData['/contact-us'];

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Hero */}
      <section
        className="hero"
        style={{
          minHeight: '360px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          backgroundColor: 'var(--navy-950)',
          overflow: 'hidden',
          paddingTop: '120px',
          paddingBottom: '60px',
        }}
      >
        <div
          className="hero-scrim"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(10,37,64,0.95) 0%, rgba(18,61,103,0.85) 100%)',
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '-50px',
            bottom: '-40px',
            width: '360px',
            height: '360px',
            opacity: 0.05,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <LotusLogo variant="watermark" width="100%" height="100%" />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '800px' }}>
            <span
              className="eyebrow"
              style={{
                color: 'var(--silver-300)',
                letterSpacing: '0.12em',
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '0.75rem',
              }}
            >
              COMMUNICATION & VISITS • GODHRA, GUJARAT
            </span>
            <h1
              style={{
                color: 'var(--white)',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                lineHeight: 1.15,
                marginBottom: '1rem',
              }}
            >
              {contactContent.headline}
            </h1>
            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--silver-300)',
                lineHeight: 1.6,
                maxWidth: '680px',
                margin: 0,
              }}
            >
              {contactContent.intro || 'Start with a clear, honest conversation about your financial goals, protection requirements, and time horizon.'}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Details & Form (Design.md 8.10: Left 5 cols, Right 7 cols) */}
      <section className="section-padding" data-reveal>
        <div className="container">
          <div className="grid grid-cols-12" style={{ gap: '3rem', alignItems: 'start' }}>
            {/* Left 5 Columns: Contact Cards */}
            <div className="col-span-12 col-span-md-5">
              <span className="eyebrow">Direct Touchpoints</span>
              <h2>Our Godhra Office</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                We welcome in-person visits at our office during working hours and respond promptly to phone, WhatsApp, and digital enquiries.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Office Address Card */}
                <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--silver-100)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--navy-700)',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    📍
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem', color: 'var(--navy-900)' }}>
                      Office Address
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ink)', lineHeight: '1.5' }}>
                      {contactData.address.full}
                    </p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.35rem' }}>
                      Landmark: {contactData.address.landmark}
                    </div>
                  </div>
                </div>

                {/* Direct Phone Card */}
                <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--silver-100)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--navy-700)',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    📞
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem', color: 'var(--navy-900)' }}>
                      Direct Phone
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>
                      <a href={`tel:${contactData.phone}`} style={{ color: 'var(--navy-700)', fontWeight: 600, textDecoration: 'none' }}>
                        {contactData.phoneDisplay}
                      </a>
                    </p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                      Call for instant advisory queries
                    </div>
                  </div>
                </div>

                {/* WhatsApp Card */}
                <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--silver-100)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--navy-700)',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    💬
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem', color: 'var(--navy-900)' }}>
                      WhatsApp Business
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>
                      <a
                        href={`https://wa.me/${contactData.whatsapp.number.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--navy-700)', fontWeight: 600, textDecoration: 'none' }}
                      >
                        {contactData.phoneDisplay}
                      </a>
                    </p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                      Direct chat for portfolio updates & documents
                    </div>
                  </div>
                </div>

                {/* Email Address Card */}
                <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--silver-100)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--navy-700)',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    ✉️
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem', color: 'var(--navy-900)' }}>
                      Official Email
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>
                      <a href={`mailto:${contactData.email}`} style={{ color: 'var(--navy-700)', fontWeight: 600, textDecoration: 'none' }}>
                        {contactData.email}
                      </a>
                    </p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                      Official proposals, claims, and KYC documentation
                    </div>
                  </div>
                </div>

                {/* Working Hours Card (Render only if confirmed) */}
                {contactData.officeHours && (
                  <div className="card" style={{ padding: '1.25rem 1.5rem', backgroundColor: 'var(--silver-100)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--navy-900)', fontWeight: 600 }}>
                      Working Hours
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                      {contactData.officeHours}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right 7 Columns: Form Card */}
            <div className="col-span-12 col-span-md-7">
              <div
                className="card"
                style={{
                  padding: '2.5rem',
                  boxShadow: 'var(--shadow-md)',
                  borderTop: '4px solid var(--red-600)',
                }}
              >
                <EnquiryForm
                  title="Send Us a Detailed Enquiry"
                  subtitle="Fill out the form below. An advisor will review your request and get in touch via your preferred contact method."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width Map Below (Design.md 8.10: 400px tall, radius-lg) */}
      <section className="container" style={{ marginBottom: '5rem' }} data-reveal>
        <div
          style={{
            height: '400px',
            width: '100%',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--silver-300)',
            position: 'relative',
            backgroundColor: 'var(--silver-100)',
          }}
        >
          <iframe
            title="Lotus Capital Godhra Office Location"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src="https://maps.google.com/maps?q=Shri+Chudasama+Bhuvan,+M.G.+Road,+Near+Police+Chowki+No.+1,+Godhra+389001,+Gujarat&t=&z=15&ie=UTF8&iwloc=&output=embed"
            style={{ filter: 'grayscale(15%) contrast(1.05)' }}
          />
        </div>
      </section>
    </>
  );
};
