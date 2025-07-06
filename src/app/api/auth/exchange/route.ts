import { PRODUCTION_URL } from "@/app/consts";

// app/api/auth/exchange/route.ts
export async function POST(req: Request) {
    const body = await req.json();
  
    const params = new URLSearchParams({
      code: body.code,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!!,
      redirect_uri: `${PRODUCTION_URL}/auth/callback`,
      grant_type: "authorization_code",
    });
  
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
  
    const data = await res.json();
  
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  