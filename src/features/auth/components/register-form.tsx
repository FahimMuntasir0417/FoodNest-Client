"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Chrome,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/register.schema";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function fieldError(message?: string) {
  return message ? [{ message }] : undefined;
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", phone: "", email: "", password: "" },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    const toastId = toast.loading("Creating account...");

    try {
      const { error } = await authClient.signUp.email(values);

      if (error) {
        toast.error(error.message ?? "Unable to create account.", {
          id: toastId,
        });
        return;
      }

      toast.success("Account created successfully", { id: toastId });
      router.refresh();
      router.replace("/");
    } catch {
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
  };

  const socialRegister = async () => {
    const toastId = toast.loading("Opening Google signup...");

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message ?? "Social signup is unavailable.", {
          id: toastId,
        });
        return;
      }

      toast.success("Redirecting to social signup", { id: toastId });
    } catch {
      toast.error("Social signup could not be started.", { id: toastId });
    }
  };

  return (
    <Card
      {...props}
      className={cn(
        "w-full max-w-xl overflow-hidden rounded-lg border bg-card shadow-xl shadow-primary/5",
        className,
      )}
    >
      <CardHeader className="space-y-3 border-b pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-2xl">Create account</CardTitle>
            <CardDescription className="text-sm leading-6">
              Enter your details to create a FoodNest account.
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="pt-6">
          <FieldGroup className="gap-4">
            <Field data-invalid={Boolean(errors.name)}>
              <Label htmlFor="name" className="text-sm font-medium">
                Full name
              </Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  aria-invalid={Boolean(errors.name)}
                  disabled={isSubmitting}
                  className="h-11 pl-10"
                  {...register("name")}
                />
              </div>
              <FieldError errors={fieldError(errors.name?.message)} />
            </Field>

            <Field data-invalid={Boolean(errors.phone)}>
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone
              </Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+8801XXXXXXXXX"
                  aria-invalid={Boolean(errors.phone)}
                  disabled={isSubmitting}
                  className="h-11 pl-10"
                  {...register("phone")}
                />
              </div>
              <FieldError errors={fieldError(errors.phone?.message)} />
            </Field>

            <Field data-invalid={Boolean(errors.email)}>
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  disabled={isSubmitting}
                  className="h-11 pl-10"
                  {...register("email")}
                />
              </div>
              <FieldError errors={fieldError(errors.email?.message)} />
            </Field>

            <Field data-invalid={Boolean(errors.password)}>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
              </div>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="********"
                  aria-invalid={Boolean(errors.password)}
                  disabled={isSubmitting}
                  className="h-11 pl-10 pr-11"
                  {...register("password")}
                />
                <button
                  type="button"
                  title={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              <FieldError errors={fieldError(errors.password?.message)} />
            </Field>
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex flex-col items-stretch gap-4 pt-6">
          <Button
            type="submit"
            className="h-11 w-full rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create account"}
            <ArrowRight className="size-4" />
          </Button>

          <FieldSeparator>or sign up with</FieldSeparator>

          <div className="grid w-full gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-md"
              disabled={isSubmitting}
              onClick={socialRegister}
            >
              <Chrome className="size-4" />
              Google
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
