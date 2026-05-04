import { z } from "zod";

export const mealSchema = z.object({
  categoryId: z.string().min(1, "Choose a category."),
  title: z.string().trim().min(2, "Meal title must be at least 2 characters."),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters."),
  price: z.coerce.number().positive("Price must be greater than 0."),
  imageUrl: z
    .string()
    .trim()
    .url("Enter a valid image URL.")
    .optional()
    .or(z.literal("")),
  cuisine: z.string().trim().max(80, "Cuisine name is too long.").optional(),
  isAvailable: z.coerce.boolean().optional(),
});

export type MealFormValues = z.infer<typeof mealSchema>;
