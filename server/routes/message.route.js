import express from "express";
import {
  addMessage,
  deleteMessage,
  editMessage,
  markAsRead,
} from "../controller/message.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/add/:chatId", verifyToken, addMessage);
router.put("/edit/:chatId", verifyToken, editMessage);
router.put("/read/:chatId", verifyToken, markAsRead);
router.post("/delete/:chatId", verifyToken, deleteMessage);

export default router;
