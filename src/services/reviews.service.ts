import { env } from "@/env";
import { parseJsonSafe, type ServiceResult } from "./_helpers";

const API_URL = env.API_URL;

export type Review = any;

export const reviewsService = {
  getAll: async (): Promise<ServiceResult<Review[]>> => {
    try {
      const res = await fetch(`${API_URL}/reviews`, { cache: "no-store" });
      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to fetch reviews (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as Review[], error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },

  getById: async (id: string): Promise<ServiceResult<Review>> => {
    try {
      const res = await fetch(`${API_URL}/reviews/${id}`, {
        cache: "no-store",
      });
      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to fetch review (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as Review, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },
};
