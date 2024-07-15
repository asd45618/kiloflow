// pages/api/community/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import upload from "../../../lib/multer";

// NextApiRequest를 확장하여 file 속성을 추가한 인터페이스 정의
interface ExtendedRequest extends NextApiRequest {
  file: Express.Multer.File;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// Multer 미들웨어를 비동기로 처리하는 함수
const runMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(
  req: ExtendedRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // 채팅방 목록 가져오기
    const { search, type } = req.query;
    const searchType = type === "태그" ? "tags" : "name";

    const chatrooms = await prisma.chatrooms.findMany({
      where: {
        [searchType]: { contains: search as string },
      },
    });
    // 해시태그 앞에 '#' 붙이기
    const updatedChatrooms = chatrooms.map((chatroom) => ({
      ...chatroom,
      tags: chatroom.tags
        .split(" ")
        .map((tag) => `#${tag}`)
        .join(" "),
    }));

    res.status(200).json(updatedChatrooms);
  } else if (req.method === "POST") {
    try {
      // Multer 미들웨어 실행
      await runMiddleware(req, res, upload.single("image"));

      const { name, tags, max_members } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const chatroom = await prisma.chatrooms.create({
        data: {
          name,
          tags,
          image_url: imageUrl,
          max_members: Number(max_members),
        },
      });
      res.status(201).json(chatroom);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
