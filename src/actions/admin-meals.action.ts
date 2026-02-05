// src/actions/admin-meals.action.ts
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { env } from "@/env";
import { parseJsonSafe } from "@/services/_helpers";

const API_URL = env.API_URL ?? "http://localhost:4000/api/v1";

export type ActionResult<T> = {
  data: T | null;
  error: { message: string; detail?: unknown } | null;
};

async function cookieHeader(): Promise<string> {
  const maybe = cookies() as unknown as { then?: Function; getAll?: Function };
  const store: any =
    typeof (maybe as any)?.then === "function" ? await (maybe as any) : maybe;

  return (store.getAll?.() ?? [])
    .map(
      ({ name, value }: { name: string; value: string }) => `${name}=${value}`,
    )
    .join("; ");
}

export async function adminDeleteMeal(
  mealId: string,
): Promise<ActionResult<null>> {
  try {
    if (!mealId)
      return { data: null, error: { message: "Meal id is required" } };

    const cookie = await cookieHeader();

    // ✅ adjust endpoint if yours is different
    const res = await fetch(`${API_URL}/meals/${mealId}`, {
      method: "DELETE",
      cache: "no-store",
      headers: {
        cookie,
        accept: "application/json",
      },
    });

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      return {
        data: null,
        error: {
          message: `Failed to delete meal (HTTP ${res.status})`,
          detail: payload,
        },
      };
    }

    // ✅ revalidate your admin meals page route
    revalidatePath("/admin-dashboard/meals");
    return { data: null, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: { message: err?.message ?? "Something went wrong" },
    };
  }
}
