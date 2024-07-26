import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { user_id, month } = req.query;

    const startOfMonth = new Date(`${month}-01`);
    const endOfMonth = new Date(
      startOfMonth.getFullYear(),
      startOfMonth.getMonth() + 1,
      0
    );

    try {
      const achievements = await prisma.achievement.findMany({
        where: {
          user_id: Number(user_id),
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      });

      res.status(200).json(achievements);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get achievements" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
