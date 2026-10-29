import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import pageContent from '@content/pages/mutual-funds.json';
import seoData from '@content/data/seo.json';
import faqsData from '@content/data/faqs.json';
import disclaimersData from '@content/data/disclaimers.json';
import registrationsData from '@content/data/registrations.json';
import { useStatistics } from '../../hooks/useStatistics';
import { SipCalculator } from '../../components/calculators/SipCalculator';
import { EnquiryForm } from '../../components/enquiry/EnquiryForm';
import { LotusLogo } from '../../components/common/LotusLogo';

export const MutualFunds: React.FC = () => {
  const seo = seoData['/investments/mutual-funds'];
  const { stats } = useStatistics(['mf_folios']);
  const pageFaqs = faqsData.filter((f) => f.page === 'mutual-funds');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Dynamic Illustration Board state (Reference 6)
  const [boardSip, setBoardSip] = useState<number>(10000);
  const [boardYears, setBoardYears] = useState<number>(15);
  const [boardRate] = useState<number>(12); // standard 12% illustrative benchmark
  const [hoveredPoint, setHoveredPoint] = useState<{ year: number; invested: number; total: number } | null>(null);

  const amfiReg = registrationsData.find((r) => r.id === 'amfi_arn');

  // Compound interest calculation: FV = P * [((1 + i)^n - 1) / i] * (1 + i)
  const i = boardRate / 12 / 100;
  const n = boardYears * 12;
  const totalInvested = boardSip * n;
  const futureValue = Math.round(boardSip * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  const estimatedGain = futureValue - totalInvested;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Generate chart data points for each year
  const chartPoints = Array.from({ length: boardYears }, (_, idx) => {
    const yr = idx + 1;
    const months = yr * 12;
    const inv = boardSip * months;
    const fv = Math.round(boardSip * ((Math.pow(1 + i, months) - 1) / i) * (1 + i));
    return { year: yr, invested: inv, total: fv };
  });

  // Chart SVG coordinates
  const svgWidth = 600;
  const svgHeight = 220;
  const maxVal = futureValue > 0 ? futureValue : 1;
  const getX = (yr: number) => ((yr - 1) / (boardYears - 1 || 1)) * (svgWidth - 60) + 40;
  const getY = (val: number) => svgHeight - 30 - (val / maxVal) * (svgHeight - 60);

  const totalPointsPath = chartPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p.total)}`).join(' ');
  const investedPointsPath = chartPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p.invested)}`).join(' ');
  const areaPath = `${totalPointsPath} L ${getX(boardYears)} ${svgHeight - 30} L ${getX(1)} ${svgHeight - 30} Z`;

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Hero Section */}
      <section
        className="hero"
        style={{
          minHeight: '480px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          backgroundColor: 'var(--navy-950)',
          overflow: 'hidden',
          paddingTop: '120px',
          paddingBottom: '80px',
        }}
      >
        <div
          className="hero-scrim"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(10,37,64,0.96) 0%, rgba(18,61,103,0.88) 100%)',
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '-60px',
            bottom: '-40px',
            width: '420px',
            height: '420px',
            opacity: 0.05,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <LotusLogo variant="watermark" width="100%" height="100%" />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px' }}>
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
              DISCIPLINED INVESTING • GODHRA, GUJARAT
            </span>
            <h1
              style={{
                color: 'var(--white)',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
              }}
            >
              Invest with a Goal. <br />
              <span style={{ color: 'var(--silver-300)' }}>Review with a Plan.</span>
            </h1>
            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--silver-300)',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '720px',
              }}
            >
              Mutual funds pool money from investors and invest according to a scheme&apos;s stated objective.
              Lotus Capital guides you through category allocation, KYC onboarding, and disciplined long-term compounding.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <a href="#sip-calculator" className="btn btn-primary btn-lg">
                Calculate SIP Growth
              </a>
              <a href="#enquiry" className="btn btn-secondary-dark btn-lg">
                Discuss Your Portfolio
              </a>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(215,217,220,0.2)',
                  color: 'var(--silver-300)',
                  fontSize: '0.85rem',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--red-500)' }} />
                <span><strong>{stats[0]?.value || '1,200+'}</strong> Active Mutual Fund Folios</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AMFI Registration Line (Design.md 9.2 Block 2) */}
      <section style={{ backgroundColor: 'var(--silver-100)', borderBottom: '1px solid var(--silver-300)', padding: '0.85rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--ink)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--navy-700)', fontWeight: 600 }}>AMFI Registered Distributor:</span>
              <span>{amfiReg?.recommendedWording || 'Abhilash Dineshchandra Chudasama is an AMFI-registered Mutual Fund Distributor (ARN-160174)'}</span>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
              EUIN: E303534 • Valid till: 03-Oct-2027
            </div>
          </div>
        </div>
      </section>

      {/* Reference 6: Illustration Board */}
      <section className="section-padding" style={{ backgroundColor: 'var(--navy-950)', color: 'var(--white)', position: 'relative', overflow: 'hidden' }} data-reveal>
        <div
          style={{
            position: 'absolute',
            right: '-80px',
            top: '-60px',
            width: '480px',
            height: '480px',
            opacity: 0.04,
            pointerEvents: 'none',
          }}
        >
          <LotusLogo variant="watermark" width="100%" height="100%" />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Board Header with Mandatory Compliance Notice */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', gap: '1rem', borderBottom: '1px solid rgba(215,217,220,0.15)', paddingBottom: '1.5rem' }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--red-300)' }}>Visual Blueprint</span>
              <h2 style={{ color: 'var(--white)', margin: '0.25rem 0 0', fontFamily: 'Poppins, sans-serif' }}>
                Systematic Wealth Accumulation Board
              </h2>
            </div>
            <div
              style={{
                padding: '0.4rem 0.85rem',
                backgroundColor: 'rgba(233,35,50,0.15)',
                border: '1px solid rgba(233,35,50,0.4)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                color: 'var(--red-300)',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Illustration only. Not a forecast or guarantee.
            </div>
          </div>

          {/* Interactive Illustration Grid */}
          <div className="grid grid-cols-12" style={{ gap: '2rem', alignItems: 'stretch' }}>
            {/* Left 5 Cols: Large Headline Figure + Board Controls */}
            <div className="col-span-12 col-span-md-5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div
                style={{
                  backgroundColor: 'var(--navy-900)',
                  border: '1px solid rgba(215,217,220,0.15)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2rem',
                }}
              >
                <span style={{ fontSize: '0.85rem', color: 'var(--silver-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Projected Maturity Value ({boardYears} Yrs @ {boardRate}%)
                </span>
                <div
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                    color: 'var(--white)',
                    margin: '0.5rem 0 1rem',
                  }}
                >
                  {formatCurrency(futureValue)}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid rgba(215,217,220,0.1)', paddingTop: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--silver-500)' }}>Amount Invested</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--silver-300)', marginTop: '0.2rem' }}>
                      {formatCurrency(totalInvested)}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--silver-500)' }}>Estimated Growth</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#38A169', marginTop: '0.2rem' }}>
                      +{formatCurrency(estimatedGain)}
                    </div>
                  </div>
                </div>

                {/* Quick Board Adjusters */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(215,217,220,0.1)' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--silver-300)', marginBottom: '0.35rem' }}>
                      <span>Monthly Contribution</span>
                      <strong style={{ color: 'var(--white)' }}>{formatCurrency(boardSip)}</strong>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={50000}
                      step={1000}
                      value={boardSip}
                      onChange={(e) => setBoardSip(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--red-500)', cursor: 'pointer' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--silver-300)', marginBottom: '0.35rem' }}>
                      <span>Investment Horizon</span>
                      <strong style={{ color: 'var(--white)' }}>{boardYears} Years</strong>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={25}
                      step={1}
                      value={boardYears}
                      onChange={(e) => setBoardYears(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--red-500)', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>

              {/* Goal Progress Bars (Reference 6) */}
              <div
                style={{
                  backgroundColor: 'var(--navy-900)',
                  border: '1px solid rgba(215,217,220,0.15)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  marginTop: '1.5rem',
                }}
              >
                <span style={{ fontSize: '0.8rem', color: 'var(--silver-300)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Illustrative Goal Progress Tracking
                </span>

                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                    <span>Child Higher Education (Target: ₹25 Lakh)</span>
                    <strong style={{ color: 'var(--white)' }}>82% of Goal</strong>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '82%', height: '100%', backgroundColor: 'var(--red-500)', borderRadius: '4px' }} />
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                    <span>Long-Term Retirement Corpus (Target: ₹1.5 Cr)</span>
                    <strong style={{ color: 'var(--white)' }}>64% of Goal</strong>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '64%', height: '100%', backgroundColor: 'var(--navy-600)', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Interactive SVG Growth Line Chart with Tooltip */}
            <div className="col-span-12 col-span-md-7" style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  backgroundColor: 'var(--navy-900)',
                  border: '1px solid rgba(215,217,220,0.15)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2rem',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0, color: 'var(--white)', fontSize: '1.05rem' }}>
                    Compounding Growth Progression
                  </h4>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--silver-300)' }}>
                      <span style={{ width: '10px', height: '10px', backgroundColor: '#38A169', borderRadius: '2px' }} /> Projected Value
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--silver-500)' }}>
                      <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--silver-500)', borderRadius: '2px' }} /> Amount Invested
                    </span>
                  </div>
                </div>

                {/* SVG Chart */}
                <div style={{ width: '100%', height: '240px', position: 'relative', marginTop: '1rem' }}>
                  <svg
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    style={{ width: '100%', height: '100%', overflow: 'visible' }}
                  >
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                      const y = svgHeight - 30 - pct * (svgHeight - 60);
                      return (
                        <g key={idx}>
                          <line
                            x1="40"
                            y1={y}
                            x2={svgWidth - 20}
                            y2={y}
                            stroke="rgba(215,217,220,0.12)"
                            strokeDasharray="4 4"
                          />
                          <text
                            x="5"
                            y={y + 4}
                            fill="rgba(215,217,220,0.5)"
                            fontSize="10"
                            fontFamily="Inter, sans-serif"
                          >
                            {Math.round((maxVal * pct) / 100000)}L
                          </text>
                        </g>
                      );
                    })}

                    {/* Area fill */}
                    <path d={areaPath} fill="rgba(56, 161, 105, 0.12)" />

                    {/* Invested line */}
                    <path
                      d={investedPointsPath}
                      fill="none"
                      stroke="var(--silver-500)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />

                    {/* Growth line */}
                    <path
                      d={totalPointsPath}
                      fill="none"
                      stroke="#38A169"
                      strokeWidth="3.5"
                    />

                    {/* Data interactive points */}
                    {chartPoints.map((p) => {
                      const cx = getX(p.year);
                      const cy = getY(p.total);
                      return (
                        <circle
                          key={p.year}
                          cx={cx}
                          cy={cy}
                          r="5"
                          fill="#38A169"
                          stroke="var(--navy-900)"
                          strokeWidth="2"
                          style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                          onMouseEnter={() => setHoveredPoint(p)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      );
                    })}
                  </svg>

                  {/* Tooltip on hover */}
                  {hoveredPoint && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'var(--navy-800)',
                        border: '1px solid var(--silver-300)',
                        padding: '0.6rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        color: 'var(--white)',
                        pointerEvents: 'none',
                        boxShadow: 'var(--shadow-md)',
                      }}
                    >
                      <div style={{ fontWeight: 700, color: 'var(--red-300)', marginBottom: '0.2rem' }}>
                        Year {hoveredPoint.year}
                      </div>
                      <div>Invested: {formatCurrency(hoveredPoint.invested)}</div>
                      <div style={{ color: '#38A169', fontWeight: 600 }}>
                        Value: {formatCurrency(hoveredPoint.total)}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid rgba(215,217,220,0.1)', fontSize: '0.75rem', color: 'var(--silver-500)', lineHeight: '1.5' }}>
                  *Assumed return rate of {boardRate}% per annum is used purely for educational illustration and does not represent a promised or guaranteed yield.
                </div>
              </div>
            </div>
          </div>

          {/* Three Action Cards (Reference 6) */}
          <div className="grid grid-cols-1 grid-cols-md-3" style={{ gap: '1.5rem', marginTop: '2.5rem' }}>
            <div
              className="card"
              style={{
                backgroundColor: 'var(--navy-900)',
                borderColor: 'rgba(215,217,220,0.15)',
                color: 'var(--white)',
                padding: '1.75rem',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(233,35,50,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--red-300)',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  marginBottom: '1rem',
                }}
              >
                1
              </div>
              <h3 style={{ color: 'var(--white)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>
                Start a Systematic Investment Plan (SIP)
              </h3>
              <p style={{ color: 'var(--silver-300)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Automate regular monthly or quarterly contributions from your bank account to instill financial discipline and benefit from rupee cost averaging.
              </p>
              <a href="#sip-calculator" className="btn btn-secondary-dark btn-sm" style={{ marginTop: '0.75rem' }}>
                Explore SIP Tools →
              </a>
            </div>

            <div
              className="card"
              style={{
                backgroundColor: 'var(--navy-900)',
                borderColor: 'rgba(215,217,220,0.15)',
                color: 'var(--white)',
                padding: '1.75rem',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(215,217,220,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--silver-300)',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  marginBottom: '1rem',
                }}
              >
                2
              </div>
              <h3 style={{ color: 'var(--white)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>
                Invest a Lump Sum
              </h3>
              <p style={{ color: 'var(--silver-300)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Deploy available surplus or business liquidity across debt, hybrid, or diversified equity funds tailored to your immediate and medium-term timeline.
              </p>
              <a href="#enquiry" className="btn btn-secondary-dark btn-sm" style={{ marginTop: '0.75rem' }}>
                Plan Lump Sum →
              </a>
            </div>

            <div
              className="card"
              style={{
                backgroundColor: 'var(--navy-900)',
                borderColor: 'rgba(215,217,220,0.15)',
                color: 'var(--white)',
                padding: '1.75rem',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(215,217,220,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--silver-300)',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  marginBottom: '1rem',
                }}
              >
                3
              </div>
              <h3 style={{ color: 'var(--white)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>
                Request a Portfolio Review
              </h3>
              <p style={{ color: 'var(--silver-300)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Receive an objective assessment of your existing folios, asset allocation, scheme overlaps, and suitability against your targeted financial milestones.
              </p>
              <a href="#enquiry" className="btn btn-secondary-dark btn-sm" style={{ marginTop: '0.75rem' }}>
                Book Review →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Fund Categories (Design.md 9.2 Block 4) */}
      <section className="section-padding bg-light" data-reveal>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span className="eyebrow">Disciplined Asset Allocation</span>
            <h2>Mutual Fund Categories</h2>
            <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
              Schemes differ fundamentally by asset class, investment approach, risk horizon, and liquidity.
            </p>
          </div>

          <div className="grid grid-cols-1 grid-cols-md-3" style={{ gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                EQ
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Equity Schemes</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Invest predominantly in stocks across Large Cap, Mid Cap, Small Cap, and Multi-Cap segments for long-term capital appreciation. Best suited for investment horizons of 5+ years.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                DB
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Debt & Liquid Funds</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Invest in government bonds, treasury bills, and corporate debt securities to provide income and stability with lower volatility. Suited for short to medium-term horizons.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                HY
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Hybrid Schemes</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Blend equity upside with debt security through Balanced Advantage or Aggressive Hybrid allocations, dynamically rebalancing asset weights based on market valuations.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                IX
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Index Funds & ETFs</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Low-cost passive investment options that replicate key market indices such as Nifty 50 or Sensex, eliminating fund manager bias with high transparency.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--silver-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontWeight: 700, marginBottom: '1rem' }}>
                TX
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Tax-Saving ELSS</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Equity Linked Savings Schemes offer income tax deductions under Section 80C with the shortest statutory lock-in period of 3 years among eligible tax-saving instruments.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--navy-100)', borderColor: 'var(--navy-300)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--navy-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)', fontWeight: 700, marginBottom: '1rem' }}>
                KYC
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--navy-900)' }}>KYC & Onboarding</h3>
              <p style={{ color: 'var(--navy-800)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Lotus Capital assists Godhra and Gujarat investors with end-to-end digital KYC verification, mandate setups, and seamless folio creation across leading AMCs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SIP vs Lump Sum & Regular vs Direct Plans (Design.md 9.2 Block 5) */}
      <section className="section-padding" data-reveal>
        <div className="container">
          <div className="grid grid-cols-1 grid-cols-md-2" style={{ gap: '2.5rem' }}>
            <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
              <span className="eyebrow" style={{ color: 'var(--navy-700)' }}>Method Comparison</span>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>SIP vs Lump Sum Investing</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
                {pageContent.sections.find((s) => s.id === 'sip-vs-lumpsum')?.copy}
              </p>
              <div style={{ marginTop: 'auto', backgroundColor: 'var(--silver-100)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--navy-900)' }}>Key Distinction:</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '0.35rem 0 0' }}>
                  SIPs remove emotional market timing through rupee cost averaging, while lump sum works effectively when investing surplus with a multi-year horizon.
                </p>
              </div>
            </div>

            <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
              <span className="eyebrow" style={{ color: 'var(--navy-700)' }}>Transparent Model</span>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Regular Plans vs Direct Plans</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
                {pageContent.sections.find((s) => s.id === 'plans-comparison')?.copy}
              </p>
              <div style={{ marginTop: 'auto', backgroundColor: 'var(--silver-100)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--navy-900)' }}>Distribution Notice:</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '0.35rem 0 0' }}>
                  Lotus Capital operates as an AMFI-registered mutual fund distributor offering regular plans with local guidance, annual reviews, and operational service in Godhra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive SIP Calculator (#sip-calculator) */}
      <section className="section-padding bg-light" id="sip-calculator" data-reveal>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="eyebrow">Interactive Planning</span>
            <h2>SIP Growth Calculator</h2>
            <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
              Simulate potential returns across customizable monthly investments, timelines, and growth rates.
            </p>
          </div>

          <SipCalculator />
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="section-padding" id="faqs" data-reveal>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="eyebrow">Clarity & Governance</span>
            <h2>Mutual Fund FAQs</h2>
            <p style={{ color: 'var(--muted)' }}>Direct answers to common questions about mutual fund investing.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pageFaqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderColor: isOpen ? 'var(--navy-600)' : 'var(--silver-300)',
                  }}
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--navy-900)' }}>{faq.question}</h4>
                    <span
                      style={{
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 0.24s cubic-bezier(0.22, 1, 0.36, 1)',
                        fontSize: '1.5rem',
                        lineHeight: 1,
                        color: 'var(--navy-700)',
                        fontWeight: 300,
                        marginLeft: '1rem',
                      }}
                    >
                      +
                    </span>
                  </div>
                  {isOpen && (
                    <p style={{ margin: '1rem 0 0', color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6', borderTop: '1px solid var(--silver-300)', paddingTop: '0.75rem' }}>
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mandatory Mutual Fund Risk Note (Design.md 10.9) */}
      <section className="container" style={{ margin: '2rem auto' }} data-reveal>
        <div
          className="risk-note"
          style={{
            backgroundColor: 'var(--silver-100)',
            borderLeft: '4px solid var(--navy-700)',
            padding: '1.5rem 2rem',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--red-600)', fontSize: '1.25rem', lineHeight: 1, marginTop: '2px' }}>
              ⓘ
            </div>
            <div>
              <strong style={{ color: 'var(--navy-900)', fontSize: '0.95rem' }}>
                Mandatory Mutual Fund Disclosure:
              </strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink)', margin: '0.5rem 0 0', lineHeight: '1.6' }}>
                {disclaimersData.mutual_fund_risk}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="section-padding bg-light" id="enquiry" data-reveal>
        <div className="container" style={{ maxWidth: '780px' }}>
          <EnquiryForm
            defaultService="mutual-funds"
            title="Discuss Your Investment Objectives"
            subtitle="Connect with our Godhra team for objective scheme guidance, KYC verification, and goal planning."
          />
        </div>
      </section>
    </>
  );
};
