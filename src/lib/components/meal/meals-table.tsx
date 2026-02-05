// src/app/admin-dashboard/meals/meals-table.tsx
"use client";

import * as React from "react";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { adminDeleteMeal } from "@/actions/admin-meals.action";

export type AdminMeal = {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  cuisine?: string | null;
  imageUrl?: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;

  provider?: { shopName?: string | null };
  category?: { name?: string | null; slug?: string | null };
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function money(n: number) {
  return `৳ ${Number(n || 0).toLocaleString()}`;
}

export function MealsTable({ meals }: { meals: AdminMeal[] }) {
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  async function onDelete(id: string) {
    const ok = window.confirm("Delete this meal? This cannot be undone.");
    if (!ok) return;

    setDeletingId(id);
    const t = toast.loading("Deleting meal...");

    const res = await adminDeleteMeal(id);

    if (res?.error) {
      toast.error(res.error.message, { id: t });
      setDeletingId(null);
      return;
    }

    toast.success("Meal deleted", { id: t });
    setDeletingId(null);
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[320px]">Meal</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {meals.map((m: AdminMeal) => (
            <TableRow key={m.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{m.title}</span>
                  {m.cuisine ? (
                    <span className="text-xs text-muted-foreground">
                      {m.cuisine}
                    </span>
                  ) : null}
                  <span className="mt-1 font-mono text-[10px] text-muted-foreground break-all">
                    {m.id}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-sm">
                {m.provider?.shopName?.trim() ? m.provider.shopName : "—"}
              </TableCell>

              <TableCell>
                {m.category?.name ? (
                  <Badge variant="outline">{m.category.name}</Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>

              <TableCell className="text-right font-medium">
                {money(m.price)}
              </TableCell>

              <TableCell>
                <Badge variant={m.isAvailable ? "default" : "secondary"}>
                  {m.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </TableCell>

              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {fmtDate(m.createdAt)}
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(m.id);
                        toast.success("Copied meal id");
                      }}
                    >
                      Copy meal id
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(m.id)}
                      disabled={deletingId === m.id}
                    >
                      {deletingId === m.id ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
