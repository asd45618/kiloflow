import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import upload from '../../../lib/multer';

// NextApiRequest를 확장하여 file 속성을 추가한 인터페이스 정의
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
    // Multer 미들웨어 실행
    await runMiddleware(req, res, upload.single('img'));

    const { menu, img, pro, carb, fat, calorie, user_id } = req.body;

    if (!menu || !pro || !carb || !fat || !calorie || !user_id) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const profileImageUrl = req.file ? `/uploads/${req.file.filename}` : img;

    const newUser = await prisma.userFoodList.create({
      data: {
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

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
