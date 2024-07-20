import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { thumb, currentUserId, id } = req.body;

    const existingRecommendation = await prisma.recommend.findFirst({
      where: {
        user_id: currentUserId,
        food_id: id,
      },
    });

    if (existingRecommendation) {
      // 기존 추천 기록의 recommend 값과 thumb 값이 같은지 확인
      if (existingRecommendation.recommend === thumb) {
        // 값이 같으면 해당 데이터를 삭제
        await prisma.recommend.delete({
          where: {
            id: existingRecommendation.id,
            user_id: currentUserId,
          },
        });
        return res.status(200).json({ message: '중복된 데이터 삭제' });
      } else {
        // 값이 다르면 recommend 값을 thumb으로 업데이트
        await prisma.recommend.update({
          where: {
            id: existingRecommendation.id,
            user_id: currentUserId,
          },
          data: {
            recommend: thumb,
          },
        });
        return res.status(200).json({ message: thumb });
      }
    }

    // 추천 기록이 존재하지 않는 경우 새로운 레코드를 생성
    await prisma.recommend.create({
      data: {
        user_id: currentUserId,
        food_id: id,
        recommend: thumb,
      },
    });

    return res.status(200).json({ message: thumb });
  } catch (error: any) {
    console.log('서버에러', error);
    return res
      .status(500)
      .json({ error: '서버에서 오류가 발생했습니다.', details: error.message });
  }
}
