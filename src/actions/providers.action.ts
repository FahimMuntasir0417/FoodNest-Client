"use server";

import { getSession } from "@/services/auth.service";
import {
  providersService,
  type CreateProviderInput,
} from "@/services/providers.service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// ✅ import your service

export const createProvider = async (
  data: Omit<CreateProviderInput, "userId">,
) => {
  const { data: authData, error } = await getSession();

  if (error || !authData?.session?.userId) {
    return { error: { message: "Unauthorized" } };
  }

  const userId = authData.session.userId;
  console.log("sdfgs", userId);

  const res = await providersService.create({ userId, ...data });
  if (res.error) return res;

  redirect("/provider");
};
