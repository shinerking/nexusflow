"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export type UserWithRole = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "STAFF" | "AUDITOR";
  organizationId: string;
};

export async function login(formData: FormData): Promise<never> {
  const email = formData.get("email")?.toString().trim();

  if (!email) {
    redirect("/login?status=error&message=email_required");
  }

  // Find user in database
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    // Redirect with error message for demo purposes if user not found
    redirect("/login?status=error&message=user_not_found");
  }

  // Store email in session cookie
  const cookieStore = await cookies();
  cookieStore.set("session", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  redirect("/");
}

export async function logout(): Promise<never> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}

/**
 * Get current logged-in user with role from database
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<UserWithRole | null> {
  const cookieStore = await cookies();
  const email = cookieStore.get("session")?.value;

  if (!email) {
    return null;
  }

  const user = await prisma.user.findFirst({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      organizationId: true,
    },
  });

  return user;
}

/**
 * Require user to be authenticated and have one of the allowed roles
 * Throws error if not authorized
 */
export async function requireRole(
  allowedRoles: Array<"ADMIN" | "MANAGER" | "STAFF" | "AUDITOR">
): Promise<UserWithRole> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Akses Ditolak: Anda harus login terlebih dahulu.");
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error("Akses Ditolak: Anda tidak memiliki izin untuk melakukan aksi ini.");
  }

  return user;
}
