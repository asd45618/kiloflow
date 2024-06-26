import styled from "styled-components";

const FoodRegisterWrapper = styled.div`
  max-width: 350px;
  margin: 0 auto;
  p {
    margin-bottom: 3px;
  }
  input {
    border: 1px solid #8b8b8b;
    border-radius: 5px;
  }
  .register__title {
    margin: 30px 0;
    input {
      width: 100%;
    }
  }
  .register__img {
    margin-bottom: 20px;
    span {
      margin-right: 15px;
    }
    input {
      border: none;
    }
  }
  .register__info {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
    div {
      &:nth-child(1) {
        flex: 0 0 33%;
        margin-bottom: 15px;
      }
      &:nth-child(2) {
        flex: 0 0 33%;
      }
      &:nth-child(3) {
        flex: 0 0 33%;
      }
      &:nth-child(4) {
        flex: 0 0 33%;
      }
    }
    input {
      width: 80px;
    }
  }
  .register__btn {
    display: flex;
    justify-content: center;
    button {
      border: 1px solid #000;
      padding: 1px 20px;
      margin-top: 20px;
      border-radius: 5px;
      &:first-child {
        border-color: red;
        margin-right: 20px;
      }
      &:last-child {
        border-color: green;
      }
    }
  }
`;

export default function foodRegister() {
  return (
    <FoodRegisterWrapper>
      <div className='register__title'>
        <p>음식 이름</p>
        <input type='text' />
      </div>
      <div className='register__img'>
        <span>사진</span>
        <input type='file' />
      </div>
      <div className='register__info'>
        <div>
          <p>단백질</p>
          <input type='number' />
          <span> g</span>
        </div>
        <div>
          <p>탄수화물</p>
          <input type='number' />
          <span> g</span>
        </div>
        <div>
          <p>지방</p>
          <input type='number' />
          <span> g</span>
        </div>
        <div>
          <p>열량</p>
          <input type='number' />
          <span> kcal</span>
        </div>
      </div>
      <div className='register__btn'>
        <button>취소</button>
        <button>등록</button>
      </div>
    </FoodRegisterWrapper>
  );
}
