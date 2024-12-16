import { BsLink45Deg } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import { AiOutlineSend } from "react-icons/ai";
import ChatContext from "../context/ChatContext";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../context/authContext";
import { api } from "../utils/api";
import { format } from "timeago.js";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import SocketContext from "../context/SocketContext";
import { IoMdTime } from "react-icons/io";

import { TiMediaPlay } from "react-icons/ti";
import useGetChats from "../hooks/useGetChats";

const MessageBody = () => {
  const [message, setMessage] = useState("");
  const { setChats } = useGetChats();

  const { selectedChat, getChat, chat, setChat, readChat } =
    useContext(ChatContext);
  const { socket } = useContext(SocketContext);

  const { user } = useContext(AuthContext);

  const chatEndRef = useRef();

  const [showPicker, setShowPicker] = useState(false);

  const addEmoji = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.native);
  };

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
          console.error("Error fetching chat details:", error);
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
      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === newMessage.chatId ? { ...chat, lastMessage: message } : chat
        )
      );

      setMessage("");

      const response = await api.post(`/messages/add/${chatId}`, {
        content,
        userId,
      });
      console.log(response.data);

      setChat((prevChat) => ({
        ...prevChat,
        messages: prevChat.messages.map((msg) =>
          msg.createdAt === newMessage.createdAt
            ? { ...response.data, loading: false }
            : msg
        ),
      }));

      socket.emit("sendMessage", {
        data: response.data,
        receiverId: selectedChat.receiver.id,
      });

      await getChat(chatId);
      e.target.reset();
      setMessage("");
    } catch (error) {
      console.error(error);
      setChat((prev) => ({
        ...prev,
        messages: prev.messages.filter(
          (msg) => msg.createdAt !== newMessage.createdAt
        ),
      }));
    }
  };

  useEffect(() => {
    if (socket) {
      const receiveMessage = (data) => {
        if (chat && chat.chat.id === data.chatId) {
          setChat((prev) => ({
            ...prev,
            messages: [...prev.messages, data],
          }));
        }
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === selectedChat.id
              ? { ...chat, lastMessage: message }
              : chat
          )
        );
      };

      socket.on("receiveMessage", receiveMessage);

      return () => {
        socket.off("receiveMessage", receiveMessage);
      };
    }
  }, [chat, socket]);

  if (!chat) {
    return <p>Loading chat...</p>;
  }

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
                  <div className="message-card flex flex-col relative">
                    <p>{message.content}</p>
                    <small className="message-time">
                      {format(message.createdAt)}
                    </small>
                    <div className="absolute right-3 bottom-5">
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
            <AiOutlineSend size={25} type="submit" className="cursor-pointer" />
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
