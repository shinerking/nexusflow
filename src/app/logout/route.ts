import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  const url = new URL("/login", request.url);
  return NextResponse.redirect(url);
}
