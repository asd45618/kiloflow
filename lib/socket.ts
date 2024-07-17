// lib/socket.ts
import { io } from "socket.io-client";

const socket = io({
  path: "/api/community/socket",
  autoConnect: false, // 자동 연결을 비활성화합니다.
});

socket.on("connect", () => {
  console.log("Socket connected");
});

export default socket;
