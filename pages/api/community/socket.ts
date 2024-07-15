// pages/api/community/socket.ts
import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Server as HTTPServer } from "http";
import { Socket } from "net";

const prisma = new PrismaClient();

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
  console.log("Initializing socket.io server...");
  const io = new Server(res.socket.server as SocketServer, {
    path: "/api/community/socket",
  });
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("New socket connection");

    socket.on("join_room", async ({ roomId, userId }) => {
      console.log(`User ${userId} joined room ${roomId}`);
      socket.join(roomId);
      const messages = await prisma.chatMessages.findMany({
        where: { chatroom_id: Number(roomId) },
        orderBy: { created_at: "asc" },
      });
      socket.emit("load_messages", messages);

      io.to(roomId).emit("user_joined", { userId, roomId });
    });

    socket.on("send_message", async ({ roomId, userId, message }) => {
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
    });
  });
};

export default SocketHandler;
