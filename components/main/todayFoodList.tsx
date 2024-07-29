import styled from 'styled-components';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareMinus } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import useAchievement from './useAchievementHook';

const TodayFoodListBlock = styled.div`
  /* padding: 20px; */
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
      flex-wrap: wrap;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ccc;
      .time {
        flex: 0 0 20%;
        display: flex;
        align-items: center;
        p {
        }
      }
      .food_img {
        flex: 0 0 20%;
        img {
          width: 80px;
          height: 80px;
        }
      }
      .food_info {
        flex: 0 0 50%;
        padding-left: 10px;
        .nutrient {
          display: flex;
          /* justify-content: space-between; */
          p {
            margin-right: 5px;
          }
        }
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
  foodData: Food[];
  currentUser: number;
}

interface ExerciseData {
  calories: number;
}

const TodayFoodList: React.FC<TodayFoodListProps> = ({
  foodData,
  currentUser,
}) => {
  const [exerciseData, setExerciseData] = useState<ExerciseData[]>([]);
  const [dailyCalories, setDailyCalories] = useState(2000);

  const { achievement, loading, consumedCalories, burnedCalories } =
    useAchievement({
      foodData,
      exerciseData,
      dailyCalories,
    });

  const deleteTodayFood = async (food_id: string) => {
    try {
      const res = await fetch('/api/food/deleteTodayFood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ food_id, currentUser }),
      });

      if (res.ok) {
        const rec = await res.json();
        // const newFoodData = [...foodData, { calorie: }];
        // setFoodData(newFoodData);

        const newAchievement = achievement;
        console.log('푸드추가 달성률', achievement, newAchievement);

        try {
          const res = await fetch(
            `/api/achievement/get?user_id=${currentUser}&date=${
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
                user_id: currentUser,
                date: new Date().toISOString().split('T')[0],
                achievement: newAchievement,
              }),
            });
          } else {
            await fetch('/api/achievement/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: currentUser,
                date: new Date().toISOString().split('T')[0],
                achievement: newAchievement,
              }),
            });
          }
        } catch (error) {
          console.error('Failed to update or create achievement:', error);
        }

        alert(`${name} ${rec.message}`);
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('An unexpected error occurred');
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
            setDailyCalories(data.userProfile.daily_calories);
            // await fetchTodayFoodData(data.user.user_id);
            await fecthTodayExerciseData(data.user.user_id);
          } else {
            throw new Error('데이터를 불러오는 데 실패했습니다.');
          }
        }
      } catch (error) {
        console.error('API 요청 에러:', error);
      }
    };

    // const fetchTodayFoodData = async (userId: number) => {
    //   try {
    //     const res = await fetch(
    //       `/api/food/todayFood?user_id=${userId}&date=${
    //         new Date().toISOString().split("T")[0]
    //       }`,
    //       {
    //         method: "GET",
    //       }
    //     );

    //     if (res.ok) {
    //       const data = await res.json();
    //       setFoodData(data);
    //     } else {
    //       alert("오늘의 음식 데이터를 불러오는 데 실패했습니다.");
    //     }
    //   } catch (err) {
    //     alert("오늘의 음식 데이터를 불러오는 데 실패했습니다.");
    //   }
    // };

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
    <TodayFoodListBlock>
      <ul>
        {foodData.map((food) => (
          <li key={food.food_id}>
            <div className='time'>
              <p>
                {dayjs(food.added_at)
                  .format('A hh:mm')
                  .replace('AM', '오전')
                  .replace('PM', '오후')}
              </p>
            </div>
            <div className='food_img'>
              <img src={food.img} alt='foodimg' width={30} height={30} />
            </div>
            <div className='food_info'>
              <p>{food.name}</p>
              <div className='nutrient'>
                <p>탄: {food.carb}</p>
                <p>단: {food.pro}</p>
                <p>지: {food.fat}</p>
              </div>
              <p>열량: {food.calorie} kcal</p>
            </div>
            <div className='minus_btn'>
              <FontAwesomeIcon
                icon={faSquareMinus}
                onClick={() => deleteTodayFood(food.food_id)}
              />
            </div>
          </li>
        ))}
      </ul>
    </TodayFoodListBlock>
  );
};

export default TodayFoodList;
