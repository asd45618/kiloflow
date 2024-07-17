import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import communityThumb from "../../../../public/communityThumb.png";
import styles from "../../../../styles/components.module.css";
import styled from "styled-components";
import socket from "../../../../lib/socket"; // 소켓 초기화 파일 import
import { IoIosArrowBack } from "react-icons/io";
import Button from "react-bootstrap/esm/Button";

interface UserListProps {
  showUserList: boolean;
}

const ChatContainer = styled.div`
  overflow-y: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
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
    flex: 1;
    overflow-y: scroll;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
  .input__container {
    display: flex;
    padding: 10px;
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
  // .admin__actions {
  //   display: flex;
  //   justify-content: space-between;
  //   button {
  //     padding: 10px 20px;
  //     border: none;
  //     border-radius: 5px;
  //     cursor: pointer;
  //   }
  //   .danger {
  //     background-color: #ff0000;
  //     color: #fff;
  //   }
  //   .primary {
  //     background-color: #007bff;
  //     color: #fff;
  //   }
  // }
`;

const UserList = styled.div<UserListProps>`
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
      }
    }
    .admin__actions {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      button {
        margin: 2px;
      }
    }
  }
`;

const MessageContainer = styled.div<{ isCurrentUser: boolean }>`
  display: flex;
  flex-direction: ${({ isCurrentUser }) =>
    isCurrentUser ? "row-reverse" : "row"};
  align-items: flex-end;
  margin-bottom: 10px;
  .message__content {
    max-width: 60%;
    background-color: ${({ isCurrentUser }) =>
      isCurrentUser ? "#dcf8c6" : "#fff"};
    // border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    margin-left: ${({ isCurrentUser }) => (isCurrentUser ? "0" : "10px")};
    margin-right: ${({ isCurrentUser }) => (isCurrentUser ? "10px" : "0")};
    word-break: break-word;
  }
  .profile__image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .nickname {
    margin-bottom: 5px;
    font-weight: bold;
  }
`;

interface Message {
  id: number;
  user_id: number;
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

const ChatRoom = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { id: roomId } = router.query;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [chatroomInfo, setChatroomInfo] = useState<Chatroom | null>(null);
  const [participatingUsers, setParticipatingUsers] = useState<User[]>([]);
  const [showUserList, setShowUserList] = useState(false);

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

      checkIfOwner();
      fetchChatroomInfo();
      fetchParticipatingUsers();

      return () => {
        socket.off("load_messages");
        socket.off("new_message");
        socket.disconnect(); // 컴포넌트 언마운트 시 소켓 연결 해제
      };
    }
  }, [roomId, currentUser]);

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

  const handleDeleteRoom = async () => {
    const res = await fetch(`/api/community/delete?roomId=${roomId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("채팅방이 삭제되었습니다.");
      router.push("/community/list");
    }
  };

  return (
    <ChatContainer>
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
        <UserList showUserList={showUserList}>
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
                  {user.user_id === chatroomInfo?.owner_id && (
                    <span>(방장)</span>
                  )}
                </div>
              ))}
            </div>
            {isOwner ? (
              <div className="admin__actions">
                <button
                  className={styles.button__big}
                  onClick={() => alert("공지 기능 미구현")}
                >
                  공지
                </button>

                <button
                  className={styles.button__big}
                  onClick={handleDeleteRoom}
                >
                  방 삭제
                </button>
              </div>
            ) : (
              <div className="admin__actions">
                <button className={styles.button__big}>채팅방나가기</button>
              </div>
            )}
          </div>
        </UserList>
      </div>

      <div className="messages">
        {messages.map((msg) => {
          const isCurrentUser = currentUser
            ? msg.user_id === currentUser.user_id
            : false;
          const messageUser = participatingUsers.find(
            (user) => user.user_id === msg.user_id
          );
          return (
            <MessageContainer key={msg.id} isCurrentUser={isCurrentUser}>
              {!isCurrentUser && messageUser && (
                <Image
                  src={messageUser.profile_image}
                  alt="프로필"
                  className="profile__image"
                  width={40}
                  height={40}
                />
              )}
              <div className="message__content">
                {!isCurrentUser && messageUser && (
                  <div className="nickname">
                    {messageUser.nickname}
                    <p>{messageUser.profile_image}</p>
                  </div>
                )}
                <div>{msg.message}</div>
              </div>
            </MessageContainer>
          );
        })}
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
