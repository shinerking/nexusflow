"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type UpdateSettingsState = {
  error?: string;
  success?: boolean;
};

export async function updateSettings(
  _prevState: UpdateSettingsState | null,
  formData: FormData
): Promise<UpdateSettingsState> {
  const userId = formData.get("userId")?.toString().trim();
  const orgId = formData.get("orgId")?.toString().trim();
  const name = formData.get("name")?.toString().trim();
  const organizationName = formData.get("organizationName")?.toString().trim();

  if (!userId) {
    return { error: "User ID is required" };
  }

  if (!name) {
    return { error: "Name is required" };
  }

  if (orgId && !organizationName?.trim()) {
    return { error: "Organization name is required when org exists" };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    if (orgId && organizationName) {
      await prisma.organization.update({
        where: { id: orgId },
        data: { name: organizationName },
      });
    }

    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("updateSettings error:", e);
    return { error: "Failed to update settings." };
  }
}
