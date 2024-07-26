import { useState, useEffect } from "react";

interface Food {
  calorie: number;
}

interface Exercise {
  calories: number;
}

interface AchievementParams {
  foodData: Food[];
  exerciseData: Exercise[];
  dailyCalories: number;
}

const useAchievement = ({
  foodData,
  exerciseData,
  dailyCalories,
}: AchievementParams) => {
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [burnedCalories, setBurnedCalories] = useState(0);
  const [achievement, setAchievement] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("전달받은 foodData", foodData);
    console.log("전달받은 exerciseDate", exerciseData);
    console.log("전달받은 dailyCalories", dailyCalories);
    const totalConsumedCalories = foodData.reduce(
      (total: number, food: any) => total + Number(food.calorie),
      0
    );

    setConsumedCalories(totalConsumedCalories);

    console.log("totalConsumedCalories", totalConsumedCalories);

    const totalBurnedCalories = exerciseData.reduce(
      (total: number, exercise: any) => total + exercise.calories,
      0
    );

    setBurnedCalories(totalBurnedCalories);

    console.log("burnedCalories", totalBurnedCalories);

    let newAchievement = 0;

    if (totalConsumedCalories < dailyCalories * 0.3) {
      newAchievement = 0;
    } else if (totalConsumedCalories <= dailyCalories) {
      newAchievement = Math.floor(
        ((totalConsumedCalories + totalBurnedCalories) / dailyCalories) * 100
      );
    } else if (totalConsumedCalories > dailyCalories) {
      newAchievement = Math.floor(
        ((dailyCalories + totalBurnedCalories) / totalConsumedCalories) * 100
      );
    }

    newAchievement = Math.min(newAchievement, 100);

    setAchievement(newAchievement);
    console.log("계산된 달성률", newAchievement);
    setLoading(false);
  }, [dailyCalories, foodData, exerciseData]);

  return { achievement, loading, consumedCalories, burnedCalories };
};

export default useAchievement;
