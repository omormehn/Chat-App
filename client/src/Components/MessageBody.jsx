/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from "react";
import { PuffLoader } from "react-spinners";
import { api } from "../utils/api";
import { format } from "timeago.js";

/* Icons */
import { BsLink45Deg } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import { AiOutlineSend } from "react-icons/ai";
import { IoMdTime } from "react-icons/io";
import { TiMediaPlay } from "react-icons/ti";
import { HiOutlineDotsVertical } from "react-icons/hi";

/* Context Api */
import ChatContext from "../context/ChatContext";
import AuthContext from "../context/AuthContext";
import SocketContext from "../context/SocketContext";

/* Emoji */
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

/* Hook */
import useGetChats from "../hooks/useGetChats";
import { useSocketEvents } from "../hooks/useSocketEvents";

const MessageBody = () => {
  const [message, setMessage] = useState("");
  const [hoverMessage, setHoverMessage] = useState(null);
  const [messageMenu, setMessageMenu] = useState(null);
  const { setChats, getChats } = useGetChats();

  const { selectedChat, getChat, chat, setChat, readChat } =
    useContext(ChatContext);
  const { socket } = useContext(SocketContext);

  const { user } = useContext(AuthContext);

  const chatEndRef = useRef();

  const [showPicker, setShowPicker] = useState(false);

  const addEmoji = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.native);
  };

  useSocketEvents(socket, {
    onReceiveMessage: (data) => {
      if (chat && chat.chat.id === data.chatId) {
        setChat((prev) => ({
          ...prev,
          messages: [...prev.messages, data],
        }));
      }
      setChats((prevChats) =>
        prevChats.map((chat) => {
          return chat.id === selectedChat.id
            ? { ...chat, lastMessage: data.content }
            : chat;
        })
      );
    },

   
  });

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
          throw new Error(error);
        }
      }
    };
    fetchChatDetails();
  }, [selectedChat]);

  const addMessage = async (e) => {
    e.preventDefault();
    const content = e.target.message.value;
    const chatId = selectedChat.id;
    const userId = user.id;

    const newMessage = {
      chatId,
      senderId: userId,
      content,
      mediaUrl: null,
      messageType: "text",
      status: "sent",
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      loading: true,
    };

    try {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === newMessage.chatId
            ? { ...chat, lastMessage: newMessage }
            : chat
        )
      );

      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));

      setMessage("");

      const response = await api.post(`/messages/add/${chatId}`, {
        content,
        userId,
      });
      const realMessage = response.data;
      setChat((prevChat) => ({
        ...prevChat,
        messages: prevChat.messages.map((msg) =>
          msg.createdAt === newMessage.createdAt
            ? { ...realMessage, loading: false }
            : msg
        ),
      }));

      socket.emit("updateLastMessage", {
        chat: { id: chatId, lastMessage: realMessage },
        userId,
      });

      socket.emit("sendMessage", {
        data: response.data,
        receiverId: selectedChat.receiver.id,
      });

      await getChat(chatId);
      e.target.reset();
    } catch (error) {
      setChat((prev) => ({
        ...prev,
        messages: prev.messages.filter(
          (msg) => msg.createdAt !== newMessage.createdAt
        ),
      }));
      throw new Error(error);
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

  // console.log(chat.messages)
  const handleDelete = async (e, message) => {
    e.preventDefault;
    const chatId = chat.chat.id;
    const messageId = message.id;
    try {
      setChat((prev) => ({
        ...prev,
        messages: prev.messages.filter((msg) => msg.id !== messageId),
      }));

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
              chat.messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col py-2 ${
                    message.senderId === user.id ? "items-end" : "items-start"
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

                        {message.senderId === user.id &&
                          hoverMessage === index && (
                            <HiOutlineDotsVertical
                              onClick={() => setMessageMenu(index)}
                              className={`cursor-pointer ${
                                messageMenu === index ? "hidden" : ""
                              }`}
                            />
                          )}

                        {messageMenu === index && (
                          <div
                            className={`absolute rounded-xl top-5 ${
                              message.senderId === user.id
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
                          <div>
                            <IoMdTime />
                          </div>
                        ) : (
                          <div>
                            <TiMediaPlay size={13} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
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
