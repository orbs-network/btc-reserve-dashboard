import { GOOGLE_TOKEN_KEY, ORBS_DOMAINS } from "@/app/consts";
import { User } from "@/app/types";
import { parseUser } from "@/app/utils";
import axios, { AxiosError } from "axios";

/** Axios instance that auto-attaches the JWT (if any) */

export const protectedApi = axios.create();

protectedApi.interceptors.request.use((cfg) => {
  const accessToken = localStorage.getItem(GOOGLE_TOKEN_KEY);
  if (accessToken) cfg.headers.Authorization = `Bearer ${accessToken}`;
  return cfg;
});

/** Hit Google’s user-info endpoint and coerce to our User shape. */
export const fetchGoogleUser = async (): Promise<User> => {
  const { data } = await protectedApi.get(
    "https://www.googleapis.com/oauth2/v3/userinfo"
  );

  return parseUser(data);
};
