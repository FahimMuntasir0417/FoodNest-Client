import { env } from "@/env";
import { cookies } from "next/headers";

const AUTH_URL = env.AUTH_URL;

export type ServiceResult<T> = {
  data: T | null;
  error: { message: string; detail?: any } | null;
};

export async function getSession(): Promise<ServiceResult<any>> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    const res = await fetch(`${AUTH_URL}/get-session`, {
      method: "GET",
      headers: {
        cookie: cookieHeader,
        accept: "application/json",
      },
      cache: "no-store",
    });

    const payload = await res.json().catch(() => null);

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
