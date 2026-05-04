"use client";

import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";

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
import { authClient } from "@/lib/auth-client";
import { initials } from "@/lib/foodnest-data";

type DashboardUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

export function DashboardUserMenu({ user }: { user: DashboardUser }) {
  const name = user.name || "FoodNest user";

  async function logout() {
    try {
      await authClient.signOut();
    } finally {
      window.location.href = "/login";
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 gap-2 rounded-md px-2">
          <Avatar className="size-6 rounded-md">
            <AvatarImage src={user.image ?? undefined} alt={name} />
            <AvatarFallback className="rounded-md text-[10px]">
              {initials(name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-32 truncate sm:inline">{name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <span className="block truncate">{name}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">
            {user.email || user.role || "Dashboard user"}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard-profile">
            <UserRound className="size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
