import Link from "next/link";

import {
  BarChart,
  DonutChart,
  LineChart,
  MetricCard,
} from "@/components/dashboard/dashboard-widgets";
import { Button } from "@/components/ui/button";
import { getProviderOrders } from "@/actions/provider-order.action";
import { formatDate, formatMoney, toArray } from "@/lib/foodnest-data";

type ProviderOrder = {
  id: string;
  status?: string;
  total?: number;
  createdAt?: string;
};

function countStatus(orders: ProviderOrder[], status: string) {
  return orders.filter((order) => order.status === status).length;
}

function orderPoints(orders: ProviderOrder[]) {
  const groups = new Map<string, number>();

  orders.forEach((order) => {
    const label = formatDate(order.createdAt);
    groups.set(label, (groups.get(label) ?? 0) + 1);
  });

  const points = Array.from(groups, ([label, value]) => ({ label, value }));
  return points.slice(-6).length ? points.slice(-6) : [{ label: "No orders", value: 0 }];
}

export default async function Page() {
  const { data } = await getProviderOrders();
  const orders = toArray<ProviderOrder>(data);
  const revenue = orders.reduce((sum, order) => sum + Number(order.total ?? 0), 0);
  const placed = countStatus(orders, "PLACED");
  const delivered = countStatus(orders, "DELIVERED");
  const active = orders.filter(
    (order) => !["DELIVERED", "CANCELLED"].includes(String(order.status)),
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Provider overview</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Kitchen operations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor incoming orders, delivery progress, and provider revenue.
          </p>
        </div>
        <Button asChild className="rounded-md">
          <Link href="/provider-dashboard/add-meal">Add meal</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Orders"
          value={String(orders.length)}
          detail={`${active} active order${active === 1 ? "" : "s"}`}
        />
        <MetricCard
          title="Placed"
          value={String(placed)}
          detail="Orders waiting for action"
        />
        <MetricCard
          title="Delivered"
          value={String(delivered)}
          detail="Completed provider orders"
        />
        <MetricCard
          title="Revenue"
          value={formatMoney(revenue)}
          detail="Total from provider orders"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <BarChart
          title="Order status"
          points={[
            { label: "Placed", value: placed },
            { label: "Preparing", value: countStatus(orders, "PREPARING") },
            { label: "Delivered", value: delivered },
            { label: "Cancelled", value: countStatus(orders, "CANCELLED") },
          ]}
        />
        <LineChart title="Recent order volume" points={orderPoints(orders)} />
        <DonutChart
          title="Delivery share"
          primary={{ label: "Delivered", value: delivered }}
          secondary={{ label: "Other statuses", value: orders.length - delivered }}
        />
      </div>
    </div>
  );
}
