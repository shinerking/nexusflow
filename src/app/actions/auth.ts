"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData): Promise<never> {
  const email = formData.get("email")?.toString().trim();
  // Simple auth: set session cookie (no password check for demo)
  if (email) {
    const cookieStore = await cookies();
    cookieStore.set("session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
  }
  redirect("/");
}

export async function logout(): Promise<never> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}
