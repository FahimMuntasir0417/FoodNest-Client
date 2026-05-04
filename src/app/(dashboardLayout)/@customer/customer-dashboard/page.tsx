import Link from "next/link";

import {
  BarChart,
  DonutChart,
  LineChart,
  MetricCard,
} from "@/components/dashboard/dashboard-widgets";
import { Button } from "@/components/ui/button";
import { formatDate, formatMoney, toArray } from "@/lib/foodnest-data";
import { ordersService, type Order } from "@/services/orders.service";

function countStatus(orders: Order[], status: string) {
  return orders.filter((order) => order.status === status).length;
}

function spendingPoints(orders: Order[]) {
  const groups = new Map<string, number>();

  orders.forEach((order) => {
    const label = formatDate(order.createdAt);
    groups.set(label, (groups.get(label) ?? 0) + Number(order.total ?? 0));
  });

  const points = Array.from(groups, ([label, value]) => ({
    label,
    value: Math.round(value),
  }));

  return points.slice(-6).length ? points.slice(-6) : [{ label: "No orders", value: 0 }];
}

export default async function Page() {
  const { data } = await ordersService.getMe();
  const orders = toArray<Order>(data);
  const delivered = countStatus(orders, "DELIVERED");
  const active = orders.filter(
    (order) => !["DELIVERED", "CANCELLED"].includes(String(order.status)),
  ).length;
  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.total ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Customer overview</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Ordering activity
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track totals, current orders, delivery history, and spending.
          </p>
        </div>
        <Button asChild className="rounded-md">
          <Link href="/maels">Order a meal</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Orders"
          value={String(orders.length)}
          detail={`${active} active order${active === 1 ? "" : "s"}`}
        />
        <MetricCard
          title="Delivered"
          value={String(delivered)}
          detail="Completed delivery records"
        />
        <MetricCard
          title="Total spent"
          value={formatMoney(totalSpent)}
          detail="Sum of your order totals"
        />
        <MetricCard
          title="Average order"
          value={formatMoney(orders.length ? totalSpent / orders.length : 0)}
          detail="Based on current order history"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <BarChart
          title="Order status"
          points={[
            { label: "Placed", value: countStatus(orders, "PLACED") },
            { label: "Preparing", value: countStatus(orders, "PREPARING") },
            { label: "Delivered", value: delivered },
            { label: "Cancelled", value: countStatus(orders, "CANCELLED") },
          ]}
        />
        <LineChart title="Spending trend" points={spendingPoints(orders)} />
        <DonutChart
          title="Completion rate"
          primary={{ label: "Delivered", value: delivered }}
          secondary={{ label: "Other statuses", value: orders.length - delivered }}
        />
      </div>
    </div>
  );
}
