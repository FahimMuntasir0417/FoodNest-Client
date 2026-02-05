// src/services/users.service.ts
import { cookies } from "next/headers";
import { env } from "@/env";
import { parseJsonSafe, type ServiceResult } from "./_helpers";

const API_URL = env.API_URL ?? "http://localhost:4000/api/v1";

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: "CUSTOMER" | "ADMIN" | "PROVIDER";
  phone: string | null;
  status: "ACTIVE" | "SUSPENDED";
  providerId?: string | null;
};

type UpdateUserInput = {
  role?: User["role"];
  status?: User["status"];
};

async function getCookieHeader(): Promise<string> {
  const store = await cookies(); // ✅ ALWAYS await

  return store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

async function authedFetch(url: string, init?: RequestInit) {
  const cookie = await getCookieHeader();

  return fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init?.headers ?? {}),
      // ✅ Node fetch expects lowercase cookie key
      cookie,
      accept: "application/json",
    },
  });
}

export const usersService = {
  /**
   * ✅ GET /users/me  (your latest endpoint)
   */
  async getMe(): Promise<ServiceResult<User>> {
    try {
      const res = await authedFetch(`${API_URL}/users/me`, { method: "GET" });
      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to fetch me (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as User, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },

  /**
   * ✅ GET /users  (ADMIN list)
   * If your backend actually returns ALL users at GET /users for admin,
   * this will work.
   */
  async getAll(): Promise<ServiceResult<User[]>> {
    try {
      const res = await authedFetch(`${API_URL}/users`, { method: "GET" });
      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to fetch users (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      // Some backends return {data: []}
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray((payload as any)?.data)
          ? (payload as any).data
          : [];

      return { data: list as User[], error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },

  /**
   * ✅ PATCH /users/:id  (ADMIN)
   * Your router says PATCH "/:id" auth(ADMIN)
   */
  async updateUser(
    id: string,
    input: UpdateUserInput,
  ): Promise<ServiceResult<User>> {
    try {
      const res = await authedFetch(`${API_URL}/users/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });

      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to update user (HTTP ${res.status})`,
            detail: payload,
          },
        };
      }

      return { data: payload as User, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },

  /**
   * ✅ DELETE /users/:id  (ADMIN)
   */
  async deleteUser(id: string): Promise<ServiceResult<null>> {
    try {
      const res = await authedFetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
      });

      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: `Failed to delete user (HTTP ${res.status})`,
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
