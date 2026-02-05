import { env } from "@/env";
import { parseJsonSafe, type ServiceResult } from "./_helpers";
import type { Meal } from "@/types";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

if (!API_URL) {
  throw new Error(
    "Missing API_URL. Set API_URL in your .env file (must include http:// or https://).",
  );
}

// Supports string/number/boolean/null/undefined and arrays of those
type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue | QueryValue[]>;

function buildUrl(path: string, params?: QueryParams) {
  const url = new URL(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v === undefined || v === null) return;
          url.searchParams.append(key, String(v));
        });
      } else {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function getCookieHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return cookieHeader ? { cookie: cookieHeader } : {};
}

export type MealsListParams = {
  q?: string;
  page?: number;
  limit?: number;

  providerId?: string;
  categoryId?: string;
  cuisine?: string;
  isAvailable?: boolean;
};

export type CreateMealInput = {
  providerId?: string;
  categoryId: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  cuisine?: string | null;
  isAvailable?: boolean; // default true on client
};

export const mealsService = {
  // GET /meals
  getAll: async (params?: MealsListParams): Promise<ServiceResult<Meal[]>> => {
    try {
      const url = buildUrl("/meals", params);
      const headers = await getCookieHeader();

      const res = await fetch(url, {
        headers,
        next: { revalidate: 10, tags: ["meals"] },
      });

      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to fetch meals (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as Meal[], error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },

  // GET /meals/:id
  getById: async (id: string): Promise<ServiceResult<Meal>> => {
    try {
      const headers = await getCookieHeader();

      const res = await fetch(`${API_URL}/meals/${encodeURIComponent(id)}`, {
        headers,
        next: { revalidate: 10, tags: ["meals", `meal:${id}`] },
      });

      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to fetch meal (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as Meal, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },

  // POST /meals
  create: async (input: CreateMealInput): Promise<ServiceResult<Meal>> => {
    try {
      const headers = await getCookieHeader();

      const res = await fetch(`${API_URL}/meals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(input),
        cache: "no-store",
      });

      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to create meal (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as Meal, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },

  // DELETE /meals/:id
  delete: async (id: string): Promise<ServiceResult<{ success: true }>> => {
    try {
      const headers = await getCookieHeader();

      const res = await fetch(`${API_URL}/meals/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers,
        cache: "no-store",
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

      return { data: { success: true }, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },
};
