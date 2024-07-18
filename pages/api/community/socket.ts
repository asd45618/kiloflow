import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { Server as HTTPServer } from "http";
import { Socket } from "net";

interface SocketServer extends HTTPServer {
  io?: Server;
}

interface SocketWithIO extends Socket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log("Initializing socket.io server...");
    const io = new Server(res.socket.server as SocketServer, {
      path: "/api/community/socket",
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("New socket connection");

      socket.on("join_room", async ({ roomId, userId }) => {
        try {
          console.log(`User ${userId} joined room ${roomId}`);
          socket.join(roomId);
          const messages = await prisma.chatMessages.findMany({
            where: { chatroom_id: Number(roomId) },
            orderBy: { created_at: "asc" },
          });
          socket.emit("load_messages", messages);

          const user = await prisma.users.findUnique({
            where: { user_id: Number(userId) },
          });

          if (!user) {
            console.error(`User with ID ${userId} not found`);
            return;
          }

          // 기존 메시지가 있는지 확인
          const existingSystemMessage = await prisma.chatMessages.findFirst({
            where: {
              chatroom_id: Number(roomId),
              user_id: null,
              message: `${user.nickname}님이 입장했습니다.`,
            },
          });

          if (!existingSystemMessage) {
            const systemMessage = await prisma.chatMessages.create({
              data: {
                chatroom_id: Number(roomId),
                user_id: null,
                message: `${user.nickname}님이 입장했습니다.`,
              },
            });

            io.to(roomId).emit("new_message", systemMessage);
          }
        } catch (error) {
          console.error("Error in join_room:", error);
        }
      });

      socket.on("send_message", async ({ roomId, userId, message }) => {
        try {
          console.log(
            `New message from user ${userId} in room ${roomId}: ${message}`
          );
          const newMessage = await prisma.chatMessages.create({
            data: {
              chatroom_id: Number(roomId),
              user_id: Number(userId),
              message,
            },
          });
          io.to(roomId).emit("new_message", newMessage);
        } catch (error) {
          console.error("Error in send_message:", error);
        }
      });

      socket.on("leave_room", async ({ roomId, user }) => {
        try {
          console.log(`User ${user.user_id} left room ${roomId}`);
          socket.leave(roomId);

          const systemMessage = await prisma.chatMessages.create({
            data: {
              chatroom_id: Number(roomId),
              user_id: null,
              message: `${user.nickname}님이 나갔습니다.`,
            },
          });

          io.to(roomId).emit("new_message", systemMessage);

          // 사용자의 입장 메시지 삭제
          await prisma.chatMessages.deleteMany({
            where: {
              chatroom_id: Number(roomId),
              user_id: null,
              message: `${user.nickname}님이 입장했습니다.`,
            },
          });

          await prisma.chatroom_members.deleteMany({
            where: {
              chatroom_id: Number(roomId),
              user_id: Number(user.user_id),
            },
          });
        } catch (error) {
          console.error("Error in leave_room:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
    });
  }
  res.end();
};

export default SocketHandler;
