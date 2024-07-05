// pages/api/auth/complete-initial-setting.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

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
    const {
      height,
      weight,
      targetWeight,
      difficulty,
      dailyCalories,
      totalDays,
    } = req.body;

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

    return res.status(200).json({ message: "Initial setup complete" });
  } catch (error) {
    console.log("서버에러", error);
    return res.json({ error });

    // return res.status(500).json({ message: "Internal server error" });
  }
}
