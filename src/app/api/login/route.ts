import { NextResponse } from "next/server";
import { User } from "@/app/types";
import { SignJWT } from "jose";
import { fetchGoogleUser } from "@/app/lib/auth/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }
  const userData = await fetchGoogleUser(token);

  if (!userData) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }
  const jwt = await new SignJWT(userData)
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
  return NextResponse.json<{ user: User; jwt: string }>({
    user: userData,
    jwt,
  });
}
