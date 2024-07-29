import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
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
  .register__btn {
    text-align: right;
    a {
      text-decoration: none;
      color: #000;
    }
  }
  ul {
    padding-left: 0;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      padding: 20px 0;
      border-bottom: 1px solid #b8b8b8;
      .list__wrapper {
        width: 100%;
        a {
          display: flex;
          justify-content: space-between;
          text-decoration: none;
          color: black;
          .list__img {
            flex: 0 0 25%;
            margin: auto 10px;
            img {
              width: inherit;
              height: inherit;
            }
          }
          .list__info {
            flex: 0 0 65%;
            p {
              margin-bottom: 0.5rem;
            }
            .user__regi {
              border: 1px solid #000;
              border-radius: 10px;
              padding: 1px 7px;
              margin-right: 3px;
              text-align: center;
            }
          }
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
  id: string;
  name: string;
  protein: number;
  carbohydrate: number;
  fat: number;
  calorie: number;
  img: string;
  user_id: number;
}

const FoodList: React.FC = () => {
  const [foodList, setFoodList] = useState<FoodItem[]>([]);
  const [searchList, setSearchList] = useState<FoodItem[]>([]);
  const [keyWord, setKeyWord] = useState('');
  const [currentUserID, setCurrentUserID] = useState('');

  const changeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyWord(e.target.value);
  };

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchList(foodList.filter((food) => food.name.includes(keyWord)));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/food/list');
        if (!response.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }
        const data = await response.json();
        console.log(data);
        setFoodList(data);
      } catch (error) {
        console.error('API 요청 에러:', error);
        // 에러 처리 로직 추가
      }
    };
    fetchData();
  }, []);

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
            setCurrentUserID(data.user.user_id);
          } else {
            throw new Error('데이터를 불러오는 데 실패했습니다.');
          }
        }
      } catch (error) {
        console.error('API 요청 에러:', error);
        // 에러 처리 로직 추가
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    !keyWord ? setSearchList([]) : '';
  }, [keyWord]);

  return (
    <FoodListWrapper>
      <div className='search'>
        <form onSubmit={search}>
          <input type='text' value={keyWord} onChange={changeKeyword} />
          <FontAwesomeIcon icon={faMagnifyingGlass} onClick={search} />
        </form>
      </div>
      <div className='register__btn'>
        <Link href='/food/register'>음식 등록</Link>
      </div>
      <ul>
        {!searchList.length
          ? foodList.map((food) => (
              <li key={food.id}>
                <div className='list__wrapper'>
                  <Link
                    href={{
                      pathname: `/food/detail/${food.id}`,
                      query: {
                        data: JSON.stringify(food),
                      },
                    }}
                    as={`/food/detail/${food.id}`}
                    key={food.id}
                  >
                    <div className='list__img'>
                      <img src={food.img} alt={food.name} />
                    </div>
                    <div className='list__info'>
                      {food.id.startsWith('user') ? (
                        <p className='user__regi'>유저등록</p>
                      ) : (
                        ''
                      )}
                      <p>{food.name}</p>
                      <p>
                        단: {food.protein}g 탄: {food.carbohydrate}g 지:{' '}
                        {food.fat}g
                      </p>
                      <p>열량: {food.calorie}kcal</p>
                    </div>
                  </Link>
                </div>
              </li>
            ))
          : searchList.map((food) => (
              <li key={food.id}>
                <div className='list__wrapper'>
                  <Link
                    href={{
                      pathname: `/food/detail/${food.id}`,
                      query: {
                        data: JSON.stringify(food),
                      },
                    }}
                    as={`/food/detail/${food.id}`}
                    key={food.id}
                  >
                    <div className='list__img'>
                      <img src={food.img} alt={food.name} />
                    </div>
                    <div className='list__info'>
                      {food.id.startsWith('user') ? (
                        <p className='user__regi'>유저등록</p>
                      ) : (
                        ''
                      )}
                      <p>{food.name}</p>
                      <p>
                        단: {food.protein}g 탄: {food.carbohydrate}g 지:{' '}
                        {food.fat}g
                      </p>
                      <p>열량: {food.calorie}kcal</p>
                    </div>
                  </Link>
                </div>
              </li>
            ))}
      </ul>
    </FoodListWrapper>
  );
};

export default FoodList;
