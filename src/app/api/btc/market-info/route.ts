import { NextResponse } from "next/server";
import axios from "axios";
import { withJwtToken } from "@/app/lib/auth/server";

export async function GET(request: Request) {
  return withJwtToken(request, async () => {
    const response = await axios.get(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
        },
        params: {
          symbol: 'BTC',
          convert: 'USD'
        }
      }
    );

    return NextResponse.json(response.data.data.BTC.quote.USD);
  });
}
