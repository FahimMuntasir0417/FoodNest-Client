import { cookies } from "next/headers";

import { authBaseUrl } from "@/config/env";
import { parseJsonSafe } from "@/lib/api";
import type { AuthResponse } from "@/lib/auth.types";

export async function getCookieHeader(): Promise<string> {
  const store = await cookies();
  return store
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
}

export async function getCookieHeaders(): Promise<Record<string, string>> {
  const cookie = await getCookieHeader();
  return cookie ? { cookie } : {};
}

export async function getSession(): Promise<AuthResponse | null> {
  try {
    const cookie = await getCookieHeader();

    const res = await fetch(`${authBaseUrl}/get-session`, {
      method: "GET",
      headers: {
        cookie,
        accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    return (await parseJsonSafe(res)) as AuthResponse | null;
  } catch {
    return null;
  }
}

export {
  canAccessDashboard,
  canAccessPath,
  canManageMeals,
  canManageUsers,
  getDashboardPath,
  normalizeRole,
  toDashboardRole,
} from "@/features/auth/services/permissions";
