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
      console.log(chat.chat.id);
    } catch (error) {
      console.log(error);
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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
