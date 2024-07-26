import React from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
import { ChartData, ChartOptions } from "chart.js";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  height: 400px;
  margin-top: 20px;
`;

interface WeeklyAchievementChartProps {
  data: ChartData<"line">;
  options?: ChartOptions<"line">;
}

const WeeklyAchievementChart: React.FC<WeeklyAchievementChartProps> = ({
  data,
  options,
}) => {
  // 기본 옵션 설정
  const defaultOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <ChartWrapper>
      <h3>주간 달성률</h3>
      <Line data={data} options={options || defaultOptions} />
    </ChartWrapper>
  );
};

export default WeeklyAchievementChart;
