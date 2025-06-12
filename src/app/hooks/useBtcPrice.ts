import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { protectedApi } from "../lib/auth/api";
import moment from "moment";
import { QUERIES } from "../consts";

export function useCurrentBtcPrice() {
  return useQuery({
    queryKey: [QUERIES.BTC_PRICE],
    queryFn: async () => {
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      );
      return res.data.bitcoin.usd as number;
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 60_000,
  });
}

export function useHistoricalBtcPrice() {
  return useQuery<[number, number][]>({
    queryKey: [QUERIES.BTC_HISTORY],
    queryFn: async () => {

        const days = moment().diff(moment("2025-01-01"), "days");
        
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart",
        {
          params: {
            vs_currency: "usd",
            days,
            interval: "daily",
          },
        }
      );

      const prices = response.data.prices; 
      return prices;
    },
    staleTime: Infinity,
  });
}

export const useBtcPriceChanged = () => {
  return useQuery({
    queryKey: [QUERIES.BTC_PRICE_CHANGED],
    queryFn: async () => {
      try {
        const response = (await protectedApi.get("/api/btc/market-info")).data;

        return parseFloat(response.percent_change_24h.toFixed(2));
      } catch (error) {
        console.error(error);
        return "";
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 60_000,
  });
};
