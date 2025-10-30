import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ActivityChartProps {
  timeline: { timestamp: string; solChange: number }[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ timeline }) => {
  const data = {
    labels: timeline.map((t) => t.timestamp),
    datasets: [
      {
        label: "SOL Flow",
        data: timeline.map((t) => t.solChange),
        borderColor: "#14F195",
        backgroundColor: "rgba(20, 241, 149, 0.2)",
        tension: 0.3,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { ticks: { color: "#fff" } },
      y: { ticks: { color: "#fff" } },
    },
  };
  return (
    <div className="bg-white/10 rounded-xl p-4">
      <div className="text-white font-bold mb-2">Activity Timeline</div>
      <Line data={data} options={options} height={120} />
    </div>
  );
};

export default ActivityChart;
