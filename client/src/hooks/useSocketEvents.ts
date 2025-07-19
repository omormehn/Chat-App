import { useContext, useEffect } from "react";
import AuthContext, { useAuth } from "../context/AuthContext";
import { Socket } from 'socket.io-client';
import { SocketEventHandlers } from '../../types/types';



const useSocketEvents = (socket: Socket | null, { onReceiveMessage, onNewChat, onUpdateMessage, markAsRead, onUpdateStatus } : SocketEventHandlers) => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (!socket || !user) return;
    if (onReceiveMessage) {
      socket.on("receiveMessage", onReceiveMessage);
    }
    if (onNewChat) {
      socket.on("newChat", onNewChat);
    }
    if (onUpdateMessage) {
      socket.on("updateMessage", onUpdateMessage);
    }
    if (markAsRead) {
      socket.on("markAsRead", markAsRead);
    }
    if (onUpdateStatus) {
      socket.on("markStatus", onUpdateStatus);
    }

    return () => {
      if (onReceiveMessage) {
        socket.off("receiveMessage", onReceiveMessage);
      }
      if (onNewChat) {
        socket.off("newChat", onNewChat);
      }
      if (onUpdateMessage) {
        socket.off("updateMessage", onUpdateMessage);
      }
      if (onUpdateStatus) {
        socket.off("markStatus", onUpdateStatus);
      }
      if (markAsRead) {
        socket.off("markAsRead", markAsRead);
      }
    };
  }, [
    socket,
    onReceiveMessage,
    onNewChat,
    onUpdateMessage,
    markAsRead,
    onUpdateStatus,
    user
  ]);
};


export default useSocketEvents;