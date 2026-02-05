// src/services/orders.service.ts
import { cookies } from "next/headers";
import { env } from "@/env";
import { parseJsonSafe, type ServiceResult } from "./_helpers";

const API_URL = env.API_URL ?? "http://localhost:4000/api/v1";

// Keep any if you want
export type Order = any;

export type CreateOrderFromDraftsInput = {
  deliveryAddress: string;
  phone: string;
  note?: string;
  deliveryFee: number;
};

// ✅ cookies() is sync in Next 15/16, but your types may show Promise.
// This makes it work in both cases.
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

export const ordersService = {
  // ✅ ADMIN: GET /orders
  async getAll(): Promise<ServiceResult<Order[]>> {
    try {
      const cookie = await cookieHeader();

      const res = await fetch(`${API_URL}/orders`, {
        method: "GET",
        cache: "no-store",
        headers: {
          cookie, // ✅ lowercase + string
          accept: "application/json",
        },
      });

      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to fetch orders (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as Order[], error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },

  // ✅ CUSTOMER: GET /orders/me
  async getMe(): Promise<ServiceResult<Order[]>> {
    try {
      const cookie = await cookieHeader();

      const res = await fetch(`${API_URL}/orders/me`, {
        method: "GET",
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
            message: `Failed to fetch my orders (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as Order[], error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },

  // ✅ PROVIDER: GET /providers/orders/:id
  async getByProviderId(id: string): Promise<ServiceResult<Order[]>> {
    try {
      const cookie = await cookieHeader();

      const res = await fetch(`${API_URL}/providers/orders/${id}`, {
        method: "GET",
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
            message: `Failed to fetch provider orders (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as Order[], error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },

  // ✅ GET /orders/:id
  async getById(id: string): Promise<ServiceResult<Order>> {
    try {
      const cookie = await cookieHeader();

      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: "GET",
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
            message: `Failed to fetch order (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as Order, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },

  // ✅ POST /orders/from-drafts
  async createFromDrafts(
    input: CreateOrderFromDraftsInput,
  ): Promise<ServiceResult<Order>> {
    try {
      const cookie = await cookieHeader();

      const body = {
        deliveryAddress: input.deliveryAddress?.trim() ?? "",
        phone: input.phone?.trim() ?? "",
        note: input.note?.trim() ? input.note.trim() : undefined,
        deliveryFee: Number(input.deliveryFee),
      };

      const res = await fetch(`${API_URL}/orders/from-drafts`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "content-type": "application/json",
          cookie,
          accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to create order from drafts (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as Order, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },
};
