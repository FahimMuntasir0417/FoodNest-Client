// src/app/admin-dashboard/users/users-table.tsx
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

import {
  adminDeleteUser,
  adminUpdateUserRole,
  adminUpdateUserStatus,
} from "@/actions/users.action";
import { User } from "@/types";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function RoleBadge({ role }: { role: User["role"] }) {
  return <Badge variant="outline">{role}</Badge>;
}

function StatusBadge({ status }: { status: User["status"] }) {
  return (
    <Badge variant={status === "ACTIVE" ? "default" : "destructive"}>
      {status}
    </Badge>
  );
}

export function UsersTable({ users }: { users: User[] }) {
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  async function onChangeRole(userId: string, role: User["role"]) {
    const t = toast.loading("Updating role...");
    const res = await adminUpdateUserRole(userId, role);
    if (res?.error) {
      toast.error(res.error.message, { id: t });
      return;
    }
    toast.success("Role updated", { id: t });
  }

  async function onChangeStatus(userId: string, status: User["status"]) {
    const t = toast.loading("Updating status...");
    const res = await adminUpdateUserStatus(userId, status);
    if (res?.error) {
      toast.error(res.error.message, { id: t });
      return;
    }
    toast.success("Status updated", { id: t });
  }

  async function onDelete(userId: string) {
    setDeletingId(userId);
    const t = toast.loading("Deleting user...");
    const res = await adminDeleteUser(userId);
    if (res?.error) {
      toast.error(res.error.message, { id: t });
      setDeletingId(null);
      return;
    }
    toast.success("User deleted", { id: t });
    setDeletingId(null);
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[260px]">User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Verified</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((u: User) => (
            <TableRow key={u.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{u.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {u.email}
                  </span>
                  <span className="mt-1 font-mono text-[10px] text-muted-foreground break-all">
                    {u.id}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <RoleBadge role={u.role} />
                  <Select
                    defaultValue={u.role}
                    onValueChange={(v) => onChangeRole(u.id, v as User["role"])}
                  >
                    <SelectTrigger className="h-8 w-[150px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
                      <SelectItem value="PROVIDER">PROVIDER</SelectItem>
                      <SelectItem value="ADMIN">ADMIN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <StatusBadge status={u.status} />
                  <Select
                    defaultValue={u.status}
                    onValueChange={(v) =>
                      onChangeStatus(u.id, v as User["status"])
                    }
                  >
                    <SelectTrigger className="h-8 w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                      <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>

              <TableCell className="hidden md:table-cell">
                <Badge variant="secondary">
                  {u.emailVerified ? "Yes" : "No"}
                </Badge>
              </TableCell>

              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {fmtDate(u.createdAt)}
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
                        navigator.clipboard.writeText(u.id);
                        toast.success("Copied user id");
                      }}
                    >
                      Copy user id
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className="text-destructive"
                          onSelect={(e) => e.preventDefault()}
                        >
                          Delete user
                        </DropdownMenuItem>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this user?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            remove the user.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(u.id)}
                            disabled={deletingId === u.id}
                          >
                            {deletingId === u.id ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
