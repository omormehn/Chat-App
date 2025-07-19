import { useState, useEffect } from "react";

import { api } from "../utils/api";

const useGetChats = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);



  const getChats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("chats/get-chats");
      setChats(response.data.chats);
      return response.data.chats;
    } catch (error) {
      setError(error);
      throw new Error(error);
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
