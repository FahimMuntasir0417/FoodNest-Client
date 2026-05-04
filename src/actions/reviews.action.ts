"use server";

import { getSession } from "@/services/auth.service";
import { reviewsService } from "@/services/reviews.service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateReviewActionInput = {
  mealId: string;
  rating: number; // 1..5
  comment?: string;
};

function getUserId(authData: any): string | null {
  return authData?.session?.userId ?? authData?.user?.id ?? null;
}

export const createReview = async (data: CreateReviewActionInput) => {
  const { data: authData, error } = await getSession();
  const userId = getUserId(authData);

  if (error || !userId) {
    return { error: { message: "Unauthorized" } };
  }

  // validation
  if (!data.mealId) return { error: { message: "Meal is required" } };
  if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
    return { error: { message: "Rating must be 1 to 5" } };
  }

  const res = await reviewsService.createReview({
    mealId: data.mealId,
    rating: data.rating,
    comment: data.comment?.trim() || undefined,
  });

  if (res.error) return res;

  revalidatePath("/reviews");
  revalidatePath(`/maels/${data.mealId}`);

  redirect(`/maels/${data.mealId}`);
};
