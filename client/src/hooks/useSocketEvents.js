import { useEffect } from "react";

export const useSocketEvents = (
  socket,
  { onReceiveMessage, onNewChat, onUpdateMessage, markAsRead }
) => {
  useEffect(() => {
    if (!socket) return;

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
      if (markAsRead) {
        socket.off("markAsRead", markAsRead);
      }
    };
  }, [socket, onReceiveMessage, onNewChat, onUpdateMessage, markAsRead]);
};
