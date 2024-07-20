import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { id, user_id } = req.body;

  if (!id || !user_id) {
    return res.status(400).json({ message: '로그인을 해주세요' });
  }

  try {
    const user = await prisma.userFoodList.delete({
      where: { food_id: id, user_id },
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
