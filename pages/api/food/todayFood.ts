import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { user_id, food_id } = req.body;
      await prisma.todayFood.create({
        data: {
          food_id: food_id,
          user_id: Number(user_id),
        },
      });

      return res.status(200).json({ message: "추가가 완료되었습니다." });
    } catch (error: any) {
      console.log("서버에러", error);
      return res.status(500).json({
        error: "서버에서 오류가 발생했습니다.",
        details: error.message,
      });
    }
  } else if (req.method === "GET") {
    try {
      const { user_id, date } = req.query;
      const selectedDate = new Date(date as string);
      const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

      const todayFoods = await prisma.todayFood.findMany({
        where: {
          user_id: Number(user_id),
          added_at: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      const userFoods = await prisma.userFoodList.findMany({
        where: {
          food_id: {
            in: todayFoods
              .filter((food) => food.food_id.startsWith("user_"))
              .map((food) => food.food_id),
          },
        },
      });

      const externalFoods = todayFoods.filter((food) =>
        food.food_id.startsWith("RCP_")
      );

      const rcpSeqs = externalFoods.map((food) => food.food_id.split("_")[1]);

      const response = await fetch(
        `http://openapi.foodsafetykorea.go.kr/api/094a84826ed54a49818a/COOKRCP01/json/1/20`
      );

      if (!response.ok) {
        throw new Error("외부 API에서 데이터를 불러오는 데 실패했습니다.");
      }

      const data = await response.json();
      const allApiFoods = data.COOKRCP01.row;

      const externalFoodData = rcpSeqs
        .map((seq) => {
          const apiFood = allApiFoods.find((food: any) => food.RCP_SEQ === seq);
          if (!apiFood) {
            return null;
          }
          const addedFood = externalFoods.find(
            (food) => food.food_id === `RCP_${seq}`
          );
          return {
            food_id: `RCP_${apiFood.RCP_SEQ}`,
            name: apiFood.RCP_NM,
            calorie: apiFood.INFO_ENG,
            carb: apiFood.INFO_CAR,
            pro: apiFood.INFO_PRO,
            fat: apiFood.INFO_FAT,
            img: apiFood.ATT_FILE_NO_MAIN,
            added_at: addedFood?.added_at,
          };
        })
        .filter(Boolean);

      const allFoodData = [
        ...userFoods.map((food) => ({
          food_id: food.food_id,
          name: food.menu,
          calorie: food.calorie,
          carb: food.carb,
          pro: food.pro,
          fat: food.fat,
          img: food.img,
          added_at: todayFoods.find(
            (todayFood) => todayFood.food_id === food.food_id
          )?.added_at,
        })),
        ...externalFoodData,
      ];

      console.log("외부", externalFoodData);
      console.log("all", allFoodData);
      return res.status(200).json(allFoodData);
    } catch (error: any) {
      console.error("서버 에러:", error);
      return res.status(500).json({
        error: "서버에서 오류가 발생했습니다.",
        details: error.message,
      });
    }
  } else {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
