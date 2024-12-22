import ChatLeft from "../Components/ChatLeft";
import ChatRight from "../Components/ChatRight";
import Footer from "../Components/Footer";

const Chats = () => {
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
