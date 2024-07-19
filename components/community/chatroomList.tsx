// pages/community/chatroomList.tsx
import React from "react";
import Image from "next/image";
// import communityThumb from "../../../public/communityThumb.png";
import communityThumb from "../../public/communityThumb.png";

interface Chatroom {
  id: number;
  name: string;
  tags: string;
  image_url: string | null;
  max_members: number;
  owner_id: number;
}

interface Props {
  chatrooms: Chatroom[];
  joinedChatrooms: number[];
  chatroomMemberCounts: { [key: number]: number };
  handleChatroomClick: (chatroom: Chatroom) => void;
}

const ChatroomList: React.FC<Props> = ({
  chatrooms,
  joinedChatrooms,
  chatroomMemberCounts,
  handleChatroomClick,
}) => {
  return (
    <>
      {chatrooms.map((chatroom) => (
        <div
          className="list__info"
          key={chatroom.id}
          onClick={() => handleChatroomClick(chatroom)}
        >
          <div className="info__img">
            <Image
              src={chatroom.image_url || communityThumb}
              alt="thumb"
              width={100}
              height={100}
            />
          </div>
          <div className="info__text__wrapper">
            <div className="text__top">
              <div className="top__title">{chatroom.name}</div>
              <div className="top__num">
                {chatroomMemberCounts[chatroom.id] || 0}/{chatroom.max_members}
              </div>
            </div>
            {chatroom.tags && chatroom.tags.trim() !== "" && (
              <div className="text__bottom">
                <p>{chatroom.tags}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatroomList;
