import React, { ChangeEvent } from "react"
import { Socket } from "socket.io-client"


export type AuthContextProps = {
    register: (email: string, password: string) => void
    login: (email: string, password: string) => void
    user: User | null
    updateUser: (data: User) => void
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    loading: boolean
    error: string | null
    setError: React.Dispatch<React.SetStateAction<string | null>>
}

export type SocketContextProps = {
    socket: Socket | null;
    onlineUsers: any
}

export type ChatContextProps = {
    selectedChat: Chat | null;
    selectedChatId: string | null;
    chatDetails: Chat[] | null;
    setSelectedChatId: React.Dispatch<React.SetStateAction<string | null>>;
    setChat: React.Dispatch<React.SetStateAction<Chat | null>>;
    setChatDetails: React.Dispatch<React.SetStateAction<Chat[]>>;
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;


    getChat: (chatId: string) => void;
    readChat: (chatId: string) => void;
    loading: boolean;

    chat: Chat | null;

}

export interface SocketEventHandlers {
    onReceiveMessage?: ReceiveMessageHandler;
    onNewChat?: NewChatHandler;
    onUpdateMessage?: UpdateChatHandler;
    markAsRead?: MarkAsReadHandler;
    onUpdateStatus?: UpdateStatusHandler;
}


type ReceiveMessageHandler = (data: Message) => void;
type NewChatHandler = (chat: Chat) => void;
type UpdateChatHandler = (chat: Chat) => void;
type MarkAsReadHandler = (data: { userId: string; messageId: string[] }) => void;
type UpdateStatusHandler = (data: { messageId: string[]; status: Status }) => void;


export type MessageType = "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";
export type Status = "READ" | "SENT" | "DELIVERED";


export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    bio?: string;
    avatar?: string;
    verificationToken: string;
    verificationTokenExpiresAt: Date;
    isEmailVerified: boolean;
    resetPasswordToken?: string;
    resetPasswordTokenExpiresAt?: Date;
    lastSeen: Date;
    chats?: Chat[];
    messages?: Message[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Chat {
    id: string;
    name?: string;
    users: User;
    receiver?: User;
    userIds: string[];
    seenBy: string[];
    lastMessageId?: string;
    lastMessage?: Message;
    messages?: Message[];
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface Message {
    id: string;
    content: string;
    senderId: string;
    sender: User;
    chatId: string;
    chat: Chat;
    lastMessage: Chat[];
    status: Status;
    readBy: string[];
    mediaUrl?: string;
    loading?: boolean
    messageType: MessageType;
    createdAt: Date | string;
    updatedAt: Date | string;
}


export interface InputComponentProps {
    placeholder: string;
    name: string;
    isPasswordVisible: boolean;
    togglePassword: () => void;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}