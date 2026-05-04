import Link from "next/link";
import { MapPin, Phone, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { providersService } from "@/services/providers.service";
import type { Provider } from "@/types/provider/provider";

export default async function Page() {
  const result = await providersService.getAll();
  const providers = Array.isArray(result.data)
    ? (result.data as Provider[])
    : [];

  if (result.error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Failed to load providers</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {result.error.message}
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Providers</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Food providers
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Compare {providers.length} provider
            {providers.length === 1 ? "" : "s"} by shop name, address, and
            contact details.
          </p>
        </div>
        <Button asChild className="rounded-md">
          <Link href="/create-provider">Create provider</Link>
        </Button>
      </div>

      {providers.length ? (
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <Card key={provider.id} className="rounded-lg">
              <CardHeader>
                <Store className="size-5 text-primary" />
                <CardTitle className="text-base">
                  {provider.shopName || "FoodNest provider"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="leading-6">
                  {provider.description ||
                    "This provider manages meals and order fulfillment through FoodNest."}
                </p>
                <div className="flex gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{provider.address || "Address not listed"}</span>
                </div>
                <div className="flex gap-2">
                  <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{provider.phone || "Phone not listed"}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : (
        <Card className="mt-8 rounded-lg">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Providers will appear here after provider profiles are created.
          </CardContent>
        </Card>
      )}
    </main>
  );
}
