import prisma from "../prisma/config.js";

export const getChats = async (req, res) => {
  const userId = req.user.id;
  try {
    const chats = await prisma.chat.findMany({
      where: { userIds: { hasSome: [userId] } },
      include: {
        lastMessage: true,
      },
    });

    for (const chat of chats) {
      const receiverId = chat.userIds.find((id) => id !== userId);
      const receiver = await prisma.user.findFirst({
        where: { id: receiverId },
        select: {
          id: true,
          name: true,
          avatar: true,
          lastSeen: true,
        },
      });
      chat.receiver = receiver;
    }
    res.status(200).json({ chats });
  } catch (error) {
    res.status(501).json({ message: "Internal server error", error });
    throw new Error(error);
  }
};
export const getChat = async (req, res) => {
  const userId = req.user.id;
  const { chatId } = req.params;
  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userIds: {
          hasSome: [userId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
        lastMessage: true,
      },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.status(200).json({ chat });
  } catch (error) {
    res.status(501).json({ message: "Internal server error", error });
    throw new Error(error);
  }
};

export const addChat = async (req, res) => {
  const { id } = req.user;
  const { receiverId } = req.body;
  if (!id || !receiverId) {
    return res.status(400).json({ message: "Missing required parameters" });
  }
  try {
    const existingChat = await prisma.chat.findFirst({
      where: {
        userIds: {
          hasEvery: [id, receiverId],
        },
      },
    }); 
    if (existingChat)
      return res.status(409).json({ message: "Chat already exists with user" });
    const chat = await prisma.chat.create({
      data: {
        userIds: {
          set: [id, receiverId],
        },
      },
    });

    const receiver = await prisma.user.findFirst({
      where: { id: receiverId },
      select: {
        id: true,
        name: true,
        avatar: true,
        lastSeen: true,
      },
    });

    res.status(201).json({ ...chat, receiver });
  } catch (error) {
    res.status(501).json({ message: "Internal server error", error });
    throw new Error(error);
  }
};

export const readChat = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.id;

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { seenBy: true },
    });
    if (!chat.seenBy.includes(userId)) {
      const updatedChat = await prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          seenBy: {
            push: userId,
          },
        },
      });
      return res.json(updatedChat);
    }

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.json(chat);
  } catch (error) {
    console.log(error);
    res.status(501).json({ message: "Internal Server Error" });
    throw new Error(error);
  }
};
export const readChats = async (req, res) => {
  const userId = req.user.id;
  try {
    await prisma.chat.updateMany({
      where: {
        userIds: {
          hasSome: [userId],
        },
      },
      data: {
        seenBy: {
          push: userId,
        },
      },
    });
  } catch (error) {
    res.status(501).json({ message: "Internal Server Error" });
    throw new Error(error);
  }
};

export const deleteChats = async (req, res) => {
  const userId = req.user.id;
  try {
    await prisma.chat.deleteMany({
      where: {
        userIds: {
          hasSome: [userId],
        },
      },
    });
    res.status(200).json({ message: "Chats deleted Successfully" });
  } catch (error) {
    res.status(501).json({ message: "Internal Server Error" });
    throw new Error(error);
  }
};
export const deleteChat = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.id;
  try {
    const chat = await prisma.chat.delete({
      where: {
        id: chatId,
        userIds: {
          hasSome: [userId],
        },
      },
    });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.status(200).json({ message: "Chat deleted Successfully" });
  } catch (error) {
    res.status(501).json({ message: "Internal Server Error" });
    throw new Error(error);
  }
};

export const updateLastMessage = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.id;
  const { content } = req.body;

  try {
    await prisma.chat.update({
      where: {
        id: chatId,
        userIds: {
          hasSome: [userId],
        },
      },
      data: {
        lastMessage: content,
      },
      select: {
        lastMessage: true,
      },
    });
  } catch (error) {
    console.log("error in update", error);
  }
};
