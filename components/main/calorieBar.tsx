import React from 'react';
import styled from 'styled-components';

const CalorieBarWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  /* margin-top: 20px; */
  padding: 10px 20px 20px;
  /* border-radius: 8px; */
  text-align: center;
`;

const CalorieInfoTop = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
  span {
    &:first-child {
      color: #fff;
      font-size: 32px;
    }
    &:last-child {
      color: #0e5b10;
    }
  }
`;

const GaugeImgWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 10px;
`;

const GaugeWrapper = styled.div`
  width: 80%;
  background-color: rgba(14, 91, 16, 0.5); // 배경을 흰색으로 설정
  border-radius: 20px;
  overflow: hidden;
  /* margin-bottom: 10px; */
  /* border: 1px solid #e0e0e0; // 회색 테두리 추가 */
`;

const Nutrient = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px 0;
  p {
    width: 32px;
    height: 32px;
    line-height: 32px;
    border-radius: 50%;
    margin-bottom: 0;
    font-weight: bold;
  }
`;

const NutrientFigure = styled.div`
  display: flex;
  align-items: center;
  p {
    &.carb {
      background: #ff6b6b;
    }
    &.protein {
      background: #6b95ff;
    }
    &.fat {
      background: #ffd66b;
    }
  }
  span {
    margin: 0 20px 0 10px;
    font-size: 22px;
    color: #fff;
  }
`;

const CalorieInfoBottom = styled.div`
  display: flex;
  justify-content: center;
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: bold;
`;

const Gauge = styled.div<{ width: number }>`
  width: ${({ width }) => width}%;
  height: 40px;
  background-color: rgba(14, 91, 16, 0.5);
`;

interface CalorieBarProps {
  foodData: { calorie: number; carb: number; pro: number; fat: number }[];
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

  const totalCarb = Math.round(
    foodData.reduce((total, food) => total + Number(food.carb), 0)
  );

  const totalProtein = Math.round(
    foodData.reduce((total, food) => total + Number(food.pro), 0)
  );

  const totalFat = Math.round(
    foodData.reduce((total, food) => total + Number(food.fat), 0)
  );

  const percentage = Math.min(
    Math.floor((totalFoodCalories / dailyCalories) * 100),
    100
  );

  console.log(
    'totalFood, totoalExercise, dailyCalorie',
    totalFoodCalories,
    totalExerciseCalories,
    dailyCalories
  );
  console.log('kcalpercentage', percentage);

  return (
    <CalorieBarWrapper>
      <CalorieInfoTop>
        <span>{totalFoodCalories}</span> / <span>{dailyCalories} kcal</span>
      </CalorieInfoTop>
      {/* <p>{percentage}</p> */}
      <GaugeImgWrapper>
        <img src='../../mainBarImg.png' alt='' />
        <GaugeWrapper>
          <Gauge width={percentage} />
        </GaugeWrapper>
      </GaugeImgWrapper>
      <Nutrient>
        <NutrientFigure>
          <p className='carb'>탄</p>
          <span>{totalCarb}g</span>
        </NutrientFigure>
        <NutrientFigure>
          <p className='protein'>단</p>
          <span>{totalProtein}g</span>
        </NutrientFigure>
        <NutrientFigure>
          <p className='fat'>지</p>
          <span>{totalFat}g</span>
        </NutrientFigure>
      </Nutrient>
      <CalorieInfoBottom>
        <img src='../../mainFire.png' alt='' />
        {totalExerciseCalories} kcal 태웠습니다.
      </CalorieInfoBottom>
    </CalorieBarWrapper>
  );
};

export default CalorieBar;
