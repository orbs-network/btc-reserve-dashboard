import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";
import { protectedApi } from "./api";
import { JWT_TOKEN_KEY } from "@/app/consts";
import { User } from "@/app/types";
import { useUserStore } from "@/app/store";
import { GOOGLE_TOKEN_KEY } from "@/app/consts";
import axios, { AxiosError } from "axios";

/* ---- Hook: useLogin --------------------------------------------------- */

const useGetUserWithJwt = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { mutateAsync: getUser, isPending } = useMutation<User>({
    mutationFn: async () => {
      const jwt = localStorage.getItem(JWT_TOKEN_KEY);

      if (!jwt) throw new Error("JWT token not found");
      return protectedApi.get("/api/auth").then((r) => r.data);
    },
    onError: (error) => {
      console.log("error", { error });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  return { callback: getUser, isLoading };
};

export const useLogin = () => {
  const { setUser } = useUserStore();
  const { mutateAsync: onLoginSuccess, isPending } = useMutation({
    mutationFn: async () => {
      const googleToken = localStorage.getItem(GOOGLE_TOKEN_KEY);
      if (!googleToken) throw new Error("Google token missing");
      const { user, jwt } = await axios
        .get<{ user: User; jwt: string }>(`/api/login?token=${googleToken}`)
        .then((r) => r.data);
      return {
        user,
        jwt,
      };
    },
  });

  const { callback: getUserWithJwt, isLoading: isGettingUser } =
    useGetUserWithJwt();

  const gerUserOnLoad = useCallback(async () => {
    const user = await getUserWithJwt();

    setUser(user);
  }, [getUserWithJwt, setUser]);

  useEffect(() => {
    gerUserOnLoad();
  }, [gerUserOnLoad]);

  const login = useGoogleLogin({
    prompt: "select_account",
    onSuccess: async ({ access_token }) => {
      localStorage.setItem(GOOGLE_TOKEN_KEY, access_token);
      console.log("got google access token", access_token);

      const { user, jwt } = await onLoginSuccess();
      setUser(user);
      localStorage.setItem(JWT_TOKEN_KEY, jwt);
      console.log("got user", user);
    },
  });

  return { login: () => login(), loading: isPending || isGettingUser };
};

/* ---- Hook: useLogout -------------------------------------------------- */

export const useLogout = () => {
  const { setUser } = useUserStore();
  return useCallback(() => {
    localStorage.removeItem(GOOGLE_TOKEN_KEY);
    localStorage.removeItem(JWT_TOKEN_KEY);
    setUser(undefined);
  }, [setUser]);
};

/* ---- Selector --------------------------------------------------------- */

export const useUser = () => useUserStore((s) => s.user);
