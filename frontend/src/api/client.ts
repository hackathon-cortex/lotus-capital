/**
 * Lotus Capital — Official Frontend API Client
 * Compatible with React + Vite + TypeScript
 * Configured to consume VITE_API_URL
 */

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:8000/api/v1";

export interface EnquiryPayload {
  name: string;
  mobile: string;
  email?: string;
  contact_method: "phone" | "email" | "whatsapp";
  service_detail: string[];
  message?: string;
  consent: boolean;
}

export interface EnquiryResponse {
  success: boolean;
  message: string;
  data: {
    reference_id: string;
    status: string;
  };
}

export interface StatisticItem {
  statistic_key: string;
  label: string;
  value: string;
  definition?: string;
  as_of_date?: string;
}

export interface ServiceItem {
  slug: string;
  title: string;
  short_description: string;
  icon?: string;
  order: number;
  active: boolean;
}

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem("lotus_access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // --- Public APIs ---

  async checkHealth() {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.json();
  }

  async submitEnquiry(payload: EnquiryPayload): Promise<EnquiryResponse> {
    const res = await fetch(`${API_BASE_URL}/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to submit enquiry.");
    }
    return data;
  }

  async verifyEnquiryRef(refId: string) {
    const res = await fetch(`${API_BASE_URL}/enquiries/verify-ref/${encodeURIComponent(refId)}`);
    return res.json();
  }

  async getServices(): Promise<ServiceItem[]> {
    const res = await fetch(`${API_BASE_URL}/services`);
    const json = await res.json();
    return json.data || [];
  }

  async getPublicStatistics(): Promise<StatisticItem[]> {
    const res = await fetch(`${API_BASE_URL}/statistics`);
    const json = await res.json();
    return json.data || [];
  }

  async getPage(slug: string) {
    const res = await fetch(`${API_BASE_URL}/content/pages/${encodeURIComponent(slug)}`);
    return res.json();
  }

  async getInsights() {
    const res = await fetch(`${API_BASE_URL}/content/insights`);
    return res.json();
  }

  async getInsight(slug: string) {
    const res = await fetch(`${API_BASE_URL}/content/insights/${encodeURIComponent(slug)}`);
    return res.json();
  }

  async getContactInfo() {
    const res = await fetch(`${API_BASE_URL}/contact`);
    return res.json();
  }

  async getFaqs() {
    const res = await fetch(`${API_BASE_URL}/faqs`);
    return res.json();
  }

  // --- Authentication APIs ---

  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Login failed.");
    }
    localStorage.setItem("lotus_access_token", data.access_token);
    localStorage.setItem("lotus_refresh_token", data.refresh_token);
    return data;
  }

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeader(),
    });
    return res.json();
  }

  async changePassword(old_password: string, new_password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ old_password, new_password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Password change failed.");
    }
    return data;
  }

  async forgotPassword(email: string) {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return res.json();
  }

  async resetPassword(token: string, new_password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, new_password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Password reset failed.");
    }
    return data;
  }

  async logout() {
    const refreshToken = localStorage.getItem("lotus_refresh_token");
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
        body: JSON.stringify({ refresh_token: refreshToken || "" }),
      });
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem("lotus_access_token");
      localStorage.removeItem("lotus_refresh_token");
    }
  }

  // --- Admin APIs ---

  async getAdminDashboard() {
    const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: this.getAuthHeader(),
    });
    return res.json();
  }

  async getAdminEnquiries(page = 1, search = "", status = "") {
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.append("search", search);
    if (status) params.append("status", status);

    const res = await fetch(`${API_BASE_URL}/admin/enquiries?${params.toString()}`, {
      headers: this.getAuthHeader(),
    });
    return res.json();
  }

  async updateAdminEnquiry(id: number, payload: { status?: string; admin_notes?: string; assigned_to?: number }) {
    const res = await fetch(`${API_BASE_URL}/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  async getAdminStatistics() {
    const res = await fetch(`${API_BASE_URL}/admin/statistics`, {
      headers: this.getAuthHeader(),
    });
    return res.json();
  }

  async updateAdminStatistic(id: number, payload: any) {
    const res = await fetch(`${API_BASE_URL}/admin/statistics/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  }
}

export const api = new ApiClient();

