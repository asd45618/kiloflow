import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const ExerciseListWrapper = styled.div`
  h1 {
    text-align: center;
    font-size: 32px;
    font-weight: bold;
  }
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
  .exercise__info {
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    align-items: center;
    background-color: #fff;
    padding: 5px 0;
    margin-bottom: 15px;
    border-radius: 5px;
    div {
      &:nth-child(1) {
        flex: 0 0 40%;
        border-right: 1px solid black;
      }
      &:nth-child(2) {
        flex: 0 0 40%;
        border-right: 1px solid black;
      }
      &:nth-child(3) {
        flex: 0 0 20%;
      }
    }
    .detail__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      svg {
        cursor: pointer;
      }
    }
  }
`;

export default function exerciseList() {
  return (
    <ExerciseListWrapper>
      <h1>운동</h1>
      <div className='search'>
        <input type='text' />
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </div>
      <div className='exercise__info'>
        <div>바벨 스쿼트</div>
        <div>6MET</div>
        <div className='detail__btn'>
          <FontAwesomeIcon icon={faSquarePlus} />
        </div>
      </div>
      <div className='exercise__info'>
        <div>다트</div>
        <div>2.5MET</div>
        <div className='detail__btn'>
          <FontAwesomeIcon icon={faSquarePlus} />
        </div>
      </div>
      <div className='exercise__info'>
        <div>바벨 스쿼트</div>
        <div>6MET</div>
        <div className='detail__btn'>
          <FontAwesomeIcon icon={faSquarePlus} />
        </div>
      </div>
      <div className='exercise__info'>
        <div>다트</div>
        <div>2.5MET</div>
        <div className='detail__btn'>
          <FontAwesomeIcon icon={faSquarePlus} />
        </div>
      </div>
      <div className='exercise__info'>
        <div>바벨 스쿼트</div>
        <div>6MET</div>
        <div className='detail__btn'>
          <FontAwesomeIcon icon={faSquarePlus} />
        </div>
      </div>
      <div className='exercise__info'>
        <div>다트</div>
        <div>2.5MET</div>
        <div className='detail__btn'>
          <FontAwesomeIcon icon={faSquarePlus} />
        </div>
      </div>
      <div className='exercise__info'>
        <div>바벨 스쿼트</div>
        <div>6MET</div>
        <div className='detail__btn'>
          <FontAwesomeIcon icon={faSquarePlus} />
        </div>
      </div>
      <div className='exercise__info'>
        <div>다트</div>
        <div>2.5MET</div>
        <div className='detail__btn'>
          <FontAwesomeIcon icon={faSquarePlus} />
        </div>
      </div>
    </ExerciseListWrapper>
  );
}
