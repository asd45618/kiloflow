import React, { useState, useEffect } from "react";
import WeeklyAchievementChart from "./WeeklyAchievement";
import MonthlyAchievementChart from "./MonthlyAchievement";
import styled from "styled-components";
import dayjs from "dayjs";

const ChartWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Message = styled.div`
  margin-top: 10px;
  font-size: 16px;
  text-align: center;
  color: #333;
`;

interface AchievementListChartProps {
  selectedDate: Date;
  monthlyAchievements: { [key: string]: number };
}

const AchievementListChart: React.FC<AchievementListChartProps> = ({
  selectedDate,
  monthlyAchievements,
}) => {
  const [view, setView] = useState("weekly");
  const [weeklyData, setWeeklyData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: "주간 달성률",
        data: [],
        fill: false,
        borderColor: "#36A2EB",
      },
    ],
  });
  const [monthlyData, setMonthlyData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: "월간 달성률",
        data: [],
        fill: false,
        borderColor: "#FF6384",
      },
    ],
  });
  const [weeklyMessage, setWeeklyMessage] = useState("");
  const [monthlyMessage, setMonthlyMessage] = useState("");

  useEffect(() => {
    const calculatedWeeklyData = calculateWeeklyData(
      selectedDate,
      monthlyAchievements
    );
    const calculatedMonthlyData = calculateMonthlyData(monthlyAchievements);
    setWeeklyData(calculatedWeeklyData);
    setMonthlyData(calculatedMonthlyData);

    // Set messages based on comparison
    setWeeklyMessage(getWeeklyMessage(calculatedWeeklyData.datasets[0].data));
    setMonthlyMessage(
      getMonthlyMessage(calculatedMonthlyData.datasets[0].data)
    );

    console.log("받은 monthlyAchievements", monthlyAchievements);
    console.log(
      "계산된 weeklyData, monthlyData",
      calculatedWeeklyData,
      calculatedMonthlyData
    );
  }, [selectedDate, monthlyAchievements]);

  const calculateWeeklyData = (
    selectedDate: Date,
    monthlyAchievements: { [key: string]: number }
  ) => {
    const weeklyData: { label: string; average: number }[] = [];
    for (let i = 0; i < 5; i++) {
      const startOfWeek = dayjs(selectedDate)
        .subtract(i, "week")
        .startOf("week");
      const endOfWeek = dayjs(selectedDate).subtract(i, "week").endOf("week");
      const weekData: number[] = [];
      let current = startOfWeek;

      while (current.isBefore(endOfWeek) || current.isSame(endOfWeek)) {
        const date = current.format("YYYY-MM-DD");
        if (monthlyAchievements[date] !== undefined) {
          weekData.push(monthlyAchievements[date]);
        }
        current = current.add(1, "day");
      }

      const average =
        weekData.length > 0
          ? weekData.reduce((acc, value) => acc + value, 0) / weekData.length
          : 0;

      weeklyData.unshift({
        label:
          startOfWeek.format("YYYY-MM-DD") +
          " ~ " +
          endOfWeek.format("YYYY-MM-DD"),
        average,
      });
    }

    return {
      labels: weeklyData.map((item) => item.label),
      datasets: [
        {
          label: "주간 달성률",
          data: weeklyData.map((item) => item.average),
          fill: false,
          borderColor: "#36A2EB",
        },
      ],
    };
  };

  const calculateMonthlyData = (monthlyAchievements: {
    [key: string]: number;
  }) => {
    const monthlyData: { label: string; average: number }[] = [];
    for (let i = 0; i < 5; i++) {
      const month = dayjs(selectedDate).subtract(i, "month");
      const startOfMonth = month.startOf("month");
      const endOfMonth = month.endOf("month");
      const monthData: number[] = [];
      let current = startOfMonth;

      while (current.isBefore(endOfMonth) || current.isSame(endOfMonth)) {
        const date = current.format("YYYY-MM-DD");
        if (monthlyAchievements[date] !== undefined) {
          monthData.push(monthlyAchievements[date]);
        }
        current = current.add(1, "day");
      }

      const average =
        monthData.length > 0
          ? monthData.reduce((acc, value) => acc + value, 0) / monthData.length
          : 0;

      monthlyData.unshift({
        label: month.format("YYYY-MM"),
        average,
      });
    }

    return {
      labels: monthlyData.map((item) => item.label),
      datasets: [
        {
          label: "월간 달성률",
          data: monthlyData.map((item) => item.average),
          fill: false,
          borderColor: "#FF6384",
        },
      ],
    };
  };

  const getWeeklyMessage = (data: number[]) => {
    if (data.length < 2) return "";
    const thisWeek = data[data.length - 1];
    const lastWeek = data[data.length - 2];

    if (thisWeek > lastWeek) {
      return "이번 주에는 지난 주보다 더 좋은 성과를 거두었습니다! 계속해서 좋은 흐름을 유지하세요";
    } else if (thisWeek === lastWeek) {
      return "이번 주에도 좋은 성과를 유지하고 있습니다. 다음 주에는 더 높은 목표를 도전해보세요!";
    } else {
      return "이번 주는 조금 아쉽지만, 다음 주에는 더 좋은 성과를 기대해봅시다! 꾸준함이 중요합니다.";
    }
  };

  const getMonthlyMessage = (data: number[]) => {
    if (data.length < 2) return "";
    const thisMonth = data[data.length - 1];
    const lastMonth = data[data.length - 2];

    if (thisMonth > lastMonth) {
      return "이번 달에는 지난 달보다 더 좋은 성과를 거두었습니다! 계속해서 좋은 흐름을 유지하세요";
    } else if (thisMonth === lastMonth) {
      return "이번 달에도 좋은 성과를 유지하고 있습니다. 다음 달에는 더 높은 목표를 도전해보세요!";
    } else {
      return "이번 달은 조금 아쉽지만, 다음 달에는 더 좋은 성과를 기대해봅시다! 꾸준함이 중요합니다.";
    }
  };

  return (
    <ChartWrapper>
      <ButtonContainer>
        <ToggleButton
          active={view === "weekly"}
          onClick={() => setView("weekly")}
        >
          주간
        </ToggleButton>
        <ToggleButton
          active={view === "monthly"}
          onClick={() => setView("monthly")}
        >
          월간
        </ToggleButton>
      </ButtonContainer>
      {view === "weekly" && (
        <>
          <Message>{weeklyMessage}</Message>
          <WeeklyAchievementChart data={weeklyData} />
        </>
      )}
      {view === "monthly" && (
        <>
          <Message>{monthlyMessage}</Message>
          <MonthlyAchievementChart data={monthlyData} />
        </>
      )}
    </ChartWrapper>
  );
};

export default AchievementListChart;
