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
    const { id } = req.body;

    const recommendationData = await prisma.recommend.findMany({
      where: {
        food_id: id,
      },
    });

    return res.status(200).json({ data: recommendationData });
  } catch (error: any) {
    console.log('서버에러', error);
    return res
      .status(500)
      .json({ error: '서버에서 오류가 발생했습니다.', details: error.message });
  }
}
