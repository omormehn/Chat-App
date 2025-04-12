import express from "express";
import { addMessage, deleteMessage, editMessage } from "../controller/message.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/add/:chatId', verifyToken, addMessage);
router.put("/edit/:chatId", verifyToken, editMessage);
router.post("/delete/:chatId", verifyToken, deleteMessage);


export default router;
