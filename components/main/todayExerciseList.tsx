import { faSquareMinus } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';

const TodayExerciseListBlock = styled.div`
  padding: 20px;
  /* background-color: #f5f5f5; */
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
  p {
    margin-bottom: 0;
  }
  ul {
    padding: 0;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      border-bottom: 1px solid #ccc;
      margin-bottom: 10px;
      padding-bottom: 10px;
      .time {
        flex: 0 0 25%;
      }
      .info {
        flex: 0 0 60%;
      }
      .minus_btn {
        flex: 0 0 10%;
        display: flex;
        align-items: center;
        font-size: 24px;
        svg {
          cursor: pointer;
        }
      }
    }
  }
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
  exerciseData: Exercise[];
  currentUser: number;
}

const TodayExerciseList: React.FC<TodayExerciseListProps> = ({
  exerciseData,
  currentUser,
}) => {
  const deleteTodayExercise = async (exercise_id: number) => {
    try {
      const res = await fetch('/api/food/deleteTodayExercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exercise_id, currentUser }),
      });

      if (res.ok) {
        alert('삭제가 완료되었습니다.');
        // router.push("/food/list");
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('An unexpected error occurred');
    }
  };

  return (
    <TodayExerciseListBlock>
      <ul>
        {exerciseData.map((exercise) => (
          <li key={exercise.exercise_id}>
            <div className='time'>
              <p>
                {new Date(exercise.added_at).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
            </div>
            <div className='info'>
              <p>운동명: {exercise.name}</p>
              <p>운동 시간: {exercise.duration} 분</p>
              <p>소모 칼로리: {exercise.calories} kcal</p>
            </div>
            <div
              className='minus_btn'
              onClick={() => deleteTodayExercise(exercise.exercise_id)}
            >
              <FontAwesomeIcon icon={faSquareMinus} />
            </div>
          </li>
        ))}
      </ul>
    </TodayExerciseListBlock>
  );
};

export default TodayExerciseList;
