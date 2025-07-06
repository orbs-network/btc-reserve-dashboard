import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GOOGLE_TOKEN_KEY, PRODUCTION_URL, QUERIES } from "./consts";
import moment from "moment";
import { fetchGoogleUser, protectedApi } from "./lib/api";
import { useGoogleLogin } from "@react-oauth/google";
import { useCallback } from "react";
import { ParsedSheetRecord } from "./types";
import { getUsersPurchases } from "./lib/lib";
import { useIsMobile } from "@/hooks";

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
        const url = "https://api.coingecko.com/api/v3/simple/price";
        const params = {
          ids: "bitcoin",
          vs_currencies: "usd",
          include_24hr_change: "true",
        };
        const response = await protectedApi.get(url, { params });

        const data = response.data;

        const change24h = data.bitcoin.usd_24h_change;

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

export const useUserQuery = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const user = await fetchGoogleUser();
        return user;
      } catch (error) {
        console.log("error", error);
        return null;
      }
    },
    staleTime: Infinity,
  });
};

const scope = [
  "https://www.googleapis.com/auth/drive.readonly",
  "openid",
  "email",
  "profile",
].join(" ");

export const useUser = () => {
  const { data: user, isLoading, refetch } = useUserQuery();
  const isMobile = useIsMobile();
  const loginDesktop = useGoogleLogin({
    scope,
    prompt: "select_account",
    onSuccess: async ({ access_token }) => {
      localStorage.setItem(GOOGLE_TOKEN_KEY, access_token);
      refetch();
    },
  });

  const loginMobile = useCallback(() => {
    if (typeof window === "undefined") return;
    const tokenClient = (window as any).google.accounts.oauth2.initCodeClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      scope,
      ux_mode: "redirect",
      redirect_uri: `${PRODUCTION_URL}/auth/callback`, // Must be whitelisted in Google Console
      prompt: "select_account",
      callback: () => {}, // won't be called in redirect mode
    });

    // Trigger login manually
    tokenClient.requestCode();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(GOOGLE_TOKEN_KEY);
    refetch();
  }, [refetch]);
  const login = isMobile ? loginMobile : loginDesktop;
  return { login, logout, user, isLoading, refetchUser: refetch };
};

export function usePurchases() {
  const { user } = useUser();
  return useQuery<ParsedSheetRecord>({
    queryKey: ["purchases", user?.email],
    queryFn: async () => getUsersPurchases(user!),
    enabled: !!user,
  });
}
