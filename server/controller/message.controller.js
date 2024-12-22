import prisma from "../prisma/config.js";

export const addMessage = async (req, res) => {
  const userId = req.user.id;
  const { chatId } = req.params;
  const { content } = req.body;
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    const message = await prisma.message.create({
      data: {
        content: content,
        chatId: chatId,
        senderId: userId,
      },
    });
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        lastMessage: content,
        seenBy: [userId],
      },
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Internal Service Error" });
    throw new Error(error);
  }
};
export const deleteMessage = async (req, res) => {};
export const editMessage = async (req, res) => {};
