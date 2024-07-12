import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './foodDetail.module.css';
import {
  faSquarePlus,
  faThumbsDown,
  faThumbsUp,
} from '@fortawesome/free-regular-svg-icons';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import ProgressBar from 'react-bootstrap/ProgressBar';

const FoodDetailWrapper = styled.div`
  text-align: center;
  .detail__top {
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      width: 50%;
      border: 1px solid #000;
      border-radius: 10px;
      padding: 1px 7px;
      margin-right: 3px;
      font-size: 18px;
      margin: 15px;
    }
    h1 {
      font-size: 30px;
      font-weight: bold;
      margin-bottom: 25px;
    }
  }
  .detail__img {
    display: flex;
    justify-content: center;
    height: 200px;
    margin-bottom: 25px;
  }
  .thumb {
    display: flex;
    justify-content: space-between;
  }
  .progress {
    --bs-progress-bg: red;
    --bs-progress-height: 0.5rem;
  }
  .detail__info {
    p {
      font-size: 18px;
      font-weight: bold;
      margin: 30px 0;
    }
  }
  .detail__plus {
    svg {
      font-size: 30px;
      cursor: pointer;
    }
  }
  .detail__btn {
    button {
      border: 1px solid #000;
      padding: 1px 20px;
      margin-top: 20px;
      border-radius: 5px;
      &:first-child {
        border-color: green;
        margin-right: 20px;
      }
      &:last-child {
        border-color: red;
      }
    }
  }
`;

interface FoodData {
  id: string;
  name: string;
  protein: number;
  carbohydrate: number;
  fat: number;
  calorie: number;
  img: string;
}

export default function foodDetail() {
  const router = useRouter();
  console.log(router.query.data);
  const { id, name, protein, carbohydrate, fat, calorie, img } = JSON.parse(
    router.query.data as string
  ) as FoodData;

  return (
    <FoodDetailWrapper className='detail__wrapper'>
      <div className='detail__top'>
        {typeof id === 'number' ? <p>유저등록</p> : ''}
        <h1>{name}</h1>
      </div>
      <div className='detail__img'>
        <img src={`${img}`} alt={name} />
      </div>
      <div className='thumb'>
        <FontAwesomeIcon icon={faThumbsUp} />
        <FontAwesomeIcon icon={faThumbsDown} />
      </div>
      <ProgressBar now={(5 / (5 + 2)) * 100} />
      {(5 / (5 + 2)) * 100}%
      <div className='detail__info'>
        <p>
          단: {protein} 탄: {carbohydrate} 지: {fat}
        </p>
        <p>열량: {calorie}kcal</p>
        <p>그 외 정보들</p>
      </div>
      <div className='detail__plus'>
        <FontAwesomeIcon icon={faSquarePlus} />
      </div>
      <div className='detail__btn'>
        <button>수정</button>
        <button>삭제</button>
      </div>
    </FoodDetailWrapper>
  );
}
