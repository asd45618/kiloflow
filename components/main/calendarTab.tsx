import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

const CalendarTabBlock = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  /* background-color: #f5f5f5; */
  border-bottom: 1px solid #ccc;
`;

const DateDisplay = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const TabContainer = styled.div`
  display: flex;
`;

const Tab = styled.div<{ active: boolean }>`
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  border-bottom: ${({ active }) => (active ? '2px solid black' : 'none')};
`;

const WeekNavigation = styled.div`
  display: flex;
  align-items: center;
`;

const NavButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin: 0 15px;
`;

type Tab = 'week' | 'month';

interface TabProps {
  currentTab: Tab;
  setCurrentTab: React.Dispatch<React.SetStateAction<Tab>>;
  selectedDate: Date;
  handlePrev: () => void;
  handleNext: () => void;
}

const CalendarTab: React.FC<TabProps> = ({
  currentTab,
  setCurrentTab,
  selectedDate,
  handlePrev,
  handleNext,
}) => {
  const startOfWeek = dayjs(selectedDate).startOf('week');
  const weekNumber = Math.ceil(startOfWeek.date() / 7);

  return (
    <CalendarTabBlock>
      <DateDisplay>
        <NavButton onClick={handlePrev}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </NavButton>
        {currentTab === 'week'
          ? `${startOfWeek.year()}년 ${
              startOfWeek.month() + 1
            }월 ${weekNumber}주`
          : `${dayjs(selectedDate).year()}년 ${
              dayjs(selectedDate).month() + 1
            }월`}
        <NavButton onClick={handleNext}>
          <FontAwesomeIcon icon={faAngleRight} />
        </NavButton>
      </DateDisplay>
      {/* <WeekNavigation>
      </WeekNavigation> */}
      <TabContainer>
        <Tab
          active={currentTab === 'week'}
          onClick={() => setCurrentTab('week')}
        >
          주간
        </Tab>
        <Tab
          active={currentTab === 'month'}
          onClick={() => setCurrentTab('month')}
        >
          월간
        </Tab>
      </TabContainer>
    </CalendarTabBlock>
  );
};

export default CalendarTab;
