"use client";

import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { adminDeleteMeal } from "@/actions/admin-meals.action";
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
import { formatDate, formatMoney } from "@/lib/foodnest-data";

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

const PAGE_SIZE = 8;

export function MealsTable({ meals }: { meals: AdminMeal[] }) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [availability, setAvailability] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const categories = React.useMemo(
    () =>
      Array.from(
        new Set(meals.map((meal) => meal.category?.name).filter(Boolean) as string[]),
      ).sort((a, b) => a.localeCompare(b)),
    [meals],
  );

  const filtered = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return meals.filter((meal) => {
      const matchesQuery =
        !normalized ||
        [
          meal.title,
          meal.description,
          meal.cuisine,
          meal.provider?.shopName,
          meal.id,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      const matchesCategory =
        category === "all" || meal.category?.name === category;
      const matchesAvailability =
        availability === "all" ||
        (availability === "available" && meal.isAvailable) ||
        (availability === "unavailable" && !meal.isAvailable);

      return matchesQuery && matchesCategory && matchesAvailability;
    });
  }, [availability, category, meals, query]);

  React.useEffect(() => {
    setPage(1);
  }, [availability, category, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  async function onDelete(id: string) {
    const ok = window.confirm("Delete this meal? This cannot be undone.");
    if (!ok) return;

    setDeletingId(id);
    const toastId = toast.loading("Deleting meal...");
    const res = await adminDeleteMeal(id);

    if (res?.error) {
      toast.error(res.error.message, { id: toastId });
      setDeletingId(null);
      return;
    }

    toast.success("Meal deleted", { id: toastId });
    setDeletingId(null);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter by title, cuisine, provider, or ID"
          className="rounded-md"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="rounded-md">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={availability} onValueChange={setAvailability}>
          <SelectTrigger className="rounded-md">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All meals</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
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
            {rows.map((meal) => (
              <TableRow key={meal.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{meal.title}</span>
                    {meal.cuisine ? (
                      <span className="text-xs text-muted-foreground">
                        {meal.cuisine}
                      </span>
                    ) : null}
                    <span className="mt-1 break-all font-mono text-[10px] text-muted-foreground">
                      {meal.id}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {meal.provider?.shopName?.trim() || "Not assigned"}
                </TableCell>
                <TableCell>
                  {meal.category?.name ? (
                    <Badge variant="outline">{meal.category.name}</Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Not categorized
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatMoney(meal.price)}
                </TableCell>
                <TableCell>
                  <Badge variant={meal.isAvailable ? "default" : "secondary"}>
                    {meal.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                  {formatDate(meal.createdAt)}
                </TableCell>
                <TableCell className="text-right">
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
                          navigator.clipboard.writeText(meal.id);
                          toast.success("Copied meal ID");
                        }}
                      >
                        Copy meal ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(meal.id)}
                        disabled={deletingId === meal.id}
                      >
                        {deletingId === meal.id ? "Deleting..." : "Delete meal"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                  No meals match the current filters.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <Pagination
        page={currentPage}
        pageCount={pageCount}
        total={filtered.length}
        onPrevious={() => setPage((value) => Math.max(1, value - 1))}
        onNext={() => setPage((value) => Math.min(pageCount, value + 1))}
      />
    </div>
  );
}

function Pagination({
  page,
  pageCount,
  total,
  onPrevious,
  onNext,
}: {
  page: number;
  pageCount: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>{total} result(s)</span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-md"
          onClick={onPrevious}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {pageCount}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-md"
          onClick={onNext}
          disabled={page >= pageCount}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
