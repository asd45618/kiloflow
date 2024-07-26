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
import AchievementLineChart from "../components/main/achievementLineChart";

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

const AchievementLineChartBlock = styled.div``;

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
  const [selectedDate, setSelectedDate] = useState(dayjs().toDate());
  const [todayList, setTodayList] = useState("food");
  const [todayFoodData, setTodayFoodData] = useState([]);
  const [todayExerciseData, setTodayExerciseData] = useState([]);
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [monthlyAchievements, setMonthlyAchievements] = useState<{
    [key: string]: number;
  }>({});
  const [achievement, setAchievement] = useState(0);
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
          `/api/food/todayFood?user_id=${currentUser.user_id}&date=${dayjs(
            selectedDate
          ).format("YYYY-MM-DD")}`
        );
        const foodData = await foodRes.json();
        setTodayFoodData(foodData);

        const exerciseRes = await fetch(
          `/api/exercise/todayExercise?user_id=${
            currentUser.user_id
          }&date=${dayjs(selectedDate).format("YYYY-MM-DD")}`
        );
        const exerciseData = await exerciseRes.json();
        setTodayExerciseData(exerciseData);
      };

      const fetchAchievement = async () => {
        const res = await fetch(
          `/api/achievement/get?user_id=${currentUser.user_id}&date=${dayjs(
            selectedDate
          ).format("YYYY-MM-DD")}`
        );

        if (res.ok) {
          const data = await res.json();
          setAchievement(data.achievement);
        } else {
          setAchievement(0);
        }
      };

      fetchTodayData();
      fetchAchievement();
    }
  }, [currentUser, selectedDate]);

  useEffect(() => {
    if (currentUser && currentTab === "month") {
      const fetchMonthlyAchievements = async () => {
        const fetchAchievementsForMonth = async (date: dayjs.Dayjs) => {
          const res = await fetch(
            `/api/achievement/getMonthly?user_id=${
              currentUser.user_id
            }&month=${date.format("YYYY-MM")}`
          );
          return res.json();
        };

        let achievements: { [key: string]: number } = {};
        for (let i = 0; i < 5; i++) {
          const date = dayjs(selectedDate).subtract(i, "month");
          const data = await fetchAchievementsForMonth(date);
          data.forEach((achievement: { date: string; achievement: number }) => {
            achievements[dayjs(achievement.date).format("YYYY-MM-DD")] =
              achievement.achievement;
          });
        }
        setMonthlyAchievements(achievements);
      };

      fetchMonthlyAchievements();
    }
  }, [currentUser, selectedDate, currentTab]);

  const handleDateChange = (value: Date) => {
    setSelectedDate(dayjs(value).toDate());
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

  const tileContent = ({ date }: { date: Date }) => {
    const dateString = dayjs(date).format("YYYY-MM-DD");
    const achievement = monthlyAchievements[dateString];

    if (achievement !== undefined) {
      let color = "";
      if (achievement <= 30) {
        color = "red";
      } else if (achievement <= 60) {
        color = "yellow";
      } else if (achievement <= 90) {
        color = "blue";
      } else {
        color = "green";
      }
      return (
        <div
          style={{
            backgroundColor: color,
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            margin: "auto",
          }}
        ></div>
      );
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
      {currentTab === "month" && (
        <>
          <StyledCalendar
            key={selectedDate.toString()}
            onChange={(value) => handleDateChange(value as Date)}
            value={selectedDate}
            view="month"
            tileClassName={tileClassName}
            tileContent={tileContent}
            formatMonthYear={(locale, date) => formatLabel(date)}
            formatDay={(locale, date) => dayjs(date).date().toString()}
            // 달력 일요일부터 시작하게
            // startOfWeek, endOfWeek가 일요일 기준이라서
            locale="en-US"
          />
          <AchievementLineChartBlock>
            <AchievementLineChart
              selectedDate={selectedDate}
              monthlyAchievements={monthlyAchievements}
            />
          </AchievementLineChartBlock>
        </>
      )}
      {currentTab === "week" && (
        <>
          <StyledCalendar
            key={selectedDate.toString()}
            onChange={(value) => handleDateChange(value as Date)}
            value={selectedDate}
            view="month"
            tileClassName={tileClassName}
            formatMonthYear={(locale, date) => formatLabel(date)}
            formatDay={(locale, date) => dayjs(date).date().toString()}
            // 달력 일요일부터 시작하게
            locale="en-US"
          />
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
            <DailyAchievement achievement={achievement} />
          </DailyAchievementBlock>
        </>
      )}
    </HomeBlock>
  );
};

export default Home;
