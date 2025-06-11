import { NextResponse } from "next/server";
import { fetchGoogleUser } from "./api";
import { jwtVerify } from "jose";
import { User } from "@/app/types";

export async function withJwtToken(
  req: Request,
  handler: (user: any) => Promise<NextResponse>
): Promise<NextResponse> {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    

    return handler(payload);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
