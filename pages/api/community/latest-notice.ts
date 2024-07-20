import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { roomId } = req.query;

  if (!roomId) {
    return res.status(400).json({ error: "Missing roomId parameter" });
  }

  if (req.method === "GET") {
    try {
      const notice = await prisma.notices.findFirst({
        where: { chatroom_id: Number(roomId) },
        orderBy: { created_at: "desc" },
      });

      if (!notice) {
        return res.status(404).json({ error: "No notice found" });
      }

      res.status(200).json(notice);
    } catch (error) {
      res.status(500).json({ error: "Error fetching notice" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
