"use server";

import { usersService } from "@/services/user.service";
import { revalidatePath } from "next/cache";

type Role = "CUSTOMER" | "ADMIN" | "PROVIDER";
type Status = "ACTIVE" | "SUSPENDED";

export async function adminUpdateUserRole(userId: string, role: Role) {
  const res = await usersService.updateUser(userId, { role });
  revalidatePath("/admin-dashboard/users");
  return res;
}

export async function adminUpdateUserStatus(userId: string, status: Status) {
  const res = await usersService.updateUser(userId, { status });
  revalidatePath("/admin-dashboard/users");
  return res;
}

export async function adminDeleteUser(userId: string) {
  const res = await usersService.deleteUser(userId);
  revalidatePath("/admin-dashboard/users");
  return res;
}
