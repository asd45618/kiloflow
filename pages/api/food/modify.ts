import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import upload from '@/lib/multer';

interface ExtendedRequest extends NextApiRequest {
  file: Express.Multer.File;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// Multer 미들웨어를 비동기로 처리하는 함수
const runMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(
  req: ExtendedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    await runMiddleware(req, res, upload.single('img'));

    const { food_id, menu, pro, carb, fat, calorie, img, food_seq, user_id } =
      req.body;

    console.log(req.file);

    const profileImageUrl = req.file ? `/uploads/${req.file.filename}` : img;

    const updatedUserFood = await prisma.userFoodList.update({
      where: { food_id: food_id },
      data: {
        food_id: food_id,
        menu,
        pro: Number(pro),
        carb: Number(carb),
        fat: Number(fat),
        calorie: Number(calorie),
        img: profileImageUrl,
        food_seq: profileImageUrl,
        user_id: Number(user_id),
      },
    });

    return res.status(200).json(updatedUserFood);
  } catch (error) {
    console.error('프로필 업데이트 중 오류가 발생했습니다.', error);
    return res
      .status(500)
      .json({ message: '프로필 업데이트 중 오류가 발생했습니다.' });
  }
}
