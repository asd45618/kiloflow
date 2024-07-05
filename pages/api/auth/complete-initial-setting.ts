import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

const calculateBMR = (weight: number, height: number): number => {
  return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * 30; // 30은 평균 나이
};

const calculateDailyCalories = (
  weight: number,
  targetWeight: number,
  difficulty: string,
  bmr: number
): { dailyCalories: number; totalDays: number } => {
  const weightToLose = weight - targetWeight;
  const caloriesToLoseWeight = weightToLose * 9000;
  let daysToLoseWeight: number;

  if (difficulty === "쉬움") {
    daysToLoseWeight = weightToLose * 60; // 2달
  } else if (difficulty === "중간") {
    daysToLoseWeight = weightToLose * 30; // 1달
  } else if (difficulty === "어려움") {
    daysToLoseWeight = weightToLose * 15; // 15일
  } else {
    throw new Error("Invalid difficulty level");
  }

  const dailyCaloricDeficit = caloriesToLoseWeight / daysToLoseWeight;
  const dailyCalories = Math.round(bmr - dailyCaloricDeficit);

  return { dailyCalories, totalDays: daysToLoseWeight };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const { height, weight, targetWeight, difficulty } = req.body;

    const bmr = calculateBMR(weight, height);
    const { dailyCalories, totalDays } = calculateDailyCalories(
      weight,
      targetWeight,
      difficulty,
      bmr
    );

    await prisma.userProfile.create({
      data: {
        user_id: decoded.userId,
        height,
        weight,
        target_weight: targetWeight,
        difficulty,
        daily_calories: dailyCalories,
      },
    });

    await prisma.users.update({
      where: { user_id: decoded.userId },
      data: { isInitialSetupComplete: true },
    });

    return res
      .status(200)
      .json({ message: "Initial setup complete", dailyCalories, totalDays });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
