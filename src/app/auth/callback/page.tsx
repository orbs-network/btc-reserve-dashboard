"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/queries";
import { GOOGLE_TOKEN_KEY } from "@/app/consts";
import { Fade } from "@/components/ui/fade";
import { Spinner } from "@/components/ui/spinner";

export default function AuthCallback() {
  const router = useRouter();
  const { refetchUser } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      fetch("/api/auth/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          console.log("Token response:", data);
          localStorage.setItem(GOOGLE_TOKEN_KEY, data.access_token);
          await refetchUser();
          router.replace("/");
        })
        .catch((err) => {
          console.error("Token exchange failed", err);
        });
    } else {
      console.error("No code in URL");
    }
  }, [router]);

  return (
    <Fade className="flex flex-col items-center justify-center h-screen max-w-[360px] ml-auto mr-auto gap-[20px] pl-6 pr-6">
      <Spinner className="w-[100px] h-[100px] border-8" />
    </Fade>
  );
}
