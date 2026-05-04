import Link from "next/link";
import { CircleHelp, Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const helpTopics = [
  {
    title: "Customer orders",
    description:
      "Use the customer dashboard to review totals, delivery details, item lists, and order status history.",
    icon: CircleHelp,
  },
  {
    title: "Provider workflow",
    description:
      "Providers can add meals, select categories, review incoming orders, and update status from their dashboard.",
    icon: ShieldCheck,
  },
  {
    title: "Account support",
    description:
      "For login, registration, profile, or role access issues, include your account email when contacting support.",
    icon: Mail,
  },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-primary">Help center</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Find the right FoodNest workflow for your role.
          </h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            FoodNest separates public browsing from customer, provider, and
            admin dashboard work so each role can focus on the next action.
          </p>
        </div>
        <Button asChild className="rounded-md">
          <Link href="/contact">Contact support</Link>
        </Button>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {helpTopics.map((topic) => (
          <Card key={topic.title} className="rounded-lg">
            <CardHeader>
              <topic.icon className="size-5 text-primary" />
              <CardTitle className="text-base">{topic.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              {topic.description}
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
