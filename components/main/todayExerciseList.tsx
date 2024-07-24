import styled from "styled-components";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

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
          throw new Error("운동리스트 가져오기 실패");
        }
        const data = await res.json();
        setExerciseList(data);
      } catch (error) {
        console.error("운동리스트 패치 실패", error);
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
            <p>MET: {exercise.MET}</p>
            <p>추가한 시간: {dayjs(exercise.added_at).format("A hh:mm")}</p>
          </li>
        ))}
      </ul>
    </TodayExerciseListBlock>
  );
};

export default TodayExerciseList;
