import { env } from "@/env";
import { parseJsonSafe, type ServiceResult } from "./_helpers";
import { ReviewInput } from "@/types/reviews/rewiew";
import { cookies } from "next/headers";

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

  createReview: async (category: ReviewInput) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(category),
        cache: "no-store",
      });

      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to create category (HTTP ${res.status})`,
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
  },
};
