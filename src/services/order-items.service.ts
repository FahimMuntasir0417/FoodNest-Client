import { env } from "@/env";
import { parseJsonSafe, type ServiceResult } from "./_helpers";

const API_URL = env.API_URL;

export type OrderItem = any;

export const orderItemsService = {
  getAll: async (): Promise<ServiceResult<OrderItem[]>> => {
    try {
      const res = await fetch(`${API_URL}/order-items`, { cache: "no-store" });
      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to fetch order items (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as OrderItem[], error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },

  getById: async (id: string): Promise<ServiceResult<OrderItem>> => {
    try {
      const res = await fetch(`${API_URL}/order-items/${id}`, {
        cache: "no-store",
      });
      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to fetch order item (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as OrderItem, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },
};
