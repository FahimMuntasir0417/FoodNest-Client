import type { Meal } from "@/types/meal/meal";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Dhaka",
  year: "numeric",
  month: "short",
  day: "2-digit",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Dhaka",
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export type ListPayload<T> =
  | T[]
  | {
      data?: T[] | { data?: T[]; items?: T[]; results?: T[] };
      items?: T[];
      results?: T[];
    }
  | null
  | undefined;

export function toArray<T>(payload: ListPayload<T>): T[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;

  const nested = payload.data;
  if (nested && typeof nested === "object") {
    if (Array.isArray(nested.items)) return nested.items;
    if (Array.isArray(nested.results)) return nested.results;
    if (Array.isArray(nested.data)) return nested.data;
  }

  return [];
}

export function formatMoney(amount?: number | null) {
  const value = Number(amount ?? 0);

  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `BDT ${value.toLocaleString()}`;
  }
}

export function formatDate(iso?: string | null) {
  if (!iso) return "Not available";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Not available";

  return dateFormatter.format(date);
}

export function formatDateTime(iso?: string | null) {
  if (!iso) return "Not available";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Not available";

  return dateTimeFormatter.format(date);
}

export function fallbackMealImage(meal?: Pick<Meal, "cuisine" | "title">) {
  const key = `${meal?.cuisine ?? ""} ${meal?.title ?? ""}`.toLowerCase();

  if (key.includes("burger")) {
    return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80";
  }

  if (key.includes("pizza")) {
    return "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80";
  }

  if (key.includes("rice") || key.includes("biryani")) {
    return "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=80";
  }

  if (key.includes("dessert") || key.includes("cake")) {
    return "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=80";
  }

  return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80";
}

export function mealImage(meal: Pick<Meal, "imageUrl" | "cuisine" | "title">) {
  return meal.imageUrl?.trim() ? meal.imageUrl : fallbackMealImage(meal);
}

export function averageRating(reviews?: unknown[] | null) {
  if (!Array.isArray(reviews) || reviews.length === 0) return 0;

  const ratings = reviews
    .map((review) =>
      typeof review === "object" && review && "rating" in review
        ? Number((review as { rating?: unknown }).rating)
        : 0,
    )
    .filter((rating) => Number.isFinite(rating));

  if (ratings.length === 0) return 0;

  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
}

export function initials(name?: string | null) {
  const parts = (name ?? "FoodNest User")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
