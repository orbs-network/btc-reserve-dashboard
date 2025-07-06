import WithdrawLogo from "@/assets/withdraw.svg";
import AverageLogo from "@/assets/average.svg";
import DepositLogo from "@/assets/current-value.svg";
import BtcLogo from "@/assets/btc.svg";
import NumberFlow from "@number-flow/react";
import { ReceiptText, CircleQuestionMark } from "lucide-react";
import React, { ReactNode } from "react";
import Image from "next/image";
import { abbreviate, formatNumber } from "@/app/utils";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import moment from "moment";
import { useCurrentBtcPrice, usePurchases } from "@/app/queries";
import { ResponsiveTooltip } from "./ui/tooltip";
function Card({
  title,
  icon,
  children,
  actionButton,
  tooltipContent,
}: {
  title: string;
  icon: string;
  children?: React.ReactNode;
  actionButton?: React.ReactNode;
  tooltipContent?: React.ReactNode;
}) {
  return (
    <div className="p-3 rounded-lg shadow-[0px_1px_3px_0px_#1018281A] bg-[#D7DDFF] card-container w-full text-muted-foreground md:w-full">
      <div className="flex relative h-full flex-col items-start bg-[#e3e7ff] rounded-lg p-4 border-white border-solid border-[0.5px]">
        {actionButton && (
          <div className="absolute top-[5px] right-[5px]">{actionButton}</div>
        )}
        <Image
          src={icon}
          alt={title}
          width={20}
          height={20}
          className="mb-[10px]"
        />

        <div className="flex flex-col items-start mt-auto">
          <div className="flex flex-row gap-1 items-center">
            <h3 className="text-[14px] ">{title}</h3>
            {tooltipContent && <CardTooltip>{tooltipContent}</CardTooltip>}
          </div>
          <div className="text-[16px] font-[600] flex flex-row gap-[5px] items-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const CardValue = ({
  value,
  isLoading,
  suffix,
  children,
}: {
  value: number;
  isLoading?: boolean;
  suffix?: ReactNode;
  children?: ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative flex flex-row gap-[5px] items-center">
        {isLoading && (
          <Skeleton className="w-[60px] h-[20px] absolute top-[10px] left-0" />
        )}
        <NumberFlow
          value={value}
          className={`text-[18px] font-[600] sm:text-[22px] ${
            isLoading ? "opacity-0" : ""
          }`}
        />
        {suffix && !isLoading && (
          <p className="text-[16px] relative top-[2px]">{suffix}</p>
        )}
      </div>
      {children}
    </div>
  );
};

const AllPurchases = () => {
  const { data } = usePurchases();

  return (
    <Dialog>
      <ResponsiveTooltip content={<p>Purchase History</p>}>
        <DialogTrigger asChild>
          <Button className="rounded-full p-0 w-[30px] h-[30px] bg-white">
            <ReceiptText size="14px" className="text-muted-foreground" />
          </Button>
        </DialogTrigger>
      </ResponsiveTooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase History</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[500px] flex flex-col gap-2">
          {data?.purchases
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((it) => {
              return (
                <div
                  className="flex flex-row gap-1 text-muted-foreground bg-muted p-2 rounded-lg justify-between text-[14px] font-medium"
                  key={it.timestamp}
                >
                  <p>{moment(it.timestamp).format("MMM D, YYYY")}</p>
                  <p>
                    {formatNumber(it.btc.toString())} BTC{" "}
                    <span className="text-muted-foreground text-[14px] opacity-70">{`($${formatNumber(
                      it.price.toString(),
                      2
                    )})`}</span>
                  </p>
                </div>
              );
            })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function PurchaseDetails() {
  const { data, isLoading } = usePurchases();
  const { data: btcPrice } = useCurrentBtcPrice();
  const usdPrice = Number(data?.totalBTC || "0") * (btcPrice || 0);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 flex-wrap justify-between items-stretch sm:flex-nowrap mt-[10px]">
        <Card
          title="Total Bitcoin Purchased"
          icon={BtcLogo}
          actionButton={<AllPurchases />}
        >
          <CardValue
            value={Number(data?.totalBTC || "0")}
            isLoading={isLoading}
            suffix={<span>BTC</span>}
          >
            <p className="text-[13px] relative">
              Updated USD Value{" "}
              <small className="font-normal text-[13px] ml-[3px] relative top-[-1px]">
                (${abbreviate(usdPrice.toString())})
              </small>
            </p>
          </CardValue>
        </Card>
        <Card title="Average Bitcoin Purchase Price" icon={AverageLogo}>
          <CardValue
            value={Number(data?.avgPurchasePrice || "0")}
            isLoading={isLoading}
            suffix="USD"
          />
        </Card>
        <Card
          title="Available to Withdraw"
          icon={WithdrawLogo}
          tooltipContent={<WithdrawTooltipContent />}
        >
          <CardValue value={0} suffix="BTC" />
        </Card>
        <Card title="Current Value Available" icon={DepositLogo}>
          <CardValue value={0} suffix="USD" />
        </Card>
      </div>
    </div>
  );
}

const CardTooltip = ({ children }: { children: React.ReactNode }) => {
  return (
    <ResponsiveTooltip content={children}>
      <CircleQuestionMark size="16px" className="text-muted-foreground" />
    </ResponsiveTooltip>
  );
};

const WithdrawTooltipContent = () => {
  return (
    <div>
      <p>
        Starting two years after the Retention Bonus grant date, you may choose
        to receive a reduced pro rata cash bonus. This is calculated by taking
        the original BTC amount, adjusting it based on the proportion of days
        passed out of 1,095 (three years), and then receiving 50% of that
        adjusted gross amount in cash.
      </p>
      <br />
      <p>
        After three years, the bonus fully vests, you may request, at any time,
        to receive 100% of the BTC Base Amount as a gross cash bonus in their
        salary currency, based on the BTC exchange rate on the request date.
        Payment will follow the Company’s regular payroll practices.{" "}
      </p>
    </div>
  );
};
