import { env } from "@/env";
import { parseJsonSafe, type ServiceResult } from "./_helpers";

const API_URL = env.API_URL;

export type Order = any;

export const ordersService = {
  getAll: async (): Promise<ServiceResult<Order[]>> => {
    try {
      const res = await fetch(`${API_URL}/orders`, { cache: "no-store" });
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

  getById: async (id: string): Promise<ServiceResult<Order>> => {
    try {
      const res = await fetch(`${API_URL}/orders/${id}`, { cache: "no-store" });
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
};
