export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <p className="text-sm font-medium text-primary">Privacy</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        FoodNest privacy policy
      </h1>
      <div className="mt-8 space-y-6 text-sm leading-7 text-muted-foreground">
        <p>
          FoodNest uses account, provider, meal, review, and order information
          to operate the food ordering experience and show role-appropriate
          dashboard data.
        </p>
        <p>
          Customer order details are used for checkout, delivery coordination,
          support, and order history. Provider details are used to show public
          shop information and process incoming orders.
        </p>
        <p>
          Contact support at support@foodnest.app for privacy questions,
          account correction requests, or data access requests.
        </p>
      </div>
    </main>
  );
}
