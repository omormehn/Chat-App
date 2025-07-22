import { useEffect } from "react";
import ChatLeft from "../Components/ChatLeft";
import ChatRight from "../Components/ChatRight";
import Footer from "../Components/Footer.tsx";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Chats = () => {
  const { user } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (!user?.name) {
      navigate('/profile-setup')
    }
  }, [user])

  return (
    // Parent container
    <div className="w-full flex ">
      {/* Container left */}
      <ChatLeft />
      {/* Container right */}
      <ChatRight />
      
      <Footer />
    </div>
  );
};

export default Chats;
