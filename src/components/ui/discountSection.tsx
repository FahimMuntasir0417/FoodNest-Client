"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function msToParts(ms: number) {
  const total = Math.max(0, ms);
  const s = Math.floor(total / 1000);

  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  return { days, hours, minutes, seconds };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function DiscountTimerSection({
  className,
  endsAt,
  // ✅ set this to 50 to test days changing (optional)
  testHours,
}: {
  className?: string;
  endsAt?: string; // ISO string
  testHours?: number; // e.g. 50 => shows Days > 00
}) {
  // ✅ End time created ONCE (so it never resets)
  const endTimeRef = React.useRef<number>(
    endsAt
      ? new Date(endsAt).getTime()
      : Date.now() + (testHours ?? 12) * 60 * 60 * 1000,
  );

  // ✅ Tick every second
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const remaining = endTimeRef.current - now;
  const expired = remaining <= 0;

  const { days, hours, minutes, seconds } = msToParts(remaining);

  return (
    <section className={cn("py-10 md:py-14", className)}>
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <Card className="relative overflow-hidden rounded-3xl border bg-background shadow-sm">
          {/* glow */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
            <div className="absolute -top-24 -left-24 size-80 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 size-80 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <CardContent className="relative p-6 md:p-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                  <Sparkles className="size-3.5 text-primary" />
                  Limited time discount
                </div>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                  {expired ? "Discount ended" : "Hurry up! Offer ends soon"}
                </h2>

                <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
                  Enjoy exclusive discounts on your favorite meals. This offer
                  is available for a limited time only.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    className="h-11 rounded-xl"
                    disabled={expired}
                  >
                    <Link href="/maels">Shop now</Link>
                  </Button>
                  <Button asChild variant="outline" className="h-11 rounded-xl">
                    <Link href="/offers">View offers</Link>
                  </Button>
                </div>
              </div>

              {/* Right – Countdown */}
              <div className="flex justify-center lg:justify-end">
                <div className="grid grid-cols-4 gap-3">
                  <TimeBox label="Days" value={expired ? "00" : pad(days)} />
                  <TimeBox label="Hours" value={expired ? "00" : pad(hours)} />
                  <TimeBox
                    label="Minutes"
                    value={expired ? "00" : pad(minutes)}
                  />
                  <TimeBox
                    label="Seconds"
                    value={expired ? "00" : pad(seconds)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function TimeBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-background/70 p-4 text-center shadow-sm backdrop-blur">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
