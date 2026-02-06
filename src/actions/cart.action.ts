// src/actions/cart.action.ts
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { env } from "@/env";
import { parseJsonSafe, type ServiceResult } from "@/services/_helpers";
import { redirect } from "next/navigation";

const API_URL = env.API_URL ?? "http://localhost:4000/api/v1";

async function cookieHeader(): Promise<string> {
  const maybe = cookies() as any;
  const store = typeof maybe?.then === "function" ? await maybe : maybe;

  return store
    .getAll()
    .map(
      ({ name, value }: { name: string; value: string }) => `${name}=${value}`,
    )
    .join("; ");
}

/**
 * Assumed endpoints (adjust if your backend differs):
 * PATCH  /order-items/:id   body: { quantity: number }
 * DELETE /order-items/:id
 */
export async function updateDraftItemQuantity(
  itemId: string,
  quantity: number,
): Promise<ServiceResult<any>> {
  try {
    if (!itemId)
      return { data: null, error: { message: "Item id is required" } };
    if (quantity < 1)
      return { data: null, error: { message: "Quantity must be at least 1" } };

    const cookie = await cookieHeader();

    const res = await fetch(`${API_URL}/order-items/${itemId}`, {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "content-type": "application/json",
        cookie,
        accept: "application/json",
      },
      body: JSON.stringify({ quantity }),
    });

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      return {
        data: null,
        error: {
          message: `Failed to update quantity (HTTP ${res.status})`,
          detail: payload,
        },
      };
    }

    revalidatePath("/cart");
    return { data: payload, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: { message: err?.message ?? "Something went wrong" },
    };
  }
}

export async function removeDraftItem(
  itemId: string,
): Promise<ServiceResult<null>> {
  try {
    if (!itemId)
      return { data: null, error: { message: "Item id is required" } };

    const cookie = await cookieHeader();

    const res = await fetch(`${API_URL}/order-items/${itemId}`, {
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
          message: `Failed to delete item (HTTP ${res.status})`,
          detail: payload,
        },
      };
    }

    return { data: null, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: { message: err?.message ?? "Something went wrong" },
    };
  }
}
