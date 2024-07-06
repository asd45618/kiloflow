import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "../../styles/initialSetting.module.css";
import Picker from "../../components/Layout/Picker";

type Message = {
  type: "bot" | "user";
  text: string;
};

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
  let daysToLoseWeight: number;

  if (difficulty === "쉬움") {
    daysToLoseWeight = weightToLose * 60; // 2달
  } else if (difficulty === "중간") {
    daysToLoseWeight = weightToLose * 30; // 1달
  } else if (difficulty === "어려움") {
    daysToLoseWeight = weightToLose * 15; // 15일
  } else {
    throw new Error("Invalid difficulty level");
  }

  const dailyCaloricDeficit = caloriesToLoseWeight / daysToLoseWeight;
  const dailyCalories = Math.round(bmr - dailyCaloricDeficit);

  return { dailyCalories, totalDays: daysToLoseWeight };
};

export default function InitialSetting() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [height, setHeight] = useState(160);
  const [weight, setWeight] = useState(60);
  const [targetWeight, setTargetWeight] = useState(60);
  const [difficulty, setDifficulty] = useState("");
  const [dailyCalories, setDailyCalories] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [totalDays, setTotalDays] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const questions = [
    { text: "안녕! 우리 kiloflow는 ~~이런이런 어플이야", delay: 1500 },
    { text: "그럼 너의 키를 알려줄래?", delay: 1500 },
    { text: "몸무게는?", delay: 1500 },
    { text: "목표 몸무게는?", delay: 1500 },
    {
      text: "감량 난이도는 어떻게 하고 싶어? (쉬움, 중간, 어려움 중에 선택)",
      delay: 1500,
    },
  ];

  useEffect(() => {
    if (step < questions.length) {
      const timer = setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "bot", text: questions[step].text },
        ]);
        if (step === 0) {
          setStep((prevStep) => prevStep + 1);
        }
      }, questions[step].delay);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const completeInitialSetting = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/complete-initial-setting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          height: height,
          weight: weight,
          targetWeight: targetWeight,
          difficulty,
          dailyCalories,
          totalDays,
        }),
      });
      if (res.ok) {
        router.push("/");
      } else {
        setError("초기 설정 완료에 실패했습니다.");
      }
    } catch (error) {
      setError("초기 설정 완료 중 오류가 발생했습니다.");
      console.error("초기 설정 완료 중 오류가 발생했습니다.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setStep(1);
    setHeight(160);
    setWeight(60);
    setTargetWeight(60);
    setDifficulty("");
    setDailyCalories(null);
    setTotalDays(null);
    setMessages([]);
  };

  const handleNextStep = (userInput: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", text: userInput },
    ]);

    if (step === 1) setHeight(parseInt(userInput));
    if (step === 2) setWeight(parseInt(userInput));
    if (step === 3) setTargetWeight(parseInt(userInput));
    if (step === 4) {
      setDifficulty(userInput);
      const bmr = calculateBMR(weight, height);
      const { dailyCalories, totalDays } = calculateDailyCalories(
        weight,
        targetWeight,
        userInput,
        bmr
      );
      setDailyCalories(dailyCalories);
      setTotalDays(totalDays);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "bot",
          text: `너의 하루 권장 섭취 칼로리는 ${dailyCalories} kcal이야!`,
        },
        { type: "bot", text: `총 감량 기간은 ${totalDays}일이야!` },
        { type: "bot", text: "그럼 초기 설정을 끝낼까?" },
      ]);
    } else {
      setStep((prevStep) => prevStep + 1);
    }
    setInputValue("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSend = () => {
    if (inputValue.trim() === "") return;
    handleNextStep(inputValue.trim());
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const renderOptions = (options: string[]) => {
    return (
      <div className={styles.optionsContainer}>
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleNextStep(option)}
            className={styles.optionButton}
          >
            {option}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatContainer}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.type === "bot" ? styles.botMessage : styles.userMessage
            }
          >
            {message.text}
          </div>
        ))}
      </div>
      {step === 5 && dailyCalories === null && (
        <div>
          <button
            className={styles.button}
            onClick={completeInitialSetting}
            disabled={loading}
          >
            {loading ? "완료 중..." : "초기 설정 완료"}
          </button>
        </div>
      )}
      {dailyCalories !== null && (
        <div>
          <button className={styles.button} onClick={completeInitialSetting}>
            응!
          </button>
          <button className={styles.button} onClick={handleRestart}>
            다시 입력할래!
          </button>
        </div>
      )}
      {showWarning && (
        <div>
          <p>
            초기 설정을 완료하지 않으면 이 앱의 기능을 이용할 수 없습니다. 초기
            설정을 나가면 자동으로 로그아웃됩니다.
          </p>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      )}
      {step === 1 && (
        <Picker
          label="키 (cm)"
          min={100}
          max={250}
          value={height}
          onChange={(value) => handleNextStep(value.toString())}
        />
      )}
      {step === 2 && (
        <Picker
          label="몸무게 (kg)"
          min={30}
          max={200}
          value={weight}
          onChange={(value) => handleNextStep(value.toString())}
        />
      )}
      {step === 3 && (
        <Picker
          label="목표 몸무게 (kg)"
          min={30}
          max={200}
          value={targetWeight || 0}
          onChange={(value) => handleNextStep(value.toString())}
        />
      )}
      {step === 4 && renderOptions(["쉬움", "중간", "어려움"])}
      {step < questions.length &&
        step > 0 &&
        step !== 1 &&
        step !== 2 &&
        step !== 3 &&
        step !== 4 && (
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              className={styles.input}
              placeholder="여기에 입력하세요..."
            />
            <button onClick={handleSend} className={styles.sendButton}>
              전송
            </button>
          </div>
        )}
      <button className={styles.button} onClick={() => setShowWarning(true)}>
        초기 설정 나가기
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
