import ChatLeft from "../Components/ChatLeft";
import ChatRight from "../Components/ChatRight";

const Chats = () => {
  return (
    // Parent container
    <div className="w-full flex   ">
      {/* Container left */}
      <ChatLeft />
      {/* Container right */}
      <div className="">
        <ChatRight />
      </div>
    </div>
  );
};

export default Chats;
