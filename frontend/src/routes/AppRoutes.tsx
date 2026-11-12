import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';
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

// Admin pages
import { AdminLogin, AdminSignUp, AdminForgotPassword, AdminResetPassword } from '../pages/admin/AdminAuthPages';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminLeads } from '../pages/admin/AdminLeads';
import { AdminFollowups } from '../pages/admin/AdminFollowups';
import { AdminReports } from '../pages/admin/AdminReports';
import { AdminContentPages } from '../pages/admin/AdminContentPages';
import { AdminPageEditor } from '../pages/admin/AdminPageEditor';
import { AdminFaqs } from '../pages/admin/AdminFaqs';
import { AdminTeam } from '../pages/admin/AdminTeam';
import { AdminPartnersAwards } from '../pages/admin/AdminPartnersAwards';
import { AdminTestimonials } from '../pages/admin/AdminTestimonials';
import { AdminContactSettings } from '../pages/admin/AdminContactSettings';
import { AdminInsights } from '../pages/admin/AdminInsights';
import { AdminInsightEditor } from '../pages/admin/AdminInsightEditor';
import { AdminStatistics } from '../pages/admin/AdminStatistics';
import { AdminMedia } from '../pages/admin/AdminMedia';
import { AdminUsers } from '../pages/admin/AdminUsers';
import { AdminAuditLogs } from '../pages/admin/AdminAuditLogs';
import { AdminAccount } from '../pages/admin/AdminAccount';

import { useSearchParams } from 'react-router-dom';

const ContactRedirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const nextParams = new URLSearchParams(searchParams);
  nextParams.set('contact', 'open');
  return <Navigate to={`/?${nextParams.toString()}`} replace />;
};

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
        {/* 3. Admin Auth Routes                                      */}
        {/* ========================================================= */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<AdminLogin defaultTab="login" />} />
        <Route path="/admin/signup" element={<AdminSignUp />} />
        <Route path="/admin/register" element={<AdminSignUp />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/reset-password/:token" element={<AdminResetPassword />} />

        {/* ========================================================= */}
        {/* 4. Protected Admin Routes (AdminLayout)                   */}
        {/* ========================================================= */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Leads */}
          <Route path="leads" element={<AdminLeads />} />
          <Route path="leads/:leadId" element={<AdminLeads />} />

          {/* Follow-ups */}
          <Route path="followups" element={<AdminFollowups />} />

          {/* Reports (Admin only) */}
          <Route
            path="reports"
            element={
              <RequireRole role="admin">
                <AdminReports />
              </RequireRole>
            }
          />

          {/* Content Pages */}
          <Route path="content/pages" element={<AdminContentPages />} />
          <Route path="content/pages/:pageKey" element={<AdminPageEditor />} />

          {/* Other Content Screens */}
          <Route path="content/faqs" element={<AdminFaqs />} />
          <Route path="content/team" element={<AdminTeam />} />
          <Route
            path="content/partners"
            element={
              <RequireRole role="admin">
                <AdminPartnersAwards />
              </RequireRole>
            }
          />
          <Route
            path="content/achievements"
            element={
              <RequireRole role="admin">
                <AdminPartnersAwards />
              </RequireRole>
            }
          />
          <Route
            path="content/testimonials"
            element={
              <RequireRole role="admin">
                <AdminTestimonials />
              </RequireRole>
            }
          />
          <Route
            path="content/contact"
            element={
              <RequireRole role="admin">
                <AdminContactSettings />
              </RequireRole>
            }
          />
          <Route path="content/insights" element={<AdminInsights />} />
          <Route path="content/insights/:insightId" element={<AdminInsightEditor />} />

          {/* Statistics (Tier A/B/C gating) */}
          <Route
            path="statistics"
            element={
              <RequireRole role="admin">
                <AdminStatistics />
              </RequireRole>
            }
          />

          {/* Media */}
          <Route path="media" element={<AdminMedia />} />

          {/* Users & Roles (Admin only) */}
          <Route
            path="users"
            element={
              <RequireRole role="admin">
                <AdminUsers />
              </RequireRole>
            }
          />
          <Route
            path="users/:userId"
            element={
              <RequireRole role="admin">
                <AdminUsers />
              </RequireRole>
            }
          />

          {/* Audit Logs (Admin only) */}
          <Route
            path="audit-logs"
            element={
              <RequireRole role="admin">
                <AdminAuditLogs />
              </RequireRole>
            }
          />

          {/* Account */}
          <Route path="account" element={<AdminAccount />} />

          {/* Admin 404 */}
          <Route
            path="*"
            element={
              <div className="card" style={{ padding: '2rem' }}>
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

