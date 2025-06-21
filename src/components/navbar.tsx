import React from "react";
import OrbsLogo from "@/assets/orbs-logo.svg";
import Image from "next/image";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useUser } from "@/app/queries";

export function Navbar() {
  const { logout } = useUser();
  return (
    <div className="h-[64px] flex items-center border-b border-[#EAECF0] justify-center">
      <div className="max-w-[1400px] pl-6 pr-6 flex items-center justify-between w-full">
        <Image src={OrbsLogo} alt="Orbs Logo" height={20} />
        <div className="flex items-center gap-2">
          <Button
            onClick={logout}
            variant="ghost"
            className="text-[16px] font-[500] text-muted-foreground flex items-center gap-2"
          >
            <LogOut />
            <p>Logout</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
