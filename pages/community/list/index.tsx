// pages/community/list/index.tsx
import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import Dropdown from "react-bootstrap/Dropdown";
import CommunityModal from "../../../components/community/communityModal";
import Link from "next/link";
import { useRouter } from "next/router";
import communityThumb from "../../../public/communityThumb.png";
import { HiPlusSm } from "react-icons/hi";
import { IoChatbubble } from "react-icons/io5";
import { TbH1 } from "react-icons/tb";
import dynamic from "next/dynamic";

const ChatroomList = dynamic(
  () => import("../../../components/community/chatroomList"),
  { suspense: true }
);

const CommunityListWrapper = styled.div`
  position: relative;
  .top {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .search {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      margin: 20px 0;
      .dropdown-toggle {
        background-color: inherit;
        color: #000;
        border: none;
      }
      .dropdown-menu {
        min-width: 0;
      }
      input {
        border-bottom: 1px solid #000;
        outline: none;
        background-color: inherit;
      }
      svg {
        cursor: pointer;
      }
    }
    .create__chatroom {
      align-items: center;
      display: flex;
      font-size: 24px;
    }
  }
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
  .create-chatroom {
    text-align: center;
    margin: 20px 0;
    button {
      padding: 10px 20px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  }
`;

interface Chatroom {
  id: number;
  name: string;
  tags: string;
  image_url: string | null;
  max_members: number;
  owner_id: number;
}

const CommunityList = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedChatroom, setSelectedChatroom] = useState<Chatroom | null>(
    null
  );
  const [searchType, setSearchType] = useState("제목");
  const [joinedChatrooms, setJoinedChatrooms] = useState<number[]>([]);
  const [chatroomMemberCounts, setChatroomMemberCounts] = useState<{
    [key: number]: number;
  }>({});
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
    fetchChatrooms();
  }, [search, searchType]);

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

  const fetchChatrooms = async () => {
    const res = await fetch(
      `/api/community?search=${search}&type=${searchType}`
    );
    const data: Chatroom[] = await res.json();
    setChatrooms(data);
  };

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
    <CommunityListWrapper>
      <div className="top">
        <div className="search">
          <Dropdown onClick={(e) => e.preventDefault()}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {searchType}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSearchType("제목")}>
                제목
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType("태그")}>
                태그
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>

        <Link href="/community/create">
          <div className="create__chatroom">
            <HiPlusSm />
            <IoChatbubble />
          </div>
        </Link>
      </div>
      <Suspense fallback={<h1>Loading chatrooms...</h1>}>
        <ChatroomList
          chatrooms={chatrooms}
          joinedChatrooms={joinedChatrooms}
          chatroomMemberCounts={chatroomMemberCounts}
          handleChatroomClick={handleChatroomClick}
        />
      </Suspense>
      {showModal && (
        <CommunityModal
          chatroom={selectedChatroom}
          currentUser={currentUser}
          onHide={() => setShowModal(false)}
        />
      )}
    </CommunityListWrapper>
  );
};

export default CommunityList;
