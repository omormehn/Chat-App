/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { CgUserAdd } from "react-icons/cg";
import { IoFilterOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import { useAuth } from "../context/AuthContext";
import { chatContext } from "../context/ChatContext";
import useGetChats from "../hooks/useGetChats";
import { getSocket } from "../context/SocketContext";
import { Dialog, Card, Typography, CardBody, } from "@material-tailwind/react";
import useGetUsers from "../hooks/useGetUsers";
import { api } from "../utils/api.ts";
import toast from "react-hot-toast";
import useSocketEvents from "../hooks/useSocketEvents";
import { format } from "timeago.js";
import dayjs from "dayjs";
import { Chat, Message, User } from "../../types/types";
import { handleAxiosError } from "../utils/handleAxiosError";
import axios from "axios";

const ChatLeft = () => {
  const navigate = useNavigate();
  const { selectedChat, setSelectedChat, setChat, setSelectedChatId } =
    chatContext();
  const { user } = useAuth();
  const { socket } = getSocket();
  const { chats, setChats, loading, getChats,  } = useGetChats();
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
    onReceiveMessage: async (data: Message) => {
      await api.post(`/messages/update/${data.chatId}`, {
        messageId: [data.id],
        status: "DELIVERED",
      });

      setChats((prevChats) => {
        const updatedChat = prevChats.map((chat) => {
          if (chat.id === data.chatId) {
            return {
              ...chat,
              lastMessage: data,
              updatedAt: new Date().toISOString(),
            };
          }
          return chat;
        })
        return updatedChat;
      }
      );

      socket?.emit("updateStatus", {
        messageId: [data.id],
        userId: user?.id,
        senderId: data.senderId,
        status: "DELIVERED",
      });

    },
    onNewChat: (chat: Chat) => {
      setChats((prev) => [...prev, chat]);
    },

    onUpdateMessage: (updatedChat: Chat) => {

      const updateChats = (prevChats: Chat[], newChat: Chat, userId: string) => {

        const isChat = newChat?.userIds?.includes(userId);
        if (!isChat) return prevChats;

        return prevChats.map((chat) =>
          chat.id === newChat.id
            ? { ...chat, lastMessage: newChat.lastMessage }
            : chat
        );
      };
      setChats((prevChats) => updateChats(prevChats, updatedChat, user?.id!));
    },
  });

  const sortedChats = [...chats].sort((a, b) => {
    const DateA = new Date(b.updatedAt ?? b.createdAt).getTime();
    const DateB = new Date(a.updatedAt ?? a.createdAt).getTime();
    return DateA - DateB;
  }
  );

  const filteredUsers = users.filter((currentUser: User) => {
    return (
      currentUser.id !== user?.id &&
      Array.isArray(chats) &&
      !chats.some((chat) => chat?.userIds.includes(currentUser?.id))
    );
  });

  const handleChatClick = async (chat: Chat) => {
    if (chat?.id === selectedChat?.id) return;
    if (!chat) return;

    if (!chat?.seenBy?.includes(user?.id!)) {
      setSelectedChat({
        ...chat,
        seenBy: [...chat.seenBy, user?.id!],
      });
    } else {
      setSelectedChat(chat);
    }

    setSelectedChatId(chat?.id);

    try {
      const response = await api.get(`chats/get-chat/${chat.id}`);
      const fullChat = response.data.chat;
      const messages = fullChat?.messages || [];

      setChatDetails({ ...response.data });
      setChat({ ...fullChat, messages });

      const unreadMessageIds = messages
        .filter((msg: { senderId: string | undefined; status: string; }) => msg.senderId !== user?.id && msg.status !== "READ")
        .map((msg: { id: any; }) => msg.id);

      if (unreadMessageIds.length > 0) {
        await api.post(`/messages/add/update/${chat.id}`, {
          messageId: unreadMessageIds,
          status: "READ",
        });

        socket?.emit("updateStatus", {
          messageId: unreadMessageIds,
          userId: user?.id,
          senderId: fullChat.participants.find((p: string | undefined) => p !== user?.id),
          status: "READ",
        });
      }

    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    } 
  };


  // const getUnreadCount = (chat) => {
  //   if (selectedChat?.id === chat.id) return 0;
  //   return chat?.seenBy.includes(user.id) ? 0 : 1;
  // };
  const addChat = async (receiver: User) => {
    const receiverId = receiver.id;
    try {
      setOpen(false);
      const res = await api.post("chats/add-chat", {
        receiverId,
      });

      const newChat = res.data;

      setChats((prev) => [...prev, newChat]);
      socket?.emit("createChat", { chat: newChat, receiverId });

      const newChats = await getChats();
      const chat = newChats.find((chat: Chat) => chat?.userIds?.includes(receiverId));

      if (chat) {
        handleChatClick(chat);
      } else {
        toast.error("Chat not found");
      }
    } catch (error) {
      toast.error("Failed to add chat");
      handleAxiosError(error, "failed to add chat")
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
              src={user?.avatar ? user.avatar : "image.png"}
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
                      src={chat?.receiver?.avatar || "image.png"}
                      className="size-12 rounded-full"
                    ></img>
                    {/* Chat Info */}
                    <div className="">
                      <h1 className="font-bold text-lg">
                        {chat?.receiver?.name}
                      </h1>
                      <div className="flex gap-4 overflow-hidden flex-row  ">
                        <p className="font-light  truncate ">
                          {chat?.lastMessage?.content}
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
                      {chat?.lastMessage && (
                        <p>
                          {new Date(
                            chat?.lastMessage?.createdAt
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                    {/* {getUnreadCount(chat) > 0 && (
                      <div className="bg-red-500 text-white text-xs flex items-center justify-center h-5 w-5 rounded-full">
                        {getUnreadCount(chat)}
                      </div>
                    )} */}
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
        {...({} as React.ComponentProps<typeof Dialog>)}
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card
          {...({} as React.ComponentProps<typeof Card>)}
          className="mx-auto w-full  h-screen ">
          <CardBody
            {...({} as React.ComponentProps<typeof CardBody>)}
            className="flex flex-col gap-4 overflow-auto">
            <Typography
              {...({} as React.ComponentProps<typeof Typography>)}
              variant="h4" color="blue-gray">
              Add Chat
            </Typography>
            <hr className="bg-black h-0.5" />

            <div
              className="flex flex-col gap-4 overflow-auto"
            >
              {filteredUsers.map((user: User) => (
                <div
                  key={user?.id}
                  onClick={() => addChat(user)}
                  className="flex items-center gap-4 p-4 border cursor-pointer border-gray-300 rounded-lg"
                >
                  {/* User Avatar */}
                  <img
                    src={user.avatar ? user.avatar : "image.png"}
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
            </div>
          </CardBody>
        </Card>
      </Dialog>
    </div>
  );
};

export default ChatLeft;
function setChatDetails(arg0: any) {
  throw new Error("Function not implemented.");
}

