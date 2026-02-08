"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Field, FieldError, FieldGroup } from "./field";

export const FieldLabel = Label;

const formSchema = z.object({
  name: z.string().min(1, "This field is required"),
  phone: z
    .string()
    .min(10, "Phone number is too short")
    .max(20, "Phone number is too long"),
  email: z.email(),
  password: z.string().min(8, "Minimum length is 8"),
});

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M44.5 20H24v8.5h11.7C34.3 33.7 30 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.5 0 6.4 1.2 8.7 3.4l6-6C35.6 4.9 30.2 2.9 24 2.9 12.4 2.9 3 12.3 3 23.9S12.4 45 24 45c11.2 0 20.5-8.1 20.5-21.1 0-1.4-.2-2.7-.5-3.9Z"
      />
      <path
        fill="currentColor"
        d="M6.3 14.7 13 19.6C14.8 15.1 19 12 24 12c3.5 0 6.4 1.2 8.7 3.4l6-6C35.6 4.9 30.2 2.9 24 2.9c-8.1 0-15.2 4.6-18.7 11.8Z"
        opacity=".35"
      />
      <path
        fill="currentColor"
        d="M24 45c6 0 11.5-1.9 15.7-5.3l-7.2-5.9C30.6 35.5 27.6 37 24 37c-6 0-10.3-3.3-11.9-8.5l-6.8 5.2C8.8 40.9 15.9 45 24 45Z"
        opacity=".35"
      />
      <path
        fill="currentColor"
        d="M44.5 20H24v8.5h11.7c-.8 2.3-2.2 4.1-4 5.3l7.2 5.9C42.7 36.3 45 31.2 45 23.9c0-1.4-.2-2.7-.5-3.9Z"
        opacity=".35"
      />
    </svg>
  );
}

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const form = useForm({
    defaultValues: { name: "", phone: "", email: "", password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating account…");
      setIsSubmitting(true);

      try {
        const { error } = await authClient.signUp.email(value as any);

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("Account created successfully", { id: toastId });
        router.refresh();
        router.replace("/");
      } catch {
        toast.error("Something went wrong, please try again.", { id: toastId });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Card
      {...props}
      className={[
        "relative w-full max-w-md overflow-hidden border bg-card/60 shadow-lg",
        "backdrop-blur supports-[backdrop-filter]:bg-card/50",
        "rounded-2xl",
        props.className,
      ].join(" ")}
    >
      {/* subtle gradient highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent"
      />

      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription className="text-sm">
          Enter your details below to get started.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* <Button
          onClick={handleGoogleLogin}
          variant="outline"
          type="button"
          className="w-full h-11 rounded-xl"
          disabled={isGoogleLoading || isSubmitting}
        >
          <GoogleIcon className="mr-2 h-4 w-4" />
          {isGoogleLoading ? "Opening Google…" : "Continue with Google"}
        </Button> */}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <form
          id="register-form"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-sm font-medium"
                    >
                      Full name
                    </FieldLabel>

                    <Input
                      type="text"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Your name"
                      autoComplete="name"
                      className={[
                        "h-11 rounded-xl",
                        "transition-shadow",
                        "focus-visible:ring-2 focus-visible:ring-primary/40",
                        isInvalid
                          ? "border-destructive focus-visible:ring-destructive/30"
                          : "",
                      ].join(" ")}
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
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-sm font-medium"
                    >
                      Phone
                    </FieldLabel>

                    <Input
                      type="tel"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="+8801XXXXXXXXX"
                      autoComplete="tel"
                      className={[
                        "h-11 rounded-xl",
                        "transition-shadow",
                        "focus-visible:ring-2 focus-visible:ring-primary/40",
                        isInvalid
                          ? "border-destructive focus-visible:ring-destructive/30"
                          : "",
                      ].join(" ")}
                    />

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-sm font-medium"
                    >
                      Email
                    </FieldLabel>

                    <Input
                      type="email"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={[
                        "h-11 rounded-xl",
                        "transition-shadow",
                        "focus-visible:ring-2 focus-visible:ring-primary/40",
                        isInvalid
                          ? "border-destructive focus-visible:ring-destructive/30"
                          : "",
                      ].join(" ")}
                    />

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-sm font-medium"
                      >
                        Password
                      </FieldLabel>

                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        disabled={isSubmitting}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>

                    <Input
                      type={showPassword ? "text" : "password"}
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={[
                        "h-11 rounded-xl",
                        "transition-shadow",
                        "focus-visible:ring-2 focus-visible:ring-primary/40",
                        isInvalid
                          ? "border-destructive focus-visible:ring-destructive/30"
                          : "",
                      ].join(" ")}
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

      <CardFooter className="flex flex-col gap-3">
        <Button
          form="register-form"
          type="submit"
          className="w-full h-11 rounded-xl"
          disabled={isSubmitting || isGoogleLoading}
        >
          {isSubmitting ? "Creating…" : "Create account"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By continuing, you agree to our{" "}
          <span className="underline underline-offset-4">Terms</span> and{" "}
          <span className="underline underline-offset-4">Privacy Policy</span>.
        </p>
      </CardFooter>
    </Card>
  );
}
