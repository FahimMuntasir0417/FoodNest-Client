"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.email("Enter a valid email address."),
  topic: z.string().trim().min(3, "Enter a topic."),
  message: z.string().trim().min(12, "Tell us how we can help."),
});

type ContactValues = z.infer<typeof contactSchema>;

function fieldError(message?: string) {
  return message ? [{ message }] : undefined;
}

export function ContactForm() {
  const [success, setSuccess] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", topic: "", message: "" },
  });

  function onSubmit() {
    setSuccess(false);

    return new Promise<void>((resolve) => {
      window.setTimeout(() => {
        setSuccess(true);
        reset();
        resolve();
      }, 700);
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-lg border bg-card p-5 shadow-sm"
      noValidate
    >
      <FieldGroup>
        <Field data-invalid={Boolean(errors.name)}>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            disabled={isSubmitting}
            {...register("name")}
          />
          <FieldError errors={fieldError(errors.name?.message)} />
        </Field>

        <Field data-invalid={Boolean(errors.email)}>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            disabled={isSubmitting}
            {...register("email")}
          />
          <FieldError errors={fieldError(errors.email?.message)} />
        </Field>

        <Field data-invalid={Boolean(errors.topic)}>
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            aria-invalid={Boolean(errors.topic)}
            disabled={isSubmitting}
            {...register("topic")}
          />
          <FieldError errors={fieldError(errors.topic?.message)} />
        </Field>

        <Field data-invalid={Boolean(errors.message)}>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            rows={5}
            aria-invalid={Boolean(errors.message)}
            disabled={isSubmitting}
            {...register("message")}
          />
          <FieldError errors={fieldError(errors.message?.message)} />
        </Field>
      </FieldGroup>

      <div className="mt-6 flex flex-col gap-3">
        <Button type="submit" className="rounded-md" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send message"}
          <Send className="size-4" />
        </Button>
        {success ? (
          <p className="text-sm font-medium text-primary">
            Message received. FoodNest support will follow up by email.
          </p>
        ) : null}
      </div>
    </form>
  );
}
