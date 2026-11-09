import React, { useState, useId } from 'react';

export const SipCalculator: React.FC = () => {
  const [monthlyAmount, setMonthlyAmount] = useState<number>(5000);
  const [years, setYears] = useState<number>(10);
  const [expectedRate, setExpectedRate] = useState<number>(12);

  const monthlyInputId = useId();
  const yearsInputId = useId();
  const rateInputId = useId();

  // Monthly interest rate
  const i = expectedRate / 12 / 100;
  // Total number of months
  const n = years * 12;

  // Future value of SIP: P * [((1 + i)^n - 1) / i] * (1 + i)
  const totalInvested = monthlyAmount * n;
  const futureValue =
    i > 0
      ? Math.round(monthlyAmount * ((Math.pow(1 + i, n) - 1) / i) * (1 + i))
      : totalInvested;
  const estimatedReturns = futureValue - totalInvested;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="card" id="sip-calculator" data-testid="sip-calculator">
      <h3 style={{ marginBottom: '0.5rem' }}>SIP Growth Illustration</h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
        Estimate the potential corpus growth of a Systematic Investment Plan over time.
      </p>

      <div className="grid grid-cols-2" style={{ alignItems: 'center' }}>
        {/* Controls */}
        <div>
          <div className="form-group">
            <label htmlFor={monthlyInputId} className="form-label">
              Monthly Investment: {formatCurrency(monthlyAmount)}
            </label>
            <input
              id={monthlyInputId}
              type="range"
              min={500}
              max={100000}
              step={500}
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(Number(e.target.value))}
              className="form-control"
              style={{ cursor: 'pointer' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor={yearsInputId} className="form-label">
              Investment Horizon: {years} Years ({years * 12} months)
            </label>
            <input
              id={yearsInputId}
              type="range"
              min={1}
              max={30}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="form-control"
              style={{ cursor: 'pointer' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor={rateInputId} className="form-label">
              Assumed Annual Growth Rate: {expectedRate}%
            </label>
            <input
              id={rateInputId}
              type="range"
              min={4}
              max={18}
              step={0.5}
              value={expectedRate}
              onChange={(e) => setExpectedRate(Number(e.target.value))}
              className="form-control"
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Results */}
        <div style={{ backgroundColor: 'var(--silver-100)', padding: '1.5rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Total Amount Invested</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--navy-900)' }}>
              {formatCurrency(totalInvested)}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Estimated Gain / Return</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--success)' }}>
              {formatCurrency(estimatedReturns)}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--silver-300)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Projected Total Maturity Value</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--navy-900)' }}>
              {formatCurrency(futureValue)}
            </div>
          </div>

          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.5rem',
              backgroundColor: '#fff3cd',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              color: 'var(--warning)',
              border: '1px solid #ffeeba',
            }}
          >
            <strong>Mandatory Note:</strong> Illustration only. Not a forecast or guarantee. Actual returns vary depending on market fluctuations and scheme performance.
          </div>
        </div>
      </div>
    </div>
  );
};

