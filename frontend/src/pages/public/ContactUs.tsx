import React from 'react';
import { Helmet } from 'react-helmet-async';
import contactContent from '@content/pages/contact-us.json';
import seoData from '@content/data/seo.json';
import contactData from '@content/data/contact.json';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';

export const ContactUs: React.FC = () => {
  const seo = seoData['/contact-us'];

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Hero */}
      <section className="section-padding bg-navy">
        <div className="container">
          <div style={{ maxWidth: '800px' }}>
            <span className="eyebrow" style={{ color: 'var(--red-300)' }}>Contact Us</span>
            <h1 style={{ color: 'var(--white)', marginBottom: '1.25rem' }}>
              {contactContent.headline}
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--silver-300)' }}>
              {contactContent.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Details & Form */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-2" style={{ gap: '3rem', alignItems: 'start' }}>
            {/* Contact Details */}
            <div>
              <span className="eyebrow">Our Details</span>
              <h2>Godhra Office Information</h2>
              <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
                We welcome in-person visits during business hours and are reachable by phone and email.
              </p>

              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h4>Office Address</h4>
                <p style={{ margin: 0, color: 'var(--ink)' }}>{contactData.address.full}</p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                  Landmark: {contactData.address.landmark}
                </div>
              </div>

              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h4>Direct Phone & Email</h4>
                <p style={{ margin: 0 }}>
                  <strong>Phone:</strong>{' '}
                  <a href={`tel:${contactData.phone}`}>{contactData.phoneDisplay}</a>
                </p>
                <p style={{ margin: '0.5rem 0 0' }}>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${contactData.email}`}>{contactData.email}</a>
                </p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--silver-500)' }}>
                  Working Hours: {contactData.officeHours}
                </p>
              </div>

              <div className="card" style={{ backgroundColor: 'var(--silver-100)' }}>
                <h4>WhatsApp Channel</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>
                  {contactData.whatsapp.statusNote}
                </p>
              </div>
            </div>

            {/* Enquiry Form */}
            <div>
              <EnquiryForm
                title="Send an Enquiry"
                subtitle="Fill out the form below and an advisor will connect with you."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

