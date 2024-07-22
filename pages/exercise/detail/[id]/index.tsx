import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const ExerciseDetailWrapper = styled.div`
  text-align: center;
  .detail_top {
    display: flex;
    justify-content: center;
    h1 {
      font-weight: bold;
    }
    span {
      /* display: flex; */
      /* align-items: center; */
      /* justify-content: center; */
      margin-left: 10px;
      font-size: 30px;
      svg {
        cursor: pointer;
      }
    }
  }
  p {
    margin: 30px 0;
    font-size: 24px;
  }
  .calculation {
    display: flex;
    justify-content: center;
    input {
      width: 15%;
      margin-right: 5px;
      text-align: center;
      border: 1px solid #000;
      border-radius: 5px;
      outline: none;
      background-color: inherit;
      &::-webkit-inner-spin-button,
      ::-webkit-inner-spin-button {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
      }
    }
    span {
    }
  }
`;

export default function ExerciseDetail() {
  const router = useRouter();
  const { name, MET, id } = JSON.parse(router.query.data as string);
  const [min, setMin] = useState(0);
  const [userName, setUserName] = useState('');
  const [userWeight, setUserWeight] = useState(0);
  const [currentUserID, setCurrentUserID] = useState('');

  const changeMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMin(parseInt(e.target.value));
  };

  const addTodayExercise = async () => {
    try {
      const res = await fetch('/api/exercise/todayExercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUserID,
          exercise_id: id,
        }),
      });

      if (res.ok) {
        const rec = await res.json();
        alert(`${name} ${rec.message}`);
      } else {
        alert('추가에 실패했습니다.');
      }
    } catch (err) {
      alert('추가에 실패했습니다.');
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
            setUserName(data.user.nickname);
            setUserWeight(data.userProfile.weight);
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

  return (
    <ExerciseDetailWrapper>
      <div className='detail_top'>
        <h1>{name}</h1>
        <span onClick={addTodayExercise}>
          <FontAwesomeIcon icon={faSquarePlus} />
        </span>
      </div>
      <p>{userName}님 기준</p>
      <div className='calculation'>
        <input type='number' onChange={changeMin} value={min} />
        <span>
          분에 약{' '}
          {min ? Math.round((MET * 3.5 * userWeight * min) / 1000) * 5 : 0}kcal
          소모 가능합니다.
        </span>
      </div>
    </ExerciseDetailWrapper>
  );
}
