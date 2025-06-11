import { NextResponse } from "next/server";
import { withJwtToken } from "@/app/lib/auth/server";

export async function GET(request: Request) {
  
  return withJwtToken(request, async (user) => {
    
    return NextResponse.json(user);
  });
}
