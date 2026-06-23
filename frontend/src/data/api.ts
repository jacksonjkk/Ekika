import { useEffect, useState } from "react";

const configuredApiBase = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const isLocalDevelopmentApi = /^http:\/\/(?:127\.0\.0\.1|localhost):4000$/.test(configuredApiBase);
const API_BASE = import.meta.env.PROD ? "" : isLocalDevelopmentApi ? "" : configuredApiBase;
const ADMIN_TOKEN_KEY = "ekika-admin-token";

type ApiOptions = RequestInit & {
  admin?: boolean;
};

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  if (options.admin) {
    const token = getAdminToken();
    if (!token) throw new Error("Admin authentication required");
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, { credentials: "include", ...options, headers });
  const payload = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    if (options.admin && response.status === 401) clearAdminToken();
    const message = payload?.error ?? `API request failed (${response.status})`;
    const reference = response.status >= 500 && payload?.requestId ? ` Reference: ${payload.requestId}` : "";
    throw new Error(`${message}${reference}`);
  }
  return payload as T;
}

export async function loginAdmin(email: string, password: string) {
  const result = await apiRequest<{ token: string; expiresIn: number }>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  window.sessionStorage.setItem(ADMIN_TOKEN_KEY, result.token);
  window.dispatchEvent(new Event("ekika-admin-auth-updated"));
  return result;
}

export async function updateAdminSettings(currentPassword: string, newEmail?: string, newPassword?: string) {
  return await apiRequest<{ success: boolean }>("/api/admin/settings", {
    admin: true,
    method: "PUT",
    body: JSON.stringify({ currentPassword, newEmail, newPassword }),
  });
}

export type AuditLog = {
  id: string;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details: any;
  createdAt: string;
};

export async function getAuditLogs() {
  return await apiRequest<{ logs: AuditLog[] }>("/api/admin/audit-logs", {
    admin: true,
  });
}

export type Review = {
  id: string;
  reviewerName: string;
  reviewerPhoto: string;
  experienceTitle: string;
  rating: number;
  comment: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ReviewDraft = Omit<Review, "id" | "createdAt" | "updatedAt">;

export async function getPublicReviews() {
  return await apiRequest<{ reviews: Review[] }>("/api/reviews");
}

export async function getAdminReviews() {
  return await apiRequest<{ reviews: Review[] }>("/api/admin/reviews", { admin: true });
}

export async function createReview(draft: ReviewDraft) {
  return await apiRequest<{ review: Review }>("/api/admin/reviews", {
    admin: true,
    method: "POST",
    body: JSON.stringify(draft),
  });
}

export async function updateReview(id: string, draft: ReviewDraft) {
  return await apiRequest<{ review: Review }>(`/api/admin/reviews/${id}`, {
    admin: true,
    method: "PUT",
    body: JSON.stringify(draft),
  });
}

export async function deleteReview(id: string) {
  return await apiRequest<null>(`/api/admin/reviews/${id}`, {
    admin: true,
    method: "DELETE",
  });
}

export function getAdminToken() {
  return window.sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function clearAdminToken() {
  window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  window.dispatchEvent(new Event("ekika-admin-auth-updated"));
}

export function hasAdminToken() {
  const token = getAdminToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof payload.exp === "number" && payload.exp * 1000 > Date.now()) return true;
  } catch {
    // Invalid tokens are removed below.
  }
  window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  return false;
}

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(hasAdminToken);

  useEffect(() => {
    function refresh() {
      setIsAdmin(hasAdminToken());
    }
    window.addEventListener("ekika-admin-auth-updated", refresh);
    return () => window.removeEventListener("ekika-admin-auth-updated", refresh);
  }, []);

  return isAdmin;
}

export type CustomerRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export async function registerCustomer(name: string, email: string, password: string, phone: string) {
  const result = await apiRequest<{ customer: CustomerRecord }>("/api/customer/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, phone }),
  });
  window.sessionStorage.setItem("ekika-customer", JSON.stringify(result.customer));
  window.dispatchEvent(new Event("ekika-customer-auth-updated"));
  return result.customer;
}

export async function loginCustomer(email: string, password: string) {
  const result = await apiRequest<{ customer: CustomerRecord }>("/api/customer/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  window.sessionStorage.setItem("ekika-customer", JSON.stringify(result.customer));
  window.dispatchEvent(new Event("ekika-customer-auth-updated"));
  return result.customer;
}

export async function logoutCustomer() {
  window.sessionStorage.removeItem("ekika-customer");
  window.localStorage.removeItem("ekika-bookings");
  window.dispatchEvent(new Event("ekika-customer-auth-updated"));
  window.dispatchEvent(new Event("ekika-bookings-updated"));
  await apiRequest("/api/customer/logout", { method: "POST" }).catch(() => undefined);
}

export function getCachedCustomer(): CustomerRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem("ekika-customer");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function fetchCustomerProfile() {
  const customerAtRequestStart = getCachedCustomer();
  try {
    const result = await apiRequest<{ customer: CustomerRecord }>("/api/customer/profile");
    window.sessionStorage.setItem("ekika-customer", JSON.stringify(result.customer));
    window.dispatchEvent(new Event("ekika-customer-auth-updated"));
    return result.customer;
  } catch (error) {
    const currentCustomer = getCachedCustomer();
    if (customerAtRequestStart && currentCustomer?.id === customerAtRequestStart.id) {
      window.sessionStorage.removeItem("ekika-customer");
      window.dispatchEvent(new Event("ekika-customer-auth-updated"));
    }
    throw error;
  }
}

let customerSessionRequest: Promise<CustomerRecord | null> | null = null;

export function fetchCustomerSession() {
  if (customerSessionRequest) return customerSessionRequest;

  customerSessionRequest = apiRequest<{ customer: CustomerRecord | null }>("/api/customer/session")
    .then(({ customer }) => {
      if (customer) window.sessionStorage.setItem("ekika-customer", JSON.stringify(customer));
      else window.sessionStorage.removeItem("ekika-customer");
      window.dispatchEvent(new Event("ekika-customer-auth-updated"));
      return customer;
    })
    .finally(() => {
      customerSessionRequest = null;
    });

  return customerSessionRequest;
}

export function hasCustomerSession() {
  return Boolean(getCachedCustomer());
}

export function useCustomer() {
  const [customer, setCustomer] = useState<CustomerRecord | null>(getCachedCustomer);

  useEffect(() => {
    function refresh() {
      setCustomer(getCachedCustomer());
    }

    window.addEventListener("ekika-customer-auth-updated", refresh);
    
    // Restore or clear the cached customer without producing an expected 401 while logged out.
    fetchCustomerSession().catch(() => {
      // If error, session cookie is invalid, user will be logged out dynamically
    });

    return () => {
      window.removeEventListener("ekika-customer-auth-updated", refresh);
    };
  }, []);

  return customer;
}
