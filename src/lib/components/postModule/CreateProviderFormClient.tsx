"use client";

import { createProvider } from "@/actions/providers.action";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldError, FieldGroup } from "../ui/field";

// ✅ ensure FieldLabel is a real <label> (supports htmlFor)
export const FieldLabel = Label;

const providerSchema = z.object({
  shopName: z
    .string()
    .min(2, "Shop name must be at least 2 characters")
    .max(120, "Shop name must be less than 120 characters"),
  description: z
    .string()
    .max(2000, "Description must be less than 2000 characters")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(300, "Address must be less than 300 characters")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(30, "Phone must be less than 30 characters")
    .optional()
    .or(z.literal("")),
  logoUrl: z
    .string()
    .url("Logo URL must be a valid URL")
    .optional()
    .or(z.literal("")),
});

type ProviderFormValues = {
  shopName: string;
  description: string;
  address: string;
  phone: string;
  logoUrl: string;
};

const defaultValues: ProviderFormValues = {
  shopName: "",
  description: "",
  address: "",
  phone: "",
  logoUrl: "",
};

export function CreateProviderFormClient() {
  const form = useForm({
    defaultValues,

    // ✅ fix: wrap zod schema in a validator function (avoids StandardSchema typing issues)
    validators: {
      onSubmit: ({ value }) => {
        const result = providerSchema.safeParse(value);
        if (result.success) return;

        const fe = result.error.flatten().fieldErrors;
        return Object.fromEntries(
          Object.entries(fe).map(([k, v]) => [k, v?.[0] ?? "Invalid value"]),
        );
      },
    },

    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating provider...");

      try {
        const parsed = providerSchema.parse(value);

        const res = await createProvider({
          shopName: parsed.shopName.trim(),
          description: parsed.description?.trim()
            ? parsed.description.trim()
            : null,
          address: parsed.address?.trim() ? parsed.address.trim() : null,
          phone: parsed.phone?.trim() ? parsed.phone.trim() : null,
          logoUrl: parsed.logoUrl?.trim() ? parsed.logoUrl.trim() : null,
        });

        // If action redirects on success, code below only runs on error cases.
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
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Provider</CardTitle>
        <CardDescription>
          Enter provider details to create a new provider
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="provider-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="shopName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Shop Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="My Shop"
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
                      placeholder="Short description..."
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="address"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Dhaka, Bangladesh"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="phone"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="+8801XXXXXXXXX"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="logoUrl"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Logo URL</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="https://example.com/logo.png"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col">
        <Button form="provider-form" type="submit" className="w-full">
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
