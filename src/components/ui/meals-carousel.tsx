"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function formatBDT(amount: number) {
  try {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  } catch {
    return `৳${amount}`;
  }
}

export function MealsCarousel({
  meals,
  title = "Featured meals",
  subtitle = "Top picks you can order right now",
}: {
  meals: any[];
  title?: string;
  subtitle?: string;
}) {
  const items = (meals ?? []).slice(0, 12);

  if (!items.length) return null;

  return (
    <section className="mt-8 rounded-3xl border bg-card/60 p-5 shadow-sm backdrop-blur md:p-7">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-xl"
            aria-label="Previous"
            onClick={() => {
              // handled by CarouselPrevious; this is just here for UI symmetry
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-xl"
            aria-label="Next"
            onClick={() => {
              // handled by CarouselNext
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-3">
          {items.map((m: any) => (
            <CarouselItem key={m.id} className="pl-3 sm:basis-1/2 lg:basis-1/3">
              <Card className="group overflow-hidden rounded-2xl border bg-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <Link href={`/maels/${m.id}`} className="block">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    {m.imageUrl ? (
                      <Image
                        src={m.imageUrl}
                        alt={m.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                        No image
                      </div>
                    )}

                    {/* Availability pill */}
                    <div className="absolute left-3 top-3">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                          m.isAvailable
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700",
                        ].join(" ")}
                      >
                        {m.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    {/* Optional “rating” look (static UI) */}
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border bg-background/70 px-2.5 py-1 text-xs backdrop-blur">
                      <Star className="h-3.5 w-3.5" />
                      <span>4.8</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold">
                          {m.title}
                        </h3>
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {m.cuisine ? `${m.cuisine} • ` : ""}
                          {m.category?.name ?? "Uncategorized"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-lg font-semibold">
                        {formatBDT(Number(m.price ?? 0))}
                      </div>

                      <span className="inline-flex items-center rounded-xl border px-3 py-1.5 text-sm font-medium transition group-hover:bg-muted">
                        View
                        <span className="ml-1 transition group-hover:translate-x-0.5">
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* shadcn arrows */}
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}
