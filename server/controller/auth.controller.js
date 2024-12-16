import prisma from "../prisma/config.js";
import bcrypt from "bcrypt";
import { generateVerificationCode } from "../utils/generateVerifCode.js";
import { generateCookie } from "../utils/generateCookie.js";
import { validatePassword } from "../utils/validatePassword.js";

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });
    const pass = validatePassword(password);
    if (!pass.isValid) {
      return res.status(400).json({ errors: pass.errors });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();
    const user = await prisma.user.create({
      data: {
        name: '',
        email,
        password: hashedPassword,
        verificationToken: verificationCode,
        verificationTokenExpiresAt: new Date(Date.now() + 15 * 60 * 60 * 1000),
      },
    });
    generateCookie(res, user);
    res.status(200).json({
      message: "Reg successful",
      ...user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    generateCookie(res, user);

    user.lastSeen = new Date();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        lastSeen: user.lastSeen,
        password: undefined,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
export const forgotPassword = async (req, res) => {
  const { password } = req.body;
  const { newPass } = req.body;
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user)
      return res.status(404).json({ message: "Invalid Email Address" });
    const pass = await bcrypt.compare(password, user.password);
    if (!pass)
      return res.status(400).json({ message: "Password Does not match" });
    const hashedPassword = await bcrypt.hash(newPass, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    res.status(200).json({ message: "Password Updated Successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Service error" });
  }
};

export const profileSetup = async (req, res) => {
  const { id } = req.user.id;
  const { name, bio, avatar } = req.body;

  try {
    const user = prisma.user.findFirst({
      where: {
        id,
      },
    });
    
    if(!user) res.status(404).json({message: "User not found"})
    const updateUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        bio,
        avatar,
      }
    });
    res.json(updateUser)
  } catch (error) {
    console.error(error)
    res.status(500).json({message: "Internal service error"})
  }
};

export const validate = (req, res) => {
  res.status(200).json({ message: "Token is valid", user: req.user });
};
