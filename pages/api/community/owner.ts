import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { roomId } = req.query;

  if (req.method === "GET") {
    const chatroom = await prisma.chatrooms.findUnique({
      where: { id: Number(roomId) },
      select: { owner_id: true },
    });
    res.status(200).json(chatroom);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
