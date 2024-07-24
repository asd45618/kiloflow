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
}

const DailyAchievement: React.FC<DailyAchievementProps> = ({
  userId,
  selectedDate,
  foodData,
  exerciseData,
}) => {
  const [dailyCalories, setDailyCalories] = useState(0);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [burnedCalories, setBurnedCalories] = useState(0);
  const [achievement, setAchievement] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await res.json();
        const userProfile = data.userProfile;

        setDailyCalories(userProfile.daily_calories);

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

        let achievementRate = 0;

        if (totalConsumedCalories < dailyCalories * 0.45) {
          achievementRate = 0;
          setMessage(
            "섭취한 칼로리 열량이 너무 적습니다. 건강하고 지속가능한 다이어트를 위해 적절한 식이와 운동을 함께 병행하세요."
          );
        } else if (totalConsumedCalories <= dailyCalories) {
          achievementRate =
            ((totalConsumedCalories + totalBurnedCalories) / dailyCalories) *
            100;

          if (achievementRate >= 31 && achievementRate <= 40) {
            setMessage("섭취 칼로리 양이 적절합니다. 조금 더 신경써보세요.");
          } else if (achievementRate >= 41 && achievementRate <= 50) {
            setMessage("섭취 칼로리 양이 괜찮습니다. 계속 유지하세요.");
          } else if (achievementRate >= 51 && achievementRate <= 60) {
            setMessage(
              "섭취 칼로리가 목표에 가까워지고 있습니다. 잘하고 있어요!"
            );
          } else if (achievementRate >= 61 && achievementRate <= 70) {
            setMessage("섭취 칼로리가 적절합니다. 잘하고 있습니다!");
          } else if (achievementRate >= 71 && achievementRate <= 80) {
            setMessage("섭취 칼로리가 좋습니다. 계속 유지하세요!");
          } else if (achievementRate >= 81 && achievementRate <= 90) {
            setMessage("섭취 칼로리가 아주 좋습니다. 계속하세요!");
          } else if (achievementRate >= 91 && achievementRate <= 99) {
            setMessage(
              "섭취 칼로리가 거의 목표에 도달했습니다. 잘하고 있어요!"
            );
          } else if (achievementRate === 100) {
            setMessage(
              "오늘의 섭취 칼로리 목표를 완벽하게 달성했습니다! 계속해서 건강한 식습관을 유지하세요."
            );
          }
        } else {
          achievementRate =
            ((dailyCalories - totalBurnedCalories) / totalConsumedCalories) *
            100;
          setMessage(
            "섭취 칼로리가 목표를 초과했습니다. 내일은 조금 더 신경써서 적정량을 섭취해보세요."
          );
        }

        setAchievement(achievementRate);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, selectedDate, foodData, exerciseData]);

  const data = {
    labels: ["달성률"],
    datasets: [
      {
        data: [achievement],
        backgroundColor: ["#36A2EB"],
        hoverBackgroundColor: ["#36A2EB"],
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
      <Doughnut
        data={data}
        options={options}
        plugins={[createCenterTextPlugin(`${achievement.toFixed(0)}%`)]}
      />
      <MessageWrapper>{message}</MessageWrapper>
    </AchievementWrapper>
  );
};

export default DailyAchievement;
