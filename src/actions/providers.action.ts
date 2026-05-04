"use server";

import { getSession } from "@/services/auth.service";
import {
  providersService,
  type CreateProviderInput,
} from "@/services/providers.service";
import { redirect } from "next/navigation";
// ✅ import your service

export const createProvider = async (data: CreateProviderInput) => {
  const { data: authData, error } = await getSession();

  if (error || !(authData?.session?.userId ?? authData?.user?.id)) {
    return { error: { message: "Unauthorized" } };
  }

  const res = await providersService.create(data);
  if (res.error) return res;

  redirect("/provider");
};
