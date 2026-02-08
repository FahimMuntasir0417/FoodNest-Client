// src/services/auth.service.ts
import { env } from "@/env";
import { cookies } from "next/headers";

const AUTH_URL = env.AUTH_URL;

export type ServiceResult<T> = {
  data: T | null;
  error: { message: string; detail?: unknown } | null;
};

type CookieKV = { name: string; value: string };
type CookieStore = { getAll: () => CookieKV[] };

async function resolveCookies(): Promise<CookieStore> {
  // cookies() কোথাও sync, কোথাও Promise — তাই normalize করছি
  const maybe = cookies() as unknown as CookieStore | Promise<CookieStore>;
  const store = await Promise.resolve(maybe);
  return store;
}

async function getCookieHeader(): Promise<string> {
  const store = await resolveCookies();
  return store
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
}

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function getSession(): Promise<ServiceResult<any>> {
  try {
    const cookieHeader = await getCookieHeader();

    const res = await fetch(`${AUTH_URL}/get-session`, {
      method: "GET",
      headers: {
        cookie: cookieHeader, // ✅ lowercase safest
        accept: "application/json",
      },
      cache: "no-store",
    });

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      return {
        data: null,
        error: {
          message: `Session request failed (HTTP ${res.status})`,
          detail: payload,
        },
      };
    }

    return { data: payload, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: { message: err?.message ?? "Something went wrong" },
    };
  }
}

// import { env } from "@/env";
// import { cookies } from "next/headers";

// const AUTH_URL = env.AUTH_URL;

// export const userService = {
//   getSession: async function () {
//     try {
//       const cookieStore = await cookies();
//       const cookieHeader = cookieStore.toString();

//       const res = await fetch(`${AUTH_URL}/get-session`, {
//         headers: {
//           cookie: cookieHeader, // ✅ MUST be lowercase
//         },
//         cache: "no-store",
//       });

//       if (!res.ok) {
//         return {
//           data: null,
//           error: { message: `Session request failed (${res.status})` },
//         };
//       }

//       const session = await res.json();

//       if (!session) {
//         return { data: null, error: { message: "Session is missing." } };
//       }

//       return { data: session, error: null };
//     } catch (err) {
//       console.error(err);
//       return { data: null, error: { message: "Something Went Wrong" } };
//     }
//   },
// };
