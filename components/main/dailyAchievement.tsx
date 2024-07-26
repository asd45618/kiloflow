import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import styled from "styled-components";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Plugin,
  Chart,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AchievementWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 20px;
  background-color: white; /* 배경 흰색 */
`;

const MessageWrapper = styled.div`
  margin-top: 20px;
  font-size: 18px;
`;

interface DailyAchievementProps {
  achievement: number;
}

const DailyAchievement: React.FC<DailyAchievementProps> = ({ achievement }) => {
  const [chartData, setChartData] = useState({
    labels: ["달성률"],
    datasets: [
      {
        data: [0, 100],
        backgroundColor: ["#36A2EB", "#FFFFFF"],
        hoverBackgroundColor: ["#36A2EB", "#FFFFFF"],
        borderWidth: 0,
      },
    ],
  });
  const [centerText, setCenterText] = useState(`${achievement}%`);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (achievement < 30) {
      setMessage(
        "칼로리 섭취가 너무 적습니다. 건강한 식습관과 규칙적인 운동을 함께 유지하세요."
      );
    } else if (achievement >= 30 && achievement <= 40) {
      setMessage("칼로리 섭취와 운동량이 조금 부족합니다. 더 노력해보세요.");
    } else if (achievement >= 41 && achievement <= 50) {
      setMessage(
        "칼로리 섭취와 운동이 조금씩 균형을 잡아가고 있습니다. 계속해보세요."
      );
    } else if (achievement >= 51 && achievement <= 60) {
      setMessage(
        "칼로리 섭취와 운동이 목표에 가까워지고 있습니다. 아주 잘하고 있어요!"
      );
    } else if (achievement >= 61 && achievement <= 70) {
      setMessage("칼로리 섭취와 운동이 적절합니다. 계속 이 상태를 유지하세요!");
    } else if (achievement >= 71 && achievement <= 80) {
      setMessage(
        "칼로리 섭취와 운동이 매우 좋습니다. 지금처럼 꾸준히 해보세요!"
      );
    } else if (achievement >= 81 && achievement <= 90) {
      setMessage(
        "칼로리 섭취와 운동이 훌륭합니다. 계속해서 좋은 습관을 이어가세요!"
      );
    } else if (achievement >= 91 && achievement <= 99) {
      setMessage("칼로리 섭취와 운동이 거의 완벽합니다. 조금만 더 힘내세요!");
    } else if (achievement === 100) {
      setMessage(
        "오늘의 칼로리 섭취와 운동 목표를 완벽하게 달성했습니다! 지금처럼 건강한 생활을 지속하세요."
      );
    }
  }, [achievement]);

  useEffect(() => {
    setChartData({
      labels: ["달성률"],
      datasets: [
        {
          data: [achievement, 100 - achievement],
          backgroundColor: ["#36A2EB", "#FFFFFF"],
          hoverBackgroundColor: ["#36A2EB", "#FFFFFF"],
          borderWidth: 0,
        },
      ],
    });
    setCenterText(`${achievement}%`);
  }, [achievement]);

  const options = {
    cutout: "70%",
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
    },
  };

  const createCenterTextPlugin = (): Plugin<"doughnut"> => {
    return {
      id: "centerText",
      beforeDraw: (chart: Chart<"doughnut">) => {
        const { ctx, width, height } = chart;
        ctx.restore();
        const fontSize = (height / 114).toFixed(2);
        ctx.font = `${fontSize}em sans-serif`;
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#36A2EB";

        const text = centerText;
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;

        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    };
  };

  return (
    <AchievementWrapper>
      <h2>오늘의 달성률</h2>
      <p>{achievement}</p>
      <Doughnut
        data={chartData}
        options={options}
        plugins={[createCenterTextPlugin()]}
      />
      <MessageWrapper>{message}</MessageWrapper>
    </AchievementWrapper>
  );
};

export default DailyAchievement;
