import styled from "styled-components";
import { useEffect, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";

const TodayFoodListBlock = styled.div`
  padding: 20px;

  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
`;

interface Food {
  food_id: string;
  name: string;
  calorie: number;
  carb: number;
  pro: number;
  fat: number;
  img: string;
  added_at: string;
}

interface TodayFoodListProps {
  userId: number;
  selectedDate: Date;
}

const TodayFoodList: React.FC<TodayFoodListProps> = ({
  userId,
  selectedDate,
}) => {
  const [foodList, setFoodList] = useState<Food[]>([]);

  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const res = await fetch(
          `/api/food/todayFood?user_id=${userId}&date=${selectedDate.toISOString()}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch food list");
        }
        const data = await res.json();
        setFoodList(data);
      } catch (error) {
        console.error("Failed to fetch food list:", error);
      }
    };

    fetchFoodList();
  }, [userId, selectedDate]);

  return (
    <TodayFoodListBlock>
      <h3>오늘 먹은 음식</h3>
      <ul>
        {foodList.map((food) => (
          <li key={food.food_id}>
            <img src={food.img} alt="foodimg" width={30} height={30} />
            <p>{food.name}</p>
            <p>칼로리: {food.calorie} kcal</p>
            <p>탄수화물: {food.carb} g</p>
            <p>단백질: {food.pro} g</p>
            <p>지방: {food.fat} g</p>
            <p>
              추가된 시간:{" "}
              {dayjs(food.added_at)
                .format("A hh:mm")
                .replace("AM", "오전")
                .replace("PM", "오후")}
            </p>
          </li>
        ))}
      </ul>
    </TodayFoodListBlock>
  );
};

export default TodayFoodList;
