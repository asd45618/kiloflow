import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/components.module.css";
import styled from "styled-components";
import Picker from "../Layout/Picker2";

const ProfileModifyBlock = styled.div`
  max-width: 345px;
  margin: 20px auto;
  padding: 20px;
  text-align: center;
`;

const FormGroup = styled.div`
  text-align: left;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Label = styled.label`
  flex: 1;
  font-size: 16px;
`;

const PickerWrapper = styled.div`
  flex: 1;
`;

const Select = styled.select`
  flex: 1;
  padding: 8px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-left: 10px;
`;

const Result = styled.div`
  margin: 30px 0;
  font-size: 16px;
  text-align: center;
`;

const calculateBMR = (weight: number, height: number): number => {
  return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * 30; // 30은 평균 나이
};

const calculateDailyCalories = (
  weight: number,
  targetWeight: number,
  difficulty: string,
  bmr: number
): { dailyCalories: number; totalDays: number } => {
  const weightToLose = weight - targetWeight;
  const caloriesToLoseWeight = weightToLose * 9000;
  let daysToLoseWeight: number = 0; // 초기 값을 0으로 설정

  if (difficulty === "쉬움") {
    daysToLoseWeight = weightToLose * 60; // 2달
  } else if (difficulty === "중간") {
    daysToLoseWeight = weightToLose * 30; // 1달
  } else if (difficulty === "어려움") {
    daysToLoseWeight = weightToLose * 15; // 15일
  }

  if (daysToLoseWeight === 0) {
    return { dailyCalories: bmr, totalDays: 0 }; // 감량할 필요가 없음
  }

  const dailyCaloricDeficit = caloriesToLoseWeight / daysToLoseWeight;
  const dailyCalories = Math.round(bmr - dailyCaloricDeficit);

  return { dailyCalories, totalDays: daysToLoseWeight };
};

const ProfileModify = ({ currentUserProfile }: { currentUserProfile: any }) => {
  const [height, setHeight] = useState<number>(currentUserProfile.height);
  const [weight, setWeight] = useState<number>(currentUserProfile.weight);
  const [targetWeight, setTargetWeight] = useState<number>(
    currentUserProfile.target_weight
  );
  const [difficulty, setDifficulty] = useState<string>(
    currentUserProfile.difficulty
  );
  const [dailyCalories, setDailyCalories] = useState<number | null>(null);
  const [totalDays, setTotalDays] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (currentUserProfile) {
      console.log("currnetUserProfile", currentUserProfile);
      setHeight(currentUserProfile.height);
      setWeight(currentUserProfile.weight);
      setTargetWeight(currentUserProfile.target_weight);
      setDifficulty(currentUserProfile.difficulty);
      const bmr = calculateBMR(
        currentUserProfile.weight,
        currentUserProfile.height
      );
      const { dailyCalories, totalDays } = calculateDailyCalories(
        currentUserProfile.weight,
        currentUserProfile.target_weight,
        currentUserProfile.difficulty,
        bmr
      );
      setDailyCalories(dailyCalories);
      setTotalDays(totalDays);
    }
  }, [currentUserProfile]);

  useEffect(() => {
    if (currentUserProfile) {
      const bmr = calculateBMR(weight, height);
      const { dailyCalories, totalDays } = calculateDailyCalories(
        weight,
        targetWeight,
        difficulty,
        bmr
      );
      setDailyCalories(dailyCalories);
      setTotalDays(totalDays);
    }
  }, [height, weight, targetWeight, difficulty]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/modify/profile-modify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: currentUserProfile.user_id,
          height,
          weight,
          targetWeight,
          difficulty,
          dailyCalories,
          totalDays,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        window.alert("목표 수정이 완료되었습니다.");
        router.push("/personal?activeTab=profileModify");
      } else {
        const data = await res.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error("프로필 업데이트 중 오류가 발생했습니다.", error);
    }
  };

  if (!currentUserProfile) return <div>Loading...</div>;

  return (
    <ProfileModifyBlock>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>키</Label>
          <PickerWrapper>
            <Picker
              label="cm"
              min={100}
              max={250}
              value={height}
              onChange={setHeight}
            />
          </PickerWrapper>
        </FormGroup>
        <FormGroup>
          <Label>현재 체중</Label>
          <PickerWrapper>
            <Picker
              label="kg"
              min={30}
              max={200}
              value={weight}
              onChange={setWeight}
            />
          </PickerWrapper>
        </FormGroup>
        <FormGroup>
          <Label>목표 체중</Label>
          <PickerWrapper>
            <Picker
              label="kg"
              min={30}
              max={200}
              value={targetWeight}
              onChange={setTargetWeight}
            />
          </PickerWrapper>
        </FormGroup>
        <FormGroup>
          <Label>감량 난이도</Label>
          <Select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="쉬움">쉬움</option>
            <option value="중간">중간</option>
            <option value="어려움">어려움</option>
          </Select>
        </FormGroup>
        <Result>
          <p>하루 권장 섭취 칼로리: {dailyCalories} kcal</p>
          <p>총 감량 기간: {totalDays}일</p>
        </Result>
        <button type="submit" className={styles.button__small}>
          수정
        </button>
      </form>
    </ProfileModifyBlock>
  );
};

export default ProfileModify;
