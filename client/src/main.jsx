import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChatContextProvider } from "./context/ChatContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import { ThemeProvider } from "@material-tailwind/react";
import { AuthContextProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ChatContextProvider>
          <SocketContextProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </SocketContextProvider>
        </ChatContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
