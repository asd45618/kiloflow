import { useState, useEffect } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import Dropdown from "react-bootstrap/Dropdown";
import CommunityModal from "../../../components/community/communityModal";
import ChatroomForm from "../../../components/community/chatroomForm";
import Link from "next/link";

const CommunityListWrapper = styled.div`
  position: relative;
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
  .list__info {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #aeaeae;
    padding: 20px 0;
    .info__img {
      flex: 0 0 15%;
      margin-right: 5%;
      img {
        width: 100%;
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
}

const CommunityList = () => {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedChatroom, setSelectedChatroom] = useState<Chatroom | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);
  const [searchType, setSearchType] = useState("제목");

  useEffect(() => {
    fetchChatrooms();
  }, [search]);

  const fetchChatrooms = async () => {
    const res = await fetch(`/api/community?search=${search}`);
    const data: Chatroom[] = await res.json();
    setChatrooms(data);
  };

  const handleJoin = async (chatroom: Chatroom) => {
    const user_id = 1; // 현재 사용자 ID (로그인 구현 필요)
    const res = await fetch("/api/community/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatroom_id: chatroom.id, user_id }),
    });

    if (res.ok) {
      setShowModal(false);
      alert("채팅방에 참가하였습니다.");
    }
  };

  const handleCreateChatroom = async (formData: FormData) => {
    const res = await fetch("/api/community", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      fetchChatrooms();
      setShowForm(false);
      alert("채팅방이 생성되었습니다.");
    }
  };

  return (
    <CommunityListWrapper>
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
      {chatrooms.map((chatroom) => (
        <div
          className="list__info"
          key={chatroom.id}
          onClick={() => {
            setSelectedChatroom(chatroom);
            setShowModal(true);
          }}
        >
          <div className="info__img">
            <img
              src={chatroom.image_url || "../../communityThumb.png"}
              alt="thumb"
            />
          </div>
          <div className="info__text__wrapper">
            <div className="text__top">
              <div className="top__title">{chatroom.name}</div>
              <div className="top__num">34/100</div>
            </div>
            <div className="text__bottom">
              <p>{chatroom.tags}</p>
            </div>
          </div>
        </div>
      ))}
      {showModal && (
        <CommunityModal
          chatroom={selectedChatroom}
          onHide={() => setShowModal(false)}
          onJoin={handleJoin}
        />
      )}
      <div className="create-chatroom">
        <button onClick={() => setShowForm(true)}>채팅방 생성하기1</button>
      </div>
      <Link href="/community/create">
        <div className="create-chatroom">
          <button>채팅방 생성하기</button>
        </div>
      </Link>
      {showForm && (
        <ChatroomForm
          onSubmit={handleCreateChatroom}
          onClose={() => setShowForm(false)}
        />
      )}
    </CommunityListWrapper>
  );
};

export default CommunityList;
