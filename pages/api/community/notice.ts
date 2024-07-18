import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title, content, chatroom_id } = req.body;

    try {
      const notice = await prisma.notices.create({
        data: {
          title,
          content,
          chatroom_id: Number(chatroom_id),
        },
      });
      res.status(201).json(notice);
    } catch (error) {
      res.status(500).json({ error: "공지사항 작성 실패" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
