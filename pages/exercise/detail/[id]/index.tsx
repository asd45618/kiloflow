import prisma from '@/lib/prisma';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const ExerciseDetailWrapper = styled.div`
  text-align: center;
  h1 {
  }
`;

// interface exerciseData {
//   id: number,
//   name:
// }

interface props {
  userProfile: {
    id: number;
    user_id: number;
    height: number;
    weight: number;
    target_weight: number;
    difficulty: string;
    daily_calories: number;
  };
}

export default function ExerciseDetail(userProfile: props) {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('API 요청 에러:', error);
        // 에러 처리 로직 추가
      }
    };

    fetchData();
  }, []);

  const [min, setMin] = useState(0);

  const router = useRouter();
  console.log(router.query.data);
  const { id, name, MET } = JSON.parse(router.query.data as any);

  const changeMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMin(parseInt(e.target.value));
  };

  return (
    <ExerciseDetailWrapper>
      <h1>{name}</h1>
      <p>{id}</p>
      <div>
        <input type='number' onChange={changeMin} value={min} />
        <span>분에 약 {MET * 3.5 * userProfile.weight}</span>
      </div>
    </ExerciseDetailWrapper>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const userProfile = await prisma.userProfile.findMany({
    select: {
      id: true,
      user_id: true,
      height: true,
      weight: true,
      target_weight: true,
      difficulty: true,
      daily_calories: true,
      created_at: false,
      updated_at: false,
    },
  });

  return {
    props: {
      userProfile,
    },
  };
};
