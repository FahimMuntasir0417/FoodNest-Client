"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Command, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { adminRoutes } from "@/routes/adminRoutes";
import { providerRoutes } from "@/routes/providerRoutes";
import { Route } from "@/types/route/routes.type";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: { role: string };
};

// EXACT shape NavMain expects:
type NavMainItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
};

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

// Helper: map Route[] -> NavMainItem[]
function toNavMainItems(routes: Route[]): NavMainItem[] {
  return routes.map((r: any) => {
    // Try common field names used in route configs
    const title: string = r.title ?? r.name ?? r.label ?? r.text ?? "Untitled";

    const url: string = r.url ?? r.path ?? r.href ?? r.to ?? "#";

    const icon: LucideIcon = (r.icon as LucideIcon) ?? SquareTerminal;

    // Try common nested field names
    const children: any[] =
      r.items ?? r.children ?? r.subRoutes ?? r.routes ?? [];

    const items =
      Array.isArray(children) && children.length > 0
        ? children.map((c: any) => ({
            title: c.title ?? c.name ?? c.label ?? "Untitled",
            url: c.url ?? c.path ?? c.href ?? c.to ?? "#",
          }))
        : undefined;

    return {
      title,
      url,
      icon,
      isActive: r.isActive,
      items,
    };
  });
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  let routes: Route[] = [];

  switch (user.role) {
    case "admin":
      routes = adminRoutes;
      break;
    case "provider":
      routes = providerRoutes;
      break;
    default:
      routes = [];
      break;
  }

  const navItems = toNavMainItems(routes);

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
