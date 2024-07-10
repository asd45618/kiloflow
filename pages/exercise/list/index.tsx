import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const ExerciseListWrapper = styled.div`
  /* h1 {
    text-align: center;
    font-size: 32px;
    font-weight: bold;
  } */
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
        flex: 0 0 50%;
        border-right: 1px solid black;
      }
      &:nth-child(2) {
        flex: 0 0 30%;
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

interface ExerciseItem {
  name: string;
  MET: number;
}

export default function exerciseList() {
  const [exerciseList, setExerciseList] = useState<ExerciseItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/exercise/list');
        if (!response.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }
        const data = await response.json();
        setExerciseList(data);
      } catch (error) {
        console.error('API 요청 에러:', error);
        // 에러 처리 로직 추가
      }
    };

    fetchData();
  }, []);

  return (
    <ExerciseListWrapper>
      {/* <h1>운동</h1> */}
      <div className='search'>
        <input type='text' />
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </div>
      {exerciseList.map((exercise) => (
        <div className='exercise__info' key={exercise.name}>
          <div>{exercise.name}</div>
          <div>{exercise.MET}MET</div>
          <div className='detail__btn'>
            <FontAwesomeIcon icon={faSquarePlus} />
          </div>
        </div>
      ))}
    </ExerciseListWrapper>
  );
}
