import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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
