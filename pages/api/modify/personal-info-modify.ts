import type { NextApiRequest, NextApiResponse } from "next";
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
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Multer 미들웨어 실행
    await runMiddleware(req, res, upload.single("profile_image"));

    const { email, nickname, currentPassword, newPassword, profile_image_url } =
      req.body;

    if (!email || !nickname) {
      return res
        .status(400)
        .json({ message: "Email and nickname are required" });
    }

    // 유저 정보 가져오기
    const user = await prisma.users.findUnique({
      where: {
        email: email, // 인증된 사용자 정보를 사용하여 이메일로 유저를 찾음
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 비밀번호 변경 로직
    if (currentPassword && newPassword) {
      if (currentPassword !== user.password) {
        return res
          .status(400)
          .json({ message: "현재 비밀번호가 일치하지 않습니다." });
      }
      user.password = newPassword;
    }

    // 프로필 이미지 경로 설정
    const profileImageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : profile_image_url || user.profile_image;

    // 유저 정보 업데이트
    const updatedUser = await prisma.users.update({
      where: { email: user.email },
      data: {
        nickname,
        profile_image: profileImageUrl,
        password: user.password,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "개인정보 수정이 실패했습니다." });
  }
}
