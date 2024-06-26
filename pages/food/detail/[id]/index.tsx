import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./foodDetail.module.css";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import styled from "styled-components";

const FoodDetailWrapper = styled.div`
  text-align: center;
  h1 {
    margin: 25px 0;
    font-size: 30px;
    font-weight: bold;
  }
  .detail__img {
    display: flex;
    justify-content: center;
    height: 200px;
    margin-bottom: 25px;
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

export default function foodDetail() {
  return (
    <FoodDetailWrapper className='detail__wrapper'>
      <h1>만두</h1>
      <div className='detail__img'>
        <img src='../../foodListImg.png' alt='' />
      </div>
      <div className='detail__info'>
        <p>단: 20 탄: 20 지: 20</p>
        <p>열량: 600kcal</p>
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
