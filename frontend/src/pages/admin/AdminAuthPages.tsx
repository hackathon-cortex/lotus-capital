import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth, UserRole } from '../../context/MockAuthContext';

export const AdminLogin: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next') || '/admin/dashboard';

  const [email, setEmail] = useState('admin@lotuscapital.com');
  const [role, setRole] = useState<UserRole>('admin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
    navigate(decodeURIComponent(next), { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>Admin Sign In | Lotus Capital</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--silver-100)', padding: '1.5rem' }}>
        <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img
              src="/assets/lotus_capital_logo_traced.svg"
              alt="Lotus Capital"
              style={{ height: '48px', marginBottom: '1rem' }}
            />
            <h2>Admin Sign In</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
              Mock Authentication for Lotus Capital CMS
            </p>
          </div>

          {isAuthenticated && (
            <div className="badge badge-info" style={{ display: 'block', padding: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>
              Currently signed in. Submitting will switch mock session.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-role" className="form-label">Mock Role</label>
              <select
                id="login-role"
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="admin">Administrator (Full Access)</option>
                <option value="staff">Staff (Limited Access)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Sign In (Mock)
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
            <Link to="/admin/forgot-password" style={{ color: 'var(--navy-700)' }}>
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export const AdminForgotPassword: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>Reset Password | Lotus Capital Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--silver-100)', padding: '1.5rem' }}>
        <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem' }}>
          <h2>Reset Password</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
            Enter your work email and we will send a password reset link if the account exists.
          </p>

          {submitted ? (
            <div className="badge badge-success" style={{ display: 'block', padding: '1rem', lineHeight: '1.6', textAlign: 'left' }}>
              If an account exists for {email}, a password reset link has been dispatched. (Neutral security response)
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="reset-email" className="form-label">Email Address</label>
                <input
                  id="reset-email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@lotuscapital.com"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Send Reset Link
              </button>
            </form>
          )}

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link to="/admin/login" style={{ fontSize: '0.85rem' }}>
              &larr; Back to login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export const AdminResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <>
      <Helmet>
        <title>Set New Password | Lotus Capital Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--silver-100)', padding: '1.5rem' }}>
        <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem' }}>
          <h2>Set New Password</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1rem' }}>
            Reset token: <code>{token}</code>
          </p>

          {done ? (
            <div>
              <div className="badge badge-success" style={{ display: 'block', padding: '1rem', marginBottom: '1.5rem' }}>
                Your password has been successfully reset.
              </div>
              <Link to="/admin/login" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                Sign In With New Password
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="new-pw" className="form-label">New Password</label>
                <input
                  id="new-pw"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

