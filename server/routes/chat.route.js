import express from "express";
import { addChat, deleteChat, getChat, getChats, readChat, updateLastMessage } from "../controller/chat.controller.js";
import { deleteChats } from "../controller/chat.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get('/get-chats', verifyToken, getChats);
router.get("/get-chat/:chatId", verifyToken, getChat);
router.post("/add-chat", verifyToken, addChat);
router.put("/read-chat/:chatId", verifyToken, readChat);
router.put("/read-chats", verifyToken, readChat);
router.delete("/delete-chat/:chatId", verifyToken, deleteChat);
router.delete("/delete-chat", verifyToken, deleteChats);
router.post("/updateLastMessage/:chatId", verifyToken, updateLastMessage);




export default router;