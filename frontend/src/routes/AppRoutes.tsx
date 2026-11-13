import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { RequireAuth } from '../guards/RequireAuth';
import { RequireRole } from '../guards/RequireRole';
import { TrailingSlashRedirect } from './redirects';

// Public pages
import { Home } from '../pages/public/Home';
import { AboutUs } from '../pages/public/AboutUs';
import { Services } from '../pages/public/Services';
import { GeneralInsurance } from '../pages/public/GeneralInsurance';
import { LifeInsurance } from '../pages/public/LifeInsurance';
import { HealthInsurance } from '../pages/public/HealthInsurance';
import { RohiniCashlessEmpanelment } from '../pages/public/RohiniCashlessEmpanelment';
import { MutualFunds } from '../pages/public/MutualFunds';
import { Equity } from '../pages/public/Equity';
import { OtherSolutions } from '../pages/public/OtherSolutions';
import { Insights } from '../pages/public/Insights';
import { InsightArticle } from '../pages/public/InsightArticle';
import { EnquiryThankYou } from '../pages/public/EnquiryThankYou';
import { LegalPage } from '../pages/public/LegalPage';
import { NotFound } from '../pages/public/NotFound';

// Dev page
import { DataRegisterPage } from '../pages/dev/DataRegisterPage';

// Lazy-loaded Admin Layout & Auth Pages
const AdminLayout = React.lazy(() =>
  import('../layouts/AdminLayout').then((m) => ({ default: m.AdminLayout }))
);
const AdminLogin = React.lazy(() =>
  import('../pages/admin/AdminAuthPages').then((m) => ({ default: m.AdminLogin }))
);
const AdminSignUp = React.lazy(() =>
  import('../pages/admin/AdminAuthPages').then((m) => ({ default: m.AdminSignUp }))
);
const AdminForgotPassword = React.lazy(() =>
  import('../pages/admin/AdminAuthPages').then((m) => ({ default: m.AdminForgotPassword }))
);
const AdminResetPassword = React.lazy(() =>
  import('../pages/admin/AdminAuthPages').then((m) => ({ default: m.AdminResetPassword }))
);

// Lazy-loaded Admin Screens (Keeps admin code completely isolated from public bundle)
const AdminDashboard = React.lazy(() =>
  import('../pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AdminLeads = React.lazy(() =>
  import('../pages/admin/AdminLeads').then((m) => ({ default: m.AdminLeads }))
);
const AdminFollowups = React.lazy(() =>
  import('../pages/admin/AdminFollowups').then((m) => ({ default: m.AdminFollowups }))
);
const AdminReports = React.lazy(() =>
  import('../pages/admin/AdminReports').then((m) => ({ default: m.AdminReports }))
);
const AdminContentPages = React.lazy(() =>
  import('../pages/admin/AdminContentPages').then((m) => ({ default: m.AdminContentPages }))
);
const AdminPageEditor = React.lazy(() =>
  import('../pages/admin/AdminPageEditor').then((m) => ({ default: m.AdminPageEditor }))
);
const AdminFaqs = React.lazy(() =>
  import('../pages/admin/AdminFaqs').then((m) => ({ default: m.AdminFaqs }))
);
const AdminTeam = React.lazy(() =>
  import('../pages/admin/AdminTeam').then((m) => ({ default: m.AdminTeam }))
);
const AdminPartnersAwards = React.lazy(() =>
  import('../pages/admin/AdminPartnersAwards').then((m) => ({ default: m.AdminPartnersAwards }))
);
const AdminTestimonials = React.lazy(() =>
  import('../pages/admin/AdminTestimonials').then((m) => ({ default: m.AdminTestimonials }))
);
const AdminContactSettings = React.lazy(() =>
  import('../pages/admin/AdminContactSettings').then((m) => ({ default: m.AdminContactSettings }))
);
const AdminInsights = React.lazy(() =>
  import('../pages/admin/AdminInsights').then((m) => ({ default: m.AdminInsights }))
);
const AdminInsightEditor = React.lazy(() =>
  import('../pages/admin/AdminInsightEditor').then((m) => ({ default: m.AdminInsightEditor }))
);
const AdminStatistics = React.lazy(() =>
  import('../pages/admin/AdminStatistics').then((m) => ({ default: m.AdminStatistics }))
);
const AdminMedia = React.lazy(() =>
  import('../pages/admin/AdminMedia').then((m) => ({ default: m.AdminMedia }))
);
const AdminUsers = React.lazy(() =>
  import('../pages/admin/AdminUsers').then((m) => ({ default: m.AdminUsers }))
);
const AdminAuditLogs = React.lazy(() =>
  import('../pages/admin/AdminAuditLogs').then((m) => ({ default: m.AdminAuditLogs }))
);
const AdminAccount = React.lazy(() =>
  import('../pages/admin/AdminAccount').then((m) => ({ default: m.AdminAccount }))
);

import { useSearchParams } from 'react-router-dom';

const ContactRedirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const nextParams = new URLSearchParams(searchParams);
  nextParams.set('contact', 'open');
  return <Navigate to={`/?${nextParams.toString()}`} replace />;
};

const AdminLoader: React.FC = () => (
  <div
    data-testid="admin-chunk-loader"
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#071B30',
      color: '#FFFFFF',
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <div
        style={{
          width: '32px',
          height: '32px',
          border: '3px solid rgba(255, 255, 255, 0.15)',
          borderTopColor: '#D9232D',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span
        style={{
          fontSize: '11px',
          letterSpacing: '0.12em',
          color: '#8A949D',
          textTransform: 'uppercase',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        Loading Administration...
      </span>
    </div>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <TrailingSlashRedirect>
      <Routes>
        {/* ========================================================= */}
        {/* 1. Legacy URL Redirects                                   */}
        {/* ========================================================= */}
        <Route path="/about" element={<Navigate to="/about-us" replace />} />
        <Route path="/contact" element={<ContactRedirect />} />
        <Route path="/mutual-funds" element={<Navigate to="/investments/mutual-funds" replace />} />
        <Route path="/equity" element={<Navigate to="/investments/equity" replace />} />
        <Route path="/general-insurance" element={<Navigate to="/services/general-insurance" replace />} />
        <Route path="/life-insurance" element={<Navigate to="/services/life-insurance" replace />} />
        <Route path="/health-insurance" element={<Navigate to="/services/health-insurance" replace />} />
        <Route path="/rohini" element={<Navigate to="/services/rohini-cashless-empanelment" replace />} />
        <Route path="/rohini-cashless-empanelment" element={<Navigate to="/services/rohini-cashless-empanelment" replace />} />
        <Route path="/investments" element={<Navigate to="/services" replace />} />
        <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
        <Route path="/terms" element={<Navigate to="/terms-and-conditions" replace />} />

        {/* Insights legacy slug redirects */}
        <Route path="/insights/mutual-funds-direct-vs-regular" element={<Navigate to="/insights/mutual-funds-direct-vs-regular-plan" replace />} />
        <Route path="/insights/what-nav-means" element={<Navigate to="/insights/what-is-nav" replace />} />
        <Route path="/insights/how-sips-work" element={<Navigate to="/insights/sips-how-they-work" replace />} />
        <Route path="/insights/choosing-health-insurance" element={<Navigate to="/insights/questions-before-choosing-health-insurance" replace />} />
        <Route path="/insights/policy-exclusions-waiting-periods" element={<Navigate to="/insights/how-to-review-policy-exclusions-and-waiting-periods" replace />} />

        {/* ========================================================= */}
        {/* 2. Public Routes (PublicLayout)                           */}
        {/* ========================================================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/general-insurance" element={<GeneralInsurance />} />
          <Route path="/services/life-insurance" element={<LifeInsurance />} />
          <Route path="/services/health-insurance" element={<HealthInsurance />} />
          <Route path="/services/rohini-cashless-empanelment" element={<RohiniCashlessEmpanelment />} />
          <Route path="/investments/mutual-funds" element={<MutualFunds />} />
          <Route path="/investments/equity" element={<Equity />} />
          <Route path="/investments/other-solutions" element={<OtherSolutions />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:slug" element={<InsightArticle />} />
          <Route path="/contact-us" element={<ContactRedirect />} />
          <Route path="/enquiry/thank-you" element={<EnquiryThankYou />} />
          <Route path="/privacy-policy" element={<LegalPage />} />
          <Route path="/terms-and-conditions" element={<LegalPage />} />
          <Route path="/disclosures" element={<LegalPage />} />
          <Route path="/complaints" element={<LegalPage />} />

          {/* Dev-only route */}
          {import.meta.env.DEV && (
            <Route path="/dev/data-register" element={<DataRegisterPage />} />
          )}

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ========================================================= */}
        {/* 3. Admin Auth Routes (Public login/password reset)        */}
        {/* ========================================================= */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminLoader />}>
              <AdminLogin defaultTab="login" />
            </Suspense>
          }
        />
        <Route
          path="/admin/signup"
          element={
            <Suspense fallback={<AdminLoader />}>
              <AdminSignUp />
            </Suspense>
          }
        />
        <Route
          path="/admin/register"
          element={
            <Suspense fallback={<AdminLoader />}>
              <AdminSignUp />
            </Suspense>
          }
        />
        <Route
          path="/admin/forgot-password"
          element={
            <Suspense fallback={<AdminLoader />}>
              <AdminForgotPassword />
            </Suspense>
          }
        />
        <Route
          path="/admin/reset-password/:token"
          element={
            <Suspense fallback={<AdminLoader />}>
              <AdminResetPassword />
            </Suspense>
          }
        />

        {/* ========================================================= */}
        {/* 4. Protected Admin Routes (RequireAuth Guard)             */}
        {/* ========================================================= */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <Suspense fallback={<AdminLoader />}>
                <AdminLayout />
              </Suspense>
            </RequireAuth>
          }
        >
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminDashboard />
              </Suspense>
            }
          />

          {/* Leads */}
          <Route
            path="leads"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminLeads />
              </Suspense>
            }
          />
          <Route
            path="leads/:leadId"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminLeads />
              </Suspense>
            }
          />

          {/* Follow-ups */}
          <Route
            path="followups"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminFollowups />
              </Suspense>
            }
          />

          {/* Reports (Admin only) */}
          <Route
            path="reports"
            element={
              <RequireRole role="admin">
                <Suspense fallback={<AdminLoader />}>
                  <AdminReports />
                </Suspense>
              </RequireRole>
            }
          />

          {/* Content Pages */}
          <Route
            path="content/pages"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminContentPages />
              </Suspense>
            }
          />
          <Route
            path="content/pages/:pageKey"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminPageEditor />
              </Suspense>
            }
          />

          {/* Other Content Screens */}
          <Route
            path="content/faqs"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminFaqs />
              </Suspense>
            }
          />
          <Route
            path="content/team"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminTeam />
              </Suspense>
            }
          />
          <Route
            path="content/partners"
            element={
              <RequireRole role="admin">
                <Suspense fallback={<AdminLoader />}>
                  <AdminPartnersAwards />
                </Suspense>
              </RequireRole>
            }
          />
          <Route
            path="content/achievements"
            element={
              <RequireRole role="admin">
                <Suspense fallback={<AdminLoader />}>
                  <AdminPartnersAwards />
                </Suspense>
              </RequireRole>
            }
          />
          <Route
            path="content/testimonials"
            element={
              <RequireRole role="admin">
                <Suspense fallback={<AdminLoader />}>
                  <AdminTestimonials />
                </Suspense>
              </RequireRole>
            }
          />
          <Route
            path="content/contact"
            element={
              <RequireRole role="admin">
                <Suspense fallback={<AdminLoader />}>
                  <AdminContactSettings />
                </Suspense>
              </RequireRole>
            }
          />
          <Route
            path="content/insights"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminInsights />
              </Suspense>
            }
          />
          <Route
            path="content/insights/:insightId"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminInsightEditor />
              </Suspense>
            }
          />

          {/* Statistics (Tier A/B/C gating) */}
          <Route
            path="statistics"
            element={
              <RequireRole role="admin">
                <Suspense fallback={<AdminLoader />}>
                  <AdminStatistics />
                </Suspense>
              </RequireRole>
            }
          />

          {/* Media */}
          <Route
            path="media"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminMedia />
              </Suspense>
            }
          />

          {/* Users & Roles (Admin only) */}
          <Route
            path="users"
            element={
              <RequireRole role="admin">
                <Suspense fallback={<AdminLoader />}>
                  <AdminUsers />
                </Suspense>
              </RequireRole>
            }
          />
          <Route
            path="users/:userId"
            element={
              <RequireRole role="admin">
                <Suspense fallback={<AdminLoader />}>
                  <AdminUsers />
                </Suspense>
              </RequireRole>
            }
          />

          {/* Audit Logs (Admin only) */}
          <Route
            path="audit-logs"
            element={
              <RequireRole role="admin">
                <Suspense fallback={<AdminLoader />}>
                  <AdminAuditLogs />
                </Suspense>
              </RequireRole>
            }
          />

          {/* Account */}
          <Route
            path="account"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminAccount />
              </Suspense>
            }
          />

          {/* Admin 404 */}
          <Route
            path="*"
            element={
              <div className="card" style={{ padding: '2rem', backgroundColor: '#0A2540', color: '#fff' }}>
                <h3>Admin Page Not Found</h3>
                <p>The requested administrative screen does not exist.</p>
              </div>
            }
          />
        </Route>
      </Routes>
    </TrailingSlashRedirect>
  );
};
