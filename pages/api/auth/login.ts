import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "이메일과 비밀번호를 입력해주세요." });
  }

  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ message: "잘못된 이메일 또는 비밀번호입니다." });
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    return res
      .status(200)
      .json({ token, isInitialSetupComplete: user.isInitialSetupComplete });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
