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
        readBy: [userId],
      },
    });

    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        lastMessage: {
          connect: { id: message.id },
        },
      },
    });
    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Service Error", error: error.message });
    throw new Error(error);
  }
};

export const markAsRead = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.id;
  try {
    const unreadMessages = await prisma.message.findMany({
      where: {
        chatId,

        NOT: {
          readBy: {
            has: userId,
          },
        },
        senderId: {
          not: userId,
        },
      },
    });

    const readMessages = unreadMessages.map(async (msg) => {
      return await prisma.message.update({
        where: {
          id: msg.id,
        },
        data: {
          readBy: {
            push: userId,
          },
        },
      });
    });

    const promise = await Promise.all(readMessages);
    res.status(200).json({
      message: "Messages marked as read",
      readMessages: promise.filter(Boolean),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error", error });
  }
};

export const updateStatus = async (req, res) => {
  const { chatId } = req.params;
  const { status, messageIds } = req.body;

  try {
    const updatedMessages = await prisma.message.updateMany({
      where: {
        chatId,
        id: {
          in: messageIds,
        },
      },
      data: {
        status,
      },
    });
    res.status(200).json({ message: "Success", count: updatedMessages.count });
  } catch (error) {
    console.log("errror in upd", error);
  }
};

export const deleteMessage = async (req, res) => {
  const { chatId } = req.params;
  const { messageId } = req.body;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: true,
      },
    });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    const message = chat.messages.find((message) => message.id === messageId);
    if (!message) return res.status(404).json({ message: "Message Not found" });

    await prisma.message.delete({
      where: { id: messageId },
    });
    // res.status(200).json({ message: "Message deleted successfully" });

    const remainingMessages = await prisma.message.findMany({
      where: { chatId: chatId },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });
    // if (!remainingMessages) return res.status(404).json({ message: "No messages found" });

    if (remainingMessages.length > 0) {
      await prisma.chat.update({
        where: { id: chatId },
        data: {
          lastMessage: remainingMessages[0].content,
        },
      });
    }

    res.status(200).json({
      message: "Message deleted successfully",
      lastMessage: remainingMessages[0].content,
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: {
        lastMessage: null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(501).json({ message: "Error in deleting message" });
  }
};
export const editMessage = async (req, res) => {};
