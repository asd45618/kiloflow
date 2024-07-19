// pages>personal>index.tsx
import { useState } from "react";
import styled from "styled-components";
import PersonalInfo from "../../components/personal/personalInfo";
import ProfileModify from "../../components/personal/profileModify";
import ParticipatingChat from "../../components/personal/participatingChat";

const PersonalBlock = styled.div`
  nav {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 50px;
    .active {
      color: #0e5b10;
      font-weight: bold;
    }

    p {
      margin-top: 10px;
      line-height: 1;
    }
  }
`;

export default function Personal() {
  const [activeTab, setActiveTab] = useState("personalInfo");

  const renderContent = () => {
    switch (activeTab) {
      case "personalInfo":
        return <PersonalInfo />;
      case "profileModify":
        return <ProfileModify />;
      case "participatingChat":
        return <ParticipatingChat />;
      default:
        return null;
    }
  };

  return (
    <PersonalBlock>
      <div>
        <nav>
          <button
            onClick={() => setActiveTab("personalInfo")}
            className={activeTab === "personalInfo" ? "active" : ""}
          >
            개인정보 수정
          </button>
          <p>|</p>
          <button
            onClick={() => setActiveTab("profileModify")}
            className={activeTab === "profileModify" ? "active" : ""}
          >
            목표 수정
          </button>
          <p>|</p>
          <button
            onClick={() => setActiveTab("participatingChat")}
            className={activeTab === "participatingChat" ? "active" : ""}
          >
            참여 중인 채팅방
          </button>
        </nav>
        <div>{renderContent()}</div>
      </div>
    </PersonalBlock>
  );
}
