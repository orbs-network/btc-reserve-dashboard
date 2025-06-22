import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Filler,
  CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { formatNumber } from "@/app/utils";
import moment from "moment";
import { LoadingContent } from "./ui/loading-content";
import { useHistoricalBtcPrice } from "@/app/queries";
import { useIsMobile } from "@/hooks";
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Filler,
  CategoryScale
);

export const BtcPriceChart = () => {
  const { data, isLoading } = useHistoricalBtcPrice();

  const prices = data?.map(([timestamp, price]) => ({
    x: timestamp,
    y: price,
  }));

  const chartData = {
    datasets: [
      {
        label: "Price",
        data: prices,
        fill: true,
        borderColor: "#4e79ff",
        backgroundColor: (ctx: any) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 150);
          gradient.addColorStop(0, "rgba(78, 121, 255, 0.2)");
          gradient.addColorStop(1, "rgba(78, 121, 255, 0)");
          return gradient;
        },
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  };
const isMobile = useIsMobile();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false as const,
    interaction: {
      mode: "index" as const,
      intersect: false,
      animation: false,
    },

    plugins: {
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#000",
        bodyColor: "#000",
        borderColor: "rgba(0,0,0,0.1)",
        borderWidth: 1,
        cornerRadius: 6,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (ctx: any) => {
           
            const value = formatNumber(ctx.parsed.y.toString(), 2);
            const time = moment(ctx.parsed.x).format("MMM DD");
            return `${value} ${time}`;
          },
          title: () => "", // No title
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: "month" as const,
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 12,
          display: isMobile ? false : true,
        },
        grid: {
          display: false,
        },
      },
      y: {
        type: 'linear' as const,
        grid: {
          drawBorder: false,
          display: true
        },
        ticks: {
          display: isMobile ? false : true,
          callback: (value: number) => value.toLocaleString()
        }
      },
    },
  };

  return (
    <div className={`h-[216px] mt-[20px]`}>
      <LoadingContent isLoading={isLoading} className="h-[100%]">
        <Line
          style={{
            height: "100%",
          }}
          data={chartData}
          options={options as any}
        />
      </LoadingContent>
    </div>
  );
};
