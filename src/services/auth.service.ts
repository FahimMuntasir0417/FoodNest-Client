import { getSession as getAuthSession } from "@/lib/auth";
import type { AuthResponse } from "@/lib/auth.types";
import type { ServiceResult } from "@/types/common";

export async function getSession(): Promise<ServiceResult<AuthResponse>> {
  try {
    const session = await getAuthSession();

    if (!session) {
      return {
        data: null,
        error: { message: "Session is missing or expired." },
      };
    }

    return { data: session, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : "Unable to load session.",
      },
    };
  }
}
