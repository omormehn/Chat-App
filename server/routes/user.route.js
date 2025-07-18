import express from "express";
import {
  getUser,
  getUsers,
  updateProfile,
  removeAvatar,
} from "../controller/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/user/:id", verifyToken, getUser);
router.post("/update-profile", verifyToken, updateProfile);

router.delete("deleteAvatar", verifyToken, removeAvatar);

export default router;
