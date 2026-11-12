import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth, UserRole } from '../../context/MockAuthContext';
import { api } from '../../api/client';

export interface AdminLoginProps {
  defaultTab?: 'login' | 'signup';
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ defaultTab = 'login' }) => {
  const { login, validateMfa, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next') || '/admin/dashboard';

  // Active tab: 'login' | 'signup'
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);

  // Login form state
  const [email, setEmail] = useState('admin@lotuscapital.in');
  const [password, setPassword] = useState('LotusAdmin@2026');
  const [isMockMode, setIsMockMode] = useState(false);
  const [role, setRole] = useState<UserRole>('admin');

  // Sign Up form state
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState<'admin' | 'editor'>('admin');
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Two-Factor Authentication state
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaToken, setMfaToken] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSignupSuccess(null);
    setIsSubmitting(true);

    try {
      if (isMockMode) {
        await login(email, role);
        navigate(decodeURIComponent(next), { replace: true });
      } else {
        const result = await login(email, password);
        if (result.success) {
          navigate(decodeURIComponent(next), { replace: true });
        } else if (result.mfa_required && result.mfa_token) {
          setMfaRequired(true);
          setMfaToken(result.mfa_token);
        } else {
          setError(result.error || 'Authentication failed. Please verify credentials.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to backend service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSignupSuccess(null);

    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (signupPassword.length < 12) {
      setError('Password must be at least 12 characters long with mixed case, numbers, and symbols.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isMockMode) {
        // Mock mode local signup
        setSignupSuccess('Account created in offline mode! You may now sign in.');
        setEmail(signupEmail);
        setActiveTab('login');
      } else {
        const res = await api.auth.register({
          full_name: signupFullName.trim(),
          email: signupEmail.trim().toLowerCase(),
          password: signupPassword,
          role: signupRole,
        });

        if (res && res.success !== false) {
          setSignupSuccess('Account registered successfully! Please sign in with your credentials.');
          setEmail(signupEmail.trim().toLowerCase());
          setPassword('');
          setActiveTab('login');
        } else {
          setError(res?.message || 'Registration could not be completed.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. The email address might already be registered.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaToken || !mfaCode.trim()) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await validateMfa(mfaToken, mfaCode.trim());
      if (res.success) {
        navigate(decodeURIComponent(next), { replace: true });
      } else {
        setError(res.error || 'Invalid verification code. Please retry.');
      }
    } catch (err: any) {
      setError(err.message || 'MFA validation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{activeTab === 'signup' ? 'Admin Sign Up | Lotus Capital' : 'Admin Sign In | Lotus Capital'}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--silver-100)', padding: '1.5rem' }}>
        <div className="card" style={{ maxWidth: '460px', width: '100%', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <img
              src="/assets/lotus_capital_logo_traced.svg"
              alt="Lotus Capital"
              style={{ height: '48px', marginBottom: '1rem' }}
            />
            <h2>{activeTab === 'signup' ? 'Admin Registration' : 'Admin Sign In'}</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
              {isMockMode ? 'Mock Authentication' : 'Lotus Capital Secure Admin Portal'}
            </p>
          </div>

          {/* Tab Switcher: Sign In vs Sign Up */}
          {!mfaRequired && (
            <div
              style={{
                display: 'flex',
                borderRadius: '10px',
                backgroundColor: 'var(--silver-200, #e2e8f0)',
                padding: '4px',
                marginBottom: '1.5rem',
              }}
            >
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setError(null); setSignupSuccess(null); }}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeTab === 'login' ? '#ffffff' : 'transparent',
                  color: activeTab === 'login' ? 'var(--navy-900, #0a2540)' : 'var(--muted, #556270)',
                  fontWeight: activeTab === 'login' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'login' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('signup'); setError(null); setSignupSuccess(null); }}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeTab === 'signup' ? '#ffffff' : 'transparent',
                  color: activeTab === 'signup' ? 'var(--navy-900, #0a2540)' : 'var(--muted, #556270)',
                  fontWeight: activeTab === 'signup' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'signup' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                Sign Up
              </button>
            </div>
          )}

          {signupSuccess && (
            <div
              style={{
                display: 'block',
                padding: '0.7rem 0.9rem',
                marginBottom: '1rem',
                color: '#15803d',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid #16a34a',
                borderRadius: '6px',
                fontSize: '0.85rem',
              }}
            >
              ✓ {signupSuccess}
            </div>
          )}

          {error && (
            <div
              style={{
                display: 'block',
                padding: '0.6rem 0.8rem',
                marginBottom: '1rem',
                color: '#e92332',
                backgroundColor: 'rgba(233, 35, 50, 0.08)',
                border: '1px solid #e92332',
                borderRadius: '4px',
                fontSize: '0.85rem',
              }}
            >
              {error}
            </div>
          )}

          {isAuthenticated && !error && activeTab === 'login' && (
            <div className="badge badge-info" style={{ display: 'block', padding: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>
              Currently signed in. Submitting will refresh or switch session.
            </div>
          )}

          {mfaRequired ? (
            <form onSubmit={handleMfaSubmit}>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🔐</span>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', margin: '0 0 0.4rem' }}>
                  Two-Factor Authentication
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>
                  Enter the 6-digit authenticator code from your mobile app or an emergency backup code.
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="mfa-code" className="form-label">Authentication Code</label>
                <input
                  id="mfa-code"
                  type="text"
                  className="form-control"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="e.g. 123456"
                  maxLength={16}
                  autoFocus
                  required
                  style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.2em', fontFamily: 'monospace' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
                disabled={isSubmitting || !mfaCode.trim()}
              >
                {isSubmitting ? 'Verifying Code...' : 'Verify & Continue'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setMfaRequired(false);
                    setMfaToken(null);
                    setMfaCode('');
                  }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--navy-700)', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  ← Back to Email and Password
                </button>
              </div>
            </form>
          ) : activeTab === 'login' ? (
            /* Sign In Form */
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@lotuscapital.in"
                  required
                />
              </div>

              {!isMockMode ? (
                <div className="form-group">
                  <label htmlFor="login-password" className="form-label">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter administrator password"
                    required
                  />
                </div>
              ) : (
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
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={isMockMode}
                    onChange={(e) => setIsMockMode(e.target.checked)}
                  />
                  <span style={{ color: 'var(--muted)' }}>Offline / Mock Mode</span>
                </label>

                <Link to="/admin/forgot-password" style={{ color: 'var(--navy-700)' }}>
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Authenticating...' : isMockMode ? 'Sign In (Mock)' : 'Sign In'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--silver-300, #d7d9dc)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Don't have an admin account? </span>
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setError(null); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--navy-900, #0a2540)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Create one now
                </button>
              </div>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label htmlFor="signup-name" className="form-label">Full Name</label>
                <input
                  id="signup-name"
                  type="text"
                  className="form-control"
                  value={signupFullName}
                  onChange={(e) => setSignupFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-email" className="form-label">Email Address</label>
                <input
                  id="signup-email"
                  type="email"
                  className="form-control"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="name@lotuscapital.in"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-role" className="form-label">Role</label>
                <select
                  id="signup-role"
                  className="form-control"
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value as any)}
                >
                  <option value="admin">Administrator (Full Access)</option>
                  <option value="editor">Staff / Associate (Assigned Access)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="signup-password" className="form-label">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  className="form-control"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Minimum 12 characters"
                  required
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginTop: '3px' }}>
                  Must be $\ge 12$ chars with uppercase, lowercase, numbers, and symbols.
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="signup-confirm-password" className="form-label">Confirm Password</label>
                <input
                  id="signup-confirm-password"
                  type="password"
                  className="form-control"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.75rem' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Admin Account'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--silver-300, #d7d9dc)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(null); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--navy-900, #0a2540)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export const AdminSignUp: React.FC = () => {
  return <AdminLogin defaultTab="signup" />;
};

export const AdminForgotPassword: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.auth.forgotPassword(email);
    } catch {
      // Always treat response neutrally to prevent account enumeration
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
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
                  placeholder="admin@lotuscapital.in"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await api.auth.resetPassword(token, password);
      setDone(true);
    } catch (err: any) {
      setError(err.message || 'Password reset token is invalid or has expired.');
    } finally {
      setLoading(false);
    }
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

          {error && (
            <div
              style={{
                display: 'block',
                padding: '0.6rem 0.8rem',
                marginBottom: '1rem',
                color: '#e92332',
                backgroundColor: 'rgba(233, 35, 50, 0.08)',
                border: '1px solid #e92332',
                borderRadius: '4px',
                fontSize: '0.85rem',
              }}
            >
              {error}
            </div>
          )}

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
                  minLength={12}
                  placeholder="At least 12 characters"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading || password.length < 12}>
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

