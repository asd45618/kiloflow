import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import styled from "styled-components";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Plugin,
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

interface Food {
  calorie: number;
}

interface Exercise {
  calories: number;
}

interface DailyAchievementProps {
  userId: number;
  selectedDate: Date;
  foodData: Food[];
  exerciseData: Exercise[];
  dailyCalories: number;
}

const DailyAchievement: React.FC<DailyAchievementProps> = ({
  userId,
  selectedDate,
  foodData,
  exerciseData,
  dailyCalories,
}) => {
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [burnedCalories, setBurnedCalories] = useState(0);
  const [achievement, setAchievement] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const totalConsumedCalories = foodData.reduce(
      (total: number, food: any) => total + Number(food.calorie),
      0
    );

    setConsumedCalories(totalConsumedCalories);

    const totalBurnedCalories = exerciseData.reduce(
      (total: number, exercise: any) => total + exercise.calories,
      0
    );

    setBurnedCalories(totalBurnedCalories);

    if (totalConsumedCalories < dailyCalories * 0.45) {
      setAchievement(0);
    } else if (totalConsumedCalories <= dailyCalories) {
      setAchievement(
        Math.floor(
          ((totalConsumedCalories + totalBurnedCalories) / dailyCalories) * 100
        )
      );
    } else {
      setAchievement(
        Math.floor(
          ((dailyCalories - totalBurnedCalories) / totalConsumedCalories) * 100
        )
      );
    }

    setLoading(false);
  }, [dailyCalories, foodData, exerciseData]);

  useEffect(() => {
    if (consumedCalories < dailyCalories * 0.45) {
      setMessage(
        "섭취한 칼로리 열량이 너무 적습니다. 건강하고 지속가능한 다이어트를 위해 적절한 식이와 운동을 함께 병행하세요."
      );
    } else if (consumedCalories <= dailyCalories) {
      if (achievement >= 31 && achievement <= 40) {
        setMessage("섭취 칼로리 양이 적절합니다. 조금 더 신경써보세요.");
      } else if (achievement >= 41 && achievement <= 50) {
        setMessage("섭취 칼로리 양이 괜찮습니다. 계속 유지하세요.");
      } else if (achievement >= 51 && achievement <= 60) {
        setMessage("섭취 칼로리가 목표에 가까워지고 있습니다. 잘하고 있어요!");
      } else if (achievement >= 61 && achievement <= 70) {
        setMessage("섭취 칼로리가 적절합니다. 잘하고 있습니다!");
      } else if (achievement >= 71 && achievement <= 80) {
        setMessage("섭취 칼로리가 좋습니다. 계속 유지하세요!");
      } else if (achievement >= 81 && achievement <= 90) {
        setMessage("섭취 칼로리가 아주 좋습니다. 계속하세요!");
      } else if (achievement >= 91 && achievement <= 99) {
        setMessage("섭취 칼로리가 거의 목표에 도달했습니다. 잘하고 있어요!");
      } else if (achievement === 100) {
        setMessage(
          "오늘의 섭취 칼로리 목표를 완벽하게 달성했습니다! 계속해서 건강한 식습관을 유지하세요."
        );
      }
    } else {
      setMessage(
        "섭취 칼로리가 목표를 초과했습니다. 내일은 조금 더 신경써서 적정량을 섭취해보세요."
      );
    }
  }, [achievement, dailyCalories]);

  const data = {
    labels: ["달성률"],
    datasets: [
      {
        data: [achievement, 100 - achievement],
        backgroundColor: ["#36A2EB", "#FFFFFF"], // 달성률 부분은 파란색, 나머지 부분은 흰색
        hoverBackgroundColor: ["#36A2EB", "#FFFFFF"],
        borderWidth: 0,
      },
    ],
  };

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

  const createCenterTextPlugin = (text: string): Plugin<"doughnut"> => {
    return {
      id: "centerText",
      beforeDraw: (chart) => {
        const { ctx, width, height } = chart;
        ctx.restore();
        const fontSize = (height / 114).toFixed(2);
        ctx.font = `${fontSize}em sans-serif`;
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#36A2EB";

        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;

        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    };
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AchievementWrapper>
      <h2>오늘의 달성률</h2>

      <p>{achievement}</p>
      <Doughnut
        data={data}
        options={options}
        plugins={[createCenterTextPlugin(`${achievement}%`)]}
      />
      <MessageWrapper>{message}</MessageWrapper>
    </AchievementWrapper>
  );
};

export default DailyAchievement;
