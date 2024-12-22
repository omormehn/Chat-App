import express from "express";
import {
  getUser,
  getUsers,
  updateProfile,
  avatarSetup,
  removeAvatar,
} from "../controller/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

import multer from "multer";

const upload = multer({ dest: "uploads/profile/" });

const router = express.Router();

router.get('/users', getUsers)
router.get("/user/:id", verifyToken, getUser);
router.post('/update-profile', verifyToken,  upload.single('avatar'),  updateProfile);

router.delete('deleteAvatar', verifyToken, removeAvatar)


export default router;