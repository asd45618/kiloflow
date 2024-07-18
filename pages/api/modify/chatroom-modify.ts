//pages>api>modify>chatroom-modify.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import upload from "../../../lib/multer";

interface ExtendedRequest extends NextApiRequest {
  file: Express.Multer.File;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

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
  if (req.method === "POST") {
    try {
      await runMiddleware(req, res, upload.single("image"));

      const { roomId } = req.query;
      const { name, tags, max_members, image } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : image;

      const updatedData: any = {
        name,
        tags,
        max_members: Number(max_members),
      };

      if (imageUrl) {
        updatedData.image_url = imageUrl;
      }

      const updatedChatroom = await prisma.chatrooms.update({
        where: { id: Number(roomId) },
        data: updatedData,
      });

      res.status(200).json(updatedChatroom);
    } catch (error) {
      console.error("Error updating chatroom:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
