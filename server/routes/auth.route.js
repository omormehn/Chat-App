import express from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  profileSetup,
  validate,

} from "../controller/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/profile-setup", verifyToken, profileSetup);



router.get("/validate", verifyToken, validate);

export default router;
