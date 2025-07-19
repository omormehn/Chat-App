import { useState, useEffect } from "react";

import { api } from "../utils/api";
import { Chat } from "../../types/types";
import { handleAxiosError } from "../utils/handleAxiosError";

const useGetChats = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [chats, setChats] = useState<Chat[]>([]);



  const getChats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("chats/get-chats");
      setChats(response.data.chats);
      return response.data.chats;
    } catch (error: any) {
      setError(error);
      handleAxiosError(error, "get chats in get chats hook")
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    getChats();
  }, []);
  return {
    loading,
    error,
    chats,
    setChats, getChats
  };
};

export default useGetChats;
