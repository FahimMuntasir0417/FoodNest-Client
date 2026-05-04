"use client";

import * as React from "react";

import { OrderStatusControl } from "@/components/dashboard/order-status-control";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatMoney } from "@/lib/foodnest-data";

export type DashboardOrderRow = {
  id: string;
  status?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  phone?: string | null;
  deliveryAddress?: string | null;
  total?: number | null;
  createdAt?: string | null;
  itemCount?: number;
};

const PAGE_SIZE = 8;

export function OrdersTable({
  orders,
  showStatusControl = false,
}: {
  orders: DashboardOrderRow[];
  showStatusControl?: boolean;
}) {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [page, setPage] = React.useState(1);

  const statuses = React.useMemo(
    () =>
      Array.from(
        new Set(orders.map((order) => order.status).filter(Boolean) as string[]),
      ).sort((a, b) => a.localeCompare(b)),
    [orders],
  );

  const filtered = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesQuery =
        !normalized ||
        [
          order.id,
          order.status,
          order.customerName,
          order.customerEmail,
          order.phone,
          order.deliveryAddress,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      const matchesStatus = status === "all" || order.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [orders, query, status]);

  React.useEffect(() => {
    setPage(1);
  }, [query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_200px]">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter by order, customer, phone, address, or status"
          className="rounded-md"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="rounded-md">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[220px]">Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden lg:table-cell">Delivery</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="text-right">Total</TableHead>
              {showStatusControl ? (
                <TableHead className="text-right">Actions</TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="break-all font-mono text-xs">
                      {order.id}
                    </span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      {order.itemCount ?? 0} item(s)
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{order.status ?? "UNKNOWN"}</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  <div className="font-medium">
                    {order.customerName || "FoodNest customer"}
                  </div>
                  {order.customerEmail || order.phone ? (
                    <div className="text-muted-foreground">
                      {order.customerEmail || order.phone}
                    </div>
                  ) : null}
                </TableCell>
                <TableCell className="hidden max-w-[260px] truncate text-sm text-muted-foreground lg:table-cell">
                  {order.deliveryAddress || "No delivery address"}
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                  {formatDateTime(order.createdAt)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatMoney(order.total)}
                </TableCell>
                {showStatusControl ? (
                  <TableCell className="text-right">
                    <OrderStatusControl
                      orderId={order.id}
                      currentStatus={order.status || "PLACED"}
                    />
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={showStatusControl ? 7 : 6}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  No orders match the current filters.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>{filtered.length} result(s)</span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-md"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {pageCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-md"
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            disabled={currentPage >= pageCount}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
