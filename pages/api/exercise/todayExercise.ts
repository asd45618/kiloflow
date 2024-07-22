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
    const { user_id, exercise_id } = req.body;
    await prisma.todayExercise.create({
      data: {
        user_id: Number(user_id),
        exercise_id: exercise_id,
      },
    });

    return res.status(200).json({ message: '추가가 완료되었습니다.' });
  } catch (error: any) {
    console.log('서버에러', error);
    return res
      .status(500)
      .json({ error: '서버에서 오류가 발생했습니다.', details: error.message });
  }
}
