import { NextRequest, NextResponse } from "next/server";

import { env } from "@/config/env";

const authBackendUrl = (
  env.AUTH_URL ??
  (env.BACKEND_URL ? `${env.BACKEND_URL.replace(/\/$/, "")}/api/auth` : "")
).replace(/\/$/, "");

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

function getSetCookieHeaders(headers: Headers) {
  const withGetSetCookie = headers as Headers & {
    getSetCookie?: () => string[];
  };

  return withGetSetCookie.getSetCookie?.() ?? [];
}

function isLocalRequest(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  return (
    request.nextUrl.protocol === "http:" &&
    (host.startsWith("localhost") || host.startsWith("127.0.0.1"))
  );
}

function rewriteLocalCookie(cookie: string) {
  return cookie
    .replace(/;\s*Secure/gi, "")
    .replace(/;\s*SameSite=None/gi, "; SameSite=Lax")
    .replace(/;\s*Domain=[^;]+/gi, "");
}

function buildHeaders(request: NextRequest) {
  const headers = new Headers(request.headers);
  const forwardedHost =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const forwardedProto =
    request.headers.get("x-forwarded-proto") ??
    request.nextUrl.protocol.replace(":", "");

  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");

  if (forwardedHost) {
    headers.set("x-forwarded-host", forwardedHost);
  }

  headers.set("x-forwarded-proto", forwardedProto);
  headers.set("x-forwarded-origin", request.nextUrl.origin);

  return headers;
}

async function proxyAuth(request: NextRequest, context: RouteContext) {
  if (!authBackendUrl) {
    return NextResponse.json(
      { message: "Missing AUTH_URL or BACKEND_URL." },
      { status: 500 },
    );
  }

  const { path = [] } = await context.params;
  const target = new URL(`${authBackendUrl}/${path.join("/")}`);
  target.search = request.nextUrl.search;

  const upstream = await fetch(target, {
    method: request.method,
    headers: buildHeaders(request),
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : request.body,
    cache: "no-store",
    redirect: "manual",
    duplex: "half",
  } as RequestInit & { duplex: "half" });

  const headers = new Headers(upstream.headers);
  const setCookies = getSetCookieHeaders(upstream.headers);

  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.delete("set-cookie");
  headers.delete("transfer-encoding");

  const response = new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });

  for (const cookie of setCookies) {
    response.headers.append(
      "set-cookie",
      isLocalRequest(request) ? rewriteLocalCookie(cookie) : cookie,
    );
  }

  return response;
}

export const GET = proxyAuth;
export const POST = proxyAuth;
export const PUT = proxyAuth;
export const PATCH = proxyAuth;
export const DELETE = proxyAuth;
export const OPTIONS = proxyAuth;
