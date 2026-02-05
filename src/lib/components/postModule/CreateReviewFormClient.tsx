"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Field, FieldError, FieldGroup } from "@/lib/components/ui/field";
import { createReview } from "@/actions/reviews.action";

// ✅ make FieldLabel a real <label> so htmlFor works
export const FieldLabel = Label;

const schema = z.object({
  mealId: z.string().min(1, "Meal is required"),
  // ✅ accept string/number from input; coerce to number for validation/output
  rating: z.coerce.number().int().min(1, "Min 1").max(5, "Max 5"),
  comment: z
    .string()
    .max(2000, "Max 2000 characters")
    .optional()
    .or(z.literal("")),
});

type ReviewFormValues = {
  mealId: string;
  rating: string; // keep as string in the form
  comment: string;
};

export function CreateReviewFormClient({ mealId }: { mealId: string }) {
  const form = useForm({
    defaultValues: {
      mealId,
      rating: "5", // ✅ string to match input
      comment: "",
    } satisfies ReviewFormValues,

    // ✅ wrap schema in a validator fn (avoids StandardSchema typing issues)
    validators: {
      onSubmit: ({ value }) => {
        const result = schema.safeParse(value);
        if (result.success) return;

        const fe = result.error.flatten().fieldErrors;
        return Object.fromEntries(
          Object.entries(fe).map(([k, v]) => [k, v?.[0] ?? "Invalid value"]),
        );
      },
    },

    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Submitting review...");
      try {
        const parsed = schema.parse(value);

        const res = await createReview({
          mealId: parsed.mealId,
          rating: parsed.rating,
          comment: parsed.comment?.trim() ? parsed.comment.trim() : undefined,
        });

        if (res?.error) {
          toast.error(res.error.message, { id: toastId });
          return;
        }

        toast.dismiss(toastId);
        form.reset();
      } catch {
        toast.error("Something went wrong", { id: toastId });
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <form.Field name="rating">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="rating">Rating (1-5)</FieldLabel>
                <Input
                  id="rating"
                  type="number"
                  min={1}
                  max={5}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="comment">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="comment">Comment (optional)</FieldLabel>
                <Textarea
                  id="comment"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Write your review..."
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <Button type="submit" className="w-full">
        Submit Review
      </Button>
    </form>
  );
}
