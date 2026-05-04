import { z } from "zod";

export const orderSchema = z.object({
  deliveryAddress: z
    .string()
    .trim()
    .min(5, "Enter a complete delivery address."),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number.")
    .max(20, "Phone number is too long."),
  note: z.string().trim().max(500, "Note is too long.").optional(),
  deliveryFee: z.coerce.number().min(0, "Delivery fee cannot be negative."),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
