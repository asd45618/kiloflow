import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Plugin,
  Chart,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AchievementWrapper = styled.div`
  width: 100%;
  text-align: center;
  padding-top: 20px;
  background-color: #d9d9d9; /* 배경 흰색 */

  .chartTitle {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    p {
      margin-bottom: 0;
      font-size: 18px;
      font-weight: bold;
    }
  }
  .doughnutChart {
    position: relative;
    width: 80%;
    height: 80%;
    margin: 0 auto;
    canvas {
    }
    p {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin-bottom: 0;
      font-size: 48px;
      font-weight: bold;
      color: #36a2eb;
    }
  }
`;

const MessageWrapper = styled.div`
  margin-top: 30px;
  padding-bottom: 20px;
  font-size: 18px;
  p {
    margin-bottom: 0;
    font-weight: bold;
  }
`;

interface DailyAchievementProps {
  achievement: number;
}

const DailyAchievement: React.FC<DailyAchievementProps> = ({ achievement }) => {
  const [chartData, setChartData] = useState({
    labels: ['달성률'],
    datasets: [
      {
        data: [0, 100],
        backgroundColor: ['#36A2EB', '#FFFFFF'],
        hoverBackgroundColor: ['#36A2EB', '#FFFFFF'],
        borderWidth: 0,
      },
    ],
  });
  const [centerText, setCenterText] = useState(`${achievement}%`);
  const [message, setMessage] = useState(['']);
  console.log(achievement);

  useEffect(() => {
    let allMessage = '';
    if (achievement < 30) {
      allMessage =
        '칼로리 섭취가 너무 적습니다. 건강한 식습관과 규칙적인 운동을 함께 유지하세요!';
    } else if (achievement >= 30 && achievement <= 40) {
      allMessage = '칼로리 섭취와 운동량이 조금 부족합니다. 더 노력해보세요!';
    } else if (achievement >= 41 && achievement <= 50) {
      allMessage =
        '칼로리 섭취와 운동이 조금씩 균형을 잡아가고 있습니다. 계속해보세요!';
    } else if (achievement >= 51 && achievement <= 60) {
      allMessage =
        '칼로리 섭취와 운동이 목표에 가까워지고 있습니다. 아주 잘하고 있어요!';
    } else if (achievement >= 61 && achievement <= 70) {
      allMessage =
        '칼로리 섭취와 운동이 적절합니다. 계속 이 상태를 유지하세요!';
    } else if (achievement >= 71 && achievement <= 80) {
      allMessage =
        '칼로리 섭취와 운동이 매우 좋습니다. 지금처럼 꾸준히 해보세요!';
    } else if (achievement >= 81 && achievement <= 90) {
      allMessage =
        '칼로리 섭취와 운동이 훌륭합니다. 계속해서 좋은 습관을 이어가세요!';
    } else if (achievement >= 91 && achievement <= 99) {
      allMessage = '칼로리 섭취와 운동이 거의 완벽합니다. 조금만 더 힘내세요!';
    } else if (achievement === 100) {
      allMessage =
        '오늘의 칼로리 섭취와 운동 목표를 완벽하게 달성했습니다. 지금처럼 건강한 생활을 지속하세요!';
    }
    setMessage(allMessage.split('.'));
  }, [achievement]);

  useEffect(() => {
    setChartData({
      labels: ['달성률'],
      datasets: [
        {
          data: [achievement, 100 - achievement],
          backgroundColor: ['#36A2EB', '#FFFFFF'],
          hoverBackgroundColor: ['#36A2EB', '#FFFFFF'],
          borderWidth: 0,
        },
      ],
    });
    setCenterText(`${achievement}%`);
  }, [achievement]);

  const options = {
    cutout: '85%',
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
    },
  };

  const createCenterTextPlugin = (): Plugin<'doughnut'> => {
    return {
      id: 'centerText',
      beforeDraw: (chart: Chart<'doughnut'>) => {
        const { ctx, width, height } = chart;
        ctx.restore();
        const fontSize = (height / 114).toFixed(2);
        ctx.font = `${fontSize}em sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#36A2EB';

        // const text = centerText;
        // const textX = Math.round((width - ctx.measureText(text).width) / 2);
        // const textY = height / 2;

        // ctx.fillText(text, textX, textY);
        ctx.save();
      },
    };
  };

  return (
    <AchievementWrapper>
      <div className='chartTitle'>
        <img src='../../mainStar.png' alt='' />
        <p>오늘의 목표 달성 상태를 확인하세요.</p>
      </div>
      <div className='doughnutChart'>
        <Doughnut
          data={chartData}
          options={options}
          plugins={[createCenterTextPlugin()]}
        />
        <p>{achievement}%</p>
      </div>
      <MessageWrapper>
        <p>{message[0]}.</p>
        <p>{message[1]}</p>
      </MessageWrapper>
    </AchievementWrapper>
  );
};

export default DailyAchievement;
