import { env } from "@/env";
import { parseJsonSafe, type ServiceResult } from "./_helpers";
import type { Category } from "@/types";
import { cookies } from "next/headers";
import type { CreateCategoryInput } from "@/types/category/category";

const API_URL = env.API_URL;

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

  createCategory: async (category: CreateCategoryInput) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/categories`, {
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
