"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/foodnest-data";

export type HeroSlide = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  meta: string;
  price?: number | null;
};

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const active = slides[activeIndex] ?? slides[0];

  React.useEffect(() => {
    if (slides.length <= 1) return;

    const id = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(id);
  }, [slides.length]);

  const previous = () => {
    setActiveIndex((index) => (index === 0 ? slides.length - 1 : index - 1));
  };

  const next = () => {
    setActiveIndex((index) => (index + 1) % slides.length);
  };

  if (!active) return null;

  return (
    <section className="relative min-h-[62vh] overflow-hidden border-b bg-muted">
      <Image
        src={active.imageUrl}
        alt={active.title}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-background/15 dark:bg-background/27" />

      <div className="relative mx-auto flex min-h-[62vh] max-w-7xl flex-col justify-center px-4 py-14 md:px-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-md border bg-background/90 px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm">
            {active.meta}
          </div>

          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            FoodNest
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            Order fresh meals from verified local providers, compare menus by
            cuisine and price, and track every order from a role-aware
            dashboard.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 rounded-md">
              <Link href="/maels">
                Explore meals
                <Search className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 rounded-md"
            >
              <Link href={active.href}>
                Featured: {active.title}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="rounded-lg border bg-card/95 p-4 shadow-sm">
            <p className="text-sm font-semibold">{active.title}</p>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {active.description}
            </p>
            {typeof active.price === "number" ? (
              <p className="mt-3 text-sm font-medium">
                Starts at {formatMoney(active.price)}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-md bg-background/95"
              onClick={previous}
              aria-label="Previous featured meal"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-md bg-background/95"
              onClick={next}
              aria-label="Next featured meal"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
