import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import chatRouter from './routes/chat.route.js';
import messageRouter from "./routes/message.route.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";


import dotenv from 'dotenv';

const app = express();
dotenv.config()


app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
))
app.use(express.json());
app.use(cookieParser());
app.use('/uploads/profile', express.static('uploads/profile'));


app.use("/auth", authRouter);
app.use("", userRouter);




app.use('/chats', chatRouter);
app.use("/messages", messageRouter);






const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
