// pages/api/community/members/[chatroomId].ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { chatroomId } = req.query;

  if (req.method === "GET") {
    const count = await prisma.chatroom_members.count({
      where: { chatroom_id: Number(chatroomId) },
    });
    console.log("count", count);
    res.status(200).json({ count });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
