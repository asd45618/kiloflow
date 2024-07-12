import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const {
    user_id,
    height,
    weight,
    targetWeight,
    difficulty,
    dailyCalories,
    totalDays,
  } = req.body;

  try {
    const updatedProfile = await prisma.userProfile.update({
      where: { user_id: user_id },
      data: {
        height,
        weight,
        target_weight: targetWeight,
        difficulty,
        daily_calories: dailyCalories,
        updated_at: new Date(),
      },
    });

    return res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("프로필 업데이트 중 오류가 발생했습니다.", error);
    return res
      .status(500)
      .json({ message: "프로필 업데이트 중 오류가 발생했습니다." });
  }
}
