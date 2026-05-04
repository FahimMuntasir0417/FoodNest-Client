import { NextRequest, NextResponse } from "next/server";

import { canAccessPath, getDashboardPath } from "./lib/auth";
import { getSession } from "./services/auth.service";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const { data } = await getSession();

  // Not authenticated
  if (!data?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role from session ✅
  const role = data.user.role;

  // Authenticated but wrong dashboard
  if (!canAccessPath(role, pathname)) {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/customer-dashboard",
    "/customer-dashboard/:path*",
    "/provider-dashboard",
    "/provider-dashboard/:path*",
    "/admin-dashboard",
    "/admin-dashboard/:path*",
  ],
};
