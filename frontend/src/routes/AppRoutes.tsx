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
import { AdminLogin, AdminForgotPassword, AdminResetPassword } from '../pages/admin/AdminAuthPages';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminPlaceholder } from '../pages/admin/AdminPlaceholder';

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
        {/* 1. Structure.md Section 3.5 Redirects                     */}
        {/* ========================================================= */}
        <Route path="/about" element={<Navigate to="/about-us" replace />} />
        <Route path="/contact" element={<ContactRedirect />} />
        <Route path="/mutual-funds" element={<Navigate to="/investments/mutual-funds" replace />} />
        <Route path="/equity" element={<Navigate to="/investments/equity" replace />} />
        <Route path="/general-insurance" element={<Navigate to="/services/general-insurance" replace />} />
        <Route path="/life-insurance" element={<Navigate to="/services/life-insurance" replace />} />
        <Route path="/health-insurance" element={<Navigate to="/services/health-insurance" replace />} />
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
        <Route path="/admin/login" element={<AdminLogin />} />
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
          <Route
            path="leads"
            element={
              <AdminPlaceholder
                title="Enquiries & Leads Management"
                description="View, filter, sort and assign incoming enquiries from public forms."
                todos={[
                  'Integrate GET /api/v1/admin/leads with filters (service, status, assigned, date range, search).',
                  'Add status transition pipeline: new -> contacted -> qualified -> in-progress -> converted / closed.',
                  'Implement CSV export button guarded by export permission.',
                ]}
              />
            }
          />
          <Route
            path="leads/:leadId"
            element={
              <AdminPlaceholder
                title="Lead Detail View"
                description="Examine customer contact details, interest category, and audit activity."
                todos={[
                  'Fetch lead details from GET /api/v1/admin/leads/{lead_id}.',
                  'Provide notes thread with POST /api/v1/admin/leads/{lead_id}/notes.',
                  'Add schedule follow-up modal with POST /api/v1/admin/leads/{lead_id}/followups.',
                ]}
              />
            }
          />

          {/* Follow-ups */}
          <Route
            path="followups"
            element={
              <AdminPlaceholder
                title="Scheduled Follow-ups"
                description="Manage upcoming calls and client consultations."
                todos={[
                  'Wire GET /api/v1/admin/followups to list pending calls for staff/admin.',
                  'Add complete/reschedule actions via PATCH /api/v1/admin/followups/{id}.',
                ]}
              />
            }
          />

          {/* Reports (Admin only) */}
          <Route
            path="reports"
            element={
              <RequireRole role="admin">
                <AdminPlaceholder
                  title="Performance & Conversion Reports"
                  description="Enquiry volume metrics grouped by service and campaign source."
                  todos={[
                    'Render charts for GET /api/v1/admin/reports/services and /reports/conversion.',
                    'Add date range picker and CSV export.',
                  ]}
                />
              </RequireRole>
            }
          />

          {/* Content Pages */}
          <Route
            path="content/pages"
            element={
              <AdminPlaceholder
                title="CMS Page Management"
                description="List of website pages and their publishing states."
                todos={[
                  'List pages from GET /api/v1/admin/content/pages.',
                  'Display draft vs published status and last updated timestamps.',
                ]}
              />
            }
          />
          <Route
            path="content/pages/:pageKey"
            element={
              <AdminPlaceholder
                title="Edit Page Content"
                description="Manage sections, copy, and SEO metadata."
                todos={[
                  'Fetch page draft with GET /api/v1/admin/content/pages/{page_key}.',
                  'Save draft via PUT /api/v1/admin/content/pages/{page_key}.',
                  'Generate short-lived preview token via POST /api/v1/admin/content/pages/{page_key}/preview-token.',
                  'Publish draft via POST /api/v1/admin/content/pages/{page_key}/publish (admin only).',
                ]}
              />
            }
          />

          {/* Other Content Screens */}
          <Route
            path="content/faqs"
            element={
              <AdminPlaceholder
                title="FAQ Management"
                description="Add and edit questions displayed on public service pages."
                todos={['Implement CRUD for /api/v1/admin/content/faqs.']}
              />
            }
          />
          <Route
            path="content/team"
            element={
              <AdminPlaceholder
                title="Team Profiles"
                description="Manage leadership bios, designations, and verified credentials."
                todos={['Implement CRUD for /api/v1/admin/content/team.']}
              />
            }
          />
          <Route
            path="content/partners"
            element={
              <RequireRole role="admin">
                <AdminPlaceholder
                  title="Partners & Insurers"
                  description="Manage empanelled insurer names and relationship labels."
                  todos={['Implement CRUD for /api/v1/admin/content/partners.']}
                />
              </RequireRole>
            }
          />
          <Route
            path="content/achievements"
            element={
              <RequireRole role="admin">
                <AdminPlaceholder
                  title="Awards & Achievements"
                  description="Verified industry awards and issuer records."
                  todos={['Implement CRUD for /api/v1/admin/content/achievements.']}
                />
              </RequireRole>
            }
          />
          <Route
            path="content/testimonials"
            element={
              <RequireRole role="admin">
                <AdminPlaceholder
                  title="Client Testimonials"
                  description="Consented client reviews with compliance approval flag."
                  todos={['Implement CRUD for /api/v1/admin/content/testimonials.']}
                />
              </RequireRole>
            }
          />
          <Route
            path="content/contact"
            element={
              <RequireRole role="admin">
                <AdminPlaceholder
                  title="Office & Contact Settings"
                  description="Configure phone numbers, address, and office operating hours."
                  todos={['Implement GET/PUT /api/v1/admin/content/contact.']}
                />
              </RequireRole>
            }
          />
          <Route
            path="content/insights"
            element={
              <AdminPlaceholder
                title="Insights Articles"
                description="Create and publish educational articles."
                todos={['Implement listing and CRUD for /api/v1/admin/content/insights.']}
              />
            }
          />
          <Route
            path="content/insights/:insightId"
            element={
              <AdminPlaceholder
                title="Edit Insight Article"
                description="Markdown and WYSIWYG editor for educational articles."
                todos={['Wire article editor with preview.']}
              />
            }
          />

          {/* Media */}
          <Route
            path="media"
            element={
              <AdminPlaceholder
                title="Media Library"
                description="Upload and organise logos, certificates, and photography."
                todos={[
                  'Implement file upload to /api/v1/admin/media with MIME validation.',
                  'Add alt-text editor and image preview modal.',
                ]}
              />
            }
          />

          {/* Users & Roles (Admin only) */}
          <Route
            path="users"
            element={
              <RequireRole role="admin">
                <AdminPlaceholder
                  title="Users & Permissions"
                  description="Manage staff accounts and administrative permissions."
                  todos={[
                    'List users via GET /api/v1/admin/users.',
                    'Invite staff via POST /api/v1/admin/users.',
                  ]}
                />
              </RequireRole>
            }
          />
          <Route
            path="users/:userId"
            element={
              <RequireRole role="admin">
                <AdminPlaceholder
                  title="User Detail & Role Assignment"
                  description="Configure granular permissions for staff member."
                  todos={['Implement PATCH /api/v1/admin/users/{user_id}.']}
                />
              </RequireRole>
            }
          />

          {/* Audit Logs (Admin only) */}
          <Route
            path="audit-logs"
            element={
              <RequireRole role="admin">
                <AdminPlaceholder
                  title="System Audit Logs"
                  description="Immutable trail of administrative changes, lead exports, and logins."
                  todos={['Render audit trail from GET /api/v1/admin/audit-logs.']}
                />
              </RequireRole>
            }
          />

          {/* Account */}
          <Route
            path="account"
            element={
              <AdminPlaceholder
                title="My Account Settings"
                description="Update password and view active sessions."
                todos={['Wire change-password with POST /api/v1/auth/change-password.']}
              />
            }
          />

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

