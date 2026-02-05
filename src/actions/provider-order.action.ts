"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { parseJsonSafe } from "@/services/_helpers";
import { getSession } from "@/services/auth.service";

const API_URL = process.env.API_URL!; // e.g. http://localhost:4000/api/v1

export type ServiceResult<T> = {
  data: T | null;
  error: { message: string; detail?: any } | null;
};

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies(); // ✅ await required in your Next version
  return cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
}

export async function getProviderOrders(): Promise<ServiceResult<any[]>> {
  try {
    const { data: authData, error } = await getSession();

    // session shape can vary (some return user.id, some session.userId)
    const userId = authData?.user?.id ?? authData?.session?.userId;

    if (error || !userId) {
      return { data: null, error: { message: "Unauthorized", detail: error } };
    }

    const cookieHeader = await getCookieHeader(); // ✅ IMPORTANT: await here

    const res = await fetch(`${API_URL}/providers/orders`, {
      method: "GET",
      cache: "no-store",
      headers: {
        cookie: cookieHeader, // ✅ MUST be lowercase
        accept: "application/json",
      },
    });

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      return {
        data: null,
        error: {
          message: `Failed to fetch provider orders (HTTP ${res.status})`,
          detail: payload,
        },
      };
    }

    return { data: payload as any[], error: null };
  } catch (err: any) {
    return {
      data: null,
      error: { message: err?.message ?? "Something went wrong" },
    };
  }
}

export async function updateProviderOrderStatus(
  orderId: string,
  status: string,
): Promise<ServiceResult<any>> {
  try {
    const { data: authData, error } = await getSession();

    const userId = authData?.user?.id ?? authData?.session?.userId;
    if (error || !userId) {
      return { data: null, error: { message: "Unauthorized", detail: error } };
    }

    const cookieHeader = await getCookieHeader(); // ✅ IMPORTANT: await here

    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "content-type": "application/json",
        cookie: cookieHeader, // ✅ lowercase
        accept: "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      return {
        data: null,
        error: {
          message: `Failed to update status (HTTP ${res.status})`,
          detail: payload,
        },
      };
    }

    // ✅ refresh provider orders page
    revalidatePath("/provider-dashboard/provider-order");

    return { data: payload, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: { message: err?.message ?? "Something went wrong" },
    };
  }
}
