import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import { AuthContextProps, User } from "../../types/types.ts";
import { AxiosError } from "axios";
import { handleAxiosError } from "../utils/handleAxiosError.ts";

const AuthContext = createContext<AuthContextProps | null>(null);

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const updateUser = (data: User) => {
    setUser(data);
  };

  useEffect(() => {
    if (user) return;
    const validateToken = async () => {
      try {
        const { data } = await api.get("/auth/validate", {
          withCredentials: true,
        });
        if (!data) return;
        const id = data.user.id;
        const { data: userResponse } = await api.get(`/user/${id}`, {
          withCredentials: true,
        });

        setUser(userResponse);
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

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post("auth/register", {
        email,
        password,
      });
      if (response.status === 200) {
        navigate("/profile-setup");
      }
      updateUser(response.data);
      return response;
    } catch (err) {
      const error = err as AxiosError<any>;
      const message =
        handleAxiosError(error, "error in register")
      setError(message);
    } finally {
      setLoading(false)
    }
  };

  const login = async (email: string, password: string) => {
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
    } catch (err) {
      const error = err as AxiosError<any>;
      const message = handleAxiosError(error, "error in login")
      //error?.response?.data?.message || error?.response?.data?.[0] || "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ register, login, user, setUser, updateUser, loading, error, setError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const auth = useContext(AuthContext);
  if (!auth) {
    console.log("Must be within a provider")
  } return auth!
}
export default AuthContext;
