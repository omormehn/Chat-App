/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { CgUserAdd } from "react-icons/cg";
import { IoFilterOutline } from "react-icons/io5";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PuffLoader } from "react-spinners";
import defaultAvatar from "/src/avatar.svg";
import AuthContext from "../context/AuthContext";
import ChatContext from "../context/ChatContext";
import useGetChats from "../hooks/useGetChats";
import SocketContext from "../context/SocketContext";
import { Card, Typography, CardBody, Dialog } from "@material-tailwind/react";
import useGetUsers from "../hooks/useGetUsers";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import { useSocketEvents } from "../hooks/useSocketEvents";
import { format } from "timeago.js";

const ChatLeft = () => {
  const navigate = useNavigate();
  const {
    selectedChat,
    setSelectedChat,
    getChat,
    setSelectedChatId,
    readMessage,
  } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const { chats, setChats, loading, getChats } = useGetChats();
  const { users } = useGetUsers();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  useEffect(() => {
    async function init() {
      if (selectedChat?.id) {
        try {
          await api.put(`/messages/read/${selectedChat.id}`);
        } catch (error) {
          console.log("err", error);
        }
      }
    }

    init();
  }, [selectedChat]);

  useSocketEvents(socket, {
    onReceiveMessage: (data) => {
      try {
        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.id === data.chatId) {
              return {
                ...chat,
                lastMessage: data,
                updatedAt: new Date().toISOString(),
              };
            }
            return chat;
          })
        );
      } catch (error) {
        throw new error();
      }
    },

    onNewChat: (chat) => {
      setChats((prev) => [...prev, chat]);
    },

    onUpdateMessage: (updatedChat) => {
      const updateChats = (prevChat, newChat, userId) => {
        const isChat = newChat.userIds.includes(userId);
        if (!isChat) return prevChat;

        return prevChat.map((chat) =>
          chat.id === newChat.id
            ? { ...chat, lastMessage: newChat.lastMessage }
            : chat
        );
      };
      setChats((prevChats) => updateChats(prevChats, updatedChat, user.id));
    },
  });

  const sortedChats = [...chats].sort(
    (a, b) =>
      new Date(b.updatedAt || b.createdAt) -
      new Date(a.updatedAt || a.createdAt)
  );

  const filteredUsers = users.filter((currentUser) => {
    return (
      currentUser.id !== user.id &&
      Array.isArray(chats) &&
      !chats.some((chat) => chat.userIds.includes(currentUser.id))
    );
  });

  // useEffect(() => {
  //   handleChatClick()
  // })

  const handleChatClick = async (chat) => {
    if (chat.id === selectedChat?.id) return;

    if (!chat.seenBy.includes(user.id)) {
      setSelectedChat({
        ...chat,
        seenBy: [...chat.seenBy, user.id],
      });
    } else {
      console.log("else")
      setSelectedChat(chat);
    }

    setSelectedChatId(chat.id);
    getChat(chat.id);

    try {
      await readMessage(chat.id);
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

  const getUnreadCount = (chat) => {
    if (selectedChat?.id === chat.id) return 0;
    return chat.seenBy.includes(user.id) ? 0 : 1;
  };
  const addChat = async (receiver) => {
    const receiverId = receiver.id;
    try {
      setOpen(false);
      const res = await api.post("chats/add-chat", {
        receiverId,
      });

      const newChat = res.data;

      setChats((prev) => [...prev, newChat]);
      socket.emit("createChat", { chat: newChat, receiverId });

      const newChats = await getChats();
      const chat = newChats.find((chat) => chat.userIds.includes(receiverId));

      if (chat) {
        handleChatClick(chat);
      } else {
        toast.error("Chat not found");
      }
    } catch (error) {
      toast.error("Failed to add chat");
      console.log(error);
      throw new Error(error);
    }
  };

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
          <div className="h-screen">
            {sortedChats.map((chat) => {
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
                      src={chat.receiver?.avatar || defaultAvatar}
                      className="size-12 rounded-full"
                    ></img>
                    {/* Chat Info */}
                    <div className="">
                      <h1 className="font-bold text-lg">
                        {chat.receiver?.name}
                      </h1>
                      <div className="w-44 overflow-hidden  ">
                        <p className="font-light  truncate ">
                          {chat.lastMessage?.content}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Time and count */}
                  <div
                    key={chat.id}
                    className={` rounded-md flex flex-col items-center justify-end`}
                    onClick={() => {
                      handleChatClick(chat);
                    }}
                  >
                    <div>
                      <p>{format(chat.lastMessage?.createdAt)}</p>
                    </div>
                    {getUnreadCount(chat) > 0 && (
                      <div className="bg-red-500 text-white text-xs flex items-center justify-center h-5 w-5 rounded-full">
                        {getUnreadCount(chat)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {chats.length < 1 && (
              <div className="mt-16  text-center">
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
