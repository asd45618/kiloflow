import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ChatroomList from "../community/chatroomList";

interface Chatroom {
  id: number;
  name: string;
  tags: string;
  image_url: string | null;
  max_members: number;
  owner_id: number;
}

export default function ParticipatingChat({
  currentUserInfo,
}: {
  currentUserInfo: any;
}) {
  const router = useRouter();
  const [joinedChatrooms, setJoinedChatrooms] = useState<Chatroom[]>([]);

  useEffect(() => {
    if (!currentUserInfo) {
      router.push("/auth/login");
    } else {
      console.log("joindedchatroom", joinedChatrooms);
      fetchJoinedChatrooms();
    }
  }, [currentUserInfo]);

  const fetchJoinedChatrooms = async () => {
    const res = await fetch(
      `/api/community/joined?currentUser=${currentUserInfo.user_id}`
    );
    const data: { chatroom_id: number }[] = await res.json();
    const chatroomIds = data.map((item) => item.chatroom_id);

    const chatroomRes = await fetch(
      `/api/community?ids=${chatroomIds.join(",")}`
    );
    const chatrooms: Chatroom[] = await chatroomRes.json();
    setJoinedChatrooms(chatrooms);
  };

  if (!currentUserInfo) return <div>Loading...</div>;

  return (
    <div>
      <ChatroomList chatrooms={joinedChatrooms} currentUser={currentUserInfo} />
    </div>
  );
}
