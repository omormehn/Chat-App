import { useEffect, useState } from "react";
import { api } from "../utils/api";

const useGetUsers = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await api.get("/users/");
      setUsers(response.data);
    } catch (error) {
      throw new Error(error);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  return { users };
};
export default useGetUsers;
