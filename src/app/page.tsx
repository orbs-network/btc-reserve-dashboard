"use client";
import { useCurrentBtcPrice, useBtcPriceChanged, useUser } from "./hooks";
import { BtcPriceChart } from "@/components/btc-chart";
import { PurchaseDetails } from "@/components/purchase-details";
import { formatNumber } from "./utils";
import moment from "moment";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingContent } from "@/components/ui/loading-content";
import { Navbar } from "@/components/navbar";

const Header = () => {
  const {user} = useUser();
  const { data: btcPrice, isLoading: isBtcPriceLoading } = useCurrentBtcPrice();
  const { data: btcPriceChanged, isLoading: isBtcPriceChangedLoading } =
    useBtcPriceChanged();
  const isPositive = (btcPriceChanged || 0) >= 0;

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-[600] mb-[17px]">
        Welcome back, {user?.firstName}
      </h2>
      <div className="flex items-start flex-col">
        <p className="font-[600] text-[18px]">Bitcoin Market Price</p>
        <div className="flex flex-row gap-2 items-center justify-start text-muted-foreground">
          <LoadingContent
            isLoading={isBtcPriceLoading}
            className="w-[200px] h-[30px]"
          >
            <h4 className="text-[30px] font-[600]">
              {formatNumber(btcPrice?.toString())}
              <span className="text-[16px] "> USD</span>
            </h4>
          </LoadingContent>
          <LoadingContent
            isLoading={isBtcPriceChangedLoading}
            className="w-[70px] h-[24px]"
          >
            <div
              className={`rounded-full pl-3 pr-3 w-fit h-[28px] flex items-center justify-center gap-1 relative top-[2px] ${
                isPositive ? "bg-[#ECFDF3]" : "bg-[rgba(248,215,209,0.2)]"
              }`}
            >
              {isPositive ? (
                <ArrowUpIcon color="#12B76A" size={14} />
              ) : (
                <ArrowDownIcon color="#B42318" size={14} />
              )}
              <p
                className={`text-[14px] font-[500] ${
                  isPositive ? "text-[#027A48]" : "text-[#B42318]"
                }`}
              >
                {btcPriceChanged}%
              </p>
            </div>
          </LoadingContent>
        </div>
      </div>
      <p className="text-[#475467] text-[16px] font-[500]">
        {moment().format("D MMM, HH:mm [UTC]")}
      </p>
    </div>
  );
};

export default function Home() {
  return (
    <div className="flex flex-col gap-[20px] pb-[100px]">
      <Navbar />
      <div className="flex flex-col gap-4 max-w-[1400px] w-full mx-auto pl-6 pr-6">
        <Header />
        <BtcPriceChart />
        <PurchaseDetails />
      </div>
    </div>
  );
}
