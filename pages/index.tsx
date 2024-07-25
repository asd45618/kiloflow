import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import CalendarTab from "../components/main/calendarTab";
import TodayFoodList from "../components/main/todayFoodList";
import TodayExerciseList from "../components/main/todayExerciseList";
import DailyAchievement from "../components/main/dailyAchievement";
import CalorieBar from "../components/main/calorieBar";

dayjs.extend(weekOfYear);

const HomeBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledCalendar = styled(Calendar)`
  .react-calendar__navigation {
    display: none;
  }
  .react-calendar__tile--hidden {
    display: none !important;
  }
`;

const CalorieBarBlock = styled.div``;

const ListBlock = styled.div`
  width: 100%;
  background-color: #f5f5f5;
  .button__container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
`;

const ToggleButton = styled.button<{ active: boolean }>`
  background-color: ${({ active }) => (active ? "#007bff" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  border: 1px solid #007bff;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  margin: 0 10px;

  &:hover {
    background-color: #0056b3;
    color: #fff;
  }
`;

const DailyAchievementBlock = styled.div``;

type User = {
  user_id: number;
  nickname: string;
  email: string;
  profile_image: string;
  password: string;
};

type Tab = "week" | "month";

const Home = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<Tab>("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todayList, setTodayList] = useState("food");
  const [todayFoodData, setTodayFoodData] = useState([]);
  const [todayExerciseData, setTodayExerciseData] = useState([]);
  const [dailyCalories, setDailyCalories] = useState(2000);
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
          setDailyCalories(data.userProfile.daily_calories); // 권장섭취칼로리 가져옴
        } else {
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
      } else {
        router.push("/auth/login");
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const fetchTodayData = async () => {
        const foodRes = await fetch(
          `/api/food/todayFood?user_id=${
            currentUser.user_id
          }&date=${selectedDate.toISOString()}`
        );
        const foodData = await foodRes.json();
        setTodayFoodData(foodData);

        const exerciseRes = await fetch(
          `/api/exercise/todayExercise?user_id=${
            currentUser.user_id
          }&date=${selectedDate.toISOString()}`
        );
        const exerciseData = await exerciseRes.json();
        setTodayExerciseData(exerciseData);
      };

      fetchTodayData();
    }
  }, [currentUser, selectedDate]);

  const handleDateChange = (value: Date) => {
    setSelectedDate(value);
  };

  const tileClassName = ({ date }: { date: Date }) => {
    if (currentTab === "week") {
      const startOfWeek = dayjs(selectedDate).startOf("week").toDate();
      const endOfWeek = dayjs(selectedDate).endOf("week").toDate();
      if (date < startOfWeek || date > endOfWeek) {
        return "react-calendar__tile--hidden";
      }
    }
    return null;
  };

  const handlePrev = () => {
    const newDate =
      currentTab === "week"
        ? dayjs(selectedDate).subtract(1, "week").toDate()
        : dayjs(selectedDate).subtract(1, "month").toDate();
    setSelectedDate(newDate);
  };

  const handleNext = () => {
    const newDate =
      currentTab === "week"
        ? dayjs(selectedDate).add(1, "week").toDate()
        : dayjs(selectedDate).add(1, "month").toDate();
    setSelectedDate(newDate);
  };

  const formatLabel = (date: Date) => {
    if (currentTab === "week") {
      const startOfWeek = dayjs(date).startOf("week");
      const weekNumber = Math.ceil(startOfWeek.date() / 7);
      return `${startOfWeek.year()}년 ${
        startOfWeek.month() + 1
      }월 ${weekNumber}주`;
    }
    return `${dayjs(date).year()}년 ${dayjs(date).month() + 1}월`;
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <HomeBlock>
      <CalendarTab
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedDate={selectedDate}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
      <StyledCalendar
        key={selectedDate.toString()}
        onChange={(value) => handleDateChange(value as Date)}
        value={selectedDate}
        view="month"
        tileClassName={tileClassName}
        formatMonthYear={(locale, date) => formatLabel(date)}
        formatDay={(locale, date) => dayjs(date).date().toString()}
      />
      {currentTab === "week" && (
        <>
          <CalorieBarBlock>
            <CalorieBar
              foodData={todayFoodData}
              exerciseData={todayExerciseData}
              dailyCalories={dailyCalories}
            />
          </CalorieBarBlock>
          <ListBlock>
            <div className="button__container">
              <ToggleButton
                active={todayList === "food"}
                onClick={() => setTodayList("food")}
              >
                오늘의 식단
              </ToggleButton>
              <ToggleButton
                active={todayList === "exercise"}
                onClick={() => setTodayList("exercise")}
              >
                오늘의 운동
              </ToggleButton>
            </div>
            {todayList === "food" && <TodayFoodList foodData={todayFoodData} />}
            {todayList === "exercise" && (
              <TodayExerciseList exerciseData={todayExerciseData} />
            )}
          </ListBlock>
          <DailyAchievementBlock>
            <DailyAchievement
              userId={currentUser.user_id}
              selectedDate={selectedDate}
              foodData={todayFoodData}
              exerciseData={todayExerciseData}
              dailyCalories={dailyCalories} // 프롭스로 전달
            />
          </DailyAchievementBlock>
        </>
      )}
      {currentTab === "month" && <></>}
    </HomeBlock>
  );
};

export default Home;
