import React from "react";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/assets/google.svg";
import OrbsLogo from "@/assets/orbs-logo.svg";

import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "../hooks";

export function LoginLayout({ children }: { children: React.ReactNode }) {
  const {login, user, isLoading} = useUser();

  if (isLoading) {
    return (
      <Container>
        <Spinner className="w-[100px] h-[100px] border-8" />
      </Container>
    );
  }

  if (user?.authorized) {
    return <>{children}</>;
  }

  return (
    <Container>
      <Image src={OrbsLogo} alt="Orbs" height={20} />
      <div className="flex flex-col gap-[10px]">
        <h1 className="text-[30px] font-[600] text-center h-lh-[30px] leading-[40px]">
          Bitcoin Reserve Dashboard
        </h1>
        <h4 className="text-center h-lh-[20px] text-secondary-foreground leading-[20px] mt-[10px]">
          Welcome back! Please sign in below.
        </h4>
      </div>
      <Button onClick={() => login()} variant="outline" className="w-full">
        <Image src={GoogleIcon} alt="Google" width={20} height={20} />
        Sign in with Google
      </Button>
    </Container>
  );
}

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen max-w-[360px] ml-auto mr-auto gap-[20px]">
      {children}
    </div>
  );
};
