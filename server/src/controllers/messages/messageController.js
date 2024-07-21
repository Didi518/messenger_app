import asyncHandler from "express-async-handler";

import Chat from "../../models/messages/Chat.js";
import Message from "../../models/messages/MessageModel.js";

export const createChat = asyncHandler(async (req, res) => {
  try {
    const newChat = new Chat({
      participants: [req.body.senderId, req.body.receiverId],
    });

    if (!req.body.senderId || !req.body.receiverId) {
      return res
        .status(400)
        .json({ message: "senderId et receiverId sont requis" });
    } else if (req.body.senderId === req.body.receiverId) {
      return res.status(400).json({
        message: "Chaque participants doivent être des comptes uniques",
      });
    }

    const chat = await newChat.save();

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const getAllUserChats = asyncHandler(async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: { $in: [req.params.userId] },
    }).sort({ lastModified: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.log("Erreur avec getAllUserChats", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const createMessage = asyncHandler(async (req, res) => {
  try {
    const newMessage = new Message(req.body);

    const message = await newMessage.save();
    await Chat.findByIdAndUpdate(req.body.chatId, {
      lastModified: Date.now(),
    });

    res.status(201).json(message);
  } catch (error) {
    console.log("Erreur avec createMessage", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const getChatMessages = asyncHandler(async (req, res) => {
  // const { limit, offset } = req.query;
  // const limitNumber = parseInt(limit, 10) || 20;
  // const offsetNumber = parseInt(offset, 10) || 0;

  try {
    const messages = await Message.find({ chatId: req.params.chatId });
    // .sort({
    //   createdAt: -1,
    // })
    // .limit(limitNumber)
    // .skip(offsetNumber);

    res.status(200).json(messages);
  } catch (error) {
    console.log("Erreur avec getChatMessages", error.message);
    res.status(500).json({ message: error.message });
  }
});
