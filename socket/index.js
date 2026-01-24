import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

const io = new Server({
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

const userToSocket = {};

const getUser = (userId) => {
  return userToSocket[userId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) userToSocket[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userToSocket));

  // create a 'sendMessage' event to send a message to a specific user
  socket.on("sendMessage", ({ data, receiverId }) => {
    const receiver = getUser(receiverId);
    // we are emitting a 'receiveMessage' event to notify the receiver that a message was sent
    if (receiver) {
      io.to(receiver).emit("receiveMessage", data);
    }
  });

  socket.on("createChat", ({ chat, receiverId }) => {
    // find the receiver
    const receiver = getUser(receiverId);

    if (receiver) {
      io.to(receiver).emit("newChat", chat);
    }
  });

  socket.on("updateLastMessage", ({ chat, userId }) => {
    const user = getUser(userId);
    console.log("updLast message", user)

    if (user) {
      io.to(user).emit("updateMessage", chat);
    }
  });

  socket.on("updateStatus", (data) => {
    const { senderId, userId, ...rest } = data;
    const receiver = getUser(data.userId);
    const sender = getUser(data.senderId);

    if (sender) {
      io.to(sender).emit("markStatus", {
        ...rest,
        userId,
        status: data.status,
      });
    }
    if (receiver) {
      io.to(receiver).emit("markStatus", {
        ...rest,
        userId,
        status: data.status,
      });
    }
  });

  socket.on("disconnect", () => {
    delete userToSocket[userId];
    io.emit("getOnlineUsers", Object.keys(userToSocket));
  });
});

io.listen(PORT, () => console.log("Socket Io server running on: ", PORT));
