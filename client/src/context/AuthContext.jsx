import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const validateToken = async () => {
    try {
      const { data } = await api.get("/auth/validate", {
        withCredentials: true,
      });
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

  const updateUser = (data) => {
    setUser(data);
  };

  useEffect(() => {
    validateToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
