"use client";

import { useEffect, useRef, useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import { useChatContext } from "@/context/chatContext";
import { useUserContext } from "@/context/userContext";
import useDetectOutsideClick from "@/hooks/useDetectOutsideClick";
import { send } from "@/utils/icons";

function TextArea() {
  const { selectedChat, sendMessage, activeChatData } = useChatContext();
  const user = useUserContext().user;
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const emojiElemRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [toggleEmoji, setToggleEmoji] = useState(false);

  useDetectOutsideClick(emojiElemRef, setToggleEmoji);

  const handleOnCHange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleToggleEmoji = () => {
    setToggleEmoji(true);
  };

  const autoResize = () => {
    const textArea = textAreaRef.current;

    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = `${textArea.scrollHeight}px`;

      if (textArea.scrollHeight > 350) {
        textArea.style.overflowY = "auto";
        textArea.style.height = "350px";
      } else {
        textArea.style.overflowY = "hidden";
      }
    }
  };

  const addEmoji = (e: any) => {
    const sym = e.unified.split("_");
    const codeArray = sym.map((el: any) => parseInt(el, 16));
    let emoji = String.fromCodePoint(...codeArray);
    setMessage(message + emoji);
  };

  useEffect(() => {
    setToggleEmoji(false);
    setMessage("");
  }, [selectedChat]);

  useEffect(() => {
    autoResize();
  }, [message]);

  return (
    <form
      className="relative flex items-center"
      onSubmit={(e) => {
        e.preventDefault();
        setMessage("");
        sendMessage({
          sender: user?._id,
          receiver: activeChatData?._id,
          content: message,
          chatId: selectedChat?._id,
        });
        setMessage("");
      }}
    >
      <div className="relative flex-1">
        <textarea
          className="textarea w-full px-4 py-3 border-2 rounded-[30px] border-white bg-[#F6F5F9] dark:bg-[#262626] dark:text-gray-100 text-[#12181B] dark:border-[#3C3C3C]/65 shadow-sm resize-none focus:outline-none focus:ring-2 focus:border-transparent focus:ring-[#CCC] focus:ring-opacity-50 transition duration-300 ease-in-out"
          rows={1}
          value={message}
          ref={textAreaRef}
          onChange={handleOnCHange}
        />
        <button
          type="button"
          className="absolute top-[22px] right-3 text-[#AAA] translate-y-[-50%] text-2xl"
          onClick={handleToggleEmoji}
        >
          😊
        </button>
        {!message && (
          <span className="absolute text-sm top-[46%] left-4 text-[#AAA] translate-y-[-50%] pointer-events-none">
            Tapez un message...
          </span>
        )}
      </div>
      <button
        type="submit"
        disabled={!message || !message.trim()}
        className="px-4 self-start py-2 w-12 h-12 bg-[#7263F3] text-white rounded-full ml-2 shadow-sm"
      >
        {send}
      </button>
      {toggleEmoji && (
        <div ref={emojiElemRef} className="absolute right-0 bottom-[72px] z-10">
          <Picker
            data={data}
            locale="fr"
            theme="light"
            onEmojiSelect={addEmoji}
          />
        </div>
      )}
    </form>
  );
}

export default TextArea;
