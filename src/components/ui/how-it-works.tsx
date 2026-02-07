"use client";

import * as React from "react";
import Link from "next/link";
import {
  CreditCard,
  MapPin,
  PackageCheck,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function HowItWorks({
  className,
  title = "How it works",
  subtitle = "Order in minutes. Eat in comfort.",
}: {
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className={cn("py-10 md:py-14", className)}>
      <div className="container mx-auto max-w-8xl px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          {/* Steps */}
          <Card className="relative overflow-hidden rounded-3xl border bg-card/60 shadow-sm backdrop-blur">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
              <div className="absolute -left-20 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
            </div>

            <CardContent className="relative p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                    <Sparkles className="size-3.5 text-primary" />
                    Simple, fast, reliable
                  </div>

                  <h2 className="mt-3 text-xl font-semibold tracking-tight md:text-2xl">
                    {title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground md:text-base">
                    {subtitle}
                  </p>
                </div>

                <div className="hidden sm:flex">
                  <div className="rounded-2xl border bg-background/60 p-3 text-center shadow-sm backdrop-blur">
                    <p className="text-[11px] text-muted-foreground">Avg ETA</p>
                    <p className="text-sm font-semibold">30–45 min</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Step
                  step="01"
                  icon={<MapPin className="h-4 w-4" />}
                  title="Choose"
                  desc="Pick meals & set delivery location."
                />
                <Step
                  step="02"
                  icon={<CreditCard className="h-4 w-4" />}
                  title="Pay"
                  desc="Secure checkout in seconds."
                />
                <Step
                  step="03"
                  icon={<PackageCheck className="h-4 w-4" />}
                  title="Enjoy"
                  desc="Live tracking to your doorstep."
                />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild className="h-11 rounded-xl">
                  <Link href="/maels">
                    Order now <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-11 rounded-xl">
                  <Link href="/offers">See deals</Link>
                </Button>

                <div className="hidden flex-1 sm:block" />

                <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                  <ShieldCheck className="size-4" />
                  Secure payments • Verified vendors
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid gap-3 sm:grid-cols-3">
                <MiniStat label="Fast checkout" value="1-tap pay" />
                <MiniStat label="Live tracking" value="Real-time" />
                <MiniStat label="Support" value="24/7" />
              </div>
            </CardContent>
          </Card>

          {/* CTA Card */}
          <Card className="relative overflow-hidden rounded-3xl border bg-background shadow-sm">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/14 via-transparent to-transparent" />
              <div className="absolute -left-24 -top-24 size-72 rounded-full bg-primary/15 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-primary/10 blur-3xl" />
            </div>

            <CardContent className="relative flex h-full flex-col p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                    <Smartphone className="size-3.5 text-primary" />
                    Get the app
                  </div>

                  <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                    Faster reordering, exclusive coupons.
                  </h3>
                  <p className="mt-2 max-w-lg text-sm text-muted-foreground md:text-base">
                    Save favorites, reorder in one tap, and unlock app-only
                    deals every day.
                  </p>
                </div>

                <div className="hidden sm:block">
                  <div className="rounded-2xl border bg-background/60 p-3 shadow-sm backdrop-blur">
                    <p className="text-[11px] text-muted-foreground">
                      New users
                    </p>
                    <p className="text-sm font-semibold">15% off</p>
                  </div>
                </div>
              </div>

              {/* Download buttons */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button className="h-11 rounded-xl">
                  Download for Android
                </Button>
                <Button variant="outline" className="h-11 rounded-xl">
                  Download for iOS
                </Button>
              </div>

              {/* Feature chips */}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <FeatureChip
                  title="Faster checkout"
                  desc="Saved address & payment"
                />
                <FeatureChip
                  title="Track in real time"
                  desc="Rider updates & ETA"
                />
                <FeatureChip title="Daily offers" desc="App-only discounts" />
              </div>

              <div className="mt-6 flex-1" />

              {/* Bottom row */}
              <div className="mt-6 rounded-2xl border bg-muted/30 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm">
                    <p className="font-semibold">Ready to order?</p>
                    <p className="text-muted-foreground">
                      Browse trending meals and get delivery in 30–45 minutes.
                    </p>
                  </div>
                  <Button asChild className="h-11 rounded-xl">
                    <Link href="/maels">
                      Browse meals <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Step({
  step,
  icon,
  title,
  desc,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="group relative rounded-2xl border bg-background/60 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {icon}
            </div>
            <p className="text-sm font-semibold">{title}</p>
          </div>

          <span className="rounded-full border bg-background/70 px-2 py-0.5 text-[11px] text-muted-foreground">
            {step}
          </span>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">{desc}</p>

        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/3 rounded-full bg-primary/40 transition-all group-hover:w-2/3" />
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-background/60 p-3 text-center backdrop-blur">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function FeatureChip({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-background/60 p-4 backdrop-blur">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
