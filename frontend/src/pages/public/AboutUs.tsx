import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import aboutContent from '@content/pages/about-us.json';
import seoData from '@content/data/seo.json';
import teamData from '@content/data/team.json';
import awardsData from '@content/data/awards.json';
import milestonesData from '@content/data/milestones.json';
import registrationsData from '@content/data/registrations.json';
import contactData from '@content/data/contact.json';
import { useStatistics } from '../../hooks/useStatistics';
import { StatBlock } from '../../components/stats/StatBlock';

export const AboutUs: React.FC = () => {
  const seo = seoData['/about-us'];
  const { stats } = useStatistics(['clients_serviced', 'mf_folios', 'demat_accounts', 'insurance_policies_total']);

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Hero */}
      <section className="section-padding bg-navy">
        <div className="container">
          <div style={{ maxWidth: '850px' }}>
            <span className="eyebrow" style={{ color: 'var(--red-300)' }}>About Lotus Capital</span>
            <h1 style={{ color: 'var(--white)', marginBottom: '1.25rem' }}>
              {aboutContent.headline}
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--silver-300)' }}>
              {aboutContent.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding-sm bg-light">
        <div className="container">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--navy-900)' }}>
            Lotus Capital in Numbers
          </h2>
          <StatBlock stats={stats} columns={4} />
        </div>
      </section>

      {/* Leadership */}
      <section className="section-padding" id="leadership">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
            <span className="eyebrow">Guiding Our Firm</span>
            <h2>Leadership Team</h2>
            <p style={{ color: 'var(--muted)' }}>
              Our leaders bring local expertise and dedicated relationship management.
            </p>
          </div>

          <div className="grid grid-cols-2" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {teamData.map((member) => (
              <div key={member.id} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={member.photoPath}
                    alt={member.name}
                    style={{
                      width: '120px',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--silver-100)',
                    }}
                  />
                  {member.approvalStatus === 'pending' && (
                    <span
                      className="badge badge-warning"
                      style={{
                        position: 'absolute',
                        bottom: '4px',
                        left: '4px',
                        fontSize: '0.65rem',
                        padding: '0.1rem 0.3rem',
                      }}
                      title="Client photo pending final written sign-off"
                    >
                      Photo pending approval
                    </span>
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{member.name}</h3>
                  <div style={{ color: 'var(--red-600)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    {member.designation}
                  </div>
                  <div style={{ color: 'var(--navy-700)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                    {member.credentials}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="section-padding bg-light">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="eyebrow">Our Journey</span>
            <h2>Key Milestones</h2>
          </div>

          <div style={{ borderLeft: '3px solid var(--navy-700)', paddingLeft: '1.5rem', marginLeft: '1rem' }}>
            {milestonesData.map((m) => (
              <div key={m.id} style={{ marginBottom: '1.75rem', position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '-2.15rem',
                    top: '0.25rem',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--red-500)',
                    border: '3px solid var(--white)',
                  }}
                />
                <span style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '1.1rem' }}>
                  {m.year}
                </span>
                <p style={{ margin: '0.25rem 0', color: 'var(--ink)' }}>{m.milestone}</p>
                <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                  Status: {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="section-padding" id="achievements">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem' }}>
            <span className="eyebrow">Industry Recognition</span>
            <h2>Awards & Recognition</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
              Historical certificates awarded to our founder and advisory team.
            </p>
          </div>

          <div style={{ overflowX: 'auto', maxWidth: '950px', margin: '0 auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Award Description</th>
                  <th>Conferred By</th>
                  <th>Verification Note</th>
                </tr>
              </thead>
              <tbody>
                {awardsData.map((a) => (
                  <tr key={a.id}>
                    <td><strong>{a.year}</strong></td>
                    <td>{a.award}</td>
                    <td>{a.issuedBy}</td>
                    <td>
                      <span className="badge badge-warning">
                        Certificate copy needed for audit
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Registrations & Licences Table */}
      <section className="section-padding bg-light">
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="eyebrow">Verified Credentials</span>
            <h2>Registrations and Affiliations</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
              Official registrations held by Lotus Capital or its founder. Wording reflects exact regulatory capacity.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Registration Type</th>
                  <th>Number</th>
                  <th>Holder</th>
                  <th>Recommended Legal Wording</th>
                </tr>
              </thead>
              <tbody>
                {registrationsData.map((r) => (
                  <tr key={r.id}>
                    <td><strong>{r.clientEntry}</strong></td>
                    <td><code>{r.number}</code></td>
                    <td>{r.holder}</td>
                    <td>{r.recommendedWording}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Office & CTA */}
      <section className="section-padding" id="location">
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px' }}>
          <span className="eyebrow">Visit Our Office</span>
          <h2>Grounded in Godhra, Gujarat</h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
            {contactData.address.full}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/contact-us" className="btn btn-primary">
              Discuss Your Financial Goals &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

