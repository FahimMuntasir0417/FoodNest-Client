import { NextRequest, NextResponse } from "next/server";

import { Roles } from "./constants/role";
import { getSession } from "./services/auth.service";

function getDashboardPath(role?: Roles) {
  switch (role) {
    case Roles.ADMIN:
      return "/admin-dashboard";
    case Roles.PROVIDER:
      return "/provider-dashboard";
    case Roles.CUSTOMER:
    default:
      return "/customer-dashboard";
  }
}

function isAllowed(role: Roles | undefined, pathname: string) {
  if (pathname.startsWith("/admin-dashboard")) return role === Roles.ADMIN;
  if (pathname.startsWith("/provider-dashboard"))
    return role === Roles.PROVIDER;
  if (pathname.startsWith("/customer-dashboard"))
    return role === Roles.CUSTOMER;
  return true;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const { data } = await getSession();

  // Not authenticated
  if (!data?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role from session ✅
  const role = data.user.role as Roles;

  // Authenticated but wrong dashboard
  if (!isAllowed(role, pathname)) {
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
