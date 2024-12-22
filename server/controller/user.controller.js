import prisma from "../prisma/config.js";

const BASE_URL = "http://localhost:5000";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to get users" });
  }
};
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user" });
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.user;
  const { ...defaults } = req.body;
  const fileUrl = `${BASE_URL}/uploads/profile/${req.file.filename}` || null;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...defaults,
        avatar: fileUrl,
      },
    });

    res
      .status(200)
      .json({ message: "User updated Successfully", user, fileUrl });
  } catch (error) {
    res.status(500).json({ message: "Internal service error", error });
    throw new Error(error);
  }
};
export const avatarSetup = async (req, res) => {
  const { id } = req.user.id;
  const { avatar } = req.body;

  try {
    if (!req.file)
      return res.status(400).json({ message: "File is  required" });
    const date = Date.now();

    let fileName = "uploads/profile";
    res.json(updateUser);
  } catch (error) {
    res.status(500).json({ message: "Internal service error" });
    throw new Error(error);
  }
};

export const removeAvatar = async (req, res) => {
  const { id } = req.user;
  const { avatar, ...defaults } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...defaults,
        ...(avatar && { avatar }),
      },
    });

    res.status(200).json({ message: "User updated Successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Internal service error", error });
    throw new Error(error);
  }
};
