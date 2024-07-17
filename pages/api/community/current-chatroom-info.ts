// pages/api/community/current-chatroom-info.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { roomId, action } = req.query;

  if (!roomId || !action) {
    return res
      .status(400)
      .json({ message: "Missing roomId or action parameter" });
  }

  if (req.method === "GET") {
    if (action === "info") {
      // 특정 채팅방 정보 가져오기
      const chatroom = await prisma.chatrooms.findUnique({
        where: { id: Number(roomId) },
      });
      if (!chatroom) {
        return res.status(404).json({ message: "Chatroom not found" });
      }
      return res.status(200).json(chatroom);
    } else if (action === "users") {
      // 특정 채팅방의 사용자 목록 가져오기
      const users = await prisma.chatroom_members.findMany({
        where: { chatroom_id: Number(roomId) },
        include: { user: true },
      });
      const userList = users.map((member) => member.user);
      return res.status(200).json(userList);
    } else {
      return res.status(400).json({ message: "Invalid action parameter" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
