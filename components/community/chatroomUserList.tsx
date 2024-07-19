import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";
import { RxExit } from "react-icons/rx";
import { TbSpeakerphone } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";

interface UserListProps {
  showUserList: boolean;
  participatingUsers: User[];
  isOwner: boolean;
  chatroomInfo: Chatroom | null;
  handleLeaveRoom: () => void;
  setShowUserList: (value: boolean) => void;
  kickUser: (userId: number, userNickname: string) => void; // 강퇴 기능 추가
}

interface User {
  user_id: number;
  nickname: string;
  profile_image: string;
}

interface Chatroom {
  id: number;
  owner_id: number;
}

const UserListContainer = styled.div<{ showUserList: boolean }>`
  display: ${({ showUserList }) => (showUserList ? "block" : "none")};
  overflow-y: hidden;
  position: absolute;
  top: 0px;
  right: 0px;
  height: 100%;
  width: 250px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  z-index: 100;
  .userlist__container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .cancel {
      font-size: 24px;
      margin-bottom: 10px;
    }
    .user__item__wrap {
      overflow-y: scroll;
      height: 100%;
      .user__item {
        flex: 1;
        display: flex;
        align-items: center;
        padding: 5px;
        img {
          width: 50px;
          border-radius: 50px;
          border: 1px solid #ddd;
          margin-right: 5px;
        }
        button.kick {
          margin-left: auto;
          background: red;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 5px 10px;
          cursor: pointer;
        }
      }
    }
    .admin__actions {
      display: flex;
      button {
        font-size: 24px;
        margin: 2px 20px 2px 0;
      }
    }
  }
`;

const ChatRoomUserList: React.FC<UserListProps> = ({
  showUserList,
  participatingUsers,
  isOwner,
  chatroomInfo,
  handleLeaveRoom,
  setShowUserList,
  kickUser, //강퇴 기능 추가
}) => {
  const router = useRouter();

  const handleSettingsClick = () => {
    router.push(`/community/chat/detailSetting/${chatroomInfo?.id}`);
  };

  const handleNoticeClick = () => {
    router.push(`/community/chat/notice/${chatroomInfo?.id}`);
  };

  return (
    <UserListContainer showUserList={showUserList}>
      <div className="userlist__container">
        <div className="cancel">
          <button onClick={() => setShowUserList(false)}>X</button>
        </div>
        <div className="user__item__wrap">
          {participatingUsers.map((user) => (
            <div className="user__item" key={user.user_id}>
              <Image
                src={user.profile_image}
                alt="유저프로필"
                width={50}
                height={50}
              />
              <span>{user.nickname}</span>
              {user.user_id === chatroomInfo?.owner_id && <span>(방장)</span>}
              {isOwner && user.user_id !== chatroomInfo?.owner_id && (
                <button
                  className="kick"
                  onClick={() => kickUser(user.user_id, user.nickname)}
                >
                  강퇴
                </button>
              )}
            </div>
          ))}
        </div>
        {isOwner ? (
          <div className="admin__actions">
            <button onClick={handleSettingsClick}>
              <IoSettingsOutline />
            </button>
            <button onClick={handleNoticeClick}>
              <TbSpeakerphone />
            </button>
          </div>
        ) : (
          <div className="admin__actions">
            <button onClick={handleLeaveRoom}>
              <RxExit />
            </button>
          </div>
        )}
      </div>
    </UserListContainer>
  );
};

export default ChatRoomUserList;
