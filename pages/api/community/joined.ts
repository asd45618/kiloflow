// pages/api/community/joined.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { currentUser } = req.query;

  if (req.method === "GET") {
    const chatrooms = await prisma.chatroom_members.findMany({
      where: { user_id: Number(currentUser) },
      select: { chatroom_id: true },
    });
    res.status(200).json(chatrooms);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
