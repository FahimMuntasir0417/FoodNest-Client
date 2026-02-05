// src/services/order-items.service.ts
import { cookies } from "next/headers";
import { env } from "@/env";
import { parseJsonSafe, type ServiceResult } from "./_helpers";

const API_URL = env.API_URL ?? "http://localhost:4000/api/v1";

// Keep as any if you want, but better to type later
export type OrderItem = any;

async function getCookieHeader(): Promise<string> {
  // Works whether cookies() is typed as Promise or not in your TS setup
  const maybe = cookies() as any;
  const store = typeof maybe?.then === "function" ? await maybe : maybe;

  // ReadonlyRequestCookies supports .toString()
  return store.toString();
}

/**
 * Draft cart items.
 * If your backend uses only GET /order-items, keep it.
 * If you later add /order-items/draft/me, just change the endpoint below.
 */
export async function getDraftMe(): Promise<ServiceResult<OrderItem[]>> {
  try {
    const cookie = await getCookieHeader();

    const res = await fetch(`${API_URL}/order-items`, {
      method: "GET",
      cache: "no-store",
      headers: {
        cookie, // ✅ lowercase
        accept: "application/json",
      },
    });

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      return {
        data: null,
        error: {
          message: `Failed to fetch order items (HTTP ${res.status})`,
          detail: payload,
        },
      };
    }

    return { data: payload as OrderItem[], error: null };
  } catch (err: any) {
    return {
      data: null,
      error: { message: err?.message ?? "Something went wrong" },
    };
  }
}

export async function createOrderItem(input: {
  customerId: string;
  mealId: string;
  quantity?: number;
}): Promise<ServiceResult<OrderItem>> {
  try {
    const cookie = await getCookieHeader();

    const res = await fetch(`${API_URL}/order-items`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "content-type": "application/json",
        cookie, // ✅ lowercase
        accept: "application/json",
      },
      body: JSON.stringify({
        customerId: input.customerId,
        mealId: input.mealId,
        quantity: input.quantity ?? 1,
      }),
    });

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      return {
        data: null,
        error: {
          message: `Failed to create order item (HTTP ${res.status})`,
          detail: payload,
        },
      };
    }

    return { data: payload as OrderItem, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: { message: err?.message ?? "Something went wrong" },
    };
  }
}

/**
 * Optional: delete an item (useful for cart remove button)
 * Backend should support: DELETE /order-items/:id
 */
export async function deleteOrderItem(
  itemId: string,
): Promise<ServiceResult<null>> {
  try {
    if (!itemId)
      return { data: null, error: { message: "Item id is required" } };

    const cookie = await getCookieHeader();

    const res = await fetch(`${API_URL}/order-items/${itemId}`, {
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
          message: `Failed to delete order item (HTTP ${res.status})`,
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
}

// "use server";

// import { env } from "@/env";
// import { parseJsonSafe, type ServiceResult } from "./_helpers";
// import { cookies } from "next/headers";

// const API_URL = env.API_URL;

// export type OrderItem = any;

// export async function getDraftMe(): Promise<ServiceResult<OrderItem[]>> {
//   try {
//     const cookieStore = await cookies();

//     const res = await fetch(`${API_URL}/order-items`, {
//       headers: { cookie: cookieStore.toString() },
//       cache: "no-store",
//     });

//     const payload = await parseJsonSafe(res);

//     if (!res.ok) {
//       return {
//         data: null,
//         error: {
//           message: `Failed to fetch draft order items (HTTP ${res.status})`,
//           detail: payload,
//         },
//       };
//     }

//     return { data: payload as OrderItem[], error: null };
//   } catch (err: any) {
//     return {
//       data: null,
//       error: { message: err?.message ?? "Something went wrong" },
//     };
//   }
// }

// export async function orderItem(): Promise<ServiceResult<OrderItem[]>> {
//   try {
//     const cookieStore = await cookies();

//     const res = await fetch(`${API_URL}/order-items/`, {
//       headers: { cookie: cookieStore.toString() },
//       cache: "no-store",
//     });

//     const payload = await parseJsonSafe(res);

//     if (!res.ok) {
//       return {
//         data: null,
//         error: {
//           message: `Failed to fetch draft order items (HTTP ${res.status})`,
//           detail: payload,
//         },
//       };
//     }

//     return { data: payload as OrderItem[], error: null };
//   } catch (err: any) {
//     return {
//       data: null,
//       error: { message: err?.message ?? "Something went wrong" },
//     };
//   }
// }

// export async function createOrderItem(input: {
//   customerId: string;
//   mealId: string;
//   quantity?: number;
// }): Promise<ServiceResult<OrderItem>> {
//   try {
//     const cookieStore = await cookies();

//     const res = await fetch(`${API_URL}/order-items`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         cookie: cookieStore.toString(),
//       },
//       body: JSON.stringify({
//         customerId: input.customerId,
//         mealId: input.mealId,
//         quantity: input.quantity ?? 1,
//       }),
//       cache: "no-store",
//     });

//     const payload = await parseJsonSafe(res);

//     if (!res.ok) {
//       return {
//         data: null,
//         error: {
//           message: `Failed to create order item (HTTP ${res.status})`,
//           detail: payload,
//         },
//       };
//     }

//     return { data: payload as OrderItem, error: null };
//   } catch (err: any) {
//     return {
//       data: null,
//       error: { message: err?.message ?? "Something went wrong" },
//     };
//   }
// }
