import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Enter your full name."),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number.")
    .max(20, "Phone number is too long."),
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
