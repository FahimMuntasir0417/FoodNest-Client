import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const url = z.string().url();

export const env = createEnv({
  server: {
    BACKEND_URL: url.optional(),
    API_URL: url.optional(),
    AUTH_URL: url.optional(),
    FRONTEND_URL: url.optional(),
  },
  client: {
    NEXT_PUBLIC_API_URL: url.optional(),
    NEXT_PUBLIC_SITE_URL: url.optional(),
    NEXT_PUBLIC_AUTH_URL: url.optional(),
  },
  runtimeEnv: {
    BACKEND_URL: process.env.BACKEND_URL,
    API_URL: process.env.API_URL,
    AUTH_URL: process.env.AUTH_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
  },
  emptyStringAsUndefined: true,
});

function requireUrl(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing ${name}. Add it to your environment variables.`);
  }

  return value.replace(/\/$/, "");
}

export const apiBaseUrl = requireUrl(
  env.NEXT_PUBLIC_API_URL ?? env.API_URL,
  "NEXT_PUBLIC_API_URL",
);

export const siteUrl = (
  env.NEXT_PUBLIC_SITE_URL ??
  env.FRONTEND_URL ??
  "http://localhost:3000"
).replace(/\/$/, "");

export const authBaseUrl = (
  env.NEXT_PUBLIC_AUTH_URL ??
  env.AUTH_URL ??
  `${siteUrl}/api/auth`
).replace(/\/$/, "");
