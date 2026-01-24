import { useEffect, useRef, useState } from "react";
import { PuffLoader } from "react-spinners";
import { api } from "../utils/api";
import { format } from "timeago.js";

/* Icons */
import { BsLink45Deg } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import { AiOutlineSend } from "react-icons/ai";
import { IoMdTime } from "react-icons/io";
import { HiOutlineDotsVertical } from "react-icons/hi";

/* Context Api */
import { chatContext } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../context/SocketContext";

/* Emoji */
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

/* Hook */
import useGetChats from "../hooks/useGetChats";
import useSocketEvents from "../hooks/useSocketEvents";
import { Chat, Message, MessageType, Status } from "../../types/types";
import { handleAxiosError } from "../utils/handleAxiosError";

const MessageBody = () => {
  const [message, setMessage] = useState("");
  const [hoverMessage, setHoverMessage] = useState<number | null>(null);
  const [messageMenu, setMessageMenu] = useState<number | null>(null);

  const { setChats, getChats } = useGetChats();

  const { selectedChat, getChat, chat, setChat, readChat } = chatContext()
  const { socket } = getSocket()

  const { user } = useAuth()

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [showPicker, setShowPicker] = useState(false);

  const addEmoji = (emoji: any) => {
    setMessage((prevMessage) => prevMessage + emoji.native);
  };


  useSocketEvents(socket, {
    onReceiveMessage: (data: Message) => {
      if (chat && chat.id === data.chatId) {
        setChat((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages ?? [], data],
          }
        });
      }
      setChats((prevChats) =>
        prevChats.map((chat) => {
          return chat.id === selectedChat?.id
            ? { ...chat, lastMessage: data }
            : chat;
        })
      );
    },
    // markAsRead: (data) => {
    //   console.log("dt", data)
    // }
    onUpdateStatus: (data: { messageId: string[], status: Status }) => {
   

      if (data.messageId.length < 1) return;
     

      setChat((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: prev?.messages?.map((msg) => {

            const isMatch = data.messageId.includes(msg.id);
            if (!isMatch) {
              return msg;
            }
            const status = data.status;
            return {
              ...msg,
              status,
            };
          }),
        }
      });
    }

  })

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    const fetchChatDetails = async () => {
      if (selectedChat?.id) {
        try {
          await getChat(selectedChat.id);
          await readChat(selectedChat.id);
        } catch (error) {
          handleAxiosError(error, "fetch chat details in message body")
        }
      }
    };
    fetchChatDetails();
  }, [selectedChat]);

  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (chat?.id && user && selectedChat?.lastMessage) {
        socket?.emit("updateStatus", {
          messageId: [selectedChat.lastMessage.id],
          userId: user.id,
          senderId: selectedChat.receiver?.id,
          status: "READ",
        });
      }
    };

    markMessagesAsRead();
  }, [chat?.id]);

  const addMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement
    const content = form.message.value;
    const chatId = selectedChat?.id!;
    const userId = user?.id!;

    const newMessage = {
      id: crypto.randomUUID(),
      chatId,
      sender: user!,
      senderId: userId,
      chat: {} as Chat,
      lastMessage: [],
      readBy: [],
      content,
      mediaUrl: "",
      messageType: "text" as MessageType,
      status: "SENT" as Status,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      loading: true,
    } as Message;

    try {
      setChats((prevChats) => {
        return prevChats.map((chat) =>
          chat.id === newMessage.chatId
            ? { ...chat, lastMessage: newMessage }
            : chat
        )
      });

      setChat((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev?.messages!, newMessage],
        }
      });

      setMessage("");

      const response = await api.post(`/messages/add/${chatId}`, {
        content,
        userId,
      });

      const realMessage = response.data;
      setChat((prevChat) => {
        if (!prevChat) return null;
        return {
          ...prevChat,
          messages: prevChat.messages?.map((msg: Message) =>
            msg.createdAt === newMessage.createdAt
              ? { ...realMessage, loading: false }
              : msg
          ),
        }
      });

      socket?.emit("updateLastMessage", {
        chat: {
          id: chatId,
          userIds: [userId, selectedChat?.receiver?.id],
          lastMessage: realMessage,
        },
        userId,
      });

      socket?.emit("sendMessage", {
        data: response.data,
        receiverId: selectedChat?.receiver?.id,
      });

      // socket.emit("markAsRead", {
      //   messageId: realMessage.id,
      //   userId: user?.id,
      // });

      if (selectedChat?.receiver?.id === user?.id) {
        setChat((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            messages: prev.messages?.map((msg) =>
              msg.id === response.data.id
                ? { ...msg, readBy: [user?.id!, selectedChat?.receiver?.id!] }
                : msg
            ),
          }
        });
      }

      await getChat(chatId);
      form.reset();
    } catch (error) {
      setChat((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: prev.messages?.filter(
            (msg) => msg.createdAt !== newMessage.createdAt
          ),
        }
      });
      handleAxiosError(error, "add message")
    }
  };

  if (!chat) {
    return (
      <div className="h-screen flexCenter">
        <PuffLoader size={50} />
      </div>
    );
  }

  // console.log(chat, "chat");

  const handleMessageHover = () => {
    setHoverMessage(null);
    setMessageMenu(null);
  };

  const handleDelete = async (e: React.FormEvent, message: Message) => {
    e.preventDefault;
    const chatId = chat.id;
    const messageId = message.id;
    try {
      setChat((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: prev.messages?.filter((msg) => msg.id !== messageId),
        }
      });

      const res = await api.post(`/messages/delete/${chatId}`, {
        messageId,
      });
      console.log(res.data.lastMessage, "delete message response");

      setChats((prev) => {
        return prev.map((chat) => {
          if (chat.id === chatId) {
            console.log(chat, "chat in delete message");
            console.log(messageId, "message id in delete message");
            console.log(
              chat.lastMessage,
              "chat last message in delete message"
            );
            return {
              ...chat,
              lastMessage: res.data.lastMessage,
            };
          }
          return chat;
        });
      });

      await getChats();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="overflow-auto h-screen py-20 z-20">
        <div className="flex flex-col   gap-4 p-4">
          <div>
            {chat.messages ? (
              chat.messages.map((message, index) => {
                return (
                  <div
                    key={index}
                    className={`flex flex-col py-2 ${message.senderId === user?.id ? "items-end" : "items-start"
                      }`}
                  >
                    <div
                      className="message-card relative"
                      onMouseLeave={handleMessageHover}
                      onMouseEnter={() => setHoverMessage(index)}
                    >
                      <div className="flex flex-col gap-1">
                        <div
                          className={`flex gap-2 items-center justify-between`}
                        >
                          <p>{message.content}</p>

                          {message.senderId === user?.id &&
                            hoverMessage === index && (
                              <HiOutlineDotsVertical
                                onClick={() => setMessageMenu(index)}
                                className={`cursor-pointer ${messageMenu === index ? "hidden" : ""
                                  }`}
                              />
                            )}

                          {messageMenu === index && (
                            <div
                              className={`absolute rounded-xl top-5 ${message.senderId === user?.id
                                ? " right-32"
                                : " left-28"
                                } `}
                            >
                              <ul className="bg-white px-5 py-2">
                                <li className="cursor-pointer hover:text-blue-gray-900">
                                  Edit
                                </li>
                                <li
                                  onClick={(e) => handleDelete(e, message)}
                                  className="cursor-pointer hover:text-blue-gray-900"
                                >
                                  Delete
                                </li>
                                <li className="cursor-pointer hover:text-blue-gray-900">
                                  Forward
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 justify-between">
                          <small className="message-time">
                            {format(message.createdAt)}
                          </small>

                          {message.loading ? (
                            <IoMdTime />
                          ) : message.senderId === user?.id ? (
                            message.status === "READ" || message.readBy.includes(selectedChat?.receiver?.id!) ? (
                              <span className="text-blue-500">✓✓</span>
                            ) : message.status === "DELIVERED" ? (
                              <span>✓✓</span>
                            ) : (
                              <span>✓</span>
                            )
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No messages yet. Start the conversation!</p>
            )}
          </div>
        </div>
        <div ref={chatEndRef}></div>
      </div>

      <div className="fixed xl:w-[65%] md:w-[55%] lg:w-[60%] w-full bottom-0 bg-white/20  py-3 backdrop-blur-xl rounded-lg shadow-md ">
        <div className="flex flex-row justify-evenly items-center   ">
          <div className="flex gap-4 top-icon">
            <BsEmojiSmile
              onClick={() => setShowPicker((prev) => !prev)}
              size={25}
            />
            <BsLink45Deg size={25} />
          </div>
          {/* Message input */}
          <form
            onSubmit={addMessage}
            className=" flex gap-4 items-center  w-9/12"
          >
            <input
              name="message"
              type="text"
              value={message}
              required
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter Chat"
              className="border-black w-[100%] py-3 px-2"
            />
            <button type="submit" className="cursor-pointer">
              <AiOutlineSend size={25} />
            </button>
          </form>
          {showPicker && (
            <div className="absolute bottom-12 left-0 z-50">
              <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBody;
