import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  try {
    const foodList = await prisma.foodList.findMany();
    const formattedFoodList = foodList.map((food) => ({
      id: food.id,
      name: food.menu,
      protein: food.pro,
      carbohydrate: food.carb,
      fat: food.fat,
      calorie: food.calorie,
      img: food.img,
    }));

    return res.status(200).json(formattedFoodList);
  } catch (error) {
    console.error('데이터베이스에서 음식 목록을 가져오는 중 에러:', error);
    return res.status(500).json({ message: '내부 서버 오류' });
  }
}
