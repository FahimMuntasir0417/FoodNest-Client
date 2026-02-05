"use client";

import * as React from "react";
import {
  ChevronRight,
  CreditCard,
  HelpCircle,
  Package,
  RotateCcw,
  Search,
  ShoppingBag,
  Truck,
  User,
  ArrowRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface HelpCategory {
  icon: React.ReactNode;
  title: string;
  description: string;
  articles: number;
}

interface PopularTopic {
  title: string;
  href: string;
}

interface Help1Props {
  title?: string;
  categories?: HelpCategory[];
  popularTopics?: PopularTopic[];
  onSearch?: (query: string) => void;
  onCategoryClick?: (category: HelpCategory) => void;
  className?: string;
}

const DEFAULT_CATEGORIES: HelpCategory[] = [
  {
    icon: <Package className="size-6" />,
    title: "Orders",
    description: "Track, modify, or cancel orders",
    articles: 12,
  },
  {
    icon: <Truck className="size-6" />,
    title: "Shipping",
    description: "Delivery options and tracking",
    articles: 8,
  },
  {
    icon: <RotateCcw className="size-6" />,
    title: "Returns & Refunds",
    description: "Return policy and process",
    articles: 15,
  },
  {
    icon: <CreditCard className="size-6" />,
    title: "Payments",
    description: "Payment methods and issues",
    articles: 10,
  },
  {
    icon: <User className="size-6" />,
    title: "Account",
    description: "Profile, password, and settings",
    articles: 7,
  },
  {
    icon: <ShoppingBag className="size-6" />,
    title: "Products",
    description: "Sizing, care, and availability",
    articles: 9,
  },
];

const DEFAULT_TOPICS: PopularTopic[] = [
  { title: "Where is my order?", href: "#" },
  { title: "How to return an item", href: "#" },
  { title: "Forgot my password", href: "#" },
  { title: "Payment not going through", href: "#" },
  { title: "Size guide", href: "#" },
  { title: "Shipping to my country", href: "#" },
];

function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

const Help1 = ({
  title = "Help Center",
  categories = DEFAULT_CATEGORIES,
  popularTopics = DEFAULT_TOPICS,
  onSearch,
  onCategoryClick,
  className,
}: Help1Props) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(searchQuery, 250);

  React.useEffect(() => {
    onSearch?.(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const filteredTopics = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return popularTopics;
    return popularTopics.filter((t) => t.title.toLowerCase().includes(q));
  }, [popularTopics, searchQuery]);

  return (
    <section className={cn("py-14 md:py-20", className)}>
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {/* Hero */}
        <div className="relative mb-10 overflow-hidden rounded-2xl border bg-card/60 p-8 shadow-sm backdrop-blur md:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent"
          />
          <div className="relative text-center">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {title}
            </h1>
            <p className="mt-2 text-base text-muted-foreground md:text-lg">
              Search articles, browse categories, or contact support.
            </p>

            <div className="mx-auto mt-6 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search help articles…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 rounded-xl pl-12 pr-12 text-base"
                  aria-label="Search help articles"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    Clear
                  </button>
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border bg-background/60 px-3 py-1">
                  Tip: try “returns”, “shipping”, “password”
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Browse categories</h2>
              <p className="text-sm text-muted-foreground">
                Quick links to the most common help sections.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Card
                key={index}
                role="button"
                tabIndex={0}
                onClick={() => onCategoryClick?.(category)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onCategoryClick?.(category);
                  }
                }}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-2xl border bg-card p-0",
                  "transition-all hover:-translate-y-0.5 hover:shadow-md",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                )}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {category.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold">{category.title}</h3>
                        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {category.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {category.articles} articles
                        </span>
                        <span className="text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          View →
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Topics */}
        <div className="rounded-2xl border bg-muted/30 p-6 md:p-7">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <HelpCircle className="size-5" />
              Popular topics
            </h2>

            <span className="text-xs text-muted-foreground">
              {filteredTopics.length} results
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTopics.map((topic, index) => (
              <a
                key={index}
                href={topic.href}
                className={cn(
                  "group flex items-center justify-between gap-3 rounded-xl border bg-background/60 p-3",
                  "transition-colors hover:bg-background",
                )}
              >
                <span className="flex items-center gap-2 text-sm">
                  <ChevronRight className="size-4 text-muted-foreground" />
                  {topic.title}
                </span>
                <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ))}

            {filteredTopics.length === 0 ? (
              <div className="col-span-full rounded-xl border bg-background/60 p-4 text-sm text-muted-foreground">
                No topics matched{" "}
                <span className="font-medium">“{searchQuery}”</span>. Try a
                different keyword.
              </div>
            ) : null}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-10 overflow-hidden rounded-2xl border bg-card p-6 shadow-sm md:p-7">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="text-base font-semibold">Still need help?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Our support team can help with orders, refunds, and account
                issues.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button variant="outline" className="h-11 rounded-xl">
                View all articles
              </Button>
              <Button className="h-11 rounded-xl">Contact support</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Help1 };
