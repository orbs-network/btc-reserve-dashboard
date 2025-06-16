import { useQuery } from "@tanstack/react-query";
import { fetchGoogleUser } from "../lib/api";
import { useGoogleLogin } from "@react-oauth/google";
import { GOOGLE_TOKEN_KEY } from "../consts";
import { useCallback } from "react";

export const useUser = () => {
    const {
      data: user,
      refetch,
      isLoading,
    } = useQuery({
      queryKey: ["user"],
      queryFn: async () => {
       try {
          const user = await fetchGoogleUser();
          console.log("user", user);
          return user;
       } catch (error) {
          console.log("error", error);
          return null;
       }
      },
      staleTime: Infinity,
    });
  
    const login = useGoogleLogin({
      scope: [
          'https://www.googleapis.com/auth/drive.readonly',
          'openid',
          'email',
          'profile',
        ].join(' '),
      prompt: "select_account",
      onSuccess: async ({ access_token }) => {
        localStorage.setItem(GOOGLE_TOKEN_KEY, access_token);
        return refetch();
      },
    });
  
    const logout = useCallback(() => {
      localStorage.removeItem(GOOGLE_TOKEN_KEY);
      refetch();
    }, [refetch]);
  
    return { login, logout, user, isLoading };
  };
  