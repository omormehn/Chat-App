import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { ChatContextProvider } from "./context/ChatContext.js";
import { BrowserRouter } from "react-router-dom";
import { SocketContextProvider } from "./context/SocketContext.js";
import { ThemeProvider } from "@material-tailwind/react";
import { AuthContextProvider } from "./context/AuthContext.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <SocketContextProvider>
          <ChatContextProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </ChatContextProvider>
        </SocketContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
