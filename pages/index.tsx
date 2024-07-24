import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import CalendarTab from "../components/main/calendarTab";

import TodayFoodList from "../components/main/todayFoodList";

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
        key={selectedDate.toString()} // Add key to force re-render
        onChange={(value) => handleDateChange(value as Date)}
        value={selectedDate}
        view="month"
        tileClassName={tileClassName}
        formatMonthYear={(locale, date) => formatLabel(date)}
        formatDay={(locale, date) => dayjs(date).date().toString()}
      />
      {currentTab === "week" && (
        <>
          <TodayFoodList
            userId={currentUser.user_id}
            selectedDate={selectedDate}
          />
        </>
      )}
      {currentTab === "month" && <></>}
    </HomeBlock>
  );
};

export default Home;
