import styled from 'styled-components';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareMinus } from '@fortawesome/free-regular-svg-icons';

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

const TodayFoodList: React.FC<TodayFoodListProps> = ({
  foodData,
  currentUser,
}) => {
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
    <TodayFoodListBlock>
      {/* <h3>오늘 먹은 음식</h3> */}
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
