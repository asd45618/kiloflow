import React, { useEffect, useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import unknownUser from "../../public/unknownUser.jpg";

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
    margin-left: ${({ isCurrentUser }) => (isCurrentUser ? "0" : "5px")};
    margin-right: ${({ isCurrentUser }) => (isCurrentUser ? "5px" : "0")};
    word-break: break-word;
    text-align: ${({ isSystemMessage }) =>
      isSystemMessage ? "center" : "left"};
    font-weight: ${({ isSystemMessage }) =>
      isSystemMessage ? "bold" : "normal"};
    position: relative;
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
  .message__time {
    text-align: center;
    min-width: 70px;
    font-size: 12px;
    color: gray;
    position: absolute;
    bottom: 0;
    right: ${({ isCurrentUser }) => (isCurrentUser ? "100%" : "auto")};
    left: ${({ isCurrentUser }) => (isCurrentUser ? "auto" : "100%")};
  }
  .image__content {
    width: 100%;
    img {
      max-width: 100%;
      border-radius: 10px;
    }
  }
`;

interface Message {
  id: number;
  user_id: number | null;
  message: string | null;
  created_at: string;
  image_id: number | null;
}

interface User {
  user_id: number;
  nickname: string;
  profile_image: string;
}

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  isSystemMessage: boolean;
  messageUser?: User;
  formatTime: (time: string) => string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isCurrentUser,
  isSystemMessage,
  messageUser,
  formatTime,
}) => {
  const [imagePath, setImagePath] = useState<string | null>(null);

  useEffect(() => {
    if (message.image_id) {
      fetch(`/api/community/upload?id=${message.image_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.image) {
            setImagePath(data.image.path);
          }
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
    }
  }, [message.image_id]);

  return (
    <MessageContainer
      isCurrentUser={isCurrentUser}
      isSystemMessage={isSystemMessage}
    >
      {!isCurrentUser && !isSystemMessage && (
        <Image
          src={messageUser ? messageUser.profile_image : unknownUser}
          alt="프로필"
          className="profile__image"
          width={40}
          height={40}
        />
      )}
      <div className="message__content">
        {!isCurrentUser && !isSystemMessage && (
          <div className="nickname">
            {messageUser ? messageUser.nickname : "알 수 없는 사용자"}
          </div>
        )}
        {message.message && <div>{message.message}</div>}
        {imagePath && (
          <div className="image__content">
            <Image
              src={imagePath}
              alt="Uploaded file"
              width={100}
              height={100}
            />
          </div>
        )}
        {!isSystemMessage && (
          <div className="message__time">{formatTime(message.created_at)}</div>
        )}
      </div>
    </MessageContainer>
  );
};

export default ChatMessage;
