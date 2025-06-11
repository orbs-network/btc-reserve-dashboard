import { NextResponse } from "next/server";
import { getUsersPurchases } from "@/app/lib/purchases";
import { withJwtToken } from "@/app/lib/auth/server";

export async function GET(request: Request) {
  return withJwtToken(request, async (user) => {

    const data = await getUsersPurchases(user);
      

    return NextResponse.json(data);
  });
}
