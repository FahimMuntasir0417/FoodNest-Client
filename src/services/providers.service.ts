import { env } from "@/env";
import { parseJsonSafe, type ServiceResult } from "./_helpers";
import type { Provider } from "@/types";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export type CreateProviderInput = {
  userId: string;
  shopName: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  logoUrl?: string | null;
};

export const providersService = {
  getAll: async (): Promise<ServiceResult<Provider[]>> => {
    try {
      const res = await fetch(`${API_URL}/providers`, {
        next: { revalidate: 10, tags: ["providers"] },
      });

      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to fetch providers (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as Provider[], error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },

  getById: async (id: string): Promise<ServiceResult<Provider>> => {
    try {
      const res = await fetch(`${API_URL}/providers/${id}`, {
        next: { revalidate: 10, tags: ["providers", `provider:${id}`] },
      });

      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to fetch provider (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as Provider, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },

  create: async (
    input: CreateProviderInput,
  ): Promise<ServiceResult<Provider>> => {
    try {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");

      const res = await fetch(`${API_URL}/providers/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(input),
        cache: "no-store",
      });

      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to create provider (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as Provider, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },
};
