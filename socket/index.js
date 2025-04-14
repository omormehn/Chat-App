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
let users = [];

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

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("onlineUsers", onlineUser);
  });

  // create a 'sendMessage' event to send a message to a specific user
  socket.on("sendMessage", ({data, receiverId}) => {
    const receiver = getUser(receiverId);
    // we are emitting a 'receiveMessage' event to notify the receiver that a message was sent
    if (receiver) {
      io.to(receiver.socketId).emit("receiveMessage", data)
    }
  })

  socket.on("createChat", ({chat, receiverId}) => {
    // find the receiver 
    const receiver = getUser(receiverId);

    if(receiver) {
      io.to(receiver.socketId).emit("newChat", chat);
    }
  });

  socket.on("updateLastMessage", ({chat, userId}) => {
    const sender = getUser(userId);
    if(sender) {
      io.to(sender.socketId).emit("updateMessage", chat);
    }
  })

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("onlineUsers", onlineUser);
  });
});

io.listen(PORT, () => console.log("Socket Io server running on: ", PORT));
