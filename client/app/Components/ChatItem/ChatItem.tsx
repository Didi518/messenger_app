"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import { useChatContext } from "@/context/chatContext";
import { useUserContext } from "@/context/userContext";
import { IMessage, IUser } from "@/types/types";
import { readReceipts } from "@/utils/icons";

import { formatDateBasedOnTime } from "../../../utils/dates";

interface ChatItemProps {
  user: IUser;
  active: boolean;
  onClick: () => void;
  chatId: string;
}

function ChatItem({ user, active, onClick, chatId }: ChatItemProps) {
  const userId = useUserContext().user._id;
  const { fetchAllMessages, onlineUsers } = useChatContext();
  const { photo } = user;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const isUserOnline = onlineUsers?.find(
    (onlineUser: IUser) => onlineUser._id === user._id
  );

  const allMessages = useCallback(async () => {
    const res = await fetchAllMessages(chatId);

    if (res) {
      setMessages(res);
    }
  }, [fetchAllMessages, chatId, setMessages]);

  useEffect(() => {
    allMessages();
  }, [chatId, allMessages]);

  const lastMessage = messages[messages.length - 1];

  return (
    <div
      className={`px-4 py-3 flex gap-2 items-center border-b-2 border-white dark:border-[#3C3C3C]/65 cursor-pointer ${
        active ? "bg-blue-100 dark:bg-white/5" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative inline-block">
        <Image
          src={photo}
          alt="Image de profil"
          width={50}
          height={50}
          className="rounded-full aspect-square object-cover border-2 border-white dark:border-[#3C3C3C]/65 cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out"
        />
        <div
          className={`absolute bottom-0 right-0 w-[13px] h-[13px] rounded-full border-white border-2 ${
            isUserOnline ? "bg-green-500" : "bg-red-500"
          }`}
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">{user.name}</h4>
          <p className="text-[#AAA] text-sm">
            {formatDateBasedOnTime(lastMessage?.createdAt)}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-[#AAA]">
            {lastMessage?.sender === userId
              ? "Vous: " +
                (lastMessage?.content.length > 20
                  ? lastMessage?.content.substring(0, 20) + "..."
                  : lastMessage?.content)
              : lastMessage?.content.length > 25
              ? lastMessage?.content.substring(0, 25) + "..."
              : lastMessage?.content || "Aucun message"}
          </p>
          {lastMessage?.sender === userId ? (
            <div className="text-[#7263F3]">{readReceipts}</div>
          ) : (
            <div className="flex items-center justify-center w-[4px] h-[4px] bg-red-500 rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatItem;
