import { env } from "@/env";
import { parseJsonSafe, type ServiceResult } from "./_helpers";
import type { ReviewInput } from "@/types/reviews/rewiew";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export type Review = any;

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

function payloadMessage(payload: unknown) {
  if (typeof payload === "string" && payload.trim()) return payload;

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const message = record.message ?? record.error;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return null;
}

function createReviewErrorMessage(status: number, payload: unknown) {
  const message = payloadMessage(payload);
  if (message) return message;

  if (status === 401) return "Please log in to submit a review.";
  if (status === 403) return "You are not allowed to submit a review.";
  if (status === 409) return "You have already reviewed this meal.";

  return `Failed to create review (HTTP ${status})`;
}

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

  createReview: async (
    input: ReviewInput,
  ): Promise<ServiceResult<Review>> => {
    try {
      const cookie = await cookieHeader();

      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          cookie,
          accept: "application/json",
        },
        body: JSON.stringify(input),
        cache: "no-store",
      });

      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: createReviewErrorMessage(res.status, payload),
            status: res.status,
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
