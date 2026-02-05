// src/app/admin-dashboard/categories/categories-table.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { adminDeleteCategory } from "@/actions/category.action";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  createdAt?: string | null; // ✅ allow optional
  updatedAt?: string | null; // ✅ allow optional
};

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function CategoriesTable({ categories }: { categories: CategoryRow[] }) {
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  async function onDelete(id: string) {
    const ok = window.confirm("Delete this category? This cannot be undone.");
    if (!ok) return;

    setDeletingId(id);
    const t = toast.loading("Deleting category...");

    const res = await adminDeleteCategory(id);

    if (res?.error) {
      toast.error(res.error.message, { id: t });
      setDeletingId(null);
      return;
    }

    toast.success("Category deleted", { id: t });
    setDeletingId(null);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">
            All Categories{" "}
            <Badge variant="secondary" className="ml-2">
              {categories.length}
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        {categories.length === 0 ? (
          <div className="rounded-md border p-6 text-sm text-muted-foreground">
            No categories found.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[320px]">Category</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Updated
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {categories.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{c.name}</span>
                        <span className="mt-1 font-mono text-[10px] text-muted-foreground break-all">
                          {c.id}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">{c.slug}</Badge>
                    </TableCell>

                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {fmtDate(c.createdAt)}
                    </TableCell>

                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {fmtDate(c.updatedAt)}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="secondary" size="sm">
                          <Link href={`/admin-dashboard/category/${c.id}`}>
                            Create meal →
                          </Link>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem
                              onClick={() => {
                                navigator.clipboard.writeText(c.id);
                                toast.success("Copied category id");
                              }}
                            >
                              Copy category id
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => onDelete(c.id)}
                              disabled={deletingId === c.id}
                            >
                              {deletingId === c.id ? "Deleting..." : "Delete"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
