import { IoIosSearch } from "react-icons/io";
import { GoArrowLeft } from "react-icons/go";

import { format } from "timeago.js";
import { useMediaQuery } from "react-responsive";
import { chatContext } from "../context/ChatContext";
import { useEffect } from "react";
import  { useAuth } from "../context/AuthContext";
import { getSocket } from "../context/SocketContext";
import MessageBody from "./MessageBody";


const ChatRight = () => {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  const { user, setUser } = useAuth();
  const { selectedChat, setSelectedChat } = chatContext();
  const { onlineUsers, socket } = getSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("getOnlineUsers", (onlineUsers) => {
      const id = user?.id;
      if (!onlineUsers.includes(id)) {
        setUser((prev) => {
          if (!prev) return prev;
          return { ...prev, lastSeen: new Date() }
        });
      }
    });
  }, [socket, onlineUsers, user, setUser]);

  return (
    selectedChat && (
      <div className="bg-[#94A3B8]">
        {isDesktop ? (
          <div className="xl:w-[65%] md:w-[55%] lg:w-[60%] right-0 h-screen overflow-hidden absolute bg-[#F5F3F3] hidden md:block">
            {selectedChat ? (
              <div>
                <div className="bg-[#94A3B8] px-6 z-50 top py-3 flex justify-between items-center fixed">
                  <div className="flex flex-row z-50 items-center gap-4 cursor-pointer hover:bg-slate-500 py-2 px-4">
                    <img
                      src={selectedChat.receiver?.avatar || "image.png"}
                      className="size-12 rounded-full"
                      alt=""
                    />
                    <div>
                      <h1 className=" text-lg">{selectedChat.receiver?.name}</h1>
                      <div>
                        {onlineUsers.includes(selectedChat.receiver?.id) ? (
                          "Online"
                        ) : (
                          <div>
                            last seen {format(selectedChat.receiver?.lastSeen!)}
                          </div>
                        )}
                      </div>
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
              <div className="flex items-center  justify-center w-full h-screen">
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
                  <div className="bg-[#94A3B8]  px-6 top py-3 flex justify-between  items-center">
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
                        <h1>{selectedChat.receiver?.name}</h1>
                        <p>{format(user?.lastSeen!)}</p>
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
