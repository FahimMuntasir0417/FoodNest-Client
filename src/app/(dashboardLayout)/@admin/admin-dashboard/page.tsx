import Link from "next/link";

import {
  BarChart,
  DonutChart,
  LineChart,
  MetricCard,
} from "@/components/dashboard/dashboard-widgets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatMoney, toArray } from "@/lib/foodnest-data";
import { mealsService } from "@/services/meals.service";
import { ordersService } from "@/services/orders.service";
import { usersService } from "@/services/user.service";
import type { Meal, User } from "@/types";
import type { Order } from "@/services/orders.service";

function statusCount(orders: Order[], status: string) {
  return orders.filter((order) => order.status === status).length;
}

function recentOrderPoints(orders: Order[]) {
  const groups = new Map<string, number>();

  orders.forEach((order) => {
    const label = formatDate(order.createdAt);
    groups.set(label, (groups.get(label) ?? 0) + 1);
  });

  const points = Array.from(groups, ([label, value]) => ({ label, value }));
  return points.slice(-6).length ? points.slice(-6) : [{ label: "No orders", value: 0 }];
}

export default async function Page() {
  const [usersResult, mealsResult, ordersResult] = await Promise.all([
    usersService.getAll(),
    mealsService.getAll(),
    ordersService.getAll(),
  ]);

  const users = toArray<User>(usersResult.data);
  const meals = toArray<Meal>(mealsResult.data);
  const orders = toArray<Order>(ordersResult.data);
  const revenue = orders.reduce((sum, order) => sum + Number(order.total ?? 0), 0);
  const activeUsers = users.filter((user) => user.status === "ACTIVE").length;
  const availableMeals = meals.filter((meal) => meal.isAvailable).length;
  const delivered = statusCount(orders, "DELIVERED");
  const cancelled = statusCount(orders, "CANCELLED");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Admin overview</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Platform performance
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live users, meals, orders, and revenue from FoodNest services.
          </p>
        </div>
        <Button asChild className="rounded-md">
          <Link href="/admin-dashboard/all-orders">Review orders</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Users"
          value={String(users.length)}
          detail={`${activeUsers} active accounts`}
        />
        <MetricCard
          title="Meals"
          value={String(meals.length)}
          detail={`${availableMeals} available for ordering`}
        />
        <MetricCard
          title="Orders"
          value={String(orders.length)}
          detail={`${delivered} delivered, ${cancelled} cancelled`}
        />
        <MetricCard
          title="Revenue"
          value={formatMoney(revenue)}
          detail="Total order value returned by the API"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <BarChart
          title="Order status"
          points={[
            { label: "Placed", value: statusCount(orders, "PLACED") },
            { label: "Preparing", value: statusCount(orders, "PREPARING") },
            { label: "Delivered", value: delivered },
            { label: "Cancelled", value: cancelled },
          ]}
        />
        <LineChart title="Recent order volume" points={recentOrderPoints(orders)} />
        <DonutChart
          title="Meal availability"
          primary={{ label: "Available", value: availableMeals }}
          secondary={{ label: "Unavailable", value: meals.length - availableMeals }}
        />
      </div>

      <Card className="rounded-lg">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Recent orders</CardTitle>
          <Badge variant="secondary">{orders.length} total</Badge>
        </CardHeader>
        <CardContent>
          {orders.length ? (
            <div className="grid gap-3">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="grid gap-3 rounded-lg border p-3 text-sm md:grid-cols-[1fr_auto_auto_auto] md:items-center"
                >
                  <span className="font-mono text-xs">{order.id}</span>
                  <Badge variant="outline">{order.status ?? "UNKNOWN"}</Badge>
                  <span className="text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </span>
                  <span className="font-medium">{formatMoney(order.total)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border p-6 text-sm text-muted-foreground">
              Orders will appear here after customers place them.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
