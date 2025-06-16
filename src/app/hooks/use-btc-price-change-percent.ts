import { useQuery } from "@tanstack/react-query";
import { protectedApi } from "../lib/api";
import { QUERIES } from "../consts";
import axios from "axios";

export const useBtcPriceChanged = () => {
  return useQuery({
    queryKey: [QUERIES.BTC_PRICE_CHANGED],
    queryFn: async () => {
      try {
        const url = "https://api.coingecko.com/api/v3/simple/price";
        const params = {
          ids: "bitcoin",
          vs_currencies: "usd",
          include_24hr_change: "true",
        };
        const response = await protectedApi.get(url, { params });

        const data = response.data;

        const change24h = data.bitcoin.usd_24h_change;
        console.log(change24h);
        
        return parseFloat(change24h.toFixed(2));
      } catch (error) {
        console.error(error);
        return "";
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 60_000,
  });
};
