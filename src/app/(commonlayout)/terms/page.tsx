export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <p className="text-sm font-medium text-primary">Terms</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        FoodNest terms of service
      </h1>
      <div className="mt-8 space-y-6 text-sm leading-7 text-muted-foreground">
        <p>
          FoodNest provides software for browsing meals, managing food provider
          menus, placing orders, reviewing order history, and administering
          platform data.
        </p>
        <p>
          Customers are responsible for accurate delivery and contact
          information. Providers are responsible for accurate menu details,
          availability, pricing, and order status updates.
        </p>
        <p>
          FoodNest may restrict account access when activity creates security,
          abuse, or operational risk for customers, providers, or admins.
        </p>
      </div>
    </main>
  );
}
