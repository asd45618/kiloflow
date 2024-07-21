import { useState, useEffect } from "react";
import React from "react";
import Image from "next/image";
import communityThumb from "../../public/communityThumb.png";
import { useRouter } from "next/router";
import CommunityModal from "../community/communityModal";
import styled from "styled-components";

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
  currentUser: any;
  search?: string;
  searchType?: string;
}

const ChatroomListWrapper = styled.div`
  padding: 0 20px;
  .list__info {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #aeaeae;
    padding: 20px 0;
    .info__img {
      flex: 0 0 15%;
      margin-right: 5%;
      position: relative;
      img {
        border-radius: 50%;
        border: 1px solid #ddd;
        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
        object-fit: cover;
      }
    }
    .info__text__wrapper {
      flex: 0 0 80%;
      .text__top {
        display: flex;
        justify-content: space-between;
      }
      .text__bottom {
        p {
          font-size: 12px;
          color: #979797;
        }
      }
    }
  }
`;

const ChatroomList: React.FC<Props> = ({
  chatrooms,
  currentUser,
  search,
  searchType,
}) => {
  const [joinedChatrooms, setJoinedChatrooms] = useState<number[]>([]);
  const [chatroomMemberCounts, setChatroomMemberCounts] = useState<{
    [key: number]: number;
  }>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedChatroom, setSelectedChatroom] = useState<Chatroom | null>(
    null
  );
  const [filteredChatrooms, setFilteredChatrooms] =
    useState<Chatroom[]>(chatrooms);
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      fetchJoinedChatrooms();
    }
  }, [currentUser]);

  useEffect(() => {
    if (chatrooms.length > 0) {
      fetchChatroomMemberCounts();
    }
  }, [chatrooms]);

  useEffect(() => {
    if (search && searchType) {
      const filtered = chatrooms.filter((chatroom) => {
        const target = searchType === "태그" ? chatroom.tags : chatroom.name;
        return target.includes(search);
      });
      setFilteredChatrooms(filtered);
    } else {
      setFilteredChatrooms(chatrooms);
    }
  }, [search, searchType, chatrooms]);

  const fetchJoinedChatrooms = async () => {
    const res = await fetch(
      `/api/community/joined?currentUser=${currentUser.user_id}`
    );
    const data: { chatroom_id: number }[] = await res.json();
    setJoinedChatrooms(data.map((item) => item.chatroom_id));
  };

  const fetchChatroomMemberCounts = async () => {
    const counts = await Promise.all(
      chatrooms.map(async (chatroom) => {
        const res = await fetch(
          `/api/community/members-count?chatroomId=${chatroom.id}`
        );
        const data = await res.json();
        return { chatroomId: chatroom.id, count: data.count };
      })
    );
    const countsMap = counts.reduce(
      (acc, { chatroomId, count }) => ({ ...acc, [chatroomId]: count }),
      {}
    );
    setChatroomMemberCounts(countsMap);
  };

  const handleChatroomClick = (chatroom: Chatroom) => {
    if (joinedChatrooms.includes(chatroom.id)) {
      router.push(`/community/chat/${chatroom.id}`);
    } else {
      setSelectedChatroom(chatroom);
      setShowModal(true);
    }
  };

  return (
    <ChatroomListWrapper>
      {filteredChatrooms.map((chatroom) => (
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
      {showModal && selectedChatroom && (
        <CommunityModal
          chatroom={selectedChatroom}
          currentUser={currentUser}
          onHide={() => setShowModal(false)}
        />
      )}
    </ChatroomListWrapper>
  );
};

export default ChatroomList;
