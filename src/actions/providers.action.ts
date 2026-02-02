"use server";

import {
  providersService,
  type CreateProviderInput,
} from "@/services/providers.service";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export const createProvider = async (data: CreateProviderInput) => {
  const res = await providersService.create(data);

  if (res.error) {
    return res; // client shows toast error
  }

  // your Next types require profile arg
  revalidateTag("providers", "default");

  // redirect after success
  redirect("/providers");
};
