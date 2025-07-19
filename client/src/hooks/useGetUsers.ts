import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { handleAxiosError } from "../utils/handleAxiosError";
import { User } from "../../types/types";

const useGetUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = async () => {
    try {
      const response = await api.get("/users/");
      setUsers(response.data);
    } catch (error) {
      handleAxiosError(error, "get users")
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  return { users };
};
export default useGetUsers;
