import { Server } from "socket.io";
import dotenv from "dotenv";
import { use } from "react";

dotenv.config();

const PORT = process.env.PORT;

const io = new Server({
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

let onlineUser = [];
let users = [];
const userToSocket = {};

const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("conn", socket.id)
  const userId = socket.handshake.query.userId;

  if (userId) userToSocket[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userToSocket));

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("onlineUsers", onlineUser);
  });

  // create a 'sendMessage' event to send a message to a specific user
  socket.on("sendMessage", ({ data, receiverId }) => {
    const receiver = getUser(receiverId);
    // we are emitting a 'receiveMessage' event to notify the receiver that a message was sent
    if (receiver) {
      io.to(receiver.socketId).emit("receiveMessage", data);
    }
  });

  socket.on("createChat", ({ chat, receiverId }) => {
    // find the receiver
    const receiver = getUser(receiverId);

    if (receiver) {
      io.to(receiver.socketId).emit("newChat", chat);
    }
  });

  socket.on("updateLastMessage", ({ chat, userId }) => {
    const user = getUser(userId);

    if (user) {
      io.to(user.socketId).emit("updateMessage", chat);
    }
  });

  socket.on("updateStatus", (data) => {
    const receiver = getUser(data.userId);
    const sender = getUser(data.senderId);
    console.log("re", receiver);
    console.log("se", sender);

    if (sender) io.to(sender.socketId).emit("markStatus", data);
    if (receiver) io.to(receiver.socketId).emit("markStatus", data);
  });

  socket.on("disconnect", () => {
    delete userToSocket[userId];
    io.emit("getOnlineUsers", Object.keys(userToSocket));
  });
});

io.listen(PORT, () => console.log("Socket Io server running on: ", PORT));
