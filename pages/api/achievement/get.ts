import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { user_id, date } = req.query;

    const startOfDay = new Date(date as string);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date as string);
    endOfDay.setUTCHours(23, 59, 59, 999);

    try {
      const achievement = await prisma.achievement.findFirst({
        where: {
          user_id: Number(user_id),
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      if (!achievement) {
        return res.status(404).json({ error: "Achievement not found" });
      }

      res.status(200).json(achievement);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get achievement" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
