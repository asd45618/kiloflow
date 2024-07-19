// pages/api/community/delete.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { roomId } = req.query;

  if (req.method === "DELETE") {
    try {
      await prisma.$transaction([
        prisma.chatroom_members.deleteMany({
          where: { chatroom_id: Number(roomId) },
        }),
        prisma.chatMessages.deleteMany({
          where: { chatroom_id: Number(roomId) },
        }),
        prisma.chatrooms.delete({
          where: { id: Number(roomId) },
        }),
      ]);
      res.status(204).end();
    } catch (error) {
      console.error("채팅방 삭제 에러", error);
      res
        .status(500)
        .json({ error: "채팅방 삭제 중에 에러가 발생했습니다람쥐" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
