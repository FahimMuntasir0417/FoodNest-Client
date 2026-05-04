import type { DashboardRole, UserRole } from "@/features/auth/types/auth.types";

const dashboardPaths: Record<UserRole, string> = {
  ADMIN: "/admin-dashboard",
  PROVIDER: "/provider-dashboard",
  CUSTOMER: "/customer-dashboard",
};

export function normalizeRole(role?: string | null): UserRole | undefined {
  const value = role?.toUpperCase();

  if (value === "ADMIN" || value === "PROVIDER" || value === "CUSTOMER") {
    return value;
  }

  return undefined;
}

export function toDashboardRole(role?: UserRole): DashboardRole {
  return (role ?? "CUSTOMER").toLowerCase() as DashboardRole;
}

export function getDashboardPath(role?: string | null) {
  const normalized = normalizeRole(role) ?? "CUSTOMER";
  return dashboardPaths[normalized];
}

export function canManageMeals(role?: string | null) {
  const normalized = normalizeRole(role);
  return normalized === "ADMIN" || normalized === "PROVIDER";
}

export function canManageUsers(role?: string | null) {
  return normalizeRole(role) === "ADMIN";
}

export function canAccessDashboard(
  role: string | null | undefined,
  dashboard: DashboardRole,
) {
  const normalized = normalizeRole(role);
  if (!normalized) return false;

  if (dashboard === "admin") return normalized === "ADMIN";
  if (dashboard === "provider") return normalized === "PROVIDER";
  return normalized === "CUSTOMER";
}

export function canAccessPath(role: string | null | undefined, pathname: string) {
  if (pathname.startsWith("/admin-dashboard")) {
    return canAccessDashboard(role, "admin");
  }

  if (pathname.startsWith("/provider-dashboard")) {
    return canAccessDashboard(role, "provider");
  }

  if (pathname.startsWith("/customer-dashboard")) {
    return canAccessDashboard(role, "customer");
  }

  return true;
}
