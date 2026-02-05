"use server";

import { mealsService, type CreateMealInput } from "@/services/meals.service";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { userService } from "./../services/user.service";
import { getSession } from "@/services/auth.service";

export const createMeal = async (data: Omit<CreateMealInput, "providerId">) => {
  const { data: authData, error } = await getSession();

  if (error || !authData?.user?.id) {
    return { error: { message: "Unauthorized" } };
  }

  const providerId = authData.user.providerId;

  if (!providerId) {
    return { error: { message: "Provider id not found for this user" } };
  }

  const res = await mealsService.create({ providerId, ...data });

  if (res.error) return res;

  redirect("/maels");
};

export async function deleteMealAction(mealId: string) {
  if (!mealId) return { error: { message: "Meal id is required" } };

  const res = await mealsService.delete(mealId);
  if (res.error) return res;

  // redirect after delete (change this route if you want)
  redirect("/maels");
}
