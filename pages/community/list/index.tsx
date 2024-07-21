import { Suspense, useState, useEffect } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import Dropdown from "react-bootstrap/Dropdown";
import Link from "next/link";
import { useRouter } from "next/router";
import { HiPlusSm } from "react-icons/hi";
import { IoChatbubble } from "react-icons/io5";
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
  const [searchType, setSearchType] = useState("제목");
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

  const fetchChatrooms = async () => {
    const res = await fetch(
      `/api/community?search=${search}&type=${searchType}`
    );
    const data: Chatroom[] = await res.json();
    setChatrooms(data);
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
          currentUser={currentUser}
          search={search}
          searchType={searchType}
        />
      </Suspense>
    </CommunityListWrapper>
  );
};

export default CommunityList;
