import { z } from "zod";

export const reviewSchema = z.object({
  mealId: z.string().min(1, "Meal is required."),
  rating: z.coerce
    .number()
    .int("Choose a whole-number rating.")
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating cannot be more than 5."),
  comment: z.string().trim().max(1000, "Review is too long.").optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
