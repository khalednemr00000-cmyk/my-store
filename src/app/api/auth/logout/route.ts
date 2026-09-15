import { NextResponse } from "next/server";
import { destroySessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  await destroySessionCookie();
  return NextResponse.redirect(new URL("/auth/login", request.url));
}
