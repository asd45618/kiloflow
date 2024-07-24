import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  try {
    const response = await fetch(
      "http://openapi.foodsafetykorea.go.kr/api/094a84826ed54a49818a/COOKRCP01/json/1/20"
    );
    if (!response.ok) {
      throw new Error("데이터를 불러오는 데 실패했습니다.");
    }
    const data = await response.json();

    const apiData = data.COOKRCP01.row.map((api: any) => ({
      id: `RCP_${api.RCP_SEQ}`,
      name: api.RCP_NM,
      protein: api.INFO_PRO,
      carbohydrate: api.INFO_CAR,
      fat: api.INFO_FAT,
      calorie: api.INFO_ENG,
      img: api.ATT_FILE_NO_MAIN,
    }));

    const foodList = await prisma.userFoodList.findMany();
    const formattedFoodList = foodList.map((food) => ({
      id: food.food_id,
      name: food.menu,
      protein: food.pro,
      carbohydrate: food.carb,
      fat: food.fat,
      calorie: food.calorie,
      img: food.img,
      user_id: food.user_id,
    }));

    const allFoodList = [...apiData, ...formattedFoodList];

    return res.status(200).json(allFoodList);
  } catch (error) {
    console.error("데이터베이스에서 음식 목록을 가져오는 중 에러:", error);
    return res.status(500).json({ message: "내부 서버 오류" });
  }
}
