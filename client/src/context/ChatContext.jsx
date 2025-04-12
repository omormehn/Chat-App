/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

import { api } from "../utils/api";


const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatDetails, setChatDetails] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chat, setChat] = useState(null);

  const [loading, setLoading] = useState(false);


  const getChat = async (chatId) => {
    try {
      const response = await api.get(`chats/get-chat/${chatId}`);
      setChatDetails({ ...response.data });
      setChat({
        ...response.data,
        messages: response.data.chat.messages || [],
      });
    } catch (error) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };
  const readChat = async (chatId) => {
    setLoading(true);
    try {
      const response = await api.put(`chats/read-chat/${chatId}`);
      setChatDetails({ ...response.data });
    } catch (error) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateLastMessage = async (chatId, content) => {
    try {
      await api.post(`chats/updateLastMessage/${chatId}`, {
        content
      });
      setChat((prev) => ({
        ...prev,
        lastMessage: content,
      }));
      setChatDetails((prev) => ({
        ...prev,
        lastMessage: content,
      }));
    } catch (error) {
      console.log('error in update last mesage', error)
    }
  }

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        chatDetails,
        getChat,
        readChat,
        loading,
        setChatDetails,
        selectedChatId,
        setSelectedChatId,
        chat,
        setChat,
        updateLastMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
