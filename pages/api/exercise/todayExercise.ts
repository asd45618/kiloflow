import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

// Exercise 타입 정의
interface Exercise {
  id?: number;
  MET계수: string;
  운동명: string;
  운동설명: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { user_id, exercise_id, duration, calories } = req.body;
      await prisma.todayExercise.create({
        data: {
          user_id: Number(user_id),
          exercise_id: exercise_id,
          duration: duration,
          calories: calories,
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

      const todayExercises = await prisma.todayExercise.findMany({
        where: {
          user_id: Number(user_id),
          added_at: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      const exerciseIds = todayExercises.map(
        (exercise) => exercise.exercise_id
      );

      const response = await fetch(
        "https://api.odcloud.kr/api/15068730/v1/uddi:2dd1a2cb-6030-48a2-980d-c31f0cc18b6c?page=1&perPage=15&serviceKey=9QBTARbvzv2jtn%2Fkukph5k4O6ArctzriUp6IXMfHSUYt8fmmfoQRjDqpCrZGYhJ4wCubV30EVCm928oL18EL%2BA%3D%3D"
      );

      if (!response.ok) {
        throw new Error("외부 API에서 데이터를 불러오는 데 실패했습니다.");
      }

      const data = await response.json();
      const allApiExercises: Exercise[] = data.data;

      // 각 운동 항목에 id 부여
      allApiExercises.forEach((exercise, index) => {
        exercise.id = index + 1;
      });

      const exerciseData = exerciseIds
        .map((id) => {
          const apiExercise = allApiExercises.find(
            (exercise) => exercise.id === id
          );
          if (!apiExercise) {
            return null;
          }
          const addedExercise = todayExercises.find(
            (exercise) => exercise.exercise_id === id
          );

          return {
            exercise_id: id,
            name: apiExercise.운동명,
            MET: apiExercise.MET계수,
            duration: addedExercise?.duration,
            calories: addedExercise?.calories,
            added_at: addedExercise?.added_at,
          };
        })
        .filter(Boolean);

      return res.status(200).json(exerciseData);
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
