import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

const io = new Server({
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
  console.log(onlineUser);
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};


const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};


io.on("connection", (socket) => {
  console.log("a new client connected");

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("onlineUsers", onlineUser);
  });

  socket.on("sendMessage", ({data, receiverId}) => {
    console.log("Message sent", data);
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("receiveMessage", data)
    }

  })

  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
    removeUser(socket.id);
    io.emit("onlineUsers", onlineUser);
  });
});

io.listen(PORT, () => console.log("Socket Io server running on: ", PORT));