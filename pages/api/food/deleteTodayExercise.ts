import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { exercise_id, currentUser } = req.body;

  if (!exercise_id || !currentUser) {
    return res.status(400).json({ message: '로그인을 해주세요' });
  }

  try {
    const user = await prisma.todayExercise.deleteMany({
      where: { exercise_id, user_id: currentUser },
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
