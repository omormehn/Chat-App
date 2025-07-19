import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";

export const useSocketEvents = (
  socket,
  { onReceiveMessage, onNewChat, onUpdateMessage, markAsRead, onUpdateStatus }
) => {
  const { user } = useContext(AuthContext);
  
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
