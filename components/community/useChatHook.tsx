import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import socket from "../../lib/socket";

interface Message {
  id: number;
  user_id: number | null;
  message: string;
  created_at: string;
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

interface Notice {
  title: string;
  content: string;
  created_at: string;
}

const useChatRoom = () => {
  const router = useRouter();
  const { id: roomIdString } = router.query;
  const roomId = parseInt(roomIdString as string, 10);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [chatroomInfo, setChatroomInfo] = useState<Chatroom | null>(null);
  const [participatingUsers, setParticipatingUsers] = useState<User[]>([]);
  const [latestNotice, setLatestNotice] = useState<Notice | null>(null);
  const [showUserList, setShowUserList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const noticeRef = useRef<HTMLDivElement | null>(null);
  const [noticeHeight, setNoticeHeight] = useState(0);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
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
      socket.connect();
      socket.emit("join_room", { roomId, userId: currentUser.user_id });

      socket.on("load_messages", (loadedMessages: Message[]) => {
        setMessages(loadedMessages);
      });

      socket.on("new_message", (newMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      socket.on("system_message", (systemMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, systemMessage]);
      });

      checkIfOwner();
      fetchChatroomInfo();
      fetchParticipatingUsers();
      fetchLatestNotice();

      return () => {
        socket.off("load_messages");
        socket.off("new_message");
        socket.off("system_message");
        socket.disconnect();
      };
    }
  }, [roomId, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (noticeRef.current) {
      setNoticeHeight(noticeRef.current.clientHeight);
    }
  }, [latestNotice, noticeHeight]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  const fetchLatestNotice = async () => {
    const res = await fetch(`/api/community/latest-notice?roomId=${roomId}`);
    const data = await res.json();
    if (data) {
      setLatestNotice(data);
    } else {
      setLatestNotice(null);
    }
  };

  const sendMessage = () => {
    if (roomId && currentUser) {
      socket.emit("send_message", {
        roomId,
        userId: currentUser.user_id,
        message,
      });
      setMessage("");
    }
  };

  const handleLeaveRoom = async () => {
    if (!currentUser) {
      alert("유효하지 않은 사용자입니다.");
      return;
    }

    if (confirm("채팅방을 나가시겠습니까?")) {
      const res = await fetch(`/api/community/join`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatroom_id: roomId,
          user_id: currentUser.user_id,
        }),
      });

      if (res.ok) {
        fetchParticipatingUsers();
        socket.emit("leave_room", {
          roomId,
          user: currentUser,
        });
        router.push("/community/list");
      }
    }
  };

  const kickUser = async (userId: number, userNickname: string) => {
    if (confirm(`${userId}님을 강제로 퇴장시키겠습니까?`)) {
      const res = await fetch(`/api/community/join`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatroom_id: roomId,
          user_id: userId,
          action: "kick",
        }),
      });

      if (res.ok) {
        fetchParticipatingUsers();
        socket.emit("kick_room", {
          roomId,
          user: { userId: userId, nickname: userNickname },
        });
        router.push("/community/list");
      } else {
        alert("사용자 강퇴에 실패했습니다.");
      }
    }
  };

  return {
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
  };
};

export default useChatRoom;
