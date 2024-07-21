import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { chatroom_id, user_id } = req.body;
    const chatroomMember = await prisma.chatroom_members.create({
      data: { chatroom_id: Number(chatroom_id), user_id: Number(user_id) },
    });
    res.status(201).json(chatroomMember);
  } else if (req.method === "DELETE") {
    const { chatroom_id, user_id, action } = req.body;

    // action 파라미터가 "kick"인 경우 강퇴 로직 처리
    if (action === "kick") {
      try {
        const chatroomMember = await prisma.chatroom_members.deleteMany({
          where: {
            chatroom_id: Number(chatroom_id),
            user_id: Number(user_id),
          },
        });
        res.status(200).json({ message: "User kicked successfully" });
      } catch (error) {
        res.status(500).json({ error: "Error kicking user" });
      }
    } else {
      const chatroomMember = await prisma.chatroom_members.deleteMany({
        where: {
          chatroom_id: Number(chatroom_id),
          user_id: Number(user_id),
        },
      });
      res.status(200).json(chatroomMember);
    }
  } else {
    res.setHeader("Allow", ["POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
