

import { createContext, useContext, useState } from "react";

import { api } from "../utils/api";
import { Chat, ChatContextProps } from "../../types/types";
import { AxiosError } from "axios";
import { handleAxiosError } from "../utils/handleAxiosError";


const ChatContext = createContext<ChatContextProps | null>(null);


export const ChatContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chatDetails, setChatDetails] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);

  const [loading, setLoading] = useState<boolean>(false);


  const getChat = async (chatId: string) => {
    try {
      const response = await api.get(`chats/get-chat/${chatId}`);
      setChatDetails({ ...response.data });
      setChat({
        ...response.data.chat,
        messages: response.data.chat.messages || [],
      });
    } catch (error) {
      handleAxiosError(error, "get chat")

    } finally {
      setLoading(false);
    }
  };
  

  const readChat = async (chatId: string) => {
    setLoading(true);
    try {
      const response = await api.put(`chats/read-chat/${chatId}`);
      setChatDetails({ ...response.data });
    } catch (error) {
      handleAxiosError(error, "read chat")
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

export const chatContext = (): ChatContextProps => {
  const chat = useContext(ChatContext);
  if (!chat) {
    console.log("Must be within a provider")
  }
  return chat!;
}

export default ChatContext;
