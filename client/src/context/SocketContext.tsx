/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { SocketContextProps } from "../../types/types";

const SocketContext = createContext<SocketContextProps | null>(null);

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  // eslint-disable-next-line no-unused-vars
  const [onlineUsers, setOnlineUsers] = useState(null);
  const { user } = useAuth();
  const socketUrl = import.meta.env.VITE_API_SOCKET_BASE_URL;

  useEffect(() => {
    try {
      const newSocket = io(socketUrl, {
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

export const getSocket = (): SocketContextProps => {
  const socket = useContext(SocketContext);
  if (!socket) {
    console.log("Must be within a provider")
  }
  return socket!;
}

export default SocketContext;
