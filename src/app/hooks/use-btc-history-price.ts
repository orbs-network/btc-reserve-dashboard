import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import { QUERIES } from "../consts";


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

