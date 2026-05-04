import { ShieldCheck, Store, UserRound } from "lucide-react";
import Link from "next/link";

import { LoginForm } from "@/lib/components/ui/login-form";

const demoRoles = [
  { title: "Admin", icon: ShieldCheck },
  { title: "Provider", icon: Store },
  { title: "Customer", icon: UserRound },
];

export default function Page() {
  return (
    <section className="min-h-[calc(100svh-4rem)] bg-muted/30 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100svh-10rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="hidden min-h-[620px] flex-col justify-between rounded-lg bg-[#102218] p-8 text-white shadow-xl shadow-primary/10 lg:flex">
          <div className="space-y-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-md bg-white text-sm font-semibold text-[#102218]">
                FN
              </span>
              <span className="text-lg font-semibold">FoodNest</span>
            </Link>

            <div className="max-w-md space-y-4">
              <p className="text-sm font-medium text-white/60">
                Secure access
              </p>
              <h1 className="text-4xl font-semibold leading-tight">
                Sign in with the right FoodNest role.
              </h1>
              <p className="text-sm leading-6 text-white/70">
                Choose one of the demo roles in the form and continue to the
                matching dashboard.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {demoRoles.map((role) => {
              const Icon = role.icon;

              return (
                <div
                  key={role.title}
                  className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 p-3"
                >
                  <span className="flex size-9 items-center justify-center rounded-md bg-white/10">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-sm font-medium">{role.title}</span>
                </div>
              );
            })}
          </div>
        </aside>

        <div className="mx-auto w-full max-w-xl">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                FN
              </span>
              <span className="text-lg font-semibold">FoodNest</span>
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </div>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
