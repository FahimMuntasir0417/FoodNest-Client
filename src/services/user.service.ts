import { env } from "@/env";
import { parseJsonSafe, type ServiceResult } from "./_helpers";
import type { User } from "@/types";
import { headers } from "next/headers";

const API_URL = env.API_URL;

export const userService = {
  getAll: async (): Promise<ServiceResult<User[]>> => {
    try {
      const headerStore = await headers(); // ✅ Next 16 async dynamic API
      const cookieHeader = headerStore.get("cookie") ?? ""; // ✅ raw cookie string

      const res = await fetch(`${API_URL}/users`, {
        headers: { cookie: cookieHeader },
        cache: "no-store",
      });

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

      return { data: payload as User[], error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message ?? "Something went wrong" },
      };
    }
  },
};
