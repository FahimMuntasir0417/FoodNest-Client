"use client";

import { createMeal } from "@/actions/meals.action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldError, FieldGroup } from "../ui/field";

export const FieldLabel = Label;

const mealSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(5000),
  price: z.coerce.number().positive("Price must be greater than 0"),
  imageUrl: z
    .string()
    .url("Image URL must be valid")
    .optional()
    .or(z.literal("")),
  cuisine: z.string().max(80).optional().or(z.literal("")),
  isAvailable: z.coerce.boolean().optional(),
});

type MealFormValues = {
  categoryId: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  cuisine: string;
  isAvailable: boolean;
};

type CreateMealFormClientProps = {
  categoryId: string;
};

export function CreateMealFormClient({
  categoryId,
}: CreateMealFormClientProps) {
  const form = useForm({
    defaultValues: {
      categoryId,
      title: "",
      description: "",
      price: "",
      imageUrl: "",
      cuisine: "",
      isAvailable: true,
    } satisfies MealFormValues,

    validators: {
      onSubmit: ({ value }) => {
        const result = mealSchema.safeParse(value);
        if (result.success) return;

        const fe = result.error.flatten().fieldErrors;
        return Object.fromEntries(
          Object.entries(fe).map(([k, v]) => [k, v?.[0] ?? "Invalid value"]),
        );
      },
    },

    onSubmit: async ({ value }) => {
      console.log("✅ SUBMIT FIRED:", value);

      const toastId = toast.loading("Creating meal...");
      try {
        const parsed = mealSchema.parse(value);

        const res = await createMeal({
          categoryId: parsed.categoryId.trim(),
          title: parsed.title.trim(),
          description: parsed.description.trim(),
          price: parsed.price,
          imageUrl: parsed.imageUrl?.trim() ? parsed.imageUrl.trim() : null,
          cuisine: parsed.cuisine?.trim() ? parsed.cuisine.trim() : null,
          isAvailable: parsed.isAvailable ?? true,
        });

        if (res?.error) {
          toast.error(res.error.message, { id: toastId });
          return;
        }

        toast.dismiss(toastId);

        form.reset({
          categoryId,
          title: "",
          description: "",
          price: "",
          imageUrl: "",
          cuisine: "",
          isAvailable: true,
        });
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong", { id: toastId });
      }
    },
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Meal</CardTitle>
        <CardDescription>Add a new meal</CardDescription>
      </CardHeader>

      <CardContent>
        {/* ✅ method="post" prevents querystring GET submits */}
        <form
          id="meal-form"
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* ✅ Keep categoryId in form state but hidden */}
            <form.Field
              name="categoryId"
              children={(field) => (
                <input
                  type="hidden"
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />

            <form.Field
              name="title"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Chicken Biryani"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Describe the meal..."
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="price"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="250"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="imageUrl"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Image URL (optional)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="https://example.com/meal.jpg"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="cuisine"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Cuisine (optional)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Bangladeshi"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              Submit
            </button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
