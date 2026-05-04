"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { initials } from "@/lib/foodnest-data";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./modetoggle";

type Role = "ADMIN" | "PROVIDER" | "CUSTOMER";

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: Role | string | null;
};

const publicRoutes = [
  { title: "Providers", href: "/provider" },
  { title: "Blog", href: "/blog" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

const exploreRoutes = [
  {
    title: "Meals",
    href: "/maels",
    description: "Search meals by cuisine, category, price, and availability.",
  },
  {
    title: "Categories",
    href: "/category",
    description: "Browse the menu structure used across FoodNest providers.",
  },
  {
    title: "Reviews",
    href: "/reviews",
    description: "Read customer feedback before choosing a meal.",
  },
];

const navbarHoverClass =
  "hover:bg-[#0f2818] hover:text-white data-[state=open]:bg-[#0f2818] data-[state=open]:text-white";

function getDashboardUrl(role?: string | null) {
  if (role === "ADMIN") return "/admin-dashboard";
  if (role === "PROVIDER") return "/provider-dashboard";
  return "/customer-dashboard";
}

function getOrdersUrl(role?: string | null) {
  if (role === "ADMIN") return "/admin-dashboard/all-orders";
  if (role === "PROVIDER") return "/provider-dashboard/provider-order";
  return "/customer-dashboard/customer-order";
}

function extractUser(payload: unknown): SessionUser | null {
  if (!payload || typeof payload !== "object") return null;
  const value = payload as { user?: SessionUser; data?: { user?: SessionUser } };
  return value.user ?? value.data?.user ?? null;
}

export function Navbar({ className }: { className?: string }) {
  const [user, setUser] = React.useState<SessionUser | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      const endpoints = ["/api/auth/get-session"];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, { credentials: "include" });
          if (!response.ok) continue;

          const payload = await response.json();
          const nextUser = extractUser(payload);

          if (!cancelled && nextUser) {
            setUser(nextUser);
            return;
          }
        } catch {
          continue;
        }
      }

      if (!cancelled) setUser(null);
    }

    loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const dashboardUrl = getDashboardUrl(user?.role);
  const ordersUrl = getOrdersUrl(user?.role);
  const isAuthenticated = Boolean(user);
  const navRoutes = publicRoutes;

  async function handleLogout() {
    try {
      await authClient.signOut();
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  }

  return (
    <section className={cn("w-full", className)}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
            FN
          </span>
          <span className="text-lg font-semibold tracking-tight">FoodNest</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <ExploreDropdown />
          {navRoutes.map((route) => (
            <Button
              key={route.href}
              asChild
              variant="ghost"
              size="sm"
              className={navbarHoverClass}
            >
              <Link href={route.href}>{route.title}</Link>
            </Button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isAuthenticated ? (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={navbarHoverClass}
              >
                <Link href={ordersUrl}>Track Order</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={navbarHoverClass}
              >
                <Link href={dashboardUrl}>Dashboard</Link>
              </Button>
              <ModeToggle />
              <ProfileMenu
                user={user}
                dashboardUrl={dashboardUrl}
                ordersUrl={ordersUrl}
                onLogout={handleLogout}
              />
            </>
          ) : (
            <>
              <ModeToggle />
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
                      FN
                    </span>
                    FoodNest
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="space-y-6 p-4">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                    Explore
                  </p>
                  <div className="grid gap-2">
                    {exploreRoutes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                          "rounded-md border p-3 text-sm font-medium",
                          navbarHoverClass,
                        )}
                      >
                        {route.title}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  {navRoutes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "rounded-md px-2 py-2 text-sm font-medium",
                        navbarHoverClass,
                      )}
                    >
                      {route.title}
                    </Link>
                  ))}
                </div>

                {isAuthenticated ? (
                  <div className="grid gap-2 border-t pt-4">
                    <Link
                      href={ordersUrl}
                      className={cn(
                        "rounded-md px-2 py-2 text-sm font-medium",
                        navbarHoverClass,
                      )}
                    >
                      Track Order
                    </Link>
                    <Link
                      href={dashboardUrl}
                      className={cn(
                        "rounded-md px-2 py-2 text-sm font-medium",
                        navbarHoverClass,
                      )}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard-profile"
                      className={cn(
                        "rounded-md px-2 py-2 text-sm font-medium",
                        navbarHoverClass,
                      )}
                    >
                      Profile
                    </Link>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-3 border-t pt-4">
                    <Button asChild variant="outline">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/signup">Sign up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
}

function ExploreDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={navbarHoverClass}>
          Explore
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>FoodNest menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {exploreRoutes.map((route) => (
          <DropdownMenuItem key={route.href} asChild>
            <Link href={route.href} className="flex flex-col items-start gap-1">
              <span className="font-medium">{route.title}</span>
              <span className="text-xs text-muted-foreground">
                {route.description}
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProfileMenu({
  user,
  dashboardUrl,
  ordersUrl,
  onLogout,
}: {
  user: SessionUser | null;
  dashboardUrl: string;
  ordersUrl: string;
  onLogout: () => void;
}) {
  const name = user?.name || "FoodNest user";
  const email = user?.email || "Signed in";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 gap-2 rounded-md px-2">
          <Avatar className="size-6 rounded-md">
            <AvatarImage src={user?.image ?? undefined} alt={name} />
            <AvatarFallback className="rounded-md text-[10px]">
              {initials(name)}
            </AvatarFallback>
          </Avatar>
          <span className="max-w-28 truncate text-sm">{name}</span>
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <span className="block truncate">{name}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={dashboardUrl}>
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ordersUrl}>
            <ShoppingBag className="size-4" />
            Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard-profile">
            <UserRound className="size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
