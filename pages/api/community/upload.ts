import { NextApiRequest, NextApiResponse } from "next";
import upload from "../../../lib/multer";
import prisma from "../../../lib/prisma";

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

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, upload.single("file"));

  const extendedReq = req as ExtendedRequest;
  const { file } = extendedReq;

  if (!file) {
    return res.status(400).json({ error: "File is required" });
  }

  const path = `/uploads/${file.filename}`;

  try {
    const savedFile = await prisma.chatImageMessage.create({
      data: {
        path: path,
      },
    });

    return res.status(200).json({ file: savedFile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error saving file" });
  }
};

const getImageHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    const image = await prisma.chatImageMessage.findUnique({
      where: { id: Number(id) },
    });

    if (image) {
      return res.status(200).json({ image });
    } else {
      return res.status(404).json({ error: "Image not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching image" });
  }
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    return uploadHandler(req, res);
  } else if (req.method === "GET") {
    return getImageHandler(req, res);
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
