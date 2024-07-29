import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import styled from 'styled-components';
import useAchievement from '../../../../components/main/useAchievementHook';

const ExerciseDetailWrapper = styled.div`
  padding: 10px;
  text-align: center;
  .detail_top {
    display: flex;
    justify-content: center;
    position: relative;
    h1 {
      width: 70%;
      font-weight: bold;
    }
    span {
      margin-left: 10px;
      font-size: 30px;
      svg {
        cursor: pointer;
      }
    }
    .back {
      position: absolute;
      top: 12px;
      left: 15px;
      cursor: pointer;
      font-size: 24px;
    }
  }
  p {
    margin: 30px 0;
    font-size: 24px;
  }
  .calculation {
    display: flex;
    justify-content: center;
    input {
      width: 15%;
      margin-right: 5px;
      text-align: center;
      border: 1px solid #000;
      border-radius: 5px;
      outline: none;
      background-color: inherit;
      &::-webkit-inner-spin-button,
      ::-webkit-inner-spin-button {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
      }
    }
    span {
    }
  }
`;

const DetailPlusWrapper = styled.div<{ disabled: boolean }>`
  svg {
    font-size: 30px;
    cursor: pointer;
    color: ${(props) => (props.disabled ? 'lightgrey' : 'black')};
    pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  }
`;

interface TodayFood {
  calorie: number;
}

interface ExerciseData {
  calories: number;
}

export default function ExerciseDetail() {
  const router = useRouter();
  const { name, MET, id } = JSON.parse(router.query.data as string);
  const [min, setMin] = useState(0);
  const [userName, setUserName] = useState('');
  const [userWeight, setUserWeight] = useState(0);
  const [currentUserID, setCurrentUserID] = useState('');
  const [foodData, setFoodData] = useState<TodayFood[]>([]);
  const [exerciseData, setExerciseData] = useState<ExerciseData[]>([]);
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [isTodayDataLoaded, setIsTodayDataLoaded] = useState(false);

  // useAchievement 훅을 사용
  const { achievement, loading, consumedCalories, burnedCalories } =
    useAchievement({
      foodData,
      exerciseData,
      dailyCalories,
    });

  const changeMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMin(parseInt(e.target.value));
  };

  const addTodayExercise = async () => {
    const calories = (MET * 3.5 * userWeight * min) / 200;
    try {
      const res = await fetch('/api/exercise/todayExercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUserID,
          exercise_id: id,
          duration: min,
          calories: calories,
        }),
      });

      if (res.ok) {
        const rec = await res.json();
        const newExerciseData = [...exerciseData, { calories }];
        setExerciseData(newExerciseData);

        const newAchievement = achievement;
        try {
          const res = await fetch(
            `/api/achievement/get?user_id=${currentUserID}&date=${
              new Date().toISOString().split('T')[0]
            }`,
            {
              method: 'GET',
            }
          );

          if (res.ok) {
            await fetch('/api/achievement/update', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: currentUserID,
                date: new Date().toISOString().split('T')[0],
                achievement: newAchievement,
              }),
            });
            router.back();
          } else {
            await fetch('/api/achievement/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: currentUserID,
                date: new Date().toISOString().split('T')[0],
                achievement: newAchievement,
              }),
            });
            router.back();
          }
        } catch (error) {
          console.error('Failed to update or create achievement:', error);
        }

        alert(`${name} ${rec.message}`);
        router.back();
      } else {
        alert('추가에 실패했습니다.');
      }
    } catch (err) {
      alert('추가에 실패했습니다.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserName(data.user.nickname);
            setUserWeight(data.userProfile.weight);
            setCurrentUserID(data.user.user_id);
            setDailyCalories(data.userProfile.daily_calories);
            await fetchTodayFoodData(data.user.user_id);
            await fecthTodayExerciseData(data.user.user_id);
            setIsTodayDataLoaded(true);
          } else {
            throw new Error('데이터를 불러오는 데 실패했습니다.');
          }
        }
      } catch (error) {
        console.error('API 요청 에러:', error);
      }
    };

    const fetchTodayFoodData = async (userId: number) => {
      try {
        const res = await fetch(
          `/api/food/todayFood?user_id=${userId}&date=${
            new Date().toISOString().split('T')[0]
          }`,
          {
            method: 'GET',
          }
        );

        if (res.ok) {
          const data = await res.json();
          setFoodData(data);
        } else {
          alert('오늘의 음식 데이터를 불러오는 데 실패했습니다.');
        }
      } catch (err) {
        alert('오늘의 음식 데이터를 불러오는 데 실패했습니다.');
      }
    };

    const fecthTodayExerciseData = async (userId: number) => {
      try {
        const res = await fetch(
          `/api/exercise/todayExercise?user_id=${userId}&date=${
            new Date().toISOString().split('T')[0]
          }`,
          {
            method: 'GET',
          }
        );

        if (res.ok) {
          const data = await res.json();
          setExerciseData(data);
        } else {
          alert('오늘의 운동 데이터를 불러오는 데 실패했습니다.');
        }
      } catch (err) {
        alert('오늘의 운동 데이터를 불러오는 데 실패했습니다.');
      }
    };

    fetchData();
  }, []);

  return (
    <ExerciseDetailWrapper>
      <div className='detail_top'>
        <h1>{name}</h1>

        <div className='back' onClick={() => router.back()}>
          <IoIosArrowBack />
        </div>
      </div>
      <p>{userName}님 기준</p>
      <div className='calculation'>
        <input type='number' onChange={changeMin} value={min} />
        <span>
          분에 약 {min ? Math.round((MET * 3.5 * userWeight * min) / 200) : 0}{' '}
          kcal 소모 가능합니다.
        </span>
      </div>
      <DetailPlusWrapper
        className='detail__plus'
        onClick={addTodayExercise}
        disabled={!isTodayDataLoaded}
      >
        <FontAwesomeIcon icon={faSquarePlus} />
      </DetailPlusWrapper>
    </ExerciseDetailWrapper>
  );
}
