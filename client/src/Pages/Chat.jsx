/* eslint-disable no-unused-vars */
import { BsLink45Deg } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import { AiOutlineSend } from "react-icons/ai";
import { CgUserAdd } from "react-icons/cg";
import { IoFilterOutline } from "react-icons/io5";
import { GoArrowLeft } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";

import { Navigate, useNavigate } from "react-router-dom";
import useGetChats from "../hooks/useGetChats";
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import ChatLeft from "../Components/ChatLeft";

const Chat = () => {
  const navigate = useNavigate();
  const { chats, chat } = useGetChats();
  const [loading, setLoading] = useState(false);

  console.log(chat);

  return (
    <div className="w-full flex h-screen bg-[#F5F3F3]">
      {/* container left  */}
      {/* desktop */}
      <div className="hidden md:block">
        <ChatLeft />
      </div>
      {/* Mobile */}
      <div className="flex z-100 flex-col h-screen md:hidden chat-card">
        <div className="fixed w-full md:w-[45%] lg:w-[40%] xl:w-[35%]">
          {/* top */}
          <div className="bg-slate-400 px-6 top py-3 flex justify-between  items-center">
            <div className="flex  items-center gap-2">
              <div
                onClick={() => {
                  <Navigate to={<ChatLeft/>}/>
                }}
                className=" cursor-pointer "
              >
                <GoArrowLeft />
              </div>
            </div>
            <div>
              <IoIosSearch size={23} className="cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Chat bottom */}
        <div className="absolute w-full bottom-6">
          <div className="flex flex-row justify-evenly items-center overflow-auto mt-44 ">
            <div className="flex gap-4 top-icon">
              <BsEmojiSmile size={25} />
              <BsLink45Deg size={25} />
            </div>
            {/* Message input */}
            <div className=" flex gap-4 items-center  w-9/12">
              <input
                type="text"
                placeholder="Enter Chat"
                className="border-black w-[100%] py-3 px-2"
              />
              <AiOutlineSend size={25} className="cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
      {/* container right */}
      <div className="xl:w-[65%] md:w-[55%] lg:w-[60%] right-0 absolute  h-screen  z-50 hidden md:block">
        <div className="flex flex-col justify-between ">
          {/* top */}
          <div className="bg-slate-400 px-6 top py-3 flex justify-between items-center">
            {/* top */}
            {chat && (
              <div className="flex flex-row items-center gap-4 cursor-pointer hover:bg-slate-500 py-2 px-4">
                <div className="rounded-full w-10 h-10 bg-black border-black"></div>
                <h1>{chat.name}</h1>
                <p></p>
              </div>
            )}

          
          </div>
          {/* chat bottom */}
          <div className="flex items-center ">
            <div className="absolute w-full bottom-6">
              <div className="flex flex-row justify-evenly items-center">
                <div className="flex gap-4 top-icon">
                  <BsEmojiSmile size={25} />
                  <BsLink45Deg size={25} />
                </div>
                {/* Message input */}
                <div className=" flex gap-4 items-center  w-9/12">
                  <input
                    type="text"
                    placeholder="Enter Chat"
                    className="border-black w-[100%] py-3 px-2"
                  />
                  <AiOutlineSend size={25} className="cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
