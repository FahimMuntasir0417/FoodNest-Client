import Link from "next/link";
import { BadgeCheck, ShoppingBag, Store, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const values = [
  {
    title: "Transparent discovery",
    description:
      "Customers can inspect meals, pricing, categories, provider details, and reviews before creating an account.",
    icon: ShoppingBag,
  },
  {
    title: "Provider ownership",
    description:
      "Food providers can keep menus accurate and process orders from a dashboard built around their daily work.",
    icon: Store,
  },
  {
    title: "Admin visibility",
    description:
      "Admins can review users, categories, meals, and orders without mixing operational tasks into the public site.",
    icon: UsersRound,
  },
  {
    title: "Production-minded UX",
    description:
      "Responsive layouts, validation, empty states, and role-based access make FoodNest usable across devices.",
    icon: BadgeCheck,
  },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <section className="max-w-3xl">
        <p className="text-sm font-medium text-primary">About FoodNest</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          A focused food ordering platform for customers, providers, and admins.
        </h1>
        <p className="mt-5 text-base leading-8 text-muted-foreground">
          FoodNest is designed for real ordering workflows: browse public menus,
          compare providers, add meals to cart, place delivery orders, and
          manage operational data from role-specific dashboards.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="rounded-md">
            <Link href="/maels">Explore meals</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-md">
            <Link href="/contact">Contact support</Link>
          </Button>
        </div>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        {values.map((value) => (
          <Card key={value.title} className="rounded-lg">
            <CardHeader>
              <value.icon className="size-5 text-primary" />
              <CardTitle className="text-base">{value.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              {value.description}
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
