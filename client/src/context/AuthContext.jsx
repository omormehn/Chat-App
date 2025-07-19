import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (data) => {
    setUser(data);
  };

  useEffect(() => {
    const validateToken = async () => {
      try {
        const { data } = await api.get("/auth/validate", {
          withCredentials: true,
        });
        if (!data) return;
        const id = data.user.id;
        const userResponse = await api.get(`/user/${id}`, {
          withCredentials: true,
        });
        setUser(userResponse.data);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        navigate("/login");
        setUser(null);
        localStorage.removeItem("user");
        toast.error("Session expired. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const register = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post("auth/register", {
        email,
        password,
      });
      updateUser(response.data);
      return response;
    } catch (error) {
      setError(error.response.data.message || error.response.data[0]);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.post("auth/login", {
        email,
        password,
      });
      setUser(response.data.user);

      toast.success(`Welcome ${response.data.user.name}`);
      if (response.status === 200) {
        navigate("/chats");
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ register, login, user, updateUser, loading, error, setError }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
