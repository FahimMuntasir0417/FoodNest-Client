"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateMyProfile } from "@/actions/users.action";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/features/users/schemas/profile.schema";

function fieldError(message?: string) {
  return message ? [{ message }] : undefined;
}

export function ProfileForm({
  defaultValues,
}: {
  defaultValues: ProfileFormValues;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  async function onSubmit(values: ProfileFormValues) {
    const toastId = toast.loading("Updating profile...");
    const result = await updateMyProfile({
      name: values.name,
      phone: values.phone || null,
    });

    if (result.error) {
      toast.error(result.error.message, { id: toastId });
      return;
    }

    toast.success("Profile updated", { id: toastId });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={Boolean(errors.name)}>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            autoComplete="name"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.name)}
            className="rounded-md"
            {...register("name")}
          />
          <FieldError errors={fieldError(errors.name?.message)} />
        </Field>

        <Field data-invalid={Boolean(errors.phone)}>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.phone)}
            className="rounded-md"
            {...register("phone")}
          />
          <FieldError errors={fieldError(errors.phone?.message)} />
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        className="mt-6 rounded-md"
        disabled={isSubmitting || !isDirty}
      >
        <Save className="size-4" />
        {isSubmitting ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
