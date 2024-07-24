import { useEffect, useState } from "react";
import styled from "styled-components";

const TodayExerciseListBlock = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
`;

interface Exercise {
  exercise_id: number;
  name: string;
  MET: string;
  duration: number;
  calories: number;
  added_at: string;
}

interface TodayExerciseListProps {
  userId: number;
  selectedDate: Date;
}

const TodayExerciseList: React.FC<TodayExerciseListProps> = ({
  userId,
  selectedDate,
}) => {
  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);

  useEffect(() => {
    const fetchExerciseList = async () => {
      try {
        const res = await fetch(
          `/api/exercise/todayExercise?user_id=${userId}&date=${selectedDate.toISOString()}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch exercise list");
        }
        const data = await res.json();
        setExerciseList(data);
      } catch (error) {
        console.error("Failed to fetch exercise list:", error);
      }
    };

    fetchExerciseList();
  }, [userId, selectedDate]);

  return (
    <TodayExerciseListBlock>
      <h3>오늘 한 운동</h3>
      <ul>
        {exerciseList.map((exercise) => (
          <li key={exercise.exercise_id}>
            <p>운동명: {exercise.name}</p>
            <p>운동 시간: {exercise.duration} 분</p>
            <p>소모 칼로리: {exercise.calories} kcal</p>
            <p>
              추가 시간:{" "}
              {new Date(exercise.added_at).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </li>
        ))}
      </ul>
    </TodayExerciseListBlock>
  );
};

export default TodayExerciseList;
