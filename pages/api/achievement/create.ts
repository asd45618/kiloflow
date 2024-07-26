// pages/api/achievement/create.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { user_id, date, achievement } = req.body;

    console.log(user_id, date, achievement);

    try {
      const newAchievement = await prisma.achievement.create({
        data: {
          user_id,
          date: new Date(date),
          achievement,
        },
      });

      res.status(200).json(newAchievement);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create achievement" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
