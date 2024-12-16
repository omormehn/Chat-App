import { useNavigate } from "react-router-dom";
import ChatContext from "../context/ChatContext";
import useGetChats from "../hooks/useGetChats";
import { CgUserAdd } from "react-icons/cg";
import { IoFilterOutline } from "react-icons/io5";
import avatar from "/src/avatar.svg";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/authContext";
import SocketContext from "../context/SocketContext";

const ChatLeft = () => {
  const navigate = useNavigate();
  const [read, setRead] = useState(false);

  const { chats, setChats, loading } = useGetChats();

  const { selectedChat, setSelectedChat, getChat, setSelectedChatId } =
    useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const handleChatClick = (chat) => {
    if (chat.id === selectedChat?.id) {
      return;
    }

    chat.seenBy = [...chat.seenBy, user.id];

    setSelectedChat(chat);
    setSelectedChatId(chat.id);
    getChat(chat.id);
  };

  const getUnreadCount = (chat) => {
    return chat.seenBy.includes(user.id) ? 0 : 1;
  };

  useEffect(() => {
    if (socket) {
      try {
        const receiveMessage = (data) => {
          setRead(true);
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.id === data.chatId
                ? { ...chat, lastMessage: data.content }
                : chat
            )
          );
        };
          socket.on("receiveMessage", receiveMessage);
          return () => {
            socket.off("receiveMessage", receiveMessage);
            setRead(false);
          };
      } catch (error) {
        throw new error();
      } finally {
        setRead(false);
      }
    }
  }, [chats]);
  return (
    <div className="flex flex-col h-screen chat-card">
      <div className="fixed w-full md:w-[45%] lg:w-[40%] xl:w-[35%]">
        {/* Top section */}
        <div className="top flex-row justify-between items-center px-10 py-5">
          <div
            onClick={() => {
              navigate("/profile");
            }}
          >
            <img
              src={avatar}
              className="rounded-full w-8 bg-white"
              alt="avatar"
            />
          </div>
          <h1 className="font-bold text-xl pb-1">Chats</h1>
          <div className="flex items-center gap-6 top-icon">
            <CgUserAdd size={25} />
            <IoFilterOutline size={23} />
          </div>
        </div>

        {/* Search input */}
        <div className="flex px-10">
          <input
            type="text"
            placeholder="Enter Chat"
            className="border-black w-[100%] py-3 px-2"
          />
        </div>
      </div>

      {/* Chats */}
      <div className="flex flex-col px-10 overflow-auto mt-36 chats">
        {loading ? (
          <div>Loading...</div>
        ) : (
          chats.map((chat) => {
            const unreadCount = getUnreadCount(chat);
            return (
              <div
                key={chat.id}
                className={` w-full py-5 px-2 rounded-md flex flex-row justify-between hover:bg-slate-300`}
                onClick={() => {
                  handleChatClick(chat);
                }}
              >
                <div className="flex gap-4">
                  {/* Profile Picture */}
                  <div className="rounded-full w-14 h-14 bg-black border-black"></div>
                  {/* Chat Info */}
                  <div className="">
                    <h1 className="font-bold text-lg">{chat.receiver.name}</h1>
                    <div className="w-44 overflow-hidden  ">
                      <p className="font-light  truncate ">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Time and count */}
                <div className="flex flex-col items-end">
                  <p className="font-light text-end">2:00 PM</p>
                  {unreadCount > 0 || read ? (
                    <div className="bg-red-500 text-white text-xs px-2 py-2 rounded-full"></div>
                  ) : (
                    <div className=""></div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatLeft;
