"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgePercent, ChefHat, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type HeroFoodProps = {
  className?: string;
};

export function HeroFood({ className }: HeroFoodProps) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      {/* Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(70rem_35rem_at_50%_-10%,hsl(var(--primary)/0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40rem_20rem_at_10%_20%,hsl(var(--primary)/0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40rem_20rem_at_90%_30%,hsl(var(--primary)/0.08),transparent_55%)]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left */}
          <div className="space-y-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                <span className="mr-2 inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <BadgePercent className="size-3.5" />
                </span>
                Free delivery over $25
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                <span className="mr-2 inline-flex size-5 items-center justify-center rounded-full bg-muted text-foreground">
                  <Truck className="size-3.5" />
                </span>
                30–45 min avg
              </Badge>
            </div>

            <div className="space-y-3">
              <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                Fresh food delivered <span className="text-primary">fast</span>,
                every day.
              </h1>
              <p className="max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
                Discover local favorites, chef-made meals, and everyday
                essentials. Order in seconds, track in real time, and enjoy.
              </p>
            </div>

            {/* Search / CTA */}
            <Card className="rounded-2xl border bg-card/60 p-3 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <Input
                    className="h-11 rounded-xl"
                    placeholder="Search dishes, restaurants, or groceries…"
                    aria-label="Search food"
                  />
                </div>
                <Button className="h-11 rounded-xl">
                  Search
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border bg-background/60 px-3 py-1">
                  Popular: Burger
                </span>
                <span className="rounded-full border bg-background/60 px-3 py-1">
                  Pizza
                </span>
                <span className="rounded-full border bg-background/60 px-3 py-1">
                  Biryani
                </span>
                <span className="rounded-full border bg-background/60 px-3 py-1">
                  Sushi
                </span>
                <span className="rounded-full border bg-background/60 px-3 py-1">
                  Desserts
                </span>
              </div>
            </Card>

            {/* Secondary actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild className="h-11 rounded-xl">
                <Link href="/menu">Explore menu</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-xl">
                <Link href="/offers">View offers</Link>
              </Button>
            </div>

            {/* Trust row */}
            <div className="grid gap-3 sm:grid-cols-3">
              <TrustItem
                icon={<ChefHat className="size-4" />}
                title="Chef-made"
                desc="Quality you can taste"
              />
              <TrustItem
                icon={<Truck className="size-4" />}
                title="Fast delivery"
                desc="Live order tracking"
              />
              <TrustItem
                icon={<BadgePercent className="size-4" />}
                title="Best deals"
                desc="Daily discounts"
              />
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border bg-card shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

              {/* Replace with your own hero image */}
              <Image
                src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1600&q=80"
                alt="Fresh food hero"
                width={1600}
                height={1200}
                className="h-[360px] w-full object-cover sm:h-[420px] lg:h-[520px]"
                priority
              />

              {/* Floating stats */}
              <div className="absolute left-4 top-4 rounded-2xl border bg-background/70 p-3 shadow-sm backdrop-blur">
                <p className="text-xs text-muted-foreground">Today’s rating</p>
                <p className="text-lg font-semibold">4.8 ★</p>
              </div>

              <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:grid-cols-3">
                <StatPill label="Delivering to" value="Your area" />
                <StatPill label="ETA" value="30–45 min" />
                <StatPill label="New users" value="15% off" />
              </div>
            </div>

            {/* Accent glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-primary/10 blur-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border bg-card/50 p-4 backdrop-blur">
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold leading-none">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-background/70 p-3 text-center shadow-sm backdrop-blur">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
