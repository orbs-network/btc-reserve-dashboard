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
import { useHistoricalBtcPrice } from "@/app/hooks";
import { LoadingContent } from "./ui/loading-content";
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
        type: "time" as const,
        time: {
          unit: "month" as const,
        },
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true, // ✅ show horizontal lines
          color: "rgba(0, 0, 0, 0.05)", // soft light gray lines
          lineWidth: 1,
          drawTicks: false,
        },
        type: "linear" as const,

        beginAtZero: true,

        ticks: {
          display: false,
          padding: 10,
        },
      },
    },
  };

  return (
    <div className="h-[216px] mt-[20px]">
      <LoadingContent isLoading={isLoading} className="h-[100%]">
        <Line
          style={{
            height: "100%",
          }}
          data={chartData}
          options={options}
        />
      </LoadingContent>
    </div>
  );
};
