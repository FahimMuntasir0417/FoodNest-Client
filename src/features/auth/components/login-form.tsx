"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Chrome,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login.schema";
import { getDashboardPath } from "@/features/auth/services/permissions";
import type { AuthResponse } from "@/features/auth/types/auth.types";
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

type DemoAccount = {
  role: "Admin" | "Provider" | "Customer";
  email: string;
  password: string;
  icon: LucideIcon;
  tone: string;
};

const demoAccounts: DemoAccount[] = [
  {
    role: "Admin",
    email: "admin@admin.com",
    password: "admin1234",
    icon: ShieldCheck,
    tone: "border-primary/30 bg-primary/5 hover:bg-primary/10",
  },
  {
    role: "Provider",
    email: "hixemom794@azeriom.com",
    password: "12345@#$",
    icon: Store,
    tone: "border-secondary/70 bg-secondary/20 hover:bg-secondary/30",
  },
  {
    role: "Customer",
    email: "y41lhw4kb3@ozsaip.com",
    password: "12345@#$",
    icon: UserRound,
    tone: "border-accent/80 bg-accent/40 hover:bg-accent/60",
  },
];

function fieldError(message?: string) {
  return message ? [{ message }] : undefined;
}

type SignInData = {
  user?: {
    role?: string | null;
  } | null;
};

async function getSignedInDashboardPath(data: unknown) {
  const signInRole = (data as SignInData | null)?.user?.role;

  if (signInRole) {
    return getDashboardPath(signInRole);
  }

  try {
    const response = await fetch("/api/auth/get-session", {
      cache: "no-store",
      credentials: "include",
    });

    if (!response.ok) {
      return getDashboardPath();
    }

    const session = (await response.json()) as AuthResponse | null;
    return getDashboardPath(session?.user?.role);
  } catch {
    return getDashboardPath();
  }
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [selectedDemo, setSelectedDemo] =
    React.useState<DemoAccount["role"] | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const toastId = toast.loading("Logging in...");

    try {
      const { data, error } = await authClient.signIn.email(values);

      if (error) {
        toast.error(error.message ?? "Unable to log in.", { id: toastId });
        return;
      }

      const dashboardPath = await getSignedInDashboardPath(data);

      toast.success("Logged in successfully", { id: toastId });
      router.refresh();
      router.replace(dashboardPath);
    } catch {
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
  };

  const fillDemoCredentials = (account: DemoAccount) => {
    setSelectedDemo(account.role);
    setValue("email", account.email, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue("password", account.password, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    toast.success(`${account.role} demo credentials filled`);
  };

  const socialLogin = async () => {
    const toastId = toast.loading("Opening Google login...");

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/customer-dashboard",
      });

      if (error) {
        toast.error(error.message ?? "Social login is unavailable.", {
          id: toastId,
        });
        return;
      }

      toast.success("Redirecting to social login", { id: toastId });
    } catch {
      toast.error("Social login could not be started.", { id: toastId });
    }
  };

  return (
    <Card
      {...props}
      className={cn(
        "w-full max-w-lg overflow-hidden rounded-lg border bg-card shadow-xl shadow-primary/5",
        className,
      )}
    >
      <CardHeader className="space-y-3 border-b pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription className="text-sm leading-6">
              Use your account or select a demo role.
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Demo login</p>
              <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                One click fill
              </span>
            </div>
            <div className="grid gap-2">
              {demoAccounts.map((account) => {
                const Icon = account.icon;

                return (
                  <Button
                    key={account.role}
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => fillDemoCredentials(account)}
                    className={cn(
                      "h-auto w-full justify-start gap-3 whitespace-normal rounded-md border p-3 text-left shadow-none",
                      account.tone,
                      selectedDemo === account.role &&
                        "ring-2 ring-ring ring-offset-2 ring-offset-background",
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background text-foreground shadow-sm">
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {account.role}
                      </span>
                      <span className="block truncate text-xs font-normal text-muted-foreground">
                        {account.email}
                      </span>
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          <FieldSeparator>or use email</FieldSeparator>

          <FieldGroup className="gap-4">
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
                  autoComplete="current-password"
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
            {isSubmitting ? "Logging in..." : "Login"}
            <ArrowRight className="size-4" />
          </Button>

          <FieldSeparator>or continue with</FieldSeparator>

          <div className="grid w-full gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-md"
              disabled={isSubmitting}
              onClick={socialLogin}
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
