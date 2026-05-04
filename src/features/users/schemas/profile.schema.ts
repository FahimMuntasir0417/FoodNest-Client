import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  phone: z
    .union([
      z
        .string()
        .trim()
        .min(10, "Enter a valid phone number.")
        .max(20, "Phone number is too long."),
      z.literal(""),
    ])
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
