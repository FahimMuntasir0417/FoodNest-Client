"use server";

import { cookies } from "next/headers";
import type { AuthResponse } from "@/lib/auth.types";

export async function getSession(): Promise<AuthResponse | null> {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.BACKEND_URL}/api/auth/session`, {
      headers: {
        cookie: cookieStore.toString(), // forwards better-auth.session_token
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return (await res.json()) as AuthResponse;
  } catch {
    return null;
  }
}
