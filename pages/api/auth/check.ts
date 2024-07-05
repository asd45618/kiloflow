import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, nickname } = req.query;

  // if (!email) {
  //   return res.status(400).json({ message: "이메일을 입력해주세요." });
  // }
  // if (!nickname) {
  //   return res.status(400).json({ message: "닉네임을 입력해주세요." });
  // }

  try {
    if (email) {
      const userByEmail = await prisma.users.findUnique({
        where: { email: email as string },
      });

      if (userByEmail) {
        return res
          .status(200)
          .json({ message: "이미 존재하는 이메일입니다.", available: false });
      } else {
        return res
          .status(200)
          .json({ message: "사용가능한 이메일입니다.", available: true });
      }
    }

    if (nickname) {
      const userByNickname = await prisma.users.findFirst({
        where: { nickname: nickname as string },
      });

      if (userByNickname) {
        return res
          .status(200)
          .json({ message: "이미 존재하는 닉네임입니다.", available: false });
      } else {
        return res
          .status(200)
          .json({ message: "사용가능한 닉네임입니다.", available: true });
      }
    }
  } catch (error) {
    console.error("Error checking email or nickname:", error);
    // return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
