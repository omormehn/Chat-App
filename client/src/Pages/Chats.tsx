import { useContext, useEffect } from "react";
import ChatLeft from "../Components/ChatLeft";
import ChatRight from "../Components/ChatRight";
import Footer from "../Components/Footer";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Chats = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.name) {
      navigate('/profile-setup')
    }
  })

  return (
    // Parent container
    <div className="w-full flex   ">
      {/* Container left */}
      <ChatLeft />
      {/* Container right */}
      <ChatRight />
      
      <Footer />
    </div>
  );
};

export default Chats;
