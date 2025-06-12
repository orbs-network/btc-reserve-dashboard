import { GOOGLE_TOKEN_KEY, JWT_TOKEN_KEY, ORBS_DOMAINS } from "@/app/consts";
import { User } from "@/app/types";
import axios, { AxiosError } from "axios";


/** Axios instance that auto-attaches the JWT (if any) */
export const protectedApi = axios.create();

protectedApi.interceptors.request.use((cfg) => {
  const jwt = localStorage.getItem(JWT_TOKEN_KEY);
  if (jwt) cfg.headers.Authorization = `Bearer ${jwt}`;
  return cfg;
});

/** Hit Google’s user-info endpoint and coerce to our User shape. */
export const fetchGoogleUser = async (token: string): Promise<User> => {
  const { data } = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return {
    authorized: data.hd === "orbs.com",
    email: data.email,
    emailVerified: data.email_verified,
    avatar: data.picture,
    lastName: data.family_name,
    firstName: data.given_name,
    isAdmin: ORBS_DOMAINS.includes(data.email),
    id: data.email
  };
};
