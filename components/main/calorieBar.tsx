import React from "react";
import styled from "styled-components";

const CalorieBarWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  text-align: center;
`;

const CalorieInfo = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
`;

const GaugeWrapper = styled.div`
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const Gauge = styled.div<{ width: number }>`
  width: ${({ width }) => width}%;
  height: 20px;
  background-color: #007bff;
`;

interface CalorieBarProps {
  foodData: { calorie: number }[];
  exerciseData: { calories: number }[];
  dailyCalories: number;
}

const CalorieBar: React.FC<CalorieBarProps> = ({
  foodData,
  exerciseData,
  dailyCalories,
}) => {
  const totalFoodCalories = foodData.reduce(
    (total, food) => total + Number(food.calorie),
    0
  );

  const totalExerciseCalories = exerciseData.reduce(
    (total, exercise) => total + exercise.calories,
    0
  );

  const percentage = Math.min((totalFoodCalories / dailyCalories) * 100, 100);

  return (
    <CalorieBarWrapper>
      <CalorieInfo>
        {totalFoodCalories} / {dailyCalories} kcal
      </CalorieInfo>
      <GaugeWrapper>
        <Gauge width={percentage} />
      </GaugeWrapper>
      <CalorieInfo>{totalExerciseCalories} kcal 태웠습니다.</CalorieInfo>
    </CalorieBarWrapper>
  );
};

export default CalorieBar;
