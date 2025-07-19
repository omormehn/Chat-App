/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import AuthContext from "./AuthContext";

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [onlineUsers, setOnlineUsers] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    try {
      const newSocket = io(import.meta.env.VITE_API_SOCKET_BASE_URL, {
        query: {
          userId: user?.id,
        },
      });
      // console.log(newSocket)

      newSocket.connect();

      setSocket(newSocket);
      return () => {
        newSocket.disconnect();
      };
    } catch (error) {
      console.log("error", error);
    }
  }, [user]);

  useEffect(() => {
    if (user && socket) {
      socket.emit("newUser", user.id);
      socket.on("getOnlineUsers", (onlineUsers) => {
        setOnlineUsers(onlineUsers);
      });
    }
  }, [user, socket]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
