"use server";

import { mealsService, type CreateMealInput } from "@/services/meals.service";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export const createMeal = async (data: CreateMealInput) => {
  const res = await mealsService.create(data);

  if (res.error) return res;

  revalidateTag("meals", "default");

  // redirect after successful create
  redirect("/meals");
};
