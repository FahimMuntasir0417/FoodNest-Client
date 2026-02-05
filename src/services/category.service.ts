// src/services/category.service.ts
import { env } from "@/env";
import { parseJsonSafe, type ServiceResult } from "./_helpers";
import type { Category } from "@/types";
import { cookies } from "next/headers";
import type { CreateCategoryInput } from "@/types/category/category";

const API_URL = env.API_URL;

// ✅ cookies() type mismatch safe helper (works whether cookies() is typed sync or promise)
async function cookieHeader(): Promise<string> {
  const maybe = cookies() as any; // your project may type it as Promise<ReadonlyRequestCookies>
  const store = typeof maybe?.then === "function" ? await maybe : maybe;

  return store
    .getAll()
    .map(
      ({ name, value }: { name: string; value: string }) => `${name}=${value}`,
    )
    .join("; ");
}

export const categoryService = {
  getAll: async (): Promise<ServiceResult<Category[]>> => {
    try {
      const res = await fetch(`${API_URL}/categories`, {
        next: { revalidate: 10, tags: ["categories"] },
      });

      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to fetch categories (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as Category[], error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },

  getById: async (id: string): Promise<ServiceResult<Category>> => {
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        next: { revalidate: 10, tags: ["categories", `category:${id}`] },
      });

      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to fetch category (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as Category, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },

  createCategory: async (
    category: CreateCategoryInput,
  ): Promise<ServiceResult<Category>> => {
    try {
      const cookie = await cookieHeader();

      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "content-type": "application/json",
          cookie, // ✅ lowercase (safe for node fetch)
          accept: "application/json",
        },
        body: JSON.stringify(category),
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

      return { data: payload as Category, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },

  // ✅ NEW: DELETE /categories/:id (admin)
  delete: async (id: string): Promise<ServiceResult<null>> => {
    try {
      const cookie = await cookieHeader();

      const res = await fetch(`${API_URL}/categories/${id}`, {
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
            message: `Failed to delete category (HTTP ${res.status})`,
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
  },
};
