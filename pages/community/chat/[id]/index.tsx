import React, { useState, KeyboardEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import communityThumb from "../../../../public/communityThumb.png";
import styled from "styled-components";
import useChatHook from "../../../../components/community/useChatHook";
import ChatRoomUserList from "../../../../components/community/chatroomUserList";
import Notice from "../../../../components/community/notice";
import ChatMessage from "../../../../components/community/chatMassage";

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

      .chatroom__details {
        display: flex;
        align-items: center;

        h4 {
          margin: 0;
        }

        p {
          margin: 0;
        }
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

    .date_message {
      text-align: center;
      font-size: 14px;
      color: gray;
      margin: 10px 0;
    }
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

    .file-input {
      display: none;
    }

    .upload-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      border: none;
      border-radius: 5px;
      background: #ccc;
      color: #fff;
      cursor: pointer;
      margin-right: 10px;

      &:hover {
        background: gray;
      }
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

const ChatRoom = () => {
  const router = useRouter();
  const {
    currentUser,
    message,
    setMessage,
    messages,
    isOwner,
    chatroomInfo,
    participatingUsers,
    showUserList,
    setShowUserList,
    latestNotice,
    messagesEndRef,
    noticeRef,
    noticeHeight,
    setNoticeHeight,
    sendMessage,
    handleLeaveRoom,
    kickUser,
    roomId,
    socket,
  } = useChatHook();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formatTime = (time: string) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "오후" : "오전";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${period} ${formattedHours}:${formattedMinutes}`;
  };

  const formatDate = (time: string) => {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}년 ${month}월 ${day}일`;
  };

  const renderMessages = () => {
    let lastDate = "";

    return messages.map((msg) => {
      const isCurrentUser = currentUser
        ? msg.user_id === currentUser.user_id
        : false;
      const isSystemMessage = msg.user_id === null;
      const messageUser = participatingUsers.find(
        (user) => user.user_id === msg.user_id
      );

      const messageDate = formatDate(msg.created_at);
      const showDateMessage = messageDate !== lastDate;
      if (showDateMessage) lastDate = messageDate;

      return (
        <React.Fragment key={msg.id}>
          {showDateMessage && <div className="date_message">{messageDate}</div>}
          <ChatMessage
            message={msg}
            isCurrentUser={isCurrentUser}
            isSystemMessage={isSystemMessage}
            messageUser={messageUser}
            formatTime={formatTime}
          />
        </React.Fragment>
      );
    });
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);

      const formData = new FormData();
      formData.append("file", event.target.files[0]);

      const res = await fetch("/api/community/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        console.log("File uploaded successfully:", data);
        // 파일 URL을 메시지로 전송
        sendMessageWithFile(data.file.id);
        setSelectedFile(null);
      } else {
        console.error("File upload failed");
      }
    }
  };

  const sendMessageWithFile = (fileId: number) => {
    if (roomId && currentUser) {
      socket.emit("send_message", {
        roomId,
        userId: currentUser.user_id,
        image_id: fileId,
      });
      setMessage("");
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
          <div className="chatroom__details">
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
          kickUser={kickUser}
        />
      </div>
      {chatroomInfo && latestNotice && (
        <Notice
          id={chatroomInfo.id}
          title={latestNotice.title}
          content={latestNotice.content}
          createdAt={latestNotice.created_at}
          noticeRef={noticeRef}
          onHeightChange={setNoticeHeight}
        />
      )}
      <div className="messages">
        {renderMessages()}
        <div ref={messagesEndRef} />
      </div>
      <div className="input__container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <input
          type="file"
          className="file-input"
          id="file-input"
          onChange={handleFileChange}
        />
        <label className="upload-button" htmlFor="file-input">
          <AiOutlinePlus />
        </label>
        <button onClick={sendMessage}>Send</button>
      </div>
    </ChatContainer>
  );
};

export default ChatRoom;
