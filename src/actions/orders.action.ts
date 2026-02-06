"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { env } from "@/env";
import { parseJsonSafe } from "@/services/_helpers";
import { redirect } from "next/navigation";

type ServiceError = { message: string; detail?: unknown };
export type ServiceResult<T> = { data: T | null; error: ServiceError | null };

export type CreateOrderFromDraftsInput = {
  deliveryAddress: string;
  phone: string;
  note?: string;
  deliveryFee: number;
};

export type Order = any;

const API_URL = env.API_URL;

export async function createOrderFromDrafts(
  input: CreateOrderFromDraftsInput,
): Promise<ServiceResult<Order>> {
  try {
    const body = {
      deliveryAddress: input.deliveryAddress?.trim() ?? "",
      phone: input.phone?.trim() ?? "",
      note: input.note?.trim() ? input.note.trim() : undefined,
      deliveryFee: Number(input.deliveryFee),
    };

    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/orders/from-drafts`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: cookieStore.toString(),
        accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      return {
        data: null,
        error: {
          message: `Failed to create order (HTTP ${res.status})`,
          detail: payload,
        },
      };
    }

    // ✅ refresh cart data after order creation
    revalidatePath("/cart");
    // redirect("/customer-dashboard/customer-order");

    return { data: payload as Order, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: { message: err?.message ?? "Something went wrong" },
    };
  }
}

// // src/actions/orders.action.ts
// "use server";

// import { cookies } from "next/headers";
// import { env } from "@/env";
// import { parseJsonSafe } from "@/services/_helpers"; // ✅ use same helper style as your services
// import { redirect } from "next/navigation";

// type ServiceError = { message: string; detail?: unknown };
// export type ServiceResult<T> = { data: T | null; error: ServiceError | null };

// export type CreateOrderFromDraftsInput = {
//   deliveryAddress: string;
//   phone: string;
//   note?: string;
//   deliveryFee: number;
// };

// // keep as any if you don't want strict typing here
// export type Order = any;

// const API_URL = env.API_URL;

// export async function createOrderFromDrafts(
//   input: CreateOrderFromDraftsInput,
// ): Promise<ServiceResult<Order>> {
//   try {
//     const body = {
//       deliveryAddress: input.deliveryAddress?.trim() ?? "",
//       phone: input.phone?.trim() ?? "",
//       note: input.note?.trim() ? input.note.trim() : undefined,
//       deliveryFee: Number(input.deliveryFee),
//     };

//     const cookieStore = await cookies();

//     const res = await fetch(`${API_URL}/orders/from-drafts`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         cookie: cookieStore.toString(),
//       },
//       body: JSON.stringify(body),
//       cache: "no-store",
//     });

//     const payload = await parseJsonSafe(res);

//     if (!res.ok) {
//       return {
//         data: null,
//         error: {
//           message: `Failed to create order from drafts (HTTP ${res.status})`,
//           detail: payload,
//         },
//       };
//     }

//     return { data: payload as Order, error: null };
//   } catch (err: any) {
//     return {
//       data: null,
//       error: { message: err?.message ?? "Something went wrong" },
//     };
//   }

// }
