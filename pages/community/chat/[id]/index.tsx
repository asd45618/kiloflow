// pages/community/chat/[id]/index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import socket from "../../../../lib/socket"; // 소켓 초기화 파일 import

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  .messages {
    flex: 1;
    overflow-y: scroll;
  }
  .input-container {
    display: flex;
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
      background-color: #007bff;
      color: #fff;
    }
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

const ChatRoom = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { id: roomId } = router.query;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

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

      return () => {
        socket.off("load_messages");
        socket.off("new_message");
        socket.disconnect(); // 컴포넌트 언마운트 시 소켓 연결 해제
      };
    }
  }, [roomId, currentUser]);

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

  return (
    <ChatContainer>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.user_id}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="input-container">
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
