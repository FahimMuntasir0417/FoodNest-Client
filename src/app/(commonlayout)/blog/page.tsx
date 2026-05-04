import Link from "next/link";
import { ArrowRight, ChefHat, ClipboardList, Truck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const articles = [
  {
    id: "category-browsing",
    title: "Choosing meals by category",
    summary:
      "Categories help customers narrow choices quickly while still seeing provider and price context on every card.",
    icon: ChefHat,
  },
  {
    id: "provider-operations",
    title: "How providers keep menus current",
    summary:
      "A clean provider workflow keeps meal availability, categories, and incoming order status changes in one place.",
    icon: ClipboardList,
  },
  {
    id: "order-tracking",
    title: "Reading order status updates",
    summary:
      "Order history and status tables help customers, providers, and admins understand what changed and when.",
    icon: Truck,
  },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <section className="max-w-3xl">
        <p className="text-sm font-medium text-primary">FoodNest blog</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Practical notes for ordering, provider management, and dashboard use.
        </h1>
        <p className="mt-4 text-base leading-8 text-muted-foreground">
          These articles explain how FoodNest uses public listings, role-based
          dashboards, and real order data to keep the app useful after launch.
        </p>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.id} id={article.id} className="rounded-lg">
            <CardHeader>
              <article.icon className="size-5 text-primary" />
              <CardTitle className="text-base">{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                {article.summary}
              </p>
              <Link
                href="/maels"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Explore the live menu
                <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
