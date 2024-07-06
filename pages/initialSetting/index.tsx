import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import styles from "../../styles/initialSetting.module.css";
import Picker from "../../components/Layout/Picker";
import { IoIosArrowBack } from "react-icons/io";

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
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const questions = [
    {
      text: "안녕! 우리 kiloflow는 건강한 생활 습관을 유지하면서 체중을 관리할 수 있도록 도와주는 어플이야.",
      delay: 1500,
    },
    { text: "너의 신체 정보를 입력하고 목표를 설정하면,", delay: 1500 },
    {
      text: "Kiloflow가 맞춤형 권장 섭취 칼로리를 제공해 줄 거야.",
      delay: 1500,
    },
    {
      text: "또한, 네가 섭취한 음식을 등록해서 그날의 섭취 칼로리를 직관적으로 볼 수 있고,",
      delay: 1500,
    },
    {
      text: "달성률을 통해 건강한 다이어트 흐름에 도움을 줄 수 있어.",
      delay: 1500,
    },
    { text: "그럼 너의 키를 알려줄래?", delay: 1500 },
    { text: "몸무게는?", delay: 1500 },
    { text: "목표 몸무게는?", delay: 1500 },
    {
      text: "감량 난이도는 어떻게 하고 싶어?",
      delay: 1500,
    },
  ];

  useEffect(() => {
    if (step < questions.length && step <= 4) {
      // Automatically move through the introduction steps
      const timer = setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "bot", text: questions[step].text },
        ]);
        setStep((prevStep) => prevStep + 1);
      }, questions[step].delay);
      return () => clearTimeout(timer);
    } else if (step < questions.length) {
      // Wait for user input in the questions steps
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", text: questions[step].text },
      ]);
    }
  }, [step]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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

    if (step === 5) setHeight(parseInt(userInput));
    if (step === 6) setWeight(parseInt(userInput));
    if (step === 7) setTargetWeight(parseInt(userInput));
    if (step === 8) {
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
    }
    setStep((prevStep) => prevStep + 1);
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
      <div className={styles.top}>
        <button
          className={styles.backButton}
          onClick={() => setShowWarning(true)}
        >
          <IoIosArrowBack />
        </button>
        <h2 className={styles.h2}>프로필 초기 설정</h2>
      </div>
      {showWarning && (
        <div className={styles.warning}>
          <p>
            초기 설정을 완료하지 않으면 이 앱의 기능을 이용할 수 없습니다. 초기
            설정을 나가면 자동으로 로그아웃됩니다.
          </p>
          <button onClick={handleLogout} className={styles.logoutButton}>
            확인
          </button>
          <button
            onClick={() => setShowWarning(false)}
            className={styles.cancelButton}
          >
            취소
          </button>
        </div>
      )}

      <div className={styles.chatContainer} ref={chatContainerRef}>
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

      {step === 5 && (
        <Picker
          label="키 (cm)"
          min={100}
          max={250}
          value={height}
          onChange={(value) => handleNextStep(value.toString())}
        />
      )}
      {step === 6 && (
        <Picker
          label="몸무게 (kg)"
          min={30}
          max={200}
          value={weight}
          onChange={(value) => handleNextStep(value.toString())}
        />
      )}
      {step === 7 && (
        <Picker
          label="목표 몸무게 (kg)"
          min={30}
          max={200}
          value={targetWeight || 0}
          onChange={(value) => handleNextStep(value.toString())}
        />
      )}

      {step === 8 &&
        difficulty === "" &&
        renderOptions(["쉬움", "중간", "어려움"])}
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

      {error && <p>{error}</p>}
    </div>
  );
}
