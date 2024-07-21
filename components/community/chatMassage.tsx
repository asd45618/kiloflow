import React from "react";
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
`;

interface Message {
  id: number;
  user_id: number | null;
  message: string;
  created_at: string;
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
        <div>{message.message}</div>
        {!isSystemMessage && (
          <div className="message__time">{formatTime(message.created_at)}</div>
        )}
      </div>
    </MessageContainer>
  );
};

export default ChatMessage;
