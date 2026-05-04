import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("apiClient", () => {
  it("returns parsed JSON for successful responses", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    await expect(apiClient<{ ok: boolean }>("/health")).resolves.toEqual({
      ok: true,
    });
  });

  it("throws ApiError with API message for failed responses", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      }),
    );

    await expect(apiClient("/private")).rejects.toMatchObject({
      message: "Unauthorized",
      status: 401,
    });
  });
});
