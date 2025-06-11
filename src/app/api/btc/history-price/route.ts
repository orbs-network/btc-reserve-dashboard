import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const response = await axios.get(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
    {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
        Accept: "application/json",
      },
      params: {
        symbol: "BTC",
        convert: "USD",
      },
    }
  );

  return NextResponse.json(response.data.data.BTC.quote);
}
