"use server";

import { revalidatePath } from "next/cache";

import {
  ordersService,
  type CreateOrderFromDraftsInput,
  type Order,
} from "@/services/orders.service";
import type { ServiceResult } from "@/types/common";

export async function createOrderFromDrafts(
  input: CreateOrderFromDraftsInput,
): Promise<ServiceResult<Order>> {
  const result = await ordersService.createFromDrafts(input);

  if (!result.error) {
    revalidatePath("/order-item");
    revalidatePath("/customer-dashboard/customer-order");
  }

  return result;
}
