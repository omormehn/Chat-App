import { useNavigate } from "react-router-dom";
import { CgUserAdd } from "react-icons/cg";
import { IoFilterOutline } from "react-icons/io5";
import { useContext, useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import defaultAvatar from "/src/avatar.svg";
import AuthContext from "../context/authContext";
import ChatContext from "../context/ChatContext";
import useGetChats from "../hooks/useGetChats";
import SocketContext from "../context/SocketContext";
import { Card, Typography, CardBody, Dialog } from "@material-tailwind/react";
import useGetUsers from "../hooks/useGetUsers";
import { api } from "../utils/api";
import toast from "react-hot-toast";


const ChatLeft = () => {
  const navigate = useNavigate();
  const [read, setRead] = useState(false);
  
  const { selectedChat, setSelectedChat, getChat, setSelectedChatId } =
    useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const { chats, setChats, loading, getChats } = useGetChats();
  const { users } = useGetUsers();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  const filteredUsers = users.filter((currentUser) => {
    return (
      currentUser.id !== user.id &&
      Array.isArray(chats) &&
      !chats.some((chat) => chat.userIds.includes(currentUser.id))
    );
  });
  console.log(chats);

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
  const addChat = async (receiver) => {
    const receiverId = receiver.id;
    console.log(receiverId);
    try {
      setOpen(false);
      await api.post("chats/add-chat", {
        receiverId,
      });

      await getChats();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add chat");
    }
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
    <div className="flex flex-col h-screen chat-card md:border-r-8">
      <div className="fixed w-full md:w-[45%] lg:w-[40%] xl:w-[35%]">
        {/* Top section */}
        <div className="top flex-row justify-between items-center px-10 py-5 ">
          <div
            onClick={() => {
              navigate("/profile");
            }}
          >
            <img
              src={user.avatar ? user.avatar : defaultAvatar}
              className="rounded-full size-8 bg-white"
              alt="avatar"
            />
          </div>
          <h1 className="font-bold text-xl pb-1">Chats</h1>
          <div className="flex items-center gap-6 top-icon">
            <CgUserAdd size={25} onClick={handleOpen} />
            <IoFilterOutline size={23} />
          </div>
        </div>

        {/* Search input */}
        <div className="flex px-10 py-4 border-[#f5f4f4] border-b-2">
          <input
            type="text"
            placeholder="Enter Chat"
            className="border-black w-[100%] py-3 px-2"
          />
        </div>
      </div>

      {/* Chats */}
      <div className="flex flex-col px-2 md:px-1 lg:px-5 overflow-auto mt-36 chats">
        {loading ? (
          <div className="flex h-screen justify-center items-center">
            <PuffLoader size={50} />
          </div>
        ) : (
          <div>
            {chats.map((chat) => {
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
                    <img
                      src={chat.receiver.avatar ? chat.receiver.avatar : defaultAvatar}
                      className="size-12 rounded-full"
                    ></img>
                    {/* Chat Info */}
                    <div className="">
                      <h1 className="font-bold text-lg">
                        {chat.receiver.name}
                      </h1>
                      <div className="w-44 overflow-hidden  ">
                        <p className="font-light  truncate ">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Time and count */}
                  <div className="flex flex-col pr-2 items-end">
                    {/* <p className="font-light text-end">2:00 PM</p> */}
                    {unreadCount > 0 || read ? (
                      <div className="bg-red-500 text-white text-xs px-2 py-2 rounded-full"></div>
                    ) : (
                      <div className=""></div>
                    )}
                  </div>
                </div>
              );
            })}
            {chats.length < 1 && (
              <div className=" mt-[70%] text-center">
                Add a chat to start a conversation
              </div>
            )}
          </div>
        )}
      </div>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full  h-screen ">
          <CardBody className="flex flex-col gap-4 overflow-auto">
            <Typography variant="h4" color="blue-gray">
              Add Chat
            </Typography>
            <hr className="bg-black h-0.5" />

            <Typography
              className="flex flex-col gap-4 overflow-auto"
              variant="h3"
            >
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => addChat(user)}
                  className="flex items-center gap-4 p-4 border cursor-pointer border-gray-300 rounded-lg"
                >
                  {/* User Avatar */}
                  <img
                    src={user.avatar ? user.avatar : defaultAvatar}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  {/* User Info */}
                  <div>
                    <p className="font-bold text-base text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.email || "No email"}
                    </p>
                  </div>
                </div>
              ))}
              {filteredUsers.length < 1 && (
                <div>
                  <h1>No available Users</h1>
                </div>
              )}
            </Typography>
          </CardBody>
        </Card>
      </Dialog>
    </div>
  );
};

export default ChatLeft;
