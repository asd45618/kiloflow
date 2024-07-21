import { useState, useEffect } from "react";
import styled from "styled-components";
import PersonalInfo from "../../components/personal/personalInfo";
import ProfileModify from "../../components/personal/profileModify";
import ParticipatingChat from "../../components/personal/participatingChat";
import { useRouter } from "next/router";

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
  const [currentUserInfo, setCurrentUserInfo] = useState<any>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
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
          setCurrentUserInfo(data.user);
          setCurrentUserProfile(data.userProfile);
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

  const renderContent = () => {
    switch (activeTab) {
      case "personalInfo":
        return <PersonalInfo currentUserInfo={currentUserInfo} />;
      case "profileModify":
        return <ProfileModify currentUserProfile={currentUserProfile} />;
      case "participatingChat":
        return <ParticipatingChat currentUserInfo={currentUserInfo} />;
      default:
        return null;
    }
  };

  if (!currentUserInfo || !currentUserProfile) return <div>Loading...</div>;

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
