import express from "express";

import {
  createChat,
  createMessage,
  getAllUserChats,
  getChatMessages,
} from "../controllers/messages/messageController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/chats", protect, createChat);
router.get("/chats/:userId", protect, getAllUserChats);

router.post("/message", protect, createMessage);
router.get("/messages/:chatId", protect, getChatMessages);

export default router;
