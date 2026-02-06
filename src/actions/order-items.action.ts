// src/actions/cart.action.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSession } from "@/services/auth.service";
import {
  createOrderItem,
  type OrderItem,
} from "@/services/order-items.service";

type ActionResult<T> = {
  data: T | null;
  error: { message: string; detail?: any } | null;
};

function getUserId(authData: any): string | null {
  return authData?.session?.userId ?? authData?.user?.id ?? null;
}

export async function addToDraftCart(input: {
  mealId: string;
  quantity?: number;
}): Promise<ActionResult<OrderItem>> {
  const { data: authData, error } = await getSession();

  const userId = getUserId(authData);
  if (error || !userId) {
    return { data: null, error: { message: "Unauthorized", detail: error } };
  }

  const mealId = input.mealId?.trim();
  if (!mealId) {
    return { data: null, error: { message: "Meal is required" } };
  }

  const quantity = Number(input.quantity ?? 1);
  if (!Number.isFinite(quantity) || quantity < 1) {
    return { data: null, error: { message: "Quantity must be at least 1" } };
  }

  const res = await createOrderItem({
    customerId: userId,
    mealId,
    quantity: Math.floor(quantity),
  });

  if (res.error) {
    return { data: null, error: res.error };
  }

  return { data: res.data as OrderItem, error: null };
}

// export async function addToDraftCart(input: {
//   mealId: string;
//   quantity?: number;
// }): Promise<ActionResult<OrderItem>> {
//   const { data: authData, error } = await getSession();

//   const userId = getUserId(authData);
//   if (error || !userId) {
//     return { data: null, error: { message: "Unauthorized", detail: error } };
//   }

//   const mealId = input.mealId?.trim();
//   if (!mealId) {
//     return { data: null, error: { message: "Meal is required" } };
//   }

//   const quantity = Number(input.quantity ?? 1);
//   if (!Number.isFinite(quantity) || quantity < 1) {
//     return { data: null, error: { message: "Quantity must be at least 1" } };
//   }

//   const res = await createOrderItem({
//     customerId: userId,
//     mealId,
//     quantity: Math.floor(quantity),
//   });

//   if (res.error) {
//     return { data: null, error: res.error };
//   }

//   revalidatePath("/cart");

//   // ✅ redirect MUST be before returning, and no return after it
//   redirect("/order-item");
// }

// "use server";

// import { getSession } from "@/services/auth.service";
// import { createOrderItem } from "@/services/order-items.service";
// import { revalidatePath } from "next/cache";

// export async function addToDraftCart(data: {
//   mealId: string;
//   quantity?: number;
// }) {
//   const { data: authData, error } = await getSession();

//   if (error || !authData?.session?.userId) {
//     return { data: null, error: { message: "Unauthorized" } };
//   }

//   const customerId = authData.session.userId;

//   const mealId = data.mealId?.trim();
//   if (!mealId) return { data: null, error: { message: "Meal is required" } };

//   const quantity = Number(data.quantity ?? 1);
//   if (!Number.isInteger(quantity) || quantity < 1) {
//     return { data: null, error: { message: "Quantity must be at least 1" } };
//   }

//   const res = await createOrderItem({
//     customerId,
//     mealId,
//     quantity,
//   });

//   if (res.error) return res;

//   revalidatePath("/cart");
//   return { data: res.data, error: null };
// }
