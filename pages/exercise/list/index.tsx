import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
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
    a {
      flex: 0 0 50%;
      border-right: 1px solid black;
      text-decoration: none;
      color: black;
    }
    div {
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
  id: number;
  name: string;
  MET: number;
}

export default function ExerciseList() {
  const [exerciseList, setExerciseList] = useState<ExerciseItem[]>([]);
  const [searchList, setSearchList] = useState<ExerciseItem[]>([]);
  const [keyWord, setKeyWord] = useState('');

  const changeKeyWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyWord(e.target.value);
  };

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchList(exerciseList.filter((item) => item.name.includes(keyWord)));
  };

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
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    !keyWord ? setSearchList([]) : '';
  }, [keyWord]);

  return (
    <ExerciseListWrapper>
      <div className='search'>
        <form onSubmit={search}>
          <input type='text' value={keyWord} onChange={changeKeyWord} />
          <FontAwesomeIcon icon={faMagnifyingGlass} onClick={search} />
        </form>
      </div>
      {!searchList.length
        ? exerciseList.map((exercise: any) => (
            <div className='exercise__info' key={exercise.id}>
              <Link
                href={{
                  pathname: `/exercise/detail/${exercise.id}`,
                  query: {
                    data: JSON.stringify(exercise),
                  },
                }}
                as={`/exercise/detail/${exercise.id}`}
              >
                {exercise.name}
              </Link>
              <div>{exercise.MET}MET</div>
              <div className='detail__btn'>
                <FontAwesomeIcon icon={faSquarePlus} />
              </div>
            </div>
          ))
        : searchList.map((exercise: any) => (
            <div className='exercise__info' key={exercise.id}>
              <Link
                href={{
                  pathname: `/exercise/detail/${exercise.id}`,
                  query: {
                    data: JSON.stringify(exercise),
                  },
                }}
                as={`/exercise/detail/${exercise.id}`}
              >
                {exercise.name}
              </Link>
              <div>{exercise.MET}MET</div>
              <div className='detail__btn'>
                <FontAwesomeIcon icon={faSquarePlus} />
              </div>
            </div>
          ))}
    </ExerciseListWrapper>
  );
}
