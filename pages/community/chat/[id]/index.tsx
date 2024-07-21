import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import communityThumb from "../../../../public/communityThumb.png";
import styles from "../../../../styles/components.module.css";
import styled from "styled-components";
import socket from "../../../../lib/socket"; // 소켓 초기화 파일 import
import { IoIosArrowBack } from "react-icons/io";

import ChatRoomUserList from "../../../../components/community/chatroomUserList";
import Notice from "../../../../components/community/notice";

import minion from "../../../../public/minion1.png";

const ChatContainer = styled.div<{ noticeHeight: number }>`
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ccc;
    .back {
      cursor: pointer;
      font-size: 24px;
    }
    .chat__info {
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .chatroom__name {
        display: flex;
        align-items: center;
      }
    }
    .menu__button {
      cursor: pointer;
      font-size: 24px;
    }
  }
  .messages {
    height: calc(52vh - ${({ noticeHeight }) => noticeHeight}px);
    overflow-y: scroll;
    padding: 10px;

    display: flex;
    flex-direction: column;
  }
  .input__container {
    display: flex;
    padding: 10px 10px 0;
    input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-right: 10px;
    }
    button {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      background: #ccc;
      color: #fff;
      border-radius: 10px;
      &:hover {
        background: gray;
      }
    }
  }
`;

const MessageContainer = styled.div<{
  isCurrentUser: boolean;
  isSystemMessage?: boolean;
}>`
  display: flex;
  flex-direction: ${({ isCurrentUser }) =>
    isCurrentUser ? "row-reverse" : "row"};
  align-items: flex-end;
  margin-bottom: 10px;
  justify-content: ${({ isSystemMessage }) =>
    isSystemMessage ? "center" : "flex-start"};

  .message__content {
    max-width: 60%;
    background-color: ${({ isCurrentUser, isSystemMessage }) =>
      isSystemMessage ? "transparent" : isCurrentUser ? "#dcf8c6" : "#fff"};
    border-radius: 10px;
    padding: 10px;
    margin-left: ${({ isCurrentUser }) => (isCurrentUser ? "0" : "10px")};
    margin-right: ${({ isCurrentUser }) => (isCurrentUser ? "10px" : "0")};
    word-break: break-word;
    text-align: ${({ isSystemMessage }) =>
      isSystemMessage ? "center" : "left"};
    font-weight: ${({ isSystemMessage }) =>
      isSystemMessage ? "bold" : "normal"};
  }
  .profile__image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #ddd;
    margin-right: 10px;
  }
  .nickname {
    margin-bottom: 5px;
    font-weight: bold;
  }
`;

interface Message {
  id: number;
  user_id: number | null;
  message: string;
}

interface User {
  user_id: number;
  email: string;
  nickname: string;
  profile_image: string;
}

interface Chatroom {
  id: number;
  name: string;
  image_url: string | null;
  max_members: number;
  owner_id: number;
}

interface Notice {
  title: string;
  content: string;
  created_at: string;
}

const ChatRoom = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { id: roomIdString } = router.query;
  const roomId = parseInt(roomIdString as string, 10);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [chatroomInfo, setChatroomInfo] = useState<Chatroom | null>(null);
  const [participatingUsers, setParticipatingUsers] = useState<User[]>([]);
  const [showUserList, setShowUserList] = useState(false);
  const [latestNotice, setLatestNotice] = useState<Notice | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const noticeRef = useRef<HTMLDivElement | null>(null); // 공지 Ref 추가
  const [noticeHeight, setNoticeHeight] = useState(0);

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
  }, [router]);

  useEffect(() => {
    if (roomId && currentUser) {
      console.log("Connecting to socket...");
      socket.connect(); // 필요한 경우 소켓을 연결합니다.
      socket.emit("join_room", { roomId, userId: currentUser.user_id });

      socket.on("load_messages", (loadedMessages: Message[]) => {
        console.log("Loaded messages:", loadedMessages);
        setMessages(loadedMessages);
      });

      socket.on("new_message", (newMessage: Message) => {
        console.log("Received new message:", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      socket.on("system_message", (systemMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, systemMessage]);
      });

      checkIfOwner();
      fetchChatroomInfo();
      fetchParticipatingUsers();
      fetchLatestNotice();

      return () => {
        socket.off("load_messages");
        socket.off("new_message");
        socket.off("user_left");

        socket.off("system_message");
        socket.disconnect(); // 컴포넌트 언마운트 시 소켓 연결 해제
      };
    }
  }, [roomId, currentUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (noticeRef.current) {
      setNoticeHeight(noticeRef.current.clientHeight);
    }
  }, [latestNotice, noticeHeight]); // 높이 변화를 추적할 변수 추가

  const checkIfOwner = async () => {
    const res = await fetch(
      `/api/community/current-chatroom-info?roomId=${roomId}&action=info`
    );
    const data = await res.json();
    if (currentUser && data.owner_id === currentUser.user_id) {
      setIsOwner(true);
    }
    setChatroomInfo(data);
  };

  const fetchChatroomInfo = async () => {
    const res = await fetch(
      `/api/community/current-chatroom-info?roomId=${roomId}&action=info`
    );
    const data = await res.json();
    setChatroomInfo(data);
  };

  const fetchParticipatingUsers = async () => {
    const res = await fetch(
      `/api/community/current-chatroom-info?roomId=${roomId}&action=users`
    );
    const data = await res.json();
    setParticipatingUsers(data);
  };

  const fetchLatestNotice = async () => {
    const res = await fetch(`/api/community/latest-notice?roomId=${roomId}`);
    const data = await res.json();
    if (data) {
      setLatestNotice(data);
    } else {
      setLatestNotice(null);
    }
  };

  const sendMessage = () => {
    if (roomId && currentUser) {
      console.log("Sending message:", message);
      socket.emit("send_message", {
        roomId,
        userId: currentUser.user_id,
        message,
      });
      setMessage("");
    }
  };

  const handleLeaveRoom = async () => {
    if (!currentUser) {
      alert("유효하지 않은 사용자입니다.");
      return;
    }

    if (confirm("채팅방을 나가시겠습니까?")) {
      const res = await fetch(`/api/community/join`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatroom_id: roomId,
          user_id: currentUser.user_id,
        }),
      });

      if (res.ok) {
        fetchParticipatingUsers();
        socket.emit("leave_room", {
          roomId,
          user: currentUser,
        });
        router.push("/community/list");
      }
    }
  };

  const kickUser = async (userId: number, userNickname: string) => {
    if (confirm(`${userId}님을 강제로 퇴장시키겠습니까?`)) {
      const res = await fetch(`/api/community/join`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatroom_id: roomId,
          user_id: userId,
          action: "kick", // 강퇴 액션
        }),
      });

      if (res.ok) {
        fetchParticipatingUsers();
        socket.emit("kick_room", {
          roomId,
          user: { userId: userId, nickname: userNickname },
        });
        router.push("/community/list");
      } else {
        alert("사용자 강퇴에 실패했습니다.");
      }
    }
  };

  return (
    <ChatContainer noticeHeight={noticeHeight}>
      <div className="top">
        <div className="back" onClick={() => router.back()}>
          <IoIosArrowBack />
        </div>
        <div className="chat__info">
          <Image
            src={chatroomInfo?.image_url || communityThumb}
            alt="Chatroom"
            width={50}
            height={50}
          />
          <div className="chatroom__name">
            <h4>{chatroomInfo?.name}</h4>
            <p>
              ({participatingUsers.length}/{chatroomInfo?.max_members})
            </p>
          </div>
        </div>
        <div
          className="menu__button"
          onClick={() => setShowUserList(!showUserList)}
        >
          ☰
        </div>
        <ChatRoomUserList
          showUserList={showUserList}
          participatingUsers={participatingUsers}
          isOwner={isOwner}
          chatroomInfo={chatroomInfo}
          handleLeaveRoom={handleLeaveRoom}
          setShowUserList={setShowUserList}
          kickUser={kickUser} // 강퇴 기능 추가
        />
      </div>
      {latestNotice && (
        <Notice
          id={roomId}
          title={latestNotice.title}
          content={latestNotice.content}
          createdAt={latestNotice.created_at}
          noticeRef={noticeRef} // 공지 Ref 전달
          onHeightChange={setNoticeHeight} // 높이 변화 핸들러 전달
        />
      )}
      <div className="messages">
        {messages.map((msg) => {
          const isCurrentUser = currentUser
            ? msg.user_id === currentUser.user_id
            : false;
          const isSystemMessage = msg.user_id === null;
          const messageUser = participatingUsers.find(
            (user) => user.user_id === msg.user_id
          );

          return (
            <MessageContainer
              key={msg.id}
              isCurrentUser={isCurrentUser}
              isSystemMessage={isSystemMessage}
            >
              {!isCurrentUser && messageUser && !isSystemMessage && (
                <Image
                  src={messageUser.profile_image}
                  // src={
                  //   messageUser.profile_image.startsWith("/uploads/")
                  //     ? messageUser.profile_image
                  //     : minion
                  // }
                  alt="프로필"
                  className="profile__image"
                  width={40}
                  height={40}
                />
              )}
              <div className="message__content">
                {!isCurrentUser && messageUser && !isSystemMessage && (
                  <div className="nickname">{messageUser.nickname}</div>
                )}
                <div className={isSystemMessage ? styles.systemMessage : ""}>
                  {msg.message}
                </div>
              </div>
            </MessageContainer>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="input__container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </ChatContainer>
  );
};

export default ChatRoom;
