"use server";

import { userService } from "@/services/auth.service";
import { reviewsService } from "@/services/reviews.service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateReviewActionInput = {
  mealId: string;
  rating: number; // 1..5
  comment?: string;
};

export const createReview = async (data: CreateReviewActionInput) => {
  const { data: authData, error } = await userService.getSession();

  if (error || !authData?.session?.userId) {
    return { error: { message: "Unauthorized" } };
  }

  const customerId = authData.session.userId;

  // validation
  if (!data.mealId) return { error: { message: "Meal is required" } };
  if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
    return { error: { message: "Rating must be 1 to 5" } };
  }

  const res = await reviewsService.createReview({
    customerId, // ✅ use session customerId
    mealId: data.mealId,
    rating: data.rating,
    comment: data.comment?.trim() || undefined,
  });

  if (res.error) return res;

  // revalidatePath("/reviews");
  // revalidatePath(`/meals/${data.mealId}`);

  redirect(`/meals/${data.mealId}`);
};
