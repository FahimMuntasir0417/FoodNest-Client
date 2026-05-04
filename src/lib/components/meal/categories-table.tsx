"use client";

import * as React from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { adminDeleteCategory } from "@/actions/category.action";
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/foodnest-data";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

const PAGE_SIZE = 8;

export function CategoriesTable({ categories }: { categories: CategoryRow[] }) {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return categories;

    return categories.filter((category) =>
      [category.name, category.slug, category.id]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [categories, query]);

  React.useEffect(() => {
    setPage(1);
  }, [query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  async function onDelete(id: string) {
    const ok = window.confirm("Delete this category? This cannot be undone.");
    if (!ok) return;

    setDeletingId(id);
    const toastId = toast.loading("Deleting category...");
    const res = await adminDeleteCategory(id);

    if (res?.error) {
      toast.error(res.error.message, { id: toastId });
      setDeletingId(null);
      return;
    }

    toast.success("Category deleted", { id: toastId });
    setDeletingId(null);
  }

  return (
    <Card className="rounded-lg">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base">
            All Categories{" "}
            <Badge variant="secondary" className="ml-2">
              {filtered.length}
            </Badge>
          </CardTitle>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by name, slug, or ID"
            className="max-w-sm rounded-md"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[320px]">Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="hidden md:table-cell">Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{category.name}</span>
                      <span className="mt-1 break-all font-mono text-[10px] text-muted-foreground">
                        {category.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{category.slug}</Badge>
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                    {formatDate(category.createdAt)}
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                    {formatDate(category.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="secondary" size="sm" className="rounded-md">
                        <Link href={`/provider-dashboard/category/${category.id}`}>
                          Create meal
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              navigator.clipboard.writeText(category.id);
                              toast.success("Copied category ID");
                            }}
                          >
                            Copy category ID
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDelete(category.id)}
                            disabled={deletingId === category.id}
                          >
                            {deletingId === category.id
                              ? "Deleting..."
                              : "Delete category"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-sm text-muted-foreground">
                    No categories match the current filter.
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
              onClick={() =>
                setPage((value) => Math.min(pageCount, value + 1))
              }
              disabled={currentPage >= pageCount}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
