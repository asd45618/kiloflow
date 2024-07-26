// pages/api/achievement/update.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { user_id, date, achievement } = req.body;

    const startOfDay = new Date(date as string);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date as string);
    endOfDay.setUTCHours(23, 59, 59, 999);

    try {
      const updatedAchievement = await prisma.achievement.updateMany({
        where: {
          user_id,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        data: {
          achievement,
        },
      });

      if (updatedAchievement.count === 0) {
        return res.status(404).json({ error: "Achievement not found" });
      }

      res.status(200).json(updatedAchievement);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update achievement" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
