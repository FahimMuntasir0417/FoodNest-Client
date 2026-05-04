import { apiRequest, type ApiClientOptions } from "@/lib/api";
import { getCookieHeaders } from "@/lib/auth";
import type { ServiceResult } from "@/types/common";
import type {
  CreateOrderFromDraftsInput,
  Order,
} from "@/features/orders/types/order.types";

async function authedOptions(
  init?: ApiClientOptions,
): Promise<ApiClientOptions> {
  const headers = new Headers(init?.headers);
  const cookieHeaders = await getCookieHeaders();

  Object.entries(cookieHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  return {
    cache: "no-store",
    ...init,
    headers,
  };
}

export const ordersService = {
  async getAll(): Promise<ServiceResult<Order[]>> {
    return apiRequest<Order[]>("/orders", await authedOptions());
  },

  async getMe(): Promise<ServiceResult<Order[]>> {
    return apiRequest<Order[]>("/orders/me", await authedOptions());
  },

  async getByProviderId(id: string): Promise<ServiceResult<Order[]>> {
    return apiRequest<Order[]>(
      `/providers/orders/${encodeURIComponent(id)}`,
      await authedOptions(),
    );
  },

  async getById(id: string): Promise<ServiceResult<Order>> {
    return apiRequest<Order>(
      `/orders/${encodeURIComponent(id)}`,
      await authedOptions(),
    );
  },

  async createFromDrafts(
    input: CreateOrderFromDraftsInput,
  ): Promise<ServiceResult<Order>> {
    return apiRequest<Order>(
      "/orders/from-drafts",
      await authedOptions({
        method: "POST",
        json: {
          deliveryAddress: input.deliveryAddress.trim(),
          phone: input.phone.trim(),
          note: input.note?.trim() || undefined,
          deliveryFee: Number(input.deliveryFee),
        },
      }),
    );
  },
};
