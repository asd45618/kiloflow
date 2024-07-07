import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const FoodListWrapper = styled.div`
  .search {
    text-align: center;
    margin: 20px 0;
    input {
      border-bottom: 1px solid #000;
      outline: none;
      background-color: inherit;
    }
    svg {
      cursor: pointer;
    }
  }
  ul {
    padding-left: 0;
    li {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      padding: 20px 0;
      border-bottom: 1px solid #b8b8b8;
      .list__img {
        flex: 0 0 30%;
        width: 90px;
        height: 90px;
        img {
          width: inherit;
          height: inherit;
        }
      }
      .list__info {
        flex: 0 0 60%;
        .user__regi {
          border: 1px solid #000;
          border-radius: 10px;
          padding: 1px 7px;
          margin-right: 3px;
        }
      }
      .detail__btn {
        display: flex;
        align-items: center;
        font-size: 30px;
        svg {
          cursor: pointer;
        }
      }
    }
  }
`;

interface FoodItem {
  id: number;
  name: string;
  protein: number;
  carbohydrate: number;
  fat: number;
  calorie: number;
  img: string;
}

const FoodList: React.FC = () => {
  const [foodList, setFoodList] = useState<FoodItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/food/food');
        if (!response.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }
        const data = await response.json();
        setFoodList(data);
      } catch (error) {
        console.error('API 요청 에러:', error);
        // 에러 처리 로직 추가
      }
    };

    fetchData();
  }, []);

  return (
    <FoodListWrapper>
      <div className='search'>
        <input type='text' />
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </div>
      <ul>
        {foodList.map((food) => (
          <li key={food.id}>
            <div className='list__img'>
              <img src={food.img} alt={food.name} />
            </div>
            <div className='list__info'>
              <p>{food.name}</p>
              <p>
                단: {food.protein}g 탄: {food.carbohydrate}g 지: {food.fat}g
              </p>
              <p>열량: {food.calorie}kcal</p>
            </div>
            <div className='detail__btn'>
              <FontAwesomeIcon icon={faSquarePlus} />
            </div>
          </li>
        ))}
      </ul>
    </FoodListWrapper>
  );
};

export default FoodList;
