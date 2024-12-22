/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { io } from 'socket.io-client';
import AuthContext from "./AuthContext";


 const SocketContext = createContext();

export const SocketContextProvider = ({children}) => {
    const [ socket, setSocket ] = useState(null);
    const [ onlineUsers, setOnlineUsers ] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const newSocket = io("https://chat-app-42yc.onrender.com");

        newSocket.on("onlineUsers", (users) => {
            setOnlineUsers(users)
        })

        newSocket.on("disconnect", () =>{});

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, []);

     useEffect(() => {
       if (user && socket) {
         socket.emit("newUser", user.id);
       }
     }, [user, socket]);

    return <SocketContext.Provider value={{socket, onlineUsers}}>
        {children}
    </SocketContext.Provider>
}

export default SocketContext;