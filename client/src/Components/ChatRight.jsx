import { IoIosSearch } from "react-icons/io";
import { GoArrowLeft } from "react-icons/go";

import { useMediaQuery } from "react-responsive";
import ChatContext from "../context/ChatContext";
import MessageBody from "./MessageBody";
import { useContext } from "react";
import AuthContext from "../context/authContext";
import SocketContext from "../context/SocketContext";

const ChatRight = () => {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  const { selectedChat, setSelectedChat } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const { onlineUsers } = useContext(SocketContext);

const onlineStatus = () => {
  const isReceiverOnline = null
   if (onlineUsers && selectedChat) {
     const isReceiverOnline = onlineUsers.some(
       (user) => user.userId === selectedChat.receiver.id
     );
      return isReceiverOnline;
   }
    return isReceiverOnline;
}

  return (
    selectedChat && (
      <div className=" ">
        {isDesktop ? (
          <div className="xl:w-[65%] md:w-[55%] lg:w-[60%] right-0 h-screen overflow-hidden absolute bg-[#F5F3F3] hidden md:block">
            {selectedChat ? (
              <div>
                <div className="bg-slate-400 px-6 z-50 top py-3 flex justify-between items-center fixed">
                  <div className="flex flex-row z-50 items-center gap-4 cursor-pointer hover:bg-slate-500 py-2 px-4">
                    <div className="rounded-full w-10 h-10 bg-black border-black"></div>
                    <div>
                      <h1 className=" text-lg">{selectedChat.receiver.name}</h1>
                      <p>
                        {onlineStatus
                          ? "Online"
                          : new Date(
                              selectedChat.receiver.lastSeen
                            ).toLocaleString("en-US", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                      </p>
                    </div>
                  </div>
                </div>
                {/* body */}
                <div className="z-0">
                  <MessageBody />
                </div>
                {/* bottom */}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-screen">
                <h1>Click on a chat to start a conversation</h1>
              </div>
            )}
          </div>
        ) : (
          selectedChat && (
            <div>
              <div className="flex  flex-col h-screen md:hidden chat-card">
                {/* top */}
                <div className="fixed w-full md:w-[45%] lg:w-[40%] z-50  xl:w-[35%]">
                  <div className="bg-slate-400 px-6 top py-3 flex justify-between  items-center">
                    <div className="flex  items-center gap-4 ">
                      <div
                        onClick={() => {
                          setSelectedChat(null);
                        }}
                        className=" cursor-pointer "
                      >
                        <GoArrowLeft />
                      </div>
                      <div>
                        <h1>{selectedChat.receiver.name}</h1>
                        <p>
                          {new Date(user.lastSeen).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <IoIosSearch size={23} className="cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div>
                  <MessageBody key={selectedChat?.id} />
                </div>
              </div>
            </div>
          )
        )}
      </div>
    )
  );
};

export default ChatRight;
